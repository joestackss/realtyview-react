/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Kevin de Guzman <kevin@realtyview.com>
 */

import React from "react";
import { 
  Col, 
  Row, 
  Grid, 
  Button, 
  FlexboxGrid
} from "rsuite";
import { Form, FormSpy, Field } from "react-final-form";
import FlexboxGridItem from "rsuite/lib/FlexboxGrid/FlexboxGridItem";
import withStyles from "react-jss";
// Components
import calculator from "./calculator";
import mortgageDecorator from "./decorator";
import ExtraPayment from "./widgets/ExtraPayment";
import MortgageDetails from "./widgets/MortgageDetails";
import HomeownersExpenses from "./widgets/HomeownersExpenses";
import MortgageResult from "./widgets/MortgageResult";
import TotalPayments from "./widgets/TotalPayments";
import { PAYMENT_FREQUENCY } from "./constants";

import RVButton from "../../components/shared/RVButton";

const styles = {
  mortCalContainer: {
    display: "flex",
    "flex-direction": "row",
  },

  withSpacing: {
    marginTop: 15,
    marginBottom: 15,
    "padding-left": 10,
    "padding-right": 10,
  },

  row1Height: {
    display: "flex",
    alignItems: "center",
  },

  actionControls: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
  },

  importField: {
    flexShrink: 1,
    display: "flex",
    alignItems: "center",
  },

  actionButtons: {
    flexShrink: 0,
    display: "flex",
    justifyContent: "flex-end",
  },

  actionButton: {
    marginLeft: 5,
  },

  redButton: {
    backgroundColor: "#fa5c7c",
    color: "white",
  },

  row1Col1Style: {
    "padding-left": 15,
  },

  row1Col2Style: {
    height: 62,
    paddingTop: 10,
    paddingBottom: 10,
    "padding-left": 10,
    "padding-right": 15
  },

  mortgageCalculator: {
    width: 165,
    height: 15,
    "font-size": 18,
    "font-weight": "bold",
    "font-stretch": "normal",
    "font-style": "normal",
    "line-height": 0.83,
    "letter-spacing": -0.3,
    color: "#59626a",
  },

  inputListingData: {
    maxWidth: "262px",
    height: 37,
    borderRadius: 5,
    borderWidth: 1,
    border: "solid 1px #d6dbe0",
    paddingLeft: 10,
    marginRight: 5,
    flex: 1
  },
};

class MortgageCalculator extends React.Component {
  state = {
    isExtraPayment: false,
  };

  handleSubmit(formValues) {
    const schedules = calculator.getSchedules(formValues);
    console.log(formValues);
    console.log(`Payment Schedule Deadlines: `, schedules);
  }

  handleShowExtraPayment = () => {
    this.setState((prev) => ({ isExtraPayment: !prev.isExtraPayment }));
  };

  renderForm = (formProps) => {
    const { classes } = this.props;
    const { isExtraPayment } = this.state;
    return (
      <React.Fragment>
        <FlexboxGrid>
          <FlexboxGrid.Item order={1} componentClass={Col} colspan={24}>
            <Grid fluid>
              <Row className={classes.row1Height}>
                <Col md={10} className={classes.row1Col1Style}>
                  <h1>Mortgage Calculator</h1>
                </Col>
                
                <Col md={14} smHidden xsHidden>
                  <div className={classes.actionControls}>
                    <div className={classes.importField}>
                      <Field
                        name="importListingData"
                        render={(input) => (
                          <input
                            {...input}
                            className={classes.inputListingData}
                            type="text"
                            placeholder="Import Listing Data..."
                          />
                        )}
                      />

                      <RVButton 
                        palette="primary" 
                        size="md"
                        onClick={formProps.form.submit}
                      >Submit</RVButton>
                    </div>
                    <div className={classes.actionButtons}>
                      <RVButton 
                        className={classes.actionButton}
                        palette="success" 
                        size="md"
                        onClick={formProps.form.submit}
                      >Send</RVButton>
                      <RVButton 
                        className={classes.actionButton}
                        palette="secondary" 
                        size="md"
                      >PDF</RVButton>
                      <RVButton 
                        className={classes.actionButton}
                        palette="secondary" 
                        size="md"
                      >Print</RVButton>
                    </div>
                  </div>
                </Col>
              </Row>
            </Grid>
          </FlexboxGrid.Item>
          <FlexboxGridItem
            order={3}
            componentClass={Col}
            colspan={24}
            md={10}
            mdPull={14}
          >
            <Grid fluid gutter={3}>
              <Row>
                <Col md={24} className={classes.withSpacing}>
                  <MortgageResult formProps={formProps} />
                </Col>
                <Col md={24} className={classes.withSpacing}>
                  <TotalPayments formProps={formProps} />
                </Col>
              </Row>
            </Grid>
          </FlexboxGridItem>
          <FlexboxGridItem
            order={2}
            componentClass={Col}
            colspan={24}
            md={14}
            mdPush={10}
          >
            <Grid fluid gutter={3}>
              <Row>
                <Col md={24} className={classes.withSpacing}>
                  <MortgageDetails formProps={formProps} />
                </Col>
                <Col md={24} className={classes.withSpacing}>
                  <HomeownersExpenses formProps={formProps} />
                </Col>
                {isExtraPayment && (
                  <Col md={24} className={classes.withSpacing}>
                    <ExtraPayment formProps={formProps} />
                  </Col>
                )}
                <Col md={24} className={classes.withSpacing} justify="center">
                  <div className="addExtraPayment-container">
                    <FlexboxGrid justify="center">
                      <FlexboxGridItem style={{ padding: 5 }}>
                        {!isExtraPayment && (
                          <RVButton
                            palette="primary"
                            size="md"
                            onClick={this.handleShowExtraPayment}
                          >Add Extra Payment</RVButton>
                        )}
                        {isExtraPayment && (
                          <RVButton
                            palette="danger"
                            size="md"
                            onClick={this.handleShowExtraPayment}
                          >Remove Extra Payment</RVButton>
                        )}
                      </FlexboxGridItem>
                    </FlexboxGrid>
                  </div>
                </Col>
              </Row>
            </Grid>
          </FlexboxGridItem>
        </FlexboxGrid>
        <FormSpy onChange={(formObj) => console.log(formObj.values)} />
      </React.Fragment>
    );
  };

  render() {
    return (
      <Form
        decorators={[mortgageDecorator]}
        initialValues={{
          homeValue: 350000,
          downPayment: 42000,
          downPaymentPercent: 12,
          mortgageAmount: 308000,
          paymentFrequency: PAYMENT_FREQUENCY.MONTHLY,
          interestRate: 4,
          pmi_yr: 1925,
          pmi_yrPercent: 0.625,
          amortizationPeriod: "yearly",
          amortizationPeriodYr: 30,
          amortizationPeriodMo: 360,
          startDate: new Date(),
          isUsingOneTimeExpense: true,
          isUsingHomeInsurance_Yr: true,
          isUsingPropertyTaxes_Yr: true,
          oneTimeExpenses: 10500,
          oneTimeExpensesPercent: 3,
          homeInsurance_Yr: 1225,
          homeInsurance_YrPercent: 0.35,
          propertyTaxes_Yr: 4375,
          propertyTaxes_YrPercent: 1.25,
          hoaFees_Mo: 0,
          extraPaymentMonthlyAmount: 0,
          extraPaymentYearlyAmount: 0,
          extraPaymentQuarterlyAmount: 0,
          extraPaymentWeeklyAmount: 0,
          extraPaymentMonthlyStartDate: new Date(),
          extraPaymentYearlyStartDate: new Date(),
          extraPaymentQuarterlyStartDate: new Date(),
          extraPaymentWeeklyStartDate: new Date(),
        }}
        keepDirtyOnReinitialize
        onSubmit={(formValues) => this.handleSubmit(formValues)}
        render={(formProps) => this.renderForm(formProps)}
      />
    );
  }
}

export default withStyles(styles)(MortgageCalculator);
