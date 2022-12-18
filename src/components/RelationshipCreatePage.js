import React from 'react';
import { connect } from 'react-redux';
import { post } from 'axios';
import empty from 'is-empty';
import qs from 'qs';
import {
  Container,
  Panel,
  Form,
  FormGroup,
  ControlLabel,
  FormControl,
  Button,
  SelectPicker,
  InputGroup,
  Input,
  Icon,
  DatePicker
} from 'rsuite';
import * as EmailValidator from 'email-validator';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import InputTags from './InputTags';
import classNames from 'classnames';


import TopNav from './TopNav';
import RV_Sidebar from './RV_Sidebar';
import '../styles/RelationshipCreatePage.scss';

const allowedFileMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg"
]

class RelationshipCreatePage extends React.Component {
  constructor(props) {
    super(props);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormValidation = this.handleFormValidation.bind(this);
    this.addAdditionalPlace = this.addAdditionalPlace.bind(this);
    this.addAdditionalDocument = this.addAdditionalDocument.bind(this);

    this.state = {
      steps: [
        "Buyer Details",
        "Home Search",
        "Places That Matter",
        "Finances",
        "Documents"
      ],
      currentStep: 1,
      numOfSteps: 5,
      formErrorMessages: {},
      isProcessing: false,
      relationshipTypes: [],
      primaryBuyerFirstName: "Ace",
      primaryBuyerLastName: "Venture",
      primaryBuyerEmail: "aventura@gmail.com",
      primaryBuyerPhone: "3234347788",
      primaryBuyerAddress: "55-01 Santa Monica",
      secondaryBuyerFirstName: "",
      secondaryBuyerLastName: "",
      secondaryBuyerEmail: "",
      secondaryBuyerPhone: "",
      secondaryBuyerAddress: "",
      homeSearchNeighborhoods: "",
      homeSearchMaximumMonthlyPayment: "",
      homeSearchSchoolDistricts: "",
      homeSearchZipcode: "",
      homeSearchPropertyType: "",
      homeSearchMinHomeSize: "",
      homeSearchMinLotSize: "",
      homeSearchStories: "",
      homeSearchMinBedrooms: "",
      homeSearchMinBathrooms: "",
      homeSearchHeatingAndCooling: "",
      homeSearchParking: "",
      homeSearchGarage: "",
      homeSearchLotTypesAndViews: "",
      homeSearchNewConstruction: "",
      homeSearchPool: "",
      homeSearchAmenities: "",
      homeSearchKeywords: "",
      lenderDetailsLender: "",
      lenderDetailsLenderCompanyPhone: "",
      lenderDetailsLenderSupportEmail: "",
      loanOfficerDetailsLoanOfficerName: "",
      loanOfficerDetailsLoanOfficerPhone: "",
      loanOfficerDetailsLoanOfficerEmail: "",
      financesPreApprovalDate: "",
      financesBorrower1: "",
      financesBorrower2: "",
      financesLoanType: "",
      financesPurchasePrice: "",
      financesSellerConcession: "",
      financesDownPaymentAmount: "",
      financesBaseLoanAmount: "",
      financesLoanToValue: "",
      financesMonthlyTaxes: "",
      financesHomeOwnersInsurance: "",
      financesHomeOwnersAssociation: "",
      financesMortgageRate: "",
      financesAdditionalFees: "",
      financesLenderCredit: "",
      placesThatMatter: [{
        name: "",
        address: ""
      }],
      documents: [{
        name: "",
        fileName: "",
        handler: "",
      }]
    }
  }

  componentDidMount() {
    const queryString = qs.parse(this.props.location.search.replace("?", ""));
    if (queryString.hasOwnProperty('type')) {
      this.setState({
        relationshipTypes: queryString.type
      })
    } else {
      // Set flash message for redirect.
      this.props.history.push('/relationships');
    }
  }

  /**
   * Add additional place inputs for the places
   * that matter section of the form.
   */
  addAdditionalPlace() {
    this.setState((prevState) => {
      return {
        placesThatMatter: [...prevState.placesThatMatter, {
          "name": "",
          "address": ""
        }]
      }
    })
  }

  /**
   * Add additional document inputs for documents on the form
   */
  addAdditionalDocument() {
    this.setState((prevState) => {
      return {
        documents: [...prevState.documents, {
          name: "",
          fileName: "",
          handler: "",
        }]
      }
    })
  }

