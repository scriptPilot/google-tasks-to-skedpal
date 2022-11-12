/* Send new Google Tasks to SkedPal by email */
/*

  Installation
  - Script anlegen
  - SkedPal Email einfügen
  - Trigger auf minütlich für sendNewTasks() stellen

  Proposed way of working
  - Add new tasks in SkedPal or Google Tasks
  - Manage and complete tasks in SkedPal
  - If there is a "Senty by Google Tasks" link in the SkedPal task, open it to complete the task in Google Tasks before

  In Scope
  - Create new tasks

  Out of Scope
  - Recurring Google Tasks (not propagated by Google)
  - Due time of Google Tasks (date works, but time not propagated by Google)
  - Any change to Google Tasks (completion, update, deletion)
  - Update from SkedPal to Google Tasks

  (Due to SkedPal API limitations)

*/

function getSentTaskIds() {
  var string = PropertiesService.getUserProperties().getProperty('sentTaskIds')
  if (string) return JSON.parse(string)
  return []
}

function getTasklists() {
  return Tasks.Tasklists.list().items
}

function getTasks(tasklistId) {
  return Tasks.Tasks.list(tasklistId).items
}

function sendEmail(task, tasklist) {
  var to = skedPalEmail
  var subject = task.title
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
  var email = { to, subject, htmlBody }
  MailApp.sendEmail(email)
  return email
}

function setSentTaskIds(sentTaskIds) {
  return PropertiesService.getUserProperties().setProperty('sentTaskIds', JSON.stringify(sentTaskIds))
}

function sendNewTasks() {
  Logger.log('Script started')
  var sentTaskIds = getSentTaskIds()
  var tasklists = getTasklists()
  tasklists.forEach(tasklist => {
    var tasks = getTasks(tasklist.id)
    var ignoredTasks = 0
    Logger.log(tasklist.title + ' (' + tasks.length + ')')
    tasks.forEach(task => {
      if (!sentTaskIds.includes(task.id)) {
        var email = sendEmail(task, tasklist)
        sentTaskIds.push(task.id)
        Logger.log('- Email sent: ' + JSON.stringify(email))
      } else {
        ignoredTasks++
      }
    })
    if (ignoredTasks > 0) {
      Logger.log('- ' + ignoredTasks + ' email' + (ignoredTasks !== 1 ? 's' : '') + ' sent before')
    }
  })
  setSentTaskIds(sentTaskIds)
}
