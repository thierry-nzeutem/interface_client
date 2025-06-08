import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  borderColor?: string;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({ children, className, borderColor, hover = false }) => {
  return (
    <motion.div
      whileHover={hover ? { y: -2, boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)' } : {}}
      className={clsx(
        'bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden',
        borderColor && `border-l-4 border-l-${borderColor}`,
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;