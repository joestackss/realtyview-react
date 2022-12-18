/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from 'react';
import { Link } from 'react-router-dom';
import {
  Form,
  FormGroup,
  FormControl,
  Checkbox,
  Button,
  SelectPicker } from 'rsuite';
import * as EmailValidator from 'email-validator';
import * as PasswordValidator from 'password-validator';
import axios from 'axios';
import empty from 'is-empty';

import logo from '../images/logo.svg';
import '../styles/SignUpPage.scss';


class SignUpPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleSignUp = this.handleSignUp.bind(this);
    this.handleActivationResend = this.handleActivationResend.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.resetForm = this.resetForm.bind(this);

    this.state = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      licenseType: "",
      mlsAffiliation: "",
      company: "",
      acceptTerms: false,
      newsletterEnrolled: false,
      formErrorMessages: {},
      registered: false,
      resendCode: "",
    };
  }

  /**
   * test password strength by meeting the listed requirements
   * @param {string} password
   * @return {boolean}
   * the result of the test
   */
  testPasswordStrength(password) {
    // Create a schema
    const schema = new PasswordValidator();
    schema
      .is().min(8)           // Minimum length 8
      .is().max(100)         // Maximum length 100
      .has().uppercase()     // Must have uppercase letters
      .has().lowercase()     // Must have lowercase letters
      .has().digits()        // Must have digits
      .has().not().spaces()  // Should not have spaces

      return schema.validate(password);
  }

  validateForm() {
    let errors = {};

    if (empty(this.state.firstName)) {
      errors['firstName'] = "Required field";
    }

    if (empty(this.state.lastName)) {
      errors['lastName'] = "Required field";
    }

    if (!EmailValidator.validate(this.state.email)) {
      errors['email'] = "Invalid email";
    }

    if (empty(this.state.email)) {
      errors['email'] = "Required field";
    }

    // // Check password strength
    if (!this.testPasswordStrength(this.state.password)) {
      errors['password'] = "Password should be at least 8 alphanumeric characters with at least 1 capital character.";
    }

    if (empty(this.state.password)) {
      errors['password'] = "Required field";
    }

    if (this.state.password !== this.state.confirmPassword) {
      errors['confirmPassword'] = "Passwords do not match";
    }

    if (empty(this.state.licenseType)) {
      errors['licenseType'] = "Required field";
    }

    if (empty(this.state.company)) {
      errors['company'] = "Required field";
    }

    if (!this.state.acceptTerms) {
      errors['acceptTerms'] = "You must agree to the terms to continue";
    }

    this.setState({ formErrorMessages: errors });

    return empty(errors);
  }

  /**
   * Resends activation email
   */
  handleActivationResend() {
    if(!empty(this.state.resendCode)) {
      axios
        .get(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/user/resend-activation/${this.state.resendCode}`)
        .then((response) => {
          if (response.status === 200) {
            // Email was resent
            console.log('Email was resent');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  handleSignUp() {
    if (this.validateForm()) {
      axios.post(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/user/register`, {
        first_name: this.state.firstName,
        last_name: this.state.lastName,
        email: this.state.email,
        password: this.state.password,
        license_type: this.state.licenseType,
        company: this.state.company,
        newsletter_enrolled: this.state.newsletterEnrolled
      }).then((response) => {
        if (response.status === 201) {
          this.setState({
            registered: true,
            resendCode: response.data.resend_code
          });
        }
      }).catch((err) => {
        console.log(err);
      });
    }
  }

  resetForm() {
    this.setState({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      acceptTerms: false,
    });
  }

  render() {
    return (
      <div className="sign-up-page">
        <main>
          <div className="left">
            <nav>
              <h1 className="logo">
                <img src={logo} alt="logo" width="167" />
              </h1>
            </nav>

            {this.state.registered ? (
              <div className="sign-up-success-segment segment">
                <h2>Thank you for registering</h2>
                <p>We have sent a confirmation email to your email address. Didn't receive it? Click Resend.</p>
                <center>
                  <Button
                    appearance="primary"
                    onClick={this.handleActivationResend}
                  >
                    Resend
                  </Button>
                </center>
                <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>
              </div>
            ) : (
              <div className="sign-up-segment segment">
                <h2>Create your account</h2>
                <p>Already have an account? <Link to="/sign-in">Sign In</Link></p>

                <Form id="sign-up-form" fluid>
                  <FormGroup>
                    <FormControl
                      name="first_name"
                      placeholder="First Name"
                      onChange={(value) => {
                        this.setState({
                          firstName: value
                        });
                      }}
                      errorMessage={this.state.formErrorMessages.hasOwnProperty('firstName') ? this.state.formErrorMessages.firstName : ""}
                      errorPlacement="rightStart"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormControl
                      name="last_name"
                      placeholder="Last Name"
                      onChange={(value) => {
                        this.setState({
                          lastName: value
                        });
                      }}
                      errorMessage={this.state.formErrorMessages.hasOwnProperty('lastName') ? this.state.formErrorMessages.lastName : ""}
                      errorPlacement="rightStart"
                    />
                  </FormGroup>

                  <FormGroup>
                    <FormControl
                      name="email"
                      placeholder="Email Address"
                      onChange={(value) => {
                        this.setState({
                          email: value
                        });
                      }}
                      errorMessage={this.state.formErrorMessages.hasOwnProperty('email') ? this.state.formErrorMessages.email : ""}
                      errorPlacement="rightStart"
                    />
                  </FormGroup>

                  <div className="row">
                    <div className="col-md-6">
                      <FormGroup>
                        <FormControl
                          name="password"
                          type="password"
                          placeholder="Password"
                          onChange={(value) => {
                            this.setState({
                              password: value
                            });
                          }}
                          errorMessage={this.state.formErrorMessages.hasOwnProperty('password') ? this.state.formErrorMessages.password : ""}
                          errorPlacement="rightStart"
                        />
                      </FormGroup>
                    </div>
                    <div className="col-md-6">
                      <FormGroup>
                        <FormControl
                          name="password"
                          type="password"
                          placeholder="Confirm Password"
                          value={this.state.confirmPassword}
                          onChange={(value) => {
                            this.setState({
                              confirmPassword: value
                            });
                          }}
                          errorMessage={this.state.formErrorMessages.hasOwnProperty('confirmPassword') ? this.state.formErrorMessages.confirmPassword : ""}
                          errorPlacement="rightStart"
                        />
                      </FormGroup>
                    </div>
                  </div>

                  <div className="row mt-lg">
                    <div className="col-md-12">
                      <FormGroup>
                        <SelectPicker
                          data={[
                            {value: "Agent", label: "Agent"},
                            {value: "Associate Broker", label: "Associate Broker"},
                            {value: "Broker Owner", label: "Broker Owner"}
                          ]}
                          placeholder="License Type"
                          searchable={false}
                          cleanable={false}
                          value={this.state.licenseType}
                          onChange={(value) => {
                            this.setState({licenseType: value});
                          }}
                          block
                          errorMessage={this.state.formErrorMessages.hasOwnProperty('licenseType') ? this.state.formErrorMessages.licenseType : ""}
                          errorPlacement="rightStart"
                        />
                    </FormGroup>
                    </div>
                  </div>

                  <div className="row mt-lg">
                    <div className="col-md-12">
                      <FormGroup>
                        <SelectPicker
                          data={[]}
                          placeholder="MLS Affiliation"
                          searchable={false}
                          block
                        />
                      </FormGroup>
                    </div>
                  </div>

                  <div className="row mt-lg">
                    <div className="col-md-12">
                      <FormGroup>
                        <FormControl
                          name="company"
                          placeholder="Brokerage/Company Name"
                          onChange={(value) => {
                            this.setState({
                              company: value
                            });
                          }}
                          value={this.state.company}
                          errorMessage={this.state.formErrorMessages.hasOwnProperty('company') ? this.state.formErrorMessages.company : ""}
                          errorPlacement="rightStart"
                        />
                    </FormGroup>
                    </div>
                  </div>

                  <FormGroup className="mt-lg">
                    <Checkbox
                      value={this.state.acceptTerms}
                      onChange={(value, checked) => {
                        this.setState({
                          acceptTerms: checked
                        });
                      }}
                    >
                      <strong>Accept the platform <Link>Terms of Service</Link></strong>
                    </Checkbox>

                    <Checkbox
                      value={this.state.newsletterEnrolled}
                      onChange={(value, checked) => {
                        this.setState({
                          newsletterEnrolled: checked
                        });
                      }}
                    >
                      <strong>Sign me up to Realtyview's newsletter</strong>
                    </Checkbox>
                  </FormGroup>

                  <FormGroup>
                    <center>
                      <Button
                        appearance="primary"
                        onClick={this.handleSignUp}
                      >
                        Sign Up
                      </Button>
                    </center>
                  </FormGroup>
                </Form>
              </div>
            )}
          </div>

          <div className="right"></div>
        </main>
      </div>
    );
  }
}

export default SignUpPage;
