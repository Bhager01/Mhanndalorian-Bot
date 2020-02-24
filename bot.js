const Discord = require('discord.js');
const {google} = require('googleapis');
const client = new Discord.Client();
const prefix = "!"

var newBronze = "";
var newSilver = "";
var newGold = "";
var newDiamond = "";
var NewNoStatus = [];

client.once('ready', () => {
    console.log('Ready')
})
function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
  
      token = {"access_token":"ya29.Il-9BygCO5hRduHR-tUsBx32geTiZxDF4QUjh17uDovL_OQYrsW-q53oknT-PYfQbG6qMAvDeV4myI3_uKIYIQLMsFPIuRV0UTR4g31GFJpdOuv-uQwqm1I-g4ttX0CgDg","refresh_token":"1//0dhkLg8Xv7BDXCgYIARAAGA0SNwF-L9IrG-vrIlgGQGioOCDU2gilJp7ZHgDWgiiugPjQWGw091GlSXJx4fTJJ5-6XIZYu5p_7Ds","scope":"https://www.googleapis.com/auth/spreadsheets.readonly","token_type":"Bearer","expiry_date":1581974001623}
      oAuth2Client.setCredentials(token);
      callback(oAuth2Client);
}

async function newFlairAnncouncment(){

    if (Array.isArray(NewNoStatus) && NewNoStatus.length){
        var x;
        var GuildMember;
        var User;
        var discordID;
        const guild = client.guilds.get("505515654833504266");

        for (x in NewNoStatus){
            client.users.get(NewNoStatus[x]).send("You have missed a raid and lost your flair.  Get back in there!")

            discordID = NewNoStatus[x];
            User =  await client.fetchUser(discordID)
            GuildMember =  await guild.fetchMember(User);
            console.log(GuildMember.displayName + " has lost raid flair  QZ")
        }
    }

    if (newBronze != "")
        client.channels.get("505515654837698563").send("Nice job! Let's congratulate the following members on just earning bronze raid status. " + newBronze)

    if (newSilver != "")
        client.channels.get("505515654837698563").send("Sweet!! Congratulate the following members on just earning silver raid status. " + newSilver)

    if (newGold != "")
        client.channels.get("505515654837698563").send("Excellent!!! Let's congratulate the following members on just earning gold raid status. " + newGold)
    
    if (newDiamond != "")
        client.channels.get("505515654837698563").send("Amazing! 100 days with no raid missed!! Let's congratulate the following members on just earning diamond raid status. " + newDiamond)
}

function FlairUpdate(Type, callback){
    const guild = client.guilds.get("505515654833504266");
    newBronze = "";
    newSilver = "";
    newGold = "";
    newDiamond = "";
    NewNoStatus = [];

    content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
    authorize(content, listMajors);
      
    function listMajors(auth) {
        const sheets = google.sheets({version: 'v4', auth});
        sheets.spreadsheets.values.get({
          spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
          range: 'Guild Members & Data!E119:F',
        }, async (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          const rows = res.data.values;
          if (rows.length) {

          var GuildMember;
          var User;
          var discordID;

            for (const element of rows){
                discordID = element[1].replace("<","").replace(">","").replace("@","");
                if(discordID != 378053516067078149){
                    User =  await client.fetchUser(discordID)
                    GuildMember =  await guild.fetchMember(User);
                    AddFlair(GuildMember,element[0],Type);
                }
            }
            callback();

          } else {
            console.log('No data found.');
          }
        });
    }
}

var CronJob = require('cron').CronJob;
var job = new CronJob('0 9,21 * * *', function() {
    console.log("Cron job executed QZ")
    FlairUpdate("Cron", newFlairAnncouncment)
}, null, true, 'America/New_York');
job.start();

async function AddFlair(passedMember, row, Type){
    var OldNickname = passedMember.displayName

    var newNickname;
    newNickname = passedMember.displayName.replace(/🥉/g,'').replace(/🥈/g,'').replace(/🥇/g,'').replace(/💎/g,'')

    if(row <= 13 && OldNickname != newNickname){
        await passedMember.setNickname(newNickname)
        console.log(Type + " - " + passedMember.displayName + " None QZ")
        if(Type == "Manual" || Type == "Cron")
         NewNoStatus.push(passedMember.id)
    }
    else if(row >= 14 && row <= 29 && OldNickname != newNickname + '🥉'){
        await passedMember.setNickname(newNickname + '🥉')
        console.log(Type + " - " + passedMember.displayName + " Bronze QZ")
        if(Type == "Manual" || Type == "Cron")
            newBronze = newBronze + "<@" + passedMember.id + "> "
    }
    else if(row >= 30 && row <= 59 && OldNickname != newNickname + '🥈'){
        await passedMember.setNickname(newNickname + '🥈')
        console.log(Type + " - " + passedMember.displayName + " Silver QZ")
        if(Type == "Manual" || Type == "Cron")
            newSilver = newSilver + "<@" + passedMember.id + "> "
    }
    else if(row >= 60 && row <= 99 && OldNickname != newNickname + '🥇'){
        await passedMember.setNickname(newNickname + '🥇')
        console.log(Type + " - " + passedMember.displayName + " Gold QZ")
        if(Type == "Manual" || Type == "Cron")
            newGold = newGold + "<@" + passedMember.id + "> "
    }
    else if(row >= 100 && OldNickname != newNickname + '💎'){
        await passedMember.setNickname(newNickname + '💎')
        console.log(Type + " - " + passedMember.displayName + " Diamond QZ")
        if(Type == "Manual" || Type == "Cron")
            newDiamond = newDiamond + "<@" + passedMember.id + "> "
    }
    else{
        console.log(Type + " - " + passedMember.displayName + " No update needed")
    }
}

client.on('guildMemberUpdate', async (oldMember, newMember) => {
  var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
  authorize(content, listMajors);

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
                        AddFlair(newMember, row[0], "User Name Change");
                    }
                });
            }else {
                console.log('No data found.');
            }
        });
    }
})

client.on('message', message => {
      if(message.content == `${prefix}flair` || message.content == `${prefix}Flair`){
        var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
        authorize(content, listMajors);
          
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
                        console.log(message.member.displayName + " requested flair level QZ")
                        if(row[0] == 0){
                            message.channel.send("You have had 0 days without missing raids.  Bronze level status is at 14 days.");
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
            }else {
                console.log('No data found.');
            }
            });
        }       
    }
    if(message.content == `${prefix}flairupdate` || message.content == `${prefix}Flairupdate`){
        if(message.member.id == "406945430967156766"){
            message.channel.send("Flair is being updated for all guild members")
            FlairUpdate("Manual", newFlairAnncouncment)
        } else{
            message.channel.send(message.member.displayName + ", what do you think you are doing.  Turn back.  I have spoken.");
            console.log(message.member.displayName + " tried to execute flairupdate QZ");
        }
    }
})
//LEAVE THIS WAY
client.login(process.env.BOT_TOKEN);
