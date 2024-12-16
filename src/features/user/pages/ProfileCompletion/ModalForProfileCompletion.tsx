import React from 'react';
import './ProfileCompletionStepper.scss';
import ProfileCompletion from './ProfileCompletion';

type ModalProps = {
  show: boolean;
  onClose: () => void;
};

const Modal: React.FC<ModalProps> = ({ show, onClose }) => {
  if (!show) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <ProfileCompletion />
      </div>
    </div>
  );
};

export default Modal;
