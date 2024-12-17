import React from 'react';
import './ProfileCompletionStepper.scss';
import ProfileCompletion from './ProfileCompletion';

type ModalProps = {
  show: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ show, onClose }) => {
  if (!show) return null;

  const animateLetters = (text: string) => {
    return text.split('').map((char, index) => (
      <span key={index} style={{ animationDelay: `${index * 0.1}s` }}>
        {char}
      </span>
    ));
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
      <h1 className="modal-heading">
          {animateLetters('Little More About You')}
        </h1>
        <ProfileCompletion />
      </div>
    </div>
  );
};

export default Modal;
