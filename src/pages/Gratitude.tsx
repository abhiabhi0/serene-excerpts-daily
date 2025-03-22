import React from 'react';
import { useAuth } from '@/context/AuthContext';

const GratitudePage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Gratitude Practice</h1>
      <div className="bg-white/5 rounded-lg p-6">
        <p className="text-lg mb-4">
          Take a moment to reflect on what you're grateful for today. Expressing gratitude can transform your perspective and bring more joy into your life.
        </p>
        {/* Add gratitude practice content here */}
      </div>
    </div>
  );
};

export default GratitudePage; 