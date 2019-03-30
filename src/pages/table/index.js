import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Card from '@/components/Card';
import CreateForm from '@/components/CreateForm';
import Table from '@/components/TablePage';
import { Form, Row, Col, Button } from 'antd';

@connect(({ table, loading }) => ({
  records: table.records,
  searchLoading: loading.effects['table/fetchRecords'],
}))
@Form.create()
class RecordTable extends PureComponent {
  tableRef = React.createRef();

  handleSubmit = e => {
    const { form } = this.props;

    e.preventDefault();

    form.validateFields((err, values) => {
      if (err) return;
      console.log('表单数据: ');
      console.table(values);
      this.tableRef.current.getList(1, values);
    });
  };

  render() {
    const { dispatch, form, records, searchLoading } = this.props;
    const { getFieldDecorator } = form;
    const formArr = [
      { key: 'name', label: '名称', required: false },
      { key: 'no', label: '编号', required: true },
      { key: 'email', type: 'email', label: '邮箱', required: false, message: 'Please enter correct email' },
    ];
    const columns = [{ title: 'Number Id', dataIndex: 'noid' }, { title: 'Name', dataIndex: 'name' }, { title: 'Email', dataIndex: 'email' }];

    return (
      <Fragment>
        <Card title="搜索条件" color="yellow" style={{ marginBottom: 24 }}>
          <Form onSubmit={this.handleSubmit} layout="vertical">
            <Row type="flex" gutter={32}>
              {formArr.map(item => (
                <Col sm={24} md={12} lg={8} key={`col${item.key}`}>
                  <CreateForm
                    getFieldDecorator={getFieldDecorator}
                    name={item.key}
                    type={item.type}
                    label={item.label}
                    required={item.required}
                    message={item.message}
                  />
                </Col>
              ))}
            </Row>
            <div className="text-center">
              <Button type="primary" htmlType="submit" className="btn-form" loading={searchLoading}>
                提交
              </Button>
            </div>
          </Form>
        </Card>

        <Card title="搜索记录">
          <Table ref={this.tableRef} loading={searchLoading} columns={columns} dispatch={dispatch} dataSource={records} type="table/fetchRecords" />
        </Card>
      </Fragment>
    );
  }
}

export default RecordTable;
