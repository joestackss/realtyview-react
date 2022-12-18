import React from "react";
import { Panel } from "rsuite";
import PropTypes from "prop-types";
import calculator from "../calculator";
import NumberFormat from "react-number-format";
import { PAYMENT_FREQUENCY } from "../constants";
import "../../../styles/MortgageCalculator.scss";
import withStyles from "react-jss";

const styles = {
  panelStyle: {
    "border-radius": 5,
    "box-shadow": "0 0 8px 7px rgba(114, 124, 245, 0.03)",
  },
};

class MortgageResult extends React.Component {
  render() {
    const { formProps, classes } = this.props;
    const formValues = formProps.form.getState().values;
    return (
      <React.Fragment>
        {formValues.paymentFrequency === PAYMENT_FREQUENCY.MONTHLY && (
          <Panel bordered className={classes.panelStyle} bordered>
            <div className="mortList">
              <div className="mortTitle">Monthly Principal & Interest</div>
              <div className="mortPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(
                    calculator.getMonthlyPrincipalInterest(formValues) || 0
                  ).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
            <hr />
            <div className="mortList">
              <div className="mortTitle">
                Monthly Exrtra Payment
                {calculator.getExtraPaymentStartDate(formValues)}
              </div>
              <div className="mortPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(
                    formValues.extraPaymentMonthlyAmount || 0
                  ).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
            <hr />
            <div className="mortList">
              <div className="mortTitle">Property Taxes</div>
              <div className="mortPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(
                    calculator.getMontlyPropertyTaxes_Yr(formValues) || 0
                  ).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
            <hr />
            <div className="mortList">
              <div className="mortTitle">Homeowener's Insurance</div>
              <div className="mortPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(
                    calculator.getMontlyHomeInsurance_Yr(formValues) || 0
                  ).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
            <hr />
            <div className="mortList">
              <div className="mortTitle">
                PMI {calculator.getPMIEndDate(formValues)}
              </div>
              <div className="mortPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(
                    calculator.getMontlyPMI_Yr(formValues) || 0
                  ).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
            <hr />
            <div className="mortList">
              <div className="mortTitle">HOA Fees</div>
              <div className="mortPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(formValues.hoaFees_Mo || 0).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
            <hr />
            <div className="mortList">
              <div className="mortTotal">Total Monthly Payment</div>
              <div className="mortTotalPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(
                    calculator.getTotalMontlyPayment(formValues) || 0
                  ).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
          </Panel>
        )}
        {formValues.paymentFrequency === PAYMENT_FREQUENCY.BIWEEKLY && (
          <Panel bordered className={classes.panelStyle}>
            <div className="mortList">
              <div className="mortTitle">Bi-weekly Principal & Interest</div>
              <div className="mortPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(
                    calculator.getBiWeeklyPrincipalInterest(formValues) || 0
                  ).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
            <hr />
            <div className="mortList">
              <div className="mortTitle">
                Bi-weekly Exrtra Payment
                {calculator.getExtraPaymentStartDate(formValues)}
              </div>
              <div className="mortPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(
                    formValues.extraPaymentMonthlyAmount || 0
                  ).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
            <hr />
            <div className="mortList">
              <div className="mortTitle">Property Taxes</div>
              <div className="mortPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(
                    calculator.getBiWeeklyPropertyTaxes_Yr(formValues) || 0
                  ).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
            <hr />
            <div className="mortList">
              <div className="mortTitle">Homeowener's Insurance</div>
              <div className="mortPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(
                    calculator.getBiWeeklyHomeInsurance_Yr(formValues) || 0
                  ).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
            <hr />
            <div className="mortList">
              <div className="mortTitle">
                PMI {calculator.getPMIEndDate(formValues)}
              </div>
              <div className="mortPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(
                    calculator.getBiWeeklyPMI_Yr(formValues) || 0
                  ).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
            <hr />
            <div className="mortList">
              <div className="mortTitle">HOA Fees</div>
              <div className="mortPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(
                    calculator.getBiWeeklyHOAFeesMo(formValues) || 0
                  ).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
            <hr />
            <div className="mortList">
              <div className="mortTotal">Total Bi-weekly Payment</div>
              <div className="mortTotalPrice">
                <NumberFormat
                  displayType="text"
                  value={parseFloat(
                    calculator.getTotalBiWeeklyPayment(formValues) || 0
                  ).toFixed(2)}
                  prefix="$"
                  thousandSeparator
                />
              </div>
            </div>
          </Panel>
        )}
      </React.Fragment>
    );
  }
}

MortgageResult.propTypes = {
  formProps: PropTypes.object.isRequired,
};

export default withStyles(styles)(MortgageResult);
