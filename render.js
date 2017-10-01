var chalk = require('chalk')
var human = require('human-time')

module.exports = function (msg) {

  if (msg.value.content.root) {
    msgRoot = 're: ' + msg.value.content.root
  } else { msgRoot = ''}


  if (msg.value.content.type === 'post') {
    console.log(
      chalk.cyan('@' + msg.avatar.name) +
      ' ' + msgRoot + ' ' + 
      msg.value.content.text +
      ' ' +
      chalk.dim(human(new Date(msg.value.timestamp)))
    )
  } else if (msg.value.content.type === 'vote') {
    console.log(
      chalk.cyan('@' + msg.avatar.name) +
      ' dug ' +
      msg.value.content.vote.link +
      ' ' +
      chalk.dim(human(new Date(msg.value.timestamp)))
    )
  }
}

module.exports.shorter = function (msg) {

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

