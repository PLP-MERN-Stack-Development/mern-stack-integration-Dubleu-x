import React from 'react';

const ErrorMessage = ({ message, onClose, retry }) => {
  return (
    <div className="alert alert-error">
      <div className="alert-content">
        <strong>Error:</strong> {message}
      </div>
      <div className="alert-actions">
        {retry && (
          <button onClick={retry} className="btn btn-sm btn-primary">
            Retry
          </button>
        )}
        {onClose && (
          <button onClick={onClose} className="alert-close">
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;