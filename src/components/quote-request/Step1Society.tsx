import React from 'react';
import { Building, Plus, Check, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useQuoteRequestStore } from '../../stores/quoteRequestStore';
import { useToastStore } from '../ui/Toast';
import Card from '../ui/Card';
import Button from '../ui/Button';
import SiretInput from '../ui/SiretInput';

const Step1Society: React.FC = () => {
  const { user } = useAuthStore();
  const { formData, updateFormData, validateStep, validation } = useQuoteRequestStore();
  const { addToast } = useToastStore();

  const handleSocietySelect = (societyId: string) => {
    const society = user?.companies.find(c => c.id === societyId);
    if (society) {
      updateFormData({
        society: {
          id: societyId,
          isNew: false,
          details: society
        }
      });
      
      addToast({
        type: 'success',
        title: 'Société sélectionnée',
        message: `${society.name} a été sélectionnée`
      });
    }
  };

  const handleNewSociety = () => {
    updateFormData({
      society: {
        id: null,
        isNew: true,
        details: {}
      }
    });
    
    addToast({
      type: 'info',
      title: 'Nouvelle société',
      message: 'Formulaire de création activé'
    });
  };

  const handleEstablishmentChange = (field: string, value: string) => {
    updateFormData({
      establishment: {
        ...formData.establishment,
        [field]: value
      }
    });
  };

  const handleSiretValidation = (isValid: boolean, data?: any) => {
    if (isValid && data) {
      updateFormData({
        society: {
          ...formData.society,
          details: {
            ...formData.society.details,
            name: data.denomination,
            address: data.adresse,
            activity: data.activite,
            siret: formData.society.details.siret || ''
          }
        }
      });
    }
  };

  React.useEffect(() => {
    validateStep(1);
  }, [formData.society, formData.establishment, validateStep]);

  return (
    <div className="space-y-6">
      {/* Erreurs globales */}
      {Object.keys(validation.errors).length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900 mb-2">
                Informations manquantes
              </h4>
              <p className="text-sm text-red-800 mb-3">
                Veuillez compléter les champs suivants :
              </p>
              <ul className="space-y-1">
                {Object.entries(validation.errors).map(([field, error]) => (
                  <li key={field} className="flex items-center space-x-2 text-sm text-red-700">
                    <div className="w-1 h-1 bg-red-600 rounded-full"></div>
                    <span>{error}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Card>
      )}

      {/* Society Selection */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          1. Sélection de la société
        </h2>
        
        <div className="space-y-4">
          {/* Existing societies */}
          {user?.companies && user.companies.length > 0 && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-3">
                Sociétés existantes
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {user.companies.map((company) => (
                  <button
                    key={company.id}
                    onClick={() => handleSocietySelect(company.id)}
                    className={`p-4 border-2 rounded-lg text-left transition-all hover:border-red-300 ${
                      formData.society.id === company.id
                        ? 'border-red-500 bg-red-50'
                        : 'border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="bg-blue-100 text-blue-600 rounded-lg p-2">
                          <Building className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{company.name}</h4>
                          <p className="text-sm text-gray-600">SIRET: {company.siret}</p>
                        </div>
                      </div>
                      {formData.society.id === company.id && (
                        <Check className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* New society option */}
          <div className="border-t border-gray-200 pt-4">
            <button
              onClick={handleNewSociety}
              className={`w-full p-4 border-2 border-dashed rounded-lg text-center transition-all hover:border-red-300 ${
                formData.society.isNew
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-300'
              }`}
            >
              <div className="flex items-center justify-center space-x-2">
                <Plus className="h-5 w-5 text-gray-500" />
                <span className="text-gray-700 font-medium">
                  Créer une nouvelle société
                </span>
              </div>
            </button>
          </div>
        </div>
      </Card>

      {/* New Society Form */}
      {formData.society.isNew && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Informations de la nouvelle société
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SIRET de la société *
              </label>
              <SiretInput
                value={formData.society.details.siret || ''}
                onChange={(value) => updateFormData({
                  society: {
                    ...formData.society,
                    details: { ...formData.society.details, siret: value }
                  }
                })}
                onValidation={handleSiretValidation}
              />
              {validation.errors.societySiret && (
                <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{validation.errors.societySiret}</span>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison sociale *
              </label>
              <input
                type="text"
                value={formData.society.details.name || ''}
                onChange={(e) => updateFormData({
                  society: {
                    ...formData.society,
                    details: { ...formData.society.details, name: e.target.value }
                  }
                })}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  validation.errors.societyName ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
                placeholder="Nom de la société"
              />
              {validation.errors.societyName && (
                <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                  <AlertTriangle className="h-4 w-4" />
                  <span>{validation.errors.societyName}</span>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Secteur d'activité *
              </label>
              <input
                type="text"
                value={formData.society.details.activity || ''}
                onChange={(e) => updateFormData({
                  society: {
                    ...formData.society,
                    details: { ...formData.society.details, activity: e.target.value }
                  }
                })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Ex: Restauration, Hôtellerie..."
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Adresse du siège social *
              </label>
              <textarea
                value={formData.society.details.address || ''}
                onChange={(e) => updateFormData({
                  society: {
                    ...formData.society,
                    details: { ...formData.society.details, address: e.target.value }
                  }
                })}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Adresse complète du siège social"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Establishment Information */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          2. Informations de l'établissement
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de l'établissement *
            </label>
            <input
              type="text"
              value={formData.establishment.name}
              onChange={(e) => handleEstablishmentChange('name', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                validation.errors.establishmentName ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Ex: Restaurant Le Gourmet"
            />
            {validation.errors.establishmentName && (
              <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                <AlertTriangle className="h-4 w-4" />
                <span>{validation.errors.establishmentName}</span>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type d'activité *
            </label>
            <select
              value={formData.establishment.activity}
              onChange={(e) => handleEstablishmentChange('activity', e.target.value)}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                validation.errors.establishmentActivity ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Sélectionner une activité</option>
              <option value="restaurant">Restaurant</option>
              <option value="hotel">Hôtel</option>
              <option value="commerce">Commerce</option>
              <option value="bureau">Bureau</option>
              <option value="industrie">Industrie</option>
              <option value="autre">Autre</option>
            </select>
            {validation.errors.establishmentActivity && (
              <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                <AlertTriangle className="h-4 w-4" />
                <span>{validation.errors.establishmentActivity}</span>
              </div>
            )}
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Adresse de l'établissement *
            </label>
            <textarea
              value={formData.establishment.address}
              onChange={(e) => handleEstablishmentChange('address', e.target.value)}
              rows={3}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                validation.errors.establishmentAddress ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Adresse complète de l'établissement"
            />
            {validation.errors.establishmentAddress && (
              <div className="flex items-center space-x-2 text-red-600 text-sm mt-1">
                <AlertTriangle className="h-4 w-4" />
                <span>{validation.errors.establishmentAddress}</span>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Superficie approximative (m²)
            </label>
            <input
              type="number"
              value={formData.establishment.surface}
              onChange={(e) => handleEstablishmentChange('surface', e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Ex: 150"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description (optionnel)
            </label>
            <textarea
              value={formData.establishment.description || ''}
              onChange={(e) => handleEstablishmentChange('description', e.target.value)}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              placeholder="Description de l'établissement ou du projet"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step1Society;