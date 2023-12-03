import React from 'react';
import ErrorMessage from './ErrorMessage';

const Input = ({ name, label, error, disabled, classes, ...rest }) => {
  return (
    <div className={`form-group ${classes ? classes.inputContainer : 'space-x-2 flex'}`}>
      <label className={classes ? classes.labelClass : ''} htmlFor={name}>
        {label}
      </label>
      <input
        {...rest}
        name={name}
        className={`form-control ${classes ? classes.inputClass : 'outline outline-1'}`}
        id={name}
        disabled={disabled}
      />
      {error && <ErrorMessage error={error} classname={'alert'} />}
    </div>
  );
};

export default Input;
