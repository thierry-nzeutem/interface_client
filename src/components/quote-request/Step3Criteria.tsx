import React from 'react';
import { MapPin, Ruler, Zap, Building } from 'lucide-react';
import { useQuoteRequestStore, shouldShowDistance, erpTypes } from '../../stores/quoteRequestStore';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const Step3Criteria: React.FC = () => {
  const { formData, updateFormData, validateStep } = useQuoteRequestStore();

  const handleCriteriaChange = (field: string, value: string | string[]) => {
    updateFormData({
      criteria: {
        ...formData.criteria,
        [field]: value
      }
    });
  };

  const handleErpTypeToggle = (erpId: string) => {
    const currentTypes = formData.criteria.erpTypes;
    const newTypes = currentTypes.includes(erpId)
      ? currentTypes.filter(id => id !== erpId)
      : [...currentTypes, erpId];
    
    handleCriteriaChange('erpTypes', newTypes);
  };

  const showDistance = shouldShowDistance(formData);

  React.useEffect(() => {
    validateStep(3);
  }, [formData.criteria, validateStep]);

  return (
    <div className="space-y-6">
      {/* Project Complexity */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Zap className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Complexité du projet
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              value: 'simple',
              title: 'Simple',
              description: 'Projet standard sans contraintes particulières',
              color: 'green'
            },
            {
              value: 'moyen',
              title: 'Moyen',
              description: 'Quelques contraintes techniques ou réglementaires',
              color: 'orange'
            },
            {
              value: 'complexe',
              title: 'Complexe',
              description: 'Contraintes importantes, bâtiment classé, etc.',
              color: 'red'
            }
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => handleCriteriaChange('complexity', option.value)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                formData.criteria.complexity === option.value
                  ? `border-${option.color}-500 bg-${option.color}-50`
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h3 className="font-medium text-gray-900 mb-2">{option.title}</h3>
              <p className="text-sm text-gray-600">{option.description}</p>
            </button>
          ))}
        </div>
      </Card>

      {/* Surface and Distance */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Surface */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Ruler className="h-6 w-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">
              Superficie totale
            </h3>
          </div>
          
          <div className="space-y-3">
            {[
              { value: '0-100', label: 'Moins de 100 m²' },
              { value: '100-300', label: '100 à 300 m²' },
              { value: '300-500', label: '300 à 500 m²' },
              { value: '500-1000', label: '500 à 1000 m²' },
              { value: '1000+', label: 'Plus de 1000 m²' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3">
                <input
                  type="radio"
                  name="surface"
                  value={option.value}
                  checked={formData.criteria.surface === option.value}
                  onChange={(e) => handleCriteriaChange('surface', e.target.value)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        </Card>

        {/* Distance */}
        {showDistance && (
          <Card className="p-6">
            <div className="flex items-center space-x-3 mb-4">
              <MapPin className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">
                Distance depuis Paris
              </h3>
            </div>
            
            <div className="space-y-3">
              {[
                { value: '0-50', label: 'Moins de 50 km' },
                { value: '50-100', label: '50 à 100 km' },
                { value: '100-200', label: '100 à 200 km' },
                { value: '200+', label: 'Plus de 200 km' }
              ].map((option) => (
                <label key={option.value} className="flex items-center space-x-3">
                  <input
                    type="radio"
                    name="distance"
                    value={option.value}
                    checked={formData.criteria.distance === option.value}
                    onChange={(e) => handleCriteriaChange('distance', e.target.value)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* ERP Types */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Building className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Types d'ERP concernés
          </h2>
        </div>
        
        <p className="text-gray-600 mb-4">
          Sélectionnez tous les types d'Établissements Recevant du Public concernés par votre projet.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {erpTypes.map((erp) => (
            <button
              key={erp.id}
              onClick={() => handleErpTypeToggle(erp.id)}
              className={`p-3 border rounded-lg text-left transition-all ${
                formData.criteria.erpTypes.includes(erp.id)
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-start space-x-3">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                  formData.criteria.erpTypes.includes(erp.id)
                    ? 'border-red-500 bg-red-500'
                    : 'border-gray-300'
                }`}>
                  {formData.criteria.erpTypes.includes(erp.id) && (
                    <div className="w-2 h-2 bg-white rounded-full" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <Badge variant="info" size="sm">Type {erp.id}</Badge>
                  </div>
                  <p className="text-sm text-gray-700">{erp.name}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* ERP Category */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Catégorie d'ERP
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { value: '1', label: '1ère catégorie', description: '> 1500 personnes' },
            { value: '2', label: '2ème catégorie', description: '701 à 1500 personnes' },
            { value: '3', label: '3ème catégorie', description: '301 à 700 personnes' },
            { value: '4', label: '4ème catégorie', description: '< 300 personnes' },
            { value: '5', label: '5ème catégorie', description: '< seuils 4ème cat.' }
          ].map((category) => (
            <button
              key={category.value}
              onClick={() => handleCriteriaChange('erpCategory', category.value)}
              className={`p-3 border-2 rounded-lg text-center transition-all ${
                formData.criteria.erpCategory === category.value
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <h4 className="font-medium text-gray-900 mb-1">{category.label}</h4>
              <p className="text-xs text-gray-600">{category.description}</p>
            </button>
          ))}
        </div>
      </Card>
    </div>
  );
};

export default Step3Criteria;