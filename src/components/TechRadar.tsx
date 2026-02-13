import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface RadarData {
  label: string;
  value: number; // 0 to 10
  icon?: React.ElementType;
}

interface TechRadarProps {
  data: RadarData[];
  width?: number;
  height?: number;
  maxVal?: number;
}

const TechRadar: React.FC<TechRadarProps> = ({
  data,
  width = 300,
  height = 300,
  maxVal = 10,
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(centerX, centerY) - 40; // leave space for labels

  // Helper to get coordinates
  const getCoordinates = React.useCallback((value: number, index: number, max: number) => {
    const angle = (Math.PI * 2 * index) / data.length - Math.PI / 2;
    const r = (value / max) * radius;
    return {
      x: centerX + Math.cos(angle) * r,
      y: centerY + Math.sin(angle) * r,
    };
  }, [data.length, radius, centerX, centerY]);

  // Generate path string for the data polygon
  const dataPath = useMemo(() => {
    return data
      .map((item, i) => {
        const { x, y } = getCoordinates(item.value, i, maxVal);
        return `${i === 0 ? "M" : "L"} ${x},${y}`;
      })
      .concat("Z")
      .join(" ");
  }, [data, maxVal, getCoordinates]);

  // Generate background webs (e.g., at 2, 4, 6, 8, 10)
  const webs = [2, 4, 6, 8, 10].map((level) => {
    return data
      .map((_, i) => {
        const { x, y } = getCoordinates(level, i, maxVal);
        return `${i === 0 ? "M" : "L"} ${x},${y}`;
      })
      .concat("Z")
      .join(" ");
  });

  return (
    <div className="relative flex justify-center items-center">
      <svg width={width} height={height} className="overflow-visible">
        {/* Background Web */}
        {webs.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="none"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth="1"
          />
        ))}

        {/* Axis Lines */}
        {data.map((_, i) => {
          const start = getCoordinates(0, i, maxVal);
          const end = getCoordinates(maxVal, i, maxVal);
          return (
            <line
              key={i}
              x1={start.x}
              y1={start.y}
              x2={end.x}
              y2={end.y}
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Polygon with Draw-in Animation */}
        <motion.path
          d={dataPath}
          fill="rgba(255, 140, 54, 0.2)" // Brand Orange transparent
          stroke="#FF8C36" // Brand Orange
          strokeWidth="2"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Vertices (Interactive) */}
        {data.map((item, i) => {
          const { x, y } = getCoordinates(item.value, i, maxVal);
          const isHovered = hoveredIndex === i;

          return (
            <g
              key={i}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ cursor: "pointer" }}
            >
              {/* Invisible touch target area */}
              <circle cx={x} cy={y} r={12} fill="transparent" />

              {/* Visible Dot */}
              <motion.circle
                cx={x}
                cy={y}
                r={isHovered ? 6 : 4}
                fill={isHovered ? "#fff" : "#FF8C36"}
                stroke="#fff"
                strokeWidth={isHovered ? 2 : 0}
                animate={{ scale: isHovered ? 1.5 : 1 }}
              />

              {/* Label (Icon or Text) - Positioned at max radius + offset */}
              {(() => {
                const labelPos = getCoordinates(maxVal + 1.5, i, maxVal);
                return (
                  <text
                    x={labelPos.x}
                    y={labelPos.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="rgba(255,255,255,0.7)"
                    fontSize="10"
                    className="pointer-events-none uppercase tracking-wider"
                  >
                    {data.length <= 6 ? item.label : i + 1}
                  </text>
                );
              })()}
            </g>
          );
        })}
      </svg>

      {/* Tooltip / Context Info */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute bottom-0 bg-white text-[#142562] p-3 rounded-lg shadow-xl z-10 flex flex-col items-center pointer-events-none mb-4"
          >
            <div className="font-bold text-sm uppercase mb-1">
              {data[hoveredIndex].label}
            </div>
            <div className="text-2xl font-bold text-[#FF8C36]">
              {data[hoveredIndex].value}
              <span className="text-sm text-gray-400">/10</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TechRadar;
