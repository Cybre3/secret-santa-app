import React from 'react';

function ErrorMessage({ error, classname }) {
  return (
    <div className={`${classname} alert-danger`} style={{ zIndex: 1 }}>
      {error}
    </div>
  );
}

export default ErrorMessage;
