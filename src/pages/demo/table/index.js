import React, { PureComponent, Fragment } from 'react';
import Card from '@/components/Card';
import CreateForm from '@/components/CreateForm';
import Table from '@/components/TablePage';
import { Form, Row, Col, Button } from 'antd';

const columns = [{ title: 'Number Id', dataIndex: 'noid' }, { title: 'Name', dataIndex: 'name' }, { title: 'Email', dataIndex: 'email' }];

@Form.create()
class RecordTable extends PureComponent {
  handleSubmit = e => {
    e.preventDefault();
    const { form } = this.props;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const formArr = [
      { key: 'name', type: 'text', label: '名称' },
      { key: 'no', type: 'text', label: '编号' },
      { key: 'email', type: 'email', label: '邮箱' },
    ];

    return (
      <Fragment>
        <Card title="搜索条件" color="yellow" style={{ marginBottom: 24 }}>
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <Row type="flex" gutter={32}>
              {formArr.map(item => (
                <Col sm={24} md={12} lg={8}>
                  <CreateForm key={item.key} name={item.key} type={item.type} label={item.label} getFieldDecorator={getFieldDecorator} />
                </Col>
              ))}
            </Row>
            <div className="text-center">
              <Button type="primary" className="btn-form">
                提交
              </Button>
            </div>
          </Form>
        </Card>

        <Card title="搜索记录">
          <Table ref="tablePage" columns={columns} type="table/records" />
        </Card>
      </Fragment>
    );
  }
}
export default RecordTable;
