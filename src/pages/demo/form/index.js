import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Card from '@/components/Card';
import { Form, Button, Row, Col } from 'antd';
import CreateForm from '@/components/CreateForm';
import MultiForm from '@/components/MultiForm';

const formAttr = [
  {
    label: '国家',
    key: 'contry',
    multi: true,
    items: [{ label: '国家名称', key: 'name' }, { label: '面积', key: 'area' }],
    children: {
      label: '省份',
      key: 'province',
      multi: true,
      items: [{ label: '省份名称', key: 'name' }, { label: '人口', key: 'people' }],
      children: {
        label: '城市',
        key: 'city',
        multi: true,
        items: [{ label: '城市名称', key: 'name' }, { label: '邮编', key: 'zip' }],
      },
    },
  },
];

const data = {};

@connect(({ multiform }) => ({
  formKeys: multiform,
}))
@Form.create()
class form extends PureComponent {
  handleSubmit = data => {
    console.log(data);
  };

  render() {
    return <MultiForm name="custom" key="desc" data={data} formAttr={formAttr} onSubmit={this.handleSubmit} />;
  }
}

export default form;
