var findPlugin = require('rtc-core/plugin');
var detect = require('rtc-core/detect');
var RTCPeerConnection = detect('RTCPeerConnection');

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
  var constraints = (opts || {}).RTCConstraints;
  var plugin = findPlugin((config || {}).plugins);
  var pcConfig = {
    iceServers: createIceServers(session, opts)
  };

  console.log(pcConfig);

  if (plugin && typeof plugin.createConnection == 'function') {
    return plugin.createConnection(pcConfig, constraints);
  }

  return new RTCPeerConnection(pcConfig, constraints);
};
