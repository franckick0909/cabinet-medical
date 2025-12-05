"use client";

import { Mesh, Program, Renderer, Triangle } from "ogl";
import React, { useEffect, useRef, useState } from "react";

interface PlasmaProps {
  color?: string;
  speed?: number;
  direction?: "forward" | "reverse" | "pingpong";
  scale?: number;
  opacity?: number;
  mouseInteractive?: boolean;
  performanceMode?: "auto" | "low" | "medium" | "high";
}

interface NavigatorWithMemory {
  deviceMemory?: number;
  hardwareConcurrency?: number;
}

// Détection des appareils faibles
const detectDeviceCapabilities = () => {
  const nav = navigator as NavigatorWithMemory;
  const cores = nav.hardwareConcurrency || 1;
  const ram = nav.deviceMemory || 4;
  const isMobile = /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent);

  if (isMobile || cores <= 2 || ram <= 4) {
    return "low";
  } else if (cores <= 4 || ram <= 8) {
    return "medium";
  }
  return "high";
};

// Configuration des performances
const performanceConfig = {
  low: { dpr: 0.5, maxFPS: 30, qualityScale: 0.5 },
  medium: { dpr: 0.75, maxFPS: 45, qualityScale: 0.75 },
  high: { dpr: 1, maxFPS: 60, qualityScale: 1 },
};

const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return [1, 0.5, 0.2];
  return [
    parseInt(result[1], 16) / 255,
    parseInt(result[2], 16) / 255,
    parseInt(result[3], 16) / 255,
  ];
};

const vertex = `#version 300 es
precision highp float;
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const fragment = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform vec3 uCustomColor;
uniform float uUseCustomColor;
uniform float uSpeed;
uniform float uDirection;
uniform float uScale;
uniform float uOpacity;
uniform vec2 uMouse;
uniform float uMouseInteractive;
out vec4 fragColor;

void mainImage(out vec4 o, vec2 C) {
  vec2 center = iResolution.xy * 0.5;
  C = (C - center) / uScale + center;
  
  vec2 mouseOffset = (uMouse - center) * 0.0002;
  C += mouseOffset * length(C - center) * step(0.5, uMouseInteractive);
  
  float i, d, z, T = iTime * uSpeed * uDirection;
  vec3 O, p, S;

  for (vec2 r = iResolution.xy, Q; ++i < 60.; O += o.w/d*o.xyz) {
    p = z*normalize(vec3(C-.5*r,r.y)); 
    p.z -= 4.; 
    S = p;
    d = p.y-T;
    
    p.x += .4*(1.+p.y)*sin(d + p.x*0.1)*cos(.34*d + p.x*0.05); 
    Q = p.xz *= mat2(cos(p.y+vec4(0,11,33,0)-T)); 
    z+= d = abs(sqrt(length(Q*Q)) - .25*(5.+S.y))/3.+8e-4; 
    o = 1.+sin(S.y+p.z*.5+S.z-length(S-p)+vec4(2,1,0,8));
  }
  
  o.xyz = tanh(O/1e4);
}

bool finite1(float x){ return !(isnan(x) || isinf(x)); }
vec3 sanitize(vec3 c){
  return vec3(
    finite1(c.r) ? c.r : 0.0,
    finite1(c.g) ? c.g : 0.0,
    finite1(c.b) ? c.b : 0.0
  );
}

void main() {
  vec4 o = vec4(0.0);
  mainImage(o, gl_FragCoord.xy);
  vec3 rgb = sanitize(o.rgb);
  
  float intensity = (rgb.r + rgb.g + rgb.b) / 3.0;
  vec3 customColor = intensity * uCustomColor;
  vec3 finalColor = mix(rgb, customColor, step(0.5, uUseCustomColor));
  
  float alpha = length(rgb) * uOpacity;
  fragColor = vec4(finalColor, alpha);
}`;

