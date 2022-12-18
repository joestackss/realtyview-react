/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from 'react';
import { connect } from 'react-redux';
import {
  Container,
  Panel,
  Nav,
  Form,
  FormGroup,
  FormControl,
  ControlLabel,
  Button,
  SelectPicker,
  Popover,
  List } from 'rsuite';
import classNames from 'classnames';
import axios from 'axios';

import Header from './Header';
import RV_Sidebar from './RV_Sidebar';
import '../styles/PropertyReportsPage.scss';


class PropertyReportsPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeKey: 'property_reports',
      searchAddress: '',
      addressSuggestions: []
    }

    this.handleTabChange = this.handleTabChange.bind(this);
    this.handleAddressAutocomplete = this.handleAddressAutocomplete.bind(this);
    this.handlePropertySearch = this.handlePropertySearch.bind(this);
  }

  handleTabChange(activeKey) {
    this.setState({
      activeKey: activeKey
    });
  }

  handleAddressAutocomplete() {
    if (this.state.searchAddress.length >= 3) {
      axios({
        method: 'GET',
        url: `${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/address/autocomplete`,
        params: {
          location: this.state.searchAddress
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

  handlePropertySearch(event) {
    event.preventDefault();

    axios.post(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/property/search`, {
      address: this.state.searchAddress
    }).then((response) => {
      if (response.status === 200) {
        window.location.replace("/property-details/" + response.data.property_id);
      }
    }).catch((err) => {
      // Show a notification to the client
      console.log(err);
    })
  }

  render() {
    return (
      <div className="property-reports-page">
        <Header />

        <main>
          <Container>
            <div className="rs-sidebar-wrapper fixed">
              <RV_Sidebar />
            </div>

            <Container className={classNames({
              "page-context": true,
              "stretched": this.props.isSideMenuOpen === false
            })}>
              <h2 className="page-context-title">Search</h2>

              <div className="row">
                <div className="col-md-12">
                  <Panel bordered>
                    <Nav appearance="subtle" activeKey={this.state.activeKey} onSelect={this.handleTabChange}>
                      <Nav.Item eventKey="property_reports">Property Reports</Nav.Item>
                      <Nav.Item eventKey="advanced_search">Advanced Search</Nav.Item>
                      <Nav.Item eventKey="past_sales">Past Sales</Nav.Item>
                      <Nav.Item eventKey="preforclosures">Preforclosures</Nav.Item>
                      <Nav.Item eventKey="auctions">Auctions</Nav.Item>
                      <Nav.Item eventKey="mailing_list">Mailing List</Nav.Item>
                    </Nav>

                    <ul className="tab-search-content mt-lg">
                      <li className={classNames({
                        hide: this.state.activeKey !== "property_reports"
                      })}>
                        <Form fluid>
                          <FormGroup>
                            <ControlLabel>Address</ControlLabel>
                            <FormControl
                              name="rv_address"
                              value={this.state.searchAddress}
                              onChange={(value) => {
                                this.setState({
                                  searchAddress: value
                                });
                              }}
                              onKeyUp={this.handleAddressAutocomplete}
                            />
                            <Popover id="address-autocomplete-popover" visible>
                              <List hover>
                                {this.state.addressSuggestions.map((item, index) => (
                                  <List.Item key={`address-suggestion-${index}`} onClick={() => {
                                    this.setState({
                                      searchAddress: item.description,
                                      addressSuggestions: []
                                    });
                                  }}>
                                    {item.description}
                                  </List.Item>
                                ))}
                              </List>
                            </Popover>
                          </FormGroup>

                          <FormGroup>
                            <Button
                              appearance="primary"
                              onClick={this.handlePropertySearch}
                            >
                              Search
                            </Button>
                          </FormGroup>
                        </Form>
                      </li>
                      <li
                        className={classNames({
                          hide: this.state.activeKey !== "advanced_search"
                        })}
                      >
                        <Form id="advanced-search" fluid>
                          <div className="row">
                            <div className="col-md-6">
                              <FormGroup>
                                <ControlLabel>Street Number</ControlLabel>
                                <FormControl name="street_number" />
                              </FormGroup>
                            </div>
                            <div className="col-md-6">
                              <FormGroup>
                                <ControlLabel>Structure Type</ControlLabel>
                                <SelectPicker
                                  data={[
                                    {
                                      "label": "bi-level",
                                      "value": "bi-level",
                                      "role": "Master"
                                    }
                                  ]}
                                  searchable={false}
                                  block
                                />
                              </FormGroup>
                            </div>
                          </div>

                          <div className="row mt-lg">
                            <div className="col-md-6">
                              <FormGroup>
                                <ControlLabel>Street Name</ControlLabel>
                                <FormControl name="street_name" />
                              </FormGroup>
                            </div>
                            <div className="col-md-6">
                              <FormGroup>
                                <ControlLabel>Zoning</ControlLabel>
                                <SelectPicker
                                data={[
                                  {
                                    "label": "sample",
                                    "value": "sample",
                                    "role": "Master"
                                  }
                                ]}
                                  searchable={false}
                                  block
                                />
                              </FormGroup>
                            </div>
                          </div>

                          <div className="row mt-lg">
                            <div className="col-md-6">
                              <FormGroup>
                                <ControlLabel>Unit Number</ControlLabel>
                                <FormControl name="unit_number" />
                              </FormGroup>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <div className="col-md-12">
                                  <ControlLabel>Gross Living Area (SqFt)</ControlLabel>
                                </div>
                              </div>

                              <div className="row middle-xs">
                                <div className="col-md-5">
                                  <FormGroup>
                                    <FormControl name="gross_living_area_sqft_1" />
                                  </FormGroup>
                                </div>
                                <div className="col-md-2">
                                  <label><center>to</center></label>
                                </div>
                                <div className="col-md-5">
                                  <FormGroup>
                                    <FormControl name="gross_living_area_sqft_2" />
                                  </FormGroup>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row mt-lg">
                            <div className="col-md-6">
                              <FormGroup>
                                <ControlLabel>City/Neighborhood</ControlLabel>
                                <FormControl name="city_neighborhood" />
                              </FormGroup>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <div className="col-md-12">
                                  <ControlLabel>Lot Size (Acres)</ControlLabel>
                                </div>
                              </div>

                              <div className="row middle-xs">
                                <div className="col-md-5">
                                  <FormGroup>
                                    <FormControl name="lot_size_acres_1" />
                                  </FormGroup>
                                </div>
                                <div className="col-md-2">
                                  <label><center>to</center></label>
                                </div>
                                <div className="col-md-5">
                                  <FormGroup>
                                    <FormControl name="lot_size_acres_2" />
                                  </FormGroup>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row mt-lg">
                            <div className="col-md-6">
                              <FormGroup>
                                <ControlLabel>State</ControlLabel>
                                <SelectPicker
                                  data={[
                                    { role: 'Master', value: 'AL', label: 'ALABAMA' },
                                    { role: 'Master', value: 'AK', label: 'ALASKA' },
                                    { role: 'Master', value: 'AZ', label: 'ARIZONA' },
                                    { role: 'Master', value: 'AR', label: 'ARKANSAS' },
                                    { role: 'Master', value: 'CA', label: 'CALIFORNIA' },
                                    { role: 'Master', value: 'CO', label: 'COLORADO' },
                                    { role: 'Master', value: 'CT', label: 'CONNECTICUT' },
                                    { role: 'Master', value: 'DE', label: 'DELAWARE' },
                                    { role: 'Master', value: 'FL', label: 'FLORIDA' },
                                    { role: 'Master', value: 'GA', label: 'GEORGIA' },
                                    { role: 'Master', value: 'HI', label: 'HAWAII' },
                                    { role: 'Master', value: 'ID', label: 'IDAHO' },
                                    { role: 'Master', value: 'IL', label: 'ILLINOIS' },
                                    { role: 'Master', value: 'IN', label: 'INDIANA' },
                                    { role: 'Master', value: 'IA', label: 'IOWA' },
                                    { role: 'Master', value: 'KS', label: 'KANSAS' },
                                    { role: 'Master', value: 'KY', label: 'KENTUCKY' },
                                    { role: 'Master', value: 'LA', label: 'LOUISIANA' },
                                    { role: 'Master', value: 'ME', label: 'MAINE' },
                                    { role: 'Master', value: 'MD', label: 'MARYLAND' },
                                    { role: 'Master', value: 'MA', label: 'MASSACHUSETTS' },
                                    { role: 'Master', value: 'MI', label: 'MICHIGAN' },
                                    { role: 'Master', value: 'MN', label: 'MINNESOTA' },
                                    { role: 'Master', value: 'MS', label: 'MISSISSIPPI' },
                                    { role: 'Master', value: 'MO', label: 'MISSOURI' },
                                    { role: 'Master', value: 'MT', label: 'MONTANA' },
                                    { role: 'Master', value: 'NE', label: 'NEBRASKA' },
                                    { role: 'Master', value: 'NV', label: 'NEVADA' },
                                    { role: 'Master', value: 'NH', label: 'NEW HAMPSHIRE' },
                                    { role: 'Master', value: 'NJ', label: 'NEW JERSEY' },
                                    { role: 'Master', value: 'NM', label: 'NEW MEXICO' },
                                    { role: 'Master', value: 'NY', label: 'NEW YORK' },
                                    { role: 'Master', value: 'NC', label: 'NORTH CAROLINA' },
                                    { role: 'Master', value: 'ND', label: 'NORTH DAKOTA' },
                                    { role: 'Master', value: 'OH', label: 'OHIO' },
                                    { role: 'Master', value: 'OK', label: 'OKLAHOMA' },
                                    { role: 'Master', value: 'OR', label: 'OREGON' },
                                    { role: 'Master', value: 'PA', label: 'PENNSYLVANIA' },
                                    { role: 'Master', value: 'RI', label: 'RHODE ISLAND' },
                                    { role: 'Master', value: 'SC', label: 'SOUTH CAROLINA' },
                                    { role: 'Master', value: 'SD', label: 'SOUTH DAKOTA' },
                                    { role: 'Master', value: 'TN', label: 'TENNESSEE' },
                                    { role: 'Master', value: 'TX', label: 'TEXAS' },
                                    { role: 'Master', value: 'UT', label: 'UTAH' },
                                    { role: 'Master', value: 'VT', label: 'VERMONT' },
                                    { role: 'Master', value: 'VA', label: 'VIRGINIA' },
                                    { role: 'Master', value: 'WA', label: 'WASHINGTON' },
                                    { role: 'Master', value: 'WV', label: 'WEST VIRGINIA' },
                                    { role: 'Master', value: 'WI', label: 'WISCONSIN' },
                                    { role: 'Master', value: 'WY', label: 'WYOMING' },
                                    { role: 'Master', value: 'GU', label: 'GUAM' },
                                    { role: 'Master', value: 'PR', label: 'PUERTO RICO' },
                                    { role: 'Master', value: 'VI', label: 'VIRGIN ISLANDS' }
                                  ]}
                                  searchable={false}
                                  block
                                />
                              </FormGroup>
                            </div>
                            <div className="col-md-6">
                              <div className="row">
                                <div className="col-md-12">
                                  <ControlLabel>Year Built</ControlLabel>
                                </div>
                              </div>

                              <div className="row middle-xs">
                                <div className="col-md-5">
                                  <FormGroup>
                                    <FormControl name="year_built_1" />
                                  </FormGroup>
                                </div>
                                <div className="col-md-2">
                                  <label><center>to</center></label>
                                </div>
                                <div className="col-md-5">
                                  <FormGroup>
                                    <FormControl name="year_built_2" />
                                  </FormGroup>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="row mt-lg">
                            <div className="col-md-6">
                              <FormGroup>
                                <ControlLabel>Zip Code</ControlLabel>
                                <FormControl name="Zip Code" />
                              </FormGroup>
                            </div>
                            <div className="col-md-6"></div>
                          </div>

                          <div className="row mt-lg">
                            <div className="col-md-6">
                              <FormGroup>
                                <ControlLabel>County</ControlLabel>
                                <FormControl name="county" />
                              </FormGroup>
                            </div>
                            <div className="col-md-6"></div>
                          </div>

                          <div className="row mt-lg">
                            <div className="col-md-6">
                              <Button appearance="primary">Save</Button>
                              <Button appearance="primary">Save Search</Button>
                            </div>
                            <div className="col-md-6"></div>
                          </div>
                        </Form>
                      </li>
                      <li
                        className={classNames({
                          hide: this.state.activeKey !== "past_sales"
                        })}
                      >
                        Past Sales Content
                      </li>
                      <li
                        className={classNames({
                          hide: this.state.activeKey !== "preforclosures"
                        })}
                      >
                        Preforclosures Content
                      </li>
                      <li
                        className={classNames({
                          hide: this.state.activeKey !== "auctions"
                        })}
                      >
                        Auctions Content
                      </li>
                      <li
                        className={classNames({
                          hide: this.state.activeKey !== "mailing_list"
                        })}
                      >
                        Mailing List Content
                      </li>
                    </ul>
                  </Panel>
                </div>
              </div>
            </Container>
          </Container>
        </main>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    isSideMenuOpen: state.common.isSideMenuOpen
  };
}

export default connect(mapStateToProps, null)(PropertyReportsPage);
