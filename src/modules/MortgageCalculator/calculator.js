import moment from "moment";
import { PAYMENT_FREQUENCY } from "./constants";

const enumerateDaysBetweenDates = (startDate, endDate, unit, period) => {
  let date = [];
  while (moment(startDate) <= moment(endDate)) {
    date.push(startDate);
    startDate = moment(startDate).add(unit, period).toDate();
  }
  return date;
};

class Calculator {
  init(formValues) {
    this.formValues = formValues;
    return this;
  }

  getPMIRate = (ltv) => {
    return ltv > 95 && ltv <= 100
      ? 1.03
      : ltv > 90 && ltv <= 95
        ? 0.875
        : ltv > 85 && ltv <= 90
          ? 0.625
          : ltv > 80 && ltv <= 85
            ? 0.375
            : 0;
  };

  getTotalExtraPayment(formValues) {
    const monthlyBiweekly =
      parseFloat(formValues.extraPaymentMonthlyAmount) || 0;
    const yearly = parseFloat(formValues.extraPaymentYearlyAmount) || 0;
    const quarterly = parseFloat(formValues.extraPaymentQuarterlyAmount) || 0;
    const weekly = parseFloat(formValues.extraPaymentWeeklyAmount) || 0;

    const totalExtraPayment =
      monthlyBiweekly + yearly / 12 + quarterly / 3 + weekly / 4.345;

    const totalExtraPaymentBiweekly =
      monthlyBiweekly + yearly / 26 + quarterly / 6.5 + weekly * 2;

    return formValues.paymentFrequency === PAYMENT_FREQUENCY.MONTHLY
      ? totalExtraPayment
      : totalExtraPaymentBiweekly;
  }

  // condition statement if monthy or weekly payment

  getPayments_Yr(formValues) {
    const paymentFrequency = formValues.paymentFrequency;
    return paymentFrequency === PAYMENT_FREQUENCY.MONTHLY ? 12 : 26;
  }

  //loop for pmi duration

  getPMIDuration(formValues) {
    const principalInterest =
      formValues.paymentFrequency === PAYMENT_FREQUENCY.MONTHLY
        ? this.getMonthlyPrincipalInterest(formValues)
        : this.getBiWeeklyPrincipalInterest(formValues);
    const extraPayment = this.getTotalExtraPayment(formValues);
    const interest = parseFloat(formValues.interestRate);
    const numberOfPaymentsYr = this.getPayments_Yr(formValues);

    var balance = parseFloat(formValues.mortgageAmount);
    var nextInterestAmount = 0;
    var currentMonthlyPayment = 0;
    var nextMonthlyPayment = 0;
    var pmiMonths = 0;
    var pmiBiWeekly = 0;

    while (balance >= formValues.homeValue * 0.8) {
      currentMonthlyPayment = principalInterest + extraPayment;
      nextInterestAmount =
        balance * ((interest * 0.01) / numberOfPaymentsYr) * 1;
      nextMonthlyPayment = currentMonthlyPayment - nextInterestAmount;
      balance -= nextMonthlyPayment;
      pmiMonths++;
      pmiBiWeekly++;
    }

    return { pmiMonths, pmiBiWeekly };
  }

  // loop for getting the total extra payment, total interest with or w/o extra payment,
  // and total amotization months

  getTotalExtraPaymentAndInterest(formValues) {
    const principalInterest =
      formValues.paymentFrequency === PAYMENT_FREQUENCY.MONTHLY
        ? this.getMonthlyPrincipalInterest(formValues)
        : this.getBiWeeklyPrincipalInterest(formValues);

    const extraPayment = this.getTotalExtraPayment(formValues);
    const interest = parseFloat(formValues.interestRate);
    const numberOfPaymentsYr = this.getPayments_Yr(formValues);

    var balance = parseFloat(formValues.mortgageAmount);
    var nextInterestAmount = 0;
    var currentMonthlyPayment = 0;
    var nextMonthlyPayment = 0;
    var totalExtraPayment = 0;
    var totalInterestWithExtraPayment = 0;
    var totalAmortizationMonths = 0;
    var totalAmortizationBiWeekly = 0;

    while (balance > 0) {
      currentMonthlyPayment = principalInterest + extraPayment;
      nextInterestAmount =
        balance * ((interest * 0.01) / numberOfPaymentsYr) * 1;
      nextMonthlyPayment = currentMonthlyPayment - nextInterestAmount;
      balance -= nextMonthlyPayment;
      totalExtraPayment += extraPayment;
      totalInterestWithExtraPayment += nextInterestAmount;
      totalAmortizationMonths++;
      totalAmortizationBiWeekly++;
    }

    return {
      totalAmortizationMonths,
      totalAmortizationBiWeekly,
      totalExtraPayment,
      totalInterestWithExtraPayment,
    };
  }

