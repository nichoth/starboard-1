var pull = require('pull-stream')
var paramap = require('pull-paramap')
var client = require('ssb-client')
var avatar = require('ssb-avatar')
var render = require('./render.js')

var listMessages = function () {
  var number = process.argv[2]
  var type = process.argv[3]

  client(function (err, sbot) {
    if (err) throw err
    sbot.whoami(function getId(err, me) {
      if (err) throw err
      pull(
        sbot.createLogStream({
    	  limit: Number(number) || 44,
          reverse: true
        }),
        paramap(function getAvatar(msg, cb) {
          avatar(sbot, me.id, msg.value.author, function (err, avatar) {
            if (err) throw err
            msg.avatar = avatar
            cb(null, msg)
          })
        }),
        pull.drain(function (msg) {
           render.shorter(msg)
           sbot.close()
        })
      )
    })
  })
}

listMessages()
