export function getMessagesFromData(messageData, user, relationshipData) {
  const userMap = mapObjectListByKey(relationshipData.concat(user));
  return messageData.map(v => {
    const created = new Date(v.created);
    const sender = userMap[v.sender_id] || { id: v.sender_id };
    return { ...v, created, sender };
  });
}

export function getConversationsFromData(conversationData, user, relationshipData) {
  const userMap = mapObjectListByKey(relationshipData.concat(user));
  return conversationData.map(v => {
    const members = v.member_ids.map(id => userMap[id] || { id });
    return { ...v, members };
  });
}

export function getSortedConversationsWithRecentMessage(
  messages, conversations, userId, isFavorite=null, query=''
) {
  /*
  Service to retrieve the latest message per conversation.
  This is a temporary service that should ideally be replaced by an API call. 

  Arguments
  messages: list of all messages
  query: String to filter conversations by user name
  isFavorite: filter by favorite conversations
  */
  const filteredConversations = conversations
    .filter(c => {
      if (c.member_ids.indexOf(userId) === -1) return false; 
      if (isFavorite != null && isFavorite !== c.is_favorite) return false;
      const trimmedQuery = query ? query.trim() : '';
      if (!trimmedQuery) return true;
      for (const member of c.members) {
        if (member.id !== userId && member.name) {
          if (member.name.indexOf(trimmedQuery) !== -1) return true;
        }
      }
      return false;
    });
  const sortedMessages = messages.sort((a, b) => b.created - a.created)
  const sortedConversations = [];
  for (const m of sortedMessages) {
    if (filteredConversations.length === 0) break;
    const index = filteredConversations.findIndex(c => c.id === m.conversation_id);
    if (index === -1) continue;
    sortedConversations.push({ ...filteredConversations[index], recentMessage: m });
    filteredConversations.splice(index, 1);
  }
  return sortedConversations;
}

function mapObjectListByKey(list, key='id') {
  /*
  Returns a mapping of objects to a key
  */
  const objectMap = {};
  list.forEach(obj => objectMap[obj[key]] = obj);
  return objectMap;
}