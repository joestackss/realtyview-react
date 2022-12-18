import React from "react";
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import classNames from 'classnames';
import empty from 'is-empty';
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

import MainLayout from './layouts/main';
import mockData from '../data/offers.json';
import { ReactComponent as OffersSentIcon } from '../images/icons/offers-sent-icon.svg';
import { ReactComponent as OfferReceivedIcon } from '../images/icons/offers-received-icon.svg';
import { ReactComponent as OpenOffersIcon } from '../images/icons/open-offers-icon.svg';
import { ReactComponent as OffersClosedIcon } from '../images/icons/offers-closed-icon.svg';
import "../styles/OfferManagementPage.scss";

class OfferManagementPage extends React.Component {
  constructor(props) {
    super(props);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeLength = this.handleChangeLength.bind(this);
    this.state = {
      searchTerm: "",
      offers: [],
      page: 1,
      displayLength: 10,
      displayRelationshipType: ""
    };
  }

  componentDidMount() {
    this.setState({
      offers: mockData.offers
    })
  }

  handleChangePage(dataKey) {
    this.setState({
      page: dataKey
    });
  }

  handleChangeLength(dataKey) {
    this.setState({
      page: 1,
      displayLength: dataKey
    });
  }

  render() {
    const { Column, HeaderCell, Cell, Pagination } = Table;
    return (
      <MainLayout
        layoutClassName="offer-management-page"
      >
        <h2 className="page-context-title">Offer Management</h2>

        <section id="offer-stats">
          <div className="row">
            <div className="col-md-3">
              <Panel bordered>
                <div className="offers-sent-icon-wrap">
                  <OffersSentIcon />
                </div>
                <div className="stat-details">
                  <p className="stat-totals">3,947</p>
                  <p className="stat-type">Offer Sent</p>
                </div>
              </Panel>
            </div>
            <div className="col-md-3">
              <Panel bordered>
                <div className="offers-received-icon-wrap">
                  <OfferReceivedIcon />
                </div>
                <div className="stat-details">
                  <p className="stat-totals">624</p>
                  <p className="stat-type">Offers Received</p>
                </div>
              </Panel>
            </div>
            <div className="col-md-3">
              <Panel bordered>
                <div className="offers-open-icon-wrap">
                  <OpenOffersIcon />
                </div>
                <div className="stat-details">
                  <p className="stat-totals">3,195</p>
                  <p className="stat-type">Open Offers</p>
                </div>
              </Panel>
            </div>
            <div className="col-md-3">
              <Panel bordered>
                <div className="offers-closed-icon-wrap">
                  <OffersClosedIcon />
                </div>
                <div className="stat-details">
                  <p className="stat-totals">128</p>
                  <p className="stat-type">Closed Offers</p>
                </div>
              </Panel>
            </div>
          </div>
        </section>

        <section id="offers">
          <Panel bordered>
            <div className="toolbar">
              <div className="display-filters">
                <p>Show</p>
                <Button
                  className="default-filter"
                  size="xs"
                  appearance="subtle"
                  onClick={() => this.setState({ displayRelationshipType: "" })}
                >
                  All
                </Button>
                <Button
                  size="xs"
                  color="cyan"
                  appearance="ghost"
                  onClick={() => this.setState({ displayRelationshipType: "buyer" })}
                >
                  Buyer
                </Button>
                <Button
                  size="xs"
                  color="red"
                  appearance="ghost"
                  onClick={() => this.setState({ displayRelationshipType: "seller" })}
                >
                  Seller
                </Button>
                <Button
                  size="xs"
                  color="violet"
                  appearance="ghost"
                  onClick={() => this.setState({ displayRelationshipType: "renter" })}
                >
                  Renter
                </Button>
                <Button
                  size="xs"
                  color="yellow"
                  appearance="ghost"
                  onClick={() => this.setState({ displayRelationshipType: "landlord" })}
                >
                  Landlord
                </Button>
              </div>

              <div className="right-toolbar">
                <InputGroup inside className="offers-search">
                    <InputGroup.Addon>
                      <Icon icon="search" />
                    </InputGroup.Addon>
                    <Input
                      onChange={(value) => {
                        this.setState({
                          searchTerm: value
                        });
                      }}
                    />
                </InputGroup>

                <Button
                  color="green"
                  onClick={() => {
                    this.props.history.push("/create-offer");
                  }}
                >
                  Create Offer
                </Button>
                <Button color="violet">New Listing</Button>
              </div>
            </div>

            <Table
              id="offer-list"
              height={520}
              data={
                this.state
                  .offers
                  .filter((v, i) => {
                    const start = this.state.displayLength * (this.state.page - 1);
                    const end = start + this.state.displayLength;
                    return i >= start && i < end;
                  })
                  // Filter display relationship type
                  .filter((v, i) => {
                    console.log(v);
                    if (!empty(this.state.displayRelationshipType)) {
                      if (v.client_relationship_type.indexOf(this.state.displayRelationshipType) !== -1) {
                        return v;
                      }
                    } else {
                      return v;
                    }
                  })
                  // Filter by search term
                  .filter((v, i) => {
                    if (!empty(this.state.searchTerm)) {
                      if (v.client_name.toLowerCase().search(this.state.searchTerm.toLowerCase()) !== -1) {
                        return v;
                      }
                    } else {
                      return v;
                    }
                  })
              }
            >
              <Column width={150}>
                <HeaderCell>OFFER ID</HeaderCell>
                <Cell dataKey="id"></Cell>
              </Column>
              <Column width={180}>
                <HeaderCell>CLIENT</HeaderCell>
                <Cell>
                  {rowData => {
                    return (
                    <span className="inline">
                      <div className={classNames({
                        dot: true,
                        cyan: rowData.client_relationship_type === "buyer",
                        red: rowData.client_relationship_type === "seller",
                        violet: rowData.client_relationship_type === "renter",
                        yellow: rowData.client_relationship_type === "landlord"
                      })}>
                      </div>
                      <p className="client-name">{rowData.client_name}</p>
                    </span>
                    )
                  }}
                </Cell>
              </Column>
              <Column flexGrow={1}>
                <HeaderCell>ADDRESS</HeaderCell>
                <Cell dataKey="address"></Cell>
              </Column>
              <Column width={100}>
                <HeaderCell>STATUS</HeaderCell>
                <Cell>
                  {rowData => {
                    return (
                      <div className={classNames({
                        "tag": true,
                        "tag-open": rowData.status == "open",
                        "tag-closed": rowData.status == "closed"
                      })}>
                        {rowData.status}
                      </div>
                    )
                  }}
                </Cell>
              </Column>
              <Column width={100}>
                <HeaderCell>MLS NO.</HeaderCell>
                <Cell dataKey="mls_number"></Cell>
              </Column>
              <Column width={100}>
                <HeaderCell>CREATED</HeaderCell>
                <Cell dataKey="created"></Cell>
              </Column>
              <Column width={100}>
                <HeaderCell>EXPIRATION</HeaderCell>
                <Cell dataKey="expiration"></Cell>
              </Column>
            </Table>

            <Table.Pagination
              next={true}
              last={true}
              activePage={this.state.page}
              total={this.state.offers.length}
              displayLength={this.state.displayLength}
              lengthMenu={[
                {
                  value: 10,
                  label: 10
                },
                {
                  value: 20,
                  label: 20
                }
              ]}
              onChangePage={this.handleChangePage}
              onChangeLength={this.handleChangeLength}
            />
          </Panel>
        </section>
      </MainLayout>
    )
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    isSideMenuOpen: state.common.isSideMenuOpen
  };
}

export default connect(mapStateToProps, null)(withRouter(OfferManagementPage));
