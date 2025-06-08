import React, { useState, useEffect } from 'react';
import { Phone, Video, Calendar, Clock, AlertTriangle, Check } from 'lucide-react';
import { useQuoteRequestStore, timeSlots, holidays } from '../../stores/quoteRequestStore';
import { useToastStore } from '../ui/Toast';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const CalendarBooking: React.FC = () => {
  const { formData, updateFormData, validateStep, validation } = useQuoteRequestStore();
  const { addToast } = useToastStore();
  
  // État local pour la date sélectionnée
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Synchroniser l'état local avec le store au montage
  useEffect(() => {
    if (formData.consultation.selectedDate) {
      setSelectedDate(formData.consultation.selectedDate);
    }
  }, [formData.consultation.selectedDate]);

  const handleConsultationChange = (field: string, value: any) => {
    console.log(`🔄 Mise à jour ${field}:`, value);
    
    const newConsultation = {
      ...formData.consultation,
      [field]: value
    };
    
    updateFormData({ consultation: newConsultation });
  };

  const handleDateSelect = (date: Date) => {
    console.log('📅 Date sélectionnée:', date);
    
    // Créer une date propre sans heures/minutes/secondes
    const cleanDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    console.log('📅 Date nettoyée:', cleanDate);
    
    // Mettre à jour l'état local immédiatement
    setSelectedDate(cleanDate);
    
    // Mettre à jour le store
    handleConsultationChange('selectedDate', cleanDate);
    
    // Reset du créneau horaire quand on change de date
    if (formData.consultation.selectedTimeSlot) {
      handleConsultationChange('selectedTimeSlot', '');
    }
    
    addToast({
      type: 'info',
      title: 'Date sélectionnée',
      message: `${cleanDate.toLocaleDateString('fr-FR')} sélectionné`
    });
  };

  const handleTimeSlotSelect = (timeSlot: string) => {
    console.log('⏰ Créneau sélectionné:', timeSlot);
    handleConsultationChange('selectedTimeSlot', timeSlot);
    
    addToast({
      type: 'success',
      title: 'Créneau sélectionné',
      message: `${timeSlot} le ${selectedDate?.toLocaleDateString('fr-FR')}`
    });
  };

  // Generate available dates (next 30 business days)
  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    let currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() + 1); // Start from tomorrow
    
    while (dates.length < 30) {
      // Skip weekends
      if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
        // Skip holidays
        const dateString = currentDate.toISOString().split('T')[0];
        if (!holidays.includes(dateString)) {
          dates.push(new Date(currentDate));
        }
      }
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return dates;
  };

  const availableDates = generateAvailableDates();

  // Validation en temps réel avec délai pour permettre la propagation
  useEffect(() => {
    const timer = setTimeout(() => {
      console.log('🔄 Validation avec consultation:', formData.consultation);
      validateStep(3);
    }, 100); // Petit délai pour permettre la propagation

    return () => clearTimeout(timer);
  }, [
    formData.consultation.type, 
    formData.consultation.duration, 
    formData.consultation.urgency, 
    formData.consultation.selectedDate, 
    formData.consultation.selectedTimeSlot, 
    validateStep
  ]);

  return (
    <div className="space-y-6">
      {/* Erreurs globales */}
      {Object.keys(validation.errors).length > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-red-600 mt-0.5" />
            <div className="flex-1">
              <h4 className="font-medium text-red-900 mb-2">
                Réservation incomplète
              </h4>
              <p className="text-sm text-red-800 mb-3">
                Veuillez compléter les informations suivantes pour continuer :
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

      {/* Consultation Type */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Type de consultation
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => handleConsultationChange('type', 'phone')}
            className={`p-4 border-2 rounded-lg transition-all ${
              formData.consultation.type === 'phone'
                ? 'border-red-500 bg-red-50'
                : validation.errors.consultationType
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Phone className="h-6 w-6 text-red-500" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Téléphonique</h3>
                <p className="text-sm text-gray-600">Appel vocal traditionnel</p>
              </div>
              {formData.consultation.type === 'phone' && (
                <Check className="h-5 w-5 text-red-500 ml-auto" />
              )}
            </div>
          </button>
          
          <button
            onClick={() => handleConsultationChange('type', 'visio')}
            className={`p-4 border-2 rounded-lg transition-all ${
              formData.consultation.type === 'visio'
                ? 'border-red-500 bg-red-50'
                : validation.errors.consultationType
                ? 'border-red-500 bg-red-50'
                : 'border-gray-200 hover:border-gray-300'
            }`}
          >
            <div className="flex items-center space-x-3">
              <Video className="h-6 w-6 text-red-500" />
              <div className="text-left">
                <h3 className="font-medium text-gray-900">Visioconférence</h3>
                <p className="text-sm text-gray-600">Appel vidéo (Teams/Meet)</p>
              </div>
              {formData.consultation.type === 'visio' && (
                <Check className="h-5 w-5 text-red-500 ml-auto" />
              )}
            </div>
          </button>
        </div>
      </Card>

      {/* Duration and Urgency */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Durée estimée
          </h3>
          
          <div className="space-y-3">
            {[
              { value: '30', label: '30 minutes', description: 'Conseil ponctuel' },
              { value: '60', label: '1 heure', description: 'Analyse détaillée' },
              { value: '90', label: '1h30', description: 'Consultation approfondie' }
            ].map((option) => (
              <label key={option.value} className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="radio"
                  name="duration"
                  value={option.value}
                  checked={formData.consultation.duration === option.value}
                  onChange={(e) => handleConsultationChange('duration', e.target.value)}
                  className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
                />
                <div>
                  <span className="text-sm font-medium text-gray-900">{option.label}</span>
                  <span className="text-sm text-gray-600"> - {option.description}</span>
                </div>
              </label>
            ))}
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Urgence de la demande
          </h3>
          
          <div className="space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="urgency"
                value="standard"
                checked={formData.consultation.urgency === 'standard'}
                onChange={(e) => handleConsultationChange('urgency', e.target.value)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <span className="text-sm text-gray-700">Standard (sous 5 jours ouvrés)</span>
            </label>
            
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="radio"
                name="urgency"
                value="urgent"
                checked={formData.consultation.urgency === 'urgent'}
                onChange={(e) => handleConsultationChange('urgency', e.target.value)}
                className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300"
              />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-orange-600 font-medium">Urgent (sous 48h)</span>
                <Badge variant="warning" size="sm">+20%</Badge>
              </div>
            </label>
          </div>
        </Card>
      </div>

      {/* Calendar */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Sélectionnez votre créneau
        </h3>
        
        {/* Date Selection */}
        <div className="mb-6">
          <h4 className="font-medium text-gray-900 mb-3">Choisissez une date</h4>
          <div className={`grid grid-cols-7 gap-2 ${validation.errors.consultationDate ? 'p-3 border border-red-500 bg-red-50 rounded-lg' : ''}`}>
            {availableDates.slice(0, 21).map((date, index) => {
              const isSelected = selectedDate?.toDateString() === date.toDateString();
              const dayName = date.toLocaleDateString('fr-FR', { weekday: 'short' });
              const dayNumber = date.getDate();
              
              return (
                <button
                  key={index}
                  onClick={() => handleDateSelect(date)}
                  className={`p-2 rounded-lg text-center transition-all ${
                    isSelected
                      ? 'bg-red-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                  }`}
                >
                  <div className="text-xs">{dayName}</div>
                  <div className="text-sm font-medium">{dayNumber}</div>
                </button>
              );
            })}
          </div>
          
          {validation.errors.consultationDate && (
            <div className="flex items-center space-x-2 text-red-600 text-sm mt-3">
              <AlertTriangle className="h-4 w-4" />
              <span>{validation.errors.consultationDate}</span>
            </div>
          )}
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              Créneaux disponibles le {selectedDate.toLocaleDateString('fr-FR')}
            </h4>
            <div className={`grid grid-cols-4 md:grid-cols-6 gap-2 ${validation.errors.consultationTime ? 'p-3 border border-red-500 bg-red-50 rounded-lg' : ''}`}>
              {timeSlots.map(slot => (
                <button
                  key={slot}
                  onClick={() => handleTimeSlotSelect(slot)}
                  className={`p-2 rounded border text-sm transition-all ${
                    formData.consultation.selectedTimeSlot === slot
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-300 hover:border-gray-400 text-gray-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
            
            {validation.errors.consultationTime && (
              <div className="flex items-center space-x-2 text-red-600 text-sm mt-3">
                <AlertTriangle className="h-4 w-4" />
                <span>{validation.errors.consultationTime}</span>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Booking Summary */}
      {selectedDate && formData.consultation.selectedTimeSlot && (
        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center space-x-3 mb-4">
            <Calendar className="h-5 w-5 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">
              Réservation confirmée
            </h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium text-green-800">Type :</span>
              <p className="text-green-700">
                {formData.consultation.type === 'phone' ? 'Téléphonique' : 'Visioconférence'}
              </p>
            </div>
            <div>
              <span className="font-medium text-green-800">Date :</span>
              <p className="text-green-700">{selectedDate.toLocaleDateString('fr-FR')}</p>
            </div>
            <div>
              <span className="font-medium text-green-800">Heure :</span>
              <p className="text-green-700">{formData.consultation.selectedTimeSlot}</p>
            </div>
            <div>
              <span className="font-medium text-green-800">Durée :</span>
              <p className="text-green-700">{formData.consultation.duration} minutes</p>
            </div>
            <div>
              <span className="font-medium text-green-800">Urgence :</span>
              <p className="text-green-700">
                {formData.consultation.urgency === 'urgent' ? 'Urgent (sous 48h)' : 'Standard (sous 5 jours)'}
              </p>
            </div>
          </div>
          
          {formData.consultation.urgency === 'urgent' && (
            <div className="mt-4 p-3 bg-orange-100 border border-orange-300 rounded-lg">
              <div className="flex items-start space-x-2">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5" />
                <p className="text-sm text-orange-800">
                  Supplément urgence de 20% appliqué pour un traitement prioritaire sous 48h.
                </p>
              </div>
            </div>
          )}
        </Card>
      )}
    </div>
  );
};

export default CalendarBooking;