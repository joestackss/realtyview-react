import React from "react";
import { connect } from 'react-redux';
import axios from 'axios';
import empty from 'is-empty';
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
  DatePicker,
  Popover,
  List
} from 'rsuite';
import { store as notificationStore } from 'react-notifications-component';
import _ from 'lodash';
import classNames from 'classnames';
import * as EmailValidator from 'email-validator';
import MaskedInput from 'react-text-mask';
import createNumberMask from 'text-mask-addons/dist/createNumberMask';
import TopNav from './TopNav';
import RV_Sidebar from './RV_Sidebar';
import "../styles/OfferCreatePage.scss";

const allowedFileMimeTypes = [
  "application/pdf",
  "image/png",
  "image/jpeg"
]

const PHONE_NUMBER_PATTERN = /\([0-9]\d\d\) \d\d\d-\d\d\d\d/;

class OfferCreatePage extends React.Component {
  constructor(props) {
    super(props);
    this.handlePrev = this.handlePrev.bind(this);
    this.handleNext = this.handleNext.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFormValidation = this.handleFormValidation.bind(this);
    this.handleAddressAutocomplete = this.handleAddressAutocomplete.bind(this);
    this.addAdditionalDocument = this.addAdditionalDocument.bind(this);
    this.state = {
      currentStep: 1,
      numOfSteps: 4,
      isProcessing: false,
      formErrors: [],
      address: "",
      mlsNumber: "",
      listingBrokerName: "",
      listingBrokerAddress: "",
      listingBrokerEmail: "",
      listingBrokerMobilePhone: "",
      listingBrokerPhone: "",
      listingBrokerCompany: "",
      listingBrokerCompanyPhone: "",
      listingBrokerCompanyEmail: "",
      offerAmount: "",
      downPaymentAmount: "",
      preApprovalAmount: "",
      sellerConcession: "",
      loanType: "",
      proposedClosingDate: "",
      notes: "",
      addressSuggestions: [],
      documents: [{
        name: "",
        fileName: "",
        handler: "",
      }]
    }
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

  async handleNext() {
    if ((this.state.currentStep < this.state.numOfSteps) && await this.handleFormValidation()) {
      this.setState((prevState) => {
        return {
          currentStep: prevState.currentStep + 1
        }
      })
    }
  }

  handleSubmit() {
    this.setState({
      isProcessing: true
    });

    let formData = new FormData();
    formData.append("address", this.state.address);
    formData.append("mls_number", this.state.mlsNumber);
    formData.append("listing_broker_name", this.state.listingBrokerName);
    formData.append("listing_broker_address", this.state.listingBrokerAddress);
    formData.append("listing_broker_email", this.state.listingBrokerEmail);
    formData.append("listing_broker_mobile_phone", this.state.listingBrokerMobilePhone);
    formData.append("listing_broker_phone", this.state.listingBrokerPhone);
    formData.append("listing_broker_company", this.state.listingBrokerCompany);
    formData.append("listing_broker_company_phone", this.state.listingBrokerCompanyPhone);
    formData.append("listing_broker_company_email", this.state.listingBrokerCompanyEmail);
    formData.append("listing_offer_amount", this.state.offerAmount);
    formData.append("down_payment_amount", this.state.downPaymentAmount);
    formData.append("pre_approval_amount", this.state.preApprovalAmount);
    formData.append("seller_concession", this.state.sellerConcession);
    formData.append("loan_type", this.state.loanType);
    formData.append("proposed_closing_date", this.state.proposedClosingDate);
    formData.append("notes", this.state.notes);

    let documents = [];
    _.forEach(this.state.documents, (document) => {
      if (!empty(document.name) && !empty(document.fileName)) {
        formData.append('file[]', document.handler);
        documents = {
          name: document.name,
          file_name: document.fileName,
        };
      }
    });

    if (!empty(documents)) {
      formData.append('documents', JSON.stringify(documents));
    }

    axios.post(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/offer/create`, formData, {
      headers: {
        "content-type": "multipart/form-data"
      },
      withCredentials: true
    })
    .then((response) => {
      if (response.status === 201) {
        this.setState({ isProcessing: false });

        // Set flash message for redirect.
        window.flash("Offer was created", "success", "success");
        this.props.history.push(`/offer-view/${response.data.id}`);

      } else {
        throw "Could not create offer. Something went wrong";
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }

  async handleFormValidation() {
    let errors = {};
    this.setState({ formErrors: {} });

    switch (this.state.currentStep) {
      case 1:
        if (empty(this.state.address)) {
          errors["address"] = "Required field";
        } else {
          // await this.getListingBrokerDetails();
        }

        break;

      case 2:
        if (empty(this.state.listingBrokerName)) {
          errors["listingBrokerName"] = "Required field";
        }

        if (!EmailValidator.validate(this.state.listingBrokerEmail)) {
          errors["listingBrokerEmail"] = "Invalid Email";
        }

        if (empty(this.state.listingBrokerEmail)) {
          errors["listingBrokerEmail"] = "Required field";
        }

        if (
          empty(this.state.listingBrokerMobilePhone)
          || !PHONE_NUMBER_PATTERN.test(this.state.listingBrokerMobilePhone)
        ) {
          errors["listingBrokerMobilePhone"] = "Field Required";
        }

        break

      default:
        break;
    }

    this.setState({
      formErrors: errors
    });

    return empty(errors);
  }

  handleAddressAutocomplete() {
    if (this.state.address.length >= 3) {
      axios({
        method: 'GET',
        url: `${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/address/autocomplete`,
        params: {
          location: this.state.address
        }
      }).then((response) => {
        if (response.status === 200) {
          this.setState({addressSuggestions: response.data.predictions});
        }
      }).catch((err) => {
        console.log(err);
      });
    }
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

  async getListingBrokerDetails() {
    this.setState({ isProcessing: true });
    const response = await axios
      .get(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/listing/details?address=${this.state.address}`)
      .catch(err => {
        console.log(err);
      });

    let listingBroker = {};
    try {
      listingBroker = response.data.brokers[0]
    } catch(e) {}

    this.setState({
      isProcessing: false,
      listingBrokerName: listingBroker.hasOwnProperty("agent") ? listingBroker.agent : "",
      listingBrokerEmail: listingBroker.hasOwnProperty("emails") ? listingBroker.emails[0] : "",
      listingBrokerPhone: listingBroker.hasOwnProperty("phones") ? listingBroker.phones[0] : "",
      listingBrokerCompany: listingBroker.hasOwnProperty("company") ? listingBroker.company : ""
    });
  }

  render() {
    return (
      <div className="offer-create-page">
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

              <h2 className="page-context-title">Create Offer</h2>

              <Form className="add-offer-form" fluid>
                <ul className="steps-progress">
                  <li
                    className={classNames({
                      active: this.state.currentStep === 1
                    })}
                  >
                    <label>Step 1</label>
                    <div>Find Listing</div>
                  </li>
                  <li
                    className={classNames({
                      active: this.state.currentStep === 2
                    })}
                  >
                    <label>Step 2</label>
                    <div>Listing Broker</div>
                    <div className="optional">Optional</div>
                  </li>
                  <li
                    className={classNames({
                      active: this.state.currentStep === 3
                    })}
                  >
                    <label>Step 3</label>
                    <div>Transaction Details</div>
                    <div className="optional">Optional</div>
                  </li>
                  <li
                    className={classNames({
                      active: this.state.currentStep === 4
                    })}
                  >
                    <label>Step 4</label>
                    <div>Documents</div>
                    <div className="optional">Optional</div>
                  </li>
                </ul>

                <div className="steps">
                  <div
                    className={classNames({
                      "step-1": true,
                      hide: this.state.currentStep !== 1
                    })}
                  >
                    <Panel bordered>
                      <label className="panel-heading-text">Find Listing</label>
                      <p>Please input the address or MLS to get started.</p>

                      <div className="row mt-lg bottom-xs">
                        <div className="col-md-7">
                          <FormGroup className="address-group">
                            <label>Address</label>
                            <FormControl
                              placeholder="Input the address here..."
                              maxLength="150"
                              value={this.state.address}
                              onChange={(value) => {
                                this.setState({
                                  address: value
                                });
                              }}
                              onKeyUp={this.handleAddressAutocomplete}
                              errorMessage={this.state.formErrors.hasOwnProperty('address') ? this.state.formErrors.address : ""}
                              errorPlacement="rightStart"
                            />
                            <Popover id="address-autocomplete-popover" visible>
                              <List hover>
                                {this.state.addressSuggestions.map((item, index) => (
                                  <List.Item key={`address-suggestion-${index}`} onClick={() => {
                                    this.setState({
                                      address: item,
                                      addressSuggestions: []
                                    });
                                  }}>
                                    {item}
                                  </List.Item>
                                ))}
                              </List>
                            </Popover>
                          </FormGroup>
                        </div>
                        <div className="col-md-1">
                          <p className="or-seperator">Or</p>
                        </div>
                        <div className="col-md-4">
                          <label>MLS</label>
                          <FormControl
                            maxLength="11"
                            placeholder="Input MLS"
                            value={this.state.mlsNumber}
                            onChange={(value) => {
                              this.setState({
                                mlsNumber: value
                              });
                            }}
                          />
                        </div>
                      </div>
                    </Panel>
                  </div>

                  <div
                    className={classNames({
                      "step-2": true,
                      hide: this.state.currentStep !== 2
                    })}
                  >
                    <Panel bordered>
                      <label className="panel-heading-text">Listing Broker</label>
                      <p>Add details of the listing broker. You may skip this step for the meantime.</p>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <label>Name</label>
                          <FormControl
                            maxLength="50"
                            value={this.state.listingBrokerName}
                            onChange={(value) => {
                              this.setState({
                                listingBrokerName: value
                              });

                              if (!empty(this.state.formErrors)) {
                                this.handleFormValidation();
                              }
                            }}
                            errorMessage={this.state.formErrors.hasOwnProperty('listingBrokerName') ? this.state.formErrors.listingBrokerName : ""}
                            errorPlacement="rightStart"
                          />
                        </div>
                        <div className="col-md-8">
                          <label>Address</label>
                          <FormControl
                            maxLength="150"
                            value={this.state.listingBrokerAddress}
                            onChange={(value) => {
                              this.setState({
                                listingBrokerAddress: value
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <label>Email Address</label>
                          <FormControl
                            maxLength="50"
                            value={this.state.listingBrokerEmail}
                            onChange={(value) => {
                              this.setState({
                                listingBrokerEmail: value
                              });

                              if (!empty(this.state.formErrors)) {
                                this.handleFormValidation();
                              }
                            }}
                            errorMessage={this.state.formErrors.hasOwnProperty('listingBrokerEmail') ? this.state.formErrors.listingBrokerEmail : ""}
                            errorPlacement="rightStart"
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Mobile Number</label>
                          <div className="rs-form-control-wrapper">
                            <MaskedInput
                              mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                              className="rs-input"
                              value={this.state.listingBrokerMobilePhone}
                              onChange={(e) => {
                                this.setState({
                                  listingBrokerMobilePhone: e.target.value
                                });

                                if (!empty(this.state.formErrors)) {
                                  this.handleFormValidation();
                                }
                              }}
                            />
                            {this.state.formErrors.hasOwnProperty('listingBrokerMobilePhone') && (
                              <div class="rs-error-message-wrapper rs-form-control-message-wrapper rs-error-message-placement-right-start">
                                <span class="rs-error-message rs-error-message-show">
                                  <span class="rs-error-message-arrow"></span>
                                  <span class="rs-error-message-inner">{ this.state.formErrors.listingBrokerMobilePhone }</span>
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="col-md-4">
                          <label>Phone Number</label>
                          <MaskedInput
                            mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                            className="rs-input"
                            value={this.state.listingBrokerPhone}
                            onChange={(e) => {
                              this.setState({
                                listingBrokerPhone: e.target.value
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <label>Brokerage / Company</label>
                          <FormControl
                            maxLength="100"
                            value={this.state.listingBrokerCompany}
                            onChange={(value) => {
                              this.setState({
                                listingBrokerCompany: value
                              });
                            }}
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Brokerage Phone Number</label>
                          <MaskedInput
                            mask={['(', /[1-9]/, /\d/, /\d/, ')', ' ', /\d/, /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]}
                            className="rs-input"
                            value={this.state.listingBrokerCompanyPhone}
                            onChange={(e) => {
                              this.setState({
                                listingBrokerCompanyPhone: e.target.value
                              });
                            }}
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Brokerage Email Address</label>
                          <FormControl
                            maxLength="50"
                            value={this.state.listingBrokerCompanyEmail}
                            onChange={(value) => {
                              this.setState({
                                listingBrokerCompanyEmail: value
                              });
                            }}
                          />
                        </div>
                      </div>
                    </Panel>
                  </div>

                  <div
                    className={classNames({
                      "step-3": true,
                      hide: this.state.currentStep !== 3
                    })}
                  >
                    <Panel bordered>
                      <label className="panel-heading-text">TRANSACTION DETAILS</label>
                      <p>Add details of the transaction here. You may skip this step for the meantime.</p>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <label>Offer Amount</label>
                          <MaskedInput
                            className="rs-input"
                            mask={createNumberMask({
                              prefix: '$ '
                            })}
                            value={this.state.offerAmount}
                            maxLength="12"
                            onChange={(e) => {
                              this.setState({
                                offerAmount: e.target.value
                              });
                            }}
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Down Payment / Earnest Money</label>
                          <MaskedInput
                            className="rs-input"
                            mask={createNumberMask({
                              prefix: '$ '
                            })}
                            value={this.state.downPaymentAmount}
                            maxLength="12"
                            onChange={(e) => {
                              this.setState({
                                downPaymentAmount: e.target.value
                              });
                            }}
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Pre-Approval Amount</label>
                          <MaskedInput
                            className="rs-input"
                            mask={createNumberMask({
                              prefix: '$ '
                            })}
                            value={this.state.preApprovalAmount}
                            maxLength="12"
                            onChange={(e) => {
                              this.setState({
                                preApprovalAmount: e.target.value
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-4">
                          <label>Seller Concession</label>
                          <MaskedInput
                            className="rs-input"
                            mask={createNumberMask({
                              prefix: '$ '
                            })}
                            value={this.state.sellerConcession}
                            maxLength="12"
                            onChange={(e) => {
                              this.setState({
                                sellerConcession: e.target.value
                              });
                            }}
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Loan Type</label>
                          <SelectPicker
                            data={[
                              {
                                "label": "Conventional",
                                "value": "coventional"
                              },
                              {
                                "label": "FHA",
                                "value": "fha"
                              }
                            ]}
                            searchable={false}
                            block
                            value={this.state.loanType}
                            onChange={(value) => {
                              this.setState({
                                loanType: value
                              });
                            }}
                          />
                        </div>
                        <div className="col-md-4">
                          <label>Proposed Closing Date</label>
                          <DatePicker
                            block
                            format="YYYY-MM-DD"
                            onChange={(value) => {
                              this.setState({
                                proposedClosingDate: value
                              });
                            }}
                          />
                        </div>
                      </div>

                      <div className="row mt-lg">
                        <div className="col-md-12">
                          <label>Notes</label>
                          <Input
                            componentClass="textarea"
                            rows={4}
                            value={this.state.notes}
                            onChange={(value) => {
                              this.setState({
                                notes: value
                              });
                            }}
                          />
                        </div>
                      </div>
                    </Panel>
                  </div>

                  <div
                    className={classNames({
                      "step-4": true,
                      hide: this.state.currentStep !== 4
                    })}
                  >
                    <Panel bordered>
                      <label className="panel-heading-text">Documents</label>
                      <p>Upload your documents here. Accepted file types are PDF, PNG and JPEG.</p>

                      {this.state.documents.map((document, index) => {
                        return (
                          <div className="row document-row">
                            <div className="col-md-4">
                              <FormGroup>
                                <ControlLabel>Document Name</ControlLabel>
                                <FormControl
                                  maxLength="50"
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
                                  accept=".pdf,.png,.jpg,.jpeg"
                                  onChange={(event) => {
                                    let docs = [...this.state.documents];
                                    docs[index] = {
                                      name: docs[index].name,
                                      fileName: event.target.files[0].name,
                                      handler: event.target.files[0]
                                    };

                                    // Checks if file type is accepted
                                    if (allowedFileMimeTypes.indexOf(event.target.files[0]["type"]) === -1) {
                                      notificationStore.addNotification({
                                        title: "Error!",
                                        message: "File type you uploaded is not accepted. Accepted file types are PDF, PNG and JPEG.",
                                        type: "danger",
                                        insert: "top",
                                        container: "top-right",
                                        animationIn: ["animated", "fadeIn"],
                                        animationOut: ["animated", "fadeOut"],
                                        dismiss: {
                                          duration: 5000,
                                          onScreen: true
                                        }
                                      });
                                      return;
                                    }

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
                      disabled={this.state.isProcessing}
                      onClick={this.handlePrev}
                    >
                      <Icon icon='angle-left' />
                    </Button>
                  )}

                  <Button
                    color="green"
                    className="next-btn"
                    onClick={this.state.currentStep != this.state.numOfSteps ? this.handleNext : this.handleSubmit}
                    loading={this.state.isProcessing}
                    disabled={this.state.isProcessing}
                  >
                    <Icon icon="angle-right" />
                  </Button>

                </div>
              </Form>
            </Container>
          </Container>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    isSideMenuOpen: state.common.isSideMenuOpen
  };
}

export default connect(mapStateToProps, null)(OfferCreatePage);
