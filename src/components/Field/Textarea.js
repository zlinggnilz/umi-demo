import React, { PureComponent } from 'react';
import { Input } from 'antd';
import PropTypes from 'prop-types';
import styles from './index.less';

const { TextArea } = Input;

class CustomTextarea extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
  };

  handleChange = v => {
    const { onChange } = this.props;
    onChange && onChange(v);
  };

  render() {
    const { className, ...rest } = this.props;
    return (
      <span className={styles.fieldWrap}>
        <TextArea className={`${styles.field} ${className || ''}`} {...rest} onChange={this.handleChange} />
        <span className={styles.bar} />
      </span>
    );
  }
}

export default CustomTextarea;
