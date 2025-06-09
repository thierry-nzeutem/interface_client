import { create } from 'zustand';

export interface Society {
  id: string;
  name: string;
  siret: string;
  address: string;
  activity: string;
}

export interface Establishment {
  name: string;
  address: string;
  activity: string;
  surface: string;
  description?: string;
}

export interface MainService {
  id: string;
  name: string;
  description: string;
  icon: string;
  subServices: string[];
  requiresCalendar?: boolean;
}

export interface SubService {
  id: string;
  name: string;
  description: string;
  criteria: string[];
  estimatedPrice: number;
  duration: string;
}

export interface ConsultationBooking {
  type: 'phone' | 'visio';
  duration: '30' | '60' | '90';
  urgency: 'standard' | 'urgent';
  selectedDate: Date | null;
  selectedTimeSlot: string;
  isCalendarMode: boolean;
}

export interface QuoteRequestFormData {
  society: {
    id: string | null;
    isNew: boolean;
    details: Partial<Society>;
  };
  establishment: Establishment;
  mainService: string;
  subServices: string[];
  consultation: ConsultationBooking;
  criteria: {
    // Plans
    planComplexity: string;
    planSurface: string;
    planDistance: string;
    
    // Notice sécurité
    erpTypes: string[];
    erpCategory: string;
    securityDescription: string;
    
    // Audit
    auditComplexity: string;
    auditDistance: string;
    auditTypes: string[];
    auditCategory: string;
    auditSurface: string;
    buildingCount: string;
    
    // Suivi établissements
    followUpTypes: string[];
    followUpCategory: string;
    followUpDescription: string;
    unfavorableAdvice: string;
    securityCommission: string;
    
    // Mission RUS
    rusSmallBuildings: string;
    rusMediumBuildings: string;
    rusLargeBuildings: string;
    rusDistance: string;
    
    // Registres
    securityRegisterQuantity: string;
    accessibilityRegisterQuantity: string;
    
    // Secrétariat commission
    category1Count: string;
    category2Count: string;
    category3Count: string;
    category4Count: string;
    category5SleepCount: string;
    secretariatDistance: string;
  };
  projectDescription: string;
}

export interface QuoteRequestDraft {
  id: string;
  formData: QuoteRequestFormData;
  currentStep: number;
  lastSaved: string;
  title: string;
}

interface QuoteRequestState {
  currentStep: number;
  formData: QuoteRequestFormData;
  validation: {
    errors: Record<string, string>;
    isValid: boolean;
  };
  drafts: QuoteRequestDraft[];
  isLoading: boolean;
  
  // Actions
  setCurrentStep: (step: number) => void;
  updateFormData: (data: Partial<QuoteRequestFormData>) => void;
  validateStep: (step: number) => boolean;
  saveDraft: (title?: string) => void;
  loadDraft: (id: string) => void;
  deleteDraft: (id: string) => void;
  submitRequest: () => Promise<void>;
  reset: () => void;
}

const initialFormData: QuoteRequestFormData = {
  society: {
    id: null,
    isNew: false,
    details: {}
  },
  establishment: {
    name: '',
    address: '',
    activity: '',
    surface: ''
  },
  mainService: '',
  subServices: [],
  consultation: {
    type: 'phone',
    duration: '30',
    urgency: 'standard',
    selectedDate: null,
    selectedTimeSlot: '',
    isCalendarMode: false
  },
  criteria: {
    planComplexity: '',
    planSurface: '',
    planDistance: '',
    erpTypes: [],
    erpCategory: '',
    securityDescription: '',
    auditComplexity: '',
    auditDistance: '',
    auditTypes: [],
    auditCategory: '',
    auditSurface: '',
    buildingCount: '',
    followUpTypes: [],
    followUpCategory: '',
    followUpDescription: '',
    unfavorableAdvice: '',
    securityCommission: '',
    rusSmallBuildings: '',
    rusMediumBuildings: '',
    rusLargeBuildings: '',
    rusDistance: '',
    securityRegisterQuantity: '',
    accessibilityRegisterQuantity: '',
    category1Count: '',
    category2Count: '',
    category3Count: '',
    category4Count: '',
    category5SleepCount: '',
    secretariatDistance: ''
  },
  projectDescription: ''
};

