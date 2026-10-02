'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

export interface FatherhoodPrepProps {
  className?: string;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  isShocked?: boolean;
  textureUrl?: string;
  glowColor?: string | number;
  auraColor?: string | number;
  interactive?: boolean;
  /** Pass a label if the planet carries meaning. Leave it out when it is purely decorative. */
  ariaLabel?: string;
}

const PLANET_TEXTURE = '/programs/Fatherhood-Prep-planet.png';
const FLAT_SVG = '/programs/Fatherhood-Prep.svg';
const FLAT_PNG = '/programs/Fatherhood-Prep.png';

const PLANET_RADIUS = 1.8;
const BASE_ROTATION_SPEED = 0.35;

// Shared vertex shader for both glow shells
const GLOW_VERTEX_SHADER = `
  varying vec3 vNormal;
  void main() {
    vNormal = normalize(normalMatrix * normal);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const ATMOSPHERE_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  uniform vec3 uGlowColor;
  uniform float uIntensity;
  void main() {
    float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
    float glow = pow(rim, 2.8) * uIntensity;
    gl_FragColor = vec4(uGlowColor, glow * 0.85);
  }
`;

const AURA_FRAGMENT_SHADER = `
  varying vec3 vNormal;
  uniform vec3 uAuraColor;
  uniform float uIntensity;
  void main() {
    float rim = max(0.0, 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))));
    float glow = pow(rim, 3.2) * 0.55 * uIntensity;
    gl_FragColor = vec4(uAuraColor, glow);
  }
`;

/**
 * Frame-rate independent smoothing factor.
 * Replaces "cur += (target - cur) * 0.07" which depends on how often frames run.
 */
const damp = (lambda: number, dt: number) => 1 - Math.exp(-lambda * dt);

function configureTexture(tex: THREE.Texture) {
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
}

/** Returns null instead of throwing when WebGL is unavailable (iOS context limit, blocked GPU, etc.) */
function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer | null {
  const isMobileDevice =
    typeof window !== 'undefined' &&
    (window.innerWidth < 768 || 'ontouchstart' in window);
  try {
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: !isMobileDevice,
      powerPreference: 'default', // 'high-performance' gives no benefit on iPhone
    });
    // Cap at 1.3 on mobile, 2 on desktop
    renderer.setPixelRatio(
      isMobileDevice
        ? Math.min(window.devicePixelRatio || 1, 1.3)
        : Math.min(window.devicePixelRatio || 1, 2)
    );
    return renderer;
  } catch (err) {
    console.warn('FatherhoodPrep: WebGL unavailable, showing static fallback.', err);
    return null;
  }
}

