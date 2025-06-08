import React from 'react';
import { motion } from 'framer-motion';
import { useLanguageStore } from '../../stores/languageStore';

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguageStore();

  return (
    <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLanguage('fr')}
        className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
          language === 'fr'
            ? 'bg-red-500 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        🇫🇷 FR
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setLanguage('en')}
        className={`px-2 py-1 rounded text-sm font-medium transition-colors ${
          language === 'en'
            ? 'bg-red-500 text-white shadow-sm'
            : 'text-gray-600 hover:text-gray-800'
        }`}
      >
        🇬🇧 EN
      </motion.button>
    </div>
  );
};

export default LanguageSelector;