const defaultDrafts: QuoteRequestDraft[] = [
  {
    id: '1',
    formData: {
      ...initialFormData,
      society: { id: '1', isNew: false, details: {} },
      establishment: {
        name: 'Restaurant Le Gourmet',
        address: '123 Rue de la Paix, 75015 Paris',
        activity: 'Restauration',
        surface: '150'
      },
      mainService: 'at-pc',
      subServices: ['plan-realization', 'security-notice']
    },
    currentStep: 4,
    lastSaved: '2024-01-15T10:30:00Z',
    title: 'Demande AT Restaurant Le Gourmet'
  }
];

const loadDrafts = (): QuoteRequestDraft[] => {
  if (typeof localStorage !== 'undefined') {
    try {
      const stored = localStorage.getItem('quoteRequestDrafts');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch {
      /* ignore */
    }
  }
  return defaultDrafts;
};

const loadStep = (): number => {
  if (typeof localStorage !== 'undefined') {
    const stored = localStorage.getItem('quoteRequestCurrentStep');
    if (stored) {
      const s = parseInt(stored, 10);
      if (!Number.isNaN(s)) return s;
    }
  }
  return 1;
};

const persistDrafts = (drafts: QuoteRequestDraft[]) => {
  if (typeof localStorage === 'undefined') return;
  if (drafts.length > 0) {
    localStorage.setItem('quoteRequestDrafts', JSON.stringify(drafts));
  } else {
    localStorage.removeItem('quoteRequestDrafts');
  }
};

const persistStep = (step: number) => {
  if (typeof localStorage === 'undefined') return;
  localStorage.setItem('quoteRequestCurrentStep', String(step));
};

export const useQuoteRequestStore = create<QuoteRequestState>((set, get) => ({
  currentStep: loadStep(),
  formData: initialFormData,
  validation: {
    errors: {},
    isValid: false
  },
  drafts: loadDrafts(),
  isLoading: false,

  setCurrentStep: (step) => {
    persistStep(step);
    set({ currentStep: step });
  },

  updateFormData: (data) => {
    set((state) => ({
      formData: { ...state.formData, ...data }
    }));
  },

  validateStep: (step) => {
    const { formData } = get();
    const errors: Record<string, string> = {};

    console.log('🔍 Validation étape', step, 'avec formData:', formData);

    switch (step) {
      case 1:
        if (!formData.society.id && !formData.society.isNew) {
          errors.society = 'Veuillez sélectionner ou créer une société';
        }
        if (formData.society.isNew) {
          if (!formData.society.details.name) {
            errors.societyName = 'Nom de la société requis';
          }
          if (!formData.society.details.siret) {
            errors.societySiret = 'SIRET requis';
          }
        }
        if (!formData.establishment.name) {
          errors.establishmentName = 'Nom de l\'établissement requis';
        }
        if (!formData.establishment.address) {
          errors.establishmentAddress = 'Adresse requise';
        }
        if (!formData.establishment.activity) {
          errors.establishmentActivity = 'Activité requise';
        }
        break;
      
      case 2:
        if (!formData.mainService) {
          errors.mainService = 'Veuillez sélectionner une prestation principale';
        }
        break;
      
      case 3:
        const selectedMainService = mainServices.find(s => s.id === formData.mainService);
        
        if (selectedMainService?.requiresCalendar) {
          console.log('📋 Validation consultation:', formData.consultation);
          
          // Validation calendrier
          if (!formData.consultation.type) {
            errors.consultationType = 'Type de consultation requis';
          }
          if (!formData.consultation.duration) {
            errors.consultationDuration = 'Durée requise';
          }
          
          // CORRECTION CRITIQUE: Vérification simplifiée de la date
          if (!formData.consultation.selectedDate) {
            console.log('❌ Date manquante:', formData.consultation.selectedDate);
            errors.consultationDate = 'Date requise';
          } else {
            console.log('✅ Date présente:', formData.consultation.selectedDate, typeof formData.consultation.selectedDate);
          }
          
          if (!formData.consultation.selectedTimeSlot || formData.consultation.selectedTimeSlot.trim() === '') {
            console.log('❌ Créneau manquant:', formData.consultation.selectedTimeSlot);
            errors.consultationTime = 'Créneau horaire requis';
          } else {
            console.log('✅ Créneau présent:', formData.consultation.selectedTimeSlot);
          }
        } else {
          // Validation sous-prestations
          if (selectedMainService?.subServices.length > 0 && formData.subServices.length === 0) {
            errors.subServices = 'Au moins une sous-prestation doit être sélectionnée';
          }
        }
        break;
      
      case 4:
        const selectedService = mainServices.find(s => s.id === formData.mainService);
        
        // Si c'est une consultation téléphonique, pas de validation de critères
        if (selectedService?.requiresCalendar) {
          // Pas de critères pour les consultations téléphoniques
          break;
        }
        
        // Validation dynamique des critères selon les sous-prestations
        const requiredCriteria = getRequiredCriteria(formData.subServices);
        
        // Si aucun critère n'est requis, l'étape est valide
        if (requiredCriteria.length === 0) {
          break;
        }
        
        requiredCriteria.forEach(criteriaKey => {
          const field = criteriaFields[criteriaKey as keyof typeof criteriaFields];
          const value = formData.criteria[criteriaKey as keyof typeof formData.criteria];
          
          if (field) {
            // Validation selon le type de champ
            if (field.type === 'multiselect') {
              if (!value || (Array.isArray(value) && value.length === 0)) {
                errors[criteriaKey] = `${field.label} requis`;
              }
            } else {
              if (!value || (typeof value === 'string' && value.trim() === '')) {
                errors[criteriaKey] = `${field.label} requis`;
              }
            }
          }
        });
        break;
      
      case 5:
        // Validation finale - vérifier que toutes les étapes précédentes sont valides
        if (!formData.projectDescription || formData.projectDescription.trim() === '') {
          errors.projectDescription = 'Description du projet requise';
        }
        break;
    }

    const isValid = Object.keys(errors).length === 0;
    set({ validation: { errors, isValid } });
    
    // Debug: afficher les erreurs dans la console
    if (!isValid) {
      console.log('❌ Erreurs de validation étape', step, ':', errors);
    } else {
      console.log('✅ Étape', step, 'validée avec succès');
    }
    
    return isValid;
  },

  saveDraft: (title) => {
    const { formData, currentStep } = get();
    const draftTitle = title || `Brouillon ${new Date().toLocaleDateString('fr-FR')}`;

    const newDraft: QuoteRequestDraft = {
      id: Date.now().toString(),
      formData,
      currentStep,
      lastSaved: new Date().toISOString(),
      title: draftTitle
    };

    set((state) => {
      const drafts = [newDraft, ...state.drafts];
      persistDrafts(drafts);
      return { drafts };
    });
  },

  loadDraft: (id) => {
    const { drafts } = get();
    const draft = drafts.find(d => d.id === id);

    if (draft) {
      set({
        formData: draft.formData,
        currentStep: draft.currentStep
      });
      persistStep(draft.currentStep);
    }
  },

  deleteDraft: (id) => {
    set((state) => {
      const drafts = state.drafts.filter(d => d.id !== id);
      persistDrafts(drafts);
      return { drafts };
    });
  },

  submitRequest: async () => {
    set({ isLoading: true });
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Reset form after successful submission
      set({
        formData: initialFormData,
        currentStep: 1,
        validation: { errors: {}, isValid: false }
      });
      persistStep(1);
    } finally {
      set({ isLoading: false });
    }
  },

  reset: () => {
    persistStep(1);
    set({
      formData: initialFormData,
      currentStep: 1,
      validation: { errors: {}, isValid: false }
    });
  }
}));

