import React, { PureComponent, Fragment } from 'react';
import { connect } from 'dva';
import Card from '@/components/Card';
import FormBlank from './common/FormBlank';
import FormValue from './common/FormValue';

@connect(({ loading }) => ({
  formLoading1: loading.effects['info/formSubmit1'],
  formLoading2: loading.effects['info/formSubmit2'],
}))
class MultiFormPage extends PureComponent {
  handleSubmit = data => {
    console.log(data);
  };

  render() {
    return (
      <Fragment>
        <Card title="表单 - 无值" style={{ marginBottom: 24 }}>
          <FormBlank {...this.props} />
        </Card>
        <Card title="表单 - 有值">
          <FormValue {...this.props} />
        </Card>
      </Fragment>
    );
  }
}
export default MultiFormPage;
