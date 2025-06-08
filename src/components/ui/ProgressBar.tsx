import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface ProgressBarProps {
  currentStep: number;
  totalSteps: number;
  stepLabels?: string[];
}

const ProgressBar: React.FC<ProgressBarProps> = ({ 
  currentStep, 
  totalSteps, 
  stepLabels 
}) => {
  const progress = (currentStep / totalSteps) * 100;

  const defaultLabels = Array.from({ length: totalSteps }, (_, i) => `Étape ${i + 1}`);
  const labels = stepLabels || defaultLabels;

  return (
    <div className="w-full">
      {/* Progress bar */}
      <div className="relative mb-8">
        <div className="flex items-center justify-between mb-2">
          {labels.map((label, index) => {
            const stepNumber = index + 1;
            const isCompleted = stepNumber < currentStep;
            const isCurrent = stepNumber === currentStep;
            
            return (
              <div key={index} className="flex flex-col items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors ${
                    isCompleted
                      ? 'bg-green-500 text-white'
                      : isCurrent
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    stepNumber
                  )}
                </div>
                <span className={`text-xs mt-2 text-center max-w-20 ${
                  isCurrent ? 'text-red-600 font-medium' : 'text-gray-500'
                }`}>
                  {label}
                </span>
              </div>
            );
          })}
        </div>
        
        {/* Progress line */}
        <div className="absolute top-4 left-4 right-4 h-0.5 bg-gray-200 -z-10">
          <motion.div
            className="h-full bg-red-500"
            initial={{ width: 0 }}
            animate={{ width: `${Math.max(0, (currentStep - 1) / (totalSteps - 1) * 100)}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;