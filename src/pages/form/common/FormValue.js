/* eslint-disable */
import React, { PureComponent } from 'react';
import { Modal } from 'antd';
import MultiForm from '@/components/MultiForm';

const formAttr = [
  {
    label: '国家',
    key: 'country',
    multi: true,
    max: 3,
    items: [{ label: '国家名称', key: 'name' }, { label: '面积', key: 'area', required: false }],
    children: [
      {
        label: '省份',
        key: 'province',
        multi: true,
        items: [{ label: '省份名称', key: 'name' }, { label: '人口', key: 'people' }],
        children: [
          {
            label: '城市',
            key: 'city',
            multi: true,
            items: [{ label: '城市名称', key: 'name' }, { label: '邮编', key: 'zip' }],
          },
        ],
      },
    ],
  },
  {
    label: '海洋',
    key: 'ocean',
    multi: true,
    max: 3,
    items: [{ label: '海洋名称', key: 'name' }, { label: '面积', key: 'area', required: false }],
    children: [
      {
        label: '岛屿',
        key: 'island',
        // multi: true,
        items: [{ label: '岛屿名称', key: 'name' }, { label: '面积', key: 'area' }],
      },
    ],
  },
];

const formData = {
  country: [
    {
      name: 'country 1',
      area: 1111,
      province: [{ name: '省1', people: 11111, city: [{ name: '城市1001', zip: 'zip1001' }] }],
    },
    {
      name: 'country 2',
      area: 2222,
      province: [{ name: '省2', people: 22222, city: [{ name: '城市2001', zip: 'zip2001' }, { name: '城市2002', zip: 'zip2002' }] }],
    },
  ],
};

class FormValue extends PureComponent {
  handleSubmit = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'info/formSubmit2',
      payload: data,
    })
      .then(() => {
        Modal.info({
          title: '提交内容',
          content: (
            <div style={{ maxHeight: 350, overflow: 'auto' }}>
              <pre>{JSON.stringify(data, null, 2)}</pre>
            </div>
          ),
        });
      })
      .catch(console.log);
  };

  render() {
    const { formLoading2 } = this.props;

    return <MultiForm key="desc" data={formData} formAttr={formAttr} onSubmit={this.handleSubmit} loading={formLoading2} />;
  }
}

export default FormValue;
