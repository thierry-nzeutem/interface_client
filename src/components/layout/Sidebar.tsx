import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  FolderOpen, 
  Building2, 
  FileText, 
  Shield,
  LogOut,
  Settings
} from 'lucide-react';
import { useAuthStore } from '../../stores/authStore';
import { useLanguageStore } from '../../stores/languageStore';
import Button from '../ui/Button';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onToggle }) => {
  const { logout } = useAuthStore();
  const { t } = useLanguageStore();

  const navigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: t('nav.projects'), href: '/projects', icon: FolderOpen },
    { name: t('nav.companies'), href: '/companies', icon: Building2 },
    { name: 'Demande de devis', href: '/quote-request', icon: FileText },
    { name: t('nav.documents'), href: '/documents', icon: FileText },
    { name: t('nav.compliance'), href: '/compliance', icon: Shield },
    { name: t('nav.mairie'), href: '/mairie-dashboard', icon: Building2 },
    { name: 'Paramètres', href: '/settings', icon: Settings }
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={onToggle}
        />
      )}

      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200 z-30 lg:relative lg:translate-x-0"
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <div className="bg-red-500 text-white rounded-lg p-2">
                <Shield className="h-6 w-6" />
              </div>
              <span className="text-xl font-bold text-gray-900">Prévéris</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-red-50 text-red-700 border-l-4 border-red-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`
                }
              >
                <item.icon className="h-5 w-5" />
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>

          {/* User actions */}
          <div className="p-4 border-t border-gray-200">
            <Button
              variant="ghost"
              onClick={logout}
              className="w-full justify-start text-gray-700 hover:text-red-700"
            >
              <LogOut className="h-4 w-4 mr-2" />
              {t('logout')}
            </Button>
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;