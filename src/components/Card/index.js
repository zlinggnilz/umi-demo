import React, { PureComponent } from 'react';
import { Card } from 'antd';
import PropTypes from 'prop-types';
import styles from './card.less';

export default class CustomCard extends PureComponent {
  static propTypes = {
    className: PropTypes.string,
    color: PropTypes.oneOf(['blue', 'yellow']),
    type: PropTypes.string,
  };

  static defaultProps = {
    color: 'blue',
    className: '',
    type: '',
  };

  render() {
    const { children, className, color, type, ...rest } = this.props;
    const colorType = type === 'inner' ? '' : color;
    return (
      <Card className={`${colorType ? 'card-' + colorType : ''} ${className}`} type={type} {...rest}>
        {children}
      </Card>
    );
  }
}
