import React from 'react';
import Joi from 'joi-browser';
import Form from './form';

import '../SaveData/saveData.css';

class DataField extends Form {
  state = {
    data: {
      nameOfItem: '',
      valueOfItem: '',
      inputType: '',
    },
    errors: {}
  };

  schema = {
    nameOfItem: Joi.string().label('Name of Item'),
    valueOfItem: Joi.string().label('Value of Item'),
    inputType: Joi.string().label('Input Type'),
  }

  render() {
    return (
      <div className="save-data-field" id={this.props.id}>
        {this.renderInput('nameOfItem', 'Label')}
        {this.renderInput('valueOfItem', 'Value')}
        {this.renderDropdown('inputType', 'Input Type', this.props.options)}
        <button onClick={this.props.onRemove}>X</button>
      </div>
    );
  }
}

export default DataField;
