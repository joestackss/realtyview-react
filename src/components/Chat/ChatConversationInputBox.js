import React from 'react';
import classNames from 'classnames';
import { Input, ButtonToolbar } from 'rsuite';

import { ReactComponent as AttachIcon } from '../../images/icons/attach-icon.svg';
import { ReactComponent as SendIcon } from '../../images/icons/send-icon.svg';
import '../../styles/Chat/ChatConversationInputBox.scss';
import RVButton from '../shared/RVButton';

import ChatContext from './ChatContext';

class ChatConversationInputBox extends React.Component {
  static contextType = ChatContext;

  render() {
    const { isMobile } = this.context;

    return (
      <div className={classNames(
        'chat-conversation-input-box',
        isMobile ? 'chat-conversation-input-box-condensed' : 'chat-conversation-input-box-full'
      )}>
        <Input className="chat-conversation-input-field" componentClass="textarea" rows={3}/>
        <ButtonToolbar className="chat-conversation-input-box-controls">
          <RVButton className="chat-conversation-input-box-control-btn" palette="light">
            <AttachIcon width="12" height="12"/>
          </RVButton>
          <RVButton className="chat-conversation-input-box-control-btn" palette="success">
            <SendIcon width="12" height="12"/>
          </RVButton>
        </ButtonToolbar>
      </div>
    );
  }
}

export default ChatConversationInputBox;