  //Calculation for Monthly payment

  getMonthlyPrincipalInterest(formValues) {
    const mortgageAmount = parseFloat(formValues.mortgageAmount);
    const interestRate = parseFloat(formValues.interestRate);
    const totalNumberOfPayments = 12 * formValues.amortizationPeriodYr;

    return (
      (mortgageAmount *
        (((interestRate * 0.01) / 12) *
          Math.pow(1 + (interestRate * 0.01) / 12, totalNumberOfPayments))) /
      (Math.pow(1 + (interestRate * 0.01) / 12, totalNumberOfPayments) - 1) ||
      0
    );
  }

  getMontlyPropertyTaxes_Yr(formValues) {
    const propertyTaxes_Yr = parseFloat(formValues.propertyTaxes_Yr);
    return propertyTaxes_Yr / 12;
  }

  getMontlyHomeInsurance_Yr(formValues) {
    const homeInsurance_Yr = parseFloat(formValues.homeInsurance_Yr);
    return homeInsurance_Yr / 12;
  }

  getMontlyPMI_Yr(formValues) {
    const pmi_yr = parseFloat(formValues.pmi_yr);
    return pmi_yr / 12;
  }

  getTotalMontlyPayment(formValues) {
    return (
      this.getMonthlyPrincipalInterest(formValues) +
      parseFloat(formValues.extraPaymentMonthlyAmount) +
      this.getMontlyPropertyTaxes_Yr(formValues) +
      this.getMontlyHomeInsurance_Yr(formValues) +
      this.getMontlyPMI_Yr(formValues) +
      parseFloat(formValues.hoaFees_Mo) || 0
    );
  }

  //calculation for Bi-weekly payment

  getBiWeeklyPrincipalInterest(formValues) {
    const mortgageAmount = parseFloat(formValues.mortgageAmount);
    const interestRate = parseFloat(formValues.interestRate);
    const amortizationPeriodMo = formValues.amortizationPeriodMo;

    const BiWeeklyPrincipalInterest =
      (mortgageAmount *
        (((interestRate * 0.01) / 12) *
          Math.pow(1 + (interestRate * 0.01) / 12, amortizationPeriodMo))) /
      (Math.pow(1 + (interestRate * 0.01) / 12, amortizationPeriodMo) - 1) /
      2;

    return BiWeeklyPrincipalInterest;
  }

  getBiWeeklyPropertyTaxes_Yr(formValues) {
    const propertyTaxes_Yr = parseFloat(formValues.propertyTaxes_Yr);
    return propertyTaxes_Yr / 26;
  }

  getBiWeeklyHomeInsurance_Yr(formValues) {
    const homeInsurance_Yr = parseFloat(formValues.homeInsurance_Yr);
    return homeInsurance_Yr / 26;
  }

  getBiWeeklyPMI_Yr(formValues) {
    const pmi_yr = parseFloat(formValues.pmi_yr);
    return pmi_yr / 26;
  }

  getBiWeeklyHOAFeesMo(formValues) {
    const hoaFees_Mo = parseFloat(formValues.hoaFees_Mo);
    return (hoaFees_Mo * 12) / 26;
  }

  getTotalBiWeeklyPayment(formValues) {
    return (
      this.getBiWeeklyPrincipalInterest(formValues) +
      this.getBiWeeklyPropertyTaxes_Yr(formValues) +
      this.getBiWeeklyHomeInsurance_Yr(formValues) +
      this.getBiWeeklyPMI_Yr(formValues) +
      this.getBiWeeklyHOAFeesMo(formValues) +
      parseFloat(formValues.extraPaymentMonthlyAmount) || 0
    );
  }

  //calculation for Mortgage Details input valuess

