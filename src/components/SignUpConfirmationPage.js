/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

import logo from '../images/logo.svg';
import '../styles/SignUpConfirmationPage.scss';

class SignUpConfirmationPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      accountActivated: false,
      error: false,
      isLoading: true
    };
  }

  componentDidMount() {
    const { match: { params } } = this.props;

    axios.post(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/user/activate`, {
      email: params.email,
      code: params.code
    }).then((response) => {
      if (response.status === 201) {
        this.setState({
          accountActivated: true,
          isLoading: false
        })
      }
    }).catch((err) => {
      this.setState({
        error: true,
        isLoading: false
      });
    });
  }

  render() {
    return (
      this.state.isLoading ? (<div></div>) : (
        <div className="signup-confirmation-page">
          <div className="left">
            <nav>
              <h1 className="logo">
                <img src={logo} alt="logo" width="167" />
              </h1>
            </nav>

            <section className="sign-up-confirmation-segment">
              {this.state.error ? (
                <span>
                  <p className="message">Account could not be activated. Your link may be expired.</p>
                </span>
              ) : (
                <span>
                  <p className="message">Account is now activated</p>
                  <center><Link to="/sign-in" className="rs-btn rs-btn-primary">Sign In</Link></center>
                </span>
              )}
            </section>
          </div>

          <div className="right"></div>
        </div>
      )
    );
  }
}

export default SignUpConfirmationPage;
