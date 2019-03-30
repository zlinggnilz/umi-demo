import React, { PureComponent } from 'react';
import { InputNumber } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';

class CustomInputNumber extends PureComponent {
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
        <InputNumber className={`${styles.fieldInputNumber} ${className || ''}`} {...rest} onChange={this.handleChange} />
        <span className={styles.bar} />
      </span>
    );
  }
}

export default CustomInputNumber;
