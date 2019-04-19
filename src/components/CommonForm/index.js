import React, { PureComponent } from 'react';
import { Form, Button, Row, Col } from 'antd';
import CreateForm from '@/components/CreateForm';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import { formTrim } from '@/utils/form';
import styles from './index.less';

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
          const { onlyLabel, label, key, valueFunc, defaultValue, col, style, ...rest } = item;

          const responsive = col || { xs: 24, sm: 12, md: 8 };

          if (onlyLabel) {
            return (
              <Col {...responsive} key={`col-label-${item.label}`} style={style}>
                <div className={`${styles.onlyLabel} flex align-middle`}>{label}</div>
              </Col>
            );
          }

          const v = get(data, key);
          let dv = v !== undefined && v !== null ? v : defaultValue;
          dv = valueFunc ? valueFunc(v, data) : dv;

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

  getFieldsValue = f => this.props.form.getFieldsValue(f);

  getFieldValue = s => s && this.props.form.getFieldValue(s);

  render() {
    const { loading, cancelAction, submitAction, submitText, children } = this.props;

    const formSubmitAction =
      'submitAction' in this.props ? (
        submitAction
      ) : (
        <Button htmlType="submit" type="primary" className="btn-form" loading={loading}>
          {submitText}
        </Button>
      );

    const formCancelAction =
      'cancelAction' in this.props ? (
        cancelAction
      ) : (
        <Button type="primary" ghost onClick={this.handleReset} className="btn-form">
          RESET
        </Button>
      );

    return (
      <Form onSubmit={this.handleSubmit}>
        {this.renderForm()}
        {children}
        <div className="text-center form-action">
          {formSubmitAction}
          {formCancelAction}
        </div>
      </Form>
    );
  }
}

export default CommonForm;
