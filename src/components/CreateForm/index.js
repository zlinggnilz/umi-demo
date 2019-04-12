import React from 'react';
import { Form, Radio, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import { toString } from 'lodash';
import { Input, Textarea, Select, InputNumber } from '../Field';

const FormItem = Form.Item;
const { Option } = Select;
// const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const CreateForm = props => {
  const {
    getFieldDecorator,
    required,
    message,
    name,
    label,
    dataSource,
    formProps,
    fieldProps,
    showItem,
    custom,
    component,
    disabled,
    parentKey,
  } = props;

  let { placeholder, rules, type, defaultValue } = props;

  const key = name;
  placeholder = placeholder || label;

  type = type.toLowerCase();

  const obj = {
    required,
    message: message || 'This field is required',
  };

  if (defaultValue === null) {
    defaultValue = undefined;
  }

  if ((type === 'text' || type === 'email' || type === 'textarea') && !custom) {
    obj.transform = v => `${v || ''}`.trim();
  }

  const setObj = (v, msg) => {
    if (!rules) {
      obj.type = v;
      obj.message = message || msg;
    }
  };

  const createField = () => {
    let field;
    const commonProp = {
      parentKey,
      name,
    };
    const textItem = <Input type="text" placeholder={placeholder} {...commonProp} {...fieldProps} />;

    if (custom) {
      field = component || <span />;
    } else if (disabled) {
      field = <span>{defaultValue}</span>;
    } else {
      switch (type) {
        case 'email':
          setObj('email', 'This field is not a valid email');
          field = textItem;
          break;

        case 'text':
          field = textItem;
          break;

        case 'textarea':
          field = <Textarea rows={3} {...commonProp} {...fieldProps} />;
          break;

        case 'select':
          field = (
            <Select placeholder={placeholder} allowClear {...commonProp} {...fieldProps}>
              {!!dataSource.length &&
                dataSource.map(opt => (
                  <Option key={opt.key} value={opt.key}>
                    {opt.label || opt.kye}
                  </Option>
                ))}
            </Select>
          );
          break;

        // case 'date':
        //   field = <DatePicker {...fieldProps} />;
        //   break;

        // case 'date-range':
        //   field = <RangePicker {...fieldProps} />;
        //   break;

        case 'radio':
          field = (
            <RadioGroup>
              {!!dataSource.length &&
                dataSource.map(opt => (
                  <Radio key={opt.key} value={opt.key} {...commonProp} {...fieldProps}>
                    {opt.label || opt.key}
                  </Radio>
                ))}
            </RadioGroup>
          );
          break;

        case 'checkbox':
          field = (
            <CheckboxGroup>
              {!!dataSource.length &&
                dataSource.map(opt => (
                  <Checkbox key={opt.key} value={opt.key} {...commonProp} {...fieldProps}>
                    {opt.label || opt.key}
                  </Checkbox>
                ))}
            </CheckboxGroup>
          );
          break;

        case 'int':
          setObj('integer', 'This field is not an integer');
          defaultValue = defaultValue !== undefined ? Number(defaultValue) : defaultValue;
          field = <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder={placeholder} {...commonProp} {...fieldProps} />;
          break;

        case 'float':
        case 'number':
          setObj('number', 'Numbers only');
          defaultValue = defaultValue !== undefined ? Number(defaultValue) : defaultValue;
          field = <InputNumber min={0} style={{ width: '100%' }} placeholder={placeholder} {...commonProp} {...fieldProps} />;
          break;

        case 'url':
          setObj('url', 'This field is not a url');
          field = textItem;
          break;

        default:
          field = textItem;
          break;
      }
    }

    rules = rules || [obj];

    return getFieldDecorator(key, {
      rules,
      initialValue: defaultValue,
    })(field);
  };

  if (showItem) {
    return (
      <FormItem label={label} {...formProps}>
        {createField()}
      </FormItem>
    );
  }
  return createField();
};

CreateForm.propTypes = {
  component: PropTypes.element,
  custom: PropTypes.bool,
  dataSource: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      label: PropTypes.string,
    })
  ),
  defaultValue: PropTypes.any,
  disabled: PropTypes.bool,
  fieldProps: PropTypes.object,
  formProps: PropTypes.object,
  getFieldDecorator: PropTypes.func.isRequired,
  key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  label: PropTypes.string,
  message: PropTypes.string,
  name: PropTypes.string,
  parentKey: PropTypes.string,
  placeholder: PropTypes.string,
  required: PropTypes.bool,
  rules: PropTypes.array,
  showItem: PropTypes.bool,
  type: PropTypes.string.isRequired,
};
CreateForm.defaultProps = {
  type: 'text',
  label: '',
  required: true,
  showItem: true,
  custom: false,
  disabled: false,
  fieldProps: {},
  formProps: {},
  dataSource: [],
};

export default CreateForm;
