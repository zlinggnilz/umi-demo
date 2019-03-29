import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Card from '@/components/Card';
import { Form, Button, Row, Col } from 'antd';
import CreateForm from '@/components/CreateForm';
import { get, map } from 'lodash';
import PropTypes from 'prop-types';

let keyObj = {};

@connect(({ multiform }) => ({
  formKeys: multiform,
}))
@Form.create()
class MultiLevelForm extends PureComponent {
  static propTypes = {
    data: PropTypes.any,
    dispatch: PropTypes.any,
    form: PropTypes.any,
    formAttr: PropTypes.any,
    formKeys: PropTypes.any,
    name: PropTypes.string,
  };

  static defaultProps = {
    name: 'multiform',
  };

  componentDidMount() {
    this.handleAttr();
  }

  componentWillUnmount() {
    const { dispatch, name } = this.props;
    // 删除设置的formkey
    dispatch({
      type: 'multiform/delKey',
      payload: name,
    });
  }

  handleAttr(type = 'setKey') {
    const { name, form, formAttr, data, dispatch } = this.props;

    const obj = {};

    const getForm = (record, parrentKey = '', index) => {
      if (!record) return;
      if (record.multi) {
        const attrKey = `${name}-${parrentKey}-${record.key}-multiFormKey`;
        const recordData = get(data, `${parrentKey}[${record.key}]`, []);
        let recordKeyArr = [0];
        keyObj[attrKey] = recordData.length;
        for (let i = 1; i < recordData.length; i++) {
          recordKeyArr.push(i);
        }
        obj[attrKey] = recordKeyArr;
        recordKeyArr.forEach(ark => {
          record.children && getForm(record.children, `${parrentKey}[${record.key}][${ark}]`);
        });
      } else {
        record.children && getForm(record.children, `${parrentKey}[${record.key}]`);
      }
    };

    formAttr.forEach((attr, index) => getForm(attr, '', index));

    dispatch({
      type: 'multiform/setKey',
      payload: obj,
    });
  }

  handleSubmit = e => {
    const { form, onSubmit } = this.props;

    e.preventDefault();

    form.validateFields((err, values) => {
      if (err) return;
      onSubmit && onSubmit(values);
    });
  };

  addItem = itemKey => {
    const { formKeys, dispatch, name } = this.props;
    const keys = formKeys[itemKey];
    const nextKeys = keys.concat(++keyObj[itemKey]);

    dispatch({
      type: 'multiform/setKey',
      payload: { [itemKey]: nextKeys },
    });
  };

  removeItem = (itemKey, value) => {
    const { formKeys, dispatch } = this.props;

    const keys = formKeys[itemKey];
    if (keys.length === 1) {
      return;
    }

    dispatch({
      type: 'multiform/setKey',
      payload: { [itemKey]: keys.filter(key => key !== value) },
    });
  };

  setItemKey = obj => {
    const { dispatch } = this.props;
    dispatch({
      type: 'multiform/setKey',
      payload: obj,
    });
  };

  getItemKeyValue = itemKey => {
    const { formKeys } = this.props;
    if (itemKey in keyObj) {
      const v = formKeys[itemKey];
      return v;
    } else {
      keyObj[itemKey] = 0;
      this.setItemKey({
        [itemKey]: [0],
      });
      return [0];
    }
  };

  renderForm() {
    const { name, form, formAttr, data } = this.props;
    const { getFieldDecorator } = form;
    const DelBtn = ({ itemKey, value }) => (
      <a
        onClick={e => {
          this.removeItem(itemKey, value);
        }}
      >
        删除
      </a>
    );
    const AddBtn = ({ attrKey, label }) => (
      <Button
        type="primary"
        ghost
        onClick={e => {
          this.addItem(attrKey);
        }}
        className="btn-form"
      >
        添加{label}
      </Button>
    );
    const getItem = (record, parrentKey = '', ark = null) => {
      const itemKey = `${parrentKey}[${record.key}]${ark !== null ? `[${ark}]` : ''}`;
      return (
        <Fragment>
          <Row type="flex" gutter={32}>
            {record['items'].map(item => {
              const { label, key, valueFunc, ...rest } = item;
              const k = `${itemKey}[${key}]`;
              const v = get(data, k);
              const defaultValue = v !== undefined ? valueFunc(v) : v;
              return (
                <Col sm={24} md={12} lg={8} key={`col-${k}`}>
                  item key : {k}
                  <CreateForm getFieldDecorator={getFieldDecorator} name={k} label={label} {...rest} defaultValue={defaultValue} />
                </Col>
              );
            })}
          </Row>
          {getForm(record.children, itemKey)}
        </Fragment>
      );
    };
    const getForm = (record, parrentKey = '', index) => {
      if (!record) return null;
      if (record.multi) {
        const attrKey = `${name}-${parrentKey}-${record.key}-multiFormKey`;
        const attrKeyArr = this.getItemKeyValue(attrKey);
        const rend = map(attrKeyArr, ark => {
          return (
            <Card
              title={record.label}
              type="inner"
              style={{ marginBottom: 24 }}
              extra={attrKeyArr.length > 1 ? <DelBtn itemKey={attrKey} value={ark} /> : null}
              key={`${parrentKey}${ark}-${record.key}`}
            >
              {getItem(record, parrentKey, ark)}
            </Card>
          );
        });
        const add = (
          <div className="text-center" key={`${parrentKey}-${record.key}-addbtn`}>
            <AddBtn attrKey={attrKey} label={record.label} />
          </div>
        );
        rend.push(add);
        return rend;
      } else {
        return (
          <Card title={record.label} type="inner" style={{ marginBottom: 24 }}>
            {getItem(record, parrentKey)}
          </Card>
        );
      }
    };

    return map(formAttr, (attr, index) => getForm(attr, '', index));
  }

  render() {
    return (
      <Form onSubmit={this.handleSubmit}>
        {this.renderForm()}

        <div className="text-center" style={{ marginTop: 24 }}>
          <Button htmlType="submit" type="primary" className="btn-form">
            提交
          </Button>
        </div>
      </Form>
    );
  }
}

export default MultiLevelForm;
