const Discord = require('discord.js');
const {google} = require('googleapis');
const fetch = require('node-fetch');
const giffyToken = "s5PcPTErWAqH6dU57Bfk1WXF5n6F4DTY";
const client = new Discord.Client();
const prefix = "!"

var newBronze = "";
var newSilver = "";
var newGold = "";
var newDiamond = "";
var NewNoStatus = [];

var GphApiClient = require('giphy-js-sdk-core');
giphy = GphApiClient(giffyToken)

client.once('ready', () => {
    console.log('Ready')
})

function specificGIF(searchString){
    URLS = new Array();
    var randomNumber;

    if(searchString == "succubus"){
        URLS.push("https://i.postimg.cc/fWdcDZbj/Succubus8.gif")
        URLS.push("https://i.postimg.cc/3NZH6zcZ/Succubus1.gif")
        URLS.push("https://i.postimg.cc/59516F2F/Succubus2.gif")
        URLS.push("https://i.postimg.cc/NMmt8K8S/Succubus3.gif")
        URLS.push("https://i.postimg.cc/Hnmg6TBx/Succubus4.gif")
        URLS.push("https://i.postimg.cc/Xq1yj2th/Succubus5.gif")
        URLS.push("https://i.postimg.cc/BQcnB7hG/Succubus6.gif")
        URLS.push("https://i.postimg.cc/y8G4mFzH/Succubus7.gif")
    }

    else if(searchString == "molly"){
        URLS.push("https://i.postimg.cc/65SYzzTY/Big-Boss-Man-2.gif")
        URLS.push("https://i.postimg.cc/NjHbnTHY/Big-Boss-Man-3.gif")
        URLS.push("https://i.postimg.cc/wBYFYvXN/Big-Boss-Man-4.gif")
        URLS.push("https://i.postimg.cc/Sx332kWQ/Big-Boss-Man-1.gif")
    }

    else if(searchString == "mhann"){
        URLS.push("https://i.postimg.cc/pVjKjp1j/Me-on-Mustafar.gif")
    }

    else if(searchString == "greg"){
        URLS.push("https://media.giphy.com/media/aNTmc4keX4Fva/giphy.gif")
        URLS.push("https://media.giphy.com/media/uPeblKaa25xy8/giphy.gif")
        URLS.push("https://media.giphy.com/media/yk8tRCZHCV0qY/giphy.gif")
        URLS.push("https://media.giphy.com/media/WwD2LE6RDh30I/giphy.gif")
        URLS.push("https://media.giphy.com/media/7BK3ZB7nNf2Jq/giphy.gif")
    }

    else if(searchString == "lod"){
        URLS.push("https://i.postimg.cc/mgh7MHMX/LOD1.gif")
        URLS.push("https://i.postimg.cc/50Pxw68g/LOD2.gif")
        URLS.push("https://i.postimg.cc/8PvSCyXt/LOD3.gif")
        URLS.push("https://i.postimg.cc/qRgfHQCc/LOD4.gif")
        URLS.push("https://i.postimg.cc/ZqsbNW8c/LOD5.gif")
        URLS.push("https://i.postimg.cc/8P4qcqBd/LOD6.gif")
    }

    randomNumber = Math.floor((Math.random()) * URLS.length);
    return URLS[randomNumber];

}

function dmUsersMissedRaids() {
 var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
 authorize(content, listMajors);
   
    function listMajors(auth) {
        const sheets = google.sheets({version: 'v4', auth});
        const guild = client.guilds.get("505515654833504266");
        sheets.spreadsheets.values.get({
            spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
            range: 'Guild Members & Data!A66:K119',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            const rows = res.data.values;
            if (rows.length) {
                rows.map((row) => { //STAY IN 
                    var user = row[6].replace("<","").replace(">","").replace("@","").replace(" ","")
                    if(row[2] - row[8] == 1 && row[7] == 1 && user != ""){
                        console.log(user + " was just forgiven QZ")
                        client.users.get(user).send("You have missed the "+ row[10] + " raid on " + row[9] + ", but luckily you purchased raid forgiveness!")
                        .catch(error => {
                            console.log(error)
                            console.log("Catch - Forgiven1")
                        });

                        const exampleEmbed = new Discord.RichEmbed()
                        .setTitle('All is forgiven.')
                        .setImage('https://media.giphy.com/media/U1sXoHqCyA7wRzXCEx/giphy.gif')
                        client.users.get(user).send(exampleEmbed)
                        .catch(error => {
                                console.log(error)
                                console.log("Catch - Forgiven2")
                        });
                            
                    }

                    else if (row[2] - row[8] == 1 && row[7] > 1 && user != ""){
                        console.log(user + " missed one raid QZ")
                        client.users.get(user).send("You have missed the "+ row[10] + " raid on " + row[9] + ".")
                        .catch(error => {
                            console.log(error)
                            console.log("Catch - Missed 1 raid")
                        });
                    }

                    else if (row[2] - row[8] > 1 && user != ""){
                        console.log(user + " missed multiple raids QZ")
                        client.users.get(user).send("You have missed the " + row[10] + " raid on " + row[9] + ". In addition, you have missed " + ((row[2] - 1) - row[8]) + " other raids(s) since you were last messaged.")
                        .catch(error => {
                            console.log(error)
                            console.log("Catch - Missed multiple raids")
                        });
                    } 
                });

                var missedRaids = new Array(54);
                for (var i = 0; i < missedRaids.length; i++) { 
                    missedRaids[i] = new Array(1);
                }

                for (var j = 0; j < missedRaids.length; j++) {
                    try{
                        if(rows[j][6] != "")
                            missedRaids[j][0] = rows[j][2];
                        else
                            missedRaids[j][0] = rows[j][8];
                    }       
                    catch(error){
                        missedRaids[j][0] = "";
                    }
                }

                sheets.spreadsheets.values.update({
                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                    range: 'Guild Members & Data!I66:I119',
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: missedRaids
                    },
                }, (err, res) => {
                    if (err) return console.log('The API returned an error: ' + err);
                });
            }else {
                console.log('No data found.');
            }
        });
    } 
}

