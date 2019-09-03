import React, { PureComponent } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import { map } from 'lodash';

const { Option } = Select;

class CustomSelect extends PureComponent {
  static propTypes = {
    dataSource: PropTypes.arrayOf(
      PropTypes.shape({
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
        label: PropTypes.string,
      })
    ),
    onChange: PropTypes.func,
  };

  static defaultProps = {
    dataSource: [],
  };

  constructor(props) {
    super(props);
    this.state = {
      page: 1,
      showArr: props.dataSource,
    };
    this.pageSize = 20;
    this.list = [];
  }

  pageSt = 0;

  handleChange = v => {
    const { onChange, dataSource } = this.props;
    onChange && onChange(v);
    this.setState({ page: 1, showArr: dataSource });
  };

  handlePopupScroll = e => {
    const { page, showArr } = this.state;
    e.persist();
    const { target } = e;
    const st = target.scrollTop;
    if (st === 0 && this.pageSt) {
      target.scrollTop = this.pageSt;
    }
    if (st + target.offsetHeight + 2 >= target.scrollHeight && this.list.length < showArr.length) {
      this.setState({ page: page + 1 });
      this.pageSt = st;
    } else {
      this.pageSt = 0;
    }
  };

  handleFocus = () => {
    const { dataSource } = this.props;
    this.setState({ page: 1, showArr: dataSource });
  };

  handleSearch = v => {
    const { dataSource } = this.props;
    v = v || '';
    const filterWord = v.trim().toLowerCase();
    const showArr = filterWord ? dataSource.filter(item => item.label.toLowerCase().includes(filterWord)) : dataSource;
    this.setState({ page: 1, showArr });
  };

  render() {
    const { dataSource, ...rest } = this.props;
    const { showArr, page } = this.state;
    this.list = showArr.slice(0, this.pageSize * page);
    return (
      <Select
        {...rest}
        onChange={this.handleChange}
        filterOption={false}
        onPopupScroll={this.handlePopupScroll}
        onFocus={this.handleFocus}
        onSearch={this.handleSearch}
      >
        {map(this.list, opt => (
          <Option key={opt.key} value={opt.key}>
            {opt.label || opt.key}
          </Option>
        ))}
      </Select>
    );
  }
}

export default CustomSelect;
