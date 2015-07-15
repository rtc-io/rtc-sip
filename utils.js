var findPlugin = require('rtc-core/plugin');
var detect = require('rtc-core/detect');
var RTCPeerConnection = detect('RTCPeerConnection');
var RTCSessionDescription = detect('RTCSessionDescription');
var defaults = require('cog/defaults');
var pluck = require('whisk/pluck');

var createIceServers = exports.createIceServers = function(session, opts) {
  var config = session.ua.configuration || {};
  var stun = (opts || {}).stunServers || config.stunServers || [];
  var turn = (opts || {}).turnServers || config.turnServers || [];

  return [{'url': stun }].concat(turn.map(function(server) {
    return {
      url: server.urls,
      username: server.username,
      credential: server.password
    }
  }));
};

var createPeer = exports.createPeer = function(config, session, opts) {
  var pluckConstraints = pluck('mandatory', 'optional');
  var constraints = defaults(pluckConstraints((opts || {}).RTCConstraints), {
    mandatory: {},
    optional: []
  });
  var plugin = findPlugin((config || {}).plugins);
  var pcConfig = {
    iceServers: createIceServers(session, opts)
  };

  if (plugin && typeof plugin.createConnection == 'function') {
    return plugin.createConnection(pcConfig, constraints);
  }

  return new RTCPeerConnection(pcConfig, constraints);
};

var createSessionDesc = exports.createSessionDesc = function(config, raw) {
  var plugin = findPlugin((config || {}).plugins);

  if (plugin && typeof plugin.createSessionDescription == 'function') {
    return plugin.createSessionDescription(raw);
  }

  return new RTCSessionDescription(raw);
};

exports.hasOffer = function(pc, type) {
  return pc.signalingState === 'have-' + (type || 'local') + '-offer';
};
