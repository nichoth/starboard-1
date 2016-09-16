var p = require('promptly');
var chalk = require('chalk');
var ssbClient = require('ssb-client');

var validator = function (value) {
  if (value.length < 3) {
    throw new Error('Your message is too short, type again.');
  }
  return value;
};

var publishMessage = function () {
  ssbClient(function (err, sbot) {
    if (err) {
      throw err;
    }
    p.prompt(chalk.cyan('Type a message in markdown and press [Enter] to publish:'), {validator: validator}, function (err, value) {
      if (err) {
        throw err;
      }
      sbot.publish({
        type: 'post',
        text: value
      }, function (err, msg) {
        if (err) {
          throw err;
        }
        console.log('You published: ' + msg.value.content.text + ' to Scuttlebot');
        process.exit(1);
      });
    });
  });
};

publishMessage();
