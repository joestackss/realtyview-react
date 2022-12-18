import React from "react";
import { Grid, Row, InputGroup, Icon, Col, Panel } from "rsuite";
import { Field } from "react-final-form";
import calculator from "../calculator";

import CurrencyInput from "./CurrencyInput";
import withStyles from "react-jss";

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

class HomeownersExpenses extends React.Component {
  state = {
    oneTimeExpenses: true,
    homeInsurance_Yr: true,
    propertyTaxes_Yr: true,
  };

  //Homeoweners Expenses handle input changes

  handleChangeOneTimeExpensesPercent = (formProps) => () => {
    formProps.form.change(
      "oneTimeExpensesPercent",
      parseFloat(
        calculator.getOneTimeExpensesPercent(
          formProps.form.getState().values
        ) || 0
      ).toFixed(2)
    );
  };

  handleChangeOneTimeExpenses = (formProps) => () => {
    formProps.form.change(
      "oneTimeExpenses",
      parseFloat(
        calculator.getOneTimeExpense(formProps.form.getState().values) || 0
      ).toFixed(2)
    );
  };

  handleChangeHomeInsurance_YrPercent = (formProps) => () => {
    formProps.form.change(
      "homeInsurance_YrPercent",
      parseFloat(
        calculator.getHomeInsurance_YrPercent(
          formProps.form.getState().values
        ) || 0
      ).toFixed(2)
    );
  };

  handleChangeHomeInsurance_Yr = (formProps) => () => {
    formProps.form.change(
      "homeInsurance_Yr",
      parseFloat(
        calculator.getHomeInsurance_Yr(formProps.form.getState().values) || 0
      ).toFixed(2)
    );
  };

  handleChangePropertyTaxes_YrPercent = (formProps) => () => {
    formProps.form.change(
      "propertyTaxes_YrPercent",
      parseFloat(
        calculator.getPropertyTaxes_YrPercent(
          formProps.form.getState().values
        ) || 0
      ).toFixed(2)
    );
  };

  handleChangePropertyTaxes_Yr = (formProps) => () => {
    formProps.form.change(
      "propertyTaxes_Yr",
      parseFloat(
        calculator.getPropertyTaxes_Yr(formProps.form.getState().values) || 0
      ).toFixed(2)
    );
  };

  handleToggleIsUsingOneTimeExpense = (formProps) => {
    const isUsingOneTimeExpense = formProps.form.getState().values
      .isUsingOneTimeExpense;
    formProps.form.change("isUsingOneTimeExpense", !isUsingOneTimeExpense);
  };

  handleToggleIsUsingHomeInsurance_Yr = (formProps) => {
    const isUsingHomeInsurance_Yr = formProps.form.getState().values
      .isUsingHomeInsurance_Yr;
    formProps.form.change("isUsingHomeInsurance_Yr", !isUsingHomeInsurance_Yr);
  };

  handleToggleIsUsingPropertyTaxes_Yr = (formProps) => {
    const isUsingPropertyTaxes_Yr = formProps.form.getState().values
      .isUsingPropertyTaxes_Yr;
    formProps.form.change("isUsingPropertyTaxes_Yr", !isUsingPropertyTaxes_Yr);
  };

  toggleField = (field) => () => {
    const oldValue = this.state[field];
    this.setState({ [field]: !!!oldValue });
  };

