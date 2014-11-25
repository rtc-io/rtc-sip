var EventEmitter = require('eventemitter3');
var inherits = require('inherits');
var capture = require('rtc-capture');
var utils = require('./utils');
var taskqueue = require('rtc-taskqueue');
var ObservIce = require('observ-ice');
var SIP = require('sip.js');

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
  this.ice = ObservIce(this.pc);
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
  var ice = this.ice;

  // generate some default constraints if none supplied
  var constraints = (hint || {}).constraints || { audio: true, video: true };

  function connect(stream) {
    var methodName = utils.hasOffer(pc, 'remote') ? 'createAnswer' : 'createOffer';
    var stop;

    q.once('sdp.local', function(desc) {
      if (ice.gathered()) {
        return ready(pc.localDescription.sdp);
      }
      else {
        stop = ice.gathered(function(value) {
          if (value) {
            stop();
            ready(pc.localDescription.sdp);
          }
        });
      }
    });

    pc.addStream(stream);
    q[methodName].call(q);
  }

  function ready(sdp) {
//     sdp = SIP.Hacks.Chrome.needsExplicitlyInactiveSDP(sdp);
//     sdp = SIP.Hacks.AllBrowsers.unmaskDtls(sdp);

    succeed(sdp);
  }

  console.log('getDescription called: ', arguments);
  if (hint && hint.stream) {
    return connect(hint.stream);
  }

  capture(constraints, this.config, function(err, stream) {
    if (err) {
      return fail(err);
    }

    return connect(stream);
  });
};

prot.setDescription = function(sdp, pass, fail) {
  var raw = {
    type: utils.hasOffer(this.pc, 'local') ? 'answer' : 'offer',
    sdp: sdp
  };

  this.pc.setRemoteDescription(utils.createSessionDesc(this.config, raw), pass, fail);
};

// TODO: implement these additional functions
prot.isMuted = function() {
  return {
    audio: false,
    video: false
  };
};

prot.mute = function(opts) {};
prot.unmute = function(opts) {};

prot.hold = function() {};
prot.unhold = function() {};

prot.getLocalStreams = function() {
  return this.pc.getLocalStreams();
};

prot.getRemoteStreams = function() {
  return this.pc.getRemoteStreams();
};
