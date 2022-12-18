/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Terence Co <terence@realtyview.com>
 */

import React from 'react';
import classNames from 'classnames';

import '../../styles/shared/RVLocationPicker.scss';
import RVPicker from './RVPicker';

class RVLocationPicker extends React.Component {
  constructor(props) {
    super(props);
    this.state = { query: props.value, suggestions: []};
    this.menuContainerRef = React.createRef();
  }

  handleQueryChange = query => {
    const { onChange } = this.props;
    this.setState({ query });
    if (onChange) onChange(query);
    // Make debounced http call.
    let suggestions = [];
    if (query.trim()) {
      // Fake results
      const results = [
        {'value': 'New York', 'label': 'New York'},
        {'value': 'Manila', 'label': 'Manila'},
        {'value': 'London', 'label': 'London'},
        {'value': 'Tokyo', 'label': 'Tokyo'},
        {'value': 'Toronto', 'label': 'Toronto'},
      ];
      suggestions = suggestions.concat(results);
      const hasQuery = results.some(e => e.value === query);
      if (!hasQuery) suggestions = suggestions.concat([{'value': query, 'label': `[Custom] ${query}`, 'type': 'custom'}]);
    }
    this.setState({ suggestions });
  }

  handleSelect = (value, item) => {
    const { onChange } = this.props;
    this.setState({ query: value });
    if (onChange) onChange(value);
    // Make debounced http call.
  }

  render() {
    const { className, menuClassName, cleanable, onChange, ...props } = this.props;
    const { query, suggestions } = this.state;
    return (
      <RVPicker
        className={classNames(className, 'rv-location-picker')}
        menuClassName={classNames(menuClassName, 'rv-location-picker-menu')}
        {...props}
        cleanable={false}
        value={query}
        data={suggestions}
        renderValue={(value, item) => item.value}
        onSearch={this.handleQueryChange}
        onSelect={this.handleQueryChange}
      />
    );
  }
}

export default RVLocationPicker;