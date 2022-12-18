import React from 'react';
import classNames from 'classnames';
import { ButtonToolbar, Form, Input, Radio, RadioGroup, Modal } from 'rsuite';

import RVButton from '../../components/shared/RVButton';

import CalendarSchedulerContext from './CalendarSchedulerContext';

import '../../styles/Calendar/CalendarAddCategoryModal.scss';

const CATEGORY_COLORS = [
  'red-1', 'red-2', 'red-3', 'orange-1', 'orange-2', 'yellow-1', 'green-1', 'green-2',
  'green-3', 'blue-1', 'blue-2', 'blue-3', 'purple-1', 'purple-2', 'brown-1', 'gray-1',
];

class CalendarAddCategoryModal extends React.Component {  
  static contextType = CalendarSchedulerContext;
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      color: CATEGORY_COLORS[0],
      errors: {},
    };
  }

  handleNameChange = (name) => {
    this.setState({ name });
  }

  handleColorSelect = (color) => {
    this.setState({ color });
  }

  handleClose = () => {
    const { setAddCategoryModalVisibility } = this.context;
    setAddCategoryModalVisibility(false);
    // Reset fields
    this.setState({ name: '', color: CATEGORY_COLORS[0], errors: {} });
  }

  handleSubmit = () => {
    const { upsertCategory } = this.context;
    const { name, color } = this.state;
    if (this.validate()) {
      upsertCategory({ name, color }, { 
        success: () => {
          this.handleClose();
        },
      });
    }
  }

  validate() {
    const errors = {};
    const { name, color } = this.state;

    if (name == null || !name.trim()) {
      errors.nameRequired = true;
    }
    if (color == null) {
      errors.colorRequired = true;
    }

    this.setState({ errors });
    return Object.entries(errors).length === 0;
  }
  
  render() {
    const { showAddCategoryModal } = this.context;
    const { name, color, errors } = this.state;
    return (
      <Modal className="calendar-add-category-modal" show={showAddCategoryModal} onHide={this.handleClose} enforceFocus full>
        <Form className="calendar-add-category-form" onSubmit={this.handleSubmit}>
          <Modal.Header>
            <h5 className="calendar-modal-header">Add Category</h5>
          </Modal.Header>
          <Modal.Body style={{ overflow: 'normal' }}>
            <div className="calendar-add-category-field">
              <div className="calendar-add-category-label">Category name</div>
              <Input 
                className="calendar-add-category-name-input"
                size="lg"
                value={name}
                onChange={this.handleNameChange}
              />
              {errors.nameRequired && <div className="error-chip">This field is required.</div>}
            </div>
            <div className="calendar-add-category-field">
              <div className="calendar-add-category-label">Category color</div>
              <RadioGroup className="calendar-add-category-color-select" inline value={color} onChange={this.handleColorSelect}>
                {CATEGORY_COLORS.map(val => (
                    <Radio key={`calendar-add-category-color-option-${val}`} className={classNames('calendar-add-category-color-option', `calendar-add-category-color-option-${val}`)} value={val} />
                ))}
              </RadioGroup>
              {errors.colorRequired && <div className="error-chip">This field is required.</div>}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <ButtonToolbar style={{ float: 'right' }}>
              <RVButton palette="link-light" size="lg" onClick={this.handleClose}>Cancel</RVButton>
              <RVButton type="submit" palette="success" size="lg">Save</RVButton>
            </ButtonToolbar>
          </Modal.Footer>
        </Form>
      </Modal>
    );
  }
}

export default CalendarAddCategoryModal;