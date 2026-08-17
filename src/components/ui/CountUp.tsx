import React, { useEffect, useState } from "react";
import { motion, useMotionValue, useTransform, animate } from "motion/react";

interface Props {
  value: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

export default function CountUp({
  value,
  duration = 1.5,
  decimals = 0,
  prefix = "",
  suffix = "",
  className = "",
}: Props) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    // Only animate once to prevent annoying re-triggers unless the target value drastically changes
    const controls = animate(count, value, {
      duration,
      ease: [0.25, 0.1, 0.25, 1], // cubic-bezier smooth ease-out
      onComplete: () => setHasAnimated(true)
    });
    return controls.stop;
  }, [value, duration, count]);

  return (
    <motion.span className={className}>
      {prefix}<motion.span>{rounded}</motion.span>{suffix}
    </motion.span>
  );
}
