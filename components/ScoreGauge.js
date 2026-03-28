"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ScoreGauge({ score = 0 }) {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = score;
    const duration = 1200;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = (end - start) / steps;
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= end) {
        current = end;
        clearInterval(timer);
      }
      setAnimatedScore(Math.round(current));
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (animatedScore / 100) * circumference;

  const getColor = (s) => {
    if (s >= 86) return "#00D68F";
    if (s >= 70) return "#4D9AFF";
    if (s >= 50) return "#FFB800";
    return "#FF4D4D";
  };

  const getLabel = (s) => {
    if (s >= 86) return "Excellent";
    if (s >= 70) return "Good";
    if (s >= 50) return "Needs Work";
    return "Poor";
  };

  const color = getColor(animatedScore);

  return (
    <div className="score-gauge">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* Background circle */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke="var(--dark-gray-2)"
          strokeWidth="10"
        />
        {/* Score arc */}
        <motion.circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          style={{ filter: `drop-shadow(0 0 6px ${color}40)` }}
        />
        {/* Glow effect */}
        <circle
          cx="70"
          cy="70"
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 70 70)"
          opacity="0.3"
          style={{ filter: `blur(4px)` }}
        />
      </svg>

      <div className="score-text">
        <motion.span
          className="score-number"
          style={{ color }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, type: "spring" }}
        >
          {animatedScore}
        </motion.span>
        <span className="score-label" style={{ color }}>{getLabel(animatedScore)}</span>
      </div>

      <style jsx>{`
        .score-gauge {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 140px;
          height: 140px;
        }
        .score-text {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
        }
        .score-number {
          font-size: 36px;
          font-weight: 800;
          letter-spacing: -1px;
          line-height: 1;
        }
        .score-label {
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
      `}</style>
    </div>
  );
}
