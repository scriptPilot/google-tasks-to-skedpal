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
