var config = require('./config.json');
var SIP = require('sip.js');
var ua = new SIP.UA({
  // initialise with the custom rtc.io media handler factory
  // specify any rtc.io plugins that you wish to use with in the plugins option
  mediaHandlerFactory: require('../media-handler-factory')({ plugins: [] }),

  // initialise the uri, authorizationUser and password
  uri: config.user + '@getonsip.com',
  displayName: 'rtc-sip demo user',

  authorizationUser: 'getonsip_' + config.user,
  password: config.password
});

// invite someone :)
ua.invite('damonoehlman@getonsip.com', {
  media: {
    constraints: {
      audio: true,
      video: true
    }
  },

  RTCConstraints: {
    optional: [
      { googIPv6: false }
    ]
  }
});
