import React, { PureComponent } from 'react';
import { Form, Button, Row, Col } from 'antd';
import CreateForm from '@/components/CreateForm';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { formTrim } from '@/utils/form';

@Form.create()
class CommonForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    formAttr: PropTypes.array,
    loading: PropTypes.bool,
    onSubmit: PropTypes.func,
    cancelAction: PropTypes.element,
    submitAction: PropTypes.element,
    submitText: PropTypes.string,
  };

  static defaultPorps = {
    data: {},
    formAttr: [],
    cancelAction: null,
    submitAction: null,
    submitText: 'SAVE',
  };

  handleSubmit = e => {
    const { form, onSubmit } = this.props;

    e.preventDefault();

    form.validateFieldsAndScroll({ scroll: { offsetTop: 100 } }, (err, values) => {
      if (err) return;
      const data = formTrim(values);
      onSubmit && onSubmit(data);
    });
  };

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  };

  renderForm() {
    const { form, formAttr, data } = this.props;
    const { getFieldDecorator } = form;

    return (
      <Row type="flex" gutter={32}>
        {formAttr.map(item => {
          const { label, key, valueFunc, defaultValue, col, style, ...rest } = item;

          const v = get(data, key);
          let dv = v !== undefined && v !== null ? v : defaultValue;
          dv = valueFunc ? valueFunc(v, data) : dv;

          const responsive = col || { sm: 24, md: 12, lg: 8 };

          return (
            <Col {...responsive} key={`col${item.key}`} style={style}>
              <CreateForm getFieldDecorator={getFieldDecorator} name={key} label={label} {...rest} defaultValue={dv} />
            </Col>
          );
        })}
      </Row>
    );
  }

  setFieldsValue = values => {
    this.props.form.setFieldsValue(values);
  };

  getFieldsValue = () => this.props.form.getFieldsValue();

  render() {
    const { loading, cancelAction, submitAction, submitText, children } = this.props;
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.renderForm()}
        {children}
        <div className="text-center form-action">
          {submitAction || (
            <Button htmlType="submit" type="primary" className="btn-form" loading={loading}>
              {submitText}
            </Button>
          )}
          {cancelAction || (
            <Button type="primary" ghost onClick={this.handleReset} className="btn-form">
              RESET
            </Button>
          )}
        </div>
      </Form>
    );
  }
}

export default CommonForm;
