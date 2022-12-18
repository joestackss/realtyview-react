import React from 'react';
import { connect } from 'react-redux';
import { withRouter, Redirect, Route, Switch, matchPath } from 'react-router-dom';
import { Panel, Icon, IconButton } from 'rsuite';

import ChatConversationData from '../../data/chat/conversations.json';
import ChatMessageData from '../../data/chat/messages.json';
import RelationshipData from '../../data/relationships.json';
import UserData from '../../data/user.json';
import { getMessagesFromData, getConversationsFromData, getSortedConversationsWithRecentMessage } from '../../services/chat';

import MainLayout from '../layouts/main'; 

import ChatContext from './ChatContext';
import ChatConversation from './ChatConversation';
import ChatNewConversation from './ChatNewConversation';
import ChatOverview from './ChatOverview';

import '../../styles/Chat/ChatPage.scss';

class ChatPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: UserData.user,
      favoriteConversations: [],
      conversations: [],
      isFetching: true,
    }
  }

  componentDidMount() {
    this.fetchConversations();
    this.setState({ isFetching: false });
  }

  fetchConversations(query='') {
    const { user } = this.state;
    const allMessages = getMessagesFromData(ChatMessageData.messages, user, RelationshipData.relationships);
    const allConversations = getConversationsFromData(ChatConversationData.conversations, user, RelationshipData.relationships);

    let favoriteConversations = [];
    let conversations = []
    if (!query || !query.trim()) {
      favoriteConversations = getSortedConversationsWithRecentMessage(allMessages, allConversations, user.id, true);
      conversations = getSortedConversationsWithRecentMessage(allMessages, allConversations, user.id, false);
      this.setState({ favoriteConversations, conversations });
    } else {
      conversations = getSortedConversationsWithRecentMessage(allMessages, allConversations, user.id, null, query);
      this.setState({ favoriteConversations: [], conversations });
    }
  }

  getConversationById(conversationId) {
    const { user } = this.state;
    const allConversations = getConversationsFromData(ChatConversationData.conversations, user, RelationshipData.relationships);
    return allConversations.find(c => c.id === conversationId);
  }

  getMessagesByConversationId(conversationId) {
    const { user } = this.state;
    const allMessages = getMessagesFromData(ChatMessageData.messages, user, RelationshipData.relationships);
    return (
      allMessages
      .filter(m => m.conversation_id === conversationId)
      .sort((a, b) => a.created - b.created)
    );
  }

  getDefaultConversation() {
    const { favoriteConversations, conversations } = this.state;
    if (favoriteConversations.length > 0) {
      return favoriteConversations[0];
    }
    if (conversations.length > 0) {
      return conversations[0];
    }
    return null; 
  }

  handleConversationSelect = (conversationId) => {
    const { match, history } = this.props;
    if (conversationId == null) {
      history.push(`${match.path}/new`);
    } else {
      history.push(`${match.path}/${conversationId}`);
    }
  }

  handleGoBack = () => {
    const { match, history } = this.props;
    history.push(match.path);
  }

  render() {
    if (this.state.isFetching) return null;

    const { match, location, isDesktop } = this.props;
    const { user, favoriteConversations, conversations } = this.state;
    const isMobile = !isDesktop;
    const isOverviewShown = matchPath(location.pathname, { path: `${match.path}`, exact: true, strict: false }) != null;
    const isNewConversation = matchPath(location.pathname, { path: `${match.path}/new`, exact: true, strict: false }) != null;
    const defaultConversation =  this.getDefaultConversation();
    return (
      <ChatContext.Provider value={{
        user,
        relationships: RelationshipData.relationships,
        favoriteConversations,
        conversations,
        onConversationSelect: this.handleConversationSelect,
        isMobile,
      }}>
        <MainLayout layoutClassName="chat-page">
          <h2 className="page-context-title">
            {(isDesktop || isOverviewShown) ? 'Chat' : (
              <React.Fragment>
                <IconButton 
                  className="chat-page-back-btn" 
                  appearance="subtle" 
                  circle 
                  icon={<Icon icon="chevron-left" />} 
                  onClick={this.handleGoBack}
                />
                &nbsp;{isNewConversation ? 'New Message' : 'Chat'}
              </React.Fragment>
            )}
          </h2>
          {isMobile ? (
            <div className="chat-wrapper chat-wrapper-condensed">
              <Switch>
                <Route exact path={match.path}>
                  <Panel className="chat-overview-panel" shaded>
                    <ChatOverview />
                  </Panel>
                </Route>
                <Route exact path={`${match.path}/new`}>
                  <Panel className="chat-conversation-panel" shaded>
                    <ChatNewConversation />
                  </Panel>
                </Route>
                <Route 
                  exact
                  path={`${match.path}/:conversationId`}
                  children={({ match: nestedMatch }) => {
                    const conversation = this.getConversationById(nestedMatch.params.conversationId);
                    if (conversation == null) {
                      return (
                        <Panel className="chat-conversation-panel" shaded>
                          <Redirect to={match.path} />
                        </Panel>
                      );
                    }
                    const messages = this.getMessagesByConversationId(nestedMatch.params.conversationId);
                    return (
                      <Panel className="chat-conversation-panel" shaded>
                        <ChatConversation conversation={conversation} messages={messages} />
                      </Panel>
                    );
                  }}
                />
                <Redirect to={match.path} />
              </Switch>
            </div>
          ) : (
            <div className="chat-wrapper chat-wrapper-full">
              <Panel className="chat-overview-panel" shaded>
                <ChatOverview />
              </Panel>
              <Switch>
                <Route exact path={`${match.path}/new`}>
                  <Panel className="chat-conversation-panel" shaded>
                    <ChatNewConversation />
                  </Panel>
                </Route>
                <Route 
                  exact
                  path={`${match.path}/:conversationId`}
                  children={({ match: nestedMatch }) => {
                    const conversation = this.getConversationById(nestedMatch.params.conversationId);
                    if (conversation == null) {
                      return (
                        <Panel className="chat-conversation-panel" shaded>
                          <Redirect to={match.path} />
                        </Panel>
                      );
                    }
                    const messages = this.getMessagesByConversationId(nestedMatch.params.conversationId);
                    return (
                      <Panel className="chat-conversation-panel" shaded>
                        <ChatConversation conversation={conversation} messages={messages} />
                      </Panel>
                    );                    
                  }}
                />
                {defaultConversation == null ? (
                  <Redirect to={`${match.path}/new`} />
                ) : (
                  <Redirect to={`${match.path}/${defaultConversation.id}`} />
                )}
              </Switch>
            </div>
          )}
        </MainLayout>
      </ChatContext.Provider>
    );
  }
}

const mapStateToProps = state => ({
  isDesktop: state.common.isDesktop
});

export default connect(mapStateToProps, null)(withRouter(ChatPage)); 
