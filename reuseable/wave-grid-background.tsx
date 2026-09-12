"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";
import { cn } from "@/lib/utils";

/**
 * 3D Honeycomb Background with Liquid Lotion Overlay Shader
 * An interactive grid of instanced hexagons that float up only where hovered,
 * covered with a viscous glossy liquid/lotion refraction and sheen shader on top.
 */

const MAX_TRAIL = 128;

const LIQUID_LOTION_SHADER = {
    uniforms: {
        tDiffuse: { value: null as THREE.Texture | null },
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uAspect: { value: 1.0 },
        uIntensity: { value: 1.0 },
    },
    vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float uTime;
    uniform vec2  uMouse;
    uniform float uAspect;
    uniform float uIntensity;
    varying vec2  vUv;

    // Smooth viscous lotion fluid height function
    float fluidHeight(vec2 p, float t, vec2 mPos) {
      // Gentle flowing viscous lotion ripples
      float w1 = sin(p.x * 4.5 + t * 0.8) * cos(p.y * 4.0 + t * 0.6);
      float w2 = sin(p.y * 6.5 - t * 0.7 + w1 * 1.5) * cos(p.x * 5.5 + t * 0.5);
      float h = (w1 + w2 * 0.5) * 0.028;

      // Cursor spirit aura (NO circular ripples / rings)
      vec2 toM = p - mPos;
      toM.x *= uAspect;

      // Organic spirit wisp distortion
      vec2 sWarp = vec2(
        sin(toM.y * 10.0 + t * 2.0) * 0.035 + cos(toM.x * 8.0 - t * 1.4) * 0.025,
        cos(toM.x * 9.0 - t * 1.6) * 0.035 + sin(toM.y * 8.0 + t * 1.8) * 0.025
      );
      vec2 sPt = toM + sWarp;

      // Asymmetrical spirit contour with organic wisps
      float sAngle = atan(sPt.y, sPt.x);
      float sWisps = sin(sAngle * 2.0 + t * 2.2) * 0.32 
                   + cos(sAngle * 3.0 - t * 1.7) * 0.22 
                   + sin(sAngle * 5.0 + t * 3.0) * 0.12;

      // Elongated spirit body - distinctly not a circle
      float sDist = sqrt(sPt.x * sPt.x * 1.4 + sPt.y * sPt.y * 0.7);
      float spiritRadius = 0.18 * (1.0 + sWisps * 0.6);
      float sNorm = sDist / max(spiritRadius, 0.001);

      // Soft spirit aura sheen
      float spiritAura = exp(-sNorm * sNorm * 2.8) * (1.0 + sin(sPt.x * 18.0 + sPt.y * 14.0 + t * 2.5) * 0.25);
      h += spiritAura * 0.04;

      return h * uIntensity;
    }

    void main() {
      vec2 uv = vUv;
      float t = uTime * 0.85;
      vec2 mPos = uMouse * 0.5 + 0.5;

      // Gradient of fluid surface for refraction & lighting
      float eps = 0.0035;
      float hC = fluidHeight(uv, t, mPos);
      float hR = fluidHeight(uv + vec2(eps, 0.0), t, mPos);
      float hU = fluidHeight(uv + vec2(0.0, eps), t, mPos);

      vec2 grad = vec2(hR - hC, hU - hC) / eps;

      // Viscous refraction displacement
      vec2 distort = grad * 0.035;

      // Chromatic dispersion for glossy liquid glass look
      float r = texture2D(tDiffuse, uv + distort * 1.03).r;
      float g = texture2D(tDiffuse, uv + distort).g;
      float b = texture2D(tDiffuse, uv + distort * 0.97).b;
      vec3 sceneCol = vec3(r, g, b);

      // Glossy specular highlight (lotion sheen)
      vec3 normal = normalize(vec3(-grad.x * 2.2, -grad.y * 2.2, 1.0));
      vec3 lightDir = normalize(vec3(-0.35, 0.65, 0.65));
      vec3 viewDir = vec3(0.0, 0.0, 1.0);
      vec3 halfVec = normalize(lightDir + viewDir);

      float NdotH = max(dot(normal, halfVec), 0.0);
      float specular = pow(NdotH, 32.0) * 0.38;

      // Silky lotion sheen highlight
      float fresnel = pow(1.0 - max(dot(normal, viewDir), 0.0), 3.0) * 0.2;
      vec3 sheenColor = vec3(1.0, 0.97, 0.93);

      vec3 finalCol = sceneCol + sheenColor * (specular + fresnel);
      gl_FragColor = vec4(finalCol, 1.0);
    }
  `,
};

const VIGNETTE_RGB_SHIFT_SHADER = {
    uniforms: {
        tDiffuse: { value: null as THREE.Texture | null },
        shiftAmount: { value: 0.005 },
        vignetteRadius: { value: 0.3 },
        vignetteSoftness: { value: 0.3 },
    },
    vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
    fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform float shiftAmount;
    uniform float vignetteRadius;
    uniform float vignetteSoftness;
    varying vec2 vUv;

    void main() {
      vec2 center = vec2(0.5);
      float dist = distance(vUv, center);
      float horzQuadrant = sign(vUv.x - center.x);
      float vertQuadrant = sign(vUv.y - center.y);

      float vignetteFactor = smoothstep(vignetteRadius, vignetteRadius + vignetteSoftness, dist);
      float currentShift = shiftAmount * vignetteFactor;

      float r = texture2D(tDiffuse, vUv + vec2(currentShift * horzQuadrant, currentShift * vertQuadrant)).r;
      float g = texture2D(tDiffuse, vUv).g;
      float b = texture2D(tDiffuse, vUv - vec2(currentShift * horzQuadrant, currentShift * vertQuadrant)).b;

      float darken = 1.0 - vignetteFactor * 0.5;
      gl_FragColor = vec4(vec3(r, g, b) * darken, 1.0);
    }
  `,
};

