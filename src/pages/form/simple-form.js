import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import { Rate, Modal } from 'antd';
import Card from '@/components/Card';
import CommonForm from '@/components/CommonForm';

@connect(({ loading }) => ({
  formLoading1: loading.effects['info/formSubmit1'],
  formLoading2: loading.effects['info/formSubmit2'],
}))
class FormPage extends PureComponent {
  handleSubmit1 = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'info/formSubmit1',
      payload: data,
    })
      .then(() => {
        this.showInfo(data);
      })
      .catch(console.log);
  };

  handleSubmit2 = data => {
    const { dispatch } = this.props;
    dispatch({
      type: 'info/formSubmit2',
      payload: data,
    })
      .then(() => {
        this.showInfo(data);
      })
      .catch(console.log);
  };

  showInfo = data => {
    Modal.info({
      title: '提交内容',
      content: <pre>{JSON.stringify(data, null, 2)}</pre>,
    });
  };

  render() {
    const { formLoading1, formLoading2 } = this.props;

    const formAttr = [
      {
        label: '名称',
        key: 'name',
      },
      {
        label: '年龄',
        key: 'age',
        type: 'int',
        required: false,
      },
      {
        label: '学校',
        key: 'school',
      },
      {
        label: '专业',
        key: 'major',
        required: false,
        defaultValue: '专业001',
      },
      {
        label: '毕业',
        key: 'graduate',
        defaultValue: '2017',
      },
      {
        label: '评分',
        key: 'rate',
        custom: true, // 不使用createForm里的组件
        component: <Rate />,
      },
    ];

    const data = { name: 'test', school: '学校1', major: '哈哈' };

    return (
      <Fragment>
        <Card title="普通表单" style={{ marginBottom: 24 }}>
          <CommonForm formAttr={formAttr} data={{}} onSubmit={this.handleSubmit1} loading={formLoading1} />
        </Card>
        <Card title="普通表单">
          <CommonForm formAttr={formAttr} data={data} onSubmit={this.handleSubmit2} loading={formLoading2} />
        </Card>
      </Fragment>
    );
  }
}

export default FormPage;
