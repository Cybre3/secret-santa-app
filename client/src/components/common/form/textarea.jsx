import React from 'react';
import ErrorMessage from './ErrorMessage';

const Textarea = ({ name, label, error, classes, ...rest }) => {
  return (
    <div className={`form-group ${classes ? classes.inputContainer : ''}`}>
      <label className={classes ? classes.labelClass : ''} htmlFor={name}>
        {label}
      </label>
      <textarea
        {...rest}
        name={name}
        rows={classes? classes.rows : ''}
        cols={classes? classes.cols : ''}
        className={`form-control ${classes ? classes.inputClass : ''}`}
        id={name}
      />
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default Textarea;
