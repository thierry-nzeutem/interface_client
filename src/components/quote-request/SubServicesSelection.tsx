import React from 'react';
import { Check, Euro, Clock } from 'lucide-react';
import { useQuoteRequestStore, mainServices, subServicesData } from '../../stores/quoteRequestStore';
import { useToastStore } from '../ui/Toast';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const SubServicesSelection: React.FC = () => {
  const { formData, updateFormData, validateStep } = useQuoteRequestStore();
  const { addToast } = useToastStore();

  const selectedMainService = mainServices.find(s => s.id === formData.mainService);
  const availableSubServices = selectedMainService?.subServices || [];

  const handleSubServiceToggle = (subServiceId: string) => {
    const isSelected = formData.subServices.includes(subServiceId);
    const newSubServices = isSelected
      ? formData.subServices.filter(id => id !== subServiceId)
      : [...formData.subServices, subServiceId];

    updateFormData({ subServices: newSubServices });
    
    const subService = subServicesData[subServiceId];
    addToast({
      type: isSelected ? 'info' : 'success',
      title: isSelected ? 'Sous-prestation retirée' : 'Sous-prestation ajoutée',
      message: `${subService?.name} ${isSelected ? 'retirée de' : 'ajoutée à'} votre sélection`
    });
  };

  const getTotalPrice = () => {
    return formData.subServices.reduce((total, subServiceId) => {
      const subService = subServicesData[subServiceId];
      return total + (subService?.estimatedPrice || 0);
    }, 0);
  };

  React.useEffect(() => {
    validateStep(3);
  }, [formData.subServices, validateStep]);

  if (!selectedMainService) {
    return (
      <Card className="p-6">
        <p className="text-gray-600">Veuillez d'abord sélectionner une prestation principale.</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">
              Sous-prestations pour : {selectedMainService.name}
            </h2>
            <p className="text-gray-600 mt-1">
              Sélectionnez les sous-prestations dont vous avez besoin
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">
              {formData.subServices.length} sous-prestation{formData.subServices.length > 1 ? 's' : ''} sélectionnée{formData.subServices.length > 1 ? 's' : ''}
            </p>
            <p className="text-lg font-semibold text-red-600">
              Total: {getTotalPrice()}€ HT
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableSubServices.map((subServiceId) => {
            const subService = subServicesData[subServiceId];
            if (!subService) return null;

            const isSelected = formData.subServices.includes(subServiceId);
            
            return (
              <div
                key={subServiceId}
                className={`border-2 rounded-lg p-4 transition-all cursor-pointer ${
                  isSelected
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => handleSubServiceToggle(subServiceId)}
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
                      <h3 className="font-medium text-gray-900">{subService.name}</h3>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-semibold text-gray-900">{subService.estimatedPrice}€</p>
                    <p className="text-xs text-gray-500">HT</p>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">
                  {subService.description}
                </p>
                
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1" />
                    {subService.duration}
                  </div>
                  {subService.criteria.length > 0 && (
                    <Badge variant="info" size="sm">
                      {subService.criteria.length} critère{subService.criteria.length > 1 ? 's' : ''}
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Summary */}
      {formData.subServices.length > 0 && (
        <Card className="p-6 bg-green-50 border-green-200">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            Récapitulatif de votre sélection
          </h3>
          
          <div className="space-y-2 mb-4">
            {formData.subServices.map(subServiceId => {
              const subService = subServicesData[subServiceId];
              return subService ? (
                <div key={subServiceId} className="flex items-center justify-between">
                  <span className="text-green-800">{subService.name}</span>
                  <span className="font-medium text-green-900">{subService.estimatedPrice}€ HT</span>
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

export default SubServicesSelection;