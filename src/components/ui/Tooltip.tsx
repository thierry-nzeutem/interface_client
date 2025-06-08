import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: {
    definition: string;
    example?: string;
    learnMore?: string;
  };
  children?: React.ReactNode;
}

const Tooltip: React.FC<TooltipProps> = ({ content, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => setIsVisible(!isVisible)}
        className="text-gray-400 hover:text-red-500 transition-colors ml-1"
        aria-label="Aide contextuelle"
      >
        {children || <HelpCircle className="h-4 w-4" />}
      </button>
      
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-80 p-4 bg-white border border-gray-200 rounded-lg shadow-lg bottom-full left-1/2 transform -translate-x-1/2 mb-2"
          >
            <div className="space-y-3">
              <div>
                <h4 className="font-medium text-gray-900 mb-1">Définition</h4>
                <p className="text-sm text-gray-700">{content.definition}</p>
              </div>
              
              {content.example && (
                <div>
                  <h4 className="font-medium text-gray-900 mb-1">Exemple</h4>
                  <p className="text-sm text-gray-600 italic">{content.example}</p>
                </div>
              )}
              
              {content.learnMore && (
                <div>
                  <button className="text-sm text-red-600 hover:text-red-700 font-medium">
                    {content.learnMore} →
                  </button>
                </div>
              )}
            </div>
            
            {/* Arrow */}
            <div className="absolute top-full left-1/2 transform -translate-x-1/2">
              <div className="border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white"></div>
              <div className="border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-gray-200 -mt-px"></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tooltip;