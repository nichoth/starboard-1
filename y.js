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
          type: type,
    	  limit: Number(number),
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
          if (type === 'post') {
            if (msg.value.content.root) {
              msgRoot = msg.value.content.root
            } else { msgRoot = ''}
            console.log( 
              chalk.cyan('@' + msg.avatar.name) +
              ' ' +
              're: ' + msgRoot
              + 
              msg.value.content.text +
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
        })
      )
    })
  })
}

listMessages()
