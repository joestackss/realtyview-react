import React from 'react';
import classNames from 'classnames';
import { ButtonToolbar, Modal } from 'rsuite';

import RVButton from '../../components/shared/RVButton';

import '../../styles/shared/RVPrompt.scss';

class RVPrompt extends React.Component {
  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
  }

  handleAccept = () => {
    const { onAccept } = this.props;
    onAccept();
  }
  
  render() {
    const { className, children, acceptBtnTitle, acceptBtnPalette, cancelBtnTitle, cancelBtnPalette, show } = this.props;
    return (
      <Modal className={classNames(className, 'rv-prompt')} show={show} enforceFocus full>
        <Modal.Body>{children}</Modal.Body>
        <Modal.Footer>
          <ButtonToolbar style={{ float: 'right' }}>
            <RVButton palette={cancelBtnPalette || 'link-light'} size="lg" onClick={this.handleCancel}>{cancelBtnTitle || 'Cancel'}</RVButton>
            <RVButton palette={acceptBtnPalette || 'success'} size="lg" onClick={this.handleAccept}>{acceptBtnTitle || 'OK'}</RVButton>
          </ButtonToolbar>
        </Modal.Footer>
      </Modal>
    );
  }
}

export default RVPrompt;