function overrideVertexShader(vertexShader: string): string {
    return vertexShader
        .replace(
            "#include <common>",
      /* glsl */ `#include <common>
      varying float vHeight;
      attribute vec2 aOffset;
      uniform sampler2D uTrailTexture;
      uniform int       uTrailCount;
      uniform float     uWaveSpeed;
      uniform float     uWaveFreq;
      uniform float     uWaveWidth;
      uniform float     uFadeTime;
      uniform float     uAmplitude;
      uniform float     uJitter;
      uniform float     uMaxHeight;
      uniform float     uTime;

      // Ethereal Spirit Noise & Shaping Functions
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
      }`,
        )
        .replace(
            "#include <begin_vertex>",
      /* glsl */ `#include <begin_vertex>

      vHeight = 0.0;

      if ( position.y > 0.0 ) {
        vec2 worldXZ = aOffset;
        float peak = 0.0;
        float t = uTime * 1.3;

        // Ethereal spirit shape: organic, non-circular, imperfect fluid apparition with wispy tendrils
        for ( int i = 0; i < uTrailCount; i++ ) {
          vec4 td = texture2D( uTrailTexture, vec2( ( float(i) + 0.5 ) / 128.0, 0.5 ) );
          vec2 center = td.rg;
          float age   = td.b;
          float strength = td.a;

          vec2 toPoint = worldXZ - center;

          // Multi-scale smoke / ectoplasm domain warping
          vec2 warp1 = vec2(
            spiritFBM( toPoint * 0.85 + vec2(t * 0.35, -t * 0.25) ),
            spiritFBM( toPoint * 0.85 + vec2(-t * 0.30, t * 0.28) + vec2(4.1, 2.7) )
          );
          vec2 warped = toPoint + warp1 * ( uWaveWidth * 0.65 );

          // Asymmetrical organic spirit curvature (sickle / flowing ghost spine)
          // Rotate slightly and curve along an S-axis to ensure NO perfect circle
          vec2 curved = vec2(
            warped.x * 0.86 - warped.y * 0.50,
            warped.x * 0.50 + warped.y * 0.86
          );
          curved.x += sin( curved.y * 1.8 - t * 0.8 ) * 0.35 * uWaveWidth;

          // Organic spirit tendrils reaching outward
          float angle = atan( curved.y, curved.x );
          float tendril = sin( angle * 2.0 + t * 1.1 ) * 0.38
                        + cos( angle * 3.0 - t * 0.9 + 1.4 ) * 0.26
                        + sin( angle * 5.0 + t * 1.7 ) * 0.16;

          // Imperfect, stretched non-circular spirit silhouette
          float shapeDist = sqrt( curved.x * curved.x * 1.45 + curved.y * curved.y * 0.75 );

          // Wispy perimeter modulation
          float spiritRadius = uWaveWidth * ( 1.0 + tendril * 0.7 );
          float normDist = shapeDist / max( spiritRadius, 0.001 );

          // Ectoplasmic smoky filaments & hollows
          float filament = abs( spiritFBM( curved * 1.8 + vec2(0.0, -t * 0.7) ) );
          filament = pow( 1.0 - clamp(filament, 0.0, 1.0), 2.0 );

          // Organic spirit envelope (smooth falloff, never a sharp circular edge)
          float envelope = exp( -pow( normDist * 1.35, 2.4 ) );
          float spiritHeight = envelope * ( 0.60 + 0.60 * filament );

          // Fade over trail age
          float fade = exp( -age / uFadeTime );
          float h = fade * spiritHeight * strength;

          if ( h > peak ) {
            peak = h;
          }
        }

        float displacement = clamp( peak * uAmplitude, 0.0, uMaxHeight );
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
    /** Grid resolution (N×N cubes/hexagons). Defaults to 40. */
    gridSize?: number;
    /** Base cube/hexagon color. Defaults to white. */
    colorBase?: string;
    /** Glow/hover color. Defaults to #EF8F60. */
    colorHigh?: string;
    /** Peak displacement multiplier. Defaults to 0.5. */
    waveAmplitude?: number;
    /** Wavefront expansion speed (world units/sec). Defaults to 6. */
    waveSpeed?: number;
    /** Spatial oscillation frequency. Defaults to 1.2. */
    waveFrequency?: number;
    /** Width radius of the localized hover float dome. Defaults to 1.6. */
    waveWidth?: number;
    /** Hard clamp on displacement height. Defaults to 0.5. */
    waveMaxHeight?: number;
    /** Positional jitter. Defaults to 0.0. */
    waveJitter?: number;
    /** Emit gentle random ripples while the cursor is idle. Defaults to false. */
    autoAnimate?: boolean;
    /** Apply the vignette + RGB-shift post-processing pass. Defaults to false. */
    vignette?: boolean;
    /** Enable viscous liquid lotion shader pass on top. Defaults to true. */
    liquidEffect?: boolean;
    /** Intensity multiplier for the liquid lotion distortion. Defaults to 1.0. */
    liquidIntensity?: number;
}

export function WaveGridBackground({
    children,
    className,
    gridSize = 40,
    colorBase = "#ffffff",
    colorHigh = "#EF8F60",
    waveAmplitude = 0.5,
    waveSpeed = 6.0,
    waveFrequency = 1.2,
    waveWidth = 1.6,
    waveMaxHeight = 0.5,
    waveJitter = 0.0,
    autoAnimate = false,
    vignette = false,
    liquidEffect = true,
    liquidIntensity = 1.0,
}: WaveGridBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

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
        liquidEffect,
        liquidIntensity,
    });
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
            liquidEffect,
            liquidIntensity,
        };
    });

    useEffect(() => {
        const container = containerRef.current;
        const canvas = canvasRef.current;
        if (!container || !canvas) return;

        const cubeWidth = 0.8;
        const hexRadius = 0.45; // center-to-corner distance (replaces cubeWidth)
        const cubeHeight = 3;   // unchanged

        const gap = 0.01;
        const bounds = gridSize * (Math.sqrt(3) * hexRadius + gap);

        // ── Sizes ────────────────────────────────────────────────────────────────
        const getSize = () => ({
            width: container.clientWidth || 1,
            height: container.clientHeight || 1,
            pixelRatio: Math.min(window.devicePixelRatio, 2),
        });
        let size = getSize();

        // ── Scene ────────────────────────────────────────────────────────────────
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(colorBase);

        // ── Camera (mouse-driven orbit) ────────────────────────────────────────
        const radius = 12;
        const alphaRange = Math.PI * 0.03;
        const betaRange = Math.PI * 0.05;
        const mouse = new THREE.Vector2(0, 0);
        const lerpedMouse = new THREE.Vector2(0, 0);

        const camera = new THREE.PerspectiveCamera(40, size.width / size.height, 0.1, 200);
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

        const onMouseMove = (e: MouseEvent) => {
            mouse.x = (e.clientX / size.width) * 2 - 1;
            mouse.y = -(e.clientY / size.height) * 2 + 1;
        };
        window.addEventListener("mousemove", onMouseMove);

        // ── Lighting ───────────────────────────────────────────────────────────
        const ambientLight = new THREE.AmbientLight("#ffffff", 0.9);
        scene.add(ambientLight);

        const keyLight = new THREE.DirectionalLight("#ffffff", 3.0);
        keyLight.position.set(-20, 15, 8);
        keyLight.castShadow = true;
        keyLight.shadow.mapSize.set(1024, 1024);
        keyLight.shadow.radius = 6;
        keyLight.shadow.camera.near = 0.1;
        keyLight.shadow.camera.far = 60;
        keyLight.shadow.camera.left = -22;
        keyLight.shadow.camera.right = 22;
        keyLight.shadow.camera.top = 22;
        keyLight.shadow.camera.bottom = -22;
        keyLight.shadow.bias = 0.0001;
        scene.add(keyLight);

        const fillLight = new THREE.DirectionalLight("#ffffff", 1.0);
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

        const trailUniforms = {
            uTrailTexture: { value: trailTexture },
            uTrailCount: { value: 0 },
            uFadeTime: { value: 0.8 },
            uWaveSpeed: { value: waveSpeed },
            uWaveFreq: { value: waveFrequency },
            uWaveWidth: { value: waveWidth },
            uAmplitude: { value: waveAmplitude },
            uJitter: { value: waveJitter },
            uMaxHeight: { value: waveMaxHeight },
            uTime: { value: 0 },
        };
        const colorUniforms = {
            uColorBase: { value: new THREE.Color(colorBase) },
            uColorHigh: { value: new THREE.Color(colorHigh) },
        };

        const trail: { x: number; z: number; age: number; distDelta: number }[] = [];
        let currentHover: { x: number; z: number } | null = null;
        let lastPoint: { x: number; z: number } | null = null;
        let timeSinceLastMove = 0;
        let randomPointTimer = 0;
        let placingRandom = false;
        const fadeTime = 0.8;
        const trailSpacing = 0.1;

        const rayPlane = new THREE.Mesh(
            new THREE.PlaneGeometry(bounds * 1.5, bounds * 1.5),
            new THREE.MeshBasicMaterial({ side: THREE.DoubleSide, visible: false }),
        );
        rayPlane.rotation.x = -Math.PI / 2;
        rayPlane.updateMatrixWorld(true);

        const raycaster = new THREE.Raycaster();
        const pointerNDC = new THREE.Vector2();

        const onPointerMove = (e: PointerEvent | MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            pointerNDC.set(
                ((e.clientX - rect.left) / rect.width) * 2 - 1,
                -((e.clientY - rect.top) / rect.height) * 2 + 1,
            );
            raycaster.setFromCamera(pointerNDC, camera);
            const hits = raycaster.intersectObject(rayPlane);
            if (hits.length === 0) return;
            const { x, z } = hits[0].point;

            currentHover = { x, z };
            timeSinceLastMove = 0;
            placingRandom = false;
            randomPointTimer = 0;
        };

        const onMouseLeave = () => {
            currentHover = null;
            lastPoint = null;
        };

        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("mouseleave", onMouseLeave);

        const addRandomPoint = () => {
            const x = (Math.random() * 0.5 - 0.25) * bounds;
            const z = (Math.random() * 0.5 - 0.25) * bounds;
            const distDelta = 0.8 + Math.random() * 0.2;
            if (trail.length >= MAX_TRAIL) trail.shift();
            trail.push({ x, z, age: 0, distDelta });
        };

        const updateTrail = (delta: number) => {
            const expiry = fadeTime * 2.5;
            for (let i = trail.length - 1; i >= 0; i--) {
                trail[i].age += delta;
                if (trail[i].age > expiry) trail.splice(i, 1);
            }

            // Keep the active hovered spot lifted at age 0 while cursor is hovering
            if (currentHover) {
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
                if (randomPointTimer >= 1.5) {
                    addRandomPoint();
                    randomPointTimer = 0;
                }
            }

            const count = Math.min(trail.length, MAX_TRAIL);
            for (let i = 0; i < count; i++) {
                const ti = i * 4;
                trailData[ti] = trail[i].x;
                trailData[ti + 1] = trail[i].z;
                trailData[ti + 2] = trail[i].age;
                trailData[ti + 3] = trail[i].distDelta;
            }
            trailTexture.needsUpdate = true;
            trailUniforms.uTrailCount.value = count;
        };

        // ── Grid (instanced hexagons with user's exact shape and spacing) ─────
        const count = gridSize * gridSize;
        const geometry = new THREE.CylinderGeometry(hexRadius, hexRadius, cubeHeight, 6);
        const offsetAttribute = new THREE.InstancedBufferAttribute(new Float32Array(count * 2), 2);
        geometry.setAttribute("aOffset", offsetAttribute);

        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        material.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, trailUniforms, colorUniforms);
            shader.vertexShader = overrideVertexShader(shader.vertexShader);
            shader.fragmentShader = shader.fragmentShader
                .replace(
                    "#include <common>",
                    `#include <common>
          varying float vHeight;
          uniform vec3  uColorBase;
          uniform vec3  uColorHigh;
          uniform float uMaxHeight;`,
                )
                .replace(
                    "#include <color_fragment>",
                    `#include <color_fragment>
          float t = clamp( vHeight / max(uMaxHeight, 0.001), 0.0, 1.0 );
          diffuseColor.rgb = mix( uColorBase, uColorHigh, t );`,
                );
        };

        const depthMaterial = new THREE.MeshDepthMaterial();
        depthMaterial.onBeforeCompile = (shader) => {
            Object.assign(shader.uniforms, trailUniforms);
            shader.vertexShader = overrideVertexShader(shader.vertexShader);
        };

        const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
        instancedMesh.customDepthMaterial = depthMaterial;
        instancedMesh.castShadow = true;
        instancedMesh.receiveShadow = true;
        scene.add(instancedMesh);

        const dummy = new THREE.Object3D();
        const horizSpacing = Math.sqrt(3) * hexRadius + gap; // between hex centers, same row
        const vertSpacing = 1.5 * hexRadius + gap * 0.75;    // between rows

        const offsetX = ((gridSize - 1) * horizSpacing) / 2;
        const offsetZ = ((gridSize - 1) * vertSpacing) / 2;

        for (let i = 0; i < gridSize; i++) {       // row → z
            for (let j = 0; j < gridSize; j++) {   // column → x
                const index = i * gridSize + j;
                const rowShift = (i % 2) * (horizSpacing / 2); // stagger odd rows
                const x = j * horizSpacing + rowShift - offsetX;
                const z = i * vertSpacing - offsetZ;

                dummy.position.set(x, 0, z);
                dummy.updateMatrix();
                instancedMesh.setMatrixAt(index, dummy.matrix);
                offsetAttribute.setXY(index, x, z);
            }
        }
        instancedMesh.instanceMatrix.needsUpdate = true;
        offsetAttribute.needsUpdate = true;

        // ── Renderer + post-processing ─────────────────────────────────────────
        const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.95;
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFShadowMap;
        renderer.setClearColor(colorBase);
        renderer.setSize(size.width, size.height);
        renderer.setPixelRatio(size.pixelRatio);

        const composer = new EffectComposer(renderer);
        composer.addPass(new RenderPass(scene, camera));

        // ── Liquid Lotion Shader Pass (applied on top without altering mesh) ───
        let liquidPass: ShaderPass | null = null;
        if (liquidEffect) {
            liquidPass = new ShaderPass(LIQUID_LOTION_SHADER);
            liquidPass.uniforms.uAspect.value = size.width / size.height;
            composer.addPass(liquidPass);
        }

        if (vignette) {
            const vignettePass = new ShaderPass(VIGNETTE_RGB_SHIFT_SHADER);
            composer.addPass(vignettePass);
        }
        composer.addPass(new OutputPass());
        composer.setSize(size.width, size.height);
        composer.setPixelRatio(size.pixelRatio);

        // ── Resize ──────────────────────────────────────────────────────────────
        const applySize = () => {
            size = getSize();
            camera.aspect = size.width / size.height;
            camera.updateProjectionMatrix();
            renderer.setSize(size.width, size.height);
            renderer.setPixelRatio(size.pixelRatio);
            composer.setSize(size.width, size.height);
            composer.setPixelRatio(size.pixelRatio);
            if (liquidPass) {
                liquidPass.uniforms.uAspect.value = size.width / size.height;
            }
        };
        const resizeObserver = new ResizeObserver(applySize);
        resizeObserver.observe(container);
        window.addEventListener("resize", applySize);

        // ── Animation loop ─────────────────────────────────────────────────────
        const clock = new THREE.Clock();
        renderer.setAnimationLoop(() => {
            const delta = clock.getDelta();
            const elapsed = clock.getElapsedTime();
            const p = propsRef.current;

            trailUniforms.uTime.value = elapsed;
            trailUniforms.uWaveSpeed.value = p.waveSpeed;
            trailUniforms.uWaveFreq.value = p.waveFrequency;
            trailUniforms.uWaveWidth.value = p.waveWidth;
            trailUniforms.uAmplitude.value = p.waveAmplitude;
            trailUniforms.uJitter.value = p.waveJitter;
            trailUniforms.uMaxHeight.value = p.waveMaxHeight;
            colorUniforms.uColorBase.value.set(p.colorBase);
            colorUniforms.uColorHigh.value.set(p.colorHigh);
            scene.background = new THREE.Color(p.colorBase);

            updateTrail(delta);
            lerpedMouse.x += (mouse.x - lerpedMouse.x) * 0.04;
            lerpedMouse.y += (mouse.y - lerpedMouse.y) * 0.04;
            positionCamera(lerpedMouse.x, lerpedMouse.y);

            // Update liquid lotion shader uniforms
            if (liquidPass) {
                liquidPass.uniforms.uTime.value = clock.getElapsedTime();
                liquidPass.uniforms.uMouse.value.lerp(mouse, 0.08);
                liquidPass.uniforms.uIntensity.value = p.liquidIntensity;
            }

            composer.render();
        });

        // ── Cleanup ──────────────────────────────────────────────────────────────
        return () => {
            renderer.setAnimationLoop(null);
            window.removeEventListener("mousemove", onMouseMove);
            window.removeEventListener("pointermove", onPointerMove);
            window.removeEventListener("mouseleave", onMouseLeave);
            window.removeEventListener("resize", applySize);
            resizeObserver.disconnect();

            geometry.dispose();
            material.dispose();
            depthMaterial.dispose();
            rayPlane.geometry.dispose();
            (rayPlane.material as THREE.Material).dispose();
            trailTexture.dispose();
            composer.dispose();
            renderer.dispose();
        };
    }, [gridSize, vignette, liquidEffect]);

    return (
        <div ref={containerRef} className={cn("relative h-full w-full overflow-hidden bg-white select-none", className)}>
            <canvas ref={canvasRef} className="block h-full w-full" />
            {children != null && <div className="absolute inset-0">{children}</div>}
        </div>
    );
}

export default WaveGridBackground;
