var pull = require('pull-stream')
var paramap = require('pull-paramap')
var ssbClient = require('ssb-client')
var chalk = require('chalk')
var human = require('human-time')
var avatar = require('ssb-avatar')

function render (msg) {

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
  } else if (msg.value.content.type === 'vote') { 
    if (msg.value.content.vote.link) {
      console.log(
        chalk.dim(msg.key) + ' | ' + 
        chalk.cyan('@' + msg.avatar.name) +
        ' dug ' +
        msg.value.content.vote.link +
        ' ' +
        chalk.dim(human(new Date(msg.value.timestamp)))
      )
    } 
  } else if (msg.value.content.type === 'contact') {
    if (msg.value.content.following = 'true') { exp = ' follows ' } else { exp = ' unfollows '}
    console.log(
     chalk.dim(msg.key) + ' | ' +
     chalk.cyan('@' + msg.avatar.name) + exp + msg.value.content.contact
    )
  }
  else {
    if (msg.value.content.type) {
      console.log(
        chalk.dim(msg.key) + ' | ' +
        chalk.cyan('@' + msg.avatar.name) + ' ' +
        msg.value.content.type
      )
    } else {
      console.log(
        chalk.dim(msg.key) + ' | ' +
        chalk.cyan('@' + msg.avatar.name) + ' ' +
        'sent a private message'
      )
    }
  }
}

var listMessages = function () {
  var number = process.argv[2]
  var type = process.argv[3]

  ssbClient(function (err, sbot) {
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
           render(msg)
           sbot.close()
        })
      )
    })
  })
}

listMessages()
