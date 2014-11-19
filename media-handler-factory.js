var attach = require('rtc-attach');
var MediaHandler = require('./media-handler');

module.exports = function(config) {
  return function(session, opts) {
    return new MediaHandler(config, session, opts);
  };
};
