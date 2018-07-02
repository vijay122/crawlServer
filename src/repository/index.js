/**
 * @license
 * Copyright Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// [START sheets_quickstart]
const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

const {CrawlContentsApi} = require("../crawlEngine/crawlService");

// If modifying these scopes, delete credentials.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
const TOKEN_PATH = 'credentials.json';
const ClientSecret_PATH = './1.json';

// Load client secrets from a local file.

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);

    // Check if we have previously stored a token.
   // fs.readFile(TOKEN_PATH, (err, token) => {
    let token = {"access_token":"ya29.GlvsBTLfIGmOIHn8WsL0TAfQpUOYpPIGJj-QhVFrssfvQIi-69_MyMCFKeIU00pLU6lZvKlJngP6PgDyezycF091RZRTTSMs-KfXUoiyAiN6IM3SLhE99Jk-Fafz","token_type":"Bearer","refresh_token":"1/U8EwLTfT0YqrTillASgpcBilJiNRF0b9nlqAyJHhFj4","expiry_date":1530544088039};
        if (0) return getNewToken(oAuth2Client, callback);
        oAuth2Client.setCredentials((token));
        callback(oAuth2Client);
  //  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 * @param {google.auth.OAuth2} oAuth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback for the authorized client.
 */
function getNewToken(oAuth2Client, callback) {
    const authUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: SCOPES,
    });
    console.log('Authorize this app by visiting this url:', authUrl);
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });
    rl.question('Enter the code from that page here: ', (code) => {
        rl.close();
        oAuth2Client.getToken(code, (err, token) => {
            if (err) return callback(err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                if (err) console.error(err);
                console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
        });
    });
}

/**
 * Prints the names and majors of students in a sample spreadsheet:
 * @see https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit
 * @param {google.auth.OAuth2} auth The authenticated Google OAuth client.
 */
function listMajors(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
        spreadsheetId: '1pf0C3ru20gc3mapwkc-fZafvExYkXWD0M7I9DTYBOZQ',
        range: 'CrawlSheet!A:C',
    }, (err, {data}) => {
        if (err) return console.log('The API returned an error: ' + err);
        const rows = data.values;
        if (rows.length) {
            console.log('Name, District, Shown:');
            // Print columns A and E, which correspond to indices 0 and 4.
            rows.map((row) => {
                if(row[2]=="FALSE")
                {
                    CrawlContentsApi(row[0],row[1]).then(result=>{
                        var st = "sdf";
                    })
                }
                console.log(`${row[0]}, ${row[1]},${row[2]}`);
            });
        } else {
            console.log('No data found.');
        }
    });
}
exports.CrawlContentsFromSheets = function()
{
    let content = {"installed":{"client_id":"522963624301-1vkqmgm1m6ag24l356fjb92uiraka36u.apps.googleusercontent.com","project_id":"active-landing-209013","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"wjyJcNHed1F3HcEOZrOL3QJa","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
   // fs.readFile('./1.json', (err, content) => {
   //     if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(content, listMajors);
   // });
   /* fs.readFile(ClientSecret_PATH, (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), listMajors);
    });
    */
}
// [END sheets_quickstart]