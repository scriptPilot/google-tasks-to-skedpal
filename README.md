# Google Tasks to SkedPal

## Purpose

Create new [Google Tasks](https://tasks.google.com/embed/?origin=https://mail.google.com) in [SkedPal](https://skedpal.com/) automatically.

## Scope

In Scope:

- [x] Multiple lists in Google Tasks
- [x] Due dates in Google Tasks

Out of Scope:

- [ ] Recurring Google Tasks (Google API limitations)
- [ ] Due dates with time (Google API limitations)
- [ ] Updates from Google Tasks to SkedPal (SkedPal API limitations)
- [ ] Updates from SkedPal to Google Tasks  (SkedPal API limitations)

## End Users

### Installation

1. Open [Google Apps Script](https://script.google.com/) and create a new project
2. Replace **Code.gs** file content with [this code](Code.gs)
3. Replace `xxx` with your SkedPal Mailbox (Settings > Account)
4. Click on the + next to **Services**, add `Tasks API`
5. Save the project, select **sendNewTasks** function at the top
6. Run the function and grant permissions (send emails, read tasks)
7. Create a trigger: **sendNewTasks** function, run every minute

### Usage

* Add new tasks in Google Tasks
* Manage and complete tasks in SkedPal
* If there is a `Sent by Google Tasks` link in the SkedPal task,
  open it to complete the task in Google Tasks
  before completing it in SkedPal

## Developers

### Requirements

* [Node.js](https://nodejs.org/) and NPM installed
* [Command Line Apps Script Projects](https://github.com/google/clasp) installed globally

### Installation

1. Clone this repository
2. Replace `xxx` with your SkedPal Mailbox in **credentials.template.js** and save as **credentials.js**
3. Run `clasp login` to login to Google if not done before
4. Run `clasp create --type standalone --rootDir . --title "Google Tasks to SkedPal"` to create a new Apps Script Project

### Development

* Run `clasp open` to open the project in the [Cloud IDE](https://script.google.com/)
* Run `clasp push` to replace the remote files with the local ones
* Run `clasp pull` to replace the local files with the remote ones

### Build

* Run `node buildscript.js` to build the `Code.gs` file
