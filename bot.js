const Discord = require('discord.js');
const {google} = require('googleapis');
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

function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function specificGIF(searchString){
    URLS = new Array();
    var randomNumber;

    if(searchString == "succubus"){
        URLS.push("https://media.giphy.com/media/pseubeg1JACwo/giphy.gif")
        URLS.push("https://media.giphy.com/media/oL0LeKVib4z3G/giphy.gif")
        URLS.push("https://media.giphy.com/media/TTgdzuIqWc7dkARNFaE/giphy.gif")
        URLS.push("https://media.giphy.com/media/FNnkDbKc6s6c/giphy.gif")
        URLS.push("https://media.giphy.com/media/CQBUQn0nyxwEo/giphy.gif")
        URLS.push("https://media.giphy.com/media/PJAzcudAG5aaQ/giphy.gif")
    }
    randomNumber = Math.floor((Math.random()) * URLS.length);
    return URLS[randomNumber];

}

function gifPost(message, searchString, tagLine) {
    var special = false;

    if(searchString == "succubus"){
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
                if(typeof element[1] != 'undefined' && element[0].length >= 1){
                    discordID = element[1].replace("<","").replace(">","").replace("@","");
                    if(discordID != 378053516067078149){
                        User =  await client.fetchUser(discordID)
                        GuildMember =  await guild.fetchMember(User)
                        .then(value =>{
                            AddFlair(value,element[0],Type);
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

client.on("guildMemberAdd", (member) => {
    client.users.get(member.id).send("Welcome to Wookie and the Bandit!  I'm Mhanndalorain bot, and I work for <@406945430967156766>. "
    + "Some of the services I provide include keeping track of raid participation, weekly updates, advanced "
    + "commands, and humor. I will assign you flair (an emoji added to your username), based on your participation level in "
    + "raids (you only need to sign up, doing damage is optional): \n \n"
    + "Bronze (🥉) - 14 days of no missed raids \nSilver (🥈) - 30 days of no missed raids \n"
    + "Gold(🥇) - 60 days of no missed raids \nDiamond (💎) - 100 days of no missed raids \n \n"
    + "The following command will allow you to check your flair status at any time \n!flair \n \n"
    + "If you have any questions about my services please contact my employer, <@406945430967156766>. \n \nI have spoken. \n"
    + "This is the way.")

    console.log(member.displayName) + "Has joined the guild QZ"

  });

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
    else if(message.content == `${prefix}flairupdate` || message.content == `${prefix}Flairupdate`){
        if(message.member.id == "406945430967156766"){
            message.channel.send("Flair is being updated for all guild members")
            FlairUpdate("Manual", newFlairAnncouncment)
        } else{
            message.channel.send(message.member.displayName + ", what do you think you are doing.  Turn back.  I have spoken.");
            console.log(message.member.displayName + " tried to execute flairupdate QZ");
        }
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
    else if(message.content.toLowerCase().includes("flair") && message.author.bot == false){
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

    else if(message.content.toLowerCase().includes("steve austin") || message.content.toLowerCase().includes("stone cold")){
        gifPost(message, "Stone Cold Steve Austin", "Because Stone Cold said so!")
    }

    else if(message.content.toLowerCase().includes("macho man")){
        gifPost(message, "macho man randy savage", "OHHHHHHHH YEAHHHHHHHHH!")
    }

    else if(message.content.toLowerCase().includes("heartbreak kid") || message.content.toLowerCase().includes("shawn michaels")){
        gifPost(message, "shawn michaels WWE", "How about some sweet chin music?")
    }

    else if(message.content.toLowerCase().includes("undertaker")){
        gifPost(message, "the undertaker WWE", "RIP")
    }

    else if(message.content.toLowerCase().includes("hhh") || message.content.toLowerCase().includes("triple h")){
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

    else if(message.content.toLowerCase().includes("darth vader") || message.content.toLowerCase().includes("vader")){
        gifPost(message, "darth vader", "I am your father!")
    }

    else if(message.content.toLowerCase().includes("jar jar") || message.content.toLowerCase().includes("jake")){
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

    else if(message.content.toLowerCase().includes("x pac") || message.content.toLowerCase().includes("xpac")){
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

    else if(message.content.toLowerCase().includes("chewbacca") || message.content.toLowerCase().includes("chewie")){
        gifPost(message, "Chewbacca", "GGGWARRRHHWWWW.")
    }

    else if(message.content.toLowerCase().includes("mankind") || message.content.toLowerCase().includes("mick foley")){
        gifPost(message, "mankind wwe", "Have a nice day.")
    }

    else if(message.content.toLowerCase().includes("kane")){
        gifPost(message, "kane wwe", "Kane")
    }

    else if(message.content.toLowerCase().includes("bret hart") || message.content.toLowerCase().includes("bret heart")){
        gifPost(message, "bret hart wrestling wwe", "I'm the best there is, the best there was, and the best there ever will be.")
    }

    else if(message.content.toLowerCase().includes("honkytonk") || message.content.toLowerCase().includes("honky tonk")){
        gifPost(message, "honky tonk man wwe", "Where's my guitar?")
    }

    else if(message.content.toLowerCase().includes("mtscout") || message.content.toLowerCase().includes("scout")){
        gifPost(message, "chicken", "Chicken!!!")
    }

    else if(message.content.toLowerCase().includes("brutus the barber")){
        gifPost(message, "Brutus the barber beefcake wwe", "Welcome to the barber shop!")
    }

    else if(message.content.toLowerCase().includes("jake the snake")){
        gifPost(message, "jake the snake wwe", "Welcome to the snake pit!")
    }

    else if(message.content.toLowerCase().includes("sgt. slaughter") || message.content.toLowerCase().includes("sgt slaughter")){
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

    else if(message.content.toLowerCase().includes("skittles") || message.content.toLowerCase().includes("erin")){
        gifPost(message, "succubus", "Succubus:  A demon in female form.")
    }

})

//LEAVE THIS WAY
client.login(process.env.BOT_TOKEN);
