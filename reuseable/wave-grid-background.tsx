"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { cn } from "@/lib/utils";

/**
 * 3D Honeycomb Background with Dynamic Moving Gradient
 * An interactive grid of instanced hexagons that float up where hovered.
 *
 * OPTIMISED, SAME LOOK AND BEHAVIOUR:
 *  - The expensive "spirit" displacement maths now runs ONCE PER HEXAGON in a tiny
 *    GPU pass (N x N texels) instead of once per VERTEX (about 15 vertices per hexagon
 *    all computed the same value). The vertex shader just reads the result.
 *  - Bottom cap (always back-face culled) is removed from the index buffer.
 *  - No per-frame allocations (Color objects, raycast mesh), no duplicate listeners,
 *    no redundant renderer.setSize on resize, no WebGL context rebuild on colour change.
 */

const MAX_TRAIL = 128;

// ─────────────────────────────────────────────────────────────────────────────
// GLSL
// ─────────────────────────────────────────────────────────────────────────────

/** Identical noise + shaping maths to the original, now used only in the compute pass. */
const SPIRIT_COMPUTE_FRAGMENT = /* glsl */ `
  uniform sampler2D uTrailTexture;
  uniform int   uTrailCount;
  uniform float uWaveWidth;
  uniform float uFadeTime;
  uniform float uAmplitude;
  uniform float uMaxHeight;
  uniform float uTime;
  uniform float uHoriz;
  uniform float uVert;
  uniform float uOffX;
  uniform float uOffZ;

  vec2 spiritHash2( vec2 p ) {
    vec3 p3 = fract(vec3(p.xyx) * vec3(443.897, 441.423, 437.195));
    p3 += dot(p3, p3.yzx + 19.19);
    return fract((p3.xx + p3.yz) * p3.zy) * 2.0 - 1.0;
  }

  float spiritNoise2D( vec2 p ) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix( dot( spiritHash2( i + vec2(0.0, 0.0) ), f - vec2(0.0, 0.0) ),
           dot( spiritHash2( i + vec2(1.0, 0.0) ), f - vec2(1.0, 0.0) ), u.x ),
      mix( dot( spiritHash2( i + vec2(0.0, 1.0) ), f - vec2(0.0, 1.0) ),
           dot( spiritHash2( i + vec2(1.0, 1.0) ), f - vec2(1.0, 1.0) ), u.x ),
      u.y
    );
  }

  float spiritFBM( vec2 p ) {
    float v = 0.0;
    v += 0.520 * spiritNoise2D( p ); p = p * 2.02 + vec2(1.7, 3.2);
    v += 0.280 * spiritNoise2D( p ); p = p * 2.03 + vec2(2.3, 1.1);
    v += 0.140 * spiritNoise2D( p );
    return v;
  }

  void main() {
    // One texel = one hexagon. texel (x, y) = grid column j, row i.
    vec2 cell = floor( gl_FragCoord.xy );
    vec2 worldXZ = vec2(
      cell.x * uHoriz + mod( cell.y, 2.0 ) * ( uHoriz * 0.5 ) - uOffX,
      cell.y * uVert - uOffZ
    );

    float peak = 0.0;
    float t = uTime * 1.3;

    for ( int i = 0; i < ${MAX_TRAIL}; i++ ) {
      if ( i >= uTrailCount ) break;

      vec4 td = texture2D( uTrailTexture, vec2( ( float(i) + 0.5 ) / ${MAX_TRAIL}.0, 0.5 ) );
      vec2 center = td.rg;
      float age   = td.b;
      float strength = td.a;

      vec2 toPoint = worldXZ - center;

      vec2 warp1 = vec2(
        spiritFBM( toPoint * 0.85 + vec2(t * 0.35, -t * 0.25) ),
        spiritFBM( toPoint * 0.85 + vec2(-t * 0.30, t * 0.28) + vec2(4.1, 2.7) )
      );
      vec2 warped = toPoint + warp1 * ( uWaveWidth * 0.65 );

      vec2 curved = vec2(
        warped.x * 0.86 - warped.y * 0.50,
        warped.x * 0.50 + warped.y * 0.86
      );
      curved.x += sin( curved.y * 1.8 - t * 0.8 ) * 0.35 * uWaveWidth;

      float angle = atan( curved.y, curved.x );
      float tendril = sin( angle * 2.0 + t * 1.1 ) * 0.38
                    + cos( angle * 3.0 - t * 0.9 + 1.4 ) * 0.26
                    + sin( angle * 5.0 + t * 1.7 ) * 0.16;

      float shapeDist = sqrt( curved.x * curved.x * 1.45 + curved.y * curved.y * 0.75 );
      float spiritRadius = uWaveWidth * ( 1.0 + tendril * 0.7 );
      float normDist = shapeDist / max( spiritRadius, 0.001 );

      float filament = abs( spiritFBM( curved * 1.8 + vec2(0.0, -t * 0.7) ) );
      filament = pow( 1.0 - clamp(filament, 0.0, 1.0), 2.0 );

      float envelope = exp( -pow( normDist * 1.35, 2.4 ) );
      float spiritHeight = envelope * ( 0.60 + 0.60 * filament );

      float fade = exp( -age / uFadeTime );
      float h = fade * spiritHeight * strength;

      if ( h > peak ) peak = h;
    }

    float displacement = clamp( peak * uAmplitude, 0.0, uMaxHeight );

    // Pack 0..uMaxHeight into 16 bits (two 8-bit channels). Works on every WebGL
    // device (no float render-target extension needed); error is ~7e-6 world units.
    float v  = floor( displacement / max( uMaxHeight, 1e-6 ) * 65535.0 + 0.5 );
    float hi = floor( v / 256.0 );
    float lo = v - hi * 256.0;
    gl_FragColor = vec4( hi / 255.0, lo / 255.0, 0.0, 1.0 );
  }
`;

