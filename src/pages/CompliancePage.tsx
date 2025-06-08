import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  Users,
  Building
} from 'lucide-react';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const CompliancePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'maintenance' | 'commissions' | 'register'>('maintenance');

  const maintenanceItems = [
    {
      id: '1',
      equipment: 'Système de désenfumage',
      nextDate: '2024-02-15',
      status: 'À programmer',
      provider: 'TechSécurité SARL',
      frequency: 'Annuel'
    },
    {
      id: '2',
      equipment: 'Éclairage de sécurité',
      nextDate: '2024-01-30',
      status: 'Urgent',
      provider: 'ElecPro',
      frequency: 'Semestriel'
    },
    {
      id: '3',
      equipment: 'Extincteurs',
      nextDate: '2024-03-10',
      status: 'Planifié',
      provider: 'SafeGuard Services',
      frequency: 'Annuel'
    }
  ];

  const commissions = [
    {
      id: '1',
      type: 'Commission de sécurité',
      date: '2023-06-15',
      status: 'Avis favorable',
      nextVisit: '2026-06-15',
      prescriptions: 2
    },
    {
      id: '2',
      type: 'Commission accessibilité',
      date: '2023-09-20',
      status: 'Avis favorable avec prescriptions',
      nextVisit: '2024-09-20',
      prescriptions: 1
    }
  ];

  const getMaintenanceStatusBadge = (status: string) => {
    switch (status) {
      case 'Urgent':
        return <Badge variant="error\" size="sm">Urgent</Badge>;
      case 'À programmer':
        return <Badge variant="warning" size="sm">À programmer</Badge>;
      case 'Planifié':
        return <Badge variant="success" size="sm">Planifié</Badge>;
      default:
        return <Badge variant="info" size="sm">{status}</Badge>;
    }
  };

  const tabs = [
    { id: 'maintenance', label: 'Maintenances', icon: Clock },
    { id: 'commissions', label: 'Commissions', icon: Users },
    { id: 'register', label: 'Registre', icon: FileText }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Conformité réglementaire</h1>
        <p className="text-gray-600 mt-1">
          Suivez vos obligations et maintenez la conformité de vos établissements
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="bg-green-100 text-green-600 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">85%</div>
          <div className="text-sm text-gray-600">Conformité globale</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="bg-orange-100 text-orange-600 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <Clock className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">3</div>
          <div className="text-sm text-gray-600">Maintenances à venir</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="bg-red-100 text-red-600 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">1</div>
          <div className="text-sm text-gray-600">Action urgente</div>
        </Card>
        
        <Card className="p-6 text-center">
          <div className="bg-blue-100 text-blue-600 rounded-full p-3 w-12 h-12 flex items-center justify-center mx-auto mb-3">
            <Calendar className="h-6 w-6" />
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">1</div>
          <div className="text-sm text-gray-600">Commission 2024</div>
        </Card>
      </div>

      {/* Tabs */}
      <Card className="overflow-hidden">
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

        <div className="p-6">
          {activeTab === 'maintenance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Échéancier des maintenances
                </h2>
                <Button variant="secondary" size="sm">
                  Planifier maintenance
                </Button>
              </div>

              {maintenanceItems.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{item.equipment}</h3>
                        {getMaintenanceStatusBadge(item.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Prochaine intervention:</span>
                          <br />
                          {new Date(item.nextDate).toLocaleDateString('fr-FR')}
                        </div>
                        <div>
                          <span className="font-medium">Prestataire:</span>
                          <br />
                          {item.provider}
                        </div>
                        <div>
                          <span className="font-medium">Fréquence:</span>
                          <br />
                          {item.frequency}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="ghost" size="sm">
                        Modifier
                      </Button>
                      <Button variant="primary" size="sm">
                        Planifier
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'commissions' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">
                  Historique des commissions
                </h2>
                <Button variant="secondary" size="sm">
                  Préparer commission
                </Button>
              </div>

              {commissions.map((commission, index) => (
                <motion.div
                  key={commission.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{commission.type}</h3>
                        <Badge 
                          variant={commission.status.includes('favorable') ? 'success' : 'warning'} 
                          size="sm"
                        >
                          {commission.status}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Date de passage:</span>
                          <br />
                          {new Date(commission.date).toLocaleDateString('fr-FR')}
                        </div>
                        <div>
                          <span className="font-medium">Prochaine visite:</span>
                          <br />
                          {new Date(commission.nextVisit).toLocaleDateString('fr-FR')}
                        </div>
                        <div>
                          <span className="font-medium">Prescriptions:</span>
                          <br />
                          {commission.prescriptions} en cours
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="ghost" size="sm">
                        Voir PV
                      </Button>
                      <Button variant="secondary" size="sm">
                        Prescriptions
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'register' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <div className="bg-green-100 text-green-600 rounded-full p-4 w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Shield className="h-8 w-8" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Registre de sécurité numérique
              </h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Votre registre de sécurité est à jour et conforme à la réglementation.
                Dernière mise à jour le 15 janvier 2024.
              </p>
              <div className="flex justify-center space-x-4">
                <Button variant="primary">
                  Consulter le registre
                </Button>
                <Button variant="secondary">
                  Ajouter une entrée
                </Button>
              </div>
            </motion.div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default CompliancePage;