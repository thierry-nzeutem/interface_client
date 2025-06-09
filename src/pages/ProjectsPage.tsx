import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Plus, Grid, List, Calendar, Kanban, Download, CheckSquare } from 'lucide-react';
import { useProjectStore } from '../stores/projectStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import ProjectCard from '../components/projects/ProjectCard';

const ProjectsPage: React.FC = () => {
  const { projects, filters, setFilters, setSelectedProject } = useProjectStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'kanban' | 'timeline'>('grid');
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set());

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = !filters.type || project.type === filters.type;
    const matchesStatus = !filters.status || project.status === filters.status;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const projectTypes = [
    { value: 'AT', label: 'Autorisation de Travaux' },
    { value: 'AUDIT', label: 'Audit sécurité/accessibilité' },
    { value: 'CSSI', label: 'Coordination SSI' },
    { value: 'RUS', label: 'Mission RUS' },
    { value: 'SUIVI', label: 'Suivi annuel ERP' },
    { value: 'AMO', label: 'AMO' }
  ];

  const statusOptions = [
    { value: 'EN_COURS', label: 'En cours' },
    { value: 'VALIDE', label: 'Validé' },
    { value: 'URGENT', label: 'Urgent' },
    { value: 'TERMINE', label: 'Terminé' }
  ];

  const establishments = ['Tous', 'Paris 15ème', 'Lyon Centre', 'Marseille Nord'];
  const budgetRanges = ['Tous', '< 5k€', '5k-15k€', '15k-50k€', '> 50k€'];

  // Kanban columns
  const kanbanColumns = [
    { id: 'draft', title: 'Brouillon', status: [] },
    { id: 'EN_COURS', title: 'En cours', status: ['EN_COURS'] },
    { id: 'validation', title: 'Validation', status: ['VALIDE'] },
    { id: 'TERMINE', title: 'Terminé', status: ['TERMINE'] }
  ];

  const handleSelectProject = (projectId: string) => {
    const newSelected = new Set(selectedProjects);
    if (newSelected.has(projectId)) {
      newSelected.delete(projectId);
    } else {
      newSelected.add(projectId);
    }
    setSelectedProjects(newSelected);
  };

  const handleSelectAll = () => {
    if (selectedProjects.size === filteredProjects.length) {
      setSelectedProjects(new Set());
    } else {
      setSelectedProjects(new Set(filteredProjects.map(p => p.id)));
    }
  };

  const handleBulkAction = (action: string) => {
    console.log(`Bulk action: ${action} on projects:`, Array.from(selectedProjects));
    setSelectedProjects(new Set());
  };

  const handleExport = () => {
    console.log('Exporting projects...', filteredProjects);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Mes projets</h1>
          <p className="text-gray-600 mt-1">
            Gérez et suivez tous vos projets Prévéris
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <Button variant="secondary" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouvelle demande
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 flex-1">
            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
              />
            </div>

            {/* Filters */}
            <select
              value={filters.type}
              onChange={(e) => setFilters({ type: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Tous les types</option>
              {projectTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>

            <select
              value={filters.status}
              onChange={(e) => setFilters({ status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            >
              <option value="">Tous les statuts</option>
              {statusOptions.map(status => (
                <option key={status.value} value={status.value}>
                  {status.label}
                </option>
              ))}
            </select>

            {/* Filtres avancés */}
            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
              <option value="">Établissement</option>
              {establishments.map(est => (
                <option key={est} value={est}>{est}</option>
              ))}
            </select>

            <select className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500">
              <option value="">Budget</option>
              {budgetRanges.map(range => (
                <option key={range} value={range}>{range}</option>
              ))}
            </select>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'kanban' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('kanban')}
            >
              <Kanban className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('timeline')}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Active Filters */}
        {(filters.type || filters.status || searchTerm) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {searchTerm && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Recherche: "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm('')}
                    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label="Retirer la recherche"
                  >
                    ×
                  </button>
              </span>
            )}
            {filters.type && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                Type: {projectTypes.find(t => t.value === filters.type)?.label}
                  <button
                    onClick={() => setFilters({ type: '' })}
                    className="ml-2 text-green-600 hover:text-green-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label="Retirer le type"
                  >
                    ×
                  </button>
              </span>
            )}
            {filters.status && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                Statut: {statusOptions.find(s => s.value === filters.status)?.label}
                  <button
                    onClick={() => setFilters({ status: '' })}
                    className="ml-2 text-orange-600 hover:text-orange-800 focus:outline-none focus:ring-2 focus:ring-red-500 rounded"
                    aria-label="Retirer le statut"
                  >
                    ×
                  </button>
              </span>
            )}
          </div>
        )}
      </Card>

      {/* Bulk Actions */}
      {selectedProjects.size > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CheckSquare className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-blue-900">
                  {selectedProjects.size} projet{selectedProjects.size > 1 ? 's' : ''} sélectionné{selectedProjects.size > 1 ? 's' : ''}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="secondary" size="sm" onClick={() => handleBulkAction('export')}>
                  Exporter
                </Button>
                <Button variant="secondary" size="sm" onClick={() => handleBulkAction('archive')}>
                  Archiver
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setSelectedProjects(new Set())}>
                  Annuler
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>
      )}

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          {filteredProjects.length} projet{filteredProjects.length !== 1 ? 's' : ''} trouvé{filteredProjects.length !== 1 ? 's' : ''}
        </p>
        {filteredProjects.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleSelectAll}>
            {selectedProjects.size === filteredProjects.length ? 'Désélectionner tout' : 'Sélectionner tout'}
          </Button>
        )}
      </div>

      {/* Projects Display */}
      <AnimatePresence mode="wait">
        {viewMode === 'kanban' ? (
          <motion.div
            key="kanban"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {kanbanColumns.map((column) => {
              const columnProjects = filteredProjects.filter(project => 
                column.status.length === 0 ? false : column.status.includes(project.status)
              );
              
              return (
                <Card key={column.id} className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">{column.title}</h3>
                    <Badge variant="info" size="sm">{columnProjects.length}</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    {columnProjects.map((project) => (
                      <motion.div
                        key={project.id}
                        layout
                        className="p-3 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedProject(project)}
                      >
                        <div className="flex items-center space-x-2 mb-2">
                          <input
                            type="checkbox"
                            checked={selectedProjects.has(project.id)}
                            onChange={() => handleSelectProject(project.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                          />
                          <Badge variant="info" size="sm">{project.type}</Badge>
                        </div>
                        <h4 className="font-medium text-gray-900 text-sm mb-1">{project.title}</h4>
                        <p className="text-xs text-gray-600">{project.company}</p>
                        <div className="mt-2">
                          <div className="w-full bg-gray-200 rounded-full h-1">
                            <div 
                              className="bg-red-500 h-1 rounded-full"
                              style={{ width: `${project.progress}%` }}
                            />
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </motion.div>
        ) : viewMode === 'timeline' ? (
          <motion.div
            key="timeline"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Vue chronologique</h3>
              <div className="space-y-6">
                {filteredProjects
                  .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
                  .map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="flex items-center space-x-4"
                    >
                      <div className="flex-shrink-0 w-24 text-sm text-gray-500">
                        {new Date(project.createdAt).toLocaleDateString('fr-FR')}
                      </div>
                      <div className="flex-shrink-0 w-2 h-2 bg-red-500 rounded-full"></div>
                      <div className="flex-1 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <input
                              type="checkbox"
                              checked={selectedProjects.has(project.id)}
                              onChange={() => handleSelectProject(project.id)}
                              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <Badge variant="info" size="sm">{project.type}</Badge>
                            <h4 className="font-medium text-gray-900">{project.title}</h4>
                          </div>
                          <div className="text-sm text-gray-600">{project.progress}%</div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
              </div>
            </Card>
          </motion.div>
        ) : viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedProjects.has(project.id)}
                    onChange={() => handleSelectProject(project.id)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                </div>
                <ProjectCard
                  project={project}
                  onView={(project) => setSelectedProject(project)}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="relative"
              >
                <div className="absolute top-4 left-4 z-10">
                  <input
                    type="checkbox"
                    checked={selectedProjects.has(project.id)}
                    onChange={() => handleSelectProject(project.id)}
                    className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                  />
                </div>
                <div className="pl-10">
                  <ProjectCard
                    project={project}
                    onView={(project) => setSelectedProject(project)}
                  />
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {filteredProjects.length === 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Filter className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Aucun projet trouvé
          </h3>
          <p className="text-gray-600 mb-6">
            Modifiez vos critères de recherche ou créez un nouveau projet
          </p>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Créer un projet
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default ProjectsPage;