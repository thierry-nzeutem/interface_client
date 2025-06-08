import React from 'react';
import { useQuoteRequestStore, mainServices } from '../../stores/quoteRequestStore';
import SubServicesSelection from './SubServicesSelection';
import CalendarBooking from './CalendarBooking';

const Step3SubServicesOrCalendar: React.FC = () => {
  const { formData } = useQuoteRequestStore();

  const selectedMainService = mainServices.find(s => s.id === formData.mainService);

  // Si c'est une consultation téléphonique, afficher le calendrier
  if (selectedMainService?.requiresCalendar) {
    return <CalendarBooking />;
  }

  // Sinon, afficher la sélection de sous-prestations
  return <SubServicesSelection />;
};

export default Step3SubServicesOrCalendar;