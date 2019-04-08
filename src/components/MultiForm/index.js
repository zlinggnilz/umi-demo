import React, { PureComponent, Fragment } from 'react';
import Card from '@/components/Card';
import { Form, Button, Row, Col, Icon } from 'antd';
import CreateForm from '@/components/CreateForm';
import { get, map, set, isEmpty } from 'lodash';
import PropTypes from 'prop-types';

const keyObj = {};

@Form.create()
class MultiLevelForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    formAttr: PropTypes.array,
    loading: PropTypes.bool,
    onSubmit: PropTypes.func,
    cancelAction: PropTypes.element,
    submitAction: PropTypes.element,
    submitText: PropTypes.string,
  };

  static defaultProps = {
    data: {},
    formAttr: [],
    cancelAction: null,
    submitAction: null,
    submitText: 'SAVE',
  };

  state = {
    formKeys: {},
  };

  formKeys = {};

  componentDidMount() {
    const { data } = this.props;
    this.handleAttr('setKey', data);
  }

  handleSubmit = e => {
    const { form, onSubmit } = this.props;

    e.preventDefault();

    form.validateFieldsAndScroll((err, values) => {
      const newVales = this.handleAttr('setValues', values);

      if (err) return;
      onSubmit && onSubmit(newVales);
    });
  };

  handleAttr(type = 'setKey', data) {
    const { formAttr } = this.props;

    const obj = {};

    const handleChildrenAttr = (rChildren, pKey, action) => {
      if (Array.isArray(rChildren)) {
        rChildren.forEach(item => {
          action(item, pKey);
        });
      } else {
        console.error('Children record should be Array');
      }
    };

    const handleAttrForm = (record, parrentKey = '') => {
      if (!record) return;
      if (record.multi) {
        const attrKey = `formKey-${parrentKey}-${record.key}-multiFormKey`;
        const recordData = get(data, `${parrentKey}[${record.key}]`, []) || [];
        let recordKeyArr;
        if (type === 'setKey') {
          recordKeyArr = [0];
          keyObj[attrKey] = recordData.length;
          for (let i = 1; i < recordData.length; i++) {
            recordKeyArr.push(i);
          }
          obj[attrKey] = recordKeyArr;
        } else {
          recordKeyArr = this.getItemKeyValue(attrKey);
          const recordVals = get(data, `${parrentKey}[${record.key}]`);
          if (recordVals.length > 1) {
            set(data, `${parrentKey}[${record.key}]`, recordVals.filter(item => item));
          }
        }
        recordKeyArr.forEach(ark => {
          record.children && handleChildrenAttr(record.children, `${parrentKey}[${record.key}][${ark}]`, handleAttrForm);
        });
      } else {
        record.children && handleChildrenAttr(record.children, `${parrentKey}[${record.key}]`, handleAttrForm);
      }
    };

    formAttr.forEach(attr => handleAttrForm(attr, ''));
    if (type === 'setKey') {
      this.formKeys = obj;
      this.setItemKey(obj);
    } else {
      return data;
    }
  }

  addItem = itemKey => {
    const keys = this.formKeys[itemKey];
    const nextKeys = keys.concat(++keyObj[itemKey]);

    this.setItemKey({ [itemKey]: nextKeys });
  };

  removeItem = (itemKey, value) => {
    const keys = this.formKeys[itemKey];
    if (keys.length === 1) {
      return;
    }

    this.setItemKey({ [itemKey]: keys.filter(key => key !== value) });
  };

  setItemKey = obj => {
    this.formKeys = { ...this.formKeys, ...obj };
    this.setState({
      formKeys: this.formKeys,
    });
  };

  getItemKeyValue = itemKey => {
    // if (itemKey in keyObj) {
    const v = this.state.formKeys[itemKey];
    return v || [0];
    // }
  };

  getFormItem = (record, parrentKey = '', ark = null) => {
    const { form, data } = this.props;
    const { getFieldDecorator } = form;
    const itemKey = `${parrentKey}[${record.key}]${ark !== null ? `[${ark}]` : ''}`;
    const getItem = item => {
      const { label, key, valueFunc, defaultValue, col, ...rest } = item;
      const k = record.items ? `${itemKey}[${key}]` : itemKey;
      const v = get(data, k);
      const dv = v !== undefined ? (valueFunc ? valueFunc(v) : v) : defaultValue;
      const responsive = col || { sm: 24, md: 12, lg: 8 };
      return (
        <Col {...responsive} key={`col-${k}`}>
          {/* item key : {k} */}
          <CreateForm getFieldDecorator={getFieldDecorator} name={k} label={label} {...rest} defaultValue={dv} />
        </Col>
      );
    };
    const getRenderChildren = rec => rec.children && map(rec.children, item => this.getRenderForm(item, itemKey));
    if (record.items) {
      return (
        <Fragment key={`${itemKey}-row`}>
          <Row type="flex" gutter={32}>
            {map(record.items, item => getItem(item))}
          </Row>
          {getRenderChildren(record)}
        </Fragment>
      );
    }
    if (record.children) {
      return getRenderChildren(record);
    }
    return (
      <Fragment key={`${itemKey}-row`}>
        {getItem(record)}
        {getRenderChildren(record)}
      </Fragment>
    );
  };

  getDelBtn = ({ itemKey, value }) => (
    <a
      onClick={() => {
        this.removeItem(itemKey, value);
      }}
    >
      <Icon type="delete" />
      Delete
    </a>
  );

  getAddBtn = ({ attrKey, label }) => (
    <Button
      type="primary"
      ghost
      onClick={() => {
        this.addItem(attrKey);
      }}
      className="btn-form"
    >
      <Icon type="plus" />
      {label}
    </Button>
  );

  getRenderForm = (record, parrentKey = '') => {
    if (!record) return null;
    if (record.multi) {
      const attrKey = `formKey-${parrentKey}-${record.key}-multiFormKey`;
      const attrKeyArr = this.getItemKeyValue(attrKey);
      const rend = map(attrKeyArr, (ark, index) => (
        <Col span={24} key={`${parrentKey}${ark}-${record.key}`}>
          <Card
            title={`${record.label} ${index + 1}`}
            type="inner"
            style={{ marginBottom: 24 }}
            extra={attrKeyArr.length > 1 ? this.getDelBtn({ itemKey: attrKey, value: ark }) : null}
            bodyStyle={{ paddingBottom: 0 }}
          >
            {this.getFormItem(record, parrentKey, ark)}
          </Card>
        </Col>
      ));
      const add = (
        <Col span={24} key={`${parrentKey}-${record.key}-addbtn`}>
          <div className="text-center" style={{ marginBottom: 24 }}>
            {this.getAddBtn({ attrKey, label: record.label })}
          </div>
        </Col>
      );
      rend.push(add);
      return rend;
    }
    if (record.items) {
      return (
        <Col span={24} key={`${parrentKey}-${record.key}-card`}>
          <Card title={record.label} type="inner" style={{ marginBottom: 24 }} bodyStyle={{ paddingBottom: 0 }}>
            {this.getFormItem(record, parrentKey)}
          </Card>
        </Col>
      );
    }
    if (record.children) {
      return this.getFormItem(record, parrentKey);
    }
    return this.getFormItem(record, parrentKey);
  };

  render() {
    const { loading, formAttr, submitAction, cancelAction, submitText } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        <Row type="flex" gutter={32}>
          {!isEmpty(this.state.formKeys)
            ? map(formAttr, (attr, index) => this.getRenderForm(attr, '', index))
            : 'Please confirm the form is Multi Level Form'}
        </Row>
        <div className="text-center form-action" style={{ marginTop: 24 }}>
          {submitAction || (
            <Button htmlType="submit" type="primary" className="btn-form" loading={loading}>
              {submitText}
            </Button>
          )}
          {cancelAction}
        </div>
      </Form>
    );
  }
}

export default MultiLevelForm;
