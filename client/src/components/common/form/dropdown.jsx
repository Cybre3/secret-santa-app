import React from 'react';
import ErrorMessage from './ErrorMessage';

const Dropdown = ({ name, label, error, options, classes, ...rest }) => {
  return (
    <div className={`form-group space-x-2 ${classes ? classes.inputContainer : ''}`}>
      <label className={classes ? classes.labelClass : ''} htmlFor={name}>
        {label}
      </label>
      <select
        className={`form-control outline outline-1 ${classes ? classes.inputClass : ''}`}
        name={name}
        id={name}
        {...rest}
      >
        <option value={null} key={'empty'} className={`${classes ? classes.optionClass : ''}`} />
        {options.map((option) => (
          <option
            key={option.value || option.name}
            disabled={option.disabled}
            value={option.value || option.displayLine}
            className={`${classes ? classes.optionClass : ''}`}
          >
            {option.value || option.displayLine}
          </option>
        ))}
      </select>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default Dropdown;
