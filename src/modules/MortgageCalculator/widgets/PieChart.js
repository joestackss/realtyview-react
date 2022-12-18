import React from "react";
import { PieChart, Pie, Tooltip, Cell } from "recharts";
import PropTypes from "prop-types";
import calculator from "../calculator";

class PieChartTotalPayment extends React.Component {
  getData(calculator) {
    const { formProps } = this.props;
    const formValues = formProps.form.getState().values;
    let {
      totalExtraPayment,
      totalInterestWithExtraPayment,
    } = calculator.getTotalExtraPaymentAndInterest(formValues);

    return [
      {
        name: "Down Payment & One-time Expenses",
        value: parseFloat(calculator.totalDownPayment.toFixed(2) || 0),
      },
      {
        name: "Principal",
        value: parseFloat(calculator.principalPayment.toFixed(2) || 0),
      },
      {
        name: "Extra Payments",
        value: parseFloat(totalExtraPayment.toFixed(2) || 0),
      },
      {
        name: "Interests",
        value: parseFloat(totalInterestWithExtraPayment.toFixed(2) || 0),
      },
      {
        name: "Taxes, PMI, Insurance & Fees",
        value: parseFloat(
          calculator.totalTaxesPMIInsuranceFeePayment.toFixed(2) || 0
        ),
      },
    ];
  }

  render() {
    const data = this.getData(calculator);
    const COLORS = ["#fa5c7c", "#08cf97", "#727cf5", "#ffbc00", "#38afd1"];

    return (
      <PieChart width={389} height={286} onMouseEnter={this.onPieEnter}>
        <Pie
          data={data}
          dataKey="value"
          cx={194.5}
          cy={143}
          innerRadius={80}
          outerRadius={110}
          fill="#8884d8"
        >
          {data.map((entry, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    );
  }
}

PieChartTotalPayment.propTypes = {
  formProps: PropTypes.object.isRequired,
};

export default PieChartTotalPayment;
