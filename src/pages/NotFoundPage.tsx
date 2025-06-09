import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguageStore } from '../stores/languageStore';

const NotFoundPage: React.FC = () => {
  const { t } = useLanguageStore();

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center p-8">
      <h1 className="text-4xl font-bold mb-4">{t('notFound.title')}</h1>
      <p className="mb-8">{t('notFound.description')}</p>
      <Link to="/dashboard" className="text-blue-500 hover:underline">
        {t('notFound.backHome')}
      </Link>
    </div>
  );
};

export default NotFoundPage;
