import React, { PureComponent } from 'react';
import { Rate, Modal } from 'antd';
import MultiForm from '@/components/MultiForm';

const formAttr = [
  {
    label: '游乐园',
    key: 'park',
    multi: true,
    items: [
      {
        label: '名称',
        key: 'name',
      },
      {
        label: '地点',
        key: 'location',
        required: false, // 其他跟createForm参数一样
      },
      {
        label: '评分',
        key: 'rate',
        custom: true, // 不使用createForm里的组件
        component: <Rate />,
      },
    ],
  },
];

class FormBlank extends PureComponent {
  handleSubmit = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'info/formSubmit1',
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
    const { formLoading1 } = this.props;
    return <MultiForm name="formBlank" key="desc" data={{}} formAttr={formAttr} onSubmit={this.handleSubmit} loading={formLoading1} />;
  }
}

export default FormBlank;
