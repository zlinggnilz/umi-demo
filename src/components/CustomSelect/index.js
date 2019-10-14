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
      open: false,
    };
    this.pageSize = 20;
    this.list = [];
  }

  pageSt = 0;

  handlePopupScroll = e => {
    const { page, showArr } = this.state;
    e.persist();
    const { target } = e;
    const st = target.scrollTop;
    if (st === 0 && this.pageSt) {
      target.scrollTop = this.pageSt;
    }
    if (st + target.offsetHeight + 1 >= target.scrollHeight && this.list.length < showArr.length) {
      this.setState({ page: page + 1 });
      this.pageSt = st;
    } else {
      this.pageSt = 0;
    }
  };

  handleSearch = v => {
    const { dataSource } = this.props;
    const filterWord = (v || '').trim().toLowerCase();
    const showArr = filterWord ? dataSource.filter(item => item.label.toLowerCase().includes(filterWord)) : dataSource;
    this.setState({ page: 1, showArr });
  };

  onDropdownVisibleChange = open => {
    const { dataSource } = this.props;

    this.setState({ open });

    if (open) {
      this.setState({ page: 1, showArr: dataSource });
    }
  };

  render() {
    const { className, style, name, parentkey, dataSource, ...rest } = this.props;
    const { showArr, page, open } = this.state;
    if (showArr.length > this.pageSize) {
      this.list = showArr.slice(0, this.pageSize * page);
      if (this.props.value) {
        let valueObj = this.list.find(item => item.key === this.props.value);
        if (!valueObj) {
          valueObj = dataSource.find(item => item.key === this.props.value);
          valueObj && this.list.unshift(valueObj);
        }
      }
    } else {
      this.list = showArr;
    }
    return (
      <Select
        {...rest}
        filterOption={false}
        onPopupScroll={this.handlePopupScroll}
        onSearch={this.handleSearch}
        onDropdownVisibleChange={this.onDropdownVisibleChange}
        open={open}
      >
        {map(this.list, opt => (
          <Option key={`${opt.key}-${opt.label}`} value={opt.key} disabled={!!opt.disabled}>
            {`${opt.label || opt.key}`}
          </Option>
        ))}
      </Select>
    );
  }
}

export default CustomSelect;
