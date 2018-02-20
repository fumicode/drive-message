const this_auth = module.exports = {};

var fs = require('fs');
var readline = require('readline');
var google = require('googleapis');
var googleAuth = require('google-auth-library');

var SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
this_auth.SCOPES = SCOPES;

var TOKEN_DIR = (process.env.HOME || process.env.HOMEPATH ||
    process.env.USERPROFILE) + '/.credentials/';

var TOKEN_PATH = TOKEN_DIR + 'script-nodejs-quickstart.json';
this_auth.TOKEN_PATH = TOKEN_PATH;

var clientSecret;
var clientId;
var redirectUrl;
var auth;
var oauth2Client;
var ss_id;





// Load client secrets from a local file.
this_auth.loadSecret = function(){
  return new Promise(function(resolve, reject){
    fs.readFile('client_secret.json', function processClientSecrets(err, content) {
      if (err) {
        reject (err) // 'Error loading client secret file: '
        return;
      }

      resolve(JSON.parse(content));
    });
  });
}

this_auth.receiveToken = function(code) { //return oauth2Client
  return new Promise(function(resolve, reject){

    oauth2Client.getToken(code, function(err, token) {
        if (err) {
          reject(err); //'Error while trying to retrieve access token',
          return;
        }

        oauth2Client.credentials = token;
        storeToken(token);

        resolve(oauth2Client);
    });
  });
}

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */

this_auth.createAuthClient = function (credentials) {
  return new Promise(function(resolve, reject){

    clientSecret = credentials.web.client_secret;
    clientId = credentials.web.client_id;
    redirectUrl =  credentials.web.redirect_uris[0];
    auth = new googleAuth();
    //client obj を生成
    oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

    resolve(oauth2Client )
  });
}


/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  try {
    fs.mkdirSync(TOKEN_DIR);
  } catch (err) {
    if (err.code != 'EEXIST') {
      throw err;
    }
  }
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

/**
 * Call an Apps Script function to list the folders in the user's root
 * Drive folder.
 *
 * @param {google.auth.OAuth2} auth An authorized OAuth2 client.
 */

this_auth.callAppsScript = function(oauth2Client, ss_id) {
  return new Promise(function(resolve, reject){
    var scriptId = 'M2XslXm7OQRTbnXTjMghlQHGLRyC2UqH6';
    var script = google.script('v1');

    // Make the API request. The request object is included here as 'resource'.
    script.scripts.run({
      auth: oauth2Client,
      resource: {
        function: 'getUserDataWithId',
        parameters: [ss_id],
        devMode: true
      },
      scriptId: scriptId
    }, function(err, resp) {
      if (err) {
        console.log("API 側のエラー");
        return reject(err) // 'The API returned an error: '
      }

      if (resp.error) {
        console.log("gas 側のエラー");

        console.log( resp.error);

        return reject(resp.error) ; //GAS側のエラー

      } 

      // The structure of the result will depend upon what the Apps Script
      // function returns. Here, the function returns an Apps Script Object
      // with String keys and values, and so the result is treated as a
      // Node.js object (folderSet).
      var folderSet = resp.response.result;
      console.log("Success!!");
      console.log(resp.response.result);

      resolve(resp.response.result);
    });
  });
}
