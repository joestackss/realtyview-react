import React from "react";
import NumberFormat from "react-number-format";

class CurrencyInput extends React.Component {
  state = {
    textValue: null,
  };

  handleTextValue = (event) => {
    this.setState({ textValue: event.target.value });
  };

  handleChange = (onChange) => (valuesObject) => {
    console.log(valuesObject);
    onChange(valuesObject.floatValue);
  };

  render() {
    const { onChange, onBlur, value } = this.props;
    return (
      <NumberFormat
        onValueChange={this.handleChange(onChange)}
        onBlur={onBlur}
        value={value}
        thousandSeparator
        isNumericString
      />
    );
  }
}

export default CurrencyInput;
