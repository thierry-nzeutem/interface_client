import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Search, Book, Video, MessageCircle, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

interface HelpPanelProps {
  onClose: () => void;
}

const helpTopics = [
  {
    id: '1',
    title: 'Créer une demande d\'Autorisation de Travaux',
    category: 'Démarches',
    description: 'Guide complet pour créer votre première demande AT',
    type: 'guide'
  },
  {
    id: '2',
    title: 'Comprendre les classifications ERP',
    category: 'Réglementation',
    description: 'Explication des catégories et types d\'établissements',
    type: 'video'
  },
  {
    id: '3',
    title: 'Suivi de projet et échéances',
    category: 'Gestion',
    description: 'Comment suivre l\'avancement de vos projets',
    type: 'guide'
  },
  {
    id: '4',
    title: 'Signature électronique des documents',
    category: 'Documents',
    description: 'Processus de signature et validation légale',
    type: 'guide'
  }
];

const HelpPanel: React.FC<HelpPanelProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const filteredTopics = helpTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
    (selectedCategory === '' || topic.category === selectedCategory)
  );

  const categories = [...new Set(helpTopics.map(topic => topic.category))];

  return (
    <div className="bg-white h-full shadow-xl border-l border-gray-200 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Centre d'aide</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher de l'aide..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          />
        </div>
      </div>

      {/* Categories */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory('')}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
              selectedCategory === '' 
                ? 'bg-red-100 text-red-700' 
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            Tous
          </button>
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                selectedCategory === category 
                  ? 'bg-red-100 text-red-700' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredTopics.map(topic => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="cursor-pointer"
          >
            <Card hover className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    {topic.type === 'video' ? (
                      <Video className="h-4 w-4 text-red-500" />
                    ) : (
                      <Book className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-xs text-gray-500 font-medium">
                      {topic.category}
                    </span>
                  </div>
                  <h3 className="font-medium text-gray-900 mb-1">
                    {topic.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {topic.description}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-gray-400 ml-2" />
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Contact Support */}
      <div className="p-4 border-t border-gray-200">
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <MessageCircle className="h-5 w-5 text-red-500" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900">Besoin d'aide ?</h4>
              <p className="text-sm text-red-700">Contactez notre équipe</p>
            </div>
          </div>
          <Button variant="primary" size="sm" className="w-full mt-3">
            Contacter le support
          </Button>
        </Card>
      </div>
    </div>
  );
};

export default HelpPanel;