const SPIRIT_COMPUTE_VERTEX = /* glsl */ `
  void main() {
    gl_Position = vec4( position.xy, 0.0, 1.0 );
  }
`;

/** Main material vertex patch: just reads the precomputed displacement. */
function patchVertexShader(vertexShader: string): string {
    return vertexShader
        .replace(
            "#include <common>",
      /* glsl */ `#include <common>
      varying float vHeight;
      varying vec2  vWorldXZ;
      attribute vec2 aOffset;
      attribute vec2 aCell;
      uniform sampler2D uDispTex;
      uniform float     uGrid;
      uniform float     uMaxHeight;`,
        )
        .replace(
            "#include <begin_vertex>",
      /* glsl */ `#include <begin_vertex>

      vHeight = 0.0;
      vWorldXZ = aOffset;

      if ( position.y > 0.0 ) {
        vec4 dt = texture2D( uDispTex, ( aCell + 0.5 ) / uGrid );
        float displacement = ( floor( dt.r * 255.0 + 0.5 ) * 256.0 + floor( dt.g * 255.0 + 0.5 ) )
                           / 65535.0 * uMaxHeight;
        transformed.y += displacement;
        vHeight = displacement;
      }`,
        );
}

export interface WaveGridBackgroundProps {
    /** Content rendered on top of the animated background. */
    children?: React.ReactNode;
    /** Extra classes for the wrapper element. */
    className?: string;
    /** Grid resolution (N×N hexagons). Defaults to 34 (desktop) / 20 (mobile). */
    gridSize?: number;
    /** Base hexagon color. Defaults to #FFFFFF. */
    colorBase?: string;
    /** Glow/hover color. Defaults to #F4A27E. */
    colorHigh?: string;
    /** Peak displacement multiplier. Defaults to 0.4. */
    waveAmplitude?: number;
    /** Wavefront expansion speed. Defaults to 6. */
    waveSpeed?: number;
    /** Spatial oscillation frequency. Defaults to 1.2. */
    waveFrequency?: number;
    /** Width radius of the localized hover float dome. Defaults to 1.6. */
    waveWidth?: number;
    /** Hard clamp on displacement height. Defaults to 0.45. */
    waveMaxHeight?: number;
    /** Positional jitter. Defaults to 0.0. */
    waveJitter?: number;
    /** Emit gentle random ripples while the cursor is idle. Defaults to false. */
    autoAnimate?: boolean;
    /** Render a vibrant, hardware-accelerated pastel moving gradient behind the 3D honeycomb. Defaults to false. */
    movingGradient?: boolean;
    /** Transparent canvas background instead of solid colorBase. Defaults to false (or true when movingGradient is active). */
    transparent?: boolean;
    /** Optional post-processing flag (deprecated). */
    vignette?: boolean;
    /** Optional liquid effect flag (deprecated). */
    liquidEffect?: boolean;
    /** Intensity multiplier (deprecated). */
    liquidIntensity?: number;
}

