function getSentTaskIds() {
  // Get task ids as string from user properties
  var string = PropertiesService.getUserProperties().getProperty('sentTaskIds')
  // Return JSON object (array in this case) from string
  if (string) return JSON.parse(string)
  // Return empty array by default
  return []
}
