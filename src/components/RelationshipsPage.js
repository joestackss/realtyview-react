/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import classNames from 'classnames';
import axios from 'axios';
import empty from 'is-empty';
import moment from 'moment';
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
import { store as notificationStore } from 'react-notifications-component';

import { ucWords } from '../utils/common';
import MainLayout from './layouts/main';
import RelationshipCard from './RelationshipCard';
import RelationshipTypeSelectModal from './RelationshipTypeSelectModal';
import '../styles/RelationshipsPage.scss';


class RelationshipsPage extends React.Component {
  constructor(props) {
    super(props);
    this.viewRelationshipEntityDetails = this.viewRelationshipEntityDetails.bind(this);
    this.handleChangePage = this.handleChangePage.bind(this);
    this.handleChangeLength = this.handleChangeLength.bind(this);
    this.handleRelationshipDelete = this.handleRelationshipDelete.bind(this);

    this.state = {
      relationships: [],
      selectedRelationshipTypes: [],
      isRelationshipSelectorModalOpen: false,
      selectedRelationshipEntity: "",
      displayLength: 10,
      displayRelationshipType: "",
      searchTerm: "",
      page: 1
    }
  }

  componentDidMount() {
    axios
      .get(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/relationship/list`, {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 200) {
          const relationships = response.data.map((relationship) => {
            return {
              relationshipId: relationship.id,
              agentId: relationship.agent_id,
              name: relationship.relationship_primary_buyer.first_name + " " + relationship.relationship_primary_buyer.last_name,
              email: relationship.relationship_primary_buyer.email,
              phone: relationship.relationship_primary_buyer.phone,
              address: relationship.relationship_primary_buyer.address,
              createdAt: relationship.created_at,
              updatedAt: relationship.updated_at,
              type: relationship.relationship_types.map((relationshipType) => {
                return relationshipType.type
              })
            }
          });

          this.setState({
            relationships: relationships,
            selectedRelationshipEntity: !empty(relationships) ? relationships[0] : []
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleChangePage(dataKey) {
    this.setState({
      page: dataKey
    });
  }

  handleRelationshipDelete(relationshipId) {
    axios
      .delete(`${process.env.REACT_APP_REALTYVIEW_API_ENDPOINT}/relationship/${relationshipId}`, {
        withCredentials: true
      })
      .then((response) => {
        if (response.status === 200) {
          // Remove the relationship from the state.
          const relationshipsCopy = this.state.relationships;
          const matchIndex = relationshipsCopy.findIndex((relationship) => {
            return relationship.relationshipId === relationshipId
          });

          if (matchIndex !== -1) {
            relationshipsCopy.splice(matchIndex, 1);
            this.setState(prevState => {
              return {
                relationships: relationshipsCopy,
                selectedRelationshipEntity: prevState.selectedRelationshipEntity.relationshipId === relationshipId
                  ?
                  [] : prevState.selectedRelationshipEntity
              }
            });
          }

          // Success message to the user
          notificationStore.addNotification({
            title: "Success",
            message: `The relationship was deleted successfully.`,
            type: "success",
            insert: "top",
            container: "top-right",
            animationIn: ["animated", "fadeIn"],
            animationOut: ["animated", "fadeOut"],
            dismiss: {
              duration: 5000,
              onScreen: true
            }
          });
        }
      })
      .catch((err) => {
        notificationStore.addNotification({
          title: "Error!",
          message: `The relationship could not be deleted.`,
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
      });
  }

  handleChangeLength(dataKey) {
    this.setState({
      page: 1,
      displayLength: dataKey
    });
  }

  viewRelationshipEntityDetails(relationshipId) {
    this.setState({
      selectedRelationshipEntity: relationshipId
    });
  }

  render() {
    const { Column, HeaderCell, Cell, Pagination } = Table;

    return (
      <MainLayout
        layoutClassName="relationships-page"
      >
        <h2 className="page-context-title">Relationships</h2>

        <div className="row">
          <div className="col-md-8">
            <Panel className="relationships-wrap" bordered>
              <div className="inline-group">
                <div className="show-filters">
                  <p>Show</p>
                  <Button
                    className="default-filter"
                    size="xs"
                    appearance="subtle"
                    onClick={() => this.setState({ displayRelationshipType: "" })}
                  >
                    ALL
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
                <div className="inline-group">
                  <InputGroup inside className="relationships-search">
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
                      this.setState({
                        isRelationshipSelectorModalOpen: true
                      });
                    }}
                  >
                    Add
                  </Button>
                </div>
              </div>

              <Table
                id="relationships-list"
                height={420}
                data={
                  this.state
                    .relationships
                    .filter((v, i) => {
                      const start = this.state.displayLength * (this.state.page - 1);
                      const end = start + this.state.displayLength;
                      return i >= start && i < end;
                    })
                    // Filter display relationship type
                    .filter((v, i) => {
                      if (!empty(this.state.displayRelationshipType)) {
                        if (v.type.indexOf(this.state.displayRelationshipType) !== -1) {
                          return v;
                        }
                      } else {
                        return v;
                      }
                    })
                    // Filter by search term
                    .filter((v, i) => {
                      if (!empty(this.state.searchTerm)) {
                        if (v.name.toLowerCase().search(this.state.searchTerm.toLowerCase()) !== -1) {
                          return v;
                        }
                      } else {
                        return v;
                      }
                    })
                }
                rowHeight={(rowData) => {
                  if (empty(rowData)) {
                    return 46;
                  } else {
                    if (rowData.type.length === 1) {
                      return 46;
                    } else if (rowData.type.length === 2) {
                      return 60;
                    } else if (rowData.type.length === 3) {
                      return 80;
                    } else if (rowData.type.length === 4) {
                      return 100;
                    }
                  }
                }}
              >
                <Column flexGrow={1}>
                  <HeaderCell>Name</HeaderCell>
                  <Cell dataKey="name"></Cell>
                </Column>
                <Column width={180}>
                  <HeaderCell>Phone</HeaderCell>
                  <Cell dataKey="phone"></Cell>
                </Column>
                <Column width={180}>
                  <HeaderCell>Email</HeaderCell>
                  <Cell dataKey="email"></Cell>
                </Column>
                <Column width={125}>
                  <HeaderCell>Relationship</HeaderCell>
                  <Cell className="relationship">
                    {rowData => {
                      return rowData.type.map((relationshipType) => {
                        return (
                          <span>
                            <div className={classNames({
                              dot: true,
                              cyan: relationshipType === "buyer",
                              red: relationshipType === "seller",
                              violet: relationshipType === "renter",
                              yellow: relationshipType === "landlord"
                            })}>
                            </div>
                            {ucWords(relationshipType)}
                          </span>
                        )
                      })
                    }}
                  </Cell>
                </Column>
                <Column>
                  <HeaderCell>Actions</HeaderCell>
                  <Cell className="actions-cell">
                    {rowData => (
                      <Whisper
                        trigger="click"
                        placement="autoVerticalStart"
                        speaker={
                          <Popover full>
                            <Dropdown.Menu>
                              <Dropdown.Item
                                eventKey={1}
                                onClick={() => {
                                  this.setState({
                                    selectedRelationshipEntity: rowData
                                  })
                                }}
                              >
                                View
                              </Dropdown.Item>
                              <Dropdown.Item eventKey={2}>Edit</Dropdown.Item>
                              <Dropdown.Item
                                eventKey={3}
                                onClick={() => {
                                  this.handleRelationshipDelete(rowData.relationshipId);
                                }}
                              >
                                Delete
                              </Dropdown.Item>
                              <Dropdown.Item eventKey={4}>Send Email</Dropdown.Item>
                            </Dropdown.Menu>
                          </Popover>
                        }
                      >
                        <IconButton appearance="subtle" icon={<Icon icon="more" />} />
                      </Whisper>
                    )}
                  </Cell>
                </Column>
              </Table>

              <Table.Pagination
                next={true}
                last={true}
                activePage={this.state.page}
                total={this.state.relationships.length}
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
          </div>
          <div className="col-md-4">
            <Panel id="relationship-details" bordered>
              <div className="inline">
                <div className="avatar"></div>
                <div>
                  <p className="name">
                    {this.state.selectedRelationshipEntity.name}
                  </p>
                  <p className="type">
                    {!empty(this.state.selectedRelationshipEntity) ? ucWords(this.state.selectedRelationshipEntity.type.join(", ")) : ""}
                  </p>
                </div>
              </div>

              <div className="action-buttons">
                <Link to={`/relationship/${this.state.selectedRelationshipEntity.relationshipId}`}>
                  <Button size="xs" color="violet">View</Button>
                </Link>

                <Button size="xs" appearance="default">Send Email</Button>
                <Button size="xs" appearance="default">Edit</Button>
              </div>
              <div className="notes mt-lg">
                <label>Notes:</label>
                <p>{this.state.selectedRelationshipEntity.notes}</p>
              </div>

              <div className="row mt-lg">
                <div className="col-md-6">
                  <div className="date-created">
                    <label>Added:</label>
                    <p>{!empty(this.state.selectedRelationshipEntity.createdAt) ? moment(this.state.selectedRelationshipEntity.createdAt).format("MMM D, Y") : ""}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="date-modified">
                    <label>Last Updated:</label>
                    <p>{!empty(this.state.selectedRelationshipEntity.updatedAt) ? moment(this.state.selectedRelationshipEntity.updatedAt).format("MMM D, Y") : ""}</p>
                  </div>
                </div>
              </div>

              <hr />


              <ul className="upcoming-tasks">
                {this.state.selectedRelationshipEntity.upcoming_tasks
                  ?
                  this.state.selectedRelationshipEntity.upcoming_tasks.map((task) => {
                    return (
                      <li>
                        <Checkbox
                          checked={task.status}
                        >
                          {task.text}
                        </Checkbox>
                      </li>
                    )
                  }) : (
                  <li>No Tasks</li>
                )}
              </ul>
            </Panel>
          </div>
        </div>

        <RelationshipTypeSelectModal show={this.state.isRelationshipSelectorModalOpen} />

      </MainLayout>
    );
  }
}

const mapStateToProps = state => {
  return {
    user: state.user,
    isSideMenuOpen: state.common.isSideMenuOpen
  };
}

export default connect(mapStateToProps, null)(RelationshipsPage);