export const Plasma: React.FC<PlasmaProps> = ({
  color = "#ffffff",
  speed = 1,
  direction = "forward",
  scale = 1,
  opacity = 1,
  mouseInteractive = false,
  performanceMode = "auto",
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const mousePos = useRef({ x: 0, y: 0 });
  const [isSupported, setIsSupported] = useState(true);
  const [fps, setFps] = useState(0);
  const [currentMode, setCurrentMode] = useState<string>("auto");
  const fpsRef = useRef({ lastTime: performance.now(), frameCount: 0 });

  useEffect(() => {
    if (!containerRef.current) return;

    // Vérifier le support WebGL2
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2");
    if (!gl) {
      setIsSupported(false);
      return;
    }

    // Déterminer le mode de performance
    const deviceCapability = detectDeviceCapabilities();
    const mode =
      performanceMode === "auto" ? deviceCapability : performanceMode;
    const config = performanceConfig[mode as keyof typeof performanceConfig];

    // Mettre à jour le mode affiché
    setCurrentMode(mode);

    console.log(
      `🎮 Plasma Mode: ${mode} | DPR: ${config.dpr} | MaxFPS: ${config.maxFPS}`
    );

    const useCustomColor = color ? 1.0 : 0.0;
    const customColorRgb = color ? hexToRgb(color) : [1, 1, 1];

    const directionMultiplier = direction === "reverse" ? -1.0 : 1.0;

    const renderer = new Renderer({
      webgl: 2,
      alpha: true,
      antialias: false,
      dpr: config.dpr,
    });
    const glRenderer = renderer.gl;
    const canvas2 = glRenderer.canvas as HTMLCanvasElement;
    canvas2.style.display = "block";
    canvas2.style.width = "100%";
    canvas2.style.height = "100%";
    const container = containerRef.current;
    container.appendChild(canvas2);

    const geometry = new Triangle(glRenderer);

    const program = new Program(glRenderer, {
      vertex: vertex,
      fragment: fragment,
      uniforms: {
        iTime: { value: 0 },
        iResolution: { value: new Float32Array([1, 1]) },
        uCustomColor: { value: new Float32Array(customColorRgb) },
        uUseCustomColor: { value: useCustomColor },
        uSpeed: { value: speed * 0.4 },
        uDirection: { value: directionMultiplier },
        uScale: { value: scale },
        uOpacity: { value: opacity },
        uMouse: { value: new Float32Array([0, 0]) },
        uMouseInteractive: { value: mouseInteractive ? 1.0 : 0.0 },
      },
    });

    const mesh = new Mesh(glRenderer, { geometry, program });

    const handleMouseMove = (e: MouseEvent) => {
      if (!mouseInteractive) return;
      const rect = containerRef.current!.getBoundingClientRect();
      mousePos.current.x = e.clientX - rect.left;
      mousePos.current.y = e.clientY - rect.top;
      const mouseUniform = program.uniforms.uMouse.value as Float32Array;
      mouseUniform[0] = mousePos.current.x;
      mouseUniform[1] = mousePos.current.y;
    };

    if (mouseInteractive) {
      containerRef.current.addEventListener("mousemove", handleMouseMove);
    }

    const setSize = () => {
      const rect = containerRef.current!.getBoundingClientRect();
      const width = Math.max(1, Math.floor(rect.width));
      const height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height);
      const res = program.uniforms.iResolution.value as Float32Array;
      res[0] = glRenderer.drawingBufferWidth;
      res[1] = glRenderer.drawingBufferHeight;
    };

    const ro = new ResizeObserver(setSize);
    ro.observe(containerRef.current);
    setSize();

    let raf = 0;
    const t0 = performance.now();
    let lastFrameTime = t0;

    const loop = (t: number) => {
      // Limitation des FPS
      const deltaTime = t - lastFrameTime;
      const frameTime = 1000 / config.maxFPS;

      if (deltaTime < frameTime) {
        raf = requestAnimationFrame(loop);
        return;
      }

      lastFrameTime = t;

      // Calcul des FPS
      fpsRef.current.frameCount++;
      const elapsed = t - fpsRef.current.lastTime;
      if (elapsed >= 1000) {
        setFps(fpsRef.current.frameCount);
        fpsRef.current.frameCount = 0;
        fpsRef.current.lastTime = t;
      }

      const timeValue = (t - t0) * 0.001;

      if (direction === "pingpong") {
        const cycle = Math.sin(timeValue * 0.5) * directionMultiplier;
        (program.uniforms.uDirection as { value: number }).value = cycle;
      }

      (program.uniforms.iTime as { value: number }).value = timeValue;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (mouseInteractive && container) {
        container.removeEventListener("mousemove", handleMouseMove);
      }
      try {
        canvas2.remove();
      } catch {}
    };
  }, [
    color,
    speed,
    direction,
    scale,
    opacity,
    mouseInteractive,
    performanceMode,
  ]);

  if (!isSupported) {
    return (
      <div className="w-full h-full relative overflow-hidden bg-gradient-to-br from-blue-500/20 to-purple-500/20" />
    );
  }

  return (
    <div className="relative w-full h-full">
      <div
        ref={containerRef}
        className="w-full h-full relative overflow-hidden"
      />
      {/* Affichage des FPS et mode en développement */}
      {process.env.NODE_ENV === "development" && (
        <div className="absolute top-32 right-4 bg-black/50 text-green-400 px-3 py-2 rounded font-mono text-sm space-y-1">
          <div>Mode: {currentMode.toUpperCase()}</div>
          <div>FPS: {fps}</div>
        </div>
      )}
    </div>
  );
};

export default Plasma;
