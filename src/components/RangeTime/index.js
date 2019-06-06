import React, { PureComponent } from 'react';
import { TimePicker } from 'antd';
import PropTypes from 'prop-types';

function range(start, end) {
  const result = [];
  for (let i = start; i < end; i++) {
    result.push(i);
  }
  return result;
}
export default class RangeTime extends PureComponent {
  static propTypes = {
    placeholder: PropTypes.array,
    format: PropTypes.string,
  };

  static defaultProps = {
    placeholder: ['Start', 'End'],
    format: 'HH:mm',
  };

  constructor(props) {
    super(props);
    const { value = [] } = props;
    this.state = {
      startValue: value[0],
      endValue: value[1],
      endOpen: false,
    };
  }

  disabledStartDate = () => {
    const { endValue } = this.state;
    return endValue ? range(endValue.hour(), 24) : false;
  };

  disabledEndDate = () => {
    const { startValue } = this.state;
    return startValue ? range(0, startValue.hour()) : false;
  };

  disabledStartMinute = seletehour => {
    const { endValue } = this.state;
    if (endValue && seletehour === endValue.hour()) {
      return range(endValue.minute(), 60);
    }
    return false;
  };

  disabledEndMinute = seletehour => {
    const { startValue } = this.state;
    if (startValue && seletehour === startValue.hour()) {
      return range(0, startValue.minute());
    }
    return false;
  };

  onChange = v => {
    const { onChange } = this.props;
    const obj = {
      ...this.state,
      ...v,
    };
    this.setState(obj);
    onChange && onChange([startValue, endValue]);
  };

  onStartChange = v => {
    this.onChange({ startValue: v });
  };

  onEndChange = v => {
    this.onChange({ endValue: v });
  };

  handleStartOpenChange = open => {
    if (!open) {
      this.setState({ endOpen: true });
    }
  };

  handleEndOpenChange = open => {
    this.setState({ endOpen: open });
  };

  render() {
    const { startValue, endValue, endOpen } = this.state;
    const { placeholder = ['Start', 'End'], ...rest } = this.props;
    return (
      <div style={{ whiteSpace: 'nowrap' }}>
        <TimePicker
          {...rest}
          disabledHours={this.disabledStartDate}
          disabledMinutes={this.disabledStartMinute}
          value={startValue}
          placeholder={placeholder[0]}
          onChange={this.onStartChange}
          onOpenChange={this.handleStartOpenChange}
        />
        <span style={{ display: 'inline-block', margin: '0 8px', color: '#999' }}>to</span>
        <TimePicker
          {...rest}
          disabledHours={this.disabledEndDate}
          disabledMinutes={this.disabledEndMinute}
          value={endValue}
          placeholder={placeholder[1]}
          onChange={this.onEndChange}
          onOpenChange={this.handleEndOpenChange}
          open={endOpen}
        />
      </div>
    );
  }
}
