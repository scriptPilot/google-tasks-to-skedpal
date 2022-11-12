function sendNewTasks() {
  // Log script start
  Logger.log('Script started')
  // Get sent task ids from user properties
  var sentTaskIds = getSentTaskIds()
  // Get Google Task lists
  var tasklists = getTasklists()
  // Loop task lists
  tasklists.forEach(tasklist => {
    // Get all tasks for this list
    var tasks = getTasks(tasklist.id)
    // Create counter for already sent tasks
    var alreadySent = 0
    // Log task list name and number of tasks
    Logger.log(tasklist.title + ' (' + tasks.length + ')')
    // Loop tasks
    tasks.forEach(task => {
      // No email sent before for this task id
      if (!sentTaskIds.includes(task.id)) {
        // Send email for this task
        var email = sendEmail(task, tasklist)
        // Add task id to sent task ids
        sentTaskIds.push(task.id)
        // Log email details
        Logger.log('- Email sent: ' + JSON.stringify(email))
      // Email sent before for this task id
      } else {
        // Increase sent task coount
        alreadySent++
      }
    })
    // Already sent task counter more than 0
    if (alreadySent > 0) {
      Logger.log('- ' + alreadySent + ' email' + (alreadySent !== 1 ? 's' : '') + ' sent before')
    }
  })
  // Save sent task ids to user properties
  setSentTaskIds(sentTaskIds)
}
