import React from "react";
import { Grid, Row, InputGroup, Icon, Col, Panel, DatePicker } from "rsuite";
import { Field } from "react-final-form";
import PropTypes from "prop-types";
import withStyles from "react-jss";
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

  panelStyle: {
    "border-radius": 5,
    "box-shadow": "0 0 8px 7px rgba(114, 124, 245, 0.03)",
  },
};

class ExtraPayment extends React.Component {
  handleDisableDate = (startDate) => (date) => {
    return date < startDate;
  };

  render() {
    const { formProps, classes } = this.props;
    const formValues = formProps.form.getState().values;
    return (
      <Panel bordered classname={classes.panelStyle}>
        <Grid fluid gutter={20}>
          <Row>
            <div className={classes.panelTitle}> EXTRA PAYMENTS</div>
          </Row>
          <Row gutter={20}>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Monthly or Bi-weekly</div>
              <Field
                name="extraPaymentMonthlyAmount"
                render={(fieldProps) => (
                  <InputGroup>
                    <InputGroup.Button>
                      <Icon icon="usd" />
                    </InputGroup.Button>
                    {/* <Input {...fieldProps.input} /> */}
                    <div className="fieldInput">
                      <CurrencyInput {...fieldProps.input} />
                    </div>
                  </InputGroup>
                )}
              />
            </Col>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Starting From</div>
              <Field
                name="extraPaymentMonthlyStartDate"
                render={(fieldProps) => (
                  <InputGroup>
                    <DatePicker
                      style={{ width: "100%", height: 40 }}
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
          <Row gutter={20}>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Yearly</div>
              <Field
                name="extraPaymentYearlyAmount"
                render={(fieldProps) => (
                  <InputGroup>
                    <InputGroup.Button>
                      <Icon icon="usd" />
                    </InputGroup.Button>
                    {/* <Input {...fieldProps.input} /> */}
                    <div className="fieldInput">
                      <CurrencyInput {...fieldProps.input} />
                    </div>
                  </InputGroup>
                )}
              />
            </Col>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Starting From</div>
              <Field
                name="extraPaymentYearlyStartDate"
                render={(fieldProps) => (
                  <InputGroup>
                    <DatePicker
                      style={{ width: "100%", height: 40 }}
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
          <Row gutter={20}>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Quarterly</div>
              <Field
                name="extraPaymentQuarterlyAmount"
                render={(fieldProps) => (
                  <InputGroup>
                    <InputGroup.Button>
                      <Icon icon="usd" />
                    </InputGroup.Button>
                    {/* <Input {...fieldProps.input} /> */}
                    <div className="fieldInput">
                      <CurrencyInput {...fieldProps.input} />
                    </div>
                  </InputGroup>
                )}
              />
            </Col>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Starting From</div>
              <Field
                name="extraPaymentQuarterlyStartDate"
                render={(fieldProps) => (
                  <InputGroup>
                    <DatePicker
                      style={{ width: "100%", height: 40 }}
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
          <Row gutter={20}>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>Weekly</div>
              <Field
                name="extraPaymentWeeklyAmount"
                render={(fieldProps) => (
                  <InputGroup>
                    <InputGroup.Button>
                      <Icon icon="usd" />
                    </InputGroup.Button>
                    {/*    */}
                    <div className="fieldInput">
                      <CurrencyInput {...fieldProps.input} />
                    </div>
                  </InputGroup>
                )}
              />
            </Col>
            <Col xs={24} md={12}>
              <div className={classes.mortLabel}>On</div>
              <Field
                name="extraPaymentWeeklyStartDate"
                render={(fieldProps) => (
                  <InputGroup>
                    <DatePicker
                      style={{ width: "100%", height: 40 }}
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

ExtraPayment.propTypes = {
  formProps: PropTypes.object.isRequired,
};

export default withStyles(styles)(ExtraPayment);
