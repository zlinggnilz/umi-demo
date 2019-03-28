import React from 'react';
import { Form, InputNumber, Radio, Checkbox } from 'antd';
import PropTypes from 'prop-types';
import { Input, Textarea, Select } from '../Field';

const FormItem = Form.Item;
const { Option } = Select;
// const RangePicker = DatePicker.RangePicker;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;

const CreateForm = props => {
  const { getFieldDecorator, required, name, label, dataSource, options, fieldProps, showItem } = props;

  let { placeholder, rules, type, message, defaultValue } = props;

  const key = name;
  placeholder = placeholder || label;

  type = type.toLowerCase();

  message = message || (required ? 'This field is required' : '');
  const obj = {
    required,
    message,
  };

  if (type === 'text') {
    obj.transform = v => (v || '').trim();
  }

  const setObj = function(v) {
    if (!rules) obj.type = v;
  };

  // fieldProps = { ...fieldProps, placeholder: placeholder };

  const createField = () => {
    let field;
    const textItem = <Input type="text" placeholder={placeholder} {...fieldProps} />;

    switch (type) {
      case 'email':
        setObj('email');
        field = textItem;
        break;

      case 'text':
        field = textItem;
        break;

      case 'textarea':
        field = <Textarea rows={3} {...fieldProps} />;
        break;

      case 'select':
        field = (
          <Select placeholder={placeholder} {...fieldProps}>
            {!!dataSource.length &&
              dataSource.map(opt => (
                <Option key={opt.value} value={opt.value}>
                  {opt.name || opt.value}
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
                <Radio key={opt.value} value={opt.value} {...fieldProps}>
                  {opt.name || opt.value}
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
                <Checkbox key={opt.value} value={opt.value} {...fieldProps}>
                  {opt.name || opt.value}
                </Checkbox>
              ))}
          </CheckboxGroup>
        );
        break;

      case 'int':
        setObj('integer');
        defaultValue = Number(defaultValue) || 0;
        field = <InputNumber min={0} precision={0} style={{ width: '100%' }} placeholder={placeholder} {...fieldProps} />;
        break;

      case 'float':
      case 'number':
        setObj('float');
        defaultValue = Number(defaultValue) || 0;
        field = <InputNumber min={0} style={{ width: '100%' }} placeholder={placeholder} {...fieldProps} />;
        break;

      default:
        field = textItem;
        break;
    }

    rules = rules || [obj];

    return getFieldDecorator(key, {
      rules,
      initialValue: defaultValue,
    })(field);
  };

  if (showItem) {
    return (
      <FormItem label={label || ''} {...options}>
        {createField()}
      </FormItem>
    );
  }
  return createField();
};

CreateForm.propTypes = {
  getFieldDecorator: PropTypes.func.isRequired,
  name: PropTypes.string, // key值
  defaultValue: PropTypes.any, // 默认值
  label: PropTypes.any, // label
  placeholder: PropTypes.string, // 默认跟label相同
  message: PropTypes.any, // 报错message,默认:This field is required
  required: PropTypes.bool, // 是否必填,默认true
  showItem: PropTypes.bool, // 是否显示formItem,默认true
  fieldProps: PropTypes.object, // field的props
  rules: PropTypes.array, // 验证rules
  type: PropTypes.string.isRequired,
  dataSource: PropTypes.arrayOf(
    PropTypes.shape({
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string,
    })
  ), // select或radio-group的选项
};
CreateForm.defaultProps = {
  type: 'text',
  required: true,
  showItem: true,
  fieldProps: {},
  dataSource: [],
};

export default CreateForm;
