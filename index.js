'use strict';

var express = require('express');
var kraken = require('kraken-js');
var cors = require('cors');
var api = require('instagram-node').instagram();
/*
{"access_token":"35404723.9048c51.73aa99388c8647c49a10df4cb4c85814",
"user":{"username":"godsownhalo","bio":"","website":"","profile_picture":"https://igcdn-photos-h-a.akamaihd.net/hphotos-ak-xaf1/t51.2885-19/s150x150/12717145_1726007090967999_1902143056_a.jpg","full_name":"Indraprabha","id":"35404723"}}
*/
var options, app;

/*
 * Create and configure application. Also exports application instance for use by tests.
 * See https://github.com/krakenjs/kraken-js#options for additional configuration options.
 */
options = {
    onconfig: function (config, next) {
        /*
         * Add any additional config setup or overrides here. `config` is an initialized
         * `confit` (https://github.com/krakenjs/confit/) configuration object.
         */
        next(null, config);
    }
};

app = module.exports = express();
api.use({
  client_id: 'cc57d9baa93a4628bb689a0d6d7d4058',
  client_secret: 'be6a2eaef0a94da48f31e393e23baf5f'
});

app.use(kraken(options));
app.use(cors());
app.on('start', function () {
    console.log('Application ready to serve requests.');
    console.log('Environment: %s', app.kraken.get('env:env'));
});

var redirect_uri = 'http://localhost:8000/handleauth';
 
exports.authorize_user = function(req, res) {
  res.redirect(api.get_authorization_url(redirect_uri, { scope: ['likes'], state: 'a state' }));
};
 
exports.handleauth = function(req, res) {
  api.authorize_user(req.query.code, redirect_uri, function(err, result) {
    if (err) {
      console.log("Inst Auth Failed: "+err.body);
      res.send("Didn't work");
    } else {
      console.log('Yay! Access token is ' + result.access_token);
      res.send(result);
    }
  });
};

// This is where you would initially send users to authorize 
app.get('/authorize_user', exports.authorize_user);
// This is your redirect URI 
app.get('/handleauth', exports.handleauth);
