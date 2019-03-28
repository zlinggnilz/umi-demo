import React, { PureComponent } from 'react';
import { Select } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';

const { Option } = Select;

class CustomSelect extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    style: PropTypes.object,
  };

  handleChange = v => {
    const { onChange } = this.props;
    onChange && onChange(v);
  };

  render() {
    const { className, children, style, ...rest } = this.props;
    return (
      <span className={styles.fieldWrap} style={style}>
        <Select className={`${styles.fieldSelect} ${className || ''}`} {...rest} onChange={this.handleChange}>
          {children}
        </Select>
        <span className={styles.bar} />
      </span>
    );
  }
}

CustomSelect.Option = Option;

export default CustomSelect;
