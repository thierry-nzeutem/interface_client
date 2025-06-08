import React from 'react';
import { Check, Star, Euro, Clock } from 'lucide-react';
import { useQuoteRequestStore, mockPrestations, templateAT } from '../../stores/quoteRequestStore';
import { useToastStore } from '../ui/Toast';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const Step2Prestations: React.FC = () => {
  const { formData, updateFormData, validateStep } = useQuoteRequestStore();
  const { addToast } = useToastStore();

  const handlePrestationToggle = (prestationId: string) => {
    const isSelected = formData.prestations.includes(prestationId);
    const newPrestations = isSelected
      ? formData.prestations.filter(id => id !== prestationId)
      : [...formData.prestations, prestationId];

    updateFormData({ prestations: newPrestations });
    
    const prestation = mockPrestations.find(p => p.id === prestationId);
    addToast({
      type: isSelected ? 'info' : 'success',
      title: isSelected ? 'Prestation retirée' : 'Prestation ajoutée',
      message: `${prestation?.name} ${isSelected ? 'retirée de' : 'ajoutée à'} votre sélection`
    });
  };

  const handleTemplateToggle = () => {
    const newUseTemplate = !formData.useTemplate;
    const newPrestations = newUseTemplate ? templateAT : [];
    
    updateFormData({
      useTemplate: newUseTemplate,
      prestations: newPrestations
    });

    addToast({
      type: 'info',
      title: newUseTemplate ? 'Template AT activé' : 'Template AT désactivé',
      message: newUseTemplate 
        ? 'Prestations standard pour Autorisation de Travaux sélectionnées'
        : 'Sélection personnalisée activée'
    });
  };

  const getTotalPrice = () => {
    return formData.prestations.reduce((total, prestationId) => {
      const prestation = mockPrestations.find(p => p.id === prestationId);
      return total + (prestation?.estimatedPrice || 0);
    }, 0);
  };

  React.useEffect(() => {
    validateStep(2);
  }, [formData.prestations, validateStep]);

  return (
    <div className="space-y-6">
      {/* Template AT */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-500 text-white rounded-lg p-3">
            <Star className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              Template Autorisation de Travaux (Recommandé)
            </h3>
            <p className="text-blue-800 mb-4">
              Sélection automatique des prestations essentielles pour une demande d'Autorisation de Travaux complète.
            </p>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Badge variant="success" size="sm">
                  Prestations incluses: {templateAT.length}
                </Badge>
                <div className="flex items-center text-blue-700">
                  <Euro className="h-4 w-4 mr-1" />
                  <span className="font-semibold">
                    {templateAT.reduce((total, id) => {
                      const prestation = mockPrestations.find(p => p.id === id);
                      return total + (prestation?.estimatedPrice || 0);
                    }, 0)}€ HT
                  </span>
                </div>
              </div>
              
              <Button
                variant={formData.useTemplate ? "primary" : "secondary"}
                onClick={handleTemplateToggle}
              >
                {formData.useTemplate ? (
                  <>
                    <Check className="h-4 w-4 mr-2" />
                    Template activé
                  </>
                ) : (
                  'Utiliser le template'
                )}
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Prestations Selection */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Sélection des prestations
          </h2>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {formData.prestations.length} prestation{formData.prestations.length > 1 ? 's' : ''} sélectionnée{formData.prestations.length > 1 ? 's' : ''}
            </p>
            <p className="text-lg font-semibold text-red-600">
              Total: {getTotalPrice()}€ HT
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mockPrestations.map((prestation) => {
            const isSelected = formData.prestations.includes(prestation.id);
            const isTemplateItem = templateAT.includes(prestation.id);
            
            return (
              <div
                key={prestation.id}
                className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handlePrestationToggle(prestation.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isSelected
                        ? 'border-red-500 bg-red-500'
                        : 'border-gray-300'
                    }`}>
                      {isSelected && <Check className="h-3 w-3 text-white" />}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{prestation.name}</h3>
                      {isTemplateItem && (
                        <Badge variant="info" size="sm" className="mt-1">
                          Template AT
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{prestation.estimatedPrice}€</p>
                    <p className="text-xs text-gray-500">HT</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {prestation.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {prestation.duration}
                  </div>
                  <Badge variant="info" size="sm">
                    {prestation.category}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Summary */}
      {formData.prestations.length > 0 && (
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            Récapitulatif de votre sélection
          </h3>
          
          <div className="space-y-2 mb-4">
            {formData.prestations.map(prestationId => {
              const prestation = mockPrestations.find(p => p.id === prestationId);
              return prestation ? (
                <div key={prestationId} className="flex items-center justify-between">
                  <span className="text-green-800">{prestation.name}</span>
                  <span className="font-medium text-green-900">{prestation.estimatedPrice}€ HT</span>
                </div>
              ) : null;
            })}
          </div>
          
          <div className="border-t border-green-200 pt-3">
            <div className="flex items-center justify-between text-lg font-semibold text-green-900">
              <span>Total estimé</span>
              <span>{getTotalPrice()}€ HT</span>
            </div>
            <p className="text-sm text-green-700 mt-1">
              TVA 20% : {Math.round(getTotalPrice() * 0.2)}€ • 
              Total TTC : {Math.round(getTotalPrice() * 1.2)}€
            </p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Step2Prestations;