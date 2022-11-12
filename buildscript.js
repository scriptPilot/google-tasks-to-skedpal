const fs = require('fs')

fs.readdir('lib', (err, files) => {

  if (err) {
    console.error('Failed to loop the library folder.', err)
    process.exit(1)
  }

  files = ['../credentials.template.js', ...files.filter(file => /\.js/.test(file))]

  const codeBlocks = []

  files.forEach(file => {

    const fileContent = fs.readFileSync('lib/' + file, { encoding: 'utf8' })
    codeBlocks.push(fileContent)

  })

  fs.writeFileSync('Code.gs', codeBlocks.join('\n'))

  console.log('Code.gs file updated.')

})
