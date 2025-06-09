import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Search, 
  Filter, 
  FileText, 
  Download, 
  Eye,
  Trash2,
  FolderOpen,
  Calendar,
  Tag,
  Share,
  Edit,
  Clock,
  CheckCircle,
  X
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const DocumentsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [previewDocument, setPreviewDocument] = useState<any>(null);

  const mockDocuments = [
    {
      id: '1',
      name: 'Plan de masse - Restaurant Le Gourmet.pdf',
      category: 'Plans',
      project: 'AT-2024-001',
      size: '2.3 MB',
      uploadDate: '2024-01-15',
      status: 'Signé',
      version: '1.2',
      tags: ['ERP', 'Plans', 'Sécurité'],
      author: 'Jean Dupuis',
      lastModified: '2024-01-16',
      url: '/documents/plan-masse.pdf'
    },
    {
      id: '2',
      name: 'Notice de sécurité.pdf',
      category: 'Documents réglementaires',
      project: 'AT-2024-001',
      size: '1.8 MB',
      uploadDate: '2024-01-14',
      status: 'En attente',
      version: '2.0',
      tags: ['Sécurité', 'Réglementaire'],
      author: 'Marie Leroy',
      lastModified: '2024-01-14',
      url: '/documents/notice-securite.pdf'
    },
    {
      id: '3',
      name: 'Rapport audit accessibilité.pdf',
      category: 'Rapports',
      project: 'AUDIT-2024-005',
      size: '4.1 MB',
      uploadDate: '2024-01-10',
      status: 'Validé',
      version: '1.0',
      tags: ['Accessibilité', 'Audit', 'Conformité'],
      author: 'Pierre Martin',
      lastModified: '2024-01-10',
      url: '/documents/audit-accessibilite.pdf'
    },
    {
      id: '4',
      name: 'Attestation vérification SSI.pdf',
      category: 'Certificats',
      project: 'CSSI-2024-003',
      size: '876 KB',
      uploadDate: '2024-01-08',
      status: 'Signé',
      version: '1.0',
      tags: ['SSI', 'Certificat', 'Vérification'],
      author: 'Système',
      lastModified: '2024-01-08',
      url: '/documents/attestation-ssi.pdf'
    },
    {
      id: '5',
      name: 'Photos avant travaux.zip',
      category: 'Photos',
      project: 'AT-2024-001',
      size: '15.2 MB',
      uploadDate: '2024-01-12',
      status: 'Archivé',
      version: '1.0',
      tags: ['Photos', 'Avant travaux'],
      author: 'Client',
      lastModified: '2024-01-12',
      url: '/documents/photos-avant.zip'
    }
  ];

  const categories = [
    'Plans',
    'Documents réglementaires',
    'Rapports',
    'Certificats',
    'Photos',
    'Correspondances'
  ];

  const allTags = [...new Set(mockDocuments.flatMap(doc => doc.tags))];

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.project.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = !selectedCategory || doc.category === selectedCategory;
    const matchesTags = selectedTags.length === 0 || selectedTags.some(tag => doc.tags.includes(tag));
    
    return matchesSearch && matchesCategory && matchesTags;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Signé':
        return <Badge variant="success\" size="sm">Signé</Badge>;
      case 'Validé':
        return <Badge variant="success" size="sm">Validé</Badge>;
      case 'En attente':
        return <Badge variant="warning" size="sm">En attente</Badge>;
      case 'Archivé':
        return <Badge variant="info" size="sm">Archivé</Badge>;
      default:
        return <Badge variant="info" size="sm">{status}</Badge>;
    }
  };

  const getFileIcon = (filename: string) => {
    if (filename.endsWith('.pdf')) return <FileText className="h-5 w-5 text-red-500" />;
    if (filename.endsWith('.zip')) return <FolderOpen className="h-5 w-5 text-orange-500" />;
    return <FileText className="h-5 w-5 text-gray-500" />;
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handlePreview = (document: any) => {
    setPreviewDocument(document);
  };

  const handleShare = (document: any) => {
    console.log('Sharing document:', document.name);
    // Simulate sharing functionality
  };

  const handleVersioning = (document: any) => {
    console.log('Managing versions for:', document.name);
    // Simulate versioning functionality
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes documents</h1>
          <p className="text-gray-600 mt-1">
            Gérez et organisez tous vos documents Prévéris
          </p>
        </div>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Télécharger un document
        </Button>
      </div>

      {/* Upload Zone */}
      <Card className="p-8">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-red-400 transition-colors cursor-pointer">
          <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Glissez-déposez vos documents ici
          </h3>
          <p className="text-gray-600 mb-4">
            ou cliquez pour sélectionner des fichiers
          </p>
          <div className="flex justify-center space-x-4">
            <Button variant="secondary">
              Choisir des fichiers
            </Button>
            <Button variant="ghost">
              Scanner un document
            </Button>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Formats supportés : PDF, DOC, DOCX, JPG, PNG, ZIP (max 50MB)
          </p>
        </div>
      </Card>

      {/* Filters */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un document, projet, tag..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
          >
            <option value="">Toutes les catégories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>

          {/* View Toggle */}
          <div className="flex items-center space-x-1 bg-gray-100 rounded-lg p-1">
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              Liste
            </Button>
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              Grille
            </Button>
          </div>
        </div>

        {/* Tags Filter */}
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Filtrer par tags :</h4>
          <div className="flex flex-wrap gap-2">
            {allTags.map(tag => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-red-100 text-red-700 border border-red-300'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <Tag className="h-3 w-3 inline mr-1" />
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(selectedCategory || selectedTags.length > 0 || searchTerm) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Recherche: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label="Retirer la recherche"
                  >
                    ×
                  </button>
              </span>
            )}
            {selectedCategory && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Catégorie: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory('')}
                    className="ml-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label="Retirer la catégorie"
                  >
                    ×
                  </button>
              </span>
            )}
            {selectedTags.map(tag => (
              <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                Tag: {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="ml-2 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label="Retirer le tag"
                  >
                    ×
                  </button>
              </span>
            ))}
          </div>
        )}
      </Card>

      {/* Document Library */}
      <Card className="overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              Bibliothèque ({filteredDocuments.length} documents)
            </h2>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="sm">
                <FolderOpen className="h-4 w-4 mr-2" />
                Organiser
              </Button>
              <Button variant="ghost" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Filtres avancés
              </Button>
            </div>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="divide-y divide-gray-200">
            {filteredDocuments.map((document, index) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div className="bg-red-100 text-red-600 rounded-lg p-2">
                      {getFileIcon(document.name)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 truncate">
                        {document.name}
                      </h3>
                      <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                        <span>{document.category}</span>
                        <span>•</span>
                        <span>Projet: {document.project}</span>
                        <span>•</span>
                        <span>{document.size}</span>
                        <span>•</span>
                        <span>v{document.version}</span>
                        <span>•</span>
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(document.uploadDate).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                      
                      {/* Tags */}
                      <div className="flex items-center space-x-2 mt-2">
                        {document.tags.map(tag => (
                          <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {getStatusBadge(document.status)}
                    
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" onClick={() => handlePreview(document)} aria-label="Prévisualiser">
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" aria-label="Télécharger">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleShare(document)} aria-label="Partager">
                        <Share className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={() => handleVersioning(document)} aria-label="Historique des versions">
                        <Clock className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700" aria-label="Supprimer">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredDocuments.map((document, index) => (
              <motion.div
                key={document.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card hover className="p-4 cursor-pointer" onClick={() => handlePreview(document)}>
                  <div className="flex items-center justify-between mb-3">
                    <div className="bg-red-100 text-red-600 rounded-lg p-2">
                      {getFileIcon(document.name)}
                    </div>
                    {getStatusBadge(document.status)}
                  </div>
                  
                  <h3 className="font-medium text-gray-900 text-sm mb-2 truncate">
                    {document.name}
                  </h3>
                  
                  <div className="text-xs text-gray-500 space-y-1">
                    <p>{document.category}</p>
                    <p>{document.size} • v{document.version}</p>
                    <p>{new Date(document.uploadDate).toLocaleDateString('fr-FR')}</p>
                  </div>
                  
                  <div className="flex flex-wrap gap-1 mt-3">
                    {document.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                    {document.tags.length > 2 && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        +{document.tags.length - 2}
                      </span>
                    )}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </Card>

      {/* Preview Modal */}
      {previewDocument && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">{previewDocument.name}</h2>
                <p className="text-sm text-gray-600">
                  {previewDocument.category} • {previewDocument.size} • v{previewDocument.version}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm">
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setPreviewDocument(null)} aria-label="Fermer la prévisualisation">
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="p-6 h-96 bg-gray-100 flex items-center justify-center">
              <div className="text-center">
                <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Prévisualisation du document</h3>
                <p className="text-gray-600">
                  La prévisualisation sera intégrée ici (PDF.js, images, etc.)
                </p>
              </div>
            </div>
            
            <div className="p-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Auteur:</span>
                  <p className="text-gray-900">{previewDocument.author}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Dernière modification:</span>
                  <p className="text-gray-900">{new Date(previewDocument.lastModified).toLocaleDateString('fr-FR')}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Statut:</span>
                  <div className="mt-1">{getStatusBadge(previewDocument.status)}</div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-blue-600 mb-1">
            {mockDocuments.length}
          </div>
          <div className="text-sm text-gray-600">Documents total</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-green-600 mb-1">
            {mockDocuments.filter(d => d.status === 'Signé' || d.status === 'Validé').length}
          </div>
          <div className="text-sm text-gray-600">Validés</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-orange-600 mb-1">
            {mockDocuments.filter(d => d.status === 'En attente').length}
          </div>
          <div className="text-sm text-gray-600">En attente</div>
        </Card>
        <Card className="p-6 text-center">
          <div className="text-2xl font-bold text-gray-600 mb-1">
            {(mockDocuments.reduce((acc, doc) => acc + parseFloat(doc.size.replace(' MB', '').replace(' KB', '')), 0) / 1000).toFixed(1)}
          </div>
          <div className="text-sm text-gray-600">GB utilisés</div>
        </Card>
      </div>
    </div>
  );
};

export default DocumentsPage;