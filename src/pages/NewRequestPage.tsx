import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Shield, 
  Building, 
  Calendar, 
  Users,
  ArrowRight,
  HelpCircle,
  Star,
  TrendingUp,
  Euro,
  Clock,
  CheckCircle,
  Save,
  Plus
} from 'lucide-react';
import { useMockDataStore } from '../stores/mockDataStore';
import { useToastStore } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Tooltip from '../components/ui/Tooltip';
import { debugLog } from '../utils/debug';

const NewRequestPage: React.FC = () => {
  const [selectedService, setSelectedService] = useState<string>('');
  const [compareMode, setCompareMode] = useState(false);
  const [selectedForComparison, setSelectedForComparison] = useState<string[]>([]);
  const [savedDrafts, setSavedDrafts] = useState([
    { id: '1', service: 'AT', title: 'Rénovation cuisine restaurant', date: '2024-01-15', progress: 60 }
  ]);

  const { addNotification, addActivity } = useMockDataStore();
  const { addToast } = useToastStore();

  const services = [
    {
      id: 'AT',
      title: 'Autorisation de Travaux (AT)',
      description: 'Dossier complet pour obtenir l\'autorisation de travaux de votre ERP',
      icon: FileText,
      duration: '4-6 semaines',
      complexity: 'Moyenne',
      price: 'À partir de 850€',
      priceRange: '850-2500€',
      examples: 'Rénovation cuisine, extension terrasse, changement d\'activité',
      recommended: true,
      popularity: 95,
      features: ['Dossier complet', 'Suivi personnalisé', 'Garantie conformité'],
      estimatedPrice: 1200
    },
    {
      id: 'AUDIT',
      title: 'Audit sécurité/accessibilité',
      description: 'Visite de conformité ponctuelle de vos installations',
      icon: Search,
      duration: '1-2 semaines',
      complexity: 'Simple',
      price: 'À partir de 450€',
      priceRange: '450-800€',
      examples: 'Vérification avant ouverture, contrôle périodique, audit post-travaux',
      recommended: false,
      popularity: 78,
      features: ['Visite sur site', 'Rapport détaillé', 'Recommandations'],
      estimatedPrice: 600
    },
    {
      id: 'CSSI',
      title: 'Coordination SSI',
      description: 'Coordination des Systèmes de Sécurité Incendie',
      icon: Shield,
      duration: 'Variable',
      complexity: 'Élevée',
      price: 'Sur devis',
      priceRange: '1500-5000€',
      examples: 'Installation alarme incendie, désenfumage, sprinklers',
      recommended: false,
      popularity: 45,
      features: ['Coordination technique', 'Suivi chantier', 'Réception SSI'],
      estimatedPrice: 2800
    },
    {
      id: 'RUS',
      title: 'Mission RUS',
      description: 'Responsable Unique de Sécurité pour groupements',
      icon: Building,
      duration: 'Continue',
      complexity: 'Élevée',
      price: 'Sur devis',
      priceRange: '2000-8000€',
      examples: 'Centre commercial, galerie marchande, complexe de loisirs',
      recommended: false,
      popularity: 25,
      features: ['Mission continue', 'Coordination globale', 'Expertise spécialisée'],
      estimatedPrice: 4500
    },
    {
      id: 'SUIVI',
      title: 'Suivi annuel ERP',
      description: 'Accompagnement conformité continue',
      icon: Calendar,
      duration: '12 mois',
      complexity: 'Simple',
      price: 'À partir de 200€/mois',
      priceRange: '200-500€/mois',
      examples: 'Maintenances programmées, veille réglementaire, registre de sécurité',
      recommended: true,
      popularity: 88,
      features: ['Suivi continu', 'Alertes automatiques', 'Support prioritaire'],
      estimatedPrice: 300
    },
    {
      id: 'AMO',
      title: 'AMO (Assistance Maîtrise d\'Ouvrage)',
      description: 'Assistance pour architectes et maîtres d\'ouvrage',
      icon: Users,
      duration: 'Variable',
      complexity: 'Moyenne',
      price: 'Sur devis',
      priceRange: '1000-3000€',
      examples: 'Conseil conception, validation plans, suivi chantier',
      recommended: false,
      popularity: 62,
      features: ['Conseil expert', 'Validation technique', 'Accompagnement projet'],
      estimatedPrice: 1800
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Simple': return 'text-green-600 bg-green-100';
      case 'Moyenne': return 'text-orange-600 bg-orange-100';
      case 'Élevée': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getRecommendations = () => {
    return services.filter(s => s.recommended).slice(0, 2);
  };

  const handleCompareToggle = (serviceId: string) => {
    if (selectedForComparison.includes(serviceId)) {
      setSelectedForComparison(prev => prev.filter(id => id !== serviceId));
    } else if (selectedForComparison.length < 3) {
      setSelectedForComparison(prev => [...prev, serviceId]);
    }
  };

  const handleContinue = () => {
    if (selectedService) {
      const service = services.find(s => s.id === selectedService);
      
      addToast({
        type: 'success',
        title: 'Demande initiée',
        message: `Votre demande ${service?.title} a été créée avec succès`
      });

      addNotification({
        type: 'success',
        title: 'Nouvelle demande créée',
        message: `Votre demande ${service?.title} est en cours de traitement`,
        read: false
      });

      addActivity({
        type: 'project_update',
        title: 'Nouvelle demande',
        description: `Demande ${service?.title} créée`,
        userId: 'user1',
        userName: 'Vous'
      });

      // Simuler la redirection vers le formulaire détaillé
      setTimeout(() => {
        addToast({
          type: 'info',
          title: 'Redirection',
          message: 'Redirection vers le formulaire de demande...'
        });
      }, 2000);
    }
  };

  const handleSaveDraft = () => {
    if (selectedService) {
      const service = services.find(s => s.id === selectedService);
      const newDraft = {
        id: Date.now().toString(),
        service: selectedService,
        title: `Nouvelle demande ${service?.title.split(' ')[0]}`,
        date: new Date().toISOString().split('T')[0],
        progress: 0
      };
      setSavedDrafts(prev => [...prev, newDraft]);
      
      addToast({
        type: 'success',
        title: 'Brouillon sauvegardé',
        message: 'Votre demande a été sauvegardée en brouillon'
      });

      addActivity({
        type: 'system',
        title: 'Brouillon sauvegardé',
        description: `Brouillon ${service?.title} sauvegardé`,
        userId: 'user1',
        userName: 'Vous'
      });
    }
  };

  const handleResumeDraft = (draft: any) => {
    setSelectedService(draft.service);
    addToast({
      type: 'info',
      title: 'Brouillon repris',
      message: `Reprise du brouillon: ${draft.title}`
    });
  };

  const handleServiceSelection = (serviceId: string) => {
    if (!compareMode) {
      setSelectedService(serviceId);
      const service = services.find(s => s.id === serviceId);
      
      addToast({
        type: 'info',
        title: 'Service sélectionné',
        message: `${service?.title} sélectionné`
      });
    }
  };

  const handleCompareServices = () => {
    if (selectedForComparison.length > 1) {
      addToast({
        type: 'info',
        title: 'Comparaison',
        message: `Comparaison de ${selectedForComparison.length} services`
      });
      
      // Ici vous pourriez ouvrir un modal de comparaison
      debugLog('Services à comparer:', selectedForComparison);
    }
  };

  const handleContactExpert = () => {
    addToast({
      type: 'success',
      title: 'Demande envoyée',
      message: 'Un expert vous contactera sous 24h'
    });

    addNotification({
      type: 'info',
      title: 'Demande de contact',
      message: 'Un expert Prévéris vous contactera sous 24h pour vous conseiller',
      read: false
    });
  };

  const handleScheduleCall = () => {
    addToast({
      type: 'info',
      title: 'Planification',
      message: 'Redirection vers le calendrier de rendez-vous'
    });
  };

  const getEstimatedPrice = () => {
    if (!selectedService) return null;
    const service = services.find(s => s.id === selectedService);
    return service?.estimatedPrice;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Nouvelle demande
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Sélectionnez le type de prestation dont vous avez besoin. 
          Notre équipe vous accompagnera à chaque étape.
        </p>
      </div>

      {/* Recommandations intelligentes */}
      {getRecommendations().length > 0 && (
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="bg-blue-500 text-white rounded-lg p-2">
              <TrendingUp className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-blue-900 mb-2">
                Recommandé pour votre profil
              </h3>
              <p className="text-blue-800 text-sm mb-4">
                Basé sur votre activité (restauration) et vos projets précédents
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getRecommendations().map(service => (
                  <button
                    key={service.id}
                    onClick={() => handleServiceSelection(service.id)}
                    className="p-3 bg-white border border-blue-200 rounded-lg text-left hover:border-blue-400 transition-colors"
                  >
                    <div className="flex items-center space-x-2 mb-1">
                      <service.icon className="h-4 w-4 text-blue-600" />
                      <span className="font-medium text-blue-900">{service.title}</span>
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    </div>
                    <p className="text-sm text-blue-700">{service.price}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}

      {/* Brouillons sauvegardés */}
      {savedDrafts.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Reprendre une demande en cours
          </h3>
          <div className="space-y-3">
            {savedDrafts.map(draft => (
              <div key={draft.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">{draft.title}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <span>Type: {draft.service}</span>
                    <span>Sauvegardé le: {new Date(draft.date).toLocaleDateString('fr-FR')}</span>
                    <span>Progression: {draft.progress}%</span>
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={() => handleResumeDraft(draft)}>
                  Reprendre
                </Button>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Mode comparaison */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <label className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={compareMode}
              onChange={(e) => setCompareMode(e.target.checked)}
              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Mode comparaison</span>
          </label>
          {compareMode && (
            <span className="text-sm text-gray-600">
              Sélectionnez jusqu'à 3 prestations à comparer
            </span>
          )}
        </div>
        
        {compareMode && selectedForComparison.length > 1 && (
          <Button variant="secondary" size="sm" onClick={handleCompareServices}>
            Comparer ({selectedForComparison.length})
          </Button>
        )}
      </div>

      {/* Service Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => {
          const Icon = service.icon;
          const isSelected = selectedService === service.id;
          const isSelectedForComparison = selectedForComparison.includes(service.id);
          
          return (
            <motion.div
              key={service.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                hover
                className={`cursor-pointer transition-all duration-200 relative ${
                  isSelected 
                    ? 'ring-2 ring-red-500 border-red-200 bg-red-50' 
                    : isSelectedForComparison
                    ? 'ring-2 ring-blue-500 border-blue-200 bg-blue-50'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => handleServiceSelection(service.id)}
              >
                {/* Badges */}
                <div className="absolute top-4 right-4 flex flex-col space-y-2">
                  {service.recommended && (
                    <Badge variant="success\" size="sm">
                      <Star className="h-3 w-3 mr-1" />
                      Recommandé
                    </Badge>
                  )}
                  {compareMode && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCompareToggle(service.id);
                      }}
                      className={`px-2 py-1 text-xs rounded ${
                        isSelectedForComparison
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                      }`}
                    >
                      {isSelectedForComparison ? 'Sélectionné' : 'Comparer'}
                    </button>
                  )}
                </div>

                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg ${
                      isSelected ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-600'
                    }`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <Tooltip content={{
                      definition: service.description,
                      example: service.examples,
                      learnMore: "Voir les détails de cette prestation"
                    }}>
                      <HelpCircle className="h-5 w-5 text-gray-400 hover:text-red-500" />
                    </Tooltip>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-4">
                    {service.description}
                  </p>

                  {/* Popularité */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-500">Popularité</span>
                      <span className="text-gray-900 font-medium">{service.popularity}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: `${service.popularity}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Délai:</span>
                      <span className="text-gray-900 font-medium">{service.duration}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Complexité:</span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getComplexityColor(service.complexity)}`}>
                        {service.complexity}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-500">Tarif:</span>
                      <span className="text-gray-900 font-medium">{service.price}</span>
                    </div>
                  </div>

                  {/* Fonctionnalités */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Inclus :</h4>
                    <ul className="space-y-1">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center text-sm text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {isSelected && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-4 pt-4 border-t border-red-200"
                    >
                      <div className="bg-white rounded-lg p-3 border border-red-200">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-red-900">Estimation personnalisée</span>
                          <div className="flex items-center text-red-700">
                            <Euro className="h-4 w-4 mr-1" />
                            <span className="font-bold">{service.estimatedPrice}€</span>
                          </div>
                        </div>
                        <p className="text-xs text-red-700">
                          ✓ Service sélectionné. Estimation basée sur votre profil.
                        </p>
                      </div>
                    </motion.div>
                  )}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Devis instantané */}
      {selectedService && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="bg-green-500 text-white rounded-lg p-2">
                  <Euro className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-green-900">Estimation de votre projet</h3>
                  <p className="text-sm text-green-700">
                    Basée sur votre profil et les caractéristiques de votre établissement
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-green-900">
                  {getEstimatedPrice()}€
                </div>
                <p className="text-sm text-green-700">Estimation HT</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Help Section */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <div className="flex items-start space-x-4">
          <div className="bg-blue-500 text-white rounded-lg p-2">
            <HelpCircle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-blue-900 mb-2">
              Besoin d'aide pour choisir ?
            </h3>
            <p className="text-blue-800 text-sm mb-4">
              Nos experts sont là pour vous conseiller sur la prestation la plus adaptée à votre situation.
            </p>
            <div className="flex space-x-3">
              <Button variant="secondary" size="sm" onClick={handleContactExpert}>
                Contacter un expert
              </Button>
              <Button variant="ghost" size="sm" onClick={handleScheduleCall}>
                Planifier un appel
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Continue Button */}
      {selectedService && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex justify-center space-x-4"
        >
          <Button variant="secondary" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder brouillon
          </Button>
          <Button
            onClick={handleContinue}
            size="lg"
            className="min-w-48"
          >
            Continuer avec {services.find(s => s.id === selectedService)?.title.split(' ')[0]}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default NewRequestPage;