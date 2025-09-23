import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MembersStep from '../components/registration/MembersStep';
import PreviewStep from '../components/registration/PreviewStep';

export default function MemberPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('members');
  const [loading, setLoading] = useState(false);
  const [familyData, setFamilyData] = useState(() => {
    const savedData = localStorage.getItem('familyData');
    return savedData ? JSON.parse(savedData) : { members: [] };
  });

  // Update localStorage whenever familyData changes
  useEffect(() => {
    localStorage.setItem('familyData', JSON.stringify(familyData));
  }, [familyData]);

  // Submit registration to backend
  const submitRegistration = async () => {
    setLoading(true);
    try {
      const mobile = localStorage.getItem('mobile') || '';
      const submissionData = {
        ...familyData,
        head_mobile: mobile,
      };

      const response = await fetch('http://localhost:5000/api/registration/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const data = await response.json();

      if (data.success) {
        localStorage.setItem('familyId', data.familyId);
        return true;
      } else {
        alert(data.message || 'Registration failed');
        return false;
      }
    } catch (error) {
      console.error('Error submitting registration:', error);
      alert('Failed to submit registration. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const goToNextStep = (data) => {
    if (currentStep === 'members') {
      setFamilyData((prev) => ({ ...prev, members: data }));
      setCurrentStep('preview');
    }
  };

  const goToStep = (step) => setCurrentStep(step);

  const renderStep = () => {
    switch (currentStep) {
      case 'members':
        return (
          <MembersStep
            familyData={familyData}
            onNext={goToNextStep}
            onBack={() => navigate('/head')}
          />
        );
      case 'preview':
        return (
          <PreviewStep
            familyData={familyData}
            onBack={() => goToStep('members')}
            onSubmit={submitRegistration}
            loading={loading}
          />
        );
      default:
        return null;
    }
  };

  const steps = [
    { id: 'members', name: 'Family Members' },
    { id: 'preview', name: 'Preview & Submit' },
  ];
  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-blue-700">Society Manager</h1>
          <p className="text-sm text-gray-600 mt-1">Family Members Management</p>
        </div>

        <nav aria-label="Progress" className="mb-6">
          <ol role="list" className="flex space-x-6">
            {steps.map((step, stepIdx) => {
              const isActive = stepIdx === currentStepIndex;
              const isCompleted = stepIdx < currentStepIndex;

              return (
                <li key={step.id} className="flex-1">
                  <div
                    className={`text-sm font-medium pb-2 border-b-2 transition-colors
                    ${isActive ? 'border-blue-600 text-blue-700' : isCompleted ? 'border-blue-300 text-gray-600' : 'border-gray-200 text-gray-400'}`}
                  >
                    Step {stepIdx + 1}: {step.name}
                  </div>
                </li>
              );
            })}
          </ol>
        </nav>

        <div className="bg-white shadow-lg p-6 rounded-2xl">{renderStep()}</div>
      </div>
    </div>
  );
}