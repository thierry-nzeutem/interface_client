import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  Clock, 
  Circle, 
  AlertTriangle, 
  Upload, 
  MessageSquare, 
  FileText,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface TimelineStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'inProgress' | 'pending' | 'blocked';
  date?: string;
  documents?: string[];
  actions?: string[];
  comments?: number;
}

interface ProjectTimelineProps {
  projectId: string;
}

const ProjectTimeline: React.FC<ProjectTimelineProps> = ({ projectId }) => {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());

  const mockSteps: TimelineStep[] = [
    {
      id: '1',
      title: 'Réception de la demande',
      description: 'Votre demande d\'autorisation de travaux a été reçue et enregistrée',
      status: 'completed',
      date: '2024-01-10',
      documents: ['Formulaire de demande', 'Pièces d\'identité'],
      comments: 2
    },
    {
      id: '2',
      title: 'Analyse préliminaire',
      description: 'Étude de faisabilité et vérification des documents fournis',
      status: 'completed',
      date: '2024-01-12',
      documents: ['Rapport d\'analyse', 'Liste documents manquants'],
      comments: 1
    },
    {
      id: '3',
      title: 'Complétion du dossier',
      description: 'Collecte des documents complémentaires et finalisation du dossier',
      status: 'inProgress',
      date: '2024-01-15',
      actions: ['Upload plans architecte', 'Validation notice sécurité'],
      documents: ['Plans existants', 'Notice sécurité provisoire'],
      comments: 3
    },
    {
      id: '4',
      title: 'Instruction technique',
      description: 'Examen technique du dossier par nos experts',
      status: 'pending',
      documents: [],
      comments: 0
    },
    {
      id: '5',
      title: 'Dépôt en mairie',
      description: 'Transmission du dossier complet aux services municipaux',
      status: 'pending',
      documents: [],
      comments: 0
    },
    {
      id: '6',
      title: 'Instruction administrative',
      description: 'Examen du dossier par les services de la mairie',
      status: 'pending',
      documents: [],
      comments: 0
    },
    {
      id: '7',
      title: 'Délivrance autorisation',
      description: 'Réception de l\'autorisation de travaux officielle',
      status: 'pending',
      documents: [],
      comments: 0
    }
  ];

  const getStepIcon = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'inProgress':
        return <Clock className="h-6 w-6 text-orange-500" />;
      case 'blocked':
        return <AlertTriangle className="h-6 w-6 text-red-500" />;
      default:
        return <Circle className="h-6 w-6 text-gray-400" />;
    }
  };

  const getStepStatus = (status: TimelineStep['status']) => {
    switch (status) {
      case 'completed':
        return <Badge variant="success" size="sm">Terminé</Badge>;
      case 'inProgress':
        return <Badge variant="warning" size="sm">En cours</Badge>;
      case 'blocked':
        return <Badge variant="error" size="sm">Bloqué</Badge>;
      default:
        return <Badge variant="info" size="sm">À venir</Badge>;
    }
  };

  const toggleStep = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  return (
    <div className="space-y-4">
      {mockSteps.map((step, index) => {
        const isExpanded = expandedSteps.has(step.id);
        const isLast = index === mockSteps.length - 1;
        
        return (
          <div key={step.id} className="relative">
            {/* Timeline line */}
            {!isLast && (
              <div className="absolute left-6 top-12 w-0.5 h-16 bg-gray-200"></div>
            )}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative bg-white border rounded-lg p-4 hover:shadow-md transition-shadow ${
                step.status === 'inProgress' ? 'border-orange-200 bg-orange-50' : 'border-gray-200'
              }`}
            >
              <div className="flex items-start space-x-4">
                {/* Step icon */}
                <div className="flex-shrink-0 mt-1">
                  {getStepIcon(step.status)}
                </div>
                
                {/* Step content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <h3 className="text-lg font-medium text-gray-900">{step.title}</h3>
                      {getStepStatus(step.status)}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {step.date && (
                        <span className="text-sm text-gray-500">
                          {new Date(step.date).toLocaleDateString('fr-FR')}
                        </span>
                      )}
                      
                      {(step.documents?.length > 0 || step.actions?.length > 0 || step.comments > 0) && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleStep(step.id)}
                        >
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  
                  {/* Quick indicators */}
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    {step.documents && step.documents.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <FileText className="h-4 w-4" />
                        <span>{step.documents.length} document{step.documents.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    
                    {step.actions && step.actions.length > 0 && (
                      <div className="flex items-center space-x-1">
                        <Upload className="h-4 w-4" />
                        <span>{step.actions.length} action{step.actions.length > 1 ? 's' : ''}</span>
                      </div>
                    )}
                    
                    {step.comments > 0 && (
                      <div className="flex items-center space-x-1">
                        <MessageSquare className="h-4 w-4" />
                        <span>{step.comments} commentaire{step.comments > 1 ? 's' : ''}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Expanded content */}
              <AnimatePresence>
                {isExpanded && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="mt-4 pl-10 space-y-4"
                  >
                    {/* Actions required */}
                    {step.actions && step.actions.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Actions requises</h4>
                        <div className="space-y-2">
                          {step.actions.map((action, actionIndex) => (
                            <div key={actionIndex} className="flex items-center justify-between p-3 bg-orange-50 border border-orange-200 rounded-lg">
                              <span className="text-sm text-orange-900">{action}</span>
                              <Button variant="primary" size="sm">
                                Effectuer
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Documents */}
                    {step.documents && step.documents.length > 0 && (
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">Documents</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {step.documents.map((doc, docIndex) => (
                            <div key={docIndex} className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                              <FileText className="h-4 w-4 text-gray-500" />
                              <span className="text-sm text-gray-700">{doc}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {/* Comments section */}
                    {step.comments > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900">Commentaires ({step.comments})</h4>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            Voir tous
                          </Button>
                        </div>
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        );
      })}
    </div>
  );
};

export default ProjectTimeline;