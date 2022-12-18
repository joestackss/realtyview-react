/* Copyright (C) RealtyView, Inc. - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Joshua Santiago <jsantiago@realtyview.com>
 */

import React from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';
import {
  Container,
  Panel,
  Placeholder,
  Button,
  Icon,
  DatePicker,
  CheckPicker,
  Checkbox,
  Tag,
  Avatar,
  Calendar
} from 'rsuite';

import MainLayout from './layouts/main';
import MessageIcon from '../images/icons/message.svg';
import TeamIcon from '../images/icons/team.svg';
import UserIcon from '../images/icons/user.svg';
import RealtyviewIcon from '../images/icon.png';
import '../styles/DashboardPage.scss';


class DashboardPage extends React.Component {
  render() {
    const { Paragraph } = Placeholder;

    return (
      <MainLayout
        layoutClassName="dashboard-page"
      >
        <h2 className="page-context-title">Dashboard</h2>

        <Panel className="getting-started" bordered>
          <div className="inline-group">
            <h3 className="getting-started__welcome">Welcome to RealtyView, {this.props.user.first_name}</h3>
            <a href = "#" className="getting-started__widget-hide">Don't show me this welcome widget anymore</a>
          </div>

          <p className="mt-md">It’s a first step towards making your property management much easier. Here is everything you need to get <br /> started with RealtyView.</p>

          <div className="row mt-lg">
            <div className="col-md-8">
              <Panel className="step" bordered>
                <div className="step__email-img">
                  <img src={MessageIcon} />
                </div>

                <div className="step__details">
                  <label>Connect your email account</label>
                  <p>Send emails directly out of RealtyView, automatically log incoming emails, know who is engaging with your emails, and much more.</p>
                </div>

                <Icon icon="angle-right" />
              </Panel>

              <Panel className="step" bordered>
                <div className="step__add-contacts-img">
                  <img src={UserIcon} />
                </div>

                <div className="step__details">
                  <label>Add your contacts</label>
                  <p>Start tracking your contacts and interactions. You can import contacts from CSV, Excel or Google Contacts.</p>
                </div>

                <Icon icon="angle-right" />
              </Panel>

              <Panel className="step" bordered>
                <div className="step__invite-team-img">
                  <img src={TeamIcon} />
                </div>

                <div className="step__details">
                  <label>Invite your teammates</label>
                  <p>Start selling together as a team. Invite a couple of teammates to try RealtyView’s collaborating features.</p>
                </div>

                <Icon icon="angle-right" />
              </Panel>
            </div>
            <div className="col-md-4 getting-started__questions">
              <h4>Have Questions?</h4>
              <p>You can visit our support portal to learn more about RealtyView and answer any questions you may have.</p>
              <ul className="question-list">
                <li><a href="#">How do I add activities to my calendar?</a></li>
                <li><a href="#">How can I send bulk emails?</a></li>
                <li><a href="#">How do I add tasks and assign them?</a></li>
                <li><a href="#">How can I make a new offer?</a></li>
              </ul>
              <Button color="green" block>Go to Support Portal</Button>
            </div>
          </div>
        </Panel>

        <Panel className="deals-pipeline" bordered>
          <h3 className="section-title">DEALS PIPELINE</h3>
          <div className="deals-pipeline__filters">
            <DatePicker />
            <CheckPicker />
          </div>

          <div className="deals-pipeline__bar">
            <div className="stage">
              <p className="name">New (Untouched)</p>
              <p className="amount">$0.00</p>
              <p className="total-deals">0 Deals</p>
            </div>
            <div className="stage">
              <p className="name">Contacted</p>
              <p className="amount">$0.00</p>
              <p className="total-deals">0 Deals</p>
            </div>
            <div className="stage">
              <p className="name">Qualified</p>
              <p className="amount">$0.00</p>
              <p className="total-deals">0 Deals</p>
            </div>
            <div className="stage">
              <p className="name">Proposal Presented</p>
              <p className="amount">$0.00</p>
              <p className="total-deals">0 Deals</p>
            </div>
            <div className="stage">
              <p className="name">In Negotiation</p>
              <p className="amount">$0.00</p>
              <p className="total-deals">0 Deals</p>
            </div>
          </div>

          <div className="deals-pipeline__more-numbers">
            <div className="number-group">
              <p className="name">All Deals</p>
              <p className="amount">$0.00</p>
              <p className="total-deals">0 Deals</p>
            </div>
            <div className="number-group">
              <p className="name">Won Deals</p>
              <p className="amount">$0.00</p>
              <p className="total-deals">0 Deals</p>
            </div>
            <div className="number-group">
              <p className="name">Lost Deals</p>
              <p className="amount">$0.00</p>
              <p className="total-deals">0 Deals</p>
            </div>
            <div className="number-group">
              <p className="name">Win Ratio</p>
              <p className="amount">$0.00</p>
              <p className="total-deals">0 Deals</p>
            </div>
            <div className="number-group">
              <p className="name">Avg. Cycle Time</p>
              <p className="amount">0 day</p>
            </div>
            <div className="number-group">
              <p className="name">Average Deal Size</p>
              <p className="amount">$0.00</p>
            </div>
          </div>
        </Panel>

        <div className="row mt-lg">
          <div className="col-md-6">
            <Panel className="tasks" bordered>
              <div className="inline-group">
                <span className="inline">
                  <h3 className="section-title">TASKS</h3>
                  <a href="#">View All</a>
                </span>
                <Button className="add-task-btn" color="green" size="xs">+ Add task</Button>
              </div>

              <ul className="tasks__preview-list">
                <li>
                  <div className="left">
                    <Checkbox></Checkbox>
                    <div>
                      <p className="task"><strong>Call client Bob Smith</strong></p>
                      <p className="task-time">Due Today 11:00 AM</p>
                    </div>
                  </div>

                  <div>
                    <Tag color="red">High</Tag>
                  </div>
                </li>
                <li>
                  <div className="left">
                    <Checkbox></Checkbox>
                    <div>
                      <p className="task"><strong>Call client Bob Smith</strong></p>
                      <p className="task-time">Due Today 11:00 AM</p>
                    </div>
                  </div>

                  <div>
                    <Tag color="yellow">Medium</Tag>
                  </div>
                </li>
                <li>
                  <div className="left">
                    <Checkbox></Checkbox>
                    <div>
                      <p className="task"><strong>Call client Bob Smith</strong></p>
                      <p className="task-time">Due Today 11:00 AM</p>
                    </div>
                  </div>

                  <div>
                    <Tag color="blue">Low</Tag>
                  </div>
                </li>
                <li>
                  <div className="left">
                    <Checkbox></Checkbox>
                    <div>
                      <p className="task"><strong>Call client Bob Smith</strong></p>
                      <p className="task-time">Due Today 11:00 AM</p>
                    </div>
                  </div>

                  <div>
                    <Tag color="red">High</Tag>
                  </div>
                </li>
                <li>
                  <div className="left">
                    <Checkbox></Checkbox>
                    <div>
                      <p className="task"><strong>Call client Bob Smith</strong></p>
                      <p className="task-time">Due Today 11:00 AM</p>
                    </div>
                  </div>
                </li>
                <li>
                  <div className="left">
                    <Checkbox></Checkbox>
                    <div>
                      <p className="task"><strong>Call client Bob Smith</strong></p>
                      <p className="task-time">Due Today 11:00 AM</p>
                    </div>
                  </div>
                </li>
              </ul>
            </Panel>
          </div>
          <div className="col-md-6">
            <Panel className="calendar" bordered>
              <div className="inline-group">
                <div className="inline">
                  <h3 className="section-title">CALENDAR</h3>
                  <a href="#">View All</a>
                </div>
                <Button className="new-event-btn" color="green" size="xs">+ Add Event</Button>
              </div>

              <Calendar />
            </Panel>
          </div>
        </div>

        <div className="row mt-lg">
          <div className="col-md-6">
            <Panel className="messages" bordered>
              <div className="inline-group">
                <div className="inline">
                  <h3 className="section-title">MESSAGES</h3>
                  <a href="#">View All</a>
                </div>

                <Button className="new-msg-btn" color="green" size="xs">+ New Message</Button>
              </div>

              <ul className="messages-list">
                <li>
                  <Avatar circle>RS</Avatar>
                  <div className="msg-group">
                    <p className="name"><strong>Margaret D. Evans</strong></p>
                    <p className="msg">Viverra tincidunt gravida mattis sit tempus mauris.</p>
                  </div>

                  <p className="msg-sent-time">1h ago</p>
                </li>
                <li>
                  <Avatar circle>RS</Avatar>
                  <div className="msg-group">
                    <p className="name"><strong>Margaret D. Evans</strong></p>
                    <p className="msg">Viverra tincidunt gravida mattis sit tempus mauris.</p>
                  </div>

                  <p className="msg-sent-time">1h ago</p>
                </li>
                <li>
                  <Avatar circle>RS</Avatar>
                  <div className="msg-group">
                    <p className="name"><strong>Margaret D. Evans</strong></p>
                    <p className="msg">Viverra tincidunt gravida mattis sit tempus mauris.</p>
                  </div>

                  <p className="msg-sent-time">1h ago</p>
                </li>
                <li>
                  <Avatar circle>RS</Avatar>
                  <div className="msg-group">
                    <p className="name"><strong>Margaret D. Evans</strong></p>
                    <p className="msg">Viverra tincidunt gravida mattis sit tempus mauris.</p>
                  </div>

                  <p className="msg-sent-time">1h ago</p>
                </li>
                <li>
                  <Avatar circle>RS</Avatar>
                  <div className="msg-group">
                    <p className="name"><strong>Margaret D. Evans</strong></p>
                    <p className="msg">Viverra tincidunt gravida mattis sit tempus mauris.</p>
                  </div>

                  <p className="msg-sent-time">1h ago</p>
                </li>
              </ul>
            </Panel>
          </div>
          <div className="col-md-6">
            <Panel className="announcements" bordered>
              <div className="inline">
                <h3 className="section-title">ANNOUNCEMENTS</h3>
                <a href="#">View All</a>
              </div>

              <ul className="announcements-list">
                <li>
                  <img src={RealtyviewIcon} />
                  <div className="main-details">
                    <p className="title"><strong>New plugins added</strong></p>
                    <p className="body">You suggest, we listen. We have recently added more plugins to make everyone's life much easier. <a href="#">Read more</a></p>
                  </div>

                  <p className="date">Aug 10, 2020</p>
                </li>
                <li>
                  <img src={RealtyviewIcon} />
                  <div className="main-details">
                    <p className="title"><strong>New plugins added</strong></p>
                    <p className="body">You suggest, we listen. We have recently added more plugins to make everyone's life much easier. <a href="#">Read more</a></p>
                  </div>

                  <p className="date">Aug 10, 2020</p>
                </li>
                <li>
                  <img src={RealtyviewIcon} />
                  <div className="main-details">
                    <p className="title"><strong>New plugins added</strong></p>
                    <p className="body">You suggest, we listen. We have recently added more plugins to make everyone's life much easier. <a href="#">Read more</a></p>
                  </div>

                  <p className="date">Aug 10, 2020</p>
                </li>
                <li>
                  <img src={RealtyviewIcon} />
                  <div className="main-details">
                    <p className="title"><strong>New plugins added</strong></p>
                    <p className="body">You suggest, we listen. We have recently added more plugins to make everyone's life much easier. <a href="#">Read more</a></p>
                  </div>

                  <p className="date">Aug 10, 2020</p>
                </li>
              </ul>
            </Panel>
          </div>
        </div>
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

export default connect(mapStateToProps, null)(DashboardPage);
