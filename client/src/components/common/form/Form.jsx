import React, { Component } from 'react';
import Joi from 'joi-browser';

import Input from './input';
import CustomInput from './customInput';
import Dropdown from './dropdown';
import Textarea from './textarea';
import CheckBox from './checkBox';
// import RadioGroupOptions from './radioGroup';
import RadioGroupOptionsSmall from './radioGroupSmall';

// import load1 from '../../assets/load2.gif';

class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schema, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;

    return errors;
  };

  validateProperty = ({ name, value }) => {
    const obj = { [name]: value };
    const schema = { [name]: this.schema[name] };
    const { error } = Joi.validate(obj, schema);
    return error ? error.details[0].message : null;
  };

  handleSubmit = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();

    if (!Promise.reject) e.target.reset();
  };

  handleCheckCode = (e) => {
    e.preventDefault();

    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.checkCode();
  };

  handleBlur = ({ currentTarget: input }) => {
    const { name } = input;
    const errors = { ...this.state.errors };
    const errorMessage = this.validateProperty(input);
    if (errorMessage) errors[name] = errorMessage;
    else delete errors[name];
    this.setState({ errors });
  };

  handleChange = ({ currentTarget: input, target }) => {
    const { name, value, type } = input;

    const data = { ...this.state.data };
    const file = target.files ? target.files[0] : '';
    const dataToSend = file !== '' ? URL.createObjectURL(file) : '';
    data[name] = value;
    type === 'file'
      ? this.setState({ data: { data, photoUrl: dataToSend, fileData: file } })
      : this.setState({ data });
  };

  renderButton = (label, state, className, btnClass) => {
    return (
      <div className={className}>
        <button disabled={this.validate()} className={`btn bg-gray-300 px-3 py-0.5 ${btnClass}`}>
          <span>{label}</span>
          {className && className.includes('send-btn') ? <i className="fa fa-paper-plane" /> : null}
          {/* {state ? (
            <b className="load">
              <img src={load1} alt="img not responding" />
            </b>
          ) : (
            ''
          )} */}
        </button>
      </div>
    );
  };

  renderInput = (name, label, type = 'text', disabled = false, classes) => {
    const { data, errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        label={label}
        value={data[name]}
        disabled={disabled}
        error={errors[name]}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        classes={classes}
      />
    );
  };

  renderCustomInput = (name, label, type = 'text', disabled = false, classes) => {
    const { data, errors } = this.state;

    return (
      <CustomInput
        type={type}
        name={name}
        label={label}
        value={data[name]}
        disabled={disabled}
        error={errors[name]}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        classes={classes}
      />
    );
  };

  renderTextarea = (name, label, type = 'textarea', classes) => {
    const { data, errors } = this.state;

    return (
      <Textarea
        type={type}
        name={name}
        label={label}
        value={data[name]}
        error={errors[name]}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        classes={classes}
      />
    );
  };

  renderDropdown = (name, label, options, classes) => {
    const { data, errors } = this.state;

    return (
      <Dropdown
        name={name}
        value={data[name]}
        label={label}
        options={options}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        error={errors[name]}
        classes={classes}
      />
    );
  };

  renderCheckbox = (name, label, options) => {
    const { data, errors } = this.state;

    return (
      <CheckBox
        name={name}
        label={label}
        value={data[name]}
        options={options}
        oonChange={this.handleChange}
        onBlur={this.handleBlur}
        error={errors[name]}
      />
    );
  };

  // renderRadioGroup = (name, label, options, checkedOption = 1) => {
  //   const { data, errors } = this.state;

  //   return (
  //     <RadioGroupOptions
  //       name={name}
  //       label={label}
  //       value={data[name]}
  //       options={options}
  //       onChange={this.handleChange}
  //       onBlur={this.handleBlur}
  //       error={errors[name]}
  //       checked={checkedOption}
  //     />
  //   );
  // };

  renderRadioGroupSmall = (name, label, options, checkedOption) => {
    const { data, errors } = this.state;

    return (
      <RadioGroupOptionsSmall
        name={name}
        label={label}
        value={data[name]}
        options={options}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        error={errors[name]}
        checked={checkedOption}
      />
    );
  };
}

export default Form;