function gifPost(message, searchString, tagLine) {
    var special = false;

    if(searchString == "succubus" || searchString == "molly" || searchString == "mhann" || searchString == "greg" || searchString == "lod"){
        special = true;
    }

    if(special == false){
        giphy.search('gifs', {"q": searchString, "limit": 35})
            .then((response) => {
                var TotalResponses = response.data.length;
                var ResponseIndex = Math.floor((Math.random() * 10) + 1) % TotalResponses;
                var ResponseFinal = response.data[ResponseIndex];

                const exampleEmbed = new Discord.RichEmbed()
                .setTitle(tagLine)
                .setImage(ResponseFinal.images.fixed_height.url)
              //  .setFooter('POWERED BY GIPHY', 'https://i.postimg.cc/RZbkMxLt/GIPHY.jpg')
              .setThumbnail('https://i.postimg.cc/Wzbg0cj7/GIPHY-Thumbnail-2.jpg')
                message.channel.send(exampleEmbed);
            }).catch(() => {
                message.channel.send("You mentioned " + searchString + ", but a gif was not available!")
        })
    }
    else{
        const exampleEmbed = new Discord.RichEmbed()
        .setTitle(tagLine)
        .setImage(specificGIF(searchString))
      //  .setFooter('POWERED BY GIPHY', 'https://i.postimg.cc/RZbkMxLt/GIPHY.jpg')
        .setThumbnail('https://i.postimg.cc/Wzbg0cj7/GIPHY-Thumbnail-2.jpg')
        message.channel.send(exampleEmbed);
    }
}

function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    // READ ONLY  token = {"access_token":"ya29.Il-9BygCO5hRduHR-tUsBx32geTiZxDF4QUjh17uDovL_OQYrsW-q53oknT-PYfQbG6qMAvDeV4myI3_uKIYIQLMsFPIuRV0UTR4g31GFJpdOuv-uQwqm1I-g4ttX0CgDg","refresh_token":"1//0dhkLg8Xv7BDXCgYIARAAGA0SNwF-L9IrG-vrIlgGQGioOCDU2gilJp7ZHgDWgiiugPjQWGw091GlSXJx4fTJJ5-6XIZYu5p_7Ds","scope":"https://www.googleapis.com/auth/spreadsheets.readonly","token_type":"Bearer","expiry_date":1581974001623}
      token =  {"access_token":"ya29.a0Adw1xeVMaJdFu4_Prd1JMj5VW6JLzPAux780mPR-FKiDT2XNCJ1xdywo5Q2mOCgj6PXzQEkrJJ68TymBCLF1NGIxJdwd6r6F-pDXqk8th8dc6bd_v711TCJpxdbEBSmXktCMFwb241KyLv1rJDvox_15WH4LLpNU9x8","refresh_token":"1//0dpVeaJ3ELcQBCgYIARAAGA0SNwF-L9IrUePhHzcm67KPL99LpKuThsJVLerdoAtDw5zTBbWhaxR0PobydX1sUCmVx8TdYXXpewA","scope":"https://www.googleapis.com/auth/spreadsheets","token_type":"Bearer","expiry_date":1583977474403}
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
            .catch(error => {
                console.log(error)
                console.log("Catch - Lost Flair")
        });

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
          range: 'Guild Members & Data!F66:L119',
        }, async (err, res) => {
          if (err) return console.log('The API returned an error: ' + err);
          const rows = res.data.values;
          if (rows.length) {

          var GuildMember;
          var User;
          var discordID;

            for (const element of rows){
                if(typeof element[1] != 'undefined' && element[1] != "" && element[0].length >= 1){
                    discordID = element[1].replace("<","").replace(">","").replace("@","");
                    if(discordID != 378053516067078149){
                        User =  await client.fetchUser(discordID)
                        GuildMember =  await guild.fetchMember(User)
                        .then(value =>{
                            AddFlair(value,element[0],Type,element[6]);
                        }).catch(error => {
                                console.log(error)
                                console.log("catch1")
                        });
                    }
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
    console.log("Cron job FlairUpdate executed QZ")
    FlairUpdate("Cron", newFlairAnncouncment)
}, null, true, 'America/New_York');
job.start();

var CronJob2 = require('cron').CronJob;
var job2 = new CronJob('05 9,21 * * *', function() {
    console.log("Cron job DMusers who miss raids executed QZ")
    dmUsersMissedRaids();
}, null, true, 'America/New_York');
job.start();

async function AddFlair(passedMember, row, Type, SpecialF){
    var OldNickname = passedMember.displayName
    var SpecialFlairString = '';

    var newNickname;
    newNickname = passedMember.displayName.replace(/🥉/g,'').replace(/🥈/g,'').replace(/🥇/g,'').replace(/💎/g,'').replace(/⚔/g,'').replace(/🛡/g,'').replace(/👸/g,'');

    if(SpecialF != undefined)
    {
        if(SpecialF.includes("O"))
        {
            SpecialFlairString = SpecialFlairString + '⚔'
        }
        if(SpecialF.includes("D"))
        {
            SpecialFlairString = SpecialFlairString + '🛡'
        }
        if(SpecialF.includes("P"))
        {
            SpecialFlairString = SpecialFlairString + '👸'
        }
    }

    if(row <= 13 && row >= 0 && OldNickname != newNickname + SpecialFlairString){
        await passedMember.setNickname(newNickname + SpecialFlairString)
        console.log(Type + " - " + passedMember.displayName + " None QZ")
        if(Type == "Manual" || Type == "Cron")
         NewNoStatus.push(passedMember.id)
    }
    else if(row >= 14 && row <= 29 && OldNickname != newNickname + SpecialFlairString +'🥉'){
        await passedMember.setNickname(newNickname + SpecialFlairString +'🥉')
        console.log(Type + " - " + passedMember.displayName + " Bronze QZ")
        if(Type == "Manual" || Type == "Cron")
            newBronze = newBronze + "<@" + passedMember.id + "> "
    }
    else if(row >= 30 && row <= 59 && OldNickname != newNickname + SpecialFlairString +'🥈'){
        await passedMember.setNickname(newNickname + SpecialFlairString +'🥈')
        console.log(Type + " - " + passedMember.displayName + " Silver QZ")
        if(Type == "Manual" || Type == "Cron")
            newSilver = newSilver + "<@" + passedMember.id + "> "
    }
    else if(row >= 60 && row <= 99 && OldNickname != newNickname + SpecialFlairString +'🥇'){
        await passedMember.setNickname(newNickname + SpecialFlairString +'🥇')
        console.log(Type + " - " + passedMember.displayName + " Gold QZ")
        if(Type == "Manual" || Type == "Cron")
            newGold = newGold + "<@" + passedMember.id + "> "
    }
    else if(row >= 100 && OldNickname != newNickname + SpecialFlairString +'💎'){
        await passedMember.setNickname(newNickname + SpecialFlairString +'💎')
        console.log(Type + " - " + passedMember.displayName + " Diamond QZ")
        if(Type == "Manual" || Type == "Cron")
            newDiamond = newDiamond + "<@" + passedMember.id + "> "
    }
    else{
        console.log(Type + " - " + passedMember.displayName + " No update needed")
    }
}

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if(newMember.guild.id == "505515654833504266")
    {
        var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
        authorize(content, listMajors);

        function listMajors(auth) {
            const sheets = google.sheets({version: 'v4', auth});
            sheets.spreadsheets.values.get({
                spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                range: 'Guild Members & Data!F66:L119',
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const rows = res.data.values;
                if (rows.length) {
                    rows.map((row) => {
                        if(String(row[1]).match(/\d+/) == newMember.user.id && String(row[1]).match(/\d+/) != "378053516067078149"){
                            AddFlair(newMember, row[0], "User Name Change",row[6]);
                        }
                    });
                }else {
                    console.log('No data found.');
                }
            });
        }
    }
})

