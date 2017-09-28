var client = require('ssb-client')
var avatar = require('ssb-avatar')
var chalk = require('chalk')

client(function (err, sbot) {
    sbot.whoami(function (err, me) {
      avatar(sbot, me.id, me.id, function (err, avatar) {
        console.log(chalk.cyan('@' + avatar.name), chalk.dim(me.id))
        sbot.close()
      })
    })
})

