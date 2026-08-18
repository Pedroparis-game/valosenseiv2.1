import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'motion/react';
import { useRef } from 'react';

interface AnimatedCounterProps {
  value: number;
  duration?: number;
  decimals?: number;
  suffix?: string;
  prefix?: string;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ 
  value, 
  duration = 1.2, 
  decimals = 0,
  suffix = '',
  prefix = '',
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-10%" });
  const [hasCompleted, setHasCompleted] = useState(false);

  useEffect(() => {
    if (isInView) {
      let startTimestamp: number | null = null;
      
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / (duration * 1000), 1);
        
        // Elastic/overshoot easing
        const c1 = 1.70158;
        const c3 = c1 + 1;
        const easeProgress = progress === 1 ? 1 : 1 + c3 * Math.pow(progress - 1, 3) + c1 * Math.pow(progress - 1, 2);
        
        setDisplayValue(easeProgress * value);
        
        if (progress < 1) {
          window.requestAnimationFrame(step);
        } else {
          setDisplayValue(value);
          setHasCompleted(true);
        }
      };
      
      window.requestAnimationFrame(step);
    }
  }, [value, duration, isInView]);

  return (
    <span ref={ref} className={`relative inline-block ${className}`}>
      {prefix}{displayValue.toFixed(decimals)}{suffix}
      {hasCompleted && (
        <motion.span
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 0.4 }}
          className="absolute inset-0 text-accent-success pointer-events-none mix-blend-screen blur-[2px]"
        >
          {prefix}{displayValue.toFixed(decimals)}{suffix}
        </motion.span>
      )}
    </span>
  );
};
