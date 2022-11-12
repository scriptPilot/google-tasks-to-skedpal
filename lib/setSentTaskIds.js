function setSentTaskIds(sentTaskIds) {
  // Save sent task ids array as string to user properties
  return PropertiesService.getUserProperties().setProperty('sentTaskIds', JSON.stringify(sentTaskIds))
}
