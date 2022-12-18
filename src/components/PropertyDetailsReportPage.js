/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from 'react';
import { connect } from 'react-redux';
import { Container, Panel, Button, Placeholder } from 'rsuite';
import ReactMapGL from 'react-map-gl';
import classNames from 'classnames';
import axios from 'axios';

import Header from './Header';
import RV_Sidebar from './RV_Sidebar';
import SampleHomeThumbnail from '../images/sample-home-thumbnail.jpg';
import '../styles/PropertyDetailsReportPage.scss';


class PropertyDetailsReportPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      viewport: {},
      property: {
        metadata: {
          publishing_date: ""
        },
        address: {
          street_number: "",
          street_pre_direction: "",
          street_name: "",
          street_suffix: "",
          street_post_direction: "",
          unit_type: "",
          unit_number: "",
          formatted_street_address: "",
          city: "",
          state: "",
          zip_code: "",
          zip_plus_four_code: "",
          carrier_code: "",
          latitude: "",
          longitude: "",
          geocoding_accuracy: "",
          census_tract: ""
        },
        parcel: {
          apn_original: "",
          apn_unformatted: "",
          apn_previous: "",
          fips_code: "",
          depth_ft: "",
          frontage_ft: "",
          area_sq_ft: "",
          area_acres: "",
          county_name: "",
          county_land_use_code: "",
          county_land_use_description: "",
          standardized_land_use_category: "",
          standardized_land_use_type: "",
          location_descriptions: "",
          zoning: "",
          building_count: "",
          tax_account_number: "",
          legal_description: "",
          lot_code: "",
          lot_number: "",
          subdivision: "",
          municipality: "",
          section_township_range: ""
        },
        structure: {
          year_built: "",
          effective_year_built: "",
          stories: "",
          rooms_count: "",
          beds_count: "",
          baths: "",
          partial_baths_count: "",
          units_count: "",
          parking_type: "",
          parking_spaces_count: "",
          pool_type: "",
          architecture_type: "",
          construction_type: "",
          exterior_wall_type: "",
          foundation_type: "",
          roof_material_type: "",
          roof_style_type: "",
          heating_type: "",
          heating_fuel_type: "",
          air_conditioning_type: "",
          fireplaces: "",
          basement_type: "",
          quality: "",
          condition: "",
          flooring_types: "",
          plumbing_fixtures_count: "",
          interior_wall_type: "",
          water_type: "",
          sewer_type: "",
          total_area_sq_ft: "",
          other_areas: [
            {
              type: "",
              sq_ft: ""
            }
          ],
          other_features: [
            {
              type: "",
              sq_ft: ""
            }
          ],
          other_improvements: [
            {
              type: "",
              sq_ft: ""
            }
          ],
          other_rooms: "",
          amenities: ""
        },
        taxes: {
          year: "",
          amount: "",
          exemptions: "",
          rate_code_area: ""
        },
        assessments: {
          year: "",
          land_value: "",
          improvement_value: "",
          total_value: ""
        },
        market_assessments: {
          year: "",
          land_value: "",
          improvement_value: "",
          total_value: ""
        },
        valuation: {
          value: "",
          high: "",
          low: "",
          forecast_standard_deviation: "",
          date: ""
        },
        owner: {
          name: "",
          formatted_street_address: "",
          unit_type: "",
          unit_number: "",
          city: "",
          state: "",
          zip_code: "",
          zip_plus_four_code: "",
          owner_occupied: ""
        },
        deeds: [
          {
            document_type: "",
            recording_date: "",
            original_contract_date: "",
            deed_book: "",
            deed_page: "",
            document_id: "",
            sale_price: "",
            sale_price_description: "",
            transfer_tax: "",
            distressed_sale: false,
            real_estate_owned: "",
            seller_first_name: "",
            seller_last_name: "",
            seller2_first_name: "",
            seller2_last_name: "",
            seller_address: "",
            seller_unit_number: "",
            seller_city: "",
            seller_state: "",
            seller_zip_code: "",
            seller_zip_plus_four_code: "",
            buyer_first_name: "",
            buyer_last_name: "",
            buyer2_first_name: "",
            buyer2_last_name: "",
            buyer_address: "",
            buyer_unit_type: "",
            buyer_unit_number: "",
            buyer_city: "",
            buyer_state: "",
            buyer_zip_code: "",
            buyer_zip_plus_four_code: "",
            lender_name: "",
            lender_type: "",
            loan_amount: "",
            loan_type: "",
            loan_due_date: "",
            loan_finance_type: "",
            loan_interest_rate: ""
          }
        ]
      }
    }
  }

  componentDidMount() {
    this.setState({ isLoading: true });
    axios
      .get(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/property/${this.props.match.params.id}`)
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            isLoading: false,
            property: response.data.report,
            viewport: {
              width: '100%',
              height: '500px',
              latitude: response.data.report.address.latitude,
              longitude: response.data.report.address.longitude,
              zoom: 15,
              bearing: 0,
              pitch: 60.00
            }
          });
        }
      })
      .catch((err) => {
        // If property does not exist, redirect to 404 page
        window.location.replace("/pagenotfound");
      })
  }

  render() {
    const { Paragraph } = Placeholder;

    return (
      <div className="property-details-report-page">
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
              <div className="inline-group">
                <h2 className="page-context-title">Property Details</h2>
                <div className="action-buttons">
                  <Button appearance="primary">Share</Button>
                  <Button appearance="ghost">Export</Button>
                </div>
              </div>

              <div className="row">
                <div className="col-md-4">
                  <Panel bordered>
                    <img src={SampleHomeThumbnail} className="property-main-img" alt="sample home" />

                    <div className="mt-lg">
                      <label>Address:</label>
                      {this.state.isLoading ? <Paragraph /> : (
                        <span>
                          <p>{this.state.property.address.formatted_street_address}</p>
                          <p>{this.state.property.address.city}, {this.state.property.address.state} {this.state.property.address.zip_code}</p>
                        </span>
                      )}
                    </div>

                    <div className="mt-lg">
                      <label>Latitude:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.address.latitude || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Longitude:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.address.longitude || "N/A")}</p>
                    </div>

                  </Panel>
                </div>
                <div className="col-md-8">
                  <Panel bordered>
                    <ReactMapGL
                      {...this.state.viewport}
                      mapStyle="mapbox://styles/realtyview/ckafznf7g02ge1iqomqyp145b"
                      onViewportChange={viewport => this.setState({viewport})}
                      mapboxApiAccessToken={process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                    />
                  </Panel>
                </div>
              </div>

              <div className="row mt-lg">
                <div className="col-md-12">
                  <Panel bordered>
                    <h3 className="section-title">Owner</h3>

                    <div className="mt-lg">
                      <label>Name:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.owner.name || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Address:</label>
                      {this.state.isLoading ? <Paragraph /> : (
                        <p>
                          {this.state.property.owner.formatted_street_address + ' '}
                          {this.state.property.owner.unit_type}
                          {this.state.property.owner.unit_number}, <br />
                          {this.state.property.owner.city + ', '}
                          {this.state.property.owner.state + ' '}
                          {this.state.property.owner.zip_code}
                        </p>
                      )}

                      <div className="mt-lg">
                        <label>Owner Occupied:</label>
                        <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.owner.owner_occupied || "N/A")}</p>
                      </div>
                    </div>

                  </Panel>
                </div>
              </div>

              <div className="row mt-lg">
                <div className="col-md-6">
                  <Panel bordered>
                    <h3 className="section-title">Parcel</h3>

                    <div className="mt-lg">
                      <label>Apn Original:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.apn_original || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Apn Unformatted:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : this.state.property.parcel.apn_unformatted || "N/A"}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Apn Previous:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.apn_previous || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Fips Code:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.fips_code || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Depth (ft):</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.depth_ft || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Frontage (ft):</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.frontage_ft || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Area (sqft):</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.area_sq_ft || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Area Acres:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.area_acres || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>County Name:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.county_name || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>County Land Use Code:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.county_land_use_code || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>County Land Use Description:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.county_land_use_description || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Standardized Land Use Category:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.standardized_land_use_category || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Standardized Land Use Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.standardized_land_use_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Location Descriptions:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.location_descriptions || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Zoning:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.zoning || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Building Count:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.building_count || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Tax Account Number:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.tax_account_number || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Legal Description:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.legal_description || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Lot Code:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.lot_code || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Lot Number:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.lot_number || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Subdivision:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.subdivision || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Municipality:</label>
                      <p>{this.state.isLoading ? <Paragraph /> :(this.state.property.parcel.municipality || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Section Township Range:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.parcel.section_township_range || "N/A")}</p>
                    </div>
                  </Panel>
                </div>

                <div className="col-md-6">
                  <Panel bordered>
                    <h3 className="section-title">Structure</h3>

                    <div className="mt-lg">
                      <label>Year Built:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.year_built || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Effective Year Built:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.effective_year_built || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Stories:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.stories || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Rooms Count:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.rooms_count || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Beds Count:</label>
                      <p>{this.state.isLoading ? <Paragraph /> :(this.state.property.structure.beds_count || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Baths:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.baths || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Partial Baths Count</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.partial_baths_count || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Units Count:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.units_count || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Parking Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.parking_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Parking Spaces Count:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.parking_spaces_count || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Pool Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.pool_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Architecture Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.architecture_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Construction Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.construction_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Exterior Wall Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.exterior_wall_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Foundation Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.foundation_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Roof Material Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.roof_material_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Roof Style Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.roof_style_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Heating Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.heating_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Heating Fuel Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.heating_fuel_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Air Conditioning Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.air_conditioning_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Fireplaces:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.fireplaces || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Basement Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.basement_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Quality:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.quality || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Condition:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.condition || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Flooring Types:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.flooring_types || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Plumbing Fixtures Count:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.plumbing_fixtures_count || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Interior Wall Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.interior_wall_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Water Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.water_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Sewer Type:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.sewer_type || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Total Area (sqft):</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.total_area_sq_ft || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Other Areas:</label>
                      {this.state.isLoading ? <Paragraph /> : (
                        <ul>
                          <li>
                            <p>Type: {this.state.property.structure.other_areas.length ? this.state.property.structure.other_areas[0].type : "N/A"}</p>
                            <p>Sqft: {this.state.property.structure.other_areas.length ? this.state.property.structure.other_areas[0].sq_ft : "N/A"}</p>
                          </li>
                        </ul>
                      )}
                    </div>

                    <div className="mt-lg">
                      <label>Other Features:</label>
                      {this.state.isLoading ? <Paragraph /> : (
                        <ul>
                          <li>
                            <p>Type: {this.state.property.structure.other_features.length ? this.state.property.structure.other_features[0].type : "N/A"}</p>
                            <p>Sqft: {this.state.property.structure.other_features.length ? this.state.property.structure.other_features[0].sq_ft : "N/A"}</p>
                          </li>
                        </ul>
                      )}
                    </div>

                    <div className="mt-lg">
                      <label>Other Improvements:</label>
                      {this.state.isLoading ? <Paragraph /> : (
                        <ul>
                          <li>
                            <p>Type: {this.state.property.structure.other_improvements.length ? this.state.property.structure.other_improvements[0].type: "N/A"}</p>
                            <p>Sqft: {this.state.property.structure.other_improvements.length ? this.state.property.structure.other_improvements[0].sq_ft : "N/A"}</p>
                          </li>
                        </ul>
                      )}
                    </div>

                    <div className="mt-lg">
                      <label>Other Rooms:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.other_rooms || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Amenities:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.structure.amenities || "N/A")}</p>
                    </div>
                  </Panel>
                </div>
              </div>

              <div className="row mt-lg">
                <div className="col-md-6">
                  <Panel bordered>
                    <h3 className="section-title">Valuation</h3>

                    <div className="mt-lg">
                      <label>Value:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.valuation.value || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>High:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.valuation.high || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Low:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.valuation.low || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Forecast Standard Deviation:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.valuation.forecast_standard_deviation || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Date:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.valuation.date || "N/A")}</p>
                    </div>
                  </Panel>
                </div>

                <div className="col-md-6">
                  <Panel bordered>
                    <h3 className="section-title">Taxes</h3>

                    <div className="mt-lg">
                      <label>Year:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.taxes.year || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Amount:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.taxes.amount || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>Exemptions:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.taxes.exemptions || "N/A")}</p>
                    </div>

                    <div className="mt-lg">
                      <label>rate_code_area:</label>
                      <p>{this.state.isLoading ? <Paragraph /> : (this.state.property.taxes.rate_code_area || "N/A")}</p>
                    </div>
                  </Panel>
                </div>
              </div>

              <div className="row mt-lg">
                <div className="col-md-6">
                  <Panel bordered>
                    <h3 className="section-title">Market Assessments</h3>

                    <div className="mt-lg">
                      <label>Year:</label>
                      {this.state.isLoading ? <Paragraph /> : (
                        <p>{this.state.property.market_assessments.length ? this.state.property.market_assessments[0].year : "N/A"}</p>
                      )}

                    </div>

                    <div className="mt-lg">
                      <label>Land Value:</label>
                      {this.state.isLoading ? <Paragraph /> : (
                        <p>{this.state.property.market_assessments.length ? this.state.property.market_assessments[0].land_value : "N/A"}</p>
                      )}

                    </div>

                    <div className="mt-lg">
                      <label>Improvement Value:</label>
                      {this.state.isLoading ? <Paragraph /> : (
                        <p>{this.state.property.market_assessments.length ? this.state.property.market_assessments[0].improvement_value : "N/A"}</p>
                      )}
                    </div>

                    <div className="mt-lg">
                      <label>Total Value:</label>
                      {this.state.isLoading ? <Paragraph /> : (
                        <p>{this.state.property.market_assessments.length ? this.state.property.market_assessments[0].total_value : "N/A"}</p>
                      )}
                    </div>
                  </Panel>
                </div>

                <div className="col-md-6">
                  <Panel bordered>
                    <h3 className="section-title">Assessments</h3>

                    <div className="mt-lg">
                      <label>Year:</label>
                      {this.state.isLoading ? <Paragraph /> : (
                        <p>{this.state.property.assessments.length ? this.state.property.assessments[0].year : "N/A"}</p>
                      )}
                    </div>

                    <div className="mt-lg">
                      <label>Land Value:</label>
                      {this.state.isLoading ? <Paragraph /> : (
                        <p>{this.state.property.assessments.length ? this.state.property.assessments[0].land_value : "N/A"}</p>
                      )}
                    </div>

                    <div className="mt-lg">
                      <label>Improvement Value:</label>
                      {this.state.isLoading ? <Paragraph /> : (
                        <p>{this.state.property.assessments.length ? this.state.property.assessments[0].improvement_value : "N/A"}</p>
                      )}
                    </div>

                    <div className="mt-lg">
                      <label>Total Value:</label>
                      {this.state.isLoading ? <Paragraph /> : (
                        <p>{this.state.property.assessments.length ? this.state.property.assessments[0].total_value : "N/A"}</p>
                      )}
                    </div>
                  </Panel>
                </div>
              </div>

              <div className="row mt-lg">
                <div className="col-md-12">
                  <Panel bordered>
                    <h3 className="section-title">Deeds</h3>

                    {this.state.isLoading ? <Paragraph /> : (
                      <ul className="mt-lg">
                        <li>
                          <p>Document Type: {this.state.property.deeds.length ? this.state.property.deeds[0].document_type : "N/A"}</p>
                          <p>Recording Date: {this.state.property.deeds.length ? this.state.property.deeds[0].recording_date : "N/A"}</p>
                          <p>Original Contract Date: {this.state.property.deeds.length ? this.state.property.deeds[0].original_contract_date : "N/A"}</p>
                          <p>Deed Book: {this.state.property.deeds.length ? this.state.property.deeds[0].deed_book : "N/A"}</p>
                          <p>Deed Page: {this.state.property.deeds.length ? this.state.property.deeds[0].deed_page : "N/A"}</p>
                          <p>Document Id: {this.state.property.deeds.length ? this.state.property.deeds[0].document_id : "N/A"}</p>
                          <p>Sale Price: {this.state.property.deeds.length ? this.state.property.deeds[0].sale_price : "N/A"}</p>
                          <p>Sale Price Description: {this.state.property.deeds.length ? this.state.property.deeds[0].sale_price_description : "N/A"}</p>
                          <p>Transfer Tax: {this.state.property.deeds.length ? this.state.property.deeds[0].transfer_tax : "N/A"}</p>
                          <p>Distressed Sale: {this.state.property.deeds.length ? (this.state.property.deeds[0].distressed_sale ? "Yes": "No") : "N/A"}</p>
                          <p>Real Estate Owned: {this.state.property.deeds.length ? this.state.property.deeds[0].real_estate_owned : "N/A"}</p>
                          <p>Seller First Name: {this.state.property.deeds.length ? this.state.property.deeds[0].seller_first_name : "N/A"}</p>
                          <p>Seller Last Name: {this.state.property.deeds.length ? this.state.property.deeds[0].seller_last_name : "N/A"}</p>
                          <p>Second Seller First Name: {this.state.property.deeds.length ? this.state.property.deeds[0].seller2_first_name : "N/A"}</p>
                          <p>Second Seller Last Name: {this.state.property.deeds.length ? this.state.property.deeds[0].seller2_last_name: "N/A"}</p>
                          <p>Seller Address: {this.state.property.deeds.length ? this.state.property.deeds[0].seller_address : "N/A"}</p>
                          <p>Seller Unit Number: {this.state.property.deeds.length ? this.state.property.deeds[0].seller_unit_number : "N/A"}</p>
                          <p>Seller City: {this.state.property.deeds.length ? this.state.property.deeds[0].seller_city : "N/A"}</p>
                          <p>Seller State: {this.state.property.deeds.length ? this.state.property.deeds[0].seller_state : "N/A"}</p>
                          <p>Seller Zip Code: {this.state.property.deeds.length ? this.state.property.deeds[0].seller_zip_code : "N/A"}</p>
                          <p>Seller Zip Plus Four Code: {this.state.property.deeds.length ? this.state.property.deeds[0].seller_zip_plus_four_code : "N/A"}</p>
                          <p>Buyer First Name: {this.state.property.deeds.length ? this.state.property.deeds[0].buyer_first_name : "N/A"}</p>
                          <p>Buyer Last Name: {this.state.property.deeds.length ? this.state.property.deeds[0].buyer_last_name : "N/A"}</p>
                          <p>Second Buyer First Name: {this.state.property.deeds.length ? this.state.property.deeds[0].buyer2_first_name : "N/A"}</p>
                          <p>Second Buyer Last Name: {this.state.property.deeds.length ? this.state.property.deeds[0].buyer2_last_name : "N/A"}</p>
                          <p>Buyer Address: {this.state.property.deeds.length ? this.state.property.deeds[0].buyer_address : "N/A"}</p>
                          <p>Buyer Unit Type: {this.state.property.deeds.length ? this.state.property.deeds[0].buyer_unit_type: "N/A"}</p>
                          <p>Buyer Unit Number: {this.state.property.deeds.length ? this.state.property.deeds[0].buyer_unit_number : "N/A"}</p>
                          <p>Buyer City: {this.state.property.deeds.length ? this.state.property.deeds[0].buyer_city : "N/A"}</p>
                          <p>Buyer State: {this.state.property.deeds.length ? this.state.property.deeds[0].buyer_state : "N/A"}</p>
                          <p>Buyer Zip Code: {this.state.property.deeds.length ? this.state.property.deeds[0].buyer_zip_code : "N/A"}</p>
                          <p>Buyer Zip Plus Four Code: {this.state.property.deeds.length ? this.state.property.deeds[0].buyer_zip_plus_four_code : "N/A"}</p>
                          <p>Lender Name: {this.state.property.deeds.length ? this.state.property.deeds[0].lender_name : "N/A"}</p>
                          <p>Lender Type: {this.state.property.deeds.length ? this.state.property.deeds[0].lender_type : "N/A"}</p>
                          <p>Loan Amount: {this.state.property.deeds.length ? this.state.property.deeds[0].loan_amount : "N/A"}</p>
                          <p>Loan Type: {this.state.property.deeds.length ? this.state.property.deeds[0].loan_type : "N/A"}</p>
                          <p>Loan Due Date: {this.state.property.deeds.length ? this.state.property.deeds[0].loan_due_date : "N/A"}</p>
                          <p>Loan Finance Type: {this.state.property.deeds.length ? this.state.property.deeds[0].loan_finance_type : "N/A"}</p>
                          <p>Loan Interest Rate: {this.state.property.deeds.length ? this.state.property.deeds[0].loan_interest_rate : "N/A"}</p>
                        </li>
                      </ul>
                    )}
                  </Panel>
                </div>
              </div>

              <div className="row mt-lg">
                <div className="col-md-6">
                  <Panel bordered>
                    <h3 className="section-title">School Districts</h3>

                    {this.state.property.hasOwnProperty('school_districts') && this.state.property.school_districts.map((schoolDistrict, key) => {
                      return (
                        <span>
                          <div className="mt-lg">
                            <label>District Name:</label>
                            <p>{schoolDistrict.districtName}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Phone:</label>
                            <p>{schoolDistrict.phone}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Address:</label>
                            <p>
                              {schoolDistrict.address.street}, <br />
                              {schoolDistrict.address.city}, {schoolDistrict.address.state} {schoolDistrict.address.zip}
                            </p>
                          </div>

                          <div className="mt-lg">
                            <label>Low Grade:</label>
                            <p>{schoolDistrict.lowGrade}</p>
                          </div>

                          <div className="mt-lg">
                            <label>High Grade:</label>
                            <p>{schoolDistrict.highGrade}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Total # of Schools</label>
                            <p>{schoolDistrict.numberTotalSchools}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Total # of Primary Schools</label>
                            <p>{schoolDistrict.numberPrimarySchools}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Total # of Middle Schools</label>
                            <p>{schoolDistrict.numberMiddleSchools}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Total # of High Schools</label>
                            <p>{schoolDistrict.numberHighSchools}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Rank History</label>

                            <ul>
                            {(schoolDistrict.hasOwnProperty('rankHistory') && schoolDistrict.rankHistory !== null )
                            ?
                            schoolDistrict.rankHistory.map(item => {
                              return (
                                <li>
                                  <p>Year: {item.year}</p>
                                  <p>Rank: {item.rank}</p>
                                  <p>Rank Of: {item.rankOf}</p>
                                  <p>Rank Stars: {item.rankStars}</p>
                                  <p>Rankwide Percentage: {item.rankStatewidePercentage}</p>
                                  <p>Rank Score: {item.rankScore}</p>
                                </li>
                              )
                            }) : "N/A"}
                            </ul>

                          </div>

                          <hr />
                        </span>
                      )
                    })}
                  </Panel>
                </div>
                <div className="col-md-6">
                  <Panel bordered>
                    <h3 className="section-title">School Rankings</h3>

                    {this.state.property.hasOwnProperty('school_rankings') && this.state.property.school_rankings.map((schoolRanking) => {
                      return (
                        <span>
                          <div className="mt-lg">
                            <label>School Name:</label>
                            <p>{schoolRanking.schoolName}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Phone:</label>
                            <p>{schoolRanking.phone}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Address:</label>
                            <p>
                              {schoolRanking.address.street} <br />
                              {schoolRanking.address.city}, {schoolRanking.address.state} {schoolRanking.address.zip}
                            </p>
                          </div>

                          <div className="mt-lg">
                            <label>Low Grade:</label>
                            <p>{schoolRanking.lowGrade}</p>
                          </div>

                          <div className="mt-lg">
                            <label>High Grade:</label>
                            <p>{schoolRanking.highGrade}</p>
                          </div>

                          <div className="mt-lg">
                            <label>School Level:</label>
                            <p>{schoolRanking.schoolLevel}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Charter School:</label>
                            <p>{schoolRanking.isCharterSchool}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Magnet School:</label>
                            <p>{schoolRanking.isMagnetSchool}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Virtual School:</label>
                            <p>{schoolRanking.isVirtualSchool}</p>
                          </div>

                          <div className="mt-lg">
                            <label>District ID:</label>
                            <p>{schoolRanking.district.districtID}</p>
                          </div>

                          <div className="mt-lg">
                            <label>District Name:</label>
                            <p>{schoolRanking.district.districtName}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Private School:</label>
                            <p>{schoolRanking.isPrivate ? "Yes": "No"}</p>
                          </div>

                          <div className="mt-lg">
                            <label>School Yearly Details:</label>
                            <ul>
                              {schoolRanking.schoolYearlyDetails.map((item) => {
                                return (
                                  <li>
                                    <p>Year: {item.year}</p>
                                    <p>Number of Students: {item.numberOfStudents}</p>
                                    <p>Percentage of Free Lunch: {item.percentFreeDiscLunch}</p>
                                    <p>Percentage of African American Students: {item.percentofAfricanAmericanStudents}</p>
                                    <p>Percentage of Asian Students: {item.percentofAsianStudents}</p>
                                    <p>Percentage of Hispanic Students: {item.percentofHispanicStudents}</p>
                                    <p>Percentage of Indian Students: {item.percentofIndianStudents}</p>
                                    <p>Percentage of Pacific Islander Students: {item.percentofPacificIslanderStudents}</p>
                                    <p>Percentage of White Students: {item.percentofWhiteStudents}</p>
                                    <p>Percentage of Two or More Race Students: {item.percentofTwoOrMoreRaceStudents}</p>
                                    <p>Percentage of Unspecified Race Students: {item.percentofUnspecifiedRaceStudents}</p>
                                    <p>Fulltime Teachers: {item.teachersFulltime}</p>
                                    <p>Pupil to Teacher Ration: {item.pupilTeacherRatio}</p>
                                    <p>Number of African American Students: {item.numberofAfricanAmericanStudents}</p>
                                    <p>Number of Asian Students: {item.numberofAsianStudents}</p>
                                    <p>Number of Hispanic Students: {item.numberofHispanicStudents}</p>
                                    <p>Number of Indian Students: {item.numberofIndianStudents}</p>
                                    <p>Number of Pacific Islander Students: {item.numberofPacificIslanderStudents}</p>
                                    <p>Number of White Students: {item.numberofWhiteStudents}</p>
                                    <p>Number of Two or More Race Students: {item.numberofTwoOrMoreRaceStudents}</p>
                                    <p>Number of Unspecified Race Students: {item.numberofUnspecifiedRaceStudents}</p>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>

                          <hr />
                        </span>
                      )
                    })}
                  </Panel>
                </div>
              </div>

              <div className="row mt-lg">
                <div className="col-md-6">
                  <Panel bordered>
                    <h3 className="section-title">Schools</h3>

                    {this.state.property.hasOwnProperty('schools') && this.state.property.schools.map((school) => {
                      return (
                        <span>
                          <div className="mt-lg">
                            <label>School Name:</label>
                            <p>{school.schoolName}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Phone:</label>
                            <p>{school.phone}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Address:</label>
                            <p>
                              {school.address.street} <br />
                              {school.address.city}, {school.address.state} {school.address.zip}
                            </p>
                          </div>

                          <div className="mt-lg">
                            <label>Low Grade:</label>
                            <p>{school.lowGrade}</p>
                          </div>

                          <div className="mt-lg">
                            <label>High Grade:</label>
                            <p>{school.highGrade}</p>
                          </div>

                          <div className="mt-lg">
                            <label>School Level:</label>
                            <p>{school.schoolLevel}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Charter School:</label>
                            <p>{school.isCharterSchool}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Magnet School:</label>
                            <p>{school.isMagnetSchool}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Virtual School:</label>
                            <p>{school.isVirtualSchool}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Private:</label>
                            <p>{school.isPrivate ? "Yes": "No"}</p>
                          </div>

                          <div className="mt-lg">
                            <label>District ID:</label>
                            <p>{school.districtID}</p>
                          </div>

                          <div className="mt-lg">
                            <label>District Name:</label>
                            <p>{school.districtName}</p>
                          </div>

                          <div className="mt-lg">
                            <label>Rank History</label>
                            <ul>
                            {(school.hasOwnProperty('rankHistory') && school.rankHistory !== null )
                            ?
                            school.rankHistory.map(item => {
                              return (
                                <li>
                                  <p>Year: {item.year}</p>
                                  <p>Rank: {item.rank}</p>
                                  <p>Rank Of: {item.rankOf}</p>
                                  <p>Rank Stars: {item.rankStars}</p>
                                  <p>Rankwide Percentage: {item.rankStatewidePercentage}</p>
                                  <p>Rank Score: {item.rankScore}</p>
                                </li>
                              )
                            }) : "N/A"}
                            </ul>
                          </div>

                          <div className="mt-lg">
                            <label>Rank Movement:</label>
                            <p>{school.rankMovement}</p>
                          </div>

                          <div className="mt-lg">
                            <label>School Yearly Details:</label>
                            <ul>
                              {school.schoolYearlyDetails.map((item) => {
                                return (
                                  <li>
                                    <p>Year: {item.year}</p>
                                    <p>Number of Students: {item.numberOfStudents}</p>
                                    <p>Percentage of Free Lunch: {item.percentFreeDiscLunch}</p>
                                    <p>Percentage of African American Students: {item.percentofAfricanAmericanStudents}</p>
                                    <p>Percentage of Asian Students: {item.percentofAsianStudents}</p>
                                    <p>Percentage of Hispanic Students: {item.percentofHispanicStudents}</p>
                                    <p>Percentage of Indian Students: {item.percentofIndianStudents}</p>
                                    <p>Percentage of Pacific Islander Students: {item.percentofPacificIslanderStudents}</p>
                                    <p>Percentage of White Students: {item.percentofWhiteStudents}</p>
                                    <p>Percentage of Two or More Race Students: {item.percentofTwoOrMoreRaceStudents}</p>
                                    <p>Percentage of Unspecified Race Students: {item.percentofUnspecifiedRaceStudents}</p>
                                    <p>Fulltime Teachers: {item.teachersFulltime}</p>
                                    <p>Pupil to Teacher Ration: {item.pupilTeacherRatio}</p>
                                    <p>Number of African American Students: {item.numberofAfricanAmericanStudents}</p>
                                    <p>Number of Asian Students: {item.numberofAsianStudents}</p>
                                    <p>Number of Hispanic Students: {item.numberofHispanicStudents}</p>
                                    <p>Number of Indian Students: {item.numberofIndianStudents}</p>
                                    <p>Number of Pacific Islander Students: {item.numberofPacificIslanderStudents}</p>
                                    <p>Number of White Students: {item.numberofWhiteStudents}</p>
                                    <p>Number of Two or More Race Students: {item.numberofTwoOrMoreRaceStudents}</p>
                                    <p>Number of Unspecified Race Students: {item.numberofUnspecifiedRaceStudents}</p>
                                  </li>
                                )
                              })}
                            </ul>
                          </div>

                          <hr />
                        </span>
                      )
                    })}
                  </Panel>
                </div>
                <div className="col-md-6">
                  <Panel bordered>
                    <h3 className="section-title">Sound Score</h3>

                    {this.state.property.hasOwnProperty('sound_score') && (
                      <span>
                        <div className="mt-lg">
                          <label>Airports:</label>
                          <p>{ this.state.property.sound_score[0].airports }</p>
                        </div>

                        <div className="mt-lg">
                          <label>Traffic Text:</label>
                          <p>{ this.state.property.sound_score[0].traffictext }</p>
                        </div>

                        <div className="mt-lg">
                          <label>Local Text:</label>
                          <p>{ this.state.property.sound_score[0].localtext }</p>
                        </div>

                        <div className="mt-lg">
                          <label>Airports Text:</label>
                          <p>{ this.state.property.sound_score[0].airportstext }</p>
                        </div>

                        <div className="mt-lg">
                          <label>Score:</label>
                          <p>{ this.state.property.sound_score[0].score }</p>
                        </div>

                        <div className="mt-lg">
                          <label>Traffic:</label>
                          <p>{ this.state.property.sound_score[0].traffic }</p>
                        </div>

                        <div className="mt-lg">
                          <label>Score Text:</label>
                          <p>{ this.state.property.sound_score[0].scoretext }</p>
                        </div>

                        <div className="mt-lg">
                          <label>Local:</label>
                          <p>{ this.state.property.sound_score[0].local }</p>
                        </div>

                      </span>
                    )}
                  </Panel>
                </div>
              </div>

              <div className="row mt-lg">
                <div className="col-md-6">
                  <Panel bordered>
                    <h3 className="section-title">Walk Score</h3>

                    {this.state.property.hasOwnProperty('walk_score') && (
                      <span>
                        <div className="mt-lg">
                          <label>Walk Score:</label>
                          <p>{this.state.property.walk_score.walkscore}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Walk Score Description:</label>
                          <p>{this.state.property.walk_score.walkscoreDescription}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Transit Details:</label>
                          <p>{this.state.property.walk_score.transitDetails || "N/A"}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Bike Score:</label>
                          <p>{this.state.property.walk_score.bikeDetails.score}</p>
                        </div>
                      </span>
                    )}
                  </Panel>
                </div>
                <div className="col-md-6">
                  <Panel bordered>
                    <h3 className="section-title">Past Day Weather</h3>

                    <ul>
                    {this.state.property.hasOwnProperty('past_day_weather') && this.state.property.past_day_weather.map((item) => {
                      return (
                        <li>
                          <p>Feels Like: {item.feels_like.value}{item.feels_like.units}</p>
                          <p>Tempurature: {item.temp.value}{item.temp.units}</p>
                          <p>Dew Point: {item.dewpoint.value}{item.dewpoint.units}</p>
                          <p>Wind Speed: {item.wind_speed.value}{item.wind_speed.units}</p>
                          <p>Humidity: {item.humidity.value}{item.humidity.units}</p>
                          <p>Precipitation: {item.precipitation.value}{item.precipitation.units}</p>
                          <p>Observation Time: {item.observation_time.value}</p>
                        </li>
                      )
                    })}
                    </ul>
                  </Panel>
                </div>
              </div>

              <div className="row mt-lg">
                <div className="col-md-6">
                  <Panel bordered>
                    <h3 className="section-title">Current Day Weather:</h3>

                    {this.state.property.hasOwnProperty('current_day_weather') && (
                      <span>
                        <div className="mt-lg">
                          <label>Tempurature:</label>
                          <p>{this.state.property.current_day_weather.temp.value}{this.state.property.current_day_weather.temp.units}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Feels Like:</label>
                          <p>{this.state.property.current_day_weather.feels_like.value}{this.state.property.current_day_weather.feels_like.units}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Dew Point:</label>
                          <p>{this.state.property.current_day_weather.dewpoint.value}{this.state.property.current_day_weather.dewpoint.units}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Wind Speed:</label>
                          <p>{this.state.property.current_day_weather.wind_speed.value}{this.state.property.current_day_weather.wind_speed.units}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Humidity:</label>
                          <p>{this.state.property.current_day_weather.humidity.value}{this.state.property.current_day_weather.humidity.units}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Wind Direction</label>
                          <p>{this.state.property.current_day_weather.wind_direction.value}{this.state.property.current_day_weather.wind_direction.units}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Precipitation:</label>
                          <p>{this.state.property.current_day_weather.precipitation.value}{this.state.property.current_day_weather.precipitation.units}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Precipitation Type:</label>
                          <p>{this.state.property.current_day_weather.precipitation_type.value}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Fire Index:</label>
                          <p>{this.state.property.current_day_weather.fire_index.value}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Sunrise:</label>
                          <p>{this.state.property.current_day_weather.sunrise.value}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Sunset:</label>
                          <p>{this.state.property.current_day_weather.sunset.value}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Road Risk:</label>
                          <p>{this.state.property.current_day_weather.road_risk_score.value}</p>
                        </div>

                        <div className="mt-lg">
                          <label>Observation Time:</label>
                          <p>{this.state.property.current_day_weather.observation_time.value}</p>
                        </div>
                      </span>
                    )}
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

export default connect(mapStateToProps, null)(PropertyDetailsReportPage);
