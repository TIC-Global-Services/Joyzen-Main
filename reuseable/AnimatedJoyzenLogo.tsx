'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';

interface AnimatedJoyzenLogoProps {
  /** Fill color of the SVG vectors. Defaults to #AEDEE4 (brand light cyan/blue). */
  fillColor?: string;
  /** Custom CSS classes on wrapper SVG. */
  className?: string;
  /** Base animation delay in seconds. */
  delay?: number;
  /** Width in pixels or CSS string (optional if controlled by className). */
  width?: number | string;
  /** Height in pixels or CSS string (optional if controlled by className). */
  height?: number | string;
  /** Whether animation triggers only once or every time scrolled into view. Default is false. */
  once?: boolean;
  /** Viewport visibility threshold (0 to 1). Default is 0.3. */
  amount?: number | 'some' | 'all';
}

export default function AnimatedJoyzenLogo({
  fillColor = '#AEDEE4',
  className = '',
  delay = 0,
  width,
  height,
  once = false,
  amount = 0.3,
}: AnimatedJoyzenLogoProps) {
  // Stagger variants for vector paths
  const containerVariants: Variants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: delay,
      },
    },
  };

  // Top Dot (elastic scale pop)
  const topDotVariants: Variants = {
    hidden: { opacity: 0, scale: 0, y: -10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1], // Spring-like bounce
      },
    },
  };

  // Top Bar (smooth slide & expand from left)
  const topBarVariants: Variants = {
    hidden: { opacity: 0, scaleX: 0.3, x: -25 },
    visible: {
      opacity: 1,
      scaleX: 1,
      x: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Bottom Bar (smooth slide & expand from right)
  const bottomBarVariants: Variants = {
    hidden: { opacity: 0, scaleX: 0.3, x: 25 },
    visible: {
      opacity: 1,
      scaleX: 1,
      x: 0,
      transition: {
        duration: 0.65,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Bottom Dot (elastic scale pop)
  const bottomDotVariants: Variants = {
    hidden: { opacity: 0, scale: 0, y: 10 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.34, 1.56, 0.64, 1], // Spring-like bounce
      },
    },
  };

  return (
    <motion.svg
      width={width || 100}
      height={height || 150}
      viewBox="0 0 100 150"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible ${className}`}
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      {/* 1. Top Dot */}
      <motion.path
        d="M49.8556 33.7418C40.6414 33.7418 32.8594 26.08 32.8594 17.0144C32.8594 7.9488 40.6477 0 49.8556 0C59.0634 0 67.1369 7.63059 67.1369 17.0144C67.1369 26.3982 59.2219 33.7418 49.8556 33.7418Z"
        fill={fillColor}
        style={{ transformOrigin: '50px 17px' }}
        variants={topDotVariants}
      />

      {/* 2. Top Bar */}
      <motion.path
        d="M41.9455 70.424C19.2459 70.424 4.49303 60.6846 0 42.8965L100 42.9589V70.424H41.9455Z"
        fill={fillColor}
        style={{ transformOrigin: '50px 56.5px' }}
        variants={topBarVariants}
      />

      {/* 3. Bottom Bar */}
      <motion.path
        d="M0 107.045V79.5801H58.0545C80.7541 79.5801 95.507 89.3195 100 107.108L0 107.045Z"
        fill={fillColor}
        style={{ transformOrigin: '50px 93.3px' }}
        variants={bottomBarVariants}
      />

      {/* 4. Bottom Dot */}
      <motion.path
        d="M50.1446 150C40.6136 150 32.8633 142.369 32.8633 132.985C32.8633 123.601 40.7784 116.258 50.1446 116.258C59.5109 116.258 67.1345 123.92 67.1345 132.985C67.1345 142.051 59.3525 150 50.1446 150Z"
        fill={fillColor}
        style={{ transformOrigin: '50px 133px' }}
        variants={bottomDotVariants}
      />
    </motion.svg>
  );
}

