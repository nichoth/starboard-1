var client = require('ssb-client')
var pull = require('pull-stream')
var avatar = require('ssb-avatar')
var paramap = require('pull-paramap')
var render = require('./render')

client(function (err, sbot) {
  getmessage = process.argv[2]

  sbot.whoami(function (err, me) {
    pull(
      sbot.get(getmessage, function (err, msg) {
        avatar(sbot, me.id, msg.author, function (err, avatar) {
          msg.avatar = avatar
          msg.value = msg
          render(msg)
          sbot.close()
        })
      })
    ) 
  })
})
