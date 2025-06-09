import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Building, MapPin, Users, Plus, Edit, Trash2, List, Map, Upload, Download } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import SiretInput from '../components/ui/SiretInput';
import Tooltip from '../components/ui/Tooltip';

const CompaniesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { t } = useLanguageStore();
  const [selectedCompany, setSelectedCompany] = useState(user?.companies[0]?.id || '');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [siretValue, setSiretValue] = useState('');

  const mockEstablishments = [
    {
      id: '1',
      name: 'Restaurant Principal',
      address: '123 Rue de la Paix, 75015 Paris',
      category: 'L',
      type: '5ème catégorie',
      capacity: 45,
      status: 'Conforme',
      lat: 48.8566,
      lng: 2.3522,
      lastInspection: '2023-06-15',
      nextDeadline: '2024-06-15'
    },
    {
      id: '2',
      name: 'Terrasse Saisonnière',
      address: '123 Rue de la Paix, 75015 Paris',
      category: 'L',
      type: '5ème catégorie',
      capacity: 25,
      status: 'À vérifier',
      lat: 48.8576,
      lng: 2.3532,
      lastInspection: '2023-09-20',
      nextDeadline: '2024-03-20'
    },
    {
      id: '3',
      name: 'Salle de réception',
      address: '125 Rue de la Paix, 75015 Paris',
      category: 'L',
      type: '4ème catégorie',
      capacity: 120,
      status: 'Urgent',
      lat: 48.8556,
      lng: 2.3512,
      lastInspection: '2022-12-10',
      nextDeadline: '2024-01-30'
    }
  ];

  const selectedCompanyData = user?.companies.find(c => c.id === selectedCompany);

  const handleSiretValidation = (isValid: boolean, data?: any) => {
    if (isValid && data) {
      console.log('SIRET validated with data:', data);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Conforme':
        return <Badge variant="success\" size="sm">Conforme</Badge>;
      case 'À vérifier':
        return <Badge variant="warning" size="sm">À vérifier</Badge>;
      case 'Urgent':
        return <Badge variant="error" size="sm">Urgent</Badge>;
      default:
        return <Badge variant="info" size="sm">{status}</Badge>;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Conforme': return 'border-l-green-500';
      case 'À vérifier': return 'border-l-orange-500';
      case 'Urgent': return 'border-l-red-500';
      default: return 'border-l-gray-500';
    }
  };

  // Calcul des KPIs
  const complianceStats = {
    total: mockEstablishments.length,
    conforme: mockEstablishments.filter(e => e.status === 'Conforme').length,
    aVerifier: mockEstablishments.filter(e => e.status === 'À vérifier').length,
    urgent: mockEstablishments.filter(e => e.status === 'Urgent').length,
    globalScore: Math.round((mockEstablishments.filter(e => e.status === 'Conforme').length / mockEstablishments.length) * 100)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('companies.title')}</h1>
          <p className="text-gray-600 mt-1">{t('companies.subtitle')}</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button variant="secondary" onClick={() => setShowImportModal(true)}>
            <Upload className="h-4 w-4 mr-2" />
            Import CSV
          </Button>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="h-4 w-4 mr-2" />
            {t('companies.addCompany')}
          </Button>
        </div>
      </div>

      {/* Import Modal */}
      {showImportModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="p-6 max-w-md w-full mx-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Import en masse</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowImportModal(false)} aria-label="Fermer l'import">
                ×
              </Button>
            </div>
            
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">
                  Glissez votre fichier CSV ou cliquez pour sélectionner
                </p>
                <Button variant="secondary" size="sm">
                  Choisir un fichier
                </Button>
              </div>
              
              <div className="text-xs text-gray-500">
                <p className="font-medium mb-1">Format attendu :</p>
                <p>nom, adresse, siret, type_erp, capacite</p>
              </div>
              
              <div className="flex justify-between">
                <Button variant="ghost" onClick={() => setShowImportModal(false)}>
                  Annuler
                </Button>
                <Button variant="secondary">
                  <Download className="h-4 w-4 mr-2" />
                  Modèle CSV
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Company Creation Form */}
      {showCreateForm && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Créer une nouvelle société</h2>
              <Button variant="ghost" size="sm" onClick={() => setShowCreateForm(false)} aria-label="Fermer le formulaire">
                ×
              </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                SIRET
                <Tooltip content={{
                  definition: "Numéro d'identification unique de l'établissement composé de 14 chiffres",
                  example: "12345678901234 (9 chiffres SIREN + 5 chiffres établissement)",
                  learnMore: "En savoir plus sur le SIRET"
                }} />
              </label>
              <SiretInput
                value={siretValue}
                onChange={setSiretValue}
                onValidation={handleSiretValidation}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Raison sociale
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                placeholder="Nom de la société"
              />
            </div>
          </div>
          
          <div className="mt-6 flex justify-end space-x-3">
            <Button variant="ghost" onClick={() => setShowCreateForm(false)}>
              Annuler
            </Button>
            <Button>
              Créer la société
            </Button>
          </div>
        </Card>
      )}

      {/* Company Selector */}
      {user?.companies && user.companies.length > 1 && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('companies.selectCompany')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.companies.map((company) => (
              <motion.button
                key={company.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setSelectedCompany(company.id)}
                className={`p-4 rounded-lg border-2 text-left transition-all ${
                  selectedCompany === company.id
                    ? 'border-red-500 bg-red-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 text-blue-600 rounded-lg p-2">
                    <Building className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{company.name}</h3>
                    <p className="text-sm text-gray-600">SIRET: {company.siret}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </div>
        </Card>
      )}

      {/* Tableau de bord société */}
      {selectedCompanyData && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Company Info */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Informations société</h2>
              <Button variant="ghost" size="sm" aria-label="Modifier la société">
                <Edit className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nom</label>
                <p className="text-gray-900">{selectedCompanyData.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">SIRET</label>
                <p className="text-gray-900 font-mono">{selectedCompanyData.siret}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Secteur d'activité</label>
                <p className="text-gray-900">Restauration traditionnelle</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Statut</label>
                <Badge variant="success">Actif</Badge>
              </div>
            </div>
          </Card>

          {/* KPIs Conformité */}
          <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-1">
                {complianceStats.total}
              </div>
              <div className="text-sm text-gray-600">Établissements</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-green-600 mb-1">
                {complianceStats.conforme}
              </div>
              <div className="text-sm text-gray-600">Conformes</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-orange-600 mb-1">
                {complianceStats.aVerifier}
              </div>
              <div className="text-sm text-gray-600">À vérifier</div>
            </Card>
            <Card className="p-6 text-center">
              <div className="text-3xl font-bold text-red-600 mb-1">
                {complianceStats.urgent}
              </div>
              <div className="text-sm text-gray-600">Urgents</div>
            </Card>
          </div>
        </div>
      )}

      {/* Establishments */}
      {selectedCompanyData && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('companies.establishments')} ({mockEstablishments.length})
            </h2>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'map' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('map')}
                >
                  <Map className="h-4 w-4" />
                </Button>
              </div>
              <Button variant="secondary" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                {t('companies.addEstablishment')}
              </Button>
            </div>
          </div>

          {viewMode === 'list' ? (
            <div className="space-y-4">
              {mockEstablishments.map((establishment, index) => (
                <motion.div
                  key={establishment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 hover:bg-gray-50 transition-colors border-l-4 ${getStatusColor(establishment.status)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="font-medium text-gray-900">{establishment.name}</h3>
                        {getStatusBadge(establishment.status)}
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {establishment.address}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users className="h-4 w-4 mr-2" />
                          {establishment.capacity} personnes
                        </div>
                        <div className="text-gray-600">
                          <span className="font-medium">Type:</span> {establishment.type}
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Dernière inspection:</span> {new Date(establishment.lastInspection).toLocaleDateString('fr-FR')}
                        </div>
                        <div>
                          <span className="font-medium">Prochaine échéance:</span> {new Date(establishment.nextDeadline).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Button variant="ghost" size="sm" aria-label="Modifier l'établissement">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" aria-label="Supprimer l'établissement">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Map className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Vue carte interactive</h3>
                <p className="text-gray-600 mb-4">
                  Visualisez vos établissements sur une carte avec leur statut de conformité
                </p>
                <div className="flex justify-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    Conforme ({complianceStats.conforme})
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div>
                    À vérifier ({complianceStats.aVerifier})
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                    Urgent ({complianceStats.urgent})
                  </div>
                </div>
                
                {/* Simulation d'une carte avec markers */}
                <div className="mt-6 relative bg-blue-50 rounded-lg p-8">
                  <div className="absolute top-4 left-4 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <div className="absolute top-8 right-6 w-3 h-3 bg-orange-500 rounded-full animate-pulse"></div>
                  <div className="absolute bottom-6 left-1/2 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                  <p className="text-sm text-blue-600">Carte interactive avec géolocalisation des établissements</p>
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {/* Alertes automatiques */}
      {complianceStats.urgent > 0 && (
        <Card className="p-4 bg-red-50 border-red-200">
          <div className="flex items-center space-x-3">
            <div className="bg-red-500 text-white rounded-full p-2">
              <Users className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-red-900">
                {complianceStats.urgent} établissement{complianceStats.urgent > 1 ? 's' : ''} nécessite{complianceStats.urgent === 1 ? '' : 'nt'} une action urgente
              </h4>
              <p className="text-sm text-red-700">
                Des échéances sont dépassées ou approchent rapidement
              </p>
            </div>
            <Button variant="secondary" size="sm">
              Voir les actions
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default CompaniesPage;