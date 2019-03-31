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

    const getForm = (record, parrentKey = '') => {
      if (!record) return;
      if (record.multi) {
        const attrKey = `formKey-${parrentKey}-${record.key}-multiFormKey`;
        const recordData = get(data, `${parrentKey}[${record.key}]`, []);
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
          record.children && getForm(record.children, `${parrentKey}[${record.key}][${ark}]`);
        });
      } else {
        record.children && getForm(record.children, `${parrentKey}[${record.key}]`);
      }
    };

    formAttr.forEach(attr => getForm(attr, ''));
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
    return (
      <Fragment>
        <Row type="flex" gutter={32}>
          {record.items.map(item => {
            const { label, key, valueFunc, defaultValue, ...rest } = item;
            const k = `${itemKey}[${key}]`;
            const v = get(data, k);
            const dv = v !== undefined ? (valueFunc ? valueFunc(v) : v) : defaultValue;
            return (
              <Col sm={24} md={12} lg={8} key={`col-${k}`}>
                {/* item key : {k} */}
                <CreateForm getFieldDecorator={getFieldDecorator} name={k} label={label} {...rest} defaultValue={dv} />
              </Col>
            );
          })}
        </Row>
        {this.getRenderForm(record.children, itemKey)}
      </Fragment>
    );
  };

  getRenderForm = (record, parrentKey = '') => {
    const DelBtn = ({ itemKey, value }) => (
      <a
        onClick={() => {
          this.removeItem(itemKey, value);
        }}
      >
        <Icon type="delete" />
        删除
      </a>
    );
    const AddBtn = ({ attrKey, label }) => (
      <Button
        type="primary"
        ghost
        onClick={() => {
          this.addItem(attrKey);
        }}
        className="btn-form"
      >
        <Icon type="plus" />
        添加{label}
      </Button>
    );
    if (!record) return null;
    if (record.multi) {
      const attrKey = `formKey-${parrentKey}-${record.key}-multiFormKey`;
      const attrKeyArr = this.getItemKeyValue(attrKey);
      const rend = map(attrKeyArr, ark => (
        <Card
          title={record.label}
          type="inner"
          style={{ marginBottom: 24 }}
          extra={attrKeyArr.length > 1 ? <DelBtn itemKey={attrKey} value={ark} /> : null}
          key={`${parrentKey}${ark}-${record.key}`}
          bodyStyle={{ paddingBottom: 0 }}
        >
          {this.getFormItem(record, parrentKey, ark)}
        </Card>
      ));
      const add = (
        <div className="text-center" key={`${parrentKey}-${record.key}-addbtn`} style={{ marginBottom: 24 }}>
          <AddBtn attrKey={attrKey} label={record.label} />
        </div>
      );
      rend.push(add);
      return rend;
    }
    return (
      <Card title={record.label} type="inner" style={{ marginBottom: 24 }} bodyStyle={{ paddingBottom: 0 }}>
        {this.getFormItem(record, parrentKey)}
      </Card>
    );
  };

  render() {
    const {
      loading,
      formAttr,
      form: { getFieldDecorator },
    } = this.props;

    return (
      <Form onSubmit={this.handleSubmit}>
        {!isEmpty(this.state.formKeys) && map(formAttr, (attr, index) => this.getRenderForm(attr, '', index))}

        <div className="text-center" style={{ marginTop: 24 }}>
          <Button htmlType="submit" type="primary" className="btn-form" loading={loading}>
            提交
          </Button>
        </div>
      </Form>
    );
  }
}

export default MultiLevelForm;
