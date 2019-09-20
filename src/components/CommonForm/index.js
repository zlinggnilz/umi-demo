import React, { PureComponent } from 'react';
import { Form, Button, Row, Col } from 'antd';
import { get } from 'lodash';
import PropTypes from 'prop-types';
import CreateForm from '@/components/CreateForm';
import { formTrim } from '@/components/_utils/form';
import { getLangKey } from '@/components/_utils/getLangKey';
import styles from './index.less';

@Form.create({
  onFieldsChange(props, changedFields, all) {
    props.onFieldsChange && props.onFieldsChange(props, changedFields, all);
  },
})
class CommonForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    formAttr: PropTypes.array,
    loading: PropTypes.bool,
    onSubmit: PropTypes.func,
    cancelAction: PropTypes.element,
    submitAction: PropTypes.element,
    submitText: PropTypes.string,
    col: PropTypes.object,
  };

  static defaultProps = {
    data: {},
    formAttr: [],
    submitText: 'SAVE',
    col: { xs: 24, sm: 12, md: 8 },
  };

  handleSubmit = e => {
    const { form, onSubmit } = this.props;

    e.preventDefault();

    if (document && document.activeElement) {
      document.activeElement.blur();
    }

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

  getFormItem = item => {
    const { form, data, col } = this.props;
    const { getFieldDecorator } = form;

    const { onlyLabel, label, key, defaultValue, style = {}, required, shouldRender, hidden, ...rest } = item;

    const responsive = item.col || col;

    const [multilangParentK, multilangK] = getLangKey(key);

    let showItem = true;
    if (shouldRender !== undefined) {
      showItem = typeof shouldRender === 'function' ? shouldRender(key) : shouldRender;
    }

    if (!showItem) {
      return null;
    }

    let itemHidden = false;
    if (hidden !== undefined) {
      itemHidden = typeof hidden === 'function' ? hidden(key) : hidden;
    }

    if (onlyLabel) {
      return (
        <Col {...responsive} key={`col-label-${item.label}`} style={style}>
          <div className={`${styles.onlyLabel} flex align-middle`}>{label}</div>
        </Col>
      );
    }

    if (item.type === 'block') {
      return <Col span={24} key="block" />;
    }
    if (item.type === 'group') {
      return React.cloneElement(item.component, { form, data, getFormItem: this.getFormItem });
    }

    const recordKey = multilangParentK || key;

    const v = get(data, recordKey);
    const dv = typeof defaultValue === 'function' ? defaultValue(v, recordKey) : v !== undefined && v !== null ? v : defaultValue;

    const ifRequired = typeof required === 'function' ? required(recordKey) : required;

    return (
      <Col {...responsive} key={`col${key}`} style={{ display: itemHidden ? 'none' : '', ...style }}>
        <CreateForm
          getFieldDecorator={getFieldDecorator}
          name={recordKey}
          multilangkey={multilangK}
          label={label}
          required={ifRequired}
          hidden={itemHidden}
          {...rest}
          defaultValue={dv}
        />
      </Col>
    );
  };

  renderForm() {
    const { formAttr } = this.props;

    return (
      <Row type="flex" gutter={32}>
        {formAttr.map(item => this.getFormItem(item))}
      </Row>
    );
  }

  setFieldsValue = (...values) => {
    this.props.form.setFieldsValue(...values);
  };

  setFields = obj => {
    this.props.form.setFields(obj);
  };

  getFieldsValue = f => this.props.form.getFieldsValue(f);

  getFieldValue = s => s && this.props.form.getFieldValue(s);

  validateFields = (...v) => this.props.form.validateFields(...v);

  validateFieldsAndScroll = (...v) => this.props.form.validateFieldsAndScroll(...v);

  render() {
    const { loading, cancelAction, submitAction, submitText, children, more } = this.props;

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
        <div className={`text-center ${styles.formAction}`}>
          {formSubmitAction}
          {formCancelAction}
        </div>
      </Form>
    );
  }
}

export default CommonForm;
