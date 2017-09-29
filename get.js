var client = require('ssb-client')
var pull = require('pull-stream')
var chalk = require('chalk')
var avatar = require('ssb-avatar')
var paramap = require('pull-paramap')

client(function (err, sbot) {
  getmessage = process.argv[2]

  sbot.whoami(function (err, me) {
    pull(
      sbot.get(getmessage, function (err, msg) {
        console.log(msg)
        avatar(sbot, me.id, msg.author, function (err, avatar) {
          msg.avatar = avatar;
          msgRoot = ''
          if (msg.content.root) {
            msgRoot = 're: ' + msg.content.root
          }
          console.log(
      chalk.dim(getmessage) + '\n' +
      chalk.cyan(msg.avatar.name) + ' ' + chalk.yellow(msgRoot) + ' ' +
            msg.content.text
    )
          sbot.close()
        })
      })
    ) 
  })
})