// Helper functions
export const getRequiredCriteria = (selectedSubServices: string[]): string[] => {
  const criteria = new Set<string>();
  selectedSubServices.forEach(subId => {
    const sub = subServicesData[subId];
    if (sub) {
      sub.criteria.forEach(c => criteria.add(c));
    }
  });
  return Array.from(criteria);
};

export const shouldShowDistance = (formData: QuoteRequestFormData): boolean => {
  // Logique pour déterminer si la distance doit être affichée
  return true; // Simplification pour l'instant
};

// Mock data - 6 prestations principales
export const mainServices: MainService[] = [
  {
    id: 'at-pc',
    name: 'Dossier d\'AT/PC',
    description: 'Autorisation de Travaux / Permis de Construire',
    icon: 'FileText',
    subServices: ['plan-realization', 'security-notice', 'accessibility-notice', 
                  'derogation-request', 'printing-mailing', 'audit-preventionist']
  },
  {
    id: 'audit-security-accessibility',
    name: 'Audit sécurité et/ou accessibilité',
    description: 'Diagnostic complet de conformité',
    icon: 'Shield',
    subServices: ['audit-establishments']
  },
  {
    id: 'phone-consultation',
    name: 'Consultation téléphonique ou visio',
    description: 'Conseil expert à distance',
    icon: 'Phone',
    subServices: [],
    requiresCalendar: true
  },
  {
    id: 'rus-mission',
    name: 'Mission de RUS',
    description: 'Responsable Unique de Sécurité',
    icon: 'UserCheck',
    subServices: ['rus-mission-detail', 'security-register', 'accessibility-register']
  },
  {
    id: 'annual-follow-up',
    name: 'Mission de suivi technique annuel',
    description: 'Accompagnement réglementaire continu',
    icon: 'Calendar',
    subServices: ['follow-up-establishments']
  },
  {
    id: 'municipality-instruction',
    name: 'Instruction de dossier pour le compte des mairies',
    description: 'Gestion administrative déléguée',
    icon: 'Building2',
    subServices: ['municipality-audit', 'security-commission-secretariat']
  }
];

