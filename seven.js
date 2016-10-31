var pull = require('pull-stream');
var paramap = require('pull-paramap');
var ssbClient = require('ssb-client');
var chalk = require('chalk');
var moment = require('moment');
var avatar = require('ssb-avatar');

var listMessages = function () {
  ssbClient(function (err, sbot) {
    if (err) throw err
    sbot.whoami(function getId(err, me) {
      if (err) throw err
      pull(sbot.messagesByType({
        type: 'post',
    	limit: 7,
        reverse: true
      }),
      paramap(function getAvatar(msg, cb) {
    	avatar(sbot, me.id, msg.value.author, function (err, avatar) {
	  if (err) throw err
    	    msg.avatar = avatar;
    	    cb(null, msg);
    	  })
      }),
      pull.drain(function printMessage(msg) {
        console.log(chalk.cyan('@' + msg.avatar.name) +
    	' ' +
    	msg.value.content.text +
    	' ' +
    	chalk.dim(moment(msg.value.timestamp).fromNow())
    	)
        sbot.close();
      })
      )
    })
  })
}

listMessages();
