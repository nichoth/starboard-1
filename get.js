var client = require('ssb-client')
var pull = require('pull-stream')
var avatar = require('ssb-avatar')
var paramap = require('pull-paramap')
var render = require('./render')
var me = require('ssb-keys').id

client(function (err, sbot) {
  getmessage = process.argv[2]

  sbot.whoami(function (err, me) {
    pull(
      sbot.get(getmessage, function (err, msg) {
        avatar(sbot, me.id, msg.author, function (err, avatar) {
          msg.avatar = avatar
          msg.value = msg
          render(msg)
        })
      }) 
    ) 
  })
  pull(
    sbot.query.read({query: [{$filter: { value: { content: {root: getmessage}}}}]}),
    paramap(function getAvatar(msg, cb) {
      avatar(sbot, me, msg.value.author, function (err, avatar) {
        if (err) throw err
          msg.avatar = avatar;
          cb(null, msg)
        })
    }),
    pull.drain(function (data) {
      render(data)
    })
  )
})
