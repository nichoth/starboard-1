var pull = require('pull-stream')
var paramap = require('pull-paramap')
var ssbClient = require('ssb-client')
var chalk = require('chalk')
var human = require('human-time')
var avatar = require('ssb-avatar')

var listMessages = function () {
  var number = process.argv[2]
  var type = process.argv[3]

  ssbClient(function (err, sbot) {
    if (err) throw err
    sbot.whoami(function getId(err, me) {
      if (err) throw err
      pull(
        sbot.messagesByType({
          type: type || 'post',
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
          if (msg.value.content.type === 'post') {
            message = msg.value.content.text
            console.log(
              chalk.dim(msg.key) + ' | ' +
              chalk.cyan('@' + msg.avatar.name.substring(0, 15)) +
              ' ' +
              message.replace(/[\n\r]+/g, '').substring(0, 80)  +'...' +
              ' ' +
              chalk.dim(human(new Date(msg.value.timestamp)))  
            ) 
          } else if (type === 'vote') {
            if (msg.value.content.vote.link) {
              console.log(
                chalk.cyan('@' + msg.avatar.name) +
                ' dug ' +
                msg.value.content.vote.link +
                ' ' +
                chalk.dim(human(new Date(msg.value.timestamp)))
              )
            }
          } else {
            console.log(msg.value.content)
          }
          sbot.close()
        })
      )
    })
  })
}

listMessages()
