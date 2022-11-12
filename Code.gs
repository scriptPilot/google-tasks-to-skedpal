// Replace xxx with your SkedPal Mailbox (Settings > Account)
var skedPalMailbox = 'xxx'

function getSentTaskIds() {
  // Get task ids as string from user properties
  var string = PropertiesService.getUserProperties().getProperty('sentTaskIds')
  // Return JSON object (array in this case) from string
  if (string) return JSON.parse(string)
  // Return empty array by default
  return []
}

function getSkedPalMailbox() {
  // Return SkedPal Mailbox (configured in credentials.js file)
  return skedPalMailbox
}

function getTasklists() {
  // Get all Google Task tasklists
  return Tasks.Tasklists.list().items
}

function getTasks(tasklistId) {
  // Get all Google tasks for a given tasklist id
  return Tasks.Tasks.list(tasklistId).items
}

function sendEmail(task, tasklist) {
  // Set SkedPal mailbox as recipient
  var to = getSkedPalMailbox()
  // Set task title as subject
  var subject = task.title
  // Create HTML body
  var bodyParts = []
  if (task.due) {
    var dueStr = 'Due by ' + task.due.substr(0, 10)
    if (task.due.substr(11, 5) !== '00:00') {
      dueStr += ' ' + task.due.substr(11, 5)
    }
    bodyParts.push(dueStr)
  }
  if (task.notes) bodyParts.push(task.notes)
  task.links.forEach(link => {
    bodyParts.push('<a href="' + link.link + '">' + link.description + '</a>')
  })
  bodyParts.push('Sent by <a href="https://tasks.google.com/embed/?origin=https://mail.google.com">Google Tasks</a>')
  bodyParts.push('List: ' + tasklist.title)
  var htmlBody = bodyParts.join('<br />')
  // Define email object
  var email = { to, subject, htmlBody }
  // Send email
  MailApp.sendEmail(email)
  // Return email object
  return email
}

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

function setSentTaskIds(sentTaskIds) {
  // Save sent task ids array as string to user properties
  return PropertiesService.getUserProperties().setProperty('sentTaskIds', JSON.stringify(sentTaskIds))
}
