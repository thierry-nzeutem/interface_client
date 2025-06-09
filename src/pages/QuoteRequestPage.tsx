import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Save, Send, AlertTriangle } from 'lucide-react';
import { useQuoteRequestStore } from '../stores/quoteRequestStore';
import { useMockDataStore } from '../stores/mockDataStore';
import { useToastStore } from '../components/ui/Toast';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Step1Society from '../components/quote-request/Step1Society';
import Step2MainService from '../components/quote-request/Step2MainService';
import Step3SubServicesOrCalendar from '../components/quote-request/Step3SubServicesOrCalendar';
import Step4Criteria from '../components/quote-request/Step4Criteria';
import Step5Summary from '../components/quote-request/Step5Summary';

const QuoteRequestPage: React.FC = () => {
  const { stepNumber, id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToastStore();
  const { addNotification, addActivity } = useMockDataStore();
  
  const {
    currentStep,
    formData,
    validation,
    drafts,
    isLoading,
    setCurrentStep,
    validateStep,
    saveDraft,
    loadDraft,
    submitRequest,
    reset
  } = useQuoteRequestStore();

  // Initialize step from URL
  useEffect(() => {
    if (stepNumber) {
      const step = parseInt(stepNumber);
      if (step >= 1 && step <= 5) {
        setCurrentStep(step);
      }
    } else if (id) {
      // Load draft
      loadDraft(id);
      addToast({
        type: 'info',
        title: 'Brouillon chargé',
        message: 'Votre brouillon a été restauré'
      });
    }
  }, [stepNumber, id, setCurrentStep, loadDraft, addToast]);

  // Update URL when step changes
  useEffect(() => {
    if (!id) {
      navigate(`/quote-request/step/${currentStep}`, { replace: true });
    }
  }, [currentStep, navigate, id]);

  const handleNext = () => {
    const isValid = validateStep(currentStep);
    
    if (isValid) {
      if (currentStep < 5) {
        setCurrentStep(currentStep + 1);
        addToast({
          type: 'success',
          title: 'Étape validée',
          message: `Étape ${currentStep} complétée avec succès`
        });
      }
    } else {
      // Scroll vers le haut pour voir les erreurs
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      addToast({
        type: 'error',
        title: 'Formulaire incomplet',
        message: 'Veuillez corriger les erreurs affichées ci-dessus'
      });
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveDraft = () => {
    const title = `Demande ${formData.society.details.name || 'Nouvelle société'} - ${new Date().toLocaleDateString('fr-FR')}`;
    saveDraft(title);
    
    addToast({
      type: 'success',
      title: 'Brouillon sauvegardé',
      message: 'Votre demande a été sauvegardée'
    });

    addActivity({
      type: 'system',
      title: 'Brouillon sauvegardé',
      description: 'Demande de devis sauvegardée en brouillon',
      userId: 'user1',
      userName: 'Vous'
    });
  };

  const handleSubmit = async () => {
    if (!validateStep(5)) {
      // Scroll vers le haut pour voir les erreurs
      window.scrollTo({ top: 0, behavior: 'smooth' });
      
      addToast({
        type: 'error',
        title: 'Formulaire incomplet',
        message: 'Veuillez vérifier toutes les informations et corriger les erreurs'
      });
      return;
    }

    try {
      await submitRequest();
      
      addToast({
        type: 'success',
        title: 'Demande envoyée',
        message: 'Votre demande de devis a été transmise avec succès'
      });

      addNotification({
        type: 'success',
        title: 'Demande de devis envoyée',
        message: 'Votre demande a été transmise à notre équipe. Vous recevrez une réponse sous 48h.',
        read: false
      });

      addActivity({
        type: 'project_update',
        title: 'Demande de devis envoyée',
        description: `Demande pour ${formData.establishment.name}`,
        userId: 'user1',
        userName: 'Vous'
      });

      navigate('/dashboard');
    } catch (error) {
      addToast({
        type: 'error',
        title: 'Erreur',
        message: 'Une erreur est survenue lors de l\'envoi'
      });
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <Step1Society />;
      case 2:
        return <Step2MainService />;
      case 3:
        return <Step3SubServicesOrCalendar />;
      case 4:
        return <Step4Criteria />;
      case 5:
        return <Step5Summary />;
      default:
        return <Step1Society />;
    }
  };

  const stepTitles = [
    'Société & Établissement',
    'Prestation principale',
    formData.mainService === 'phone-consultation' ? 'Réservation consultation' : 'Sous-prestations',
    'Critères spécifiques',
    'Récapitulatif'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au tableau de bord
          </Button>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="secondary" onClick={handleSaveDraft}>
            <Save className="h-4 w-4 mr-2" />
            Sauvegarder
          </Button>
          
          {drafts.length > 0 && (
            <select
              onChange={(e) => {
                if (e.target.value) {
                  navigate(`/quote-request/draft/${e.target.value}`);
                }
              }}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Charger un brouillon</option>
              {drafts.map(draft => (
                <option key={draft.id} value={draft.id}>
                  {draft.title}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Progress */}
      <Card className="p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Générateur de devis Prévéris
          </h1>
          <p className="text-gray-600">
            Étape {currentStep} sur 5 : {stepTitles[currentStep - 1]}
          </p>
        </div>
        
        <ProgressBar 
          currentStep={currentStep} 
          totalSteps={5}
          stepLabels={['Société', 'Prestation', formData.mainService === 'phone-consultation' ? 'Calendrier' : 'Sous-prestations', 'Critères', 'Récapitulatif']}
        />
      </Card>

      {/* Step Content */}
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {renderStep()}
      </motion.div>

      {/* Navigation */}
      <Card className="p-6">
        <div className="flex items-center justify-between">
          <div>
            {currentStep > 1 && (
              <Button variant="secondary" onClick={handlePrevious}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Précédent
              </Button>
            )}
          </div>
          
          <div className="flex items-center space-x-3">
            {/* Indicateur d'erreurs */}
            {Object.keys(validation.errors).length > 0 && (
              <div className="flex items-center space-x-2 text-red-600">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">
                  {Object.keys(validation.errors).length} erreur{Object.keys(validation.errors).length > 1 ? 's' : ''}
                </span>
              </div>
            )}
            
            {currentStep < 5 ? (
              <Button 
                onClick={handleNext}
                disabled={Object.keys(validation.errors).length > 0}
              >
                Suivant
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading || Object.keys(validation.errors).length > 0}
                className="min-w-32"
              >
                {isLoading ? (
                  'Envoi...'
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Envoyer la demande
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QuoteRequestPage;