// Sous-prestations avec critères conditionnels
export const subServicesData: Record<string, SubService> = {
  // Dossier AT/PC
  'plan-realization': { 
    id: 'plan-realization',
    name: 'Réalisation des plans', 
    description: 'Plans de masse et de niveaux',
    criteria: ['planComplexity', 'planSurface', 'planDistance'],
    estimatedPrice: 800,
    duration: '3-5 jours'
  },
  'security-notice': { 
    id: 'security-notice',
    name: 'Rédaction notice de sécurité', 
    description: 'Notice de sécurité incendie',
    criteria: ['erpTypes', 'erpCategory', 'securityDescription'],
    estimatedPrice: 600,
    duration: '2-3 jours'
  },
  'accessibility-notice': { 
    id: 'accessibility-notice',
    name: 'Rédaction notice d\'accessibilité', 
    description: 'Notice d\'accessibilité PMR',
    criteria: [],
    estimatedPrice: 400,
    duration: '1-2 jours'
  },
  'derogation-request': { 
    id: 'derogation-request',
    name: 'Demandes de dérogation', 
    description: 'Dossiers de dérogation spécifiques',
    criteria: [],
    estimatedPrice: 500,
    duration: '2-3 jours'
  },
  'printing-mailing': { 
    id: 'printing-mailing',
    name: 'Impression et envoi en mairie', 
    description: 'Impression et dépôt officiel',
    criteria: [],
    estimatedPrice: 150,
    duration: '1 jour'
  },
  'audit-preventionist': { 
    id: 'audit-preventionist',
    name: 'Audit préventionniste', 
    description: 'Visite préventive sur site',
    criteria: ['auditComplexity', 'auditDistance'],
    estimatedPrice: 450,
    duration: '1 jour'
  },
  
  // Mission RUS et suivi
  'follow-up-establishments': { 
    id: 'follow-up-establishments',
    name: 'Suivi d\'établissements', 
    description: 'Suivi réglementaire annuel',
    criteria: ['followUpTypes', 'followUpCategory', 'followUpDescription', 
               'unfavorableAdvice', 'securityCommission'],
    estimatedPrice: 300,
    duration: '12 mois'
  },
  'rus-mission-detail': { 
    id: 'rus-mission-detail',
    name: 'Mission RUS', 
    description: 'Responsable Unique de Sécurité',
    criteria: ['rusSmallBuildings', 'rusMediumBuildings', 'rusLargeBuildings', 'rusDistance'],
    estimatedPrice: 2500,
    duration: 'Continue'
  },
  'security-register': { 
    id: 'security-register',
    name: 'Registre de sécurité', 
    description: 'Tenue du registre de sécurité',
    criteria: ['securityRegisterQuantity'],
    estimatedPrice: 200,
    duration: '12 mois'
  },
  'accessibility-register': { 
    id: 'accessibility-register',
    name: 'Registre d\'accessibilité', 
    description: 'Tenue du registre d\'accessibilité',
    criteria: ['accessibilityRegisterQuantity'],
    estimatedPrice: 150,
    duration: '12 mois'
  },
  
  // Missions ponctuelles et collectivités
  'audit-establishments': { 
    id: 'audit-establishments',
    name: 'Audit d\'établissements', 
    description: 'Audit sécurité et accessibilité',
    criteria: ['auditDistance', 'auditTypes', 'auditCategory', 'auditSurface', 'buildingCount'],
    estimatedPrice: 650,
    duration: '1-2 jours'
  },
  'municipality-audit': { 
    id: 'municipality-audit',
    name: 'Audit d\'établissements (collectivités)', 
    description: 'Audit pour le compte des mairies',
    criteria: ['auditDistance', 'auditTypes', 'auditCategory', 'auditSurface', 'buildingCount'],
    estimatedPrice: 550,
    duration: '1-2 jours'
  },
  'security-commission-secretariat': { 
    id: 'security-commission-secretariat',
    name: 'Secrétariat de la commission de sécurité', 
    description: 'Secrétariat et organisation',
    criteria: ['category1Count', 'category2Count', 'category3Count', 
               'category4Count', 'category5SleepCount', 'secretariatDistance'],
    estimatedPrice: 1200,
    duration: 'Variable'
  }
};

