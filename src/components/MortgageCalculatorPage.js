/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Kevin de Guzman <kevin@realtyview.com>
 */

import React from "react";
import MainLayout from "../components/layouts/main";
import MortgageCalculator from "../modules/MortgageCalculator";
import "../styles/MortgageCalculator.scss";

class MortgageCalculatorPage extends React.Component {
  render() {
    return (
      <MainLayout layoutClassName="mortgage-calculator-page"> 
        <MortgageCalculator />
      </MainLayout>
    );
  };
}

export default MortgageCalculatorPage;