  /**
   * Go back a step
   */
  handlePrev() {
    if (this.state.currentStep > 1) {
      this.setState((prevState) => {
        return {
          currentStep: prevState.currentStep - 1
        }
      })
    }
  }

  /**
   * Proceed to the next step of the form.
   */
  handleNext() {
    if (this.state.currentStep < this.state.numOfSteps && this.handleFormValidation()) {
      this.setState((prevState) => {
        return {
          currentStep: prevState.currentStep + 1
        }
      })
    }
  }

  async handleSubmit() {
    if (!this.handleFormValidation()) {
      // Add notification on the screen
      alert('Form is not valid');
      return;
    }

    this.setState({
      isProcessing: true
    });

    let formData = new FormData();
    formData.append('relationship_types', JSON.stringify(this.state.relationshipTypes));
    formData.append('primary_buyer_first_name', this.state.primaryBuyerFirstName);
    formData.append('primary_buyer_last_name', this.state.primaryBuyerLastName);
    formData.append('primary_buyer_email', this.state.primaryBuyerEmail);
    formData.append('primary_buyer_phone', this.state.primaryBuyerPhone);
    formData.append('primary_buyer_address', this.state.primaryBuyerAddress);
    formData.append('secondary_buyer_first_name', this.state.secondaryBuyerFirstName);
    formData.append('secondary_buyer_last_name', this.state.secondaryBuyerLastName);
    formData.append('secondary_buyer_email', this.state.secondaryBuyerEmail);
    formData.append('secondary_buyer_phone', this.state.secondaryBuyerPhone);
    formData.append('secondary_buyer_address', this.state.secondaryBuyerAddress);
    formData.append('home_search_neighborhoods', this.state.homeSearchNeighborhoods);
    formData.append('home_search_maximum_monthly_payment', this.state.homeSearchMaximumMonthlyPayment);
    formData.append('home_search_school_districts', this.state.homeSearchSchoolDistricts);
    formData.append('home_search_zipcode', this.state.homeSearchZipcode);
    formData.append('home_search_property_type', this.state.homeSearchPropertyType);
    formData.append('home_search_min_home_size', this.state.homeSearchMinHomeSize);
    formData.append('home_search_min_lot_size', this.state.homeSearchMinLotSize);
    formData.append('home_search_stories', this.state.homeSearchStories);
    formData.append('home_search_min_bedrooms', this.state.homeSearchMinBedrooms);
    formData.append('home_search_min_bathrooms', this.state.homeSearchMinBathrooms);
    formData.append('home_search_heating_and_cooling', this.state.homeSearchHeatingAndCooling);
    formData.append('home_search_parking', this.state.homeSearchParking);
    formData.append('home_search_garage', this.state.homeSearchGarage);
    formData.append('home_search_lot_types_and_views', this.state.homeSearchLotTypesAndViews);
    formData.append('home_search_new_construction', this.state.homeSearchNewConstruction);
    formData.append('home_search_pool', this.state.homeSearchPool);
    formData.append('home_search_amenities', this.state.homeSearchAmenities);
    formData.append('home_search_keywords', this.state.homeSearchKeywords);
    formData.append('lender_details_lender', this.state.lenderDetailsLender);
    formData.append('lender_details_lender_company_phone', this.state.lenderDetailsLenderCompanyPhone);
    formData.append('lender_details_lender_support_email', this.state.lenderDetailsLenderSupportEmail);
    formData.append('loan_officer_details_loan_officer_name', this.state.loanOfficerDetailsLoanOfficerName);
    formData.append('loan_officer_details_loan_officer_phone', this.state.loanOfficerDetailsLoanOfficerPhone);
    formData.append('loan_officer_details_loan_officer_email', this.state.loanOfficerDetailsLoanOfficerEmail);
    formData.append('finances_pre_approval_date', this.state.financesPreApprovalDate);
    formData.append('finances_borrower_1', this.state.financesBorrower1);
    formData.append('finances_borrower_2', this.state.financesBorrower2);
    formData.append('finances_loan_type', this.state.financesLoanType);
    formData.append('finances_purchase_price', this.state.financesPurchasePrice);
    formData.append('finances_seller_concession', this.state.financesSellerConcession);
    formData.append('finances_down_payment_amount', this.state.financesDownPaymentAmount);
    formData.append('finances_base_loan_amount', this.state.financesBaseLoanAmount);
    formData.append('finances_loan_to_value', this.state.financesLoanToValue);
    formData.append('finances_monthly_taxes', this.state.financesMonthlyTaxes);
    formData.append('finances_home_owners_insurance', this.state.financesHomeOwnersInsurance);
    formData.append('finances_home_owners_association', this.state.financesHomeOwnersAssociation);
    formData.append('finances_mortgage_rate', this.state.financesMortgageRate);
    formData.append('finances_additional_fees', this.state.financesAdditionalFees);
    formData.append('finances_lender_credit', this.state.financesLenderCredit);
    formData.append('places_that_matter', JSON.stringify(this.state.placesThatMatter));

    const documents = this.state.documents.map((document) => {
      formData.append('file[]', document.handler);

      return {
        name: document.name,
        file_name: document.fileName,
      }
    });

    formData.append('documents', JSON.stringify(documents));

    const response = await post(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/relationship/add`, formData, {
      headers: {
        "content-type": "multipart/form-data"
      },
      withCredentials: true
    });

    if (response.status === 201) {
      this.setState({
        isProcessing: false
      });

      // Set flash message for redirect.
      window.flash('Relationship was created', 'success', 'success');
      // window.location.replace("/relationships");
      this.props.history.push('/relationships');
    }
  }

  handleFormValidation() {
    let errors = {};
    if (empty(this.state.primaryBuyerFirstName)) {
      errors["primaryBuyerFirstName"] = "Required field";
    }

    if (empty(this.state.primaryBuyerLastName)) {
      errors["primaryBuyerLastName"] = "Required field";
    }

    if (empty(this.state.primaryBuyerEmail)) {
      errors["primaryBuyerEmail"] = "Required field";
    }

    if (empty(this.state.primaryBuyerPhone)) {
      errors["primaryBuyerPhone"] = "Required field";
    }

    if (empty(this.state.primaryBuyerAddress)) {
      errors["primaryBuyerAddress"] = "Required field";
    }

    if (!EmailValidator.validate(this.state.primaryBuyerEmail)) {
      errors['primaryBuyerEmail'] = "Invalid email";
    }

    this.setState({ formErrorMessages: errors });

    return empty(errors);

  }

  render() {
    return (
      <div className="relationships-create-page">
        <main>
          <Container>
            <div className="rs-sidebar-wrapper fixed">
              <RV_Sidebar />
            </div>

            <Container className={classNames({
              "page-context": true,
              "stretched": this.props.isSideMenuOpen === false
            })}>
              <TopNav user={this.props.user} />

              <h2 className="page-context-title">Add Relationship</h2>

              <Form className="add-relationship-form" fluid>
                <ul className="steps-progress">
                  {this.state.steps.map((step, index) => {
                    return (
                      <li className={classNames({
                        active: this.state.currentStep === (index + 1)
                      })}>
                        <label>Step {index + 1}</label>
                        <div>{step}</div>
                      </li>
                    )
                  })}
                </ul>

                <div className="steps">
                  <div className={classNames({
                    "step-1": true,
                    hide: this.state.currentStep !== 1
                  })}>
                    <Panel bordered>
                      <label className="panel-heading-text">Primary Buyer</label>
                      <div className="row">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>First Name <span className="required-input-symbol">*</span></ControlLabel>
                            <FormControl
                              name="first_name"
                              value={this.state.primaryBuyerFirstName}
                              onChange={(value) => {
                                this.setState({
                                  primaryBuyerFirstName: value
                                });
                              }}
                              errorMessage={this.state.formErrorMessages.hasOwnProperty('primaryBuyerFirstName') ? this.state.formErrorMessages.primaryBuyerFirstName : ""}
                              errorPlacement="rightStart"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Last Name <span className="required-input-symbol">*</span></ControlLabel>
                            <FormControl
                              name="last_name"
                              value={this.state.primaryBuyerLastName}
                              onChange={(value) => {
                                this.setState({
                                  primaryBuyerLastName: value
                                });
                              }}
                              errorMessage={this.state.formErrorMessages.hasOwnProperty('primaryBuyerLastName') ? this.state.formErrorMessages.primaryBuyerLastName : ""}
                              errorPlacement="rightStart"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Email Address <span className="required-input-symbol">*</span></ControlLabel>
                            <FormControl
                              name="email"
                              value={this.state.primaryBuyerEmail}
                              onChange={(value) => {
                                this.setState({
                                  primaryBuyerEmail: value
                                });
                              }}
                              errorMessage={this.state.formErrorMessages.hasOwnProperty('primaryBuyerEmail') ? this.state.formErrorMessages.primaryBuyerEmail : ""}
                              errorPlacement="rightStart"
                            />
                          </FormGroup>
                        </div>
                      </div>
                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Phone Number <span className="required-input-symbol">*</span></ControlLabel>
                            <MaskedInput
                              mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                              name="phone"
                              className="rs-input"
                              value={this.state.primaryBuyerPhone}
                              onChange={(e) => {
                                this.setState({
                                  primaryBuyerPhone: e.target.value
                                });
                              }}
                              errorMessage={this.state.formErrorMessages.hasOwnProperty('primaryBuyerPhone') ? this.state.formErrorMessages.primaryBuyerPhone : ""}
                              errorPlacement="rightStart"
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-8">
                          <FormGroup>
                            <ControlLabel>Address <span className="required-input-symbol">*</span></ControlLabel>
                            <FormControl
                              name="address"
                              value={this.state.primaryBuyerAddress}
                              onChange={(value) => {
                                this.setState({
                                  primaryBuyerAddress: value
                                });
                              }}
                              errorMessage={this.state.formErrorMessages.hasOwnProperty('primaryBuyerAddress') ? this.state.formErrorMessages.primaryBuyerAddress : ""}
                              errorPlacement="rightStart"
                            />
                          </FormGroup>
                        </div>
                      </div>
                    </Panel>

                    <Panel className="mt-lg" bordered>
                      <label className="panel-heading-text">Secondary Buyer</label>

                      <div className="row">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>First Name</ControlLabel>
                            <FormControl
                              name="first_name_2"
                              value={this.state.secondaryBuyerFirstName}
                              onChange={(value) => {
                                this.setState({
                                  secondaryBuyerFirstName: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Last Name</ControlLabel>
                            <FormControl
                              name="last_name_2"
                              value={this.state.secondaryBuyerLastName}
                              onChange={(value) => {
                                this.setState({
                                  secondaryBuyerLastName: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Email Address</ControlLabel>
                            <FormControl
                              name="email_2"
                              value={this.state.secondaryBuyerEmail}
                              onChange={(value) => {
                                this.setState({
                                  secondaryBuyerEmail: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>
                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Phone Number</ControlLabel>
                            <MaskedInput
                              mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                              name="phone_2"
                              className="rs-input"
                              value={this.state.secondaryBuyerPhone}
                              onChange={(e) => {
                                this.setState({
                                  secondaryBuyerPhone: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-8">
                          <FormGroup>
                            <ControlLabel>Address</ControlLabel>
                            <FormControl
                              name="address_2"
                              value={this.state.secondaryBuyerAddress}
                              onChange={(value) => {
                                this.setState({
                                  secondaryBuyerAddress: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>
                    </Panel>
                  </div>

                  <div className={classNames({
                    "step-2": true,
                    hide: this.state.currentStep !== 2
                  })}>
                    <Panel bordered>
                      <label className="panel-heading-text">Home Search</label>

                      <div className="row">
                        <div className="col-md-8">
                          <FormGroup>
                            <ControlLabel>Neighborhoods</ControlLabel>
                            <InputTags
                              name="neighborhoods"
                              value={this.state.homeSearchNeighborhoods}
                              onChange={(e) => {
                                this.setState({
                                  homeSearchNeighborhoods: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Maximum Monthly Payment</ControlLabel>
                            <MaskedInput
                              className="rs-input"
                              name="maximum_montly_payment"
                              mask={createNumberMask({
                                prefix: '$ '
                              })}
                              value={this.state.homeSearchMaximumMonthlyPayment}
                              onChange={(e) => {
                                this.setState({
                                  homeSearchMaximumMonthlyPayment: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-8">
                          <FormGroup>
                            <ControlLabel>School Districts</ControlLabel>
                            <InputTags
                              name="school_districts"
                              value={this.state.homeSearchSchoolDistricts}
                              onChange={(e) => {
                                this.setState({
                                  homeSearchSchoolDistricts: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Zip Code</ControlLabel>
                            <MaskedInput
                              name="zip_code"
                              className="rs-input"
                              mask={createNumberMask({
                                prefix: '',
                                includeThousandsSeparator: false,
                                integerLimit: 5
                              })}
                              value={this.state.homeSearchZipcode}
                              onChange={(e) => {
                                this.setState({
                                  homeSearchZipcode: e.target.value
                                });
                              }}
                              value={this.state.homeSearchZipcode}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Property Type</ControlLabel>
                            <SelectPicker
                              data={[
                                {
                                  "label": "Single Family",
                                  "value": "Single Family"
                                },
                                {
                                  "label": "Multi-Family (1-4 Units)",
                                  "value": "Multi-Family (1-4 Units)"
                                },
                                {
                                  "label": "Mixed Use",
                                  "value": "Mixed Use"
                                },
                                {
                                  "label": "Commercial",
                                  "value": "Commercial"
                                },
                                {
                                  "label": "Land/Farm/Estate",
                                  "value": "Land/Farm/Estate"
                                }
                              ]}
                              searchable={false}
                              block
                              value={this.state.homeSearchPropertyType}
                              onChange={(value) => {
                                this.setState({
                                  homeSearchPropertyType: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Min. Home Size (SqFt)</ControlLabel>
                            <MaskedInput
                              name="min_home_size"
                              className="rs-input"
                              mask={createNumberMask({
                                prefix: '',
                                integerLimit: 6
                              })}
                              value={this.state.homeSearchMinHomeSize}
                              onChange={(e) => {
                                this.setState({
                                  homeSearchMinHomeSize: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Min. Lot Size</ControlLabel>
                            <MaskedInput
                              name="min_lot_size"
                              className="rs-input"
                              mask={createNumberMask({
                                prefix: '',
                                integerLimit: 6
                              })}
                              value={this.state.homeSearchMinLotSize}
                              onChange={(e) => {
                                this.setState({
                                  homeSearchMinLotSize: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Stories</ControlLabel>
                            <MaskedInput
                              name="stories"
                              className="rs-input"
                              value={this.state.homeSearchStories}
                              mask={createNumberMask({
                                prefix: '',
                                integerLimit: 3
                              })}
                              onChange={(e) => {
                                this.setState({
                                  homeSearchStories: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Min. Bedrooms</ControlLabel>
                            <MaskedInput
                              name="min_bedrooms"
                              className="rs-input"
                              value={this.state.homeSearchMinBedrooms}
                              mask={createNumberMask({
                                prefix: '',
                                integerLimit: 3
                              })}
                              onChange={(e) => {
                                this.setState({
                                  homeSearchMinBedrooms: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Min. Bathrooms</ControlLabel>
                            <MaskedInput
                              name="min_bathrooms"
                              className="rs-input"
                              value={this.state.homeSearchMinBathrooms}
                              mask={createNumberMask({
                                prefix: '',
                                integerLimit: 3
                              })}
                              onChange={(e) => {
                                this.setState({
                                  homeSearchMinBathrooms: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Heating &amp; Cooling</ControlLabel>
                            <FormControl
                              name="heating_and_cooling"
                              value={this.state.homeSearchHeatingAndCooling}
                              onChange={(value) => {
                                this.setState({
                                  homeSearchHeatingAndCooling: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Parking</ControlLabel>
                            <SelectPicker
                              data={[
                                {
                                  "label": "Private",
                                  "value": "Private"
                                },
                                {
                                  "label": "Shared",
                                  "value": "Shared"
                                },
                                {
                                  "label": "Community",
                                  "value": "Community"
                                },
                                {
                                  "label": "None",
                                  "value": "None"
                                }
                              ]}
                              searchable={false}
                              block
                              value={this.state.homeSearchParking}
                              onChange={(value) => {
                                this.setState({
                                  homeSearchParking: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Garage</ControlLabel>
                            <SelectPicker
                              data={[
                                {
                                  "label": "Yes, Attached",
                                  "value": "Yes, Attached"
                                },
                                {
                                  "label": "Yes, detached",
                                  "value": "Yes, detached"
                                },
                                {
                                  "label": "None",
                                  "value": "None"
                                }
                              ]}
                              searchable={false}
                              block
                              value={this.state.homeSearchGarage}
                              onChange={(value) => {
                                this.setState({
                                  homeSearchGarage: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Lot Types &amp; Views</ControlLabel>
                            <FormControl
                              name="lot_types_and_views"
                              value={this.state.homeSearchLotTypesAndViews}
                              onChange={(value) => {
                                this.setState({
                                  homeSearchLotTypesAndViews: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>New Construction</ControlLabel>
                            <FormControl
                              name="new_construction"
                              value={this.state.homeSearchNewConstruction}
                              onChange={(value) => {
                                this.setState({
                                  homeSearchNewConstruction: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Pool</ControlLabel>
                            <SelectPicker
                              data={[
                                {
                                  "label": "Yes, Above Ground.",
                                  "value": "Yes, Above Ground."
                                },
                                {
                                  "label": "Yes, In-Ground",
                                  "value": "Yes, In-Ground"
                                },
                                {
                                  "label": "No",
                                  "value": "No"
                                }
                              ]}
                              searchable={false}
                              block
                              value={this.state.homeSearchPool}
                              onChange={(value) => {
                                this.setState({
                                  homeSearchPool: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-12">
                          <FormGroup>
                            <ControlLabel>Amenities</ControlLabel>
                            <InputTags
                              name="amenities"
                              value={this.state.homeSearchAmenities}
                              onChange={(e) => {
                                this.setState({
                                  homeSearchAmenities: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-12">
                          <FormGroup>
                            <ControlLabel>Keywords</ControlLabel>
                            <InputTags
                              name="keywords"
                              value={this.state.homeSearchKeywords}
                              onChange={(e) => {
                                this.setState({
                                  homeSearchKeywords: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>
                    </Panel>
                  </div>

                  <div className={classNames({
                    "step-3": true,
                    hide: this.state.currentStep !== 3
                  })}>
                    <Panel bordered>
                      <label className="panel-heading-text">PLACES THAT MATTER</label>

                      {this.state.placesThatMatter.map((place, i) => {
                        return (
                          <div className="row place-row" key={i}>
                            <div className="col-md-4">
                              <FormGroup>
                                <ControlLabel>Name</ControlLabel>
                                <FormControl
                                  value={place.name}
                                  onChange={value => {
                                    this.setState((prevState) => {
                                      const placesThatMatter = prevState.placesThatMatter;
                                      placesThatMatter[i]['name'] = value;

                                      return {
                                        placesThatMatter
                                      }
                                    });
                                  }}
                                />
                              </FormGroup>
                            </div>
                            <div className="col-md-8">
                              <FormGroup>
                                <ControlLabel>Address</ControlLabel>
                                <FormControl
                                  value={place.address}
                                  onChange={value => {
                                    this.setState((prevState) => {
                                      const placesThatMatter = prevState.placesThatMatter;
                                      placesThatMatter[i]['address'] = value;

                                      return {
                                        placesThatMatter
                                      }
                                    });
                                  }}
                                />
                              </FormGroup>
                            </div>
                          </div>
                        )
                      })}

                      <Button
                        appearance="primary"
                        className="mt-lg"
                        onClick={this.addAdditionalPlace}
                      >
                        + Add Place
                      </Button>

                    </Panel>
                  </div>

                  <div className={classNames({
                    "step-4": true,
                    hide: this.state.currentStep !== 4
                  })}>
                    <Panel bordered>
                      <label className="panel-heading-text">LENDER DETAILS</label>

                      <div className="row">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Lender</ControlLabel>
                            <FormControl
                              value={this.state.lenderDetailsLender}
                              onChange={(value) => {
                                this.setState({
                                  lenderDetailsLender: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Lender Company Phone</ControlLabel>
                            <MaskedInput
                              mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                              name="phone"
                              className="rs-input"
                              value={this.state.lenderDetailsLenderCompanyPhone}
                              onChange={(e) => {
                                this.setState({
                                  lenderDetailsLenderCompanyPhone: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Lender Support Email</ControlLabel>
                            <FormControl
                              value={this.state.lenderDetailsLenderSupportEmail}
                              onChange={(value) => {
                                this.setState({
                                  lenderDetailsLenderSupportEmail: value
                                })
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>
                    </Panel>

                    <Panel className="mt-lg" bordered>
                      <label className="panel-heading-text">LOAN OFFICER DETAILS</label>

                      <div className="row">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Loan Officer Name</ControlLabel>
                            <FormControl
                              value={this.state.loanOfficerDetailsLoanOfficerName}
                              onChange={(value) => {
                                this.setState({
                                  loanOfficerDetailsLoanOfficerName: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Loan Office Phone</ControlLabel>
                            <MaskedInput
                              mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                              name="phone"
                              className="rs-input"
                              value={this.state.loanOfficerDetailsLoanOfficerPhone}
                              onChange={(e) => {
                                this.setState({
                                  loanOfficerDetailsLoanOfficerPhone: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Loan Officer Email</ControlLabel>
                            <FormControl
                              value={this.state.loanOfficerDetailsLoanOfficerEmail}
                              onChange={(value) => {
                                this.setState({
                                  loanOfficerDetailsLoanOfficerEmail: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>
                    </Panel>

                    <Panel className="mt-lg" bordered>
                      <label className="panel-heading-text">FINANCES</label>

                      <div className="row">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Pre-Approval Date</ControlLabel>
                            <DatePicker
                              block
                              onChange={(value) => {
                                this.setState({
                                  financesPreApprovalDate: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Borrower 1</ControlLabel>
                            <FormControl
                              value={this.state.financesBorrower1}
                              onChange={(value) => {
                                this.setState({
                                  financesBorrower1: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Borrower 2</ControlLabel>
                            <FormControl
                              value={this.state.financesBorrower2}
                              onChange={(value) => {
                                this.setState({
                                  financesBorrower2: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Loan Type</ControlLabel>
                            <SelectPicker
                              data={[
                                {
                                  "label": "Conventional",
                                  "value": "Conventional"
                                },
                                {
                                  "label": "FHA",
                                  "value": "FHA"
                                },
                                {
                                  "label": "VA",
                                  "value": "VA"
                                },
                                {
                                  "label": "USDA",
                                  "value": "USDA"
                                },
                                {
                                  "label": "Hard Money",
                                  "value": "Hard Money"
                                },
                                {
                                  "label": "Bridge",
                                  "value": "Bridge"
                                },
                                {
                                  "label": "None",
                                  "value": "None"
                                },
                              ]}
                              searchable={false}
                              block
                              value={this.state.financesLoanType}
                              onChange={(value) => {
                                this.setState({
                                  financesLoanType: value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Purchase Price</ControlLabel>
                            <MaskedInput
                              className="rs-input"
                              mask={createNumberMask({
                                prefix: '$ ',
                                integerLimit: 9
                              })}
                              value={this.state.financesPurchasePrice}
                              onChange={(e) => {
                                this.setState({
                                  financesPurchasePrice: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Seller Concession</ControlLabel>
                            <MaskedInput
                              className="rs-input"
                              mask={createNumberMask({
                                prefix: '$ ',
                                integerLimit: 9
                              })}
                              value={this.state.financesSellerConcession}
                              onChange={(e) => {
                                this.setState({
                                  financesSellerConcession: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Down Payment Amount</ControlLabel>
                            <MaskedInput
                              className="rs-input"
                              mask={createNumberMask({
                                prefix: '$ ',
                                integerLimit: 9
                              })}
                              value={this.state.financesDownPaymentAmount}
                              onChange={(e) => {
                                this.setState({
                                  financesDownPaymentAmount: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Base Loan Amount</ControlLabel>
                            <MaskedInput
                              className="rs-input"
                              mask={createNumberMask({
                                prefix: '$ ',
                                integerLimit: 9
                              })}
                              value={this.state.financesBaseLoanAmount}
                              onChange={(e) => {
                                this.setState({
                                  financesBaseLoanAmount: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Loan to Value</ControlLabel>
                            <MaskedInput
                              className="rs-input"
                              mask={createNumberMask({
                                prefix: '$ ',
                                integerLimit: 9
                              })}
                              value={this.state.financesLoanToValue}
                              onChange={(e) => {
                                this.setState({
                                  financesLoanToValue: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Monthly Taxes</ControlLabel>
                            <MaskedInput
                              className="rs-input"
                              mask={createNumberMask({
                                prefix: '$ ',
                                integerLimit: 9
                              })}
                              value={this.state.financesMonthlyTaxes}
                              onChange={(e) => {
                                this.setState({
                                  financesMonthlyTaxes: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Home Owners Insurance</ControlLabel>
                            <MaskedInput
                              className="rs-input"
                              mask={createNumberMask({
                                prefix: '$ ',
                                integerLimit: 9
                              })}
                              value={this.state.financesHomeOwnersInsurance}
                              onChange={(e) => {
                                this.setState({
                                  financesHomeOwnersInsurance: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Home Owners Association</ControlLabel>
                            <MaskedInput
                              className="rs-input"
                              mask={createNumberMask({
                                prefix: '$ ',
                                integerLimit: 9
                              })}
                              value={this.state.financesHomeOwnersAssociation}
                              onChange={(e) => {
                                this.setState({
                                  financesHomeOwnersAssociation: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Mortgage Rate</ControlLabel>
                            <MaskedInput
                              className="rs-input"
                              mask={createNumberMask({
                                prefix: '',
                                suffix: ' %',
                                integerLimit: 3,
                                allowDecimal: true
                              })}
                              value={this.state.financesMortgageRate}
                              onChange={(e) => {
                                this.setState({
                                  financesMortgageRate: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Additional Fees</ControlLabel>
                            <MaskedInput
                              className="rs-input"
                              mask={createNumberMask({
                                integerLimit: 9
                              })}
                              value={this.state.financesAdditionalFees}
                              onChange={(e) => {
                                this.setState({
                                  financesAdditionalFees: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                        <div className="col-md-4">
                          <FormGroup>
                            <ControlLabel>Lender Credit</ControlLabel>
                            <MaskedInput
                              className="rs-input"
                              mask={createNumberMask({
                                integerLimit: 9
                              })}
                              value={this.state.financesLenderCredit}
                              onChange={(e) => {
                                this.setState({
                                  financesLenderCredit: e.target.value
                                });
                              }}
                            />
                          </FormGroup>
                        </div>
                      </div>
                    </Panel>
                  </div>

                  <div className={classNames({
                    "step-5": true,
                    hide: this.state.currentStep !== 5
                  })}>
                    <Panel bordered>
                      <label className="panel-heading-text">DOCUMENTS</label>

                      {this.state.documents.map((document, index) => {
                        return (
                          <div className="row document-row">
                            <div className="col-md-4">
                                  <FormGroup>
                                    <ControlLabel>Document Name</ControlLabel>
                                    <FormControl
                                      value={document.name}
                                      onChange={(value) => {
                                        let documentsCopy = [...this.state.documents];
                                        documentsCopy[index]['name'] = value;

                                        this.setState({
                                          documents: documentsCopy
                                        });
                                      }}
                                    />
                                  </FormGroup>
                            </div>
                            <div className="col-md-8">
                              <ControlLabel>Document</ControlLabel>
                              <InputGroup inside className="upload-document">
                                <Input
                                  disabled={true}
                                  placeholder="Browse files..."
                                  value={document.fileName}
                                />
                                <input type="file"
                                  ref={(fileRef => document.fileRef = fileRef)}
                                  onChange={(event) => {
                                    let docs = [...this.state.documents];
                                    docs[index] = {
                                      name: docs[index].name,
                                      fileName: event.target.files[0].name,
                                      handler: event.target.files[0]
                                    };

                                    // Checks if file type is accepted
                                    console.log(event.target.files[0]['type']);

                                    this.setState({
                                      documents: docs
                                    });
                                  }}
                                />
                                <InputGroup.Button
                                  onClick={() => {
                                    document.fileRef.click();
                                  }}
                                >
                                  Browse
                                </InputGroup.Button>
                              </InputGroup>
                            </div>
                          </div>
                        )
                      })}

                      <Button
                        appearance="primary"
                        className="mt-lg"
                        onClick={this.addAdditionalDocument}
                      >
                        + Add Documents
                      </Button>
                    </Panel>
                  </div>

                  {this.state.currentStep > 1 && (
                    <Button
                      className="rs-btn-grey mt-lg"
                      onClick={this.handlePrev}
                    >
                      <Icon icon='angle-left' />
                    </Button>
                  )}

                  {this.state.currentStep != this.state.numOfSteps ? (
                    <Button
                      color="green"
                      className="next-btn"
                      onClick={this.handleNext}
                    >
                      Next
                    </Button>
                  ) : (
                    <Button
                      color="green"
                      className="next-btn"
                      onClick={this.handleSubmit}
                      loading={this.state.isProcessing}
                      disabled={this.state.isProcessing}
                    >
                      Submit
                    </Button>
                  )}

                </div>
              </Form>
            </Container>
          </Container>
        </main>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    isSideMenuOpen: state.common.isSideMenuOpen
  };
}

export default connect(mapStateToProps, null)(RelationshipCreatePage);
