import { create } from 'zustand';

// Types pour les données fictives
interface MockNotification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface MockActivity {
  id: string;
  type: 'project_update' | 'document_upload' | 'deadline_reminder' | 'system';
  title: string;
  description: string;
  timestamp: string;
  projectId?: string;
  userId: string;
  userName: string;
}

interface MockDocument {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'zip';
  size: string;
  uploadDate: string;
  projectId: string;
  category: string;
  status: 'draft' | 'pending' | 'approved' | 'rejected';
  version: string;
  downloadUrl: string;
}

interface MockDataState {
  notifications: MockNotification[];
  activities: MockActivity[];
  documents: MockDocument[];
  isLoading: boolean;
  
  // Actions
  markNotificationAsRead: (id: string) => void;
  addNotification: (notification: Omit<MockNotification, 'id' | 'timestamp'>) => void;
  clearAllNotifications: () => void;
  uploadDocument: (document: Omit<MockDocument, 'id' | 'uploadDate'>) => void;
  downloadDocument: (id: string) => void;
  deleteDocument: (id: string) => void;
  addActivity: (activity: Omit<MockActivity, 'id' | 'timestamp'>) => void;
}

export const useMockDataStore = create<MockDataState>((set, get) => ({
  isLoading: false,
  
  notifications: [
    {
      id: '1',
      type: 'warning',
      title: 'Échéance proche',
      message: 'Le projet AT-2024-001 arrive à échéance dans 3 jours',
      timestamp: '2024-01-20T10:30:00Z',
      read: false,
      actionUrl: '/projects/1'
    },
    {
      id: '2',
      type: 'success',
      title: 'Document validé',
      message: 'La notice de sécurité a été approuvée par la commission',
      timestamp: '2024-01-19T15:45:00Z',
      read: false,
      actionUrl: '/documents'
    },
    {
      id: '3',
      type: 'info',
      title: 'Nouveau message',
      message: 'L\'équipe Prévéris a ajouté un commentaire sur votre projet',
      timestamp: '2024-01-19T09:15:00Z',
      read: true,
      actionUrl: '/projects/1'
    },
    {
      id: '4',
      type: 'error',
      title: 'Action requise',
      message: 'Documents manquants pour le dossier ERP-2024-003',
      timestamp: '2024-01-18T14:20:00Z',
      read: false,
      actionUrl: '/projects/3'
    },
    {
      id: '5',
      type: 'info',
      title: 'Maintenance programmée',
      message: 'Maintenance système prévue dimanche de 2h à 4h',
      timestamp: '2024-01-17T11:00:00Z',
      read: true
    }
  ],

  activities: [
    {
      id: '1',
      type: 'project_update',
      title: 'Projet mis à jour',
      description: 'Le statut du projet AT-2024-001 est passé à "En cours de validation"',
      timestamp: '2024-01-20T14:30:00Z',
      projectId: '1',
      userId: 'expert1',
      userName: 'Jean Dupuis'
    },
    {
      id: '2',
      type: 'document_upload',
      title: 'Document ajouté',
      description: 'Plan de masse mis à jour (version 1.2)',
      timestamp: '2024-01-20T11:15:00Z',
      projectId: '1',
      userId: 'user1',
      userName: 'Vous'
    },
    {
      id: '3',
      type: 'deadline_reminder',
      title: 'Rappel d\'échéance',
      description: 'Échéance dans 3 jours pour le projet AT-2024-001',
      timestamp: '2024-01-20T09:00:00Z',
      projectId: '1',
      userId: 'system',
      userName: 'Système'
    },
    {
      id: '4',
      type: 'project_update',
      title: 'Commission programmée',
      description: 'Passage en commission de sécurité prévu le 25 janvier',
      timestamp: '2024-01-19T16:45:00Z',
      projectId: '2',
      userId: 'expert2',
      userName: 'Marie Leroy'
    },
    {
      id: '5',
      type: 'system',
      title: 'Sauvegarde automatique',
      description: 'Vos données ont été sauvegardées automatiquement',
      timestamp: '2024-01-19T12:00:00Z',
      userId: 'system',
      userName: 'Système'
    }
  ],

  documents: [
    {
      id: '1',
      name: 'Plan de masse - Restaurant Le Gourmet.pdf',
      type: 'pdf',
      size: '2.3 MB',
      uploadDate: '2024-01-15T10:30:00Z',
      projectId: '1',
      category: 'Plans',
      status: 'approved',
      version: '1.2',
      downloadUrl: '/api/documents/1/download'
    },
    {
      id: '2',
      name: 'Notice de sécurité.pdf',
      type: 'pdf',
      size: '1.8 MB',
      uploadDate: '2024-01-14T14:20:00Z',
      projectId: '1',
      category: 'Documents réglementaires',
      status: 'pending',
      version: '2.0',
      downloadUrl: '/api/documents/2/download'
    },
    {
      id: '3',
      name: 'Photos avant travaux.zip',
      type: 'zip',
      size: '15.2 MB',
      uploadDate: '2024-01-12T09:45:00Z',
      projectId: '1',
      category: 'Photos',
      status: 'approved',
      version: '1.0',
      downloadUrl: '/api/documents/3/download'
    },
    {
      id: '4',
      name: 'Rapport audit accessibilité.pdf',
      type: 'pdf',
      size: '4.1 MB',
      uploadDate: '2024-01-10T16:15:00Z',
      projectId: '2',
      category: 'Rapports',
      status: 'approved',
      version: '1.0',
      downloadUrl: '/api/documents/4/download'
    },
    {
      id: '5',
      name: 'Attestation vérification SSI.pdf',
      type: 'pdf',
      size: '876 KB',
      uploadDate: '2024-01-08T11:30:00Z',
      projectId: '3',
      category: 'Certificats',
      status: 'approved',
      version: '1.0',
      downloadUrl: '/api/documents/5/download'
    }
  ],

  markNotificationAsRead: (id: string) => {
    set((state) => ({
      notifications: state.notifications.map(notif =>
        notif.id === id ? { ...notif, read: true } : notif
      )
    }));
  },

  addNotification: (notification) => {
    const newNotification: MockNotification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    set((state) => ({
      notifications: [newNotification, ...state.notifications]
    }));
  },

  clearAllNotifications: () => {
    set((state) => ({
      notifications: state.notifications.map(notif => ({ ...notif, read: true }))
    }));
  },

  uploadDocument: (document) => {
    const newDocument: MockDocument = {
      ...document,
      id: Date.now().toString(),
      uploadDate: new Date().toISOString()
    };
    
    set((state) => ({
      documents: [newDocument, ...state.documents]
    }));

    // Ajouter une activité
    get().addActivity({
      type: 'document_upload',
      title: 'Document ajouté',
      description: `${document.name} a été téléchargé`,
      projectId: document.projectId,
      userId: 'user1',
      userName: 'Vous'
    });

    // Ajouter une notification
    get().addNotification({
      type: 'success',
      title: 'Document téléchargé',
      message: `${document.name} a été ajouté avec succès`,
      read: false
    });
  },

  downloadDocument: (id: string) => {
    const document = get().documents.find(doc => doc.id === id);
    if (document) {
      // Simuler le téléchargement
      console.log(`Téléchargement de ${document.name}...`);
      
      // Ajouter une activité
      get().addActivity({
        type: 'system',
        title: 'Document téléchargé',
        description: `${document.name} a été téléchargé`,
        projectId: document.projectId,
        userId: 'user1',
        userName: 'Vous'
      });
    }
  },

  deleteDocument: (id: string) => {
    const document = get().documents.find(doc => doc.id === id);
    if (document) {
      set((state) => ({
        documents: state.documents.filter(doc => doc.id !== id)
      }));

      // Ajouter une activité
      get().addActivity({
        type: 'system',
        title: 'Document supprimé',
        description: `${document.name} a été supprimé`,
        projectId: document.projectId,
        userId: 'user1',
        userName: 'Vous'
      });

      // Ajouter une notification
      get().addNotification({
        type: 'info',
        title: 'Document supprimé',
        message: `${document.name} a été supprimé avec succès`,
        read: false
      });
    }
  },

  addActivity: (activity) => {
    const newActivity: MockActivity = {
      ...activity,
      id: Date.now().toString(),
      timestamp: new Date().toISOString()
    };
    
    set((state) => ({
      activities: [newActivity, ...state.activities]
    }));
  }
}));