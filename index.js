/**
  # rtc-sip

  This is an experiment at providing an integration between the rtc.io modules
  and the [SIP.js](https://github.com/onsip/SIP.js) library.  This is done by
  providing a custom SIP.js `mediaHandlerFactory` that can be used to override
  the default WebRTC behaviour of SIP.js

  ## NOTE: Incomplete

  This package has been implemented to the point that it is usable for the
  following purpose:

  - Using a SIP endpoint to attach to a WebRTC call for the purposes of
    recording audio.

  While other features will be implemented over time, these are not as high
  a priority as other implementation tasks within the rtc.io suite.

  ## Example Usage

  Displayed below is an example of how you can use the `rtc-sip/media-handler-factor`
  to integrate with some of the `rtc.io` packages:

  <<< examples/getonsip.js

  To get this example running, you will need to signup for a free
  [getonsip](https://www.getonsip.com/) account and provide configuration
  information in an `examples/config.json` file (something like what is shown
  below):

  ```json
  {
    "user": "username",
    "password": "sippassword-check-your-profile"
  }
  ```
**/
