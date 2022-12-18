/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import {
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Checkbox,
  Button,
  Message,
  Alert } from 'rsuite';
import * as EmailValidator from 'email-validator';
import axios from 'axios';

import * as actionCreators from '../actions/actionCreators';
import logo from '../images/logo.svg';
import '../styles/SignInPage.scss';


class SignInPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignIn = this.handleSignIn.bind(this);
    this.validateForm = this.validateForm.bind(this);

    this.state = {
      email: '',
      password: '',
      rememberMe: false,
      formErrorMessages: []
    };
  }

  handleSignIn() {
    if (this.validateForm()) {
      axios.post(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/user/login`, {
        email: this.state.email,
        password: this.state.password
      }, {
        withCredentials: true
      })
      .then(({ data }) => {
        // Receive a JWT token and store it as a cookie. HttpOnly and Secure;
        if (data) {
          // Set global user object in the redux store
          this.props.setUser(data.user);
          window.location = "/";
        }
      })
      .catch((err) => {
        // Invalid user
        Alert.error("The email or password you entered does not match our records.", 5000);
      });
    }
  }

  validateForm() {
    let errors = [];

    this.setState({
      formErrorMessages: []
    });

    if (!EmailValidator.validate(this.state.email)) {
      errors.push('Invalid email');
    }

    if (this.state.email.length === 0) {
      errors.push('Email field is required')
    }

    if (this.state.password.length === 0) {
      errors.push('Password field is required');
    }

    this.setState({
      formErrorMessages: errors
    });

    return (errors.length === 0);
  }

  render() {
    return (
      <div className="sign-in-page">
        <div className="left">
          <nav>
            <h1 className="logo">
              <img src={logo} alt="logo" width="167" />
            </h1>
          </nav>

          <section className="sign-in-segment">
            <h2>Sign in to your account</h2>
            <p>Don't have an account yet? <Link to="/sign-up"><u>Sign Up</u></Link></p>

            <Form id="sign-in-form" fluid>
              <FormGroup>
                <FormControl
                  name="email"
                  placeholder="Email Address"
                  value={this.state.email}
                  onChange={(value) => {
                    this.setState({
                      email: value
                    });
                  }}
                />
              </FormGroup>

              <FormGroup>
                <FormControl
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={(value) => {
                    this.setState({
                      password: value
                    });
                  }}
                />
              </FormGroup>

              <div className="inline-group">
                <Checkbox
                  value={this.state.rememberMe}
                  onChange={(value, checked) => {
                    this.setState({
                      rememberMe: checked
                    });
                  }}
                >
                <strong>Remember me</strong>
                </Checkbox>


                <Button appearance="link">Forgot password?</Button>
              </div>

              <br />

              <center>
                <Button
                  appearance="primary"
                  onClick={this.handleSignIn}
                >
                  Sign In
                </Button>
              </center>

              <br />

              {this.state.formErrorMessages.map((errMsg) => {
                return (
                  <Message type="error" description={errMsg} />
                );
              })}
            </Form>
          </section>
        </div>
        <div className="right">

        </div>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actionCreators, dispatch);
};

export default connect(null, mapDispatchToProps)(SignInPage);