  getDownPayment(formValues) {
    const downPaymentPercent = parseFloat(formValues.downPaymentPercent);
    const homeValue = parseFloat(formValues.homeValue);

    return (downPaymentPercent / 100) * homeValue;
  }

  getDownPaymentMort(formValues) {
    const mortgageAmount = parseFloat(formValues.mortgageAmount);
    const homeValue = parseFloat(formValues.homeValue);

    return homeValue - mortgageAmount;
  }

  getDownPaymentPercent(formValues) {
    const homeValue = parseFloat(formValues.homeValue);
    const downPayment = parseFloat(formValues.downPayment);

    return (downPayment / homeValue) * 100;
  }

  getMortgageAmount(formValues) {
    const downPayment = parseFloat(formValues.downPayment);
    const homeValue = parseFloat(formValues.homeValue);

    return homeValue - downPayment;
  }

  getLTV(formValues) {
    const homeValue = parseFloat(formValues.homeValue);
    const mortgageAmount = this.getMortgageAmount(formValues);

    return (mortgageAmount / homeValue) * 100;
  }

  getPMIperYearPercent(formValues) {
    const downPaymentPercent = parseFloat(formValues.downPaymentPercent);
    const ltv = this.getLTV(formValues);

    return downPaymentPercent < 20 ? this.getPMIRate(ltv) : 0;
  }

  getPMIperYear(formValues) {
    const downPaymentPercent = parseFloat(formValues.downPaymentPercent);
    const mortgageAmount = this.getMortgageAmount(formValues);
    const ltv = this.getLTV(formValues);
    return downPaymentPercent < 20
      ? 0.01 * this.getPMIRate(ltv) * mortgageAmount
      : 0;
  }

  getAmortizationPeriodMo(formValues) {
    let { totalAmortizationMonths } = this.getTotalExtraPaymentAndInterest(
      formValues
    );

    return totalAmortizationMonths;
  }

  //calculation for Homeoweners Expenses input values

  getOneTimeExpensesPercent(formValues) {
    const oneTimeExpenses = parseFloat(formValues.oneTimeExpenses);
    const homeValue = parseFloat(formValues.homeValue);

    return (oneTimeExpenses / homeValue) * 100;
  }

  getOneTimeExpense(formValues) {
    const oneTimeExpensesPercent = parseFloat(
      formValues.oneTimeExpensesPercent
    );
    const homeValue = parseFloat(formValues.homeValue);

    return oneTimeExpensesPercent * 0.01 * homeValue;
  }

  getHomeInsurance_YrPercent(formValues) {
    const homeInsurance_Yr = parseFloat(formValues.homeInsurance_Yr);
    const homeValue = parseFloat(formValues.homeValue);

    return (homeInsurance_Yr / homeValue) * 100;
  }

  getHomeInsurance_Yr(formValues) {
    const homeInsurance_YrPercent = parseFloat(
      formValues.homeInsurance_YrPercent
    );
    const homeValue = parseFloat(formValues.homeValue);

    return homeInsurance_YrPercent * 0.01 * homeValue;
  }

  getPropertyTaxes_YrPercent(formValues) {
    const propertyTaxes_Yr = parseFloat(formValues.propertyTaxes_Yr);
    const homeValue = parseFloat(formValues.homeValue);

    return (propertyTaxes_Yr / homeValue) * 100;
  }

  getPropertyTaxes_Yr(formValues) {
    const propertyTaxes_YrPercent = parseFloat(
      formValues.propertyTaxes_YrPercent
    );
    const homeValue = parseFloat(formValues.homeValue);

    return propertyTaxes_YrPercent * 0.01 * homeValue;
  }

  //calculation for extra payment input values

  getExtraPaymentStartDate(formValues) {
    const extraPaymentAmount =
      parseFloat(formValues.extraPaymentMonthlyAmount) ||
      parseFloat(formValues.extraPaymentYearlyAmount) ||
      parseFloat(formValues.extraPaymentQuarterlyAmount) ||
      parseFloat(formValues.extraPaymentWeeklyAmount);
    const extraPaymentStartDate =
      formValues.extraPaymentMonthlyStartDate ||
      formValues.extraPaymentYearlyStartDate ||
      formValues.extraPaymentQuarterlyStartDate ||
      formValues.extraPaymentweeklyStartDate;

    return extraPaymentAmount > 0 && extraPaymentStartDate != null
      ? ` (from ${moment(extraPaymentStartDate).format("DD-MMM YYYY")})`
      : "";
  }