  render() {
    const { formProps, classes } = this.props;
    const isUsingOneTimeExpense = formProps.form.getState().values
      .isUsingOneTimeExpense;
    const isUsingHomeInsurance_Yr = formProps.form.getState().values
      .isUsingHomeInsurance_Yr;
    const isUsingPropertyTaxes_Yr = formProps.form.getState().values
      .isUsingPropertyTaxes_Yr;
    return (
      <Panel bordered className={classes.panelStyle}>
        <Grid fluid gutter={20}>
          <Row>
            <div className={classes.panelTitle}>HOMEOWENERS EXPENSES</div>
          </Row>
          <Row>
            <Field
              name="isUsingOneTimeExpense"
              render={(fieldProps) => (
                <input type="hidden" {...fieldProps.input} />
              )}
            />
            <Field
              name="isUsingHomeInsurance_Yr"
              render={(fieldProps) => (
                <input type="hidden" {...fieldProps.input} />
              )}
            />
            <Field
              name="isUsingPropertyTaxes_Yr"
              render={(fieldProps) => (
                <input type="hidden" {...fieldProps.input} />
              )}
            />
            <Field
              name="oneTimeExpensesPercent"
              render={(fieldProps) => (
                <input type="hidden" {...fieldProps.input} />
              )}
            />
            <Field
              name="oneTimeExpenses"
              render={(fieldProps) => (
                <input type="hidden" {...fieldProps.input} />
              )}
            />
            <Field
              name="homeInsurance_YrPercent"
              render={(fieldProps) => (
                <input type="hidden" {...fieldProps.input} />
              )}
            />
            <Field
              name="homeInsurance_Yr"
              render={(fieldProps) => (
                <input type="hidden" {...fieldProps.input} />
              )}
            />
            <Field
              name="propertyTaxes_YrPercent"
              render={(fieldProps) => (
                <input type="hidden" {...fieldProps.input} />
              )}
            />
            <Field
              name="propertyTaxes_Yr"
              render={(fieldProps) => (
                <input type="hidden" {...fieldProps.input} />
              )}
            />
          </Row>
          <Row gutter={20}>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>One-Time Expenses</div>
              <InputGroup>
                {isUsingOneTimeExpense === true && (
                  <Field
                    name="oneTimeExpenses"
                    render={(fieldProps) => (
                      <div className="fieldInput">
                        <CurrencyInput
                          {...fieldProps.input}
                          onBlur={this.handleChangeOneTimeExpensesPercent(
                            formProps
                          )}
                        />
                      </div>
                    )}
                  />
                )}
                {isUsingOneTimeExpense === false && (
                  <Field
                    name="oneTimeExpensesPercent"
                    render={(fieldProps) => (
                      <div className="fieldInput">
                        <CurrencyInput
                          {...fieldProps.input}
                          onBlur={this.handleChangeOneTimeExpenses(formProps)}
                        />
                      </div>
                    )}
                  />
                )}
                <InputGroup.Button
                  style={isUsingOneTimeExpense === true ? style1 : style2}
                  onClick={() =>
                    this.handleToggleIsUsingOneTimeExpense(formProps)
                  }
                >
                  <Icon icon="usd" />
                </InputGroup.Button>
                <InputGroup.Button
                  style={isUsingOneTimeExpense === false ? style1 : style2}
                  onClick={() =>
                    this.handleToggleIsUsingOneTimeExpense(formProps)
                  }
                >
                  <Icon icon="percent" />
                </InputGroup.Button>
              </InputGroup>
            </Col>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Home Insurance / Year</div>
              <InputGroup>
                {isUsingHomeInsurance_Yr === true && (
                  <Field
                    name="homeInsurance_Yr"
                    render={(fieldProps) => (
                      <div className="fieldInput">
                        <CurrencyInput
                          {...fieldProps.input}
                          onBlur={this.handleChangeHomeInsurance_YrPercent(
                            formProps
                          )}
                        />
                      </div>
                    )}
                  />
                )}
                {isUsingHomeInsurance_Yr === false && (
                  <Field
                    name="homeInsurance_YrPercent"
                    render={(fieldProps) => (
                      <div className="fieldInput">
                        <CurrencyInput
                          {...fieldProps.input}
                          onBlur={this.handleChangeHomeInsurance_Yr(formProps)}
                        />
                      </div>
                    )}
                  />
                )}
                <InputGroup.Button
                  style={isUsingHomeInsurance_Yr === true ? style1 : style2}
                  onClick={() =>
                    this.handleToggleIsUsingHomeInsurance_Yr(formProps)
                  }
                >
                  <Icon icon="usd" />
                </InputGroup.Button>
                <InputGroup.Button
                  style={isUsingHomeInsurance_Yr === false ? style1 : style2}
                  onClick={() =>
                    this.handleToggleIsUsingHomeInsurance_Yr(formProps)
                  }
                >
                  <Icon icon="percent" />
                </InputGroup.Button>
              </InputGroup>
            </Col>
          </Row>
          <Row gutter={20}>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Property Taxes / Year</div>
              <InputGroup>
                {isUsingPropertyTaxes_Yr === true && (
                  <Field
                    name="propertyTaxes_Yr"
                    render={(fieldProps) => (
                      <div className="fieldInput">
                        <CurrencyInput
                          {...fieldProps.input}
                          onBlur={this.handleChangePropertyTaxes_YrPercent(
                            formProps
                          )}
                        />
                      </div>
                    )}
                  />
                )}
                {isUsingPropertyTaxes_Yr === false && (
                  <Field
                    name="propertyTaxes_YrPercent"
                    render={(fieldProps) => (
                      <div className="fieldInput">
                        <CurrencyInput
                          {...fieldProps.input}
                          onBlur={this.handleChangePropertyTaxes_Yr(formProps)}
                        />
                      </div>
                    )}
                  />
                )}
                <InputGroup.Button
                  // color={isUsingPropertyTaxes_Yr === true ? "primary" : ""}
                  style={isUsingPropertyTaxes_Yr === true ? style1 : style2}
                  onClick={() =>
                    this.handleToggleIsUsingPropertyTaxes_Yr(formProps)
                  }
                >
                  <Icon icon="usd" />
                </InputGroup.Button>
                <InputGroup.Button
                  // color={isUsingPropertyTaxes_Yr === false ? "primary" : ""}
                  style={isUsingPropertyTaxes_Yr === false ? style1 : style2}
                  onClick={() =>
                    this.handleToggleIsUsingPropertyTaxes_Yr(formProps)
                  }
                >
                  <Icon icon="percent" />
                </InputGroup.Button>
              </InputGroup>
            </Col>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>HOA Fees / Month</div>
              <Field
                name="hoaFees_Mo"
                render={(fieldProps) => (
                  <InputGroup>
                    <InputGroup.Button>
                      <Icon icon="usd" />
                    </InputGroup.Button>

                    <div className="fieldInput">
                      <CurrencyInput {...fieldProps.input} />
                    </div>
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

// HomeownersExpenses.propTypes = {
//   classes: PropTypes.object,
// };

export default withStyles(styles)(HomeownersExpenses);
