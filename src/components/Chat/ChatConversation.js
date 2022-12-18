import React from 'react';

import ChatContext from './ChatContext';
import ChatConversationProfile from './ChatConversationProfile';
import ChatConversationWindow from './ChatConversationWindow';
import ChatConversationInputBox from './ChatConversationInputBox';

import '../../styles/Chat/ChatConversation.scss';

class ChatConversation extends React.Component {
  static contextType = ChatContext;

  render() {
    const { conversation, messages } = this.props;
    return (
      <div className="chat-conversation">
        <ChatConversationProfile conversation={conversation} />
        <ChatConversationWindow messages={messages} />
        <ChatConversationInputBox />
      </div>
    );
  }
}

export default ChatConversation;
