/**
 * Persistent Browser Cache & Memory Cache for Image Sequences
 *
 * Layer 1: In-memory Map (survives client-side page navigation with 0ms overhead)
 * Layer 2: Browser Cache Storage API (persists on user's disk across refreshes & revisits)
 * Layer 3: Network fetch with force-cache and concurrency pooling
 */

const CACHE_NAME = 'joyzen-image-sequence-v1';

// Global memory cache surviving client-side navigations
const memoryCache = new Map<string, HTMLImageElement>();
const inFlightPromises = new Map<string, Promise<HTMLImageElement>>();

/**
 * Check if the browser Cache Storage API is available in the current environment
 */
const hasCacheStorage = (): boolean =>
  typeof window !== 'undefined' && 'caches' in window;

/**
 * Load a single image with two-layer caching:
 * 1. Checks memory cache
 * 2. Checks browser Cache Storage (disk)
 * 3. Falls back to network fetch, then saves to Cache Storage & memory
 */
export async function getCachedImage(url: string): Promise<HTMLImageElement> {
  // Layer 1: Memory cache hit
  const cached = memoryCache.get(url);
  if (cached && cached.naturalWidth > 0) return cached;

  // Deduplicate in-flight requests for the exact same URL
  const inFlight = inFlightPromises.get(url);
  if (inFlight) return inFlight;

  const loadPromise = (async () => {
    try {
      let blob: Blob | null = null;

      // Layer 2: Check persistent browser Cache Storage
      if (hasCacheStorage()) {
        try {
          const cache = await caches.open(CACHE_NAME);
          const match = await cache.match(url);
          if (match) {
            blob = await match.blob();
          } else {
            // Layer 3: Fetch with force-cache and store into persistent Cache Storage
            const response = await fetch(url, { cache: 'force-cache' });
            if (response.ok) {
              await cache.put(url, response.clone());
              blob = await response.blob();
            }
          }
        } catch {
          // If Cache Storage has quota or security restrictions, fallback silently
        }
      }

      // If Cache Storage was unavailable or yielded no blob, fetch directly
      if (!blob) {
        const response = await fetch(url, { cache: 'force-cache' });
        blob = await response.blob();
      }

      // Convert Blob to HTMLImageElement
      const objectUrl = URL.createObjectURL(blob);
      const img = new Image();
      img.src = objectUrl;

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error(`Failed to decode image from blob: ${url}`));
      });

      // Save decoded image into memory cache for instant future lookups
      memoryCache.set(url, img);
      return img;
    } catch {
      // Graceful fallback: load directly via new Image()
      const fallbackImg = new Image();
      fallbackImg.src = url;
      await new Promise<void>((resolve) => {
        fallbackImg.onload = () => resolve();
        fallbackImg.onerror = () => resolve();
      });
      if (fallbackImg.naturalWidth > 0) {
        memoryCache.set(url, fallbackImg);
      }
      return fallbackImg;
    } finally {
      inFlightPromises.delete(url);
    }
  })();

  inFlightPromises.set(url, loadPromise);
  return loadPromise;
}

/**
 * Synchronous check if all given URLs are already resident in memory
 */
export function areFramesInMemory(urls: string[]): boolean {
  if (urls.length === 0) return false;
  return urls.every((url) => {
    const img = memoryCache.get(url);
    return Boolean(img && img.naturalWidth > 0);
  });
}

/**
 * Retrieve all frames from memory if all are present, otherwise return null
 */
export function getFramesFromMemory(urls: string[]): HTMLImageElement[] | null {
  if (!areFramesInMemory(urls)) return null;
  return urls.map((url) => memoryCache.get(url)!);
}

export interface PreloadSequenceOptions {
  concurrency?: number;
  onProgress?: (loaded: number, total: number) => void;
  onFirstFrame?: (img: HTMLImageElement) => void;
  signal?: AbortSignal;
}

/**
 * Preload an array of frame URLs with concurrency pooling and progress notifications
 */
export async function preloadFrameSequence(
  urls: string[],
  options?: PreloadSequenceOptions
): Promise<HTMLImageElement[]> {
  const total = urls.length;
  if (total === 0) return [];

  // If already resident in memory, return immediately
  const memoryFrames = getFramesFromMemory(urls);
  if (memoryFrames) {
    options?.onFirstFrame?.(memoryFrames[0]);
    options?.onProgress?.(total, total);
    return memoryFrames;
  }

  const concurrency = options?.concurrency ?? 8;
  const results: HTMLImageElement[] = new Array(total);
  let loadedCount = 0;
  let currentIndex = 0;

  // Immediate first-frame preview if available
  const firstCached = memoryCache.get(urls[0]);
  if (firstCached && firstCached.naturalWidth > 0) {
    options?.onFirstFrame?.(firstCached);
  }

  return new Promise<HTMLImageElement[]>((resolve) => {
    let completed = false;

    const worker = async () => {
      while (currentIndex < total && !completed && !options?.signal?.aborted) {
        const index = currentIndex++;
        const url = urls[index];

        try {
          const img = await getCachedImage(url);
          results[index] = img;

          if (index === 0 && !firstCached && img.naturalWidth > 0) {
            options?.onFirstFrame?.(img);
          }
        } catch {
          // Continue with remaining frames even if single frame fails
        }

        loadedCount++;
        options?.onProgress?.(loadedCount, total);

        if (loadedCount >= total) {
          completed = true;
          resolve(results);
          return;
        }
      }

      if (loadedCount >= total && !completed) {
        completed = true;
        resolve(results);
      }
    };

    const workerCount = Math.min(concurrency, total);
    for (let i = 0; i < workerCount; i++) {
      worker();
    }
  });
}
