/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from "react";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
} from "react-router-dom";
import ReactNotification from "react-notifications-component";
import empty from "is-empty";
import axios from "axios";

import * as actionCreators from '../actions/actionCreators';
import ChatPage from './Chat/ChatPage';
import DashboardPage from './DashboardPage';
import SignInPage from './SignInPage';
import SignUpPage from './SignUpPage';
import SignUpConfirmationPage from './SignUpConfirmationPage';
import PropertyReportsPage from './PropertyReportsPage';
import PropertyDetailsReportPage from './PropertyDetailsReportPage';
import OfferManagementPage from './OfferManagementPage';
import OfferViewPage from './OfferViewPage';
import OfferCreatePage from './OfferCreatePage';
import OfferInboxPage from './OfferInbox/OfferInboxPage';
import RelationshipsPage from './RelationshipsPage';
import RelationshipCreatePage from './RelationshipCreatePage';
import RelationshipDetailsPage from './RelationshipDetailsPage';
import CalendarPage from './Calendar/CalendarPage';
import ProtectedRoute from './ProtectedRoute';
import Flash from './Flash';
import Bus from '../utils/Bus';
import PageNotFound from './PageNotFound';
import MortgageCalculatorPage from './MortgageCalculatorPage';
import TaskManagementPage from './TaskManagementPage';
import 'froala-editor/css/froala_style.min.css';
import 'froala-editor/css/froala_editor.pkgd.min.css';

// A global flash method that will receive a title and message
window.flash = (message, title = "success", type = "default") =>
  Bus.emit("flash", { message, title, type });

class App extends React.Component {
  constructor(props) {
    super(props);

    // Add a central 401 response interceptor for request to RealtyView endpoints
    axios.interceptors.response.use(
      function (response) {
        return response;
      },
      function (error) {
        if (401 === error.response.status) {
          if (
            error.response.config.url.indexOf(
              process.env.REACT_APP_REALTYVIEW_API_ENDPOINT
            ) !== -1
          ) {
            // Make sure the 401 request comes from a call to the
            // realtyview API before forcing a user system logout
            props
              .unsetUser()
              .then(() => {
                window.location.href = "/";
              })
              .catch((err) => {
                // TODO: create API endpoint for error logging
                console.log("Could not log out");
              });
          }
        } else {
          return Promise.reject(error);
        }
      }
    );
  }

  render() {
    return (
      <Router basename={process.env.PUBLIC_URL}>
        <Flash />
        <ReactNotification />

        <span>
          <Switch>
            <Route
              exact
              path="/"
              render={() =>
                !empty(this.props.user) ? (
                  <Redirect to="/dashboard" />
                ) : (
                  <Redirect to="/sign-in" />
                )
              }
            />

            <ProtectedRoute exact path="/dashboard" component={DashboardPage} />
            <Route
              exact
              path="/mortgage-calculator"
              component={MortgageCalculatorPage}
            />
            <Route
              exact
              path="/task-management"
              component={TaskManagementPage}
            />

            <Route path="/sign-in" component={SignInPage} />
            <Route exact path="/sign-up" component={SignUpPage} />
            <Route path="/sign-up/confirmation/email/:email/code/:code" component={SignUpConfirmationPage} />
            <ProtectedRoute path="/property-reports" component={PropertyReportsPage} />
            <ProtectedRoute path="/property-details/:id" component={PropertyDetailsReportPage} />
            <ProtectedRoute path="/offer-management" component={OfferManagementPage} />
            <ProtectedRoute path="/offer-view/:id" component={OfferViewPage} />
            <Route path="/offer-inbox" component={OfferInboxPage} />
            <ProtectedRoute path="/create-offer" component={OfferCreatePage} />
            <ProtectedRoute
              path="/relationships"
              component={RelationshipsPage}
            />
            <ProtectedRoute
              path="/relationship/create"
              component={RelationshipCreatePage}
            />
            <ProtectedRoute
              path="/relationship/:id"
              component={RelationshipDetailsPage}
            />
            <ProtectedRoute path="/calendar" component={CalendarPage} />
            <Route path="/chat" component={ChatPage} />
            <Route path="*" component={PageNotFound} />
          </Switch>
        </span>
      </Router>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    user: state.user,
  };
};

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(actionCreators, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
