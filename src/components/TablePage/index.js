import React, { PureComponent } from 'react';
import { Table } from 'antd';
import PropTypes from 'prop-types';

export default class TablePage extends PureComponent {
  static propTypes = {
    dispatch: PropTypes.func.isRequired, // dispatch
    type: PropTypes.string.isRequired, // dispatch的type
    rowKey: PropTypes.any, // table row的key值，默认id
    pagination: PropTypes.any, // 页码的属性设置
    page: PropTypes.number, // 第几页，从1开始
    pageSize: PropTypes.number, // 每页条目数，默认10
    total: PropTypes.number, // 条目总数
  };

  static defaultProps = {
    page: 1,
    total: 0,
    pageSize: 10,
    pagination: {},
    rowKey: 'id',
  };

  constructor(props) {
    super(props);
    this.state = {
      page: props.page,
      total: props.total,
      size: props.pageSize,
    };
    this.payload = {};
  }

  //   componentDidMount() {
  //     this.getList();
  //   }

  componentWillUnmount() {
    this.setState = (state, callback) => {};
  }

  getList = (p = 1, payload = {}) => {
    if (typeof p !== 'number') {
      console.error('页码不是数字');
      return;
    }
    const page = p < 1 ? 1 : p;
    const { dispatch, type } = this.props;
    const { size } = this.state;
    if (!type) return;
    this.payload = payload;
    this.setState({ page });
    dispatch({
      type,
      payload: { page: page - 1, size, ...payload },
    })
      .then(total => {
        this.setState({
          total,
        });
      })
      .catch(err => {
        console.log('request error');
        console.log(err);
      });
  };

  reloadPage = v => {
    const { page } = this.state;
    this.getList(page + v, this.payload);
  };

  handleChange(pagination) {
    this.getList(pagination.current, this.payload);
  }

  render() {
    const { size, total, page, pagination } = this.state;
    const { rowKey } = this.props;
    return (
      <Table
        {...this.props}
        rowKey={rowKey}
        pagination={{
          current: page,
          defaultPageSize: size,
          total,
          ...pagination,
        }}
        onChange={(pg, filters, sorter) => {
          this.handleChange(pg, filters, sorter);
        }}
      />
    );
  }
}
