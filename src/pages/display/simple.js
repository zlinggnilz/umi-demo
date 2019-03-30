import React, { PureComponent } from 'react';
import { connect } from 'dva';
import Card from '@/components/Card';
import DescriptionList from '@/lib/DescriptionList';
import { isEmpty, map } from 'lodash';

const { Description } = DescriptionList;

@connect(({ info, loading }) => ({
  accountInfo: info.info,
  accountLoading: loading.effects['info/fetchInfo'],
}))
class Account extends PureComponent {
  componentDidMount() {
    const { dispatch, accountInfo } = this.props;
    if (isEmpty(accountInfo)) {
      dispatch({
        type: 'info/fetchInfo',
      });
    }
  }

  render() {
    const { accountLoading, accountInfo } = this.props;

    return (
      <Card title="账户信息" loading={accountLoading}>
        <DescriptionList col={3}>
          {map(Object.entries(accountInfo), item => (
            <Description term={item[0]} key={item[0]}>
              {item[1]}
            </Description>
          ))}
        </DescriptionList>
      </Card>
    );
  }
}

export default Account;
