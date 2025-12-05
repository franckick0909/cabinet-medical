"use client";

import React, { useEffect, useState } from "react";

interface PerformanceMetrics {
  fps: number;
  memory: {
    used: number;
    total: number;
    percentage: number;
  };
  cpuCores: number;
  deviceMemory: number;
  isMobile: boolean;
  platform: string;
  timestamp: Date;
}

export const PerformanceMonitor: React.FC<{ visible?: boolean }> = ({
  visible = true,
}) => {
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    fps: 0,
    memory: { used: 0, total: 0, percentage: 0 },
    cpuCores: 0,
    deviceMemory: 0,
    isMobile: false,
    platform: "",
    timestamp: new Date(),
  });

  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();
    let raf = 0;

    const updateMetrics = (currentTime: number) => {
      frameCount++;
      const elapsed = currentTime - lastTime;

      if (elapsed >= 1000) {
        const nav = navigator as any;
        const newMetrics: PerformanceMetrics = {
          fps: frameCount,
          memory: {
            used: nav.deviceMemory ? Math.round(nav.deviceMemory * 0.7) : 0,
            total: nav.deviceMemory || 0,
            percentage: nav.deviceMemory ? 70 : 0,
          },
          cpuCores: navigator.hardwareConcurrency || 0,
          deviceMemory: nav.deviceMemory || 0,
          isMobile: /iPhone|iPad|Android|Mobile/i.test(navigator.userAgent),
          platform: navigator.platform || "Unknown",
          timestamp: new Date(),
        };

        setMetrics(newMetrics);
        frameCount = 0;
        lastTime = currentTime;
      }

      raf = requestAnimationFrame(updateMetrics);
    };

    raf = requestAnimationFrame(updateMetrics);

    return () => cancelAnimationFrame(raf);
  }, []);

  if (!visible) return null;

  const fpsColor =
    metrics.fps >= 50
      ? "text-green-400"
      : metrics.fps >= 30
        ? "text-yellow-400"
        : "text-red-400";

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setExpanded(!expanded)}
        className={`${
          expanded ? "bg-blue-600" : "bg-black/70"
        } hover:bg-blue-600 text-white px-4 py-2 rounded font-mono text-sm transition-all cursor-pointer border border-blue-500/50`}
      >
        📊 {metrics.fps} FPS
      </button>

      {expanded && (
        <div className="absolute bottom-12 right-0 bg-black/90 border border-blue-500/50 rounded p-4 min-w-80 font-mono text-xs text-gray-200 space-y-2">
          {/* FPS */}
          <div className="flex justify-between items-center">
            <span>FPS:</span>
            <span className={`${fpsColor} font-bold`}>{metrics.fps}</span>
          </div>

          {/* CPU Cores */}
          {metrics.cpuCores > 0 && (
            <div className="flex justify-between items-center">
              <span>CPU Cores:</span>
              <span className="text-blue-400">{metrics.cpuCores}</span>
            </div>
          )}

          {/* Device Memory */}
          {metrics.deviceMemory > 0 && (
            <div className="flex justify-between items-center">
              <span>Device RAM:</span>
              <span className="text-blue-400">{metrics.deviceMemory} GB</span>
            </div>
          )}

          {/* Platform */}
          <div className="flex justify-between items-center">
            <span>Platform:</span>
            <span className="text-blue-400">
              {metrics.isMobile ? "📱 Mobile" : "🖥️ Desktop"}
            </span>
          </div>

          {/* Performance Mode */}
          <div className="pt-2 border-t border-blue-500/30 mt-2">
            <div className="text-gray-400 text-xs">
              Performance Mode:
              {metrics.isMobile || metrics.cpuCores <= 2
                ? " ⚠️ LOW"
                : metrics.cpuCores <= 4
                  ? " ⚡ MEDIUM"
                  : " 🚀 HIGH"}
            </div>
          </div>

          {/* Time */}
          <div className="text-gray-500 text-xs pt-2 border-t border-blue-500/30">
            {metrics.timestamp.toLocaleTimeString()}
          </div>
        </div>
      )}
    </div>
  );
};

export default PerformanceMonitor;
