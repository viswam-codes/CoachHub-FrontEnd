import React, { useState, ChangeEvent } from 'react';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import './ProfileCompletionStepper.scss';

type PersonalDetails = {
  gender: string;
  age: string;
  height: string;
  weight: string;
};

type Goal = 'Weight Gain' | 'Weight Loss' | 'Muscle Gain' | 'Strength Training';

const ProfileCompletion: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const [personalDetails, setPersonalDetails] = useState<PersonalDetails>({
    gender: '',
    age: '',
    height: '',
    weight: '',
  });

  const goals: Goal[] = ['Weight Gain', 'Weight Loss', 'Muscle Gain', 'Strength Training'];

  const handleGoalSelection = (goal: Goal) => {
    setSelectedGoal(goal);
    setCurrentStep(1);
  };

  const handlePersonalDetailsChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setPersonalDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmitProfile = async () => {
    try {
      const response = await fetch('/api/complete-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          goal: selectedGoal,
          ...personalDetails,
        }),
      });

      if (response.ok) {
        window.location.href = '/home';
      } else {
        alert('Failed to complete profile');
      }
    } catch (error) {
      console.error('Profile completion error:', error);
      alert('An error occurred');
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="goal-selection">
            {goals.map((goal) => (
              <button
                key={goal}
                onClick={() => handleGoalSelection(goal)}
                className={`goal-button ${selectedGoal === goal ? 'selected' : ''}`}
              >
                {goal}
              </button>
            ))}
          </div>
        );

      case 1:
        return (
          <div className="personal-details">
            <div className="input-grid">
              <select
                name="gender"
                value={personalDetails.gender}
                onChange={handlePersonalDetailsChange}
              >
                <option value="">Select Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>

              <input
                type="number"
                name="age"
                placeholder="Age"
                value={personalDetails.age}
                onChange={handlePersonalDetailsChange}
              />

              <input
                type="number"
                name="height"
                placeholder="Height (cm)"
                value={personalDetails.height}
                onChange={handlePersonalDetailsChange}
              />

              <input
                type="number"
                name="weight"
                placeholder="Weight (kg)"
                value={personalDetails.weight}
                onChange={handlePersonalDetailsChange}
              />
            </div>

            <div className="action-buttons">
              <button
                onClick={() => setCurrentStep(0)}
                className="back-button"
              >
                <ChevronLeft className="mr-2" /> Back
              </button>

              <button
                onClick={handleSubmitProfile}
                disabled={!Object.values(personalDetails).every((value) => value)}
                className="submit-button"
              >
                Complete Profile <Check className="ml-2" />
              </button>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="profile-completion-container">
      <div className="step-header">
        {['Choose Goal', 'Personal Details'].map((step, index) => (
          <div
            key={step}
            className={`step-title ${currentStep === index ? 'active' : ''}`}
          >
            {step}
          </div>
        ))}
      </div>

      <div className="mt-6">{renderStepContent()}</div>
    </div>
  );
};

export default ProfileCompletion;
