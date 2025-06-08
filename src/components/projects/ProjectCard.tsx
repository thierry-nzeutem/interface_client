import React from 'react';
import { Calendar, Clock, CheckCircle, AlertTriangle, Building } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import Card from '../ui/Card';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import { Project } from '../../stores/projectStore';

interface ProjectCardProps {
  project: Project;
  onView: (project: Project) => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onView }) => {
  const getStatusConfig = (status: Project['status']) => {
    switch (status) {
      case 'EN_COURS':
        return { variant: 'warning' as const, icon: Clock, text: 'En cours' };
      case 'VALIDE':
        return { variant: 'success' as const, icon: CheckCircle, text: 'Validé' };
      case 'URGENT':
        return { variant: 'error' as const, icon: AlertTriangle, text: 'Urgent' };
      case 'TERMINE':
        return { variant: 'success' as const, icon: CheckCircle, text: 'Terminé' };
    }
  };

  const statusConfig = getStatusConfig(project.status);
  const StatusIcon = statusConfig.icon;

  const getBorderColor = () => {
    switch (project.status) {
      case 'EN_COURS': return 'border-l-orange-500';
      case 'VALIDE': return 'border-l-green-500';
      case 'URGENT': return 'border-l-red-500';
      case 'TERMINE': return 'border-l-green-500';
    }
  };

  return (
    <Card hover className={`border-l-4 ${getBorderColor()}`}>
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <Badge variant="info" size="sm">{project.type}</Badge>
              <span className="text-sm text-gray-500">#{project.id}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {project.title}
            </h3>
            <div className="flex items-center text-sm text-gray-600">
              <Building className="h-4 w-4 mr-1" />
              {project.company} - {project.establishment}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <StatusIcon className="h-4 w-4" />
              <Badge variant={statusConfig.variant} size="sm">
                {statusConfig.text}
              </Badge>
            </div>
            <span className="text-sm text-gray-500">{project.progress}%</span>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-red-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${project.progress}%` }}
            />
          </div>

          <div className="text-sm text-gray-600">
            <p>Dernière activité: {project.lastActivity}</p>
            {project.nextDeadline && (
              <div className="flex items-center mt-1">
                <Calendar className="h-4 w-4 mr-1" />
                Échéance: {format(new Date(project.nextDeadline), 'dd MMMM yyyy', { locale: fr })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onView(project)}
            className="w-full"
          >
            Voir le projet
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;