// Types ERP officiels
export const erpTypes = [
  { id: 'J', name: 'J - Personnes âgées et handicapées', description: 'EHPAD, centres spécialisés' },
  { id: 'L', name: 'L - Salles de spectacles', description: 'Théâtres, cinémas, salles de concert' },
  { id: 'M', name: 'M - Commerces', description: 'Magasins, centres commerciaux' },
  { id: 'N', name: 'N - Restaurants', description: 'Restaurants, bars, cafés' },
  { id: 'O', name: 'O - Hôtels', description: 'Hôtels, résidences touristiques' },
  { id: 'P', name: 'P - Salles de danse', description: 'Discothèques, salles de jeux' },
  { id: 'R', name: 'R - Enseignement', description: 'Écoles, universités, centres de formation' },
  { id: 'S', name: 'S - Bibliothèques', description: 'Bibliothèques, centres de documentation' },
  { id: 'T', name: 'T - Salles d\'exposition', description: 'Musées, galeries, foires' },
  { id: 'U', name: 'U - Établissements sanitaires', description: 'Hôpitaux, cliniques, dispensaires' },
  { id: 'V', name: 'V - Établissements de culte', description: 'Églises, temples, mosquées' },
  { id: 'W', name: 'W - Administrations', description: 'Bureaux, banques, administrations' },
  { id: 'X', name: 'X - Établissements sportifs', description: 'Gymnases, piscines couvertes' },
  { id: 'Y', name: 'Y - Musées', description: 'Musées, monuments historiques' }
];

