import React from 'react';
import { useAuth } from '@/context/AuthContext';

const AffirmationPage: React.FC = () => {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Daily Affirmations</h1>
      <div className="bg-white/5 rounded-lg p-6">
        <p className="text-lg mb-4">
          Practice positive self-talk and affirmations to cultivate a mindset of growth and possibility.
        </p>
        {/* Add affirmations content here */}
      </div>
    </div>
  );
};

export default AffirmationPage; 