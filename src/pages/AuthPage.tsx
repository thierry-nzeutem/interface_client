import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Mail, Smartphone, MessageSquare, ArrowRight } from 'lucide-react';
import { useAuthStore } from '../stores/authStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { useLanguageStore } from '../stores/languageStore';

const AuthPage: React.FC = () => {
  const [step, setStep] = useState<'email' | 'method' | 'code'>('email');
  const [email, setEmail] = useState('');
  const [method, setMethod] = useState<'email' | 'sms' | 'whatsapp'>('email');
  const [code, setCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { login, requestCode } = useAuthStore();
  const { t } = useLanguageStore();

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStep('method');
  };

  const handleMethodSelect = async (selectedMethod: typeof method) => {
    setIsLoading(true);
    try {
      await requestCode(email, selectedMethod);
      setMethod(selectedMethod);
      setStep('code');
    } catch (error) {
      console.error('Error requesting code:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code) return;
    setIsLoading(true);
    try {
      await login(email, code);
    } catch (error) {
      console.error('Error logging in:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getMethodConfig = (m: typeof method) => {
    switch (m) {
      case 'email':
        return { icon: Mail, label: 'Email', description: 'Recevoir le code par email' };
      case 'sms':
        return { icon: Smartphone, label: 'SMS', description: 'Recevoir le code par SMS' };
      case 'whatsapp':
        return { icon: MessageSquare, label: 'WhatsApp', description: 'Recevoir le code via WhatsApp' };
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 text-white rounded-xl mb-4">
            <Shield className="h-8 w-8" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Prévéris</h1>
          <p className="text-gray-600 mt-2">Interface Client</p>
        </div>

        <Card className="p-8">
          {step === 'email' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                {t('auth.secureTitle')}
              </h2>
              <form onSubmit={handleEmailSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    {t('auth.emailLabel')}
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.emailPlaceholder')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  {t('auth.continue')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>
              <p className="text-xs text-gray-500 mt-4 text-center">
                {t('auth.codeHelp')}
              </p>
            </motion.div>
          )}

          {step === 'method' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                {t('auth.methodTitle')}
              </h2>
              <div className="space-y-3">
                {(['email', 'sms', 'whatsapp'] as const).map((m) => {
                  const config = getMethodConfig(m);
                  const Icon = config.icon;
                  return (
                    <button
                      key={m}
                      onClick={() => handleMethodSelect(m)}
                      disabled={isLoading}
                      className="w-full p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-red-300 transition-colors text-left disabled:opacity-50"
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 text-red-500" />
                        <div>
                          <div className="font-medium text-gray-900">{config.label}</div>
                          <div className="text-sm text-gray-600">{config.description}</div>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
              <Button
                variant="ghost"
                onClick={() => setStep('email')}
                className="w-full mt-4"
              >
                {t('auth.back')}
              </Button>
            </motion.div>
          )}

          {step === 'code' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                {t('auth.enterCode')}
              </h2>
              <div className="text-center mb-6">
                <div className="flex items-center justify-center space-x-2 text-gray-600">
                  {React.createElement(getMethodConfig(method).icon, { className: 'h-5 w-5' })}
                  <span className="text-sm">{t('auth.codeSentVia')} {getMethodConfig(method).label}</span>
                </div>
              </div>
              <form onSubmit={handleCodeSubmit} className="space-y-4">
                <div>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder={t('auth.codePlaceholder')}
                    className="w-full px-4 py-3 text-center text-lg font-mono border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
                    maxLength={6}
                    pattern="[0-9]{6}"
                    required
                  />
                </div>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? t('auth.loading') : t('auth.login')}
                </Button>
              </form>
              <div className="text-center mt-4">
                <button
                  onClick={() => handleMethodSelect(method)}
                  disabled={isLoading}
                  className="text-sm text-red-600 hover:text-red-700 disabled:opacity-50"
                >
                  {t('auth.resendCode')}
                </button>
              </div>
            </motion.div>
          )}
        </Card>

        <div className="text-center mt-6 text-xs text-gray-500">
          <p>{t('auth.secureSubtitle')}</p>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthPage;