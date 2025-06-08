import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Download, 
  FileText, 
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
  Clock,
  Euro
} from 'lucide-react';
import { useLanguageStore } from '../stores/languageStore';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';

const MairieDashboardPage: React.FC = () => {
  const { t } = useLanguageStore();
  const [selectedStatus, setSelectedStatus] = useState('');

  const mockPurchaseOrder = {
    number: 'BC-2024-001',
    totalAmount: 15000,
    usedAmount: 10050,
    percentage: 67
  };

  const mockFiles = [
    {
      id: '1',
      number: 'ERP-2024-001',
      address: '15 Rue de la République, 75001 Paris',
      status: 'complete',
      depositDate: '2024-01-15',
      deadline: '2024-02-15',
      type: 'Restaurant'
    },
    {
      id: '2',
      number: 'ERP-2024-002',
      address: '42 Avenue des Champs, 75008 Paris',
      status: 'incomplete',
      depositDate: '2024-01-18',
      deadline: '2024-02-18',
      type: 'Hôtel'
    },
    {
      id: '3',
      number: 'ERP-2024-003',
      address: '8 Place du Marché, 75004 Paris',
      status: 'inInstruction',
      depositDate: '2024-01-20',
      deadline: '2024-02-20',
      type: 'Commerce'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'complete':
        return <Badge variant="success" size="sm">{t('status.complete')}</Badge>;
      case 'incomplete':
        return <Badge variant="warning" size="sm">{t('status.incomplete')}</Badge>;
      case 'inInstruction':
        return <Badge variant="info" size="sm">{t('status.inInstruction')}</Badge>;
      default:
        return <Badge variant="info" size="sm">{status}</Badge>;
    }
  };

  const filteredFiles = selectedStatus 
    ? mockFiles.filter(file => file.status === selectedStatus)
    : mockFiles;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('mairie.title')}</h1>
        <p className="text-gray-600 mt-1">{t('mairie.subtitle')}</p>
      </div>

      {/* Purchase Order Management */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">{t('mairie.activePO')}</h2>
            <Button variant="secondary" size="sm">
              {t('mairie.newPO')}
            </Button>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Bon de commande: {mockPurchaseOrder.number}</span>
              <span className="text-sm font-medium text-gray-900">
                {mockPurchaseOrder.usedAmount.toLocaleString()}€ / {mockPurchaseOrder.totalAmount.toLocaleString()}€
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className={`h-3 rounded-full transition-all duration-300 ${
                  mockPurchaseOrder.percentage > 80 ? 'bg-orange-500' : 'bg-red-500'
                }`}
                style={{ width: `${mockPurchaseOrder.percentage}%` }}
              />
            </div>
            
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{t('mairie.budgetUsed')}</span>
              <span className={`font-medium ${
                mockPurchaseOrder.percentage > 80 ? 'text-orange-600' : 'text-red-600'
              }`}>
                {mockPurchaseOrder.percentage}%
              </span>
            </div>
            
            {mockPurchaseOrder.percentage > 80 && (
              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-orange-800">
                  Attention: Plus de 80% du budget consommé
                </span>
              </div>
            )}
          </div>
        </Card>

        {/* Statistics */}
        <div className="space-y-4">
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-blue-600 mb-1">23</div>
            <div className="text-sm text-gray-600">{t('mairie.filesProcessed')}</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-green-600 mb-1">12</div>
            <div className="text-sm text-gray-600">{t('mairie.avgDelay')} {t('mairie.days')}</div>
          </Card>
          <Card className="p-6 text-center">
            <div className="text-2xl font-bold text-orange-600 mb-1">4,950€</div>
            <div className="text-sm text-gray-600">{t('mairie.remainingBudget')}</div>
          </Card>
        </div>
      </div>

      {/* File Deposit */}
      <Card className="p-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{t('mairie.depositFiles')}</h2>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t('mairie.dragDrop')}
          </h3>
          <p className="text-gray-600 mb-4">
            Formats acceptés: PDF, DWG, DOC (max 50MB par fichier)
          </p>
          <Button variant="secondary">
            {t('mairie.chooseFiles')}
          </Button>
        </div>
      </Card>

      {/* Instruction Tracking */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {t('mairie.instructionTracking')} ({filteredFiles.length})
            </h2>
            <div className="flex items-center space-x-4">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              >
                <option value="">Tous les statuts</option>
                <option value="complete">Complet</option>
                <option value="incomplete">Incomplet</option>
                <option value="inInstruction">En instruction</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('mairie.fileNumber')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('mairie.projectAddress')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('mairie.status')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('mairie.depositDate')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('mairie.deadline')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {t('mairie.actions')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredFiles.map((file, index) => (
                <motion.tr
                  key={file.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{file.number}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">{file.address}</div>
                    <div className="text-sm text-gray-500">{file.type}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(file.status)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(file.depositDate).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(file.deadline).toLocaleDateString('fr-FR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                    <Button variant="ghost" size="sm" className="text-green-600 hover:text-green-700">
                      <Download className="h-4 w-4 mr-1" />
                      {t('mairie.downloadAdvice')}
                    </Button>
                    <Button variant="ghost" size="sm" className="text-orange-600 hover:text-orange-700">
                      {t('mairie.requestReview')}
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default MairieDashboardPage;