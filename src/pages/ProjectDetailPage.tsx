import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Building, 
  Calendar, 
  Users, 
  FileText, 
  MessageSquare,
  Download,
  Share
} from 'lucide-react';
import { useProjectStore } from '../stores/projectStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProjectTimeline from '../components/projects/ProjectTimeline';

const ProjectDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { projects } = useProjectStore();
  const [activeTab, setActiveTab] = useState<'overview' | 'timeline' | 'documents' | 'communication'>('timeline');

  const project = projects.find(p => p.id === id);

  if (!project) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Projet non trouvé</h2>
        <p className="text-gray-600">Le projet demandé n'existe pas ou n'est plus accessible.</p>
      </div>
    );
  }

  const getStatusConfig = (status: typeof project.status) => {
    switch (status) {
      case 'EN_COURS':
        return { variant: 'warning' as const, text: 'En cours' };
      case 'VALIDE':
        return { variant: 'success' as const, text: 'Validé' };
      case 'URGENT':
        return { variant: 'error' as const, text: 'Urgent' };
      case 'TERMINE':
        return { variant: 'success' as const, text: 'Terminé' };
    }
  };

  const statusConfig = getStatusConfig(project.status);

  const tabs = [
    { id: 'timeline', label: 'Timeline', icon: Calendar },
    { id: 'overview', label: 'Vue d\'ensemble', icon: FileText },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'communication', label: 'Communication', icon: MessageSquare }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Button variant="ghost" size="sm">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour aux projets
        </Button>
      </div>

      {/* Project Header */}
      <Card className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <Badge variant="info" size="sm">{project.type}</Badge>
              <span className="text-sm text-gray-500">#{project.id}</span>
              <Badge variant={statusConfig.variant} size="sm">
                {statusConfig.text}
              </Badge>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{project.title}</h1>
            
            <div className="flex items-center space-x-6 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span>{project.company} - {project.establishment}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Calendar className="h-4 w-4" />
                <span>Créé le {new Date(project.createdAt).toLocaleDateString('fr-FR')}</span>
              </div>
              {project.nextDeadline && (
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Échéance: {new Date(project.nextDeadline).toLocaleDateString('fr-FR')}</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm">
              <Share className="h-4 w-4 mr-2" />
              Partager
            </Button>
            <Button variant="secondary" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Exporter
            </Button>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progression</span>
            <span className="text-sm text-gray-600">{project.progress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>
        </div>
      </Card>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="overflow-hidden">
            {/* Tabs */}
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                        activeTab === tab.id
                          ? 'border-red-500 text-red-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === 'timeline' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <ProjectTimeline projectId={project.id} />
                </motion.div>
              )}

              {activeTab === 'overview' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Détails du projet</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-gray-500">Type de prestation</label>
                        <p className="text-gray-900">{project.type}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Statut</label>
                        <p className="text-gray-900">{statusConfig.text}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Société</label>
                        <p className="text-gray-900">{project.company}</p>
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-500">Établissement</label>
                        <p className="text-gray-900">{project.establishment}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === 'documents' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Documents du projet</h3>
                  <p className="text-gray-600">Les documents liés à ce projet apparaîtront ici.</p>
                </motion.div>
              )}

              {activeTab === 'communication' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Communication projet</h3>
                  <p className="text-gray-600">L'historique des échanges apparaîtra ici.</p>
                </motion.div>
              )}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Project Info */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informations projet</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-500">Dernière activité:</span>
                <p className="text-gray-900">{project.lastActivity}</p>
              </div>
              <div>
                <span className="text-gray-500">Progression:</span>
                <p className="text-gray-900">{project.progress}%</p>
              </div>
              {project.nextDeadline && (
                <div>
                  <span className="text-gray-500">Prochaine échéance:</span>
                  <p className="text-gray-900">
                    {new Date(project.nextDeadline).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
            </div>
          </Card>

          {/* Team */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Équipe Prévéris</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="bg-red-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">
                  JD
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Jean Dupuis</p>
                  <p className="text-xs text-gray-500">Chef de projet</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="bg-blue-500 text-white rounded-full h-8 w-8 flex items-center justify-center text-sm font-medium">
                  ML
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">Marie Leroy</p>
                  <p className="text-xs text-gray-500">Ingénieur sécurité</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
            <div className="space-y-3">
              <Button variant="primary" className="w-full justify-start">
                <MessageSquare className="h-4 w-4 mr-2" />
                Contacter l'équipe
              </Button>
              <Button variant="secondary" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                Voir documents
              </Button>
              <Button variant="ghost" className="w-full justify-start">
                <Download className="h-4 w-4 mr-2" />
                Télécharger rapport
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetailPage;