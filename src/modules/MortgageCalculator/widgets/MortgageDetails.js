import React from "react";
import {
  Grid,
  Row,
  InputGroup,
  Icon,
  Col,
  Panel,
  DatePicker,
  Button,
  ButtonGroup,
} from "rsuite";

import { Field } from "react-final-form";
import withStyles from "react-jss";
import calculator from "../calculator";
import { PAYMENT_FREQUENCY } from "../constants";
import CurrencyInput from "./CurrencyInput";

const styles = {
  panelTitle: {
    "font-weight": "bold",
    color: "#727cf5",
    "line-height": "1.25",
    paddingTop: 10,
    paddingBottom: 10,
  },

  mortLabel: {
    "font-size": 14,
    "font-weight": "bold",
    "font-family": "Nunito",
    paddingTop: 13,
    paddingBottom: 13,
  },

  fieldInputs: {
    border: "none",
    width: "inherit",
    height: "inherit",
    outline: "none",
  },

  panelStyle: {
    "border-radius": 5,
    "box-shadow": "0 0 8px 7px rgba(114, 124, 245, 0.03)",
  },
};

const style1 = {
  border: "solid 1px #727cf5",
  backgroundColor: "#727cf5",
  color: "white",
};

const style2 = {
  border: "solid 1px #727cf5",
  backgroundColor: "#ffffff",
  color: "#727cf5",
};

class MortgageDetails extends React.Component {
  state = {
    downPayment: true,
    pmi_yr: true,
    amortizationPeriod: true,
    paymentFrequency: true,
  };

  //startdate restrictions

  handleDisableDate = (startDate) => (date) => {
    return date <= startDate;
  };

  //Mortgage Details handle input changes

  handleChangeInputHomeValue = (formProps) => () => {
    const formValues = formProps.form.getState().values;

    this.state.downPayment === true
      ? formProps.form.change(
          "downPaymentPercent",
          parseFloat(
            calculator.getDownPaymentPercent(
              formProps.form.getState().values
            ) || 0
          ).toFixed(2)
        )
      : formProps.form.change(
          "downPayment",
          parseFloat(
            calculator.getDownPayment(formProps.form.getState().values) || 0
          ).toFixed(2)
        );

    formProps.form.change(
      "mortgageAmount",
      parseFloat(
        formValues.homeValue - formProps.form.getState().values.downPayment || 0
      ).toFixed(2)
    );

    if (
      calculator.getDownPaymentPercent(formProps.form.getState().values) < 20
    ) {
      if (
        formProps.form.getState().values.pmi_yrPercent &&
        formProps.form.getState().values.pmi_yr !== 0
      ) {
        this.state.pmi_yr === true
          ? formProps.form.change(
              "pmi_yrPercent",
              parseFloat(
                calculator.getPMIperYearPercent(
                  formProps.form.getState().values
                ) || 0
              ).toFixed(2)
            )
          : formProps.form.change(
              "pmi_yr",
              parseFloat(
                calculator.getPMIperYear(formProps.form.getState().values) || 0
              ).toFixed(2)
            );
      } else {
        formProps.form.change(
          "pmi_yrPercent",
          parseFloat(
            calculator.getPMIperYearPercent(formProps.form.getState().values) ||
              0
          ).toFixed(2)
        );
        formProps.form.change(
          "pmi_yr",
          parseFloat(
            calculator.getPMIperYear(formProps.form.getState().values) || 0
          ).toFixed(2)
        );
      }
    } else {
      formProps.form.change("pmi_yrPercent", 0);
      formProps.form.change("pmi_yr", 0);
    }

    if (formValues.isUsingOneTimeExpense === true) {
      formProps.form.change(
        "oneTimeExpensesPercent",
        parseFloat(
          calculator.getOneTimeExpensesPercent(
            formProps.form.getState().values
          ) || 0
        ).toFixed(2)
      );
    } else {
      formProps.form.change(
        "oneTimeExpenses",
        parseFloat(
          calculator.getOneTimeExpense(formProps.form.getState().values) || 0
        ).toFixed(2)
      );
    }

    if (formValues.isUsingHomeInsurance_Yr === true) {
      formProps.form.change(
        "homeInsurance_YrPercent",
        parseFloat(
          calculator.getHomeInsurance_YrPercent(
            formProps.form.getState().values
          ) || 0
        ).toFixed(2)
      );
    } else {
      formProps.form.change(
        "homeInsurance_Yr",
        parseFloat(
          calculator.getHomeInsurance_Yr(formProps.form.getState().values) || 0
        ).toFixed(2)
      );
    }

    if (formValues.isUsingPropertyTaxes_Yr === true) {
      formProps.form.change(
        "propertyTaxes_YrPercent",
        parseFloat(
          calculator.getPropertyTaxes_YrPercent(
            formProps.form.getState().values
          ) || 0
        ).toFixed(2)
      );
    } else {
      formProps.form.change(
        "propertyTaxes_Yr",
        parseFloat(
          calculator.getPropertyTaxes_Yr(formProps.form.getState().values) || 0
        ).toFixed(2)
      );
    }
  };

  handleChangeInputDownPaymentPercent = (formProps) => () => {
    formProps.form.change(
      "downPayment",
      parseFloat(
        calculator.getDownPayment(formProps.form.getState().values) || 0
      ).toFixed(2)
    );

    formProps.form.change(
      "mortgageAmount",
      parseFloat(
        calculator.getMortgageAmount(formProps.form.getState().values) || 0
      ).toFixed(2)
    );

    formProps.form.change(
      "pmi_yr",
      parseFloat(
        calculator.getPMIperYear(formProps.form.getState().values) || 0
      ).toFixed(2)
    );

    formProps.form.change(
      "pmi_yrPercent",
      parseFloat(
        calculator.getPMIperYearPercent(formProps.form.getState().values) || 0
      ).toFixed(2)
    );
  };

  handleChangeInputDownPayment = (formProps) => () => {
    formProps.form.change(
      "downPaymentPercent",
      parseFloat(
        calculator.getDownPaymentPercent(formProps.form.getState().values) || 0
      ).toFixed(2)
    );

    formProps.form.change(
      "mortgageAmount",
      parseFloat(
        calculator.getMortgageAmount(formProps.form.getState().values) || 0
      ).toFixed(2)
    );

    formProps.form.change(
      "pmi_yrPercent",
      parseFloat(
        calculator.getPMIperYearPercent(formProps.form.getState().values) || 0
      ).toFixed(2)
    );

    formProps.form.change(
      "pmi_yr",
      parseFloat(
        calculator.getPMIperYear(formProps.form.getState().values) || 0
      ).toFixed(2)
    );
  };

  handleChangeInputMortgageAmount = (formProps) => () => {
    formProps.form.change(
      "downPayment",
      parseFloat(
        calculator.getDownPaymentMort(formProps.form.getState().values) || 0
      ).toFixed(2)
    );

    formProps.form.change(
      "downPaymentPercent",
      parseFloat(
        calculator.getDownPaymentPercent(formProps.form.getState().values) || 0
      ).toFixed(2)
    );

    formProps.form.change(
      "pmi_yrPercent",
      parseFloat(
        calculator.getPMIperYearPercent(formProps.form.getState().values) || 0
      ).toFixed(2)
    );

    formProps.form.change(
      "pmi_yr",
      parseFloat(
        calculator.getPMIperYear(formProps.form.getState().values) || 0
      ).toFixed(2)
    );
  };

  handleChangePmi_yrPercent = (formProps) => () => {
    const formValues = formProps.form.getState().values;
    formProps.form.change(
      "pmi_yrPercent",
      parseFloat(
        (formValues.pmi_yr / formValues.mortgageAmount) * 100 || 0
      ).toFixed(2)
    );
  };

  handleChangePmi_yr = (formProps) => () => {
    const formValues = formProps.form.getState().values;
    formProps.form.change(
      "pmi_yr",
      parseFloat(
        formValues.mortgageAmount * (formValues.pmi_yrPercent * 0.01) || 0
      ).toFixed(2)
    );
  };

  handleChangeAmortizationPeriodYr = (formProps) => () => {
    const formValues = formProps.form.getState().values;
    formProps.form.change(
      "amortizationPeriodYr",
      parseFloat(formValues.amortizationPeriodYr)
    );
  };

  handleChangeAmortizationPeriodMo = (formProps) => () => {
    const formValues = formProps.form.getState().values;
    formProps.form.change(
      "amortizationPeriodMo",
      parseFloat(formValues.amortizationPeriodYr * 12)
    );
  };

  toggleField = (field) => () => {
    const oldValue = this.state[field];
    this.setState({ [field]: !!!oldValue });
  };

  render() {
    const { formProps, classes } = this.props;
    const formValues = formProps.form.getState().values;
    return (
      <Panel bordered className={classes.panelStyle}>
        <Grid fluid>
          <Row>
            <div className={classes.panelTitle}>MORTGAGE DETAILS</div>
          </Row>
          <Row>
            <Field
              name="amortizationPeriod"
              render={(fieldProps) => (
                <input type="hidden" {...fieldProps.input} />
              )}
            />
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Home Value</div>
              <Field
                name="homeValue"
                render={(fieldProps) => (
                  <InputGroup>
                    <InputGroup.Button>
                      <Icon icon="usd" />
                    </InputGroup.Button>
                    <div className="fieldInput">
                      <CurrencyInput
                        {...fieldProps.input}
                        onBlur={this.handleChangeInputHomeValue(formProps)}
                      />
                    </div>
                  </InputGroup>
                )}
              />
            </Col>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Down Payment</div>
              <InputGroup>
                {this.state.downPayment === true && (
                  <Field
                    name="downPayment"
                    render={(fieldProps) => (
                      <div className="fieldInput">
                        <CurrencyInput
                          className={classes.mortLabel}
                          {...fieldProps.input}
                          onBlur={this.handleChangeInputDownPayment(formProps)}
                        />
                      </div>
                    )}
                  />
                )}
                {this.state.downPayment === false && (
                  <Field
                    name="downPaymentPercent"
                    render={(fieldProps) => (
                      <div className="fieldInput">
                        <CurrencyInput
                          {...fieldProps.input}
                          onBlur={this.handleChangeInputDownPaymentPercent(
                            formProps
                          )}
                        />
                      </div>
                    )}
                  />
                )}
                <InputGroup.Button
                  style={this.state.downPayment === true ? style1 : style2}
                  onClick={this.toggleField("downPayment")}
                >
                  <Icon icon="usd" />
                </InputGroup.Button>
                <InputGroup.Button
                  style={this.state.downPayment === false ? style1 : style2}
                  onClick={this.toggleField("downPayment")}
                >
                  <Icon icon="percent" />
                </InputGroup.Button>
              </InputGroup>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Mortgage Amount</div>
              <Field
                name="mortgageAmount"
                render={(fieldProps) => (
                  <InputGroup>
                    <InputGroup.Button>
                      <Icon icon="usd" />
                    </InputGroup.Button>
                    <div className="fieldInput">
                      <CurrencyInput
                        {...fieldProps.input}
                        onBlur={this.handleChangeInputMortgageAmount(formProps)}
                      />
                    </div>
                  </InputGroup>
                )}
              />
            </Col>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Interest Rate</div>
              <Field
                name="interestRate"
                render={(fieldProps) => (
                  <InputGroup>
                    <InputGroup.Button>
                      <Icon icon="percent" />
                    </InputGroup.Button>
                    <div className="fieldInput">
                      <CurrencyInput {...fieldProps.input} />
                    </div>
                  </InputGroup>
                )}
              />
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>PMI / Year</div>
              <InputGroup>
                {this.state.pmi_yr === true && (
                  <Field
                    name="pmi_yr"
                    render={(fieldProps) => (
                      <div className="fieldInput">
                        <CurrencyInput
                          {...fieldProps.input}
                          onBlur={this.handleChangePmi_yrPercent(formProps)}
                        />
                      </div>
                    )}
                  />
                )}
                {this.state.pmi_yr === false && (
                  <Field
                    name="pmi_yrPercent"
                    render={(fieldProps) => (
                      <div className="fieldInput">
                        <CurrencyInput
                          {...fieldProps.input}
                          onBlur={this.handleChangePmi_yr(formProps)}
                        />
                      </div>
                    )}
                  />
                )}
                <InputGroup.Button
                  style={this.state.pmi_yr === true ? style1 : style2}
                  onClick={this.toggleField("pmi_yr")}
                >
                  <Icon icon="usd" />
                </InputGroup.Button>
                <InputGroup.Button
                  style={this.state.pmi_yr === false ? style1 : style2}
                  onClick={this.toggleField("pmi_yr")}
                >
                  <Icon icon="percent" />
                </InputGroup.Button>
              </InputGroup>
            </Col>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Amortization Period</div>
              <InputGroup>
                {formValues.amortizationPeriod === "yearly" && (
                  <Field
                    name="amortizationPeriodYr"
                    render={(fieldProps) => (
                      <div className="fieldInput">
                        <CurrencyInput
                          {...fieldProps.input}
                          onBlur={this.handleChangeAmortizationPeriodMo(
                            formProps
                          )}
                        />
                      </div>
                    )}
                  />
                )}
                {formValues.amortizationPeriod === "monthly" && (
                  <Field
                    name="amortizationPeriodMo"
                    render={(fieldProps) => (
                      <div className="fieldInput">
                        <CurrencyInput
                          {...fieldProps.input}
                          onBlur={this.handleChangeAmortizationPeriodYr(
                            formProps
                          )}
                        />
                      </div>
                    )}
                  />
                )}
                <Field
                  name="amortizationPeriod"
                  render={(fieldProps) => (
                    <React.Fragment>
                      <InputGroup.Button
                        style={
                          formValues.amortizationPeriod === "yearly"
                            ? style1
                            : style2
                        }
                        onClick={() => fieldProps.input.onChange("yearly")}
                      >
                        <div
                          style={
                            formValues.amortizationPeriod === "yearly"
                              ? { color: "white" }
                              : { color: "#727cf5" }
                          }
                        >
                          Yr
                        </div>
                      </InputGroup.Button>
                      <InputGroup.Button
                        style={
                          formValues.amortizationPeriod === "monthly"
                            ? style1
                            : style2
                        }
                        onClick={() => fieldProps.input.onChange("monthly")}
                      >
                        <div
                          style={
                            formValues.amortizationPeriod === "monthly"
                              ? { color: "white" }
                              : { color: "#727cf5" }
                          }
                        >
                          Mo
                        </div>
                      </InputGroup.Button>
                    </React.Fragment>
                  )}
                />
              </InputGroup>
            </Col>
          </Row>
          <Row gutter={24}>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Payment Frequency</div>
              <Field
                name="paymentFrequency"
                render={(fieldProps) => (
                  <ButtonGroup style={{ paddingBottom: 13 }} justified>

                    <Button
                      style={
                        fieldProps.input.value === PAYMENT_FREQUENCY.MONTHLY
                          ? style1
                          : style2
                      }
                      value={PAYMENT_FREQUENCY.MONTHLY}
                      onClick={() =>
                        fieldProps.input.onChange(PAYMENT_FREQUENCY.MONTHLY)
                      }
                    >
                      Monthy
                    </Button>
                    <Button
                      style={
                        fieldProps.input.value === PAYMENT_FREQUENCY.BIWEEKLY
                          ? style1
                          : style2
                      }
                      onClick={() =>
                        fieldProps.input.onChange(PAYMENT_FREQUENCY.BIWEEKLY)
                      }
                    >
                      Bi-weekly
                    </Button>
                  </ButtonGroup>
                )}
              />
            </Col>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Start Date</div>
              <Field
                name="startDate"
                render={(fieldProps) => (
                  <InputGroup>
                    <DatePicker
                      style={{ width: 500 }}
                      disabledDate={this.handleDisableDate(
                        formValues.startDate
                      )}
                      {...fieldProps.input}
                      block
                      oneTap
                    />
                  </InputGroup>
                )}
              />
            </Col>
          </Row>
        </Grid>
      </Panel>
    );
  }
}

export default withStyles(styles)(MortgageDetails);
