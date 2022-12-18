import React from "react";
import { Panel, Col, Row, Grid, Icon, FlexboxGrid } from "rsuite";
import PropTypes from "prop-types";
import Calculator from "../calculator";
import withStyles from "react-jss";
import PieChartTotalPayment from "./PieChart";
import NumberFormat from "react-number-format";

const REFERENCE_MAP = {
  downPaymentAndOneTime: {
    color: "#fa5c7c",
    label: "Down Payment and One Time",
  },
  principal: {
    color: "#08cf97",
    label: "Principal",
  },
  extraPayments: {
    color: "#727cf5",
    label: "Extra Payments",
  },
  interests: {
    color: "#ffbc00",
    label: "Interests",
  },
  taxes: {
    color: "#38afd1",
    label: "Taxes",
  },
};

const styles = {
  pieChartContainer: {
    display: "flex",
    justifyContent: "center",
  },

  moneyValue: {
    fontWeight: 700,
  },

  label: {
    fontSize: "0.8em",
  },

  padded: {
    paddingLeft: 3,
    paddingRight: 3,
    paddingTop: 5,
    paddingBottom: 5,
  },

  totalPayment: {
    paddingTop: 12.5,
    paddingBottom: 12.5
  },

  totalMoneyValue: {
    align: "center",
    fontWeight: 700,
    fontSize: 18,
  },

  centerted: {
    textAlign: "center",
  },

  flexBoxGridItemPrincipal: {
    height: "100%",
  },
  "@media (min-width: 375px)": {
    flexBoxGridItemPrincipal: {
      height: 36,
    },
  },
  "@media (min-width: 1200px)": {
    flexBoxGridItemPrincipal: {
      height: "100%",
    },
  },

  panelStyle: {
    borderRadius: 5,
    boxShadow: "0 0 8px 7px rgba(114, 124, 245, 0.03)"
  },
};

class TotalPayments extends React.Component {
  renderTable(calculator) {
    const { classes, formProps } = this.props;
    const formValues = formProps.form.getState().values;
    let {
      totalExtraPayment,
      totalInterestWithExtraPayment,
    } = calculator.getTotalExtraPaymentAndInterest(formValues);

    return (
      <Grid fluid>
        <Row>
          <Col md={24} xs={12}>
            <FlexboxGrid>
              <FlexboxGrid.Item className={classes.padded}>
                <Icon
                  icon="circle"
                  style={{ color: REFERENCE_MAP.downPaymentAndOneTime.color }}
                />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item className={classes.padded}>
                <div className={classes.moneyValue}>
                  <NumberFormat
                    displayType="text"
                    value={parseFloat(
                      parseFloat(calculator.totalDownPayment) || 0
                    ).toFixed(2)}
                    prefix="$"
                    thousandSeparator
                  />
                </div>
                <p className={classes.label}>
                  Down Payment & <br />
                  One-time Expenses
                </p>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Col>
          <Col md={24} xs={12}>
            <FlexboxGrid>
              <FlexboxGrid.Item className={classes.padded}>
                <Icon
                  icon="circle"
                  style={{ color: REFERENCE_MAP.principal.color }}
                />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item className={classes.padded}>
                <div className={classes.moneyValue}>
                  <NumberFormat
                    displayType="text"
                    value={parseFloat(
                      parseFloat(calculator.principalPayment) || 0
                    ).toFixed(2)}
                    prefix="$"
                    thousandSeparator
                  />
                </div>
                <div className={classes.flexBoxGridItemPrincipal}>
                  Principal
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Col>
          <Col md={24} xs={12}>
            <FlexboxGrid>
              <FlexboxGrid.Item className={classes.padded}>
                <Icon
                  icon="circle"
                  style={{ color: REFERENCE_MAP.extraPayments.color }}
                />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item className={classes.padded}>
                <div className={classes.moneyValue}>
                  <NumberFormat
                    displayType="text"
                    value={parseFloat(
                      parseFloat(totalExtraPayment) || 0
                    ).toFixed(2)}
                    prefix="$"
                    thousandSeparator
                  />
                </div>
                <div className={classes.label}>Extra Payments</div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Col>
          <Col md={24} xs={12}>
            <FlexboxGrid>
              <FlexboxGrid.Item className={classes.padded}>
                <Icon
                  icon="circle"
                  style={{ color: REFERENCE_MAP.interests.color }}
                />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item className={classes.padded}>
                <div className={classes.moneyValue}>
                  <NumberFormat
                    displayType="text"
                    value={parseFloat(
                      parseFloat(totalInterestWithExtraPayment) || 0
                    ).toFixed(2)}
                    prefix="$"
                    thousandSeparator
                  />
                </div>
                <div className={classes.label}>Interests</div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Col>
          <Col md={24} xs={12}>
            <FlexboxGrid>
              <FlexboxGrid.Item className={classes.padded}>
                <Icon
                  icon="circle"
                  style={{ color: REFERENCE_MAP.taxes.color }}
                />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item className={classes.padded}>
                <div className={classes.moneyValue}>
                  <NumberFormat
                    displayType="text"
                    value={parseFloat(
                      parseFloat(calculator.totalTaxesPMIInsuranceFeePayment) ||
                        0
                    ).toFixed(2)}
                    prefix="$"
                    thousandSeparator
                  />
                </div>
                <div className={classes.label}>
                  Taxes, PMI, <br />
                  Insurance & Fees
                </div>
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </Col>
        </Row>
      </Grid>
    );
  }

  render() {
    const { formProps, classes } = this.props;
    const formValues = formProps.form.getState().values;
    const calculator = Calculator.init(formValues);
    return (
      <Panel bordered className={classes.panelStyle}>
        <Row>
          <Col xs={24} md={15}>
            <div className={classes.pieChartContainer}>
              <PieChartTotalPayment formProps={formProps} />
            </div>
          </Col>
          <Col xs={24} md={9}>
            {this.renderTable(calculator)}
          </Col>
        </Row>
        <Row className={classes.totalPayment}>
          <div
            className={classes.totalMoneyValue}
            style={{ textAlign: "center" }}
          >
            <NumberFormat
              displayType="text"
              value={parseFloat(
                parseFloat(calculator.totalPayment) || 0
              ).toFixed(2)}
              prefix="$"
              thousandSeparator
            />
          </div>
          <div
            className={(classes.padded, classes.label)}
            style={{ textAlign: "center" }}
          >
            Total of all Payments
          </div>
        </Row>
      </Panel>
    );
  }
}

TotalPayments.propTypes = {
  formProps: PropTypes.object.isRequired,
};

export default withStyles(styles)(TotalPayments);