client.on("guildMemberAdd", (member) => {
    if(member.guild.id == "505515654833504266")
        client.users.get(member.id).send("Welcome to Wookie and the Bandit!  I'm Mhanndalorain bot, and I work for <@406945430967156766>. "
        + "Some of the services I provide include keeping track of raid participation, weekly updates, advanced "
        + "commands, and humor. I will assign you flair (an emoji added to your username), based on your participation level in "
        + "raids (you only need to sign up, doing damage is optional): \n \n"
        + "Bronze (🥉) - 14 days of no missed raids \nSilver (🥈) - 30 days of no missed raids \n"
        + "Gold(🥇) - 60 days of no missed raids \nDiamond (💎) - 100 days of no missed raids \n \n"
        + "The following command will allow you to check your flair status at any time \n!flair \n \n"
        + "If you have any questions about my services please contact my employer, <@406945430967156766>. \n \nI have spoken. \n"
        + "This is the way.")

        console.log(member.displayName + " Has joined the guild QZ")

  });

client.on('message', message => {
    var bot = message.author.bot

    if((message.content == `${prefix}flair` || message.content == `${prefix}Flair`) && message.guild.id == "505515654833504266"){
        var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
        authorize(content, listMajors);
          
        function listMajors(auth) {
            const sheets = google.sheets({version: 'v4', auth});
            sheets.spreadsheets.values.get({
                spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                range: 'Guild Members & Data!F66:G',
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
                            message.channel.send("You are at gold level!! You have had " + row[0] + " days without missing raids.  Diamond level status is at 100 days.");
                        }
                        if(row[0] >= 100){
                            message.channel.send("Congratulations!! You have had " + row[0] + " days without missing raids.  You are diamond status!!!!!");
                        }
                    }
                });
            }else {
                console.log('No data found.');
            }
            });
        }       
    }

    else if(message.content == `${prefix}dmmissedraids` || message.content == `${prefix}DMmissedraids`){
        if(message.member.id == "406945430967156766"){
            dmUsersMissedRaids();
        }
    }

    else if(message.content.startsWith(`${prefix}broadcast`)){
        if(message.member.id == "406945430967156766"){
            const messagetopost = message.content.substring(11)
            client.channels.get("505515654837698563").send(messagetopost)  
        }
    }

    else if(message.content.startsWith(`${prefix}role`)){
        if(message.member.id == "406945430967156766"){
            const guild = client.guilds.get("505515654833504266");
           // guild.createRole({ name: 'Test', permissions: ['MANAGE_MESSAGES', 'KICK_MEMBERS'] });
           guild.roles.get("705498744061296721").setPosition(5)
         // guild.roles.get("505527335768948754").setPermissions(2146959351)

        }
    }

    else if(message.content == `${prefix}flairupdate` || message.content == `${prefix}Flairupdate`){
        if(message.member.id == "406945430967156766"){
            message.channel.send("Flair is being updated for all guild members")
            FlairUpdate("Manual", newFlairAnncouncment)
        } else{
            message.channel.send(message.member.displayName + ", what do you think you are doing.  Turn back.  I have spoken.");
            console.log(message.member.displayName + " tried to execute flairupdate QZ");
        }
    }

    else if(message.content.toLowerCase().startsWith(`${prefix}award`)){
        if(message.member.roles.has("505527335768948754"))
        {            
            (async () => {
                await message.channel.fetchMessages({ limit: 1 }).then(messages => { // Fetches the messages
                    console.log("Deleted " + FilteredCommandArray[1].toUpperCase() + " Award Command QZ")
                    message.channel.bulkDelete(messages)
                    .catch(err => {
                   //     console.log(message.member.displayName + ' Attempted to delete messages more than 14 days old. QZ');
                        console.log("catch4");
                        console.log(err);
                    });
                })
            })() 

            var CommandArray = message.content.split(' ');
            var FilteredCommandArray = [];

            for(var i = 0; i < CommandArray.length; i++)
            {
                if(CommandArray[i] != '')
                {
                    FilteredCommandArray.push(CommandArray[i])
                }
            }

            var discordID;
            var Proceed = true;

            var InputToDiscordID;

            for (var i = 2; i < FilteredCommandArray.length; i++){
                InputToDiscordID = FilteredCommandArray[i].match(/\d+/g)
            //    console.log(InputToDiscordID[0])
                discordID = client.users.get(InputToDiscordID[0])
                if(discordID == undefined){ //Discord user doesn't exist
                    message.channel.send("You entered a discord user that does not exist.")
                    Proceed = false;
                }
            }

            if (Proceed == true){
                FilteredCommandArray[1] = FilteredCommandArray[1].toLowerCase();
                if(FilteredCommandArray[1] == "two" || FilteredCommandArray[1] == "twd" || FilteredCommandArray[1] == "pri")
                {
                    var SpecificFlair;
                    var AwardMessage;
                    if(FilteredCommandArray[1] == "two")
                    {
                        SpecificFlair = 'O'
                        AwardMessage = "Territory War - Offensive Award ⚔"
                    }
                    if(FilteredCommandArray[1] == "twd")
                    {
                        SpecificFlair = 'D'
                        AwardMessage = "Territory War - Defensive Award 🛡"
                    }
                    if(FilteredCommandArray[1] == "pri")
                    {
                        SpecificFlair = 'P'
                        AwardMessage = "Wookie and the Bandit - Princess Award 👸"
                    }

                    const guild = client.guilds.get("505515654833504266");

                    content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
                    authorize(content, listMajors);

                    function listMajors(auth) {
                        const sheets = google.sheets({version: 'v4', auth});
                        sheets.spreadsheets.values.get({
                          spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                          range: 'Guild Members & Data!F66:L119',
                        }, async (err, res) => {
                          if (err) return console.log('The API returned an error: ' + err);
                          const rows = res.data.values;
                          if (rows.length)
                          {
                            var SpecialFlair = new Array(54);
                            for (var i = 0; i < SpecialFlair.length; i++) { 
                                SpecialFlair[i] = new Array(1);
                                SpecialFlair[i][0] = '';
                            }

                            var SpecificFlairRegEx = new RegExp(SpecificFlair,'g');
                            
                            for (var i = 0; i < rows.length; i++)
                            {
                                if(rows[i][6] == undefined)
                                {
                                    rows[i][6] = ''
                                }

                                SpecialFlair[i][0] = rows[i][6];
                                if(SpecialFlair[i][0].includes(SpecificFlair))
                                {
                                    SpecialFlair[i][0] = SpecialFlair[i][0].replace(SpecificFlairRegEx,'')

                                    if(rows[i][1] != "<@378053516067078149> " && null != (rows[i][1].match(/\d+/g)))
                                    {
                                        User =  await client.fetchUser(rows[i][1].match(/\d+/g))

                                        GuildMember =  await guild.fetchMember(User)
                                        .then(value =>{
                                                AddFlair(value,rows[i][0],"SpecialRemove", SpecialFlair[i][0]);
                                        }).catch(error => {
                                                console.log(error)
                                                console.log("catch2")
                                        });
                                    }

                                //    AddFlair(value,rows[j][0],"Special", SpecialFlair[j][0]);
                                }
                            }

                            var ListMembersSpecialFlar = '';

                            for (var i = 2; i < FilteredCommandArray.length; i++){
                                for (var j = 0; j < rows.length; j++)
                                {
                                    if(FilteredCommandArray[i].replace("!","") == rows[j][1].replace(" ",""))
                                    {
                                        SpecialFlair[j][0] = SpecialFlair[j][0] + SpecificFlair

                                        var TempUser2 = FilteredCommandArray[i].match(/\d+/g)

                                        
                                        User =  await client.fetchUser(TempUser2[0])
                                        GuildMember =  await guild.fetchMember(User)
                                        .then(value =>{
                                            if(TempUser2[0] != 378053516067078149)
                                            {
                                                AddFlair(value,rows[j][0],"SpecialAdd", SpecialFlair[j][0]);
                                            }
                                            ListMembersSpecialFlar = ListMembersSpecialFlar + rows[j][1].replace(" ","") + " " //CHECK!!!!
                                        }).catch(error => {
                                                console.log(error)
                                                console.log("catch3")
                                        });
                                        

                                        j = rows.length;
                                    }
                                }
                            }
                            
                            if(ListMembersSpecialFlar != '')//command channel 676092306381602826     //Cantina 505515654837698563
                                client.channels.get("505515654837698563").send("In recognition of achievement, the following member(s) have earned the " + AwardMessage + "  Excellent job!!\n" + ListMembersSpecialFlar)
                            
                            sheets.spreadsheets.values.update({
                                spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                range: 'Guild Members & Data!L66:L119',
                                valueInputOption: 'USER_ENTERED',
                                resource: {
                                    values: SpecialFlair
                                },
                            })                
                          }

                          else
                          {
                            console.log('No data found.');
                          }
                        });
                    }
                }
                else
                {
                    message.channel.send("Second argument must be TWO or TWD")
                }
                
            }
        }
        else
            message.reply('You do not have sufficient privileges to execute this command')
    }

    else if(message.content.startsWith(`${prefix}clean`)){
        if(message.member.roles.has("505527335768948754")){
            const args = message.content.split(' ').slice(1); // All arguments behind the command name with the prefix
            const amount = args.join(' '); // Amount of messages which should be deleted

            if (!amount) // Checks if the `amount` parameter is given
                return message.reply('You haven\'t given an amount of messages which should be deleted!')
            if (isNaN(amount))
                return message.reply('The amount must be a number!'); // Checks if the `amount` parameter is a number. If not, the command throws an error
            if (amount > 100)
                return message.reply('You can`t delete more than 100 messages at once!'); // Checks if the `amount` integer is bigger than 100
            if (amount < 1)
                return message.reply('You have to delete at least 1 message!'); // Checks if the `amount` integer is smaller than 1
                
            (async () => {
                await message.channel.fetchMessages({ limit: amount }).then(messages => { // Fetches the messages
                    console.log(message.member.displayName + ` Bulk deleted ${messages.size} messages QZ`)
                    message.channel.bulkDelete(messages)
                    .catch(err => {
                   //     console.log(message.member.displayName + ' Attempted to delete messages more than 14 days old. QZ');
                        console.log(message.member.displayName + ` Individually deleted ${messages.size} messages QZ`);
                        messages.deleteAll()
                        console.log(err);
                    });
                })
            })()
        }
        else{
            message.reply('You do not have sufficient privileges to execute this command')
            console.log(message.member.displayName + " Failed to execute clean command QZ")
        }
    }

    else if(message.content.toLowerCase().match(/[e][b][.]\d{9}[.][r][e][g][i][s][t][e][r]/) && !bot && message.guild.id == "505515654833504266"){
        var allyCode = String(message.content.slice(3,12));
        var officer;

        if(message.content.includes("@"))
        {
            if(message.member.roles.has("505527335768948754"))
            {
                var discordID = String(message.content.split('@')[1].match(/\d+/g));
                officer = true;
            }
            else
            {
                officer = false
                discordID = "xxxx"
            }
        }
        else
            var discordID = String(message.member.id)

        var user = client.users.get(discordID)

        if(officer == false) //A non officer attempted to execute an officer command
        { 
            const Embed = new Discord.RichEmbed()
                .setColor('#ff0000')
                .setTitle('Error - Mhanndalorian Bot')
                .setDescription('You do not have permission to execute this command.');
            message.channel.send(Embed)
        }

        else if(user == undefined){ //Discord user doesn't exist
            const Embed = new Discord.RichEmbed()
                .setColor('#ff0000')
                .setTitle('Error - Mhanndalorian Bot')
                .setDescription('Could not find Discord User.');
            message.channel.send(Embed)
        }

        else //Discord user was found on server
        {
            //*********REGISTER FOR HOT BOT**************//
    
           (async () => {
                const guild = client.guilds.get("505515654833504266");
                const BaseURL = "https://www.hotutils.app/HotStaging/swgoh/register"
            
                var User;
                var GuildMember;

                var DiscordDiscriminator;
                var DiscordName;
                var Color;
                var Title;

                User =  await client.fetchUser(discordID);
                GuildMember =  await guild.fetchMember(User);

              //  DiscordDiscriminator = "%23" + GuildMember.user.discriminator OLD API
              //  DiscordName = GuildMember.user.username.replace(/ /g, "%20") OLD API

                DiscordDiscriminator = "#" + GuildMember.user.discriminator
                DiscordName = GuildMember.user.username

                var headers = {
                    "VendorID": "81babb8a-e943-4dc0-a178-a6a29e94924e",
                    "Accept": "application/json",
                    "Content-Type": "application/json"
                };

                var body = {
                    "discordTag": DiscordName + DiscordDiscriminator,
                    "discordId": discordID,
                    "allyCode": allyCode                };

              //  Server = BaseURL + DiscordName + DiscordDiscriminator + "/" + discordID + "/" + allyCode OLD API

              //  Result = await fetch(Server, { headers: headers}).then(response => response.json()) OLD API

                Result = await fetch(BaseURL,
                {
                    method: 'POST',
                    headers: headers,
                    body: JSON.stringify(body)
                }).then(response => response.json())

                var JSONResponse = (JSON.parse(Result));

                if(JSONResponse.ResponseCode == 0)
                {
                    Color = "#ff0000"
                    Title = "Error - HotBot"
                }
                else if (JSONResponse.ResponseCode == 1)
                {
                    Color = "00ff00"
                    Title = "Success - HotBot"
                }

                const Embed = new Discord.RichEmbed()
                    .setColor(Color)
                    .setTitle(Title)
                    .setDescription(JSONResponse.ResponseMessage);
                message.channel.send(Embed) 
            })()

            //**************BELOW IS TO REGISTER FOR MHANN BOT***************

            discordIDArray = new Array(1)
            discordIDArray[0] = new Array(1)
            discordIDArray[0][0]= "<@" + discordID + "> "

            var allyCodeFound = false;

            var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
            authorize(content, listMajors);

            function listMajors(auth) {
                const sheets = google.sheets({version: 'v4', auth});
                sheets.spreadsheets.values.get({
                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                    range: 'Guild Members & Data!A66:G119',
                }, (err, res) => {
                    if (err) return console.log('The API returned an error: ' + err);
                const rows = res.data.values;
                var DiscordIDDuplicate = false
                if (rows.length) {
                    rows.map((row) => {
                        if(row[6] == discordIDArray[0][0])
                        {
                            const Embed = new Discord.RichEmbed()
                                .setColor('#ff0000')
                                .setTitle('Error - Mhanndalorian Bot')
                                .setDescription('The discord ID is already assigned in the Mhanndalorian database.');

                            message.channel.send(Embed)
                            DiscordIDDuplicate = true
                        }
                    });

                    if(DiscordIDDuplicate == false)
                    {
                        var i = 0
                        rows.map((row) => {
                            if(row[0] == allyCode){ //ally code found and set discord ID
                                allyCodeFound = true;
                                sheets.spreadsheets.values.update({
                                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                    range: 'Guild Members & Data!G' + (i+66),
                                    valueInputOption: 'USER_ENTERED',
                                    resource: {
                                        values: discordIDArray
                                    },
                                })
                                  
                                const Embed2 = new Discord.RichEmbed()
                                    .setColor('#00ff00')
                                    .setTitle('Success - Mhanndalorian Bot')
                                    .setDescription("Discord ID successfully added to Mhanndalorian database for Allycode " + allyCode);
                                message.channel.send(Embed2)
                            }
                            i++
                        });
                    }

                    if(allyCodeFound == false && DiscordIDDuplicate == false)
                    {
                        var Description = "Ally code " + allyCode +" was not found in Mhanndalorian database.";

                       // message.channel.send("Ally code " + allyCode +" was not found in Mhanndalorian database")
                        const sheets = google.sheets({version: 'v4', auth});
                        sheets.spreadsheets.values.get({
                            spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                            range: 'Guild Members & Data!A57:A63',
                        }, (err, res) => {
                            if (err) return console.log('The API returned an error: ' + err);
                        const rows = res.data.values;
                        if (rows.length) {
                            var i = 0;
                            var TempAllyCodeFound = false

                            while(i<rows.length && !TempAllyCodeFound) //See if ally code is already in temp table
                            {
                                if(rows[i][0] == allyCode)
                                {
                                    TempAllyCodeFound = true;
                                }

                                else
                                {
                                    i++;
                                }
                            }

                            if(!TempAllyCodeFound) //If ally code wasnt in temp table, search for a blank spot
                            {
                                i = 0;
                                while(i<rows.length && rows[i][0] != undefined)
                                {
                                    i++
                                }
                            }

                            if(i < 7)
                            {
                                var today = new Date();
                                var localdate = ((today.getTime() / 86400000) + 25569) - (4/24)
                                Description = Description + " Allycode and Discord ID have have been stored in a temporary location in Mhanndalorian database and will be added after new member is in SWGOH.GG database."
                                
                                const Embed3 = new Discord.RichEmbed()
                                    .setColor('#ffff00')
                                    .setTitle('Info - Mhanndalorian Bot')
                                    .setDescription(Description);
                                message.channel.send(Embed3)

                              //  message.channel.send("Allycode and Discord ID have have been stored in a temporary location in Mhanndalorian database.")
                                sheets.spreadsheets.values.update({
                                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                    range: 'Guild Members & Data!A' + (i+57) + ':C' + (i+57),
                                    valueInputOption: 'USER_ENTERED',
                                    resource: {
                                        values: [[allyCode, "<@" + discordID + "> ", localdate]]
                                    },
                                })
                            }
                            else{
                                Description = Description + " Allycode and Discord ID could not be stored in a temporary location in Mhanndalorian database.  Temporary location is full."

                                const Embed4 = new Discord.RichEmbed()
                                    .setColor('#ff0000')
                                    .setTitle('Error - Mhanndalorian Bot')
                                    .setDescription(Description);
                                message.channel.send(Embed4)
                               // message.channel.send("Temporary location in Mhanndalorian database is currently full.")
                            }                  

                        }else {
                            console.log('No data found.');
                        }
                        });
                        
                    } 
                }else {
                    console.log('No data found.');
                }
                });
            }                
        }
    }

    else if(message.content.toLowerCase().startsWith(`${prefix}lookup`) &&  message.guild.id == "505515654833504266"){
        var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
        authorize(content, listMajors);
          
        function listMajors(auth)
        {
            const guild = client.guilds.get("505515654833504266");
            
            const sheets = google.sheets({version: 'v4', auth});
            sheets.spreadsheets.values.get({
                spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                range: 'Guild Members & Data!A66:G119',
            }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
            const rows = res.data.values;
            if (rows.length)
            {
                CommandArray = message.content.split(/ (.+)/)
                if(CommandArray[1] == undefined)
                {
                    message.channel.send("Please specify an allycode, discord name, or SWGOH name")
                }
                else
                {
                    var RowFound;
                    var DiscordSWGOHNameIDArray;
                    var Found = false;
                    
                    (async () => { 
                        await guild.fetchMembers()                    
                    })()

                    DiscordSWGOHNameIDArray  = guild.roles.get('530083964380250116').members.map(m => [m.id, m.displayName])

                    for(var i = 0; i < DiscordSWGOHNameIDArray.length; i++)
                    {
                        DiscordSWGOHNameIDArray[i][1] = DiscordSWGOHNameIDArray[i][1].replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
                    }

                    for(var i = 0; i < rows.length; i++)
                    {
                        for(var j = 0; j < DiscordSWGOHNameIDArray.length; j++)
                        {
                            if(rows[i][6].match(/\d+/g) == DiscordSWGOHNameIDArray[j][0])
                            {
                                DiscordSWGOHNameIDArray[j].push(rows[i][0])
                                DiscordSWGOHNameIDArray[j].push(rows[i][1])
                                j = DiscordSWGOHNameIDArray.length
                            }
                        }
                    }

                    for(var j = 0; j < DiscordSWGOHNameIDArray.length; j++)
                    {
                        if(DiscordSWGOHNameIDArray[j][2] == undefined || DiscordSWGOHNameIDArray[j][3] == undefined)
                        DiscordSWGOHNameIDArray.splice(j,1)
                    }
                   
                    for(var i = 0; i < DiscordSWGOHNameIDArray.length; i++)
                    {
                      //  if(DiscordSWGOHNameIDArray[i][1].toLowerCase() == CommandArray[1].toLowerCase() || DiscordSWGOHNameIDArray[i][2] == CommandArray[1] || DiscordSWGOHNameIDArray[i][3].toLowerCase() == CommandArray[1].toLowerCase())
                        if(DiscordSWGOHNameIDArray[i][1].toLowerCase().startsWith(CommandArray[1].toLowerCase()) || DiscordSWGOHNameIDArray[i][2].startsWith(CommandArray[1]) || DiscordSWGOHNameIDArray[i][3].toLowerCase().startsWith(CommandArray[1].toLowerCase()))
                        {
                            RowFound = i;
                            i = DiscordSWGOHNameIDArray.length
                            Found = true
                        }
                    }

                    if(Found == true)
                    {
                        (async () => { 
                            User =  await client.fetchUser(DiscordSWGOHNameIDArray[RowFound][0])                         
                            GuildMember =  await guild.fetchMember(User)
                            DisplayNamed = GuildMember.displayName
                            message.channel.send("__**Ally Code:**__  " + DiscordSWGOHNameIDArray[RowFound][2] + "\n" + "__**SWGOH Name:**__  " + DiscordSWGOHNameIDArray[RowFound][3] + "\n" + "__**Discord Name:**__  " + DiscordSWGOHNameIDArray[RowFound][1])
                        })()
                    }

                    else
                        message.channel.send("User not found.")
                }
            }
            else
                console.log('No data found.');
            });
        }
    }

    else if (!message.content.includes(",,") && !bot && !message.content.includes("!") &&  message.guild.id == "505515654833504266")
    {
        if(message.content.toLowerCase().includes("flair")){
            gifPost(message, "Ric Flair", "WOOOOOOOOOOOOOOO!")
        }

        else if(message.content.toLowerCase().includes("piper")){
            gifPost(message, "Roddy Piper WWE", "Real men wear kilts")
        }

        else if(message.content.toLowerCase().includes("hogan")){
            gifPost(message, "Hulk Hogan", "Hulkamania!!!!!!!")
        }

        else if(message.content.toLowerCase().includes("the rock")){
            gifPost(message, "The Rock WWE", "Do you smell what the Rock is Cooking?")
        }

        else if((message.content.toLowerCase().includes("steve austin") || message.content.toLowerCase().includes("stone cold"))){
            gifPost(message, "Stone Cold Steve Austin", "Because Stone Cold said so!")
        }

        else if(message.content.toLowerCase().includes("macho man")){
            gifPost(message, "macho man randy savage", "OHHHHHHHH YEAHHHHHHHHH!")
        }

        else if((message.content.toLowerCase().includes("heartbreak kid") || message.content.toLowerCase().includes("shawn michaels"))){
            gifPost(message, "shawn michaels WWE", "How about some sweet chin music?")
        }

        else if(message.content.toLowerCase().includes("undertaker")){
            gifPost(message, "the undertaker WWE", "RIP")
        }

        else if((message.content.toLowerCase().search(/\bhhh\b/) >= 0 || message.content.toLowerCase().includes("triple h"))){
            gifPost(message, "hhh wwe", "Time to play the game!!!!!")
        }

        else if(message.content.toLowerCase().includes("ultimate warrior")){
            gifPost(message, "the ultimate warrior", "The frequencies in my head are not known to normals")
        }

        else if(message.content.toLowerCase().includes("chris jericho")){
            gifPost(message, "chris jericho", "Welcome to RAW IS JERICHO!")
        }

        else if(message.content.toLowerCase().includes("booker t")){
            gifPost(message, "Booker T wrestling", "Can you dig it, sucka?")
        }

        else if((message.content.toLowerCase().includes("darth vader") || message.content.toLowerCase().includes("vader"))){
            gifPost(message, "darth vader", "I am your father!")
        }

        else if((message.content.toLowerCase().includes("jar jar") || message.content.toLowerCase().includes("jake")) && !message.content.toLowerCase().includes("the snake")){	
            gifPost(message, "jar jar binks", "Mesa called Jar Jar Binks")	
        }

        else if(message.content.toLowerCase().includes("goldberg")){
            gifPost(message, "Bill Goldberg", "Who's next?")
        }

        else if(message.content.toLowerCase().includes("andre the giant")){
            gifPost(message, "andre the giant", "It's not my fault being the biggest and the strongest.")
        }

        else if(message.content.toLowerCase().includes("cynyde")){
            gifPost(message, "princess", "You're gonna hear me roar!! - Cynyde")
        }

        else if(message.content.toLowerCase().search(/\bsting\b/) >= 0){
            gifPost(message, "sting wrestling", "It's Showtime!")
        }

        else if(message.content.toLowerCase().includes("big show")){
            gifPost(message, "big show", "Well it's the Big Show!")
        }

        else if((message.content.toLowerCase().includes("x pac") || message.content.toLowerCase().includes("xpac"))){
            gifPost(message, "x pac", "Degeneration X!!")
        }

        else if(message.content.toLowerCase().includes("rey mysterio")){
            gifPost(message, "Rey mysterio", "Rey mysterio")
        }

        else if(message.content.toLowerCase().includes("john cena")){
            gifPost(message, "john cena", "U can't see me!")
        }

        else if(message.content.toLowerCase().includes("baby yoda")){
            gifPost(message, "baby yoda", "Baby Yoda")
        }

        else if(message.content.toLowerCase().includes("yoda")){
            gifPost(message, "yoda", "Much to learn you still have")
        }

        else if(message.content.toLowerCase().includes("luke skywalker")){
            gifPost(message, "luke skywalker", "NOOOOOOOOOO!!!!!!!!!!!")
        }

        else if(message.content.toLowerCase().includes("jabba the hut")){
            gifPost(message, "jabba the hut", "You will soon learn to appreciate me")
        }

        else if((message.content.toLowerCase().includes("chewbacca") || message.content.toLowerCase().includes("chewie"))){
            gifPost(message, "Chewbacca", "GGGWARRRHHWWWW.")
        }

        else if((message.content.toLowerCase().includes("mankind") || message.content.toLowerCase().includes("mick foley"))){
            gifPost(message, "mankind wwe", "Have a nice day.")
        }

        else if(message.content.toLowerCase().includes("kane")){
            gifPost(message, "kane wwe", "Kane")
        }

        else if((message.content.toLowerCase().includes("bret hart") || message.content.toLowerCase().includes("bret heart"))){
            gifPost(message, "bret hart wrestling wwe", "I'm the best there is, the best there was, and the best there ever will be.")
        }

        else if((message.content.toLowerCase().includes("honkytonk") || message.content.toLowerCase().includes("honky tonk"))){
            gifPost(message, "honky tonk man wwe", "Where's my guitar?")
        }

        else if((message.content.toLowerCase().includes("mtscout") || message.content.toLowerCase().includes("scout"))){
            gifPost(message, "chicken", "Chicken!!!")
        }

        else if(message.content.toLowerCase().includes("brutus the barber")){
            gifPost(message, "Brutus the barber beefcake wwe", "Welcome to the barber shop!")
        }

        else if(message.content.toLowerCase().includes("jake the snake")){
            gifPost(message, "jake the snake wwe", "Welcome to the snake pit!")
        }

        else if((message.content.toLowerCase().includes("sgt. slaughter") || message.content.toLowerCase().includes("sgt slaughter"))){
            gifPost(message, "sgt slaughter wwe", "Cobra clutch!!!!!")
        }

        else if(message.content.toLowerCase().includes("bam bam")){
            gifPost(message, "bam bam bigelow wwe", "If you play with fire, you're gonna get burned.")
        }

        else if(message.content.toLowerCase().includes("kurt angle")){
            gifPost(message, "kurt angle", "It’s True, It’s True")
        }

        else if(message.content.toLowerCase().includes("trish stratus")){
            gifPost(message, "trish stratus", "100% Stratusfaction")
        }

        else if(message.content.toLowerCase().includes("han solo")){
            gifPost(message, "han solo", "Don't ever tell me the odds.")
        }

        else if((message.content.toLowerCase().includes("skittles") || message.content.toLowerCase().search(/\berin\b/) >= 0)){
            gifPost(message, "succubus", "Succubus:  A demon in female form.")
        }

        else if((message.content.toLowerCase().includes("molly") || message.content.toLowerCase().includes("mollywhopper"))){
            gifPost(message, "molly", "The Boss Man!!")
        }

        else if((message.content.toLowerCase().includes("the fonze") || message.content.toLowerCase().includes("fonze"))){
            gifPost(message, "the fonze", "A!!")
        }

        else if((message.content.toLowerCase().includes("mhann uhdea") || message.content.toLowerCase().includes("mhann"))){
            gifPost(message, "mhann", "Has anyone seen Obi-Wan or Anakin?  I was told to go break up a fight...")
        }

        else if(message.content.toLowerCase().includes("keon")){
            gifPost(message, "baby crying", "Why wont this kid stop crying!!!!")
        }

        else if((message.content.toLowerCase().includes("greg") || message.content.toLowerCase().includes("stgregory"))){
            gifPost(message, "greg", "I’m the Dude, so that’s what you call me. That or, uh His Dudeness, or uh Duder, or El Duderino, if you’re not into the whole brevity thing.")
        }

        else if((message.content.toLowerCase().includes("pooedonu") || message.content.toLowerCase().includes("poo"))){
            gifPost(message, "poop", "Welcome to the dark side.")
        }

        else if((message.content.toLowerCase().includes("baldoldben") || message.content.toLowerCase().search(/\bbob\b/) >= 0)){
            gifPost(message, "bald", "Women love a self-confident bald man.")
        }

        else if(message.content.toLowerCase().includes("kalles")){
            gifPost(message, "farmer", "Keep calm and farm on.")
        }

        else if(message.content.toLowerCase().search(/\bdoc\b/) >= 0){
            gifPost(message, "doctor", "This won't hurt a bit.")
        }

        else if(message.content.toLowerCase().includes("nnak")){
            gifPost(message, "dog the bounty hunter", "I love bounty hunters!")
        }

        else if(message.content.toLowerCase().includes("legion of doom") || message.content.toLowerCase().includes("road warriors")){
            gifPost(message, "lod", "What a rush!!!!!!")
        }
    }
    else if (!message.content.includes(",,") && !bot && !message.content.includes("!") &&  message.guild.id == "541730480479928351")
    {
        if(message.content.toLowerCase().includes("eggs")){
            gifPost(message, "eggs", "I love eggs")
        }
    }
})

//LEAVE THIS WAY
client.login(process.env.BOT_TOKEN);
