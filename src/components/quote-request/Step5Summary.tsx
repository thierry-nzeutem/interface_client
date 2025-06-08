import React from 'react';
import { 
  Building, 
  MapPin, 
  FileText, 
  Euro, 
  Clock, 
  Phone,
  Video,
  Calendar,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { useQuoteRequestStore, mainServices, subServicesData } from '../../stores/quoteRequestStore';
import { useAuthStore } from '../../stores/authStore';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const Step5Summary: React.FC = () => {
  const { user } = useAuthStore();
  const { formData, updateFormData, validateStep } = useQuoteRequestStore();

  const selectedSociety = formData.society.isNew 
    ? formData.society.details 
    : user?.companies.find(c => c.id === formData.society.id);

  const selectedMainService = mainServices.find(s => s.id === formData.mainService);
  const selectedSubServices = formData.subServices.map(id => subServicesData[id]).filter(Boolean);

  const calculatePrice = () => {
    if (selectedMainService?.requiresCalendar) {
      // Prix consultation selon durée
      const basePrices = { '30': 150, '60': 250, '90': 350 };
      const basePrice = basePrices[formData.consultation.duration as keyof typeof basePrices] || 150;
      const urgencyMultiplier = formData.consultation.urgency === 'urgent' ? 1.2 : 1;
      return Math.round(basePrice * urgencyMultiplier);
    } else {
      // Prix sous-prestations
      return selectedSubServices.reduce((total, service) => total + service.estimatedPrice, 0);
    }
  };

  const totalPrice = calculatePrice();

  const handleProjectDescriptionChange = (value: string) => {
    updateFormData({ projectDescription: value });
  };

  React.useEffect(() => {
    validateStep(5);
  }, [formData.projectDescription, validateStep]);

  return (
    <div className="space-y-6">
      {/* Summary Header */}
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="flex items-center space-x-3 mb-4">
          <CheckCircle className="h-6 w-6 text-green-600" />
          <h2 className="text-xl font-semibold text-green-900">
            Récapitulatif de votre demande
          </h2>
        </div>
        <p className="text-green-800">
          Vérifiez toutes les informations avant d'envoyer votre demande de devis personnalisé.
        </p>
      </Card>

      {/* Society Information */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Building className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Société</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Nom de la société</label>
            <p className="text-gray-900">{selectedSociety?.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">SIRET</label>
            <p className="text-gray-900 font-mono">{selectedSociety?.siret}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-500">Adresse</label>
            <p className="text-gray-900">{selectedSociety?.address}</p>
          </div>
        </div>
      </Card>

      {/* Establishment Information */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <MapPin className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Établissement</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-500">Nom</label>
            <p className="text-gray-900">{formData.establishment.name}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-500">Activité</label>
            <p className="text-gray-900">{formData.establishment.activity}</p>
          </div>
          <div className="md:col-span-2">
            <label className="text-sm font-medium text-gray-500">Adresse</label>
            <p className="text-gray-900">{formData.establishment.address}</p>
          </div>
          {formData.establishment.surface && (
            <div>
              <label className="text-sm font-medium text-gray-500">Superficie</label>
              <p className="text-gray-900">{formData.establishment.surface} m²</p>
            </div>
          )}
        </div>
      </Card>

      {/* Main Service */}
      <Card className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <FileText className="h-5 w-5 text-red-500" />
          <h3 className="text-lg font-semibold text-gray-900">Prestation principale</h3>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">{selectedMainService?.name}</h4>
          <p className="text-sm text-blue-800">{selectedMainService?.description}</p>
        </div>
      </Card>

      {/* Consultation Details (if applicable) */}
      {selectedMainService?.requiresCalendar && (
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Consultation réservée</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Type</label>
              <div className="flex items-center space-x-2">
                {formData.consultation.type === 'phone' ? (
                  <Phone className="h-4 w-4 text-gray-600" />
                ) : (
                  <Video className="h-4 w-4 text-gray-600" />
                )}
                <p className="text-gray-900">
                  {formData.consultation.type === 'phone' ? 'Téléphonique' : 'Visioconférence'}
                </p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Durée</label>
              <p className="text-gray-900">{formData.consultation.duration} minutes</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Date</label>
              <p className="text-gray-900">
                {formData.consultation.selectedDate?.toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Heure</label>
              <p className="text-gray-900">{formData.consultation.selectedTimeSlot}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Urgence</label>
              <div className="flex items-center space-x-2">
                <p className="text-gray-900">
                  {formData.consultation.urgency === 'urgent' ? 'Urgent (sous 48h)' : 'Standard (sous 5 jours)'}
                </p>
                {formData.consultation.urgency === 'urgent' && (
                  <Badge variant="warning" size="sm">+20%</Badge>
                )}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Sub-services (if applicable) */}
      {selectedSubServices.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-4">
            <FileText className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">Sous-prestations sélectionnées</h3>
          </div>
          
          <div className="space-y-3">
            {selectedSubServices.map((service) => (
              <div key={service.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">{service.name}</h4>
                  <p className="text-sm text-gray-600">{service.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">{service.estimatedPrice}€ HT</p>
                  <p className="text-xs text-gray-500">{service.duration}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Project Description */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Description du projet</h3>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Décrivez votre projet en détail *
          </label>
          <textarea
            value={formData.projectDescription}
            onChange={(e) => handleProjectDescriptionChange(e.target.value)}
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            placeholder="Décrivez les travaux envisagés, les modifications prévues, les contraintes particulières, etc."
          />
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-4">
          <h4 className="font-medium text-blue-900 mb-2">Informations utiles à mentionner :</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Nature des travaux (rénovation, extension, changement d'activité...)</li>
            <li>• Modifications de la structure ou des circulations</li>
            <li>• Changements d'effectifs ou de capacité d'accueil</li>
            <li>• Contraintes particulières (bâtiment classé, zone protégée...)</li>
            <li>• Échéances importantes à respecter</li>
          </ul>
        </div>
      </Card>

      {/* Pricing Summary */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-center space-x-3 mb-4">
          <Euro className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-blue-900">Estimation tarifaire</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-blue-800">
              {selectedMainService?.requiresCalendar ? 'Consultation' : 'Sous-prestations'}
            </span>
            <span className="font-medium text-blue-900">
              {selectedMainService?.requiresCalendar ? 
                calculatePrice() - (formData.consultation.urgency === 'urgent' ? Math.round(calculatePrice() / 1.2 * 0.2) : 0) :
                totalPrice
              }€ HT
            </span>
          </div>
          
          {selectedMainService?.requiresCalendar && formData.consultation.urgency === 'urgent' && (
            <div className="flex items-center justify-between">
              <span className="text-blue-800">Supplément urgence (20%)</span>
              <span className="font-medium text-blue-900">
                +{Math.round(calculatePrice() / 1.2 * 0.2)}€ HT
              </span>
            </div>
          )}
          
          <div className="border-t border-blue-200 pt-3">
            <div className="flex items-center justify-between text-lg font-semibold text-blue-900">
              <span>Total estimé</span>
              <span>{totalPrice}€ HT</span>
            </div>
            <div className="flex items-center justify-between text-sm text-blue-700 mt-1">
              <span>TVA 20%</span>
              <span>{Math.round(totalPrice * 0.2)}€</span>
            </div>
            <div className="flex items-center justify-between text-lg font-bold text-blue-900 mt-1">
              <span>Total TTC</span>
              <span>{Math.round(totalPrice * 1.2)}€</span>
            </div>
          </div>
        </div>
        
        <div className="mt-4 p-3 bg-blue-100 rounded-lg">
          <div className="flex items-start space-x-2">
            <AlertTriangle className="h-4 w-4 text-blue-600 mt-0.5" />
            <p className="text-sm text-blue-800">
              Cette estimation est indicative et sera confirmée dans votre devis personnalisé.
            </p>
          </div>
        </div>
      </Card>

      {/* Next Steps */}
      <Card className="p-6 bg-green-50 border-green-200">
        <h3 className="text-lg font-semibold text-green-900 mb-4">Prochaines étapes</h3>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              1
            </div>
            <p className="text-green-800">Envoi de votre demande à notre équipe</p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              2
            </div>
            <p className="text-green-800">
              {selectedMainService?.requiresCalendar ? 
                'Confirmation de votre créneau par email (24h)' :
                'Analyse de votre projet par nos experts (24-48h)'
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              3
            </div>
            <p className="text-green-800">
              {selectedMainService?.requiresCalendar ? 
                'Consultation à la date et heure convenues' :
                'Réception de votre devis personnalisé'
              }
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-medium">
              4
            </div>
            <p className="text-green-800">
              {selectedMainService?.requiresCalendar ? 
                'Devis personnalisé suite à la consultation' :
                'Validation et lancement de votre projet'
              }
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Step5Summary;