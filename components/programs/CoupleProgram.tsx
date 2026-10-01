'use client';

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { MotionValue } from 'framer-motion';

export interface CoupleProgramProps {
  className?: string;
  mouseX?: MotionValue<number>;
  mouseY?: MotionValue<number>;
  isShocked?: boolean;
  textureUrl?: string;
  glowColor?: string | number;
  auraColor?: string | number;
  interactive?: boolean;
}

export default function CoupleProgram({
  className = 'w-full h-full',
  mouseX,
  mouseY,
  isShocked = false,
  textureUrl = '/programs/Couple-Program-planet.png',
  glowColor = 0xfcd34d,
  auraColor = 0xf59e0b,
  interactive = true,
}: CoupleProgramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isShockedRef = useRef(isShocked);

  // Keep ref in sync without triggering re-creation of Three.js scene
  useEffect(() => {
    isShockedRef.current = isShocked;
  }, [isShocked]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    // Resolve to seamless 360-degree equirectangular planetary texture so the texture completely fills the model
    const resolvedTextureUrl =
      !textureUrl ||
      textureUrl === '/programs/Couple-Program.svg' ||
      textureUrl === '/programs/Couple-Program.png'
        ? '/programs/Couple-Program-planet.png'
        : textureUrl;

    // 1. Scene setup
    const scene = new THREE.Scene();

    // 2. Camera setup fitted for 3D planetary sphere
    const camera = new THREE.PerspectiveCamera(40, 1, 0.1, 50);
    camera.position.set(0, 0, 5.85);

    // 3. Renderer with high-DPI and alpha transparency
    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'default',
      });
    } catch (err) {
      console.warn('CoupleProgram: WebGL unavailable', err);
      return;
    }

    if (!renderer) return;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    // 4. 3D Planet Globe Model (True 3D Sphere, not flat 2D)
    const PLANET_RADIUS = 1.8;
    const sphereGeometry = new THREE.SphereGeometry(PLANET_RADIUS, 64, 64);

    // Load seamless planetary texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(
      resolvedTextureUrl,
      (tex) => {
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.wrapS = THREE.RepeatWrapping;
        tex.wrapT = THREE.ClampToEdgeWrapping;
        tex.generateMipmaps = true;
        tex.minFilter = THREE.LinearMipmapLinearFilter;
        tex.magFilter = THREE.LinearFilter;
        tex.needsUpdate = true;
      },
      undefined,
      (err) => {
        console.warn('Error loading Couple Program texture, fallback to svg:', err);
        textureLoader.load('/programs/Couple-Program.svg', (fallbackTex) => {
          fallbackTex.colorSpace = THREE.SRGBColorSpace;
          fallbackTex.wrapS = THREE.RepeatWrapping;
          fallbackTex.wrapT = THREE.ClampToEdgeWrapping;
          fallbackTex.needsUpdate = true;
          planetMaterial.map = fallbackTex;
          planetMaterial.needsUpdate = true;
        });
      }
    );

    texture.colorSpace = THREE.SRGBColorSpace;
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    // Pure unlit planetary surface material (preserves pure texture colors with zero light glare or harsh shadows)
    const planetMaterial = new THREE.MeshBasicMaterial({
      map: texture,
    });

    const planetMesh = new THREE.Mesh(sphereGeometry, planetMaterial);

    // 5. Atmospheric Fresnel Rim Glow (Glowing planetary limb / halo)
    const atmosphereGeometry = new THREE.SphereGeometry(PLANET_RADIUS * 1.02, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 uGlowColor;
        uniform float uIntensity;
        void main() {
          float rim = 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0)));
          float glow = pow(rim, 2.8) * uIntensity;
          gl_FragColor = vec4(uGlowColor, glow * 0.85);
        }
      `,
      uniforms: {
        uGlowColor: { value: new THREE.Color(glowColor) },
        uIntensity: { value: 1.0 },
      },
      blending: THREE.AdditiveBlending,
      transparent: true,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);

    // 6. Outer Atmospheric Space Aura (Subtle soft space haze)
    const outerAuraGeometry = new THREE.SphereGeometry(PLANET_RADIUS * 1.12, 48, 48);
    const outerAuraMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        uniform vec3 uAuraColor;
        uniform float uIntensity;
        void main() {
          float rim = max(0.0, 1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))));
          float glow = pow(rim, 3.2) * 0.55 * uIntensity;
          gl_FragColor = vec4(uAuraColor, glow);
        }
      `,
      uniforms: {
        uAuraColor: { value: new THREE.Color(auraColor) },
        uIntensity: { value: 1.0 },
      },
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      transparent: true,
      depthWrite: false,
    });
    const outerAuraMesh = new THREE.Mesh(outerAuraGeometry, outerAuraMaterial);

    // 7. Axial Tilt Group Hierarchy
    const axialTiltGroup = new THREE.Group();
    axialTiltGroup.rotation.z = 0.38;
    axialTiltGroup.rotation.x = 0.12;
    axialTiltGroup.add(planetMesh);
    axialTiltGroup.add(atmosphereMesh);

    // Master Planet Group
    const orbGroup = new THREE.Group();
    orbGroup.add(axialTiltGroup);
    orbGroup.add(outerAuraMesh);
    scene.add(orbGroup);

    // 8. Resize handler
    const handleResize = () => {
      if (!container || !renderer) return;
      const width = container.clientWidth || 360;
      const height = container.clientHeight || 360;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height, false);
    };

    handleResize();
    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(container);

    // 9. Animation, Planetary Physics & User Drag Controls
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const BASE_ROTATION_SPEED = 0.35;
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
      } catch { }
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

    const onPointerUp = (e: PointerEvent) => {
      isDragging = false;
      try {
        container.releasePointerCapture(e.pointerId);
      } catch { }
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

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      const delta = Math.min(clock.getDelta(), 0.1);

      let normX = localMouseX;
      let normY = localMouseY;

      if (mouseX && mouseY) {
        const mx = mouseX.get();
        const my = mouseY.get();
        if (mx !== 0 || my !== 0) {
          normX = Math.max(-1, Math.min(1, mx / 380));
          normY = Math.max(-1, Math.min(1, my / 380));
        }
      }

      if (!isDragging) {
        currentSpinVelocity *= 0.94;
        pitchVelocity *= 0.94;
        axialTiltGroup.rotation.x += pitchVelocity;

        planetMesh.rotation.y += (BASE_ROTATION_SPEED + currentSpinVelocity * 60) * delta;
      }

      const MAX_TILT = 0.22;
      const targetTiltY = normX * MAX_TILT;
      const targetTiltX = -normY * MAX_TILT;

      curTiltX += (targetTiltX - curTiltX) * 0.07;
      curTiltY += (targetTiltY - curTiltY) * 0.07;

      const targetShock = isShockedRef.current ? 1.08 : 1.0;
      const targetGlow = isShockedRef.current ? 1.6 : 1.0;
      curShockScale += (targetShock - curShockScale) * 0.14;
      curGlowIntensity += (targetGlow - curGlowIntensity) * 0.12;

      atmosphereMaterial.uniforms.uIntensity.value = curGlowIntensity;
      outerAuraMaterial.uniforms.uIntensity.value = curGlowIntensity;

      orbGroup.rotation.x = curTiltX;
      orbGroup.rotation.y = curTiltY;
      orbGroup.position.set(0, 0, 0);
      orbGroup.scale.setScalar(curShockScale);

      renderer.render(scene, camera);
    };

    animate();

    // 10. Cleanup
    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      if (interactive) {
        container.removeEventListener('pointerdown', onPointerDown);
        container.removeEventListener('pointermove', onPointerMove);
        container.removeEventListener('pointerup', onPointerUp);
        container.removeEventListener('pointercancel', onPointerUp);
        container.removeEventListener('pointerleave', onPointerLeave);
      }

      sphereGeometry.dispose();
      atmosphereGeometry.dispose();
      outerAuraGeometry.dispose();

      planetMaterial.dispose();
      atmosphereMaterial.dispose();
      outerAuraMaterial.dispose();
      texture.dispose();

      if (renderer) {
        renderer.dispose();
      }
    };
  }, [textureUrl, glowColor, auraColor, mouseX, mouseY, interactive]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full h-full flex items-center justify-center select-none ${
        interactive ? 'cursor-grab active:cursor-grabbing touch-none' : 'pointer-events-none'
      } ${className}`}
    >
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}

export { CoupleProgram as CoupleProgramThreeCircle };
