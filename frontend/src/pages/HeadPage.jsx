import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeadProfileForm from '../components/registration/HeadProfileForm';

export default function HeadPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNext = (data) => {
    // Save familyData to localStorage
    localStorage.setItem('familyData', JSON.stringify({ ...data, members: [] }));
    navigate('/members');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Society Manager</h1>
          <p className="text-sm text-gray-600 mt-1">Head of Family Registration</p>
        </div>
        <div className="bg-white shadow-lg p-6 rounded-2xl">
          <HeadProfileForm
            familyData={{}}
            onNext={handleNext}
            loading={loading}
            setLoading={setLoading}
          />
        </div>
      </div>
    </div>
  );
}