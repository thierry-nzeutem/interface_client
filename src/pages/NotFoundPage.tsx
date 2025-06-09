import React from 'react';
import { Link } from 'react-router-dom';

const NotFoundPage: React.FC = () => (
  <div className="flex flex-col items-center justify-center h-screen text-center p-8">
    <h1 className="text-4xl font-bold mb-4">404 - Page not found</h1>
    <p className="mb-8">The page you are looking for isn\'t available.</p>
    <Link to="/dashboard" className="text-blue-500 hover:underline">
      Go back home
    </Link>
  </div>
);

export default NotFoundPage;
