import React from 'react';
import { FileText, Shield, Phone, UserCheck, Calendar, Building2 } from 'lucide-react';
import { useQuoteRequestStore, mainServices } from '../../stores/quoteRequestStore';
import { useToastStore } from '../ui/Toast';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const Step2MainService: React.FC = () => {
  const { formData, updateFormData, validateStep } = useQuoteRequestStore();
  const { addToast } = useToastStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return FileText;
      case 'Shield': return Shield;
      case 'Phone': return Phone;
      case 'UserCheck': return UserCheck;
      case 'Calendar': return Calendar;
      case 'Building2': return Building2;
      default: return FileText;
    }
  };

  const handleServiceSelect = (serviceId: string) => {
    const service = mainServices.find(s => s.id === serviceId);
    
    updateFormData({ 
      mainService: serviceId,
      // Reset sub-services and consultation when changing main service
      subServices: [],
      consultation: {
        ...formData.consultation,
        isCalendarMode: service?.requiresCalendar || false
      }
    });
    
    addToast({
      type: 'success',
      title: 'Prestation sélectionnée',
      message: `${service?.name} sélectionnée`
    });
  };

  React.useEffect(() => {
    validateStep(2);
  }, [formData.mainService, validateStep]);

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Sélectionnez votre prestation principale
        </h2>
        <p className="text-gray-600 mb-6">
          Choisissez le type de prestation Prévéris dont vous avez besoin pour votre projet.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mainServices.map((service) => {
            const Icon = getIcon(service.icon);
            const isSelected = formData.mainService === service.id;
            
            return (
              <button
                key={service.id}
                onClick={() => handleServiceSelect(service.id)}
                className={`p-6 border-2 rounded-lg text-left transition-all hover:shadow-md ${
                  isSelected
                    ? 'border-red-500 bg-red-50 shadow-md'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${
                    isSelected ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                  }`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  
                  {service.requiresCalendar && (
                    <Badge variant="info" size="sm">
                      Calendrier
                    </Badge>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {service.name}
                </h3>
                <p className="text-sm text-gray-600 mb-4">
                  {service.description}
                </p>

                <div className="text-xs text-gray-500">
                  {service.subServices.length > 0 ? (
                    `${service.subServices.length} sous-prestation${service.subServices.length > 1 ? 's' : ''} disponible${service.subServices.length > 1 ? 's' : ''}`
                  ) : service.requiresCalendar ? (
                    'Réservation de créneau requise'
                  ) : (
                    'Prestation unique'
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Service Details */}
      {formData.mainService && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          {(() => {
            const selectedService = mainServices.find(s => s.id === formData.mainService);
            if (!selectedService) return null;

            return (
              <div>
                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                  Prestation sélectionnée : {selectedService.name}
                </h3>
                <p className="text-blue-800 mb-4">
                  {selectedService.description}
                </p>
                
                {selectedService.requiresCalendar ? (
                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      📅 Réservation de consultation
                    </h4>
                    <p className="text-sm text-blue-800">
                      Cette prestation nécessite la réservation d'un créneau de consultation. 
                      Vous pourrez choisir votre date et heure à l'étape suivante.
                    </p>
                  </div>
                ) : selectedService.subServices.length > 0 ? (
                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      🔧 Sous-prestations disponibles
                    </h4>
                    <p className="text-sm text-blue-800">
                      Cette prestation comprend {selectedService.subServices.length} sous-prestations 
                      que vous pourrez sélectionner à l'étape suivante selon vos besoins.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-100 border border-blue-300 rounded-lg p-4">
                    <h4 className="font-medium text-blue-900 mb-2">
                      ✅ Prestation complète
                    </h4>
                    <p className="text-sm text-blue-800">
                      Cette prestation est complète et ne nécessite pas de sous-prestations additionnelles.
                    </p>
                  </div>
                )}
              </div>
            );
          })()}
        </Card>
      )}
    </div>
  );
};

export default Step2MainService;