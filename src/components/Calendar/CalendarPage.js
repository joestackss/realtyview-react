/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Terence Co <terence@realtyview.com>
 */

import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import { Panel, Container } from 'rsuite';
import classNames from 'classnames';
import TopNav from '../TopNav';
import RV_Sidebar from '../RV_Sidebar';
import CalendarEventPage from './CalendarEventPage';
import CalendarSchedulerPage from './CalendarSchedulerPage';
import '../../styles/Calendar/CalendarPage.scss';

class CalendarPage extends React.Component {
  render() {
    const { match } = this.props;
    return (
        <div className="calendar-page">
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

                <h2 className="page-context-title">
                  <Switch>
                    <Route exact path={`${match.url}/event`}>Create New Event</Route>
                    <Route path={`${match.url}/event/:eventId`}>Edit Event</Route>
                    <Route>Calendar</Route>
                  </Switch>
                </h2>

                <Panel shaded>
                  <Switch>
                    <Route exact path={`${match.url}/event`} component={CalendarEventPage} />
                    <Route path={`${match.url}/event/:eventId`} component={CalendarEventPage} />
                    <Route component={CalendarSchedulerPage} />
                  </Switch>
                </Panel>
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

export default connect(mapStateToProps, null)(CalendarPage);