// Critères spécifiques dynamiques
export const criteriaFields = {
  // Réalisation des plans
  planComplexity: {
    type: 'select',
    label: 'Complexité des plans',
    options: [
      { value: 'simple', label: 'Simple - Plan rectangulaire, peu de locaux' },
      { value: 'moyenne', label: 'Moyenne - Formes variées, détails standard' },
      { value: 'complexe', label: 'Complexe - Formes complexes, nombreuses pièces' }
    ]
  },
  planSurface: {
    type: 'select',
    label: 'Superficie à dessiner',
    options: [
      { value: '<200', label: 'moins de 200 m²' },
      { value: '200-500', label: '200 - 500 m²' },
      { value: '500-1000', label: '500 - 1000 m²' },
      { value: '>1000', label: 'plus de 1000 m²' }
    ]
  },
  planDistance: {
    type: 'select',
    label: 'Distance pour relevé',
    options: [
      { value: '<50', label: 'moins de 50 km' },
      { value: '50-100', label: '50 - 100 km' },
      { value: '101-200', label: '101 - 200 km' },
      { value: '201-400', label: '201 - 400 km' },
      { value: '>400', label: 'plus de 400 km' }
    ]
  },
  
  // Notice de sécurité
  erpTypes: {
    type: 'multiselect',
    label: 'Types d\'ERP concernés',
    options: erpTypes
  },
  erpCategory: {
    type: 'select',
    label: 'Catégorie d\'établissement',
    options: [
      { value: '1', label: '1ère catégorie (> 1500 personnes)' },
      { value: '2', label: '2ème catégorie (701 à 1500 personnes)' },
      { value: '3', label: '3ème catégorie (301 à 700 personnes)' },
      { value: '4', label: '4ème catégorie (< 300 personnes)' },
      { value: '5', label: '5ème catégorie (petits ERP)' }
    ]
  },
  securityDescription: {
    type: 'textarea',
    label: 'Descriptif succinct de l\'établissement',
    placeholder: 'Décrivez brièvement l\'établissement et ses spécificités sécurité...'
  },
  
  // Audit
  auditComplexity: {
    type: 'select',
    label: 'Complexité de l\'audit',
    options: [
      { value: 'simple', label: 'Simple - Établissement standard' },
      { value: 'moyenne', label: 'Moyenne - Quelques spécificités' },
      { value: 'complexe', label: 'Complexe - Établissement atypique' }
    ]
  },
  auditDistance: {
    type: 'select',
    label: 'Distance pour audit',
    options: [
      { value: '<50', label: 'moins de 50 km' },
      { value: '50-100', label: '50 - 100 km' },
      { value: '101-200', label: '101 - 200 km' },
      { value: '201-400', label: '201 - 400 km' },
      { value: '>400', label: 'plus de 400 km' }
    ]
  },
  auditTypes: {
    type: 'multiselect',
    label: 'Types d\'ERP à auditer',
    options: erpTypes
  },
  auditCategory: {
    type: 'select',
    label: 'Catégorie d\'ERP',
    options: [
      { value: '1', label: '1ère catégorie' },
      { value: '2', label: '2ème catégorie' },
      { value: '3', label: '3ème catégorie' },
      { value: '4', label: '4ème catégorie' },
      { value: '5', label: '5ème catégorie' }
    ]
  },
  auditSurface: {
    type: 'select',
    label: 'Superficie de l\'établissement',
    options: [
      { value: '<200', label: 'moins de 200 m²' },
      { value: '200-500', label: '200 - 500 m²' },
      { value: '500-1000', label: '500 - 1000 m²' },
      { value: '>1000', label: 'plus de 1000 m²' }
    ]
  },
  buildingCount: {
    type: 'number',
    label: 'Nombre de bâtiments',
    min: 1
  },
  
  // Suivi établissements
  followUpTypes: {
    type: 'multiselect',
    label: 'Types d\'établissements suivis',
    options: erpTypes
  },
  followUpCategory: {
    type: 'select',
    label: 'Catégorie principale',
    options: [
      { value: '1', label: '1ère catégorie' },
      { value: '2', label: '2ème catégorie' },
      { value: '3', label: '3ème catégorie' },
      { value: '4', label: '4ème catégorie' },
      { value: '5', label: '5ème catégorie' }
    ]
  },
  followUpDescription: {
    type: 'textarea',
    label: 'Description des établissements',
    placeholder: 'Décrivez les établissements à suivre...'
  },
  unfavorableAdvice: {
    type: 'radio',
    label: 'Établissement en avis défavorable',
    options: [
      { value: 'oui', label: 'Oui' },
      { value: 'non', label: 'Non' }
    ]
  },
  securityCommission: {
    type: 'radio',
    label: 'Commission de sécurité dans l\'année',
    options: [
      { value: 'oui', label: 'Oui' },
      { value: 'non', label: 'Non' }
    ]
  },
  
  // Mission RUS
  rusSmallBuildings: {
    type: 'number',
    label: 'Établissements < 50 m²',
    min: 0
  },
  rusMediumBuildings: {
    type: 'number',
    label: 'Établissements < 300 m²',
    min: 0
  },
  rusLargeBuildings: {
    type: 'number',
    label: 'Grands établissements',
    min: 0
  },
  rusDistance: {
    type: 'select',
    label: 'Distance moyenne des établissements',
    options: [
      { value: '<50', label: 'moins de 50 km' },
      { value: '50-100', label: '50 - 100 km' },
      { value: '101-200', label: '101 - 200 km' },
      { value: '>200', label: 'plus de 200 km' }
    ]
  },
  
  // Registres
  securityRegisterQuantity: {
    type: 'number',
    label: 'Nombre de registres de sécurité',
    min: 1
  },
  accessibilityRegisterQuantity: {
    type: 'number',
    label: 'Nombre de registres d\'accessibilité',
    min: 1
  },
  
  // Secrétariat commission
  category1Count: {
    type: 'number',
    label: 'ERP 1ère catégorie',
    min: 0
  },
  category2Count: {
    type: 'number',
    label: 'ERP 2ème catégorie',
    min: 0
  },
  category3Count: {
    type: 'number',
    label: 'ERP 3ème catégorie',
    min: 0
  },
  category4Count: {
    type: 'number',
    label: 'ERP 4ème catégorie',
    min: 0
  },
  category5SleepCount: {
    type: 'number',
    label: 'ERP 5ème catégorie avec hébergement',
    min: 0
  },
  secretariatDistance: {
    type: 'select',
    label: 'Distance pour déplacements',
    options: [
      { value: '<50', label: 'moins de 50 km' },
      { value: '50-100', label: '50 - 100 km' },
      { value: '101-200', label: '101 - 200 km' },
      { value: '>200', label: 'plus de 200 km' }
    ]
  }
};

// Créneaux horaires disponibles
export const timeSlots = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30'
];

// Jours fériés français 2024-2025
export const holidays = [
  '2024-12-25', '2025-01-01', '2025-04-21', '2025-05-01',
  '2025-05-08', '2025-05-29', '2025-06-09', '2025-07-14',
  '2025-08-15', '2025-11-01', '2025-11-11', '2025-12-25'
];