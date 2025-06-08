import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Bell, 
  Shield, 
  Palette, 
  Globe, 
  Smartphone,
  Mail,
  MessageSquare,
  Eye,
  EyeOff,
  Save,
  Download,
  Trash2,
  Key,
  Clock,
  Building
} from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import { useLanguageStore } from '../stores/languageStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';

const SettingsPage: React.FC = () => {
  const { user } = useAuthStore();
  const { language, setLanguage, t } = useLanguageStore();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'preferences' | 'companies'>('profile');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    email: user?.email || '',
    phone: '+33 6 12 34 56 78',
    position: 'Gérant',
    company: 'Restaurant Le Gourmet'
  });

  const [notifications, setNotifications] = useState({
    email: {
      projectUpdates: true,
      deadlines: true,
      documents: true,
      marketing: false
    },
    sms: {
      urgent: true,
      deadlines: false,
      documents: false
    },
    whatsapp: {
      projectUpdates: false,
      urgent: true,
      deadlines: false
    },
    push: {
      all: true,
      sound: true,
      vibration: true
    }
  });

  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: language,
    timezone: 'Europe/Paris',
    dateFormat: 'DD/MM/YYYY',
    currency: 'EUR',
    helpLevel: 'intermediate',
    autoSave: true,
    compactMode: false
  });

  const tabs = [
    { id: 'profile', label: t('settings.profile'), icon: User },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
    { id: 'security', label: t('settings.security'), icon: Shield },
    { id: 'preferences', label: t('settings.preferences'), icon: Palette },
    { id: 'companies', label: t('settings.companies'), icon: Building }
  ];

  const handleSave = () => {
    // Simulate save
    console.log('Saving settings...', { formData, notifications, preferences });
  };

  const handleExportData = () => {
    // Simulate data export
    console.log('Exporting user data...');
  };

  const handleDeleteAccount = () => {
    // Simulate account deletion
    if (window.confirm(t('settings.security.deleteWarning'))) {
      console.log('Deleting account...');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{t('settings.title')}</h1>
        <p className="text-gray-600 mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="p-6 h-fit">
          <nav className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors text-left ${
                    activeTab === tab.id
                      ? 'bg-red-50 text-red-700 border-l-4 border-red-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <Card className="p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{t('settings.profile.title')}</h2>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    {t('settings.save')}
                  </Button>
                </div>

                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="bg-red-500 text-white rounded-full h-20 w-20 flex items-center justify-center text-2xl font-bold">
                    {formData.firstName.charAt(0)}{formData.lastName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{t('settings.profile.avatar')}</h3>
                    <p className="text-sm text-gray-600">{t('settings.profile.avatarFormats')}</p>
                    <div className="mt-2 space-x-3">
                      <Button variant="secondary" size="sm">{t('settings.profile.change')}</Button>
                      <Button variant="ghost" size="sm">{t('settings.profile.remove')}</Button>
                    </div>
                  </div>
                </div>

                {/* Personal Information Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.profile.firstName')} *
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.profile.lastName')} *
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.profile.email')} *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.profile.phone')}
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.profile.position')}
                    </label>
                    <input
                      type="text"
                      value={formData.position}
                      onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.profile.mainCompany')}
                    </label>
                    <select
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option>Restaurant Le Gourmet</option>
                      <option>Hôtel des Voyageurs</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Notifications Tab */}
            {activeTab === 'notifications' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{t('settings.notifications.title')}</h2>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    {t('settings.save')}
                  </Button>
                </div>

                {/* Email Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-medium text-gray-900">{t('settings.notifications.email')}</h3>
                  </div>
                  
                  <div className="space-y-3 pl-8">
                    {Object.entries(notifications.email).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            email: { ...notifications.email, [key]: e.target.checked }
                          })}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {t(`settings.notifications.${key}`)}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* SMS Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-medium text-gray-900">{t('settings.notifications.sms')}</h3>
                  </div>
                  
                  <div className="space-y-3 pl-8">
                    {Object.entries(notifications.sms).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            sms: { ...notifications.sms, [key]: e.target.checked }
                          })}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {key === 'urgent' && t('settings.notifications.urgent')}
                          {key === 'deadlines' && t('settings.notifications.deadlines')}
                          {key === 'documents' && t('settings.notifications.documents')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* WhatsApp Notifications */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <MessageSquare className="h-5 w-5 text-red-500" />
                    <h3 className="text-lg font-medium text-gray-900">{t('settings.notifications.whatsapp')}</h3>
                  </div>
                  
                  <div className="space-y-3 pl-8">
                    {Object.entries(notifications.whatsapp).map(([key, value]) => (
                      <label key={key} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={value}
                          onChange={(e) => setNotifications({
                            ...notifications,
                            whatsapp: { ...notifications.whatsapp, [key]: e.target.checked }
                          })}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <span className="text-sm text-gray-700">
                          {key === 'projectUpdates' && t('settings.notifications.projectUpdates')}
                          {key === 'urgent' && t('settings.notifications.urgentOnly')}
                          {key === 'deadlines' && t('settings.notifications.deadlines')}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">{t('settings.security.title')}</h2>

                {/* Authentication Method */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('settings.security.authMethod')}</h3>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex items-center space-x-3">
                      <Shield className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="text-sm font-medium text-green-900">{t('settings.security.secureLogin')}</p>
                        <p className="text-sm text-green-700">{t('settings.security.passwordless')}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Mail className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email</p>
                          <p className="text-sm text-gray-600">{user?.email}</p>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">{t('settings.security.active')}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Smartphone className="h-5 w-5 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">SMS</p>
                          <p className="text-sm text-gray-600">+33 6 ** ** ** 78</p>
                        </div>
                      </div>
                      <Badge variant="success" size="sm">{t('settings.security.active')}</Badge>
                    </div>
                  </div>
                </div>

                {/* Active Sessions */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('settings.security.activeSessions')}</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{t('settings.security.currentSession')}</p>
                        <p className="text-sm text-gray-600">Chrome on Windows • Paris, France</p>
                        <p className="text-sm text-gray-500">{t('settings.security.lastActivity')} : {t('settings.security.now')}</p>
                      </div>
                      <Badge variant="success" size="sm">{t('settings.security.current')}</Badge>
                    </div>
                    
                    <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div>
                        <p className="text-sm font-medium text-gray-900">Mobile Safari</p>
                        <p className="text-sm text-gray-600">iPhone • Paris, France</p>
                        <p className="text-sm text-gray-500">{t('settings.security.lastActivity')} : {t('settings.security.hoursAgo')}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-700">
                        {t('settings.security.disconnect')}
                      </Button>
                    </div>
                  </div>
                  
                  <Button variant="destructive" size="sm">
                    {t('settings.security.disconnectAll')}
                  </Button>
                </div>

                {/* Data Management */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('settings.security.dataManagement')}</h3>
                  <div className="space-y-3">
                    <Button variant="secondary" onClick={handleExportData}>
                      <Download className="h-4 w-4 mr-2" />
                      {t('settings.security.exportData')}
                    </Button>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-900 mb-2">{t('settings.security.dangerZone')}</h4>
                      <Button variant="destructive" onClick={handleDeleteAccount}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        {t('settings.security.deleteAccount')}
                      </Button>
                      <p className="text-sm text-gray-600 mt-2">
                        {t('settings.security.deleteWarning')}
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Preferences Tab */}
            {activeTab === 'preferences' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">{t('settings.preferences.title')}</h2>
                  <Button onClick={handleSave}>
                    <Save className="h-4 w-4 mr-2" />
                    {t('settings.save')}
                  </Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.preferences.language')}
                    </label>
                    <select
                      value={preferences.language}
                      onChange={(e) => {
                        setPreferences({ ...preferences, language: e.target.value as 'fr' | 'en' });
                        setLanguage(e.target.value as 'fr' | 'en');
                      }}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="fr">🇫🇷 Français</option>
                      <option value="en">🇬🇧 English</option>
                    </select>
                  </div>

                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.preferences.theme')}
                    </label>
                    <select
                      value={preferences.theme}
                      onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="light">{t('settings.preferences.light')}</option>
                      <option value="dark">{t('settings.preferences.dark')}</option>
                      <option value="auto">{t('settings.preferences.auto')}</option>
                    </select>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.preferences.timezone')}
                    </label>
                    <select
                      value={preferences.timezone}
                      onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="Europe/Paris">Europe/Paris (UTC+1)</option>
                      <option value="Europe/London">Europe/London (UTC+0)</option>
                      <option value="America/New_York">America/New_York (UTC-5)</option>
                    </select>
                  </div>

                  {/* Date Format */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.preferences.dateFormat')}
                    </label>
                    <select
                      value={preferences.dateFormat}
                      onChange={(e) => setPreferences({ ...preferences, dateFormat: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>

                  {/* Help Level */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.preferences.helpLevel')}
                    </label>
                    <select
                      value={preferences.helpLevel}
                      onChange={(e) => setPreferences({ ...preferences, helpLevel: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="beginner">{t('settings.preferences.beginner')}</option>
                      <option value="intermediate">{t('settings.preferences.intermediate')}</option>
                      <option value="expert">{t('settings.preferences.expert')}</option>
                    </select>
                  </div>

                  {/* Currency */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {t('settings.preferences.currency')}
                    </label>
                    <select
                      value={preferences.currency}
                      onChange={(e) => setPreferences({ ...preferences, currency: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    >
                      <option value="EUR">EUR (€)</option>
                      <option value="USD">USD ($)</option>
                      <option value="GBP">GBP (£)</option>
                    </select>
                  </div>
                </div>

                {/* Toggle Preferences */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-900">{t('settings.preferences.advanced')}</h3>
                  
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={preferences.autoSave}
                        onChange={(e) => setPreferences({ ...preferences, autoSave: e.target.checked })}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{t('settings.preferences.autoSave')}</span>
                    </label>
                    
                    <label className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={preferences.compactMode}
                        onChange={(e) => setPreferences({ ...preferences, compactMode: e.target.checked })}
                        className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                      />
                      <span className="text-sm text-gray-700">{t('settings.preferences.compactMode')}</span>
                    </label>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Companies Tab */}
            {activeTab === 'companies' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-6"
              >
                <h2 className="text-xl font-semibold text-gray-900">{t('settings.companies.title')}</h2>

                <div className="space-y-4">
                  {user?.companies?.map((company) => (
                    <div key={company.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="bg-blue-100 text-blue-600 rounded-lg p-2">
                            <Building className="h-5 w-5" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-900">{company.name}</h3>
                            <p className="text-sm text-gray-600">SIRET: {company.siret}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                          <Badge variant="success" size="sm">{t('settings.companies.administrator')}</Badge>
                          <Button variant="ghost" size="sm">
                            {t('settings.companies.manageAccess')}
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="font-medium text-gray-500">{t('settings.companies.role')}:</span>
                            <p className="text-gray-900">{t('settings.companies.administrator')}</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">{t('settings.companies.accessSince')}:</span>
                            <p className="text-gray-900">15 janvier 2024</p>
                          </div>
                          <div>
                            <span className="font-medium text-gray-500">{t('settings.companies.lastConnection')}:</span>
                            <p className="text-gray-900">{t('settings.companies.today')}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <Building className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-900">{t('settings.companies.newAccess')}</h4>
                      <p className="text-sm text-blue-800 mt-1">
                        {t('settings.companies.contactAdmin')}
                      </p>
                      <Button variant="secondary" size="sm" className="mt-3">
                        {t('settings.companies.requestAccess')}
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;