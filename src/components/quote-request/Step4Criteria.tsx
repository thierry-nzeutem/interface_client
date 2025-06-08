import React from 'react';
import { Settings, AlertTriangle, X } from 'lucide-react';
import { useQuoteRequestStore, getRequiredCriteria, criteriaFields, subServicesData } from '../../stores/quoteRequestStore';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const Step4Criteria: React.FC = () => {
  const { formData, updateFormData, validateStep, validation } = useQuoteRequestStore();

  const requiredCriteria = getRequiredCriteria(formData.subServices);

  const handleCriteriaChange = (field: string, value: string | string[]) => {
    updateFormData({
      criteria: {
        ...formData.criteria,
        [field]: value
      }
    });
  };

  const renderCriteriaField = (criteriaKey: string) => {
    const field = criteriaFields[criteriaKey as keyof typeof criteriaFields];
    if (!field) return null;

    const value = formData.criteria[criteriaKey as keyof typeof formData.criteria];
    const hasError = validation.errors[criteriaKey];

    switch (field.type) {
      case 'select':
        return (
          <div key={criteriaKey} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} *
            </label>
            <select
              value={value as string}
              onChange={(e) => handleCriteriaChange(criteriaKey, e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner...</option>
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {hasError && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>{hasError}</span>
              </div>
            )}
          </div>
        );

      case 'multiselect':
        return (
          <div key={criteriaKey} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} *
            </label>
            <div className={`grid grid-cols-1 md:grid-cols-2 gap-2 max-h-48 overflow-y-auto border rounded-lg p-3 ${
              hasError ? 'border-red-500 bg-red-50' : 'border-gray-200'
            }`}>
              {field.options?.map((option) => (
                <label key={option.id} className="flex items-start space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={(value as string[])?.includes(option.id) || false}
                    onChange={(e) => {
                      const currentValues = (value as string[]) || [];
                      const newValues = e.target.checked
                        ? [...currentValues, option.id]
                        : currentValues.filter(v => v !== option.id);
                      handleCriteriaChange(criteriaKey, newValues);
                    }}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded mt-0.5"
                  />
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">{option.name}</div>
                    {option.description && (
                      <div className="text-gray-600">{option.description}</div>
                    )}
                  </div>
                </label>
              ))}
            </div>
            {hasError && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>{hasError}</span>
              </div>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={criteriaKey} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} *
            </label>
            <textarea
              value={value as string}
              onChange={(e) => handleCriteriaChange(criteriaKey, e.target.value)}
              placeholder={field.placeholder}
              rows={4}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {hasError && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>{hasError}</span>
              </div>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={criteriaKey} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} *
            </label>
            <input
              type="number"
              value={value as string}
              onChange={(e) => handleCriteriaChange(criteriaKey, e.target.value)}
              min={field.min}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                hasError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
            {hasError && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>{hasError}</span>
              </div>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={criteriaKey} className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              {field.label} *
            </label>
            <div className={`space-y-2 ${hasError ? 'p-3 border border-red-500 bg-red-50 rounded-lg' : ''}`}>
              {field.options?.map((option) => (
                <label key={option.value} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name={criteriaKey}
                    value={option.value}
                    checked={value === option.value}
                    onChange={(e) => handleCriteriaChange(criteriaKey, e.target.value)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                  />
                  <span className="text-sm text-gray-700">{option.label}</span>
                </label>
              ))}
            </div>
            {hasError && (
              <div className="flex items-center space-x-2 text-red-600 text-sm">
                <AlertTriangle className="h-4 w-4" />
                <span>{hasError}</span>
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  React.useEffect(() => {
    validateStep(4);
  }, [formData.criteria, validateStep]);

  // Si c'est une consultation téléphonique, pas de critères
  if (formData.mainService === 'phone-consultation') {
    return (
      <Card className="p-6 text-center">
        <div className="bg-blue-100 text-blue-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Settings className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucun critère supplémentaire requis
        </h3>
        <p className="text-gray-600">
          Pour une consultation téléphonique, aucun critère technique supplémentaire n'est nécessaire.
          Vous pouvez passer à l'étape suivante.
        </p>
      </Card>
    );
  }

  if (requiredCriteria.length === 0) {
    return (
      <Card className="p-6 text-center">
        <div className="bg-green-100 text-green-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
          <Settings className="h-8 w-8" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Aucun critère supplémentaire requis
        </h3>
        <p className="text-gray-600">
          Les sous-prestations sélectionnées ne nécessitent pas de critères techniques supplémentaires.
          Vous pouvez passer à l'étape suivante.
        </p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Erreurs globales */}
      {Object.keys(validation.errors).length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900 mb-2">
                Formulaire incomplet
              </h4>
              <p className="text-sm text-red-800 mb-3">
                Veuillez renseigner les champs suivants pour continuer :
              </p>
              <ul className="space-y-1">
                {Object.entries(validation.errors).map(([field, error]) => (
                  <li key={field} className="flex items-center space-x-2 text-sm text-red-700">
                    <X className="h-3 w-3" />
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Settings className="h-6 w-6 text-red-500" />
          <h2 className="text-xl font-semibold text-gray-900">
            Critères spécifiques
          </h2>
        </div>
        
        <p className="text-gray-600 mb-6">
          Renseignez les critères techniques nécessaires pour vos sous-prestations sélectionnées.
        </p>

        {/* Sous-prestations concernées */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">
            Sous-prestations concernées
          </h3>
          <div className="flex flex-wrap gap-2">
            {formData.subServices.map(subServiceId => {
              const subService = subServicesData[subServiceId];
              return subService ? (
                <Badge key={subServiceId} variant="info" size="sm">
                  {subService.name}
                </Badge>
              ) : null;
            })}
          </div>
        </div>

        {/* Critères dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {requiredCriteria.map(criteriaKey => renderCriteriaField(criteriaKey))}
        </div>
      </Card>

      {/* Information sur les critères */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900 mb-1">
              Pourquoi ces critères ?
            </h4>
            <p className="text-sm text-blue-800">
              Ces informations nous permettent d'établir un devis précis et adapté à votre projet. 
              Plus les détails sont précis, plus notre estimation sera juste.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step4Criteria;