export function WaveGridBackground({
    children,
    className,
    gridSize = 34,
    colorBase = "#FFFFFF",
    colorHigh = "#F4A27E",
    waveAmplitude = 0.4,
    waveSpeed = 6.0,
    waveFrequency = 1.2,
    waveWidth = 1.6,
    waveMaxHeight = 0.45,
    waveJitter = 0.0,
    autoAnimate = false,
    movingGradient = false,
    transparent = false,
}: WaveGridBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    /** Set by the main effect; lets prop changes redraw without rebuilding WebGL. */
    const wakeRef = useRef<(() => void) | null>(null);

    const isTransparent = transparent || movingGradient;

    const propsRef = useRef({
        colorBase,
        colorHigh,
        waveAmplitude,
        waveSpeed,
        waveFrequency,
        waveWidth,
        waveMaxHeight,
        waveJitter,
        autoAnimate,
        movingGradient,
        transparent: isTransparent,
    });

    // Keep live props in a ref and wake the (possibly sleeping) loop when they change.
    useEffect(() => {
        propsRef.current = {
            colorBase,
            colorHigh,
            waveAmplitude,
            waveSpeed,
            waveFrequency,
            waveWidth,
            waveMaxHeight,
            waveJitter,
            autoAnimate,
            movingGradient,
            transparent: isTransparent,
        };
        wakeRef.current?.();
    }, [
        colorBase,
        colorHigh,
        waveAmplitude,
        waveSpeed,
        waveFrequency,
        waveWidth,
        waveMaxHeight,
        waveJitter,
        autoAnimate,
        movingGradient,
        isTransparent,
    ]);

    // WebGL is only rebuilt when the scene structure changes (not for colours).
    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        // ── Device Detection ─────────────────────────────────────────────────────
        const isMobile =
            typeof window !== "undefined" &&
            (window.innerWidth <= 768 ||
                window.matchMedia("(max-width: 768px)").matches ||
                window.matchMedia("(pointer: coarse)").matches ||
                "ontouchstart" in window);

        // 400 instances on mobile vs 1156 on desktop
        const effectiveGridSize = isMobile ? Math.min(gridSize, 20) : gridSize;

        const hexRadius = 0.45;
        const cubeHeight = 2.2;
        const gap = 0.007;
        const bounds = effectiveGridSize * (Math.sqrt(3) * hexRadius + gap);

        // ── Sizes & DPR Capping ──────────────────────────────────────────────────
        const getSize = () => ({
            width: container.clientWidth || 1,
            height: container.clientHeight || 1,
            pixelRatio: isMobile ? 1.0 : Math.min(window.devicePixelRatio || 1, 1.35),
        });
        let size = getSize();

        const initial = propsRef.current;

        // ── Scene ────────────────────────────────────────────────────────────────
        const scene = new THREE.Scene();
        const backgroundColor = new THREE.Color(initial.colorBase);
        scene.background = isTransparent ? null : backgroundColor;

        // ── Camera ───────────────────────────────────────────────────────────────
        const radius = 12;
        const alphaRange = Math.PI * 0.025;
        const betaRange = Math.PI * 0.045;
        const mouse = new THREE.Vector2(0, 0);
        const lerpedMouse = new THREE.Vector2(0, 0);

        const camera = new THREE.PerspectiveCamera(40, size.width / size.height, 0.1, 150);
        const positionCamera = (mx: number, my: number) => {
            const alpha = my * alphaRange;
            const beta = mx * betaRange;
            camera.position.set(
                -radius * Math.cos(alpha) * Math.sin(beta),
                radius * Math.cos(alpha) * Math.cos(beta),
                radius * Math.sin(alpha),
            );
            camera.up.set(0, 0, -1);
            camera.lookAt(0, 0, 0);
        };
        positionCamera(0, 0);
        scene.add(camera);

        // ── Lighting ───────────────────────────────────────────────────────────
        scene.add(new THREE.AmbientLight("#ffffff", isTransparent ? 2.5 : 2.2));

        const keyLight = new THREE.DirectionalLight("#ffffff", isTransparent ? 1.9 : 1.6);
        keyLight.position.set(-20, 15, 8);
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight("#ffffff", 0.7);
        fillLight.position.set(10, 5, -3);
        scene.add(fillLight);

        // ── Mouse trail (world-space hover sources) ───────────────────────────
        const trailData = new Float32Array(MAX_TRAIL * 4);
        const trailTexture = new THREE.DataTexture(
            trailData,
            MAX_TRAIL,
            1,
            THREE.RGBAFormat,
            THREE.FloatType,
        );
        trailTexture.needsUpdate = true;

        // Shared uniform objects (the compute pass and main material reference the same ones).
        const sharedUniforms = {
            uTrailTexture: { value: trailTexture },
            uTrailCount: { value: 0 },
            uFadeTime: { value: 0.75 },
            uWaveWidth: { value: initial.waveWidth },
            uAmplitude: { value: initial.waveAmplitude },
            uMaxHeight: { value: initial.waveMaxHeight },
            uTime: { value: 0 },
        };
        const colorUniforms = {
            uColorBase: { value: new THREE.Color(initial.colorBase) },
            uColorHigh: { value: new THREE.Color(initial.colorHigh) },
            uMovingGradient: { value: initial.movingGradient ? 1.0 : 0.0 },
        };
        let appliedBase = initial.colorBase;
        let appliedHigh = initial.colorHigh;

        const trail: { x: number; z: number; age: number; distDelta: number }[] = [];
        let currentHover: { x: number; z: number } | null = null;
        let timeSinceLastMove = 0;
        let randomPointTimer = 0;
        let placingRandom = false;
        const fadeTime = 0.75;
        const trailSpacing = 0.12;

        // Analytic ground-plane hit (replaces raycasting against an invisible mesh).
        const groundPlane = new THREE.Plane(new THREE.Vector3(0, 1, 0), 0);
        const hitPoint = new THREE.Vector3();
        const planeHalfExtent = bounds * 0.75; // same area as the old PlaneGeometry(bounds*1.5)
        const raycaster = new THREE.Raycaster();
        const pointerNDC = new THREE.Vector2();

        // ── Grid layout ─────────────────────────────────────────────────────────
        const N = effectiveGridSize;
        const count = N * N;
        const horizSpacing = Math.sqrt(3) * hexRadius + gap;
        const vertSpacing = 1.5 * hexRadius + gap * 0.75;
        const offsetX = ((N - 1) * horizSpacing) / 2;
        const offsetZ = ((N - 1) * vertSpacing) / 2;

        // ── Geometry (bottom cap removed: it is always back-face culled) ───────
        const geometry = new THREE.CylinderGeometry(hexRadius, hexRadius, cubeHeight, 6);
        if (geometry.index && geometry.groups.length === 3) {
            // groups: [0] torso, [1] top cap, [2] bottom cap
            const keep = geometry.groups[1].start + geometry.groups[1].count;
            geometry.setIndex(new THREE.BufferAttribute(geometry.index.array.slice(0, keep), 1));
            geometry.clearGroups();
        }

        const offsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(count * 2), 2);
        const cellAttribute = new THREE.InstancedBufferAttribute(new Float32Array(count * 2), 2);
        geometry.setAttribute("aOffset", offsetAttribute);
        geometry.setAttribute("aCell", cellAttribute);

        // ── Direct WebGL Renderer ─────────────────────────────────────────────
        let renderer: THREE.WebGLRenderer;
        try {
            renderer = new THREE.WebGLRenderer({
                canvas,
                antialias: !isMobile,
                alpha: true,
                powerPreference: "default",
            });
        } catch (err) {
            console.warn("WaveGridBackground: WebGL context creation failed or WebGL unavailable.", err);
            geometry.dispose();
            trailTexture.dispose();
            return;
        }

        renderer.toneMapping = THREE.NoToneMapping;
        renderer.shadowMap.enabled = false;
        if (isTransparent) {
            renderer.setClearColor(0x000000, 0);
        } else {
            renderer.setClearColor(initial.colorBase, 1);
        }
        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(size.pixelRatio);

        // ── Displacement compute pass (N x N texels, one per hexagon) ──────────
        const displacementTarget = new THREE.WebGLRenderTarget(N, N, {
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type: THREE.UnsignedByteType,
            depthBuffer: false,
            stencilBuffer: false,
        });

        const computeMaterial = new THREE.ShaderMaterial({
            vertexShader: SPIRIT_COMPUTE_VERTEX,
            fragmentShader: SPIRIT_COMPUTE_FRAGMENT,
            uniforms: {
                uTrailTexture: sharedUniforms.uTrailTexture,
                uTrailCount: sharedUniforms.uTrailCount,
                uFadeTime: sharedUniforms.uFadeTime,
                uWaveWidth: sharedUniforms.uWaveWidth,
                uAmplitude: sharedUniforms.uAmplitude,
                uMaxHeight: sharedUniforms.uMaxHeight,
                uTime: sharedUniforms.uTime,
                uHoriz: { value: horizSpacing },
                uVert: { value: vertSpacing },
                uOffX: { value: offsetX },
                uOffZ: { value: offsetZ },
            },
            depthTest: false,
            depthWrite: false,
            blending: THREE.NoBlending,
            side: THREE.DoubleSide,
        });
        const computeQuad = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), computeMaterial);
        computeQuad.frustumCulled = false;
        const computeScene = new THREE.Scene();
        computeScene.add(computeQuad);
        const computeCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        let lastComputedCount = -1; // -1 forces the first pass

        // ── Main material ──────────────────────────────────────────────────────
        const material = new THREE.MeshPhongMaterial({
            color: 0xffffff,
            shininess: isTransparent ? 4 : 0,
            specular: isTransparent ? 0x202020 : 0x000000,
            transparent: isTransparent,
            opacity: isTransparent ? 0.92 : 1.0,
        });

        material.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, {
                uDispTex: { value: displacementTarget.texture },
                uGrid: { value: N },
                uMaxHeight: sharedUniforms.uMaxHeight,
                uTime: sharedUniforms.uTime,
                ...colorUniforms,
            });
            shader.vertexShader = patchVertexShader(shader.vertexShader);
            shader.fragmentShader = shader.fragmentShader
                .replace(
                    "#include <common>",
                    `#include <common>
          varying float vHeight;
          varying vec2  vWorldXZ;
          uniform vec3  uColorBase;
          uniform vec3  uColorHigh;
          uniform float uMaxHeight;
          uniform float uTime;
          uniform float uMovingGradient;`,
                )
                .replace(
                    "#include <color_fragment>",
                    `#include <color_fragment>
          float t = clamp( vHeight / max(uMaxHeight, 0.001), 0.0, 1.0 );
          vec3 targetColor = uColorHigh;
          if (uMovingGradient > 0.5) {
            float phase = fract( (vWorldXZ.x * 0.04 + vWorldXZ.y * 0.03) + uTime * 0.06 );
            // Joyzen 4-stop pastel gradient (Coral, Champagne, Lilac, Aqua)
            vec3 c0 = vec3(0.937, 0.561, 0.376); // #EF8F60
            vec3 c1 = vec3(0.976, 0.878, 0.682); // #F9E0AE
            vec3 c2 = vec3(0.867, 0.765, 0.875); // #DDC3DF
            vec3 c3 = vec3(0.682, 0.871, 0.894); // #AEDEE4
            if (phase < 0.25) targetColor = mix(c0, c1, phase * 4.0);
            else if (phase < 0.50) targetColor = mix(c1, c2, (phase - 0.25) * 4.0);
            else if (phase < 0.75) targetColor = mix(c2, c3, (phase - 0.50) * 4.0);
            else targetColor = mix(c3, c0, (phase - 0.75) * 4.0);
          }
          diffuseColor.rgb = mix( uColorBase, targetColor, t );`,
                );
        };

        const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
        instancedMesh.frustumCulled = false; // whole grid is always on screen
        scene.add(instancedMesh);

        const dummy = new THREE.Object3D();
        for (let i = 0; i < N; i++) {
            for (let j = 0; j < N; j++) {
                const index = i * N + j;
                const rowShift = (i % 2) * (horizSpacing / 2);
                const x = j * horizSpacing + rowShift - offsetX;
                const z = i * vertSpacing - offsetZ;

                dummy.position.set(x, 0, z);
                dummy.updateMatrix();
                instancedMesh.setMatrixAt(index, dummy.matrix);
                offsetAttribute.setXY(index, x, z);
                cellAttribute.setXY(index, j, i);
            }
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
        offsetAttribute.needsUpdate = true;
        cellAttribute.needsUpdate = true;

        // ── Trail Logic ────────────────────────────────────────────────────────
        const updateTrail = (delta: number) => {
            if (isMobile && !propsRef.current.autoAnimate) {
                if (sharedUniforms.uTrailCount.value !== 0) {
                    sharedUniforms.uTrailCount.value = 0;
                }
                return;
            }

            const expiry = fadeTime * 2.2;
            for (let i = trail.length - 1; i >= 0; i--) {
                trail[i].age += delta;
                if (trail[i].age > expiry) trail.splice(i, 1);
            }

            if (currentHover && !isMobile) {
                if (trail.length === 0) {
                    trail.push({ x: currentHover.x, z: currentHover.z, age: 0, distDelta: 1.0 });
                } else {
                    const last = trail[trail.length - 1];
                    const dx = currentHover.x - last.x;
                    const dz = currentHover.z - last.z;
                    const distDelta = Math.sqrt(dx * dx + dz * dz);
                    if (distDelta > trailSpacing) {
                        if (trail.length >= MAX_TRAIL) trail.shift();
                        trail.push({ x: currentHover.x, z: currentHover.z, age: 0, distDelta: 1.0 });
                    } else {
                        last.x = currentHover.x;
                        last.z = currentHover.z;
                        last.age = 0;
                    }
                }
            }

            timeSinceLastMove += delta;
            if (timeSinceLastMove >= 3.0 && !placingRandom && propsRef.current.autoAnimate) {
                placingRandom = true;
                randomPointTimer = 0;
            }
            if (placingRandom && propsRef.current.autoAnimate) {
                randomPointTimer += delta;
                if (randomPointTimer >= 1.8) {
                    const x = (Math.random() * 0.5 - 0.25) * bounds;
                    const z = (Math.random() * 0.5 - 0.25) * bounds;
                    if (trail.length >= MAX_TRAIL) trail.shift();
                    trail.push({ x, z, age: 0, distDelta: 0.9 });
                    randomPointTimer = 0;
                }
            }

            const n = Math.min(trail.length, MAX_TRAIL);
            for (let i = 0; i < n; i++) {
                const ti = i * 4;
                trailData[ti] = trail[i].x;
                trailData[ti + 1] = trail[i].z;
                trailData[ti + 2] = trail[i].age;
                trailData[ti + 3] = trail[i].distDelta;
            }
            if (n > 0) trailTexture.needsUpdate = true; // nothing to upload for an empty trail
            sharedUniforms.uTrailCount.value = n;
        };

        // ── Animation Loop with Idle Sleeping ───────────────────────────────────
        const clock = new THREE.Clock();
        let isLoopRunning = false;
        let isIntersecting = true;
        let isPageVisible = typeof document !== "undefined" ? !document.hidden : true;
        let restingFrames = 0;

        const renderFrame = () => {
            const delta = Math.min(clock.getDelta(), 0.1);
            const elapsed = clock.getElapsedTime();
            const p = propsRef.current;

            sharedUniforms.uTime.value = elapsed;
            sharedUniforms.uWaveWidth.value = p.waveWidth;
            sharedUniforms.uAmplitude.value = p.waveAmplitude;
            sharedUniforms.uMaxHeight.value = p.waveMaxHeight;
            colorUniforms.uMovingGradient.value = p.movingGradient ? 1.0 : 0.0;

            // Parse colours only when they actually change (no per-frame allocations).
            if (p.colorBase !== appliedBase) {
                appliedBase = p.colorBase;
                colorUniforms.uColorBase.value.set(appliedBase);
                backgroundColor.set(appliedBase);
            }
            if (p.colorHigh !== appliedHigh) {
                appliedHigh = p.colorHigh;
                colorUniforms.uColorHigh.value.set(appliedHigh);
            }

            updateTrail(delta);

            let mouseSettled = true;
            if (!isMobile) {
                const dx = mouse.x - lerpedMouse.x;
                const dy = mouse.y - lerpedMouse.y;
                lerpedMouse.x += dx * 0.04;
                lerpedMouse.y += dy * 0.04;
                positionCamera(lerpedMouse.x, lerpedMouse.y);
                if (Math.abs(dx) > 0.0004 || Math.abs(dy) > 0.0004) {
                    mouseSettled = false;
                }
            }

            // Displacement pass: only when there is a trail, or one last time to clear it.
            const trailCount = sharedUniforms.uTrailCount.value;
            if (trailCount > 0 || lastComputedCount !== 0) {
                renderer.setRenderTarget(displacementTarget);
                renderer.render(computeScene, computeCamera);
                renderer.setRenderTarget(null);
                lastComputedCount = trailCount;
            }

            renderer.render(scene, camera);

            // ── Idle Sleeping Logic ──────────────────────────────────────────
            if (!p.autoAnimate && !isMobile) {
                const trailEmpty = trail.length === 0 && currentHover === null;
                if (trailEmpty && mouseSettled) {
                    restingFrames++;
                    if (restingFrames > 3) {
                        stopLoop();
                    }
                } else {
                    restingFrames = 0;
                }
            }
        };

        const startLoop = () => {
            if (isLoopRunning || !isIntersecting || !isPageVisible) return;
            isLoopRunning = true;
            clock.start();
            renderer.setAnimationLoop(renderFrame);
        };

        const stopLoop = () => {
            if (!isLoopRunning) return;
            isLoopRunning = false;
            renderer.setAnimationLoop(null);
        };

        // Called when props (colours, amplitude, ...) change while the loop may be asleep.
        wakeRef.current = () => {
            restingFrames = 0;
            if (isMobile && !propsRef.current.autoAnimate) {
                renderFrame();
            } else {
                startLoop();
            }
        };

        // ── Pointer Handler (one listener: camera parallax + hover raycast) ─────
        let lastPointerCheck = 0;
        const onPointerMove = (e: PointerEvent) => {
            mouse.x = (e.clientX / size.width) * 2 - 1;
            mouse.y = -(e.clientY / size.height) * 2 + 1;
            restingFrames = 0;
            startLoop();

            const now = performance.now();
            if (now - lastPointerCheck < 16) return; // throttle raycasting to ~60fps
            lastPointerCheck = now;

            const rect = canvas.getBoundingClientRect();
            pointerNDC.set(
                ((e.clientX - rect.left) / rect.width) * 2 - 1,
                -((e.clientY - rect.top) / rect.height) * 2 + 1,
            );
            raycaster.setFromCamera(pointerNDC, camera);
            if (!raycaster.ray.intersectPlane(groundPlane, hitPoint)) return;
            if (Math.abs(hitPoint.x) > planeHalfExtent || Math.abs(hitPoint.z) > planeHalfExtent) return;

            currentHover = { x: hitPoint.x, z: hitPoint.z };
            timeSinceLastMove = 0;
            placingRandom = false;
            randomPointTimer = 0;
        };

        const onMouseLeave = () => {
            currentHover = null;
        };

        if (!isMobile) {
            window.addEventListener("pointermove", onPointerMove, { passive: true });
            window.addEventListener("mouseleave", onMouseLeave);
        }

        // ── Resize (ignored when nothing actually changed) ─────────────────────
        const applySize = () => {
            const next = getSize();
            if (
                next.width === size.width &&
                next.height === size.height &&
                next.pixelRatio === size.pixelRatio
            ) {
                return;
            }
            size = next;
            camera.aspect = size.width / size.height;
            camera.updateProjectionMatrix();
            renderer.setSize(size.width, size.height);
            renderer.setPixelRatio(size.pixelRatio);

            if (!isLoopRunning) renderFrame();
        };

        const resizeObserver = new ResizeObserver(applySize);
        resizeObserver.observe(container);
        window.addEventListener("resize", applySize);

        // ── Page Visibility & IntersectionObserver ──────────────────────────────
        const onVisibilityChange = () => {
            isPageVisible = !document.hidden;
            if (isPageVisible) {
                startLoop();
            } else {
                stopLoop();
            }
        };
        document.addEventListener("visibilitychange", onVisibilityChange);

        const intersectionObserver = new IntersectionObserver(
            ([entry]) => {
                isIntersecting = entry.isIntersecting;
                if (isIntersecting) {
                    startLoop();
                } else {
                    stopLoop();
                }
            },
            { threshold: 0.05 },
        );
        intersectionObserver.observe(container);

        // ── Initial Start ───────────────────────────────────────────────────────
        if (isMobile && !propsRef.current.autoAnimate) {
            renderFrame();
        } else {
            startLoop();
        }

        return () => {
            wakeRef.current = null;
            stopLoop();
            if (!isMobile) {
                window.removeEventListener("pointermove", onPointerMove);
                window.removeEventListener("mouseleave", onMouseLeave);
            }
            window.removeEventListener("resize", applySize);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            resizeObserver.disconnect();
            intersectionObserver.disconnect();

            geometry.dispose();
            material.dispose();
            computeQuad.geometry.dispose();
            computeMaterial.dispose();
            displacementTarget.dispose();
            trailTexture.dispose();
            renderer.dispose();
        };
        // Colours / amplitude / etc. are applied live via propsRef + wakeRef.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [gridSize, isTransparent]);

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative h-full w-full overflow-hidden select-none",
                !isTransparent && "bg-white",
                className
            )}
        >
            {/* GPU-Hardware-Composited Moving Pastel Gradient Mesh */}
            {movingGradient && (
                <div
                    aria-hidden="true"
                    className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden bg-[#FAF8F5]/40"
                    style={{
                        contain: "strict",
                        transform: "translateZ(0)",
                        WebkitTransform: "translateZ(0)",
                    }}
                >
                    {/* Flowing Full-Spread Base Gradient Sweep */}
                    <div
                        className="absolute -top-[25%] -left-[25%] w-[150%] h-[150%] opacity-60 will-change-transform"
                        style={{
                            backgroundImage:
                                "radial-gradient(ellipse 70% 50% at 20% 30%, rgba(250, 237, 150, 0.45) 0%, rgba(255, 218, 195, 0.35) 40%, transparent 75%), radial-gradient(ellipse 70% 50% at 80% 70%, rgba(174, 222, 243, 0.45) 0%, rgba(221, 195, 223, 0.35) 40%, transparent 75%)",
                            animation: "movingGradMeshSweep 18s ease-in-out infinite alternate",
                        }}
                    />
                    {/* Warm Coral / Peach Ambient Drift Orb */}
                    <div
                        className="absolute top-1/4 -left-20 w-[600px] h-[600px] rounded-full opacity-45 blur-[80px] will-change-transform"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(239, 143, 96, 0.55) 0%, rgba(255, 218, 195, 0.25) 50%, transparent 75%)",
                            animation: "movingGradOrbA 16s ease-in-out infinite alternate",
                        }}
                    />
                    {/* Aqua / Sky Ambient Drift Orb */}
                    <div
                        className="absolute top-1/3 -right-20 w-[620px] h-[620px] rounded-full opacity-45 blur-[80px] will-change-transform"
                        style={{
                            background:
                                "radial-gradient(circle, rgba(174, 222, 243, 0.55) 0%, rgba(221, 195, 223, 0.25) 50%, transparent 75%)",
                            animation: "movingGradOrbB 15s ease-in-out infinite alternate",
                        }}
                    />
                </div>
            )}

            {/* 3D Instanced Hexagons Canvas */}
            <canvas
                ref={canvasRef}
                className={cn(
                    "relative z-0 block h-full w-full pointer-events-none",
                    !isTransparent && "bg-white"
                )}
            />

            {children != null && <div className="absolute inset-0 z-10">{children}</div>}
        </div>
    );
}

export default WaveGridBackground;