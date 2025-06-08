import React from 'react';
import { FileText, User, Clock, AlertTriangle } from 'lucide-react';
import { useQuoteRequestStore } from '../../stores/quoteRequestStore';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const Step4Project: React.FC = () => {
  const { formData, updateFormData, validateStep } = useQuoteRequestStore();

  const handleProjectChange = (field: string, value: string | boolean) => {
    updateFormData({
      project: {
        ...formData.project,
        [field]: value
      }
    });
  };

  React.useEffect(() => {
    validateStep(4);
  }, [formData.project, validateStep]);

  return (
    <div className="space-y-6">
      {/* Plans Availability */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Disponibilité des plans
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              value: 'none',
              title: 'Aucun plan',
              description: 'Relevé nécessaire',
              badge: 'Relevé requis'
            },
            {
              value: 'paper',
              title: 'Plans papier',
              description: 'Plans existants sur papier',
              badge: 'Numérisation'
            },
            {
              value: 'pdf',
              title: 'Plans PDF',
              description: 'Plans numérisés disponibles',
              badge: 'Prêt'
            },
            {
              value: 'dwg',
              title: 'Plans DWG/CAD',
              description: 'Plans techniques modifiables',
              badge: 'Optimal'
            }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleProjectChange('hasPlans', option.value)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                formData.project.hasPlans === option.value
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="mb-3">
                <Badge 
                  variant={option.value === 'dwg' ? 'success' : option.value === 'pdf' ? 'info' : 'warning'} 
                  size="sm"
                >
                  {option.badge}
                </Badge>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">{option.title}</h3>
              <p className="text-sm text-gray-600">{option.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Architect Information */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <User className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Architecte
          </h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <label className="flex items-center space-x-3">
              <input
                type="checkbox"
                checked={formData.project.hasArchitect}
                onChange={(e) => handleProjectChange('hasArchitect', e.target.checked)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
              />
              <span className="text-gray-700">Un architecte est impliqué dans ce projet</span>
            </label>
          </div>
          
          {formData.project.hasArchitect && (
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'architecte ou du cabinet
              </label>
              <input
                type="text"
                value={formData.project.architectName || ''}
                onChange={(e) => handleProjectChange('architectName', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Nom de l'architecte ou du cabinet d'architecture"
              />
            </div>
          )}
        </div>
      </Card>

      {/* Project Description */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Description du projet
        </h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Décrivez votre projet en détail *
            </label>
            <textarea
              value={formData.project.description}
              onChange={(e) => handleProjectChange('description', e.target.value)}
              rows={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Décrivez les travaux envisagés, les modifications prévues, les contraintes particulières, etc."
            />
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Informations utiles à mentionner :</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Nature des travaux (rénovation, extension, changement d'activité...)</li>
              <li>• Modifications de la structure ou des circulations</li>
              <li>• Changements d'effectifs ou de capacité d'accueil</li>
              <li>• Contraintes particulières (bâtiment classé, zone protégée...)</li>
              <li>• Échéances importantes à respecter</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Urgency */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Clock className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Urgence du projet
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              value: 'standard',
              title: 'Standard',
              description: 'Délais normaux (4-6 semaines)',
              color: 'green'
            },
            {
              value: 'urgent',
              title: 'Urgent',
              description: 'Délais réduits (2-3 semaines)',
              color: 'orange'
            },
            {
              value: 'tres_urgent',
              title: 'Très urgent',
              description: 'Délais express (1-2 semaines)',
              color: 'red'
            }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleProjectChange('urgency', option.value)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                formData.project.urgency === option.value
                  ? `border-${option.color}-500 bg-${option.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center space-x-2 mb-2">
                <h3 className="font-medium text-gray-900">{option.title}</h3>
                {option.value !== 'standard' && (
                  <AlertTriangle className={`h-4 w-4 text-${option.color}-500`} />
                )}
              </div>
              <p className="text-sm text-gray-600">{option.description}</p>
              {option.value !== 'standard' && (
                <p className="text-xs text-orange-600 mt-2">
                  Supplément urgence applicable
                </p>
              )}
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Step4Project;