  //calculation for date and schedules

  getEndDate(formValues) {
    const startDate = formValues.startDate || new Date();
    const amortizationPeriod = formValues.amortizationPeriod;
    const amortizationPeriodYr = formValues.amortizationPeriodYr;
    const amortizationPeriodMo = formValues.amortizationPeriodMo;

    if (amortizationPeriod) {
      return moment(startDate).add(amortizationPeriodYr, "year").toDate();
    } else {
      return moment(startDate).add(amortizationPeriodMo, "months").toDate();
    }
  }

  getPMIEndDate(formValues) {
    const startDate = formValues.startDate;
    let { pmiMonths, pmiBiWeekly } = this.getPMIDuration(formValues);

    const pmiEndDate =
      formValues.paymentFrequency === PAYMENT_FREQUENCY.MONTHLY
        ? moment(startDate)
          .add(pmiMonths - 1, "months")
          .toDate()
        : moment(startDate)
          .add(pmiBiWeekly * 2 - 2, "weeks")
          .toDate();

    return startDate === null
      ? ""
      : ` (til ${moment(pmiEndDate).format("DD-MMM YYYY")})`;
  }

  getSchedules(formValues) {
    const endDate = this.getEndDate(formValues);
    const startDate = formValues.startDate || new Date();
    const paymentFrequency = formValues.paymentFrequency;

    if (paymentFrequency === "monthly") {
      return enumerateDaysBetweenDates(startDate, endDate, 1, "months");
    } else {
      return enumerateDaysBetweenDates(startDate, endDate, 2, "weeks");
    }
  }

  //calculation for principal amount
  get principalPayment() {
    const { formValues } = this;
    let { totalExtraPayment } = this.getTotalExtraPaymentAndInterest(
      this.formValues
    );
    const mortgageAmount = parseFloat(formValues.mortgageAmount);

    return mortgageAmount - totalExtraPayment;
  }

  //calculation for the total monthy payment

  get totalDownPayment() {
    const { formValues } = this;
    const downPayment = parseFloat(formValues.downPayment);
    const oneTimeExpenses = parseFloat(formValues.oneTimeExpenses);

    return parseFloat(downPayment + oneTimeExpenses);
  }

  get totalInterestPayment() {
    const { formValues } = this;
    const mortgageAmount = parseFloat(formValues.mortgageAmount);
    const totalInterestPayment =
      this.getMonthlyPrincipalInterest(formValues) * 360 - mortgageAmount;

    return totalInterestPayment;
  }

  get totalTaxesPMIInsuranceFeePayment() {
    const { formValues } = this;
    const numberOfPaymentsYr = this.getPayments_Yr(formValues);
    let {
      totalAmortizationMonths,
      totalAmortizationBiWeekly,
    } = this.getTotalExtraPaymentAndInterest(this.formValues);
    const totalAmortizationPeriod =
      formValues.paymentFrequency === PAYMENT_FREQUENCY.MONTHLY
        ? totalAmortizationMonths
        : totalAmortizationBiWeekly;
    let { pmiMonths, pmiBiWeekly } = this.getPMIDuration(formValues);
    const pmiDuration =
      formValues.paymentFrequency === PAYMENT_FREQUENCY.MONTHLY
        ? pmiMonths
        : pmiBiWeekly;

    var totalTaxesPMIInsuranceFeePayment =
      (formValues.pmi_yr / numberOfPaymentsYr) * pmiDuration +
      (formValues.propertyTaxes_Yr / numberOfPaymentsYr) *
      totalAmortizationPeriod +
      (formValues.homeInsurance_Yr / numberOfPaymentsYr) *
      totalAmortizationPeriod;

    return totalTaxesPMIInsuranceFeePayment;
  }

  get totalPayment() {
    let {
      totalExtraPayment,
      totalInterestWithExtraPayment,
    } = this.getTotalExtraPaymentAndInterest(this.formValues);

    const totalPayment =
      this.totalDownPayment +
      this.principalPayment +
      totalExtraPayment +
      totalInterestWithExtraPayment +
      this.totalTaxesPMIInsuranceFeePayment;

    return totalPayment;
  }
}

export default new Calculator();