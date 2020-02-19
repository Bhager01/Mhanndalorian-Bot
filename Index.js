const Discord = require('discord.js');
const { prefix, token } = require('./config.json');
const client = new Discord.Client();

const fs = require('fs');
const readline = require('readline');
const {google} = require('googleapis');

// If modifying these scopes, delete token.json.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets.readonly'];
// The file token.json stores the user's access and refresh tokens, and is
// created automatically when the authorization flow completes for the first
// time.
const TOKEN_PATH = 'token.json';
// Load client secrets from a local file.

client.once('ready', () => {
    console.log('Ready')
}) 

function FlairUpdate(){
    const guild = client.guilds.get("505515654833504266");

    fs.readFile('credentials.json', (err, content) => {
        if (err) return console.log('Error loading client secret file:', err);
        // Authorize a client with credentials, then call the Google Sheets API.
        authorize(JSON.parse(content), listMajors);
      });
      
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
        fs.readFile(TOKEN_PATH, (err, token) => {
          if (err) return getNewToken(oAuth2Client, callback);
          oAuth2Client.setCredentials(JSON.parse(token));
          callback(oAuth2Client);
        });
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
            if (err) return console.error('Error while trying to retrieve access token', err);
            oAuth2Client.setCredentials(token);
            // Store the token to disk for later program executions
            fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
              if (err) return console.error(err);
              console.log('Token stored to', TOKEN_PATH);
            });
            callback(oAuth2Client);
          });
        });
      }

    function listMajors(auth) {
        const sheets = google.sheets({version: 'v4', auth});
        sheets.spreadsheets.values.get({
          spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
          range: 'Guild Members & Data!E119:F',
        }, (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          const rows = res.data.values;
          if (rows.length) {

          var GuildMember;
          var User;
          var discordID;
          var count = 0;

            rows.map((row) => {
                (async () => {
                      discordID = row[1].replace("<","").replace(">","").replace("@","");
                      if(discordID != 378053516067078149){
                        User = await client.fetchUser(discordID)
                        GuildMember = await guild.fetchMember(User);
                        AddFlair(GuildMember,row[0]);
                        count = count + 1
                        console.log(count)
                      }
                })()
            });
          } else {
            console.log('No data found.');
          }
        });
    }
}

var CronJob = require('cron').CronJob;
var job = new CronJob('30/60 19-21 * * *', function() {
    FlairUpdate()
    
}, null, true, 'America/New_York');
job.start();

function AddFlair(passedMember, row){
    if(row <= 13){
        passedMember.setNickname((passedMember.displayName).replace('🥉','').replace('🥈','').replace('🥇','').replace('💎',''))
        console.log(passedMember.displayName)
    }

    if(row >= 14 && row <= 29){
        passedMember.setNickname((passedMember.displayName).replace('🥉','').replace('🥈','').replace('🥇','').replace('💎','') + '🥉')
        console.log(passedMember.displayName)
     }
    if(row >= 30 && row <= 59){
        passedMember.setNickname((passedMember.displayName).replace('🥉','').replace('🥈','').replace('🥇','').replace('💎','') + '🥈')
        console.log(passedMember.displayName)
     }
    if(row >= 60 && row <= 99){
        passedMember.setNickname((passedMember.displayName).replace('🥉','').replace('🥈','').replace('🥇','').replace('💎','') + '🥇')
        console.log(passedMember.displayName)
     }
    if(row >= 100){
        passedMember.setNickname((passedMember.displayName).replace('🥉','').replace('🥈','').replace('🥇','').replace('💎','') + '💎')
        console.log(passedMember.displayName)
     }

}

client.on('presenceUpdate', async (oldMember, newMember) => {
fs.readFile('credentials.json', (err, content) => {
  if (err) return console.log('Error loading client secret file:', err);
  // Authorize a client with credentials, then call the Google Sheets API.
  authorize(JSON.parse(content), listMajors);
});

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
  fs.readFile(TOKEN_PATH, (err, token) => {
    if (err) return getNewToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
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
      if (err) return console.error('Error while trying to retrieve access token', err);
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
        if (err) return console.error(err);
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
    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
    range: 'Guild Members & Data!E119:F',
  }, (err, res) => {
    if (err) return console.log('The API returned an error: ' + err);
    const rows = res.data.values;
    if (rows.length) {
      rows.map((row) => {
       if(String(row[1]).match(/\d+/) == newMember.user.id && String(row[1]).match(/\d+/) != "378053516067078149"){
           AddFlair(newMember, row[0]);        
        }
      });
    } else {
      console.log('No data found.');
    }
  });
}

})


client.on('message', message => {
   // if(message.content.startsWith(`${prefix}flair`)){
      if(message.content == `${prefix}flair` || message.content == `${prefix}Flair`){
        fs.readFile('credentials.json', (err, content) => {
            if (err) return console.log('Error loading client secret file:', err);
            // Authorize a client with credentials, then call the Google Sheets API.
            authorize(JSON.parse(content), listMajors);
          });
          
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
            fs.readFile(TOKEN_PATH, (err, token) => {
              if (err) return getNewToken(oAuth2Client, callback);
              oAuth2Client.setCredentials(JSON.parse(token));
              callback(oAuth2Client);
            });
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
                if (err) return console.error('Error while trying to retrieve access token', err);
                oAuth2Client.setCredentials(token);
                // Store the token to disk for later program executions
                fs.writeFile(TOKEN_PATH, JSON.stringify(token), (err) => {
                  if (err) return console.error(err);
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
              spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
              range: 'Guild Members & Data!E119:F',
            }, (err, res) => {
              if (err) return console.log('The API returned an error: ' + err);
              const rows = res.data.values;
              if (rows.length) {
                rows.map((row) => {
                 if(String(row[1]).match(/\d+/) == message.member.id){
                    if(row[0] == 0){
                        message.channel.send("You have had " + row[0] + " days without missing raids.  Bronze level status is at 14 days.");
                    }
                    if(row[0] >= 1 && row[0] <= 13){
                        message.channel.send("Congratulations!! You have had " + row[0] + " days without missing raids.  Bronze level status is at 14 days.");
                    }
                    if(row[0] >= 14 && row[0] <= 29){
                        message.channel.send("You are at bronze level!! You have had " + row[0] + " days without missing raids.  Silver level status is at 30 days.");
                    }
                    if(row[0] >= 30 && row[0] <= 59){
                        message.channel.send("You are at silver level!! You have had " + row[0] + " days without missing raids.  Gold level status is at 60 days.");
                    }
                    if(row[0] >= 60 && row[0] <= 99){
                        message.channel.send("You are at gold level!! You have had " + row[0] + " days without missing raids.  Platnium level status is at 100 days.");
                    }
                    if(row[0] >= 100){
                        message.channel.send("Congratulations!! You have had " + row[0] + " days without missing raids.  You are platnium status!!!!!");
                    }
                  }
                });
              } else {
                console.log('No data found.');
              }
            });
          }       
    }
    if(message.content == `${prefix}flairupdate` || message.content == `${prefix}Flairupdate`){
        if(message.member.id == "406945430967156766"){
            message.channel.send("Flair is being updated for all guild members")
            FlairUpdate()
        } else{
            message.channel.send(message.member.displayName + ", what do you think you are doing.  Turn back.  I have spoken.")
        }
    }
})
client.login(process.env.BOT_TOKEN);
