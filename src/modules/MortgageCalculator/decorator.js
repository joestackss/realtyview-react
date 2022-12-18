import createDecorator from "final-form-calculate";
import calculator from "./calculator";

export default createDecorator(
  {
    field: "paymentFrequency",
    updates: {
      schedules: (paymentFrequency, formValues) => {
        return calculator.getSchedules({ ...formValues, paymentFrequency });
      },
    },
  },
  {
    field: "startDate",
    updates: {
      endDate: (startDate, formValues) => {
        return calculator.getEndDate({ ...formValues, startDate });
      },
      schedules: (startDate, formValues) => {
        return calculator.getSchedules({ ...formValues, startDate });
      },
    },
  },
  {
    field: "amortizationPeriodYr",
    updates: {
      endDate: (startDate, formValues) => {
        return calculator.getEndDate({ ...formValues, startDate });
      },
      schedules: (startDate, formValues) => {
        return calculator.getSchedules({ ...formValues, startDate });
      },
    },
  },
  {
    field: "amortizationPeriodMo",
    updates: {
      endDate: (startDate, formValues) => {
        return calculator.getEndDate({ ...formValues, startDate });
      },
      schedules: (startDate, formValues) => {
        return calculator.getSchedules({ ...formValues, startDate });
      },
    },
  }
);