import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';
import classNames from 'classnames';
import {
  Button,
  Container,
  Panel,
  Placeholder,
  Input,
  InputGroup,
  Icon,
  IconButton,
  Table,
  Popover,
  Whisper,
  Dropdown,
  Checkbox,
  Modal
} from 'rsuite';
import TopNav from './TopNav';
import RV_Sidebar from './RV_Sidebar';
import RelationshipCard from './RelationshipCard';
import '../styles/RelationshipDetailsPage.scss';

class RelationshipDetailsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      relationshipDetails: {}
    };
  }

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/relationship/${this.props.match.params.id}`, {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 200) {
          this.setState({
            relationshipDetails: response.data
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <div className="relationship-details-page">
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
              <Link to="/relationships"><Icon icon="angle-left" /> Back to Relationships</Link>

              <div className="row mt-lg">
                <div className="col-md-8">
                  <Panel className="relationship-details__data" bordered>
                    <h4 className="section-title">Primary Buyer</h4>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>First Name</label>
                        <p>Jane</p>
                      </div>
                      <div className="col-md-4">
                        <label>Last Name</label>
                        <p>Smith</p>
                      </div>
                      <div className="col-md-4">
                        <label>Email Address</label>
                        <p>jane.smith@gmail.com</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>Phone Number</label>
                        <p>000 000 0000</p>
                      </div>
                      <div className="col-md-4">
                        <label>Address</label>
                        <p>123 Main St., Miami, FL 33005</p>
                      </div>
                    </div>

                    <hr />

                    <h4 className="section-title">Secondary Buyer</h4>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>First Name</label>
                        <p>Bob</p>
                      </div>
                      <div className="col-md-4">
                        <label>Last Name</label>
                        <p>Smith</p>
                      </div>
                      <div className="col-md-4">
                        <label>Email Address</label>
                        <p>bob.smith@gmail.com</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>Phone Number</label>
                        <p>000 000 0000</p>
                      </div>
                      <div className="col-md-4">
                        <label>Address</label>
                        <p>123 Main St., Miami, FL 33005</p>
                      </div>
                    </div>

                    <hr />

                    <h4 className="section-title">HOME SEARCH</h4>

                    <div className="row mt-lg">
                      <div className="col-md-8">
                        <label>Neighborhoods</label>
                        <p>-</p>
                      </div>

                      <div className="col-md-4">
                        <label>Maximum Monthly Payment:</label>
                        <p>$0.00</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-8">
                        <label>Districts</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>Zip Code</label>
                        <p>10012</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>Property Type</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>Min. Home Size (SqFt)</label>
                        <p>00 SqFt</p>
                      </div>
                      <div className="col-md-4">
                        <label>Min. Lot Size</label>
                        <p>00 SqFt</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>Stories</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>Min. Bedrooms</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>Min. Bathrooms</label>
                        <p>-</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>Heating &amp; Cooling</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>Parking</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>Garage</label>
                        <p>-</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>Lot Types &amp; Views</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>New Construction</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>Pool</label>
                        <p>-</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-12">
                        <label>Amenities</label>
                        <p>-</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-12">
                        <label>Keywords</label>
                        <p>-</p>
                      </div>
                    </div>

                    <hr />

                    <h4 className="section-title">Places that matter</h4>

                    <div className="row mt-lg">
                      <div className="col-md-3">
                        <label>University</label>
                      </div>
                      <div className="col-md-9">
                        <p>Columbia University, New York, NY 10027, United States</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-3">
                        <label>Office</label>
                      </div>
                      <div className="col-md-9">
                        <p>101 Independence Avenue, S.E. Washington, D.C. 20559-6000</p>
                      </div>
                    </div>

                    <hr />

                    <h4 className="section-title">LENDER DETAILS</h4>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>Lender Name</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>Lender Company Phone</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>Lender Support Email</label>
                        <p>-</p>
                      </div>
                    </div>

                    <hr />

                    <h4 className="section-title">LOAN OFFICER DETAILS</h4>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>Loan Officer Name</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>Loan Officer Phone</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>Loan Officer Email</label>
                        <p>-</p>
                      </div>
                    </div>

                    <hr />

                    <h4 className="section-title">FINANCES</h4>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>Pre-Approval Date</label>
                        <p>MM-DD-YYYY</p>
                      </div>
                      <div className="col-md-4">
                        <label>Borrower 1</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>Borrower 2</label>
                        <p>-</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>Loan Type</label>
                        <p>Conventional</p>
                      </div>
                      <div className="col-md-4">
                        <label>Purchase Price</label>
                        <p>$0.00</p>
                      </div>
                      <div className="col-md-4">
                        <label>Seller Concession</label>
                        <p>-</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>Down Payment Amount</label>
                        <p>$0.00</p>
                      </div>
                      <div className='col-md-4'>
                        <label>Base Loan Amount</label>
                        <p>$0.00</p>
                      </div>
                      <div className="col-md-4">
                        <label>Loan to Value</label>
                        <p>-</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>Monthly Taxes</label>
                        <p>$0.00</p>
                      </div>
                      <div className="col-md-4">
                        <label>Home Owners Insurance</label>
                        <p>-</p>
                      </div>
                      <div className="col-md-4">
                        <label>Home Owners Association</label>
                        <p>-</p>
                      </div>
                    </div>

                    <div className="row mt-lg">
                      <div className="col-md-4">
                        <label>Mortgage Rate</label>
                        <p>0.00%</p>
                      </div>
                      <div className="col-md-4">
                        <label>Additional Fees</label>
                        <p>$0.00</p>
                      </div>
                      <div className="col-md-4">
                        <label>Lender Credit</label>
                        <p>-</p>
                      </div>
                    </div>

                    <hr />

                    <h4 className="section-title">DOCUMENTS</h4>

                    <ul className="documents-list">
                      <li className="document-item">
                        <p className="name">Contract</p>
                        <div className="file-details">
                          <p className="file-details__name">Contract.pdf</p>
                          <p className="file-details__meta">
                            2.30MB | Uploaded on 10/25/2020 3:02 PM
                          </p>
                        </div>
                        <Whisper
                          trigger="click"
                          placement="autoVerticalStart"
                          speaker={
                            <Popover full>
                              <Dropdown.Menu>
                                <Dropdown.Item>Share</Dropdown.Item>
                                <Dropdown.Item>Delete</Dropdown.Item>
                              </Dropdown.Menu>
                            </Popover>
                          }
                        >
                          <IconButton appearance="subtle" icon={<Icon icon="more" />} />
                        </Whisper>
                      </li>
                      <li className="document-item">

                      </li>
                    </ul>

                    <Button appearance="primary">+ Add Documents</Button>

                  </Panel>
                </div>
                <div className="col-md-4">
                  <RelationshipCard relationship={this.state.relationshipDetails} />
                </div>
              </div>
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

export default connect(mapStateToProps, null)(RelationshipDetailsPage);
