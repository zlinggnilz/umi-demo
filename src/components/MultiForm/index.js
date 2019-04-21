import React, { PureComponent, Fragment } from 'react';
import Card from '@/components/Card';
import { Form, Button, Row, Col, Icon, Modal } from 'antd';
import CreateForm from '@/components/CreateForm';
import { get, map, set, isEmpty } from 'lodash';
import PropTypes from 'prop-types';
import { formTrim } from '@/components/_utils/form';

const keyObj = {};

@Form.create()
class MultiLevelForm extends PureComponent {
  static propTypes = {
    data: PropTypes.object,
    formAttr: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.string.isRequired,
        label: PropTypes.any,
        dataSource: PropTypes.oneOfType([PropTypes.func, PropTypes.array]),
        defaultValue: PropTypes.oneOfType([PropTypes.func, PropTypes.any]),
        max: PropTypes.number,
        col: PropTypes.object,
        style: PropTypes.object,
        shouldRender: PropTypes.bool,
      })
    ),
    loading: PropTypes.bool,
    onSubmit: PropTypes.func,
    cancelAction: PropTypes.element,
    submitAction: PropTypes.element,
    submitText: PropTypes.string,
    hotelDetail: PropTypes.object,
  };

  static defaultProps = {
    data: {},
    formAttr: [],
    submitText: 'SAVE',
  };

  constructor(props) {
    super(props);

    this.state = {
      formKeys: this.handleAttr('setKey', props.data),
    };
  }

  formKeys = {};

  formItemKeys = [];

  formItemKeysObj = {};

  handleSubmit = e => {
    const { form, onSubmit } = this.props;

    e.preventDefault();
    const arr = isEmpty(this.formItemKeysObj) ? this.formItemKeys : this.formItemKeys.filter(k => this.getFormItemShow(k));

    form.validateFieldsAndScroll(arr, { scroll: { offsetTop: 100 } }, (err, values) => {
      console.log('old', values);
      if (err) return;
      let newVales = this.handleAttr('setValues', values);
      console.log('new', newVales);
      newVales = formTrim(newVales);
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

    const handleAttrForm = (record, parentkey = '') => {
      if (!record) return;
      if (record.multi) {
        const attrKey = `formKey-${parentkey}-${record.key}-multiFormKey`;
        const recordData = get(data, `${parentkey}[${record.key}]`, []) || [];
        let recordKeyArr;
        if (type === 'setKey') {
          recordKeyArr = [0];
          for (let i = 1; i < recordData.length; i++) {
            recordKeyArr.push(i);
          }
          keyObj[attrKey] = recordKeyArr.length - 1;
          obj[attrKey] = recordKeyArr;
        } else {
          recordKeyArr = this.getItemKeyValue(attrKey);

          const recordVals = get(data, `${parentkey}[${record.key}]`, []) || [];
          if (recordVals.length > 1) {
            set(data, `${parentkey}[${record.key}]`, recordVals.filter(item => item));
          }
        }
        recordKeyArr.forEach(ark => {
          record.children && handleChildrenAttr(record.children, `${parentkey}[${record.key}][${ark}]`, handleAttrForm);
        });
      } else {
        record.children && handleChildrenAttr(record.children, `${parentkey}[${record.key}]`, handleAttrForm);
      }
    };

    formAttr.forEach(attr => handleAttrForm(attr, ''));
    if (type === 'setKey') {
      this.formKeys = obj;
      // this.setItemKey(obj);
      return obj;
    }
    return data;
  }

  addItem(itemKey) {
    const keys = this.formKeys[itemKey];
    const nextKeys = keys.concat(++keyObj[itemKey]);

    this.setItemKey({ [itemKey]: nextKeys });
  }

  removeItem(itemKey, value) {
    const keys = this.formKeys[itemKey];
    if (!keys.length) {
      return;
    }

    Modal.confirm({
      title: `Are you sure you want to delete "this module"?`,
      onOk: () => {
        this.setItemKey({ [itemKey]: keys.filter(key => key !== value) });
      },
      onCancel: () => {
        console.log('Cancel');
      },
    });
  }

  setItemKey(obj) {
    this.formKeys = { ...this.formKeys, ...obj };
    this.setState({
      formKeys: this.formKeys,
    });
  }

  getItemKeyValue(itemKey) {
    if (itemKey in keyObj) {
      const v = this.formKeys[itemKey];
      return v;
    }
    keyObj[itemKey] = 0;
    this.formKeys[itemKey] = [0];
    return [0];
  }

  getFormItem(record, parentkey = '', ark = null) {
    const { form, data } = this.props;
    const { getFieldDecorator } = form;
    const recordkey = `${parentkey}[${record.key}]${ark !== null ? `[${ark}]` : ''}`;
    const getItem = item => {
      const { label, key = '', defaultValue, col = { xs: 24, sm: 12, md: 8 }, dataSource = [], style, shouldRender, ...rest } = item;

      const getItemKey = typeof key === 'function' ? key(recordkey) : key;

      const itemkey = record.items ? `${recordkey}[${getItemKey.trim()}]` : recordkey;
      const v = get(data, itemkey);
      const dv =
        typeof defaultValue === 'function' ? defaultValue(v, get(data, recordkey), recordkey) : v !== undefined && v !== null ? v : defaultValue;
      const dataSourceArr = typeof dataSource === 'function' ? dataSource(itemkey, recordkey) : dataSource;

      this.formItemKeys.push(itemkey);
      if (shouldRender !== undefined) {
        this.setFormItemShow({
          [itemkey]: typeof shouldRender === 'function' ? shouldRender(itemkey, recordkey) : shouldRender,
        });
      }
      if (!this.getFormItemShow(itemkey)) {
        return null;
      }
      return (
        <Col {...col} key={`col-${itemkey}`} style={style}>
          {/* item key : {itemkey} */}
          <CreateForm
            getFieldDecorator={getFieldDecorator}
            name={itemkey}
            parentkey={recordkey}
            label={label}
            dataSource={dataSourceArr}
            {...rest}
            defaultValue={dv}
          />
        </Col>
      );
    };
    const getRenderChildren = rec =>
      rec.children && (
        <Row type="flex" gutter={32}>
          {map(rec.children, item => this.getRenderForm(item, recordkey))}
        </Row>
      );
    if (record.items) {
      return (
        <Fragment key={`${recordkey}-row`}>
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
      <Fragment key={`${recordkey}-row`}>
        {getItem(record)}
        {getRenderChildren(record)}
      </Fragment>
    );
  }

  getDelBtn({ itemKey, value }) {
    return (
      <a
        onClick={() => {
          this.removeItem(itemKey, value);
        }}
      >
        <Icon type="delete" />
        Delete
      </a>
    );
  }

  getAddBtn({ attrKey, label }) {
    return (
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
  }

  getRenderForm(record, parentkey = '') {
    if (!record) return null;
    if (record.multi) {
      const attrKey = `formKey-${parentkey}-${record.key}-multiFormKey`;
      const attrKeyArr = this.getItemKeyValue(attrKey);
      const rend = map(attrKeyArr, (ark, index) => (
        <Col span={24} key={`${parentkey}${ark}-${record.key}`}>
          <Card
            title={`${record.label} ${index + 1}`}
            type="inner"
            style={{ marginBottom: 24 }}
            extra={this.getDelBtn({ itemKey: attrKey, value: ark })}
            bodyStyle={{ paddingBottom: 0 }}
          >
            {this.getFormItem(record, parentkey, ark)}
          </Card>
        </Col>
      ));
      const add = (
        <Col span={24} key={`${parentkey}-${record.key}-addbtn`}>
          <div className="text-center" style={{ marginBottom: 24 }}>
            {this.getAddBtn({ attrKey, label: record.label })}
          </div>
        </Col>
      );
      if (record.max && !(attrKeyArr.length < record.max)) {
        return rend;
      }
      rend.push(add);
      return rend;
    }
    if (record.items) {
      return (
        <Col span={24} key={`${parentkey}-${record.key}-card`}>
          <Card title={record.label} type="inner" style={{ marginBottom: 24 }} bodyStyle={{ paddingBottom: 0 }}>
            {this.getFormItem(record, parentkey)}
          </Card>
        </Col>
      );
    }
    if (record.children) {
      return this.getFormItem(record, parentkey);
    }
    return this.getFormItem(record, parentkey);
  }

  setFieldsValue = values => {
    this.props.form.setFieldsValue(values);
  };

  getFieldsValue = f => this.props.form.getFieldsValue(f);

  getFieldValue = s => s && this.props.form.getFieldValue(s);

  getFormKeys = () => this.formItemKeys;

  setFormItemShow = v => {
    this.formItemKeysObj = { ...this.formItemKeysObj, ...v };
  };

  getFormItemShow = key => {
    if (key in this.formItemKeysObj) {
      return this.formItemKeysObj[key];
    }
    return true;
  };

  render() {
    const { loading, formAttr, submitAction, cancelAction, submitText } = this.props;
    this.formItemKeys = [];
    const formSubmitAction =
      'submitAction' in this.props ? (
        submitAction
      ) : (
        <Button htmlType="submit" type="primary" className="btn-form" loading={loading}>
          {submitText}
        </Button>
      );
    return (
      <Form onSubmit={this.handleSubmit}>
        <Row type="flex" gutter={32}>
          {!isEmpty(this.state.formKeys)
            ? map(formAttr, (attr, index) => this.getRenderForm(attr, '', index))
            : 'Please confirm the form is Multi Level Form'}
        </Row>
        <div className="text-center form-action" style={{ marginTop: 24 }}>
          {formSubmitAction}
          {cancelAction}
        </div>
      </Form>
    );
  }
}

export default MultiLevelForm;
