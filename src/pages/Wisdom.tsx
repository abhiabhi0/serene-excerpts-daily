import React from 'react';
import { useAuth } from '@/context/AuthContext';

const WisdomPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Daily Wisdom</h1>
      <div className="bg-white/5 rounded-lg p-6">
        <p className="text-lg mb-4">
          Welcome to your daily dose of wisdom. Here you'll find inspiring quotes and teachings to guide your journey.
        </p>
        {/* Add wisdom content here */}
      </div>
    </div>
  );
};

export default WisdomPage; 