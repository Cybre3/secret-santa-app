import React from 'react';
import ErrorMessage from './ErrorMessage';

const CustomInput = ({ name, label, value, disabled, error, classes, ...rest }) => {
  return (
    <div className={`inputbox ${classes ? classes.inputContainer : ''}`}>
      <input
        className={`form-control ${classes ? classes.inputClass : ''}`}
        {...rest}
        name={name}
        id={name}
        value={value}
        disabled={disabled}
      />
      <i className={classes ? classes.labelClass : ''}>{label}</i>
      {error && <ErrorMessage error={error} classname={'custom-alert'} />}
    </div>
  );
};

export default CustomInput;
