import React from 'react';
import { InputGroup } from 'rsuite';

import ChatContext from './ChatContext';
import ChatConversationInputBox from './ChatConversationInputBox';

import RVPicker from '../shared/RVPicker';
import '../../styles/Chat/ChatNewConversation.scss';

class ChatNewConversation extends React.Component {
  static contextType = ChatContext;

  render() {
    const { relationships } = this.context; 
    return (
      <div className="chat-new-conversation">
        <InputGroup className="chat-new-conversation-user-select">
          <InputGroup.Addon>To: </InputGroup.Addon>
          <RVPicker
            block
            cleanable={false}
            multi 
            placeholder="Type the name of the person or group"
            data={relationships}
            valueKey="id"
            labelKey="email"
            renderMenuItem={(label, item) => (
              item.name ? 
              <span>{`${item.name} (${item.email})`}</span> :
              <span>{item.email}</span>
            )}
            renderValue={(value, item) => item.name || item.email}
          />
        </InputGroup>
        <div className="chat-new-conversation-window"></div>
        <ChatConversationInputBox />
      </div>
    );
  }
}

export default ChatNewConversation;
