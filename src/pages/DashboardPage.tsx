import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FolderOpen, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  Building,
  Calendar,
  FileText,
  Shield,
  TrendingUp,
  Users,
  Euro,
  Activity,
  Plus,
  ArrowRight,
  Zap,
  Bell
} from 'lucide-react';
import { useProjectStore } from '../stores/projectStore';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import { useMockDataStore } from '../stores/mockDataStore';
import { useToastStore } from '../components/ui/Toast';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import ProjectCard from '../components/projects/ProjectCard';
import Tooltip from '../components/ui/Tooltip';

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { projects } = useProjectStore();
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const { activities, addNotification } = useMockDataStore();
  const { addToast } = useToastStore();

  const stats = {
    total: projects.length,
    inProgress: projects.filter(p => p.status === 'EN_COURS').length,
    completed: projects.filter(p => p.status === 'VALIDE' || p.status === 'TERMINE').length,
    urgent: projects.filter(p => p.status === 'URGENT').length
  };

  const recentProjects = projects.slice(0, 3);
  const recentActivities = activities.slice(0, 5);

  const upcomingDeadlines = projects
    .filter(p => p.nextDeadline)
    .sort((a, b) => new Date(a.nextDeadline!).getTime() - new Date(b.nextDeadline!).getTime())
    .slice(0, 3);

  // Widget santé globale
  const globalHealth = {
    score: 85,
    trend: '+5%',
    status: 'good' as 'good' | 'warning' | 'critical'
  };

  const getHealthColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-orange-600 bg-orange-100';
      case 'critical': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  // Données pour mini-graphique (simulation)
  const trendData = [65, 70, 68, 75, 82, 85];

  // Actions rapides améliorées
  const quickActions = [
    {
      id: 'new-quote',
      title: 'Demande de devis',
      description: 'Générateur personnalisé',
      icon: FileText,
      color: 'bg-red-500',
      href: '/quote-request',
      action: () => {
        addToast({
          type: 'info',
          title: 'Redirection',
          message: 'Redirection vers le générateur de devis...'
        });
        navigate('/quote-request');
      }
    },
    {
      id: 'schedule-audit',
      title: 'Planifier audit',
      description: 'Sécurité/accessibilité',
      icon: Calendar,
      color: 'bg-blue-500',
      href: '/quote-request',
      action: () => {
        addToast({
          type: 'success',
          title: 'Audit programmé',
          message: 'Votre demande d\'audit a été enregistrée'
        });
        addNotification({
          type: 'success',
          title: 'Audit programmé',
          message: 'Votre demande d\'audit sécurité a été enregistrée',
          read: false
        });
      }
    },
    {
      id: 'compliance',
      title: 'Suivi conformité',
      description: 'Échéances et maintenances',
      icon: Shield,
      color: 'bg-green-500',
      href: '/compliance',
      action: () => {
        addToast({
          type: 'info',
          title: 'Conformité',
          message: 'Accès au tableau de bord conformité'
        });
        navigate('/compliance');
      }
    },
    {
      id: 'documents',
      title: 'Mes documents',
      description: 'Bibliothèque complète',
      icon: FolderOpen,
      color: 'bg-purple-500',
      href: '/documents',
      action: () => {
        addToast({
          type: 'info',
          title: 'Documents',
          message: 'Ouverture de la bibliothèque de documents'
        });
        navigate('/documents');
      }
    }
  ];

  const handleQuickAction = (action: any) => {
    if (action.action) {
      action.action();
    }
  };

  const handleTestNotification = () => {
    addNotification({
      type: 'warning',
      title: 'Test de notification',
      message: 'Ceci est une notification de test depuis le dashboard',
      read: false
    });
    
    addToast({
      type: 'success',
      title: 'Notification ajoutée',
      message: 'Une nouvelle notification de test a été créée'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {t('dashboard.welcome')} {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="text-gray-600 mt-1">
            {t('dashboard.overview')}
          </p>
        </div>
        
        <div className="flex space-x-3">
          <Button variant="secondary" onClick={handleTestNotification}>
            <Bell className="h-4 w-4 mr-2" />
            Test notification
          </Button>
          <Button onClick={() => navigate('/quote-request')}>
            <Plus className="h-4 w-4 mr-2" />
            Demande de devis
          </Button>
        </div>
      </div>

      {/* Company Selector */}
      {user?.companies && user.companies.length > 1 && (
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-gray-500" />
              <span className="font-medium text-gray-900">{t('dashboard.activeCompany')}</span>
              <Tooltip content={{
                definition: "Société actuellement sélectionnée pour l'affichage des données",
                example: "Changez de société pour voir les projets et établissements correspondants"
              }} />
            </div>
            <select 
              className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
              onChange={(e) => {
                addToast({
                  type: 'info',
                  title: 'Société changée',
                  message: `Affichage des données pour ${e.target.selectedOptions[0].text}`
                });
              }}
            >
              {user.companies.map(company => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>
        </Card>
      )}

      {/* Widget Santé Globale + Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Widget Santé Globale */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2"
        >
          <Card className="p-6 bg-gradient-to-br from-red-50 to-orange-50 border-red-200 cursor-pointer hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Santé Globale</h3>
                <p className="text-sm text-gray-600">Conformité et projets</p>
              </div>
              <div className={`p-3 rounded-lg ${getHealthColor(globalHealth.status)}`}>
                <Activity className="h-6 w-6" />
              </div>
            </div>
            
            <div className="flex items-end space-x-4">
              <div>
                <div className="text-3xl font-bold text-gray-900">{globalHealth.score}%</div>
                <div className="flex items-center space-x-1 text-sm text-green-600">
                  <TrendingUp className="h-4 w-4" />
                  <span>{globalHealth.trend} ce mois</span>
                </div>
              </div>
              
              {/* Mini graphique */}
              <div className="flex-1 h-12 flex items-end space-x-1">
                {trendData.map((value, index) => (
                  <div
                    key={index}
                    className="bg-red-500 rounded-t cursor-pointer hover:bg-red-600 transition-colors"
                    style={{ 
                      height: `${(value / 100) * 100}%`,
                      width: '100%',
                      opacity: index === trendData.length - 1 ? 1 : 0.7
                    }}
                    onClick={() => {
                      addToast({
                        type: 'info',
                        title: 'Données détaillées',
                        message: `Score du ${new Date(Date.now() - (trendData.length - 1 - index) * 24 * 60 * 60 * 1000).toLocaleDateString()}: ${value}%`
                      });
                    }}
                  />
                ))}
              </div>
            </div>
          </Card>
        </motion.div>

        {/* Stats Cards */}
        {[
          { label: t('dashboard.totalProjects'), value: stats.total, icon: FolderOpen, color: 'blue' },
          { label: t('dashboard.inProgress'), value: stats.inProgress, icon: Clock, color: 'orange' },
          { label: t('dashboard.completed'), value: stats.completed, icon: CheckCircle, color: 'green' }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: (index + 1) * 0.1 }}
          >
            <Card 
              className="p-6 cursor-pointer hover:shadow-lg transition-shadow"
              onClick={() => {
                addToast({
                  type: 'info',
                  title: stat.label,
                  message: `Vous avez ${stat.value} projet${stat.value > 1 ? 's' : ''} ${stat.label.toLowerCase()}`
                });
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-lg bg-${stat.color}-100`}>
                  <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Notifications Contextuelles */}
      {upcomingDeadlines.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 bg-orange-50 border-orange-200">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div className="flex-1">
                <h4 className="font-medium text-orange-900">
                  {upcomingDeadlines.length} échéance{upcomingDeadlines.length > 1 ? 's' : ''} proche{upcomingDeadlines.length > 1 ? 's' : ''}
                </h4>
                <p className="text-sm text-orange-700">
                  Prochaine échéance : {new Date(upcomingDeadlines[0].nextDeadline!).toLocaleDateString('fr-FR')}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'Échéances',
                    message: 'Redirection vers la liste des échéances'
                  });
                  navigate('/projects');
                }}
              >
                Voir toutes
              </Button>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Actions Rapides Améliorées */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions rapides</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {quickActions.map((action, index) => (
            <motion.div
              key={action.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                hover 
                className="p-6 cursor-pointer group"
                onClick={() => handleQuickAction(action)}
              >
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                    <action.icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                      {action.title}
                    </h3>
                    <p className="text-sm text-gray-600">{action.description}</p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-red-500 transition-colors" />
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">{t('dashboard.recentProjects')}</h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'Projets',
                    message: 'Redirection vers tous les projets'
                  });
                  navigate('/projects');
                }}
              >
                {t('dashboard.viewAll')}
              </Button>
            </div>
            <div className="space-y-4">
              {recentProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    addToast({
                      type: 'info',
                      title: 'Projet sélectionné',
                      message: `Ouverture du projet ${project.title}`
                    });
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="info" size="sm">{project.type}</Badge>
                        <span className="text-sm text-gray-500">#{project.id}</span>
                      </div>
                      <h3 className="font-medium text-gray-900">{project.title}</h3>
                      <p className="text-sm text-gray-600">{project.company}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{project.progress}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-red-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Upcoming Deadlines */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">{t('dashboard.upcomingDeadlines')}</h3>
            <div className="space-y-3">
              {upcomingDeadlines.map((project) => (
                <div 
                  key={project.id} 
                  className="p-3 bg-orange-50 rounded-lg border border-orange-200 cursor-pointer hover:bg-orange-100 transition-colors"
                  onClick={() => {
                    addToast({
                      type: 'warning',
                      title: 'Échéance proche',
                      message: `Le projet ${project.title} arrive à échéance le ${new Date(project.nextDeadline!).toLocaleDateString('fr-FR')}`
                    });
                  }}
                >
                  <div className="flex items-center space-x-2 mb-1">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">
                      {new Date(project.nextDeadline!).toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                  <p className="text-sm text-gray-900 font-medium">{project.title}</p>
                  <p className="text-xs text-gray-600">{project.company}</p>
                </div>
              ))}
              {upcomingDeadlines.length === 0 && (
                <p className="text-sm text-gray-500 text-center py-4">
                  {t('dashboard.noDeadlines')}
                </p>
              )}
            </div>
          </Card>

          {/* Recent Activities */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Activités récentes</h3>
            <div className="space-y-3">
              {recentActivities.map((activity) => (
                <div 
                  key={activity.id} 
                  className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    addToast({
                      type: 'info',
                      title: 'Activité',
                      message: activity.description
                    });
                  }}
                >
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                    <p className="text-xs text-gray-600">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(activity.timestamp).toLocaleDateString('fr-FR')} par {activity.userName}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* KPIs Supplémentaires */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Indicateurs clés</h3>
            <div className="space-y-4">
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => {
                  addToast({
                    type: 'info',
                    title: 'Établissements',
                    message: 'Vous gérez 12 établissements'
                  });
                }}
              >
                <div className="flex items-center space-x-2">
                  <Users className="h-4 w-4 text-blue-500" />
                  <span className="text-sm text-gray-600">Établissements</span>
                </div>
                <span className="font-medium text-gray-900">12</span>
              </div>
              
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Budget 2024',
                    message: 'Budget disponible: 45,230€'
                  });
                }}
              >
                <div className="flex items-center space-x-2">
                  <Euro className="h-4 w-4 text-green-500" />
                  <span className="text-sm text-gray-600">Budget 2024</span>
                </div>
                <span className="font-medium text-gray-900">45,230€</span>
              </div>
              
              <div 
                className="flex items-center justify-between cursor-pointer hover:bg-gray-50 p-2 rounded transition-colors"
                onClick={() => {
                  addToast({
                    type: 'success',
                    title: 'Conformité excellente',
                    message: 'Votre taux de conformité est de 92%'
                  });
                }}
              >
                <div className="flex items-center space-x-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <span className="text-sm text-gray-600">Conformité</span>
                </div>
                <Badge variant="success" size="sm">92%</Badge>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;