export default function FatherhoodPrep({
  className = 'w-full h-full',
  mouseX,
  mouseY,
  isShocked = false,
  textureUrl = PLANET_TEXTURE,
  glowColor = 0x818cf8,
  auraColor = 0x6366f1,
  interactive = true,
  ariaLabel,
}: FatherhoodPrepProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isShockedRef = useRef(isShocked);
  const mouseXRef = useRef(mouseX);
  const mouseYRef = useRef(mouseY);
  const [webglFailed, setWebglFailed] = useState(false);

  // Resolve to the seamless 360-degree equirectangular planet texture
  const resolvedTextureUrl =
    !textureUrl || textureUrl === FLAT_SVG || textureUrl === FLAT_PNG
      ? PLANET_TEXTURE
      : textureUrl;

  // Keep refs in sync without re-creating the Three.js scene
  useEffect(() => {
    isShockedRef.current = isShocked;
  }, [isShocked]);

  useEffect(() => {
    mouseXRef.current = mouseX;
    mouseYRef.current = mouseY;
  }, [mouseX, mouseY]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // 1. Renderer first, so a failure exits before anything else is allocated
    const renderer = createRenderer(canvas);
    if (!renderer) {
      setWebglFailed(true);
      return;
    }

    let disposed = false;
    let fallbackTexture: THREE.Texture | null = null;

    // 2. Scene + camera fitted so planetary sphere and outer aura never clip
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.set(0, 0, 5.85);

    const isMobileDevice =
      typeof window !== 'undefined' &&
      (window.innerWidth < 768 || 'ontouchstart' in window);

    // 3. Planet sphere (~20k triangles, trivial for phone GPUs)
    const sphereSegments = isMobileDevice ? 36 : 64;
    const sphereGeometry = new THREE.SphereGeometry(PLANET_RADIUS, sphereSegments, sphereSegments);

    // GPU memory = width x height x 4 bytes (+ ~33% for mipmaps).
    // Aim for 2048x1024 for a ~360px orb; 4096x2048 costs ~43MB and risks iOS killing the tab.
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      resolvedTextureUrl,
      undefined,
      undefined,
      (err) => {
        console.warn('Error loading Fatherhood Prep texture, fallback to svg:', err);
        textureLoader.load(FLAT_SVG, (fallbackTex) => {
          if (disposed) {
            fallbackTex.dispose();
            return;
          }
          configureTexture(fallbackTex);
          fallbackTexture = fallbackTex;
          planetMaterial.map = fallbackTex;
          planetMaterial.needsUpdate = true;
        });
      }
    );
    configureTexture(texture);

    // Unlit surface. toneMapped=false keeps the exact texture colors.
    const planetMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      toneMapped: false,
    });
    const planetMesh = new THREE.Mesh(sphereGeometry, planetMaterial);

    // 6. Hierarchy: axial tilt group inside the master orb group
    const axialTiltGroup = new THREE.Group();
    axialTiltGroup.rotation.z = 0.38;
    axialTiltGroup.rotation.x = 0.12;
    axialTiltGroup.add(planetMesh);

    const orbGroup = new THREE.Group();
    orbGroup.add(axialTiltGroup);
    scene.add(orbGroup);

    // 7. Resize (also fires on phone rotation and iOS address-bar changes)
    const handleResize = () => {
      const width = container.clientWidth || 360;
      const height = container.clientHeight || 360;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };
    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 8. Respect prefers-reduced-motion (stops idle spin; user can still drag)
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduceMotion = motionQuery.matches;
    const onMotionChange = (e: MediaQueryListEvent) => {
      reduceMotion = e.matches;
    };
    motionQuery.addEventListener('change', onMotionChange);

    // 9. Physics state
    let currentSpinVelocity = 0;
    let pitchVelocity = 0;
    let curTiltX = 0;
    let curTiltY = 0;
    let curShockScale = 1.0;
    let curGlowIntensity = 1.0;

    // Pointer tracking & drag state
    let localMouseX = 0;
    let localMouseY = 0;
    let isDragging = false;
    let lastPointerX = 0;
    let lastPointerY = 0;

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      lastPointerX = e.clientX;
      lastPointerY = e.clientY;
      try {
        container.setPointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      localMouseX = (e.clientX - cx) / (rect.width / 2);
      localMouseY = (e.clientY - cy) / (rect.height / 2);

      if (isDragging) {
        const dx = e.clientX - lastPointerX;
        const dy = e.clientY - lastPointerY;
        lastPointerX = e.clientX;
        lastPointerY = e.clientY;

        planetMesh.rotation.y += dx * 0.007;
        currentSpinVelocity = dx * 0.007;

        axialTiltGroup.rotation.x = Math.max(
          -0.5,
          Math.min(0.5, axialTiltGroup.rotation.x + dy * 0.004)
        );
        pitchVelocity = dy * 0.004;
      }
    };

    // Also handles pointercancel, which the browser fires when it takes over a vertical scroll
    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch {}
    };

    const onPointerLeave = () => {
      if (!isDragging) {
        localMouseX = 0;
        localMouseY = 0;
      }
    };

    if (interactive) {
      container.addEventListener('pointerdown', onPointerDown);
      container.addEventListener('pointermove', onPointerMove);
      container.addEventListener('pointerup', onPointerUp);
      container.addEventListener('pointercancel', onPointerUp);
      container.addEventListener('pointerleave', onPointerLeave);
    }

    // 10. Render loop that only runs while the orb is on screen and the tab is visible
    let animationFrameId = 0;
    let running = false;
    let inView = false;
    let tabVisible = !document.hidden;
    let lastTime = 0;

    const animate = (now: number) => {
      if (!running) return;
      animationFrameId = requestAnimationFrame(animate);

      // Seconds since last frame, clamped so a long pause never causes a jump
      const delta = Math.min(Math.max((now - lastTime) / 1000, 0), 0.1);
      lastTime = now;

      let normX = localMouseX;
      let normY = localMouseY;

      const mvX = mouseXRef.current;
      const mvY = mouseYRef.current;
      if (mvX && mvY) {
        const mx = mvX.get();
        const my = mvY.get();
        if (mx !== 0 || my !== 0) {
          normX = Math.max(-1, Math.min(1, mx / 380));
          normY = Math.max(-1, Math.min(1, my / 380));
        }
      }

      if (!isDragging) {
        // exp(-3.7 * dt) matches the old 0.94-per-frame decay at 60fps
        const decay = Math.exp(-3.7 * delta);
        currentSpinVelocity *= decay;
        pitchVelocity *= decay;

        axialTiltGroup.rotation.x += pitchVelocity * 60 * delta;

        const baseSpeed = reduceMotion ? 0 : BASE_ROTATION_SPEED;
        planetMesh.rotation.y += (baseSpeed + currentSpinVelocity * 60) * delta;
      }

      const MAX_TILT = 0.22;
      const targetTiltY = normX * MAX_TILT;
      const targetTiltX = -normY * MAX_TILT;

      curTiltX += (targetTiltX - curTiltX) * damp(4.4, delta);
      curTiltY += (targetTiltY - curTiltY) * damp(4.4, delta);

      const targetShock = isShockedRef.current ? 1.08 : 1.0;
      curShockScale += (targetShock - curShockScale) * damp(9, delta);

      orbGroup.rotation.x = curTiltX;
      orbGroup.rotation.y = curTiltY;
      orbGroup.position.set(0, 0, 0);
      orbGroup.scale.setScalar(curShockScale);

      renderer.render(scene, camera);
    };

    const start = () => {
      if (running) return;
      running = true;
      lastTime = performance.now(); // discard the time spent paused
      animationFrameId = requestAnimationFrame(animate);
    };

    const stop = () => {
      running = false;
      cancelAnimationFrame(animationFrameId);
    };

    const sync = () => (inView && tabVisible ? start() : stop());

    // rootMargin starts the loop slightly before the orb scrolls into view
    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        inView = entries[entries.length - 1].isIntersecting;
        sync();
      },
      { rootMargin: '100px' }
    );
    intersectionObserver.observe(container);

    const onVisibilityChange = () => {
      tabVisible = !document.hidden;
      sync();
    };
    document.addEventListener('visibilitychange', onVisibilityChange);

    // 11. Cleanup
    return () => {
      disposed = true;
      stop();
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', onVisibilityChange);
      motionQuery.removeEventListener('change', onMotionChange);
      resizeObserver.disconnect();

      if (interactive) {
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerup', onPointerUp);
        container.removeEventListener('pointercancel', onPointerUp);
        container.removeEventListener('pointerleave', onPointerLeave);
      }

      sphereGeometry.dispose();
      planetMaterial.dispose();
      texture.dispose();
      fallbackTexture?.dispose();

      // No forceContextLoss(): the canvas is reused when this effect re-runs,
      // and a killed context can leave it blank. dispose() is enough.
      renderer.dispose();
    };
  }, [resolvedTextureUrl, glowColor, auraColor, interactive]);

  const canDrag = interactive && !webglFailed;

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none ${
        canDrag ? 'cursor-grab active:cursor-grabbing touch-pan-y' : 'pointer-events-none'
      } ${className}`}
    >
      {webglFailed ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={FLAT_SVG}
          alt={ariaLabel ?? ''}
          aria-hidden={ariaLabel ? undefined : true}
          draggable={false}
          className="w-full h-full object-contain"
        />
      ) : (
        <canvas
          ref={canvasRef}
          className="w-full h-full block"
          role={ariaLabel ? 'img' : undefined}
          aria-label={ariaLabel}
          aria-hidden={ariaLabel ? undefined : true}
        />
      )}
    </div>
  );
}

export { FatherhoodPrep as FatherhoodPrepThreeCircle };