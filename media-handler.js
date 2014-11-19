var EventEmitter = require('eventemitter3');
var inherits = require('inherits');
var capture = require('rtc-capture');
var utils = require('./utils');
var taskqueue = require('rtc-taskqueue');

function MediaHandler(config, session, opts) {
  if (! (this instanceof MediaHandler)) {
    return new MediaHandler(config, session, opts);
  }

  EventEmitter.call(this);

  // save the config to pass onto capture, etc
  this.config = config;

  // create a peer connection
  this.pc = utils.createPeer(config, session, opts);
  this.queue = taskqueue(this.pc, config);
}

inherits(MediaHandler, EventEmitter);
module.exports = MediaHandler;

var prot = MediaHandler.prototype;

prot.close = function() {
  console.warn('TODO: close');
};

prot.getDescription = function(succeed, fail, hint) {
  var pc = this.pc;
  var q = this.queue;

  function connect(stream) {
    var methodName = pc.signalingState === 'have-remote-offer' ? 'createAnswer' : 'createOffer';

    q.once('sdp.local', succeed);

    pc.addStream(stream);
    q[methodName].call(q);
  }

  console.log('getDescription called: ', arguments);
  if (hint.stream) {
    return connect(hint.stream);
  }

  capture(hint.constraints, this.config, function(err, stream) {
    if (err) {
      return fail(err);
    }

    return connect(stream);
  });
};
