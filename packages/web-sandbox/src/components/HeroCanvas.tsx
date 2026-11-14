/**
 * HeroCanvas — GPU particle field behind the hero.
 *
 * Pattern: DIV7NE portfolio (Awwwards nominee 2025), Nejc Končan.
 * - Custom GLSL shader: each particle is a point sprite, colored by
 *   distance from origin (Sage Olive → Burnt Terracotta tint)
 * - Simplex noise wave displacement driven by time uniform
 * - Mouse repulsion: particles flee the pointer within a radius
 * - Scroll-driven dispersion: particles scatter as user scrolls down
 * - Adaptive count: 10k desktop / 4k mobile, capped DPR 2
 * - Pauses when offscreen (IntersectionObserver)
 *
 * prefers-reduced-motion: static, no animation.
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

export function HeroCanvas() {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const prefersReduced =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const isMobile = window.innerWidth < 768;
    const PARTICLE_COUNT = isMobile ? 4000 : 10000;

    // ── Renderer ──
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(el.offsetWidth, el.offsetHeight);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      50,
      el.offsetWidth / el.offsetHeight,
      0.1,
      100
    );
    camera.position.z = 4;

    // ── Particle geometry ──
    const positions = new Float32Array(PARTICLE_COUNT * 3);
    const origins = new Float32Array(PARTICLE_COUNT * 3);  // resting positions
    const randoms = new Float32Array(PARTICLE_COUNT);       // per-particle noise seed

    for (let i = 0; i < PARTICLE_COUNT; i++) {
      // Distribute on a wide plane with slight Z variation
      const x = (Math.random() - 0.5) * 7;
      const y = (Math.random() - 0.5) * 4;
      const z = (Math.random() - 0.5) * 1.5;
      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;
      origins[i * 3] = x;
      origins[i * 3 + 1] = y;
      origins[i * 3 + 2] = z;
      randoms[i] = Math.random();
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    geo.setAttribute("aOrigin", new THREE.BufferAttribute(origins, 3));
    geo.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

    // ── Shader material ──
    const mat = new THREE.ShaderMaterial({
      transparent: true,
      depthWrite: false,
      uniforms: {
        uTime:       { value: 0 },
        uMouse:      { value: new THREE.Vector3(0, 0, 0) },
        uDisperse:   { value: 0 },     // 0–1 scroll dispersion
        uSize:       { value: isMobile ? 1.8 : 2.2 },
        uDPR:        { value: Math.min(window.devicePixelRatio, 2) },
        // Sage Olive tint (soft) → Terracotta tint (soft)
        uColorA:     { value: new THREE.Color("#9fc9a2") },   // Mint/Sage
        uColorB:     { value: new THREE.Color("#dfa88f") },   // Peach/Terracotta
        uAlpha:      { value: prefersReduced ? 0.5 : 0.65 },
      },
      vertexShader: /* glsl */ `
        attribute vec3 aOrigin;
        attribute float aRandom;

        uniform float uTime;
        uniform float uSize;
        uniform float uDPR;
        uniform vec3 uMouse;
        uniform float uDisperse;

        varying float vDist;
        varying float vRandom;

        // Smooth value noise (fast, no permutation table)
        float hash(float n) { return fract(sin(n) * 43758.5453123); }
        float noise(vec3 p) {
          vec3 i = floor(p);
          vec3 f = fract(p);
          f = f * f * (3.0 - 2.0 * f);
          float n = i.x + i.y * 57.0 + 113.0 * i.z;
          return mix(
            mix(mix(hash(n), hash(n+1.0), f.x),
                mix(hash(n+57.0), hash(n+58.0), f.x), f.y),
            mix(mix(hash(n+113.0), hash(n+114.0), f.x),
                mix(hash(n+170.0), hash(n+171.0), f.x), f.y), f.z);
        }

        void main() {
          vec3 pos = aOrigin;

          // Wave displacement — gentle breathing
          float wave = noise(vec3(aOrigin.x * 0.6, aOrigin.y * 0.6, uTime * 0.18 + aRandom * 6.28));
          pos.y += wave * 0.12;
          pos.x += noise(vec3(aOrigin.y * 0.5, uTime * 0.12, aRandom * 3.14)) * 0.08;

          // Mouse repulsion — particles flee within radius
          vec3 toMouse = pos - uMouse;
          float mouseDist = length(toMouse.xy);
          float repulseRadius = 0.9;
          if (mouseDist < repulseRadius) {
            float strength = (1.0 - mouseDist / repulseRadius);
            strength = strength * strength;
            pos.xy += normalize(toMouse.xy) * strength * 0.55;
          }

          // Scroll dispersion — particles scatter outward and upward
          if (uDisperse > 0.0) {
            vec3 disperseDir = normalize(aOrigin + vec3(aRandom * 2.0 - 1.0, aRandom, 0.5));
            pos += disperseDir * uDisperse * (1.5 + aRandom * 2.0);
          }

          vDist = length(aOrigin.xy) / 4.0;  // 0 center → 1 edge
          vRandom = aRandom;

          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          gl_PointSize = uSize * uDPR * (1.0 - vDist * 0.4) * (0.6 + aRandom * 0.8);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform vec3 uColorA;
        uniform vec3 uColorB;
        uniform float uAlpha;

        varying float vDist;
        varying float vRandom;

        void main() {
          // Circular point sprite
          vec2 uv = gl_PointCoord - 0.5;
          float r = length(uv);
          if (r > 0.5) discard;

          // Soft edge
          float alpha = smoothstep(0.5, 0.2, r) * uAlpha;

          // Color: Sage at center, Terracotta tint at edges
          vec3 col = mix(uColorA, uColorB, vDist * 0.8 + vRandom * 0.2);
          gl_FragColor = vec4(col, alpha);
        }
      `,
    });

    const particles = new THREE.Points(geo, mat);
    scene.add(particles);

    // ── Mouse tracking → NDC → world position ──
    const mouse2D = new THREE.Vector2(9999, 9999);  // start off-screen
    const mouseWorld = new THREE.Vector3();
    const raycaster = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      mouse2D.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse2D.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    };
    window.addEventListener("mousemove", onMouseMove);

    // ── Scroll dispersion ──
    const disperse = { val: 0 };
    const onScroll = () => {
      const heroH = el.offsetHeight;
      const scrollY = window.scrollY;
      const t = Math.min(scrollY / (heroH * 0.6), 1);
      gsap.to(disperse, {
        val: t,
        duration: 0.4,
        ease: "power2.out",
        onUpdate: () => {
          mat.uniforms.uDisperse.value = disperse.val;
        },
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // ── Pause when off-screen ──
    let paused = false;
    const observer = new IntersectionObserver(
      (entries) => { paused = !entries[0].isIntersecting; },
      { threshold: 0 }
    );
    observer.observe(el);

    // ── Render loop ──
    const time = { t: 0 };
    if (!prefersReduced) {
      gsap.to(time, { t: 1, duration: 9999, ease: "none" });
    }

    const render = () => {
      if (paused) return;

      mat.uniforms.uTime.value = time.t * 60;

      // Unproject mouse to world Z=0
      raycaster.setFromCamera(mouse2D, camera);
      raycaster.ray.intersectPlane(plane, mouseWorld);
      mat.uniforms.uMouse.value.copy(mouseWorld);

      renderer.render(scene, camera);
    };
    gsap.ticker.add(render);

    // ── Resize ──
    const onResize = () => {
      if (!el) return;
      renderer.setSize(el.offsetWidth, el.offsetHeight);
      camera.aspect = el.offsetWidth / el.offsetHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      gsap.ticker.remove(render);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      observer.disconnect();
      renderer.dispose();
      geo.dispose();
      mat.dispose();
      if (el.contains(renderer.domElement)) {
        el.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}
    />
  );
}
