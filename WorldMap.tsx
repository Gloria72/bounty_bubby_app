import { useEffect, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";

const geoUrl = "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

interface TaskLocation {
  city: string;
  coordinates: [number, number];
  count: number;
}

export default function WorldMap() {
  const [taskLocations, setTaskLocations] = useState<TaskLocation[]>([
    { city: "北京", coordinates: [116.4074, 39.9042], count: 12 },
    { city: "上海", coordinates: [121.4737, 31.2304], count: 8 },
    { city: "深圳", coordinates: [114.0579, 22.5431], count: 15 },
    { city: "杭州", coordinates: [120.1551, 30.2741], count: 6 },
    { city: "成都", coordinates: [104.0668, 30.5728], count: 9 },
    { city: "广州", coordinates: [113.2644, 23.1291], count: 7 },
  ]);

  // 模拟实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      setTaskLocations((prev) =>
        prev.map((loc) => ({
          ...loc,
          count: Math.max(1, loc.count + Math.floor(Math.random() * 3) - 1),
        }))
      );
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[500px] rounded-lg overflow-hidden glass neon-border">
      <div className="absolute top-4 left-4 z-10 glass rounded-lg p-4">
        <h3 className="text-sm font-bold text-primary neon-glow-gold mb-2">
          🌍 任务热区
        </h3>
        <div className="space-y-1 text-xs">
          {taskLocations.slice(0, 3).map((loc) => (
            <div key={loc.city} className="flex items-center justify-between gap-4">
              <span className="text-foreground">{loc.city}</span>
              <span className="text-primary font-bold neon-glow-gold">
                {loc.count}
              </span>
            </div>
          ))}
        </div>
      </div>

      <ComposableMap
        projection="geoMercator"
        projectionConfig={{
          scale: 120,
          center: [105, 35],
        }}
        style={{
          width: "100%",
          height: "100%",
        }}
      >
        <Geographies geography={geoUrl}>
          {({ geographies }) =>
            geographies.map((geo) => (
              <Geography
                key={geo.rsmKey}
                geography={geo}
                fill="oklch(0.15 0.01 250)"
                stroke="oklch(0.25 0.02 250)"
                strokeWidth={0.5}
                style={{
                  default: {
                    outline: "none",
                  },
                  hover: {
                    fill: "oklch(0.20 0.02 250)",
                    outline: "none",
                  },
                  pressed: {
                    outline: "none",
                  },
                }}
              />
            ))
          }
        </Geographies>

        {taskLocations.map((location) => (
          <Marker key={location.city} coordinates={location.coordinates}>
            <g className="cursor-pointer group">
              {/* Pulsing circle */}
              <circle
                r={6 + location.count / 3}
                fill="oklch(0.75 0.20 85)"
                fillOpacity={0.3}
                className="animate-ping"
              />
              {/* Main marker */}
              <circle
                r={4 + location.count / 5}
                fill="oklch(0.75 0.20 85)"
                stroke="oklch(0.98 0 0)"
                strokeWidth={1.5}
                filter="drop-shadow(0 0 8px oklch(0.75 0.20 85))"
              />
              {/* Tooltip */}
              <text
                textAnchor="middle"
                y={-12}
                style={{
                  fontFamily: "Space Mono, monospace",
                  fontSize: "10px",
                  fill: "oklch(0.98 0 0)",
                  fontWeight: "bold",
                  filter: "drop-shadow(0 0 4px oklch(0.75 0.20 85))",
                  opacity: 0,
                }}
                className="group-hover:opacity-100 transition-opacity"
              >
                {location.city}: {location.count}
              </text>
            </g>
          </Marker>
        ))}
      </ComposableMap>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 glass rounded-lg p-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-primary animate-pulse"></div>
          <span className="text-foreground">实时任务数</span>
        </div>
      </div>
    </div>
  );
}

