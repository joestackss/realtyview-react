import React from 'react';
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
import '../styles/RelationshipCard.scss';

class RelationshipCard extends React.Component {
  render() {
    return (
      <Panel className="relationship-card" bordered>
        <div className="inline">
          <div className="avatar"></div>
          <div>
            <p className="name">
              Bob Barker
            </p>
            <p className="type">
              Seller, Buyer
            </p>
          </div>
        </div>

        <div className="action-buttons">
          <Button size="xs" appearance="default">Send Email</Button>
          <Button size="xs" appearance="default">Edit</Button>
        </div>

        <div className="notes mt-lg">
          <label>Notes:</label>
          <p>Mauris, id amet, ut vitae nam. Porta lectus fames lorem lorem dolor justo. A sagittis ut vestibulum libero, imperdiet.</p>
        </div>

        <div className="row mt-lg">
          <div className="col-md-6">
            <div className="date-created">
              <label>Added:</label>
              <p>04-22-2016</p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="date-modified">
              <label>Last Updated:</label>
              <p>12-13-2017</p>
            </div>
          </div>
        </div>

        <hr />

        <ul className="upcoming-tasks">
          <li>
            <Checkbox>Draft the new contract</Checkbox>
            <Checkbox>Call Jade about the meeting</Checkbox>
            <Checkbox>Offer demo</Checkbox>
          </li>
        </ul>
      </Panel>
    )
  }
}

export default RelationshipCard;
