const { Intents } = require("discord.js");
const Discord = require('discord.js');
const {MessageAttachment} = require('discord.js');
const {ChartJSNodeCanvas} = require('chartjs-node-canvas')
const intents = new Intents([
    Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
    "GUILD_MEMBERS", // lets you request guild members (i.e. fixes the issue)
    "GUILD_PRESENCES",
]);
const client = new Discord.Client({ ws: { intents } });

const {google} = require('googleapis');
const fetch = require('node-fetch');
const giffyToken = "s5PcPTErWAqH6dU57Bfk1WXF5n6F4DTY";
//const prefix = "!"
const GuildLeader = 350289089582596097n

var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}

var newBronze = "";
var newSilver = "";
var newGold = "";
var newDiamond = "";
var newHolodisk = "";
var newJediScroll = ""
var newEye = "";
var NewNoStatus = [];

var GphApiClient = require('giphy-js-sdk-core');
giphy = GphApiClient(giffyToken)

var GIFData;
var BotUpTime;
var BotUpDate;
var AllGuildData;

client.once('ready', () => {
    console.log('Ready')
    client.channels.cache.get("584496478412734464").messages.fetch({ limit: 40 }) //Cache message from MIA channel
    BotUpTime = new Date().toLocaleTimeString()
    BotUpDate = new Date().toLocaleDateString()
})




async function GetMemberTrialStatus(AllGuildData,GuildFoundRow, message, SubtractOneFromTrial)
{
    async function authorize(credentials, callback)
    {
        const {client_secret, client_id, redirect_uris} = credentials.installed;
        const oAuth2Client = new google.auth.OAuth2(
            client_id, client_secret, redirect_uris[0]);
        token =  {"access_token":"ya29.a0Adw1xeVMaJdFu4_Prd1JMj5VW6JLzPAux780mPR-FKiDT2XNCJ1xdywo5Q2mOCgj6PXzQEkrJJ68TymBCLF1NGIxJdwd6r6F-pDXqk8th8dc6bd_v711TCJpxdbEBSmXktCMFwb241KyLv1rJDvox_15WH4LLpNU9x8","refresh_token":"1//0dpVeaJ3ELcQBCgYIARAAGA0SNwF-L9IrUePhHzcm67KPL99LpKuThsJVLerdoAtDw5zTBbWhaxR0PobydX1sUCmVx8TdYXXpewA","scope":"https://www.googleapis.com/auth/spreadsheets","token_type":"Bearer","expiry_date":1583977474403}
        oAuth2Client.setCredentials(token);
        return await callback(oAuth2Client);
    }
    async function listMajors(auth)
    {
        const sheets = google.sheets({version: 'v4', auth})
        var request = {
            spreadsheetId: AllGuildData[GuildFoundRow][3],
            range: 'Guild Members & Data!G66:V119'
        }

        function GetSheetDataAsync(request)
        {
            return new Promise(function(resolve,reject) {
                sheets.spreadsheets.values.get(request, function(err, res){
                    if (err !== null) reject(err);
                    else resolve(res.data.values);
                });

            });
        }

        var Data = ""

        Data = await GetSheetDataAsync(request)

        if(Data == undefined)
        {
            console.log("Database contains no data.  Guild ID: " + AllGuildData[GuildFoundRow][1])
            return 0;
        }

        for(var i = 0; i < Data.length; i++)
        {
            if(message.author.id == Data[i][0].replace("<@","").replace(">","").replace(" ",""))
            {
                if(SubtractOneFromTrial == true)
                {
                    sheets.spreadsheets.values.update({
                        spreadsheetId: AllGuildData[GuildFoundRow][3],
                        range: 'Guild Members & Data!V' + (i+66),
                        valueInputOption: 'USER_ENTERED',
                        resource: {
                            values: [[Data[i][15] - 1]]
                        },
                    })
                }

                return Data[i][15]
            }
        }
    }

    return (await authorize(content, listMajors));
}




function CheckMemberPatreonStatus(UserID)
{
    const MhanndalorianBotGuild = client.guilds.cache.get('814625223906689044')
    const CarboniteIDs = MhanndalorianBotGuild.roles.cache.get('814627631008841799').members.map(m=>m.user.id)
    const InitiateIDs = MhanndalorianBotGuild.roles.cache.get('816408440884428830').members.map(m=>m.user.id)

    for(var i = 0; i < InitiateIDs.length; i++)
    {
        if(UserID == InitiateIDs[i])
            return 3
    }

    for(var i = 0; i < CarboniteIDs.length; i++)
    {
        if(UserID == CarboniteIDs[i])
            return 1
    }

    return 0
}

function RestartHerokuDyno()
{
    var request = require('request');

    request.delete(
    {
        url: 'https://api.heroku.com/apps/mhanndalorian-bot/dynos/worker.1',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/vnd.heroku+json; version=3',
            'Authorization': 'Bearer ' + '6dff47c6-f019-48a2-8c50-741ea2610c81'
        }
    },

    function(error, response, body) {
        if(error)
            console.log(error)
    });
}

async function GetSubscribers(AllGuildData,GuildFoundRow)
{
    const guild = client.guilds.cache.get(AllGuildData[GuildFoundRow][1]);
    const DiscordIDs = guild.roles.cache.get(AllGuildData[GuildFoundRow][1]).members.map(m=>m.user.id)

    const BotGuild = client.guilds.cache.get('814625223906689044')
    const CarboniteIDs = BotGuild.roles.cache.get('814627631008841799').members.map(m=>m.user.id)
    const InitiateIDs = BotGuild.roles.cache.get('816408440884428830').members.map(m=>m.user.id)

    async function authorize(credentials, callback) {
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
        client_id, client_secret, redirect_uris[0]);
    // READ ONLY  token = {"access_token":"ya29.Il-9BygCO5hRduHR-tUsBx32geTiZxDF4QUjh17uDovL_OQYrsW-q53oknT-PYfQbG6qMAvDeV4myI3_uKIYIQLMsFPIuRV0UTR4g31GFJpdOuv-uQwqm1I-g4ttX0CgDg","refresh_token":"1//0dhkLg8Xv7BDXCgYIARAAGA0SNwF-L9IrG-vrIlgGQGioOCDU2gilJp7ZHgDWgiiugPjQWGw091GlSXJx4fTJJ5-6XIZYu5p_7Ds","scope":"https://www.googleapis.com/auth/spreadsheets.readonly","token_type":"Bearer","expiry_date":1581974001623}
      token =  {"access_token":"ya29.a0Adw1xeVMaJdFu4_Prd1JMj5VW6JLzPAux780mPR-FKiDT2XNCJ1xdywo5Q2mOCgj6PXzQEkrJJ68TymBCLF1NGIxJdwd6r6F-pDXqk8th8dc6bd_v711TCJpxdbEBSmXktCMFwb241KyLv1rJDvox_15WH4LLpNU9x8","refresh_token":"1//0dpVeaJ3ELcQBCgYIARAAGA0SNwF-L9IrUePhHzcm67KPL99LpKuThsJVLerdoAtDw5zTBbWhaxR0PobydX1sUCmVx8TdYXXpewA","scope":"https://www.googleapis.com/auth/spreadsheets","token_type":"Bearer","expiry_date":1583977474403}
      oAuth2Client.setCredentials(token);
      return await callback(oAuth2Client);
}
    async function listMajors(auth) {
        const sheets = google.sheets({version: 'v4', auth})
        var request = {
            spreadsheetId: AllGuildData[GuildFoundRow][3],
            range: 'Guild Members & Data!G66:G119'
        }

        function GetSheetDataAsync(request)
        {
            return new Promise(function(resolve,reject) {
                sheets.spreadsheets.values.get(request, function(err, res){
                    if (err !== null) reject(err);
                    else resolve(res.data.values);
                });

            });
        }

        var DiscordIDsFromDatabase = ""

        DiscordIDsFromDatabase = await GetSheetDataAsync(request)

        if(DiscordIDsFromDatabase == undefined)
        {
            console.log("Database contains no data.  Guild ID: " + AllGuildData[GuildFoundRow][1])
            return 0;
        }

        var SubscriberLevel = 0
    
        for(var i = 0; i < DiscordIDs.length; i++)
        {
            for(var j = 0; j < CarboniteIDs.length; j++)
            {
                if(DiscordIDs[i] == CarboniteIDs[j])
                {
                    for(var k = 0; k < DiscordIDsFromDatabase.length; k++)
                    {
                        if(DiscordIDsFromDatabase[k][0] != undefined && DiscordIDs[i] == DiscordIDsFromDatabase[k][0].replace("<@","").replace(">","").replace(" ",""))
                        {
                            SubscriberLevel = SubscriberLevel + 1
                            k = DiscordIDsFromDatabase.length
                        }
                    }
                    j = CarboniteIDs.length
                }
            }
        }

        for(var i = 0; i < DiscordIDs.length; i++)
        {
            for(var j = 0; j < InitiateIDs.length; j++)
            {
                if(DiscordIDs[i] == InitiateIDs[j])
                {
                    for(var k = 0; k < DiscordIDsFromDatabase.length; k++)
                    {
                        if(DiscordIDsFromDatabase[k][0] != undefined && DiscordIDs[i] == DiscordIDsFromDatabase[k][0].replace("<@","").replace(">","").replace(" ",""))
                        {
                            SubscriberLevel = SubscriberLevel + 3
                            k = DiscordIDsFromDatabase.length
                        }
                    }
                    j = InitiateIDs.length
                }
            }
        }
        return SubscriberLevel;
    }

    return (await authorize(content, listMajors));
}

function UpdateMhanndalorianDatabase(message, AllGuildData, GuildFoundRow, command)
{
    if(message.channel.type == 'dm')
        {
            message.channel.send("This command can not be run in a direct message. Please run the command on a server.")
            return 0;
        }


        if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][8], AllGuildData[GuildFoundRow][6]))
        {
            message.channel.send("Officer role and/or user role not set.  An officer must set these values using the commands " + AllGuildData[GuildFoundRow][7] + "setuserrole and "
            + AllGuildData[GuildFoundRow][7] + "setofficerrole before using this command.")
            return 0;
        }

        if(message.member.roles.cache.has(AllGuildData[GuildFoundRow][8]))
        {
            var allyCode = String(message.content.slice(3,12));
            var officer;

            console.log(message.member.displayName + " issued echo base register command. QZ")

            if(message.content.includes("@"))
            {
                if(DetermineIfOwnerOrOfficer(AllGuildData[GuildFoundRow][5], AllGuildData[GuildFoundRow][6], message))
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

            var user = client.users.cache.get(discordID)

            if(officer == false) //A non officer attempted to execute an officer command
            { 
                const Embed = new Discord.MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('Error - Mhanndalorian Bot')
                    .setDescription('You do not have permission to execute this command.');
                message.channel.send(Embed)
                console.log(message.member.displayName + " Attempted to use officer Echo Base register command. QZ")
            }

            else if(user == undefined){ //Discord user doesn't exist
                const Embed = new Discord.MessageEmbed()
                    .setColor('#ff0000')
                    .setTitle('Error - Mhanndalorian Bot')
                    .setDescription('Could not find Discord User.');
                message.channel.send(Embed)
            }

            else //Discord user was found on server
            {
                //*********REGISTER FOR HOT BOT**************//
                if(message.guild.id == 505515654833504266 && command == 'register')
                {        
                    (async () => {
                        const guild = client.guilds.cache.get("505515654833504266");
                        const BaseURL = "https://www.hotutils.app/HotStaging/swgoh/register"
                    
                        var User;
                        var GuildMember;

                        var DiscordDiscriminator;
                        var DiscordName;
                        var Color;
                        var Title;

                        User =  await client.users.fetch(discordID);
                        GuildMember =  await guild.members.fetch(User);

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

                        const Embed = new Discord.MessageEmbed()
                            .setColor(Color)
                            .setTitle(Title)
                            .setDescription(JSONResponse.ResponseMessage);
                        message.channel.send(Embed) 
                    })()
                }

                //**************BELOW IS TO REGISTER FOR MHANN BOT***************

                discordIDArray = new Array(1)
                discordIDArray[0] = new Array(1)
                discordIDArray[0][0]= "<@" + discordID + "> "

                var allyCodeFound = false;

                //var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
                authorize(content, listMajors);

                function listMajors(auth) {
                    const sheets = google.sheets({version: 'v4', auth});
                    sheets.spreadsheets.values.get({
                        spreadsheetId: AllGuildData[GuildFoundRow][3],
                        range: 'Guild Members & Data!A66:G119',
                    }, (err, res) => {
                        if (err) return console.log('The API returned an error: ' + err);
                    const rows = res.data.values;
                    var DiscordIDDuplicate = false

                    if(CheckIfBlankOrUndefined(rows))
                    {
                        message.channel.send("No data in database yet.")
                        return 0;
                    }

                    if (rows.length)
                    {
                        if(command == 'register')
                        {
                            var count = 0//number of times Discord ID appears in database

                            for(var i = 0; i < rows.length; i++)
                            {
                                if(rows[i][6] != undefined && rows[i][6].match(/\d+/g) - discordIDArray[0][0].match(/\d+/g) == 0) //Weird way to see if rows[i][6] = discordIDArray[0][0]
                                    count = count + 1
                            }
                                if(count >= 2)
                                {
                                    const Embed = new Discord.MessageEmbed()
                                        .setColor('#ff0000')
                                        .setTitle('Error - Mhanndalorian Bot')
                                        .setDescription('The discord ID is already registered in the Mhanndalorian database to two allycodes.');

                                    message.channel.send(Embed)
                                    DiscordIDDuplicate = true
                                }

                            if(DiscordIDDuplicate == false)
                            {
                                var i = 0
                                var description
                                for(var i = 0; i < rows.length; i++)
                                {
                                    if(rows[i][0] == allyCode) //ally code found and set discord ID
                                    {
                                        if(rows[i][6] == discordIDArray[0][0]) //ally code and discord ID pair already in database
                                        {
                                            const Embed = new Discord.MessageEmbed()
                                                .setColor('#ff0000')
                                                .setTitle('Error - Mhanndalorian Bot')
                                                .setDescription('The discord ID is already registered in the Mhanndalorian database to allycode ' + allyCode + ".");
                                            message.channel.send(Embed)
                                            return 0;
                                        }
                                        
                                        allyCodeFound = true;
                                        sheets.spreadsheets.values.update({
                                            spreadsheetId: AllGuildData[GuildFoundRow][3],
                                            range: 'Guild Members & Data!G' + (i+66),
                                            valueInputOption: 'USER_ENTERED',
                                            resource: {
                                                values: discordIDArray
                                            },
                                        })
                                        if(count == 0)
                                            description = "Discord ID successfully added to Mhanndalorian database for Allycode " + allyCode + ".  This Discord ID is registered to one " +
                                                        "allycode and can be registered to one more."

                                        if(count == 1)
                                            description = "Discord ID successfully added to Mhanndalorian database for Allycode " + allyCode + ".  This Discord ID is now registered to two " +
                                                        "allycodes and can not be registered to any more."
                                        
                                        const Embed2 = new Discord.MessageEmbed()
                                            .setColor('#00ff00')
                                            .setTitle('Success - Mhanndalorian Bot')
                                            .setDescription(description);
                                        message.channel.send(Embed2)
                                    }
                                };
                            }

                            if(allyCodeFound == false && DiscordIDDuplicate == false)
                            {
                                var Description = "Ally code " + allyCode +" was not found in Mhanndalorian database.";

                            // message.channel.send("Ally code " + allyCode +" was not found in Mhanndalorian database")
                                const sheets = google.sheets({version: 'v4', auth});
                                sheets.spreadsheets.values.get({
                                    spreadsheetId: AllGuildData[GuildFoundRow][3],
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
                                        
                                        const Embed3 = new Discord.MessageEmbed()
                                            .setColor('#ffff00')
                                            .setTitle('Info - Mhanndalorian Bot')
                                            .setDescription(Description);
                                        message.channel.send(Embed3)

                                    //  message.channel.send("Allycode and Discord ID have have been stored in a temporary location in Mhanndalorian database.")
                                        sheets.spreadsheets.values.update({
                                            spreadsheetId: AllGuildData[GuildFoundRow][3],
                                            range: 'Guild Members & Data!A' + (i+57) + ':C' + (i+57),
                                            valueInputOption: 'USER_ENTERED',
                                            resource: {
                                                values: [[allyCode, "<@" + discordID + "> ", localdate]]
                                            },
                                        })
                                    }
                                    else{
                                        Description = Description + " Allycode and Discord ID could not be stored in a temporary location in Mhanndalorian database.  Temporary location is full."

                                        const Embed4 = new Discord.MessageEmbed()
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
                        }
                        else if (command == 'unregister')
                        {
                            for(var i = 0; i < rows.length; i++)
                            {
                                if(rows[i][6] != undefined && discordID == rows[i][6].replace("<@","").replace(">","").replace(" ",""))
                                {
                                    sheets.spreadsheets.values.update({
                                        spreadsheetId: AllGuildData[GuildFoundRow][3],
                                        range: 'Guild Members & Data!G' + (i+66),
                                        valueInputOption: 'USER_ENTERED',
                                        resource: {
                                            values: [['']]
                                        },
                                    })

                                    const Embed = new Discord.MessageEmbed()
                                        .setColor('#00ff00')
                                        .setTitle('Success - Mhanndalorian Bot')
                                        .setDescription('Discord ID successfully removed from Mhanndalorian database for Allycode ' + allyCode + '.')
                                    message.channel.send(Embed)

                                    return 0;
                                }
                            }
                            const Embed = new Discord.MessageEmbed()
                                .setColor('#ff0000')
                                .setTitle('Error - Mhanndalorian Bot')
                                .setDescription('Discord ID could not be found in Mhanndalorian database.');
                            message.channel.send(Embed)
                                                        
                        }
                    }else {
                        console.log('No data found.');
                    }
                    });
                }                
            }
        }
        else
            message.channel.send("You must be assigned the " + message.guild.roles.cache.get(AllGuildData[GuildFoundRow][8]).name + " role to execute this command.")
}

async function GuildSearch(GuildID)
{
    if(AllGuildData == undefined)
    {
        console.log("AllGuildData had to be set in GuildSearch function")
        AllGuildData = await authorize(content, GetSheetDataAsync)
        
        async function authorize(credentials, callback) {
            const {client_secret, client_id, redirect_uris} = credentials.installed;
            const oAuth2Client = new google.auth.OAuth2(
                client_id, client_secret, redirect_uris[0]);
              token =  {"access_token":"ya29.a0Adw1xeVMaJdFu4_Prd1JMj5VW6JLzPAux780mPR-FKiDT2XNCJ1xdywo5Q2mOCgj6PXzQEkrJJ68TymBCLF1NGIxJdwd6r6F-pDXqk8th8dc6bd_v711TCJpxdbEBSmXktCMFwb241KyLv1rJDvox_15WH4LLpNU9x8","refresh_token":"1//0dpVeaJ3ELcQBCgYIARAAGA0SNwF-L9IrUePhHzcm67KPL99LpKuThsJVLerdoAtDw5zTBbWhaxR0PobydX1sUCmVx8TdYXXpewA","scope":"https://www.googleapis.com/auth/spreadsheets","token_type":"Bearer","expiry_date":1583977474403}
              oAuth2Client.setCredentials(token);
              return await callback(oAuth2Client);
        }

        async function GetSheetDataAsync(auth)
        {
            const sheets = google.sheets({version: 'v4', auth})
            var request = {
                spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                range: 'Guilds!A2:K30',
            }

            return new Promise(function(resolve,reject) {
                sheets.spreadsheets.values.get(request, function(err, res){
                    if (err !== null) reject(err);
                    else
                    {
                        AllGuildData = res.data.values
                        resolve(res.data.values);
                    }
                });

            });
        }
    }
    for(var i = 0; i < AllGuildData.length; i++)
    {
        if(AllGuildData[i][1] == GuildID)
        {
            return i
        }
    }
    return -1
}

function DetermineIfOwnerOrOfficer(GuildOwnerID, OfficerRoleID, message)
{
    if(GuildOwnerID == message.author.id)
        return true;
    
    else if(OfficerRoleID != undefined)
        if(message.member.roles.cache.has(OfficerRoleID))
            return true;

    return false;
}

function DetermineIfGuildMemberOrOfficer(UserRoleID, OfficerRoleID, message)
{  
    if(UserRoleID != undefined)
        if(message.member.roles.cache.has(UserRoleID))
            return true;

    if(OfficerRoleID != undefined)
        if(message.member.roles.cache.has(OfficerRoleID))
            return true;

    return false;
}

function CheckIfBlankOrUndefined()
{
    for (var i = 0; i < arguments.length; i++)
    {
        if(arguments[i] == undefined || arguments[i] == "")
            return true
    }
    return false
}


function GP(message, DiscordIDParam, DaysBack, AllGuildData, GuildFoundRow, AltFound)
{
    if(message.author != undefined)
        console.log(message.author.username + " executed GP command. QZ")

    //content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
    authorize(content, listMajors);

    async function listMajors(auth)
    {  
        const sheets = google.sheets({version: 'v4', auth});
        const DiscordID = DiscordIDParam;

        sheets.spreadsheets.values.get({
            spreadsheetId: AllGuildData[GuildFoundRow][3],
            range: 'Guild Members & Data!A66:G119',
        }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const rows = res.data.values;
                var Continue = false
                var RunOnce = true

                var Name = ''

                if(CheckIfBlankOrUndefined(rows))
                {
                    message.channel.send("No data in database yet.")
                    return 0;
                }

                if(DiscordIDParam != 'guildGP')
                {
                    for(var i = 0; i < rows.length; i++) //Match discord ID of author to SWGOH Ally code
                    {
                        if(rows[i][6] != undefined && DiscordID == rows[i][6].replace("<@","").replace(">","").replace(" ",""))// ALT WORK HERE....search by allycode???????
                        {
                            if(AltFound == true && RunOnce == true)
                            {
                                RunOnce = false
                            }

                            else
                            {
                                Allycode = rows[i][0];
                                Name = rows[i][1];
                                i = rows.length
                                Continue = true
                            }
                        }
                    }
                }
                else
                {
                    Allycode = 999
                    Name = AllGuildData[GuildFoundRow][0]
                    Continue = true
                }

                if(Continue == true)
                {
                    Continue = false

                    sheets.spreadsheets.values.get({
                        spreadsheetId: AllGuildData[GuildFoundRow][3],
                        range: 'TotalGP!1:1',
                    }, (err, res) => {
                            if (err) return console.log('The API returned an error: ' + err);
                            const rows = res.data.values;

                            if(CheckIfBlankOrUndefined(rows))
                            {
                                message.channel.send("There is no galactic power data stored in the database.  The database is updated daily.")
                                return 0;
                            }

                            for(var i = 0; i < rows[0].length; i++) //Match Allycode to column letter
                            {
                                if(Allycode == rows[0][i])
                                {
                                    var ColumnNumber = i + 1
                                    var ColumnName = toColumnName(ColumnNumber)
                                    i = rows[0].length
                                    Continue = true
                                }
                            }

                            if(Continue == true)
                            {
                                sheets.spreadsheets.values.get({
                                    spreadsheetId: AllGuildData[GuildFoundRow][3],
                                    range: 'TotalGP!' + ColumnName + '2:' + ColumnName,
                                }, (err, res) => {
                                        if (err) return console.log('The API returned an error: ' + err);
                                        const RawGP = res.data.values;

                                        if(RawGP != undefined)
                                        {
                                            sheets.spreadsheets.values.get({
                                                spreadsheetId: AllGuildData[GuildFoundRow][3],
                                                range: 'TotalGP!A2:A',
                                            }, (err, res) => {
                                                    if (err) return console.log('The API returned an error: ' + err);
                                                    const RawDates = res.data.values;
                                                    
                                                    var GP = []
                                                    var Dates = []

                                                    var k = 0

                                                    for(var i = 0; i < RawDates.length; i++) //Only use dates that have data
                                                    {
                                                        if(!isNaN(RawGP[i][0]))
                                                        {
                                                            GP[k] = RawGP[i][0]/1000000
                                                            Dates[k] = RawDates[i]
                                                            k++
                                                        }
                                                    }

                                                    if(DaysBack != undefined)
                                                    {
                                                        Dates.splice(0, Dates.length-DaysBack)
                                                        GP.splice(0, GP.length-DaysBack)

                                                        if(DaysBack > Dates.length)
                                                        {
                                                            if(message != 'GuildWeekly')
                                                                message.channel.send("You requested the most recent " + DaysBack + " day(s) of data, but only " + Dates.length + " day(s) of data exist.  Displaying all available data.")
                                                        }
                                                    }

                                                    (async () => {
                                                        var CommandArray = message.content.split(' ');
                                                        var TrialCheck = true
                                            
                                                        if(message == 'GuildWeekly' || CheckMemberPatreonStatus(message.author.id) >= 1 || (CommandArray[1] != undefined && CommandArray[1].toLowerCase() == 'guild'))
                                                            TrialCheck = false

                                                        if(TrialCheck)
                                                        {
                                                            var TrialStatus = await GetMemberTrialStatus(AllGuildData, GuildFoundRow, message, true)
                                                            message.channel.send("Since you are not a Patreon you may issue this command " + (TrialStatus - 1) + " more times(s).  To use this command unrestricted, please become a Patron.")
                                                        }

                                                        const width = 800
                                                        const height = 600

                                                        const chartCallback = (ChartJS) => {
                                                            ChartJS.plugins.register({
                                                                beforeDraw: (chartInstance) => {
                                                                    const { ctx } = chartInstance.chart
                                                                    ctx.fillStyle = 'white'
                                                                    ctx.fillRect(0,0, chartInstance.chart.width, chartInstance.chart.height)
                                                                }
                                                            })
                                                        }

                                                        const chartJSNodeCanvas = new ChartJSNodeCanvas({width, height, chartCallback});

                                                        const configuration = {
                                                            type: 'line',
                                                            data: {
                                                                labels: Dates,
                                                                datasets: [
                                                                    {
                                                                        label: 'Small',
                                                                        data: GP,
                                                                        backgroundColor: '#7289d9',
                                                                        borderColor: '#000000',
                                                                        fill: 'no',
                                                                        borderWidth: '3',
                                                                        pointBorderWidth: '1',
                                                                        lineTension: '0',
                                                                    }
                                                                ]
                                                            },

                                                            options: {
                                                                elements: {
                                                                    point:{
                                                                        radius: 0
                                                                    }
                                                                },
                                                                title: {
                                                                    display: true,
                                                                    text: 'Graph of galactic power for ' + Name,
                                                                    fontSize: 28,
                                                                    fontColor: '#000000'
                                                                },
                                                                legend: {
                                                                    display: false,
                                                                },
                                                                scales: {
                                                                    yAxes: [{
                                                                        scaleLabel: {
                                                                            display: true,
                                                                            labelString: 'Galactic Power (in Millions)',
                                                                            fontSize: 24,
                                                                            fontColor: '#000000'
                                                                        },
                                                                        ticks: {
                                                                            fontSize: 24,
                                                                            fontColor: '#000000'
                                                                        }
                                                                    }],
                                                                    xAxes: [{
                                                                        scaleLabel: {
                                                                            display: true,
                                                                            labelString: 'Date',
                                                                            fontSize: 24,
                                                                            fontColor: '#000000'
                                                                        },
                                                                        ticks: {
                                                                            fontSize: 24,
                                                                            fontColor: '#000000'
                                                                        }
                                                                    }]
                                                                }
                                                            }
                                                        }

                                                        const image = await chartJSNodeCanvas.renderToBuffer(configuration)
                                                        const attachment = new MessageAttachment(image)

                                                        if(message != 'GuildWeekly')
                                                            message.channel.send(attachment)
                                                        else
                                                        {
                                                            if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][9], AllGuildData[GuildFoundRow][8]))
                                                            {
                                                                client.users.cache.get(AllGuildData[GuildFoundRow][5]).send("Weekly Guild GP update failed to run.  Standard user role and/or user announcement channel not set.  "
                                                                + "Please run " + AllGuildData[GuildFoundRow][7] + "setuserrole and/or " + AllGuildData[GuildFoundRow][7] + "setuserchannel. ")
                                                                return 0;
                                                            }
                                                            client.channels.cache.get(AllGuildData[GuildFoundRow][9]).send(attachment)
                                                        }
                                                    })()

                                                    var IncreaseorDecrease;
                                                    if(GP[GP.length-1] >= GP[0])
                                                        IncreaseorDecrease = "increased"
                                                    else    
                                                        IncreaseorDecrease = "decreased"

                                                    var PercentChange = Math.abs(Math.round((((GP[GP.length-1])-GP[0])/GP[0])*10000) / 100)
                                                    
                                                    if(message != 'GuildWeekly')                                                    
                                                        message.channel.send("From " + Dates[0] + " to " + Dates[Dates.length-1] + " " + Name + "'s GP has " + IncreaseorDecrease +
                                                        " by " + PercentChange + "%.")
                                                    
                                                    else
                                                    {
                                                        if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][9], AllGuildData[GuildFoundRow][8]))
                                                            return 0;

                                                        else
                                                        {
                                                            var TwoDaysAgo = new Date();
                                                            TwoDaysAgo.setDate(TwoDaysAgo.getDate() - 2);
                                                            client.channels.cache.get(AllGuildData[GuildFoundRow][9]).send("<@&" + AllGuildData[GuildFoundRow][8] + "> Weekly Galactic Power Update for week of " + TwoDaysAgo.toLocaleDateString("en-US") + "." +
                                                            "  The graph below will eventually contain data for the previous 90 days.\n\n From " +
                                                            Dates[0] + " to " + Dates[Dates.length-1] + " " + Name + "'s GP has " + IncreaseorDecrease + " by " + PercentChange + "%.")
                                                        }
                                                    }
                                                }
                                            )
                                        }
                                        else
                                            if(message != 'GuildWeekly')
                                                message.channel.send("No GP data returned for user")
                                    }
                                )
                            }
                            else
                                if(message != 'GuildWeekly')
                                    message.channel.send("Allycode not found within the GP data in the Mhanndalorian database")
                        }
                    )
                }
                else
                    if(message != 'GuildWeekly')
                        message.channel.send("Discord user ID not found in Mhanndalorian database")
            }
        )
    }
}

function Lookup(message, CallingFunction, AllGuildData, GuildFoundRow)
{
    //var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
    

    if(CallingFunction == 'lookup')
        console.log(message.author.username + " issued lookup command. QZ")

    if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][8]))
    {
        message.channel.send("User role not set.  An officer must set this value using the command " + AllGuildData[GuildFoundRow][7] + "setuserrole before using this command.")
        return 0;
    }

    authorize(content, listMajors)
    
    function listMajors(auth)
    {
        const guild = client.guilds.cache.get(AllGuildData[GuildFoundRow][1]);
        
        const sheets = google.sheets({version: 'v4', auth});
        sheets.spreadsheets.values.get({
            spreadsheetId: AllGuildData[GuildFoundRow][3],
            range: 'Guild Members & Data!A66:G119',
        }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
        const rows = res.data.values;

        if(CheckIfBlankOrUndefined(rows))
        {
            message.channel.send("No data in database yet.")
            return 0;
        }
        
        if (rows.length)
        {
            CommandArray = message.content.split(/ (.+)/)

            if(CommandArray[1] == undefined && CallingFunction != 'gpcompare')
            {
                message.channel.send("Please specify an allycode, discord name, or SWGOH name")
            }
            else
            {
                var RowFound;
                var DiscordSWGOHNameIDArray;
                var Found = false;
                var DaysBack;
                var AltFound = false;
                var AltRowFound;

                if(CommandArray[1].match(/[\s](\d+)($)/) && CallingFunction != 'gpcompare')
                {
                    temp = message.content.split(/[\s](\d+)($)/)
                    DaysBack = temp[1]

                    temp2 = temp[0].split(/ (.+)/)
                    CommandArray[1] = temp2[1]

                    if(DaysBack <= 0)
                    {
                        message.channel.send("Please specify a number of days greater than 0.")
                        return 0;
                    }
                }

                if(CallingFunction == 'gpcompare')
                {
                    var CommandArray = message.content.split(' ');
                }
                
                (async () => { 
                    await guild.members.fetch()                    
                })()

                DiscordSWGOHNameIDArray  = guild.roles.cache.get(AllGuildData[GuildFoundRow][8]).members.map(m => [m.id, m.displayName])

                for(var i = 0; i < DiscordSWGOHNameIDArray.length; i++)  //no longer used
                {
                    DiscordSWGOHNameIDArray[i][1] = DiscordSWGOHNameIDArray[i][1].replace(/([\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD10-\uDDFF])/g, '')
                }

                for(var i = 0; i < rows.length; i++)
                {
                    for(var j = 0; j < DiscordSWGOHNameIDArray.length; j++)
                    {
                        if(rows[i][6] != undefined && rows[i][6].match(/\d+/g) == DiscordSWGOHNameIDArray[j][0])
                        {
                            DiscordSWGOHNameIDArray[j].push(rows[i][0])
                            DiscordSWGOHNameIDArray[j].push(rows[i][1])
                            j = DiscordSWGOHNameIDArray.length
                        }
                    }
                }


                for(var j = DiscordSWGOHNameIDArray.length - 1; j >= 0; j--) //remove array entries that did not have all the data (not found in Mhann database)
                {
                    if(DiscordSWGOHNameIDArray[j][2] == undefined || DiscordSWGOHNameIDArray[j][3] == undefined)
                    {
                        DiscordSWGOHNameIDArray.splice(j,1)
                    }
                }

                if(CallingFunction != 'gpcompare')
                {
                    for(var i = 0; i < DiscordSWGOHNameIDArray.length; i++)
                    {
                        if(DiscordSWGOHNameIDArray[i][1].toLowerCase().includes(CommandArray[1].toLowerCase()) || DiscordSWGOHNameIDArray[i][2].includes(CommandArray[1]) || DiscordSWGOHNameIDArray[i][3].toLowerCase().includes(CommandArray[1].toLowerCase()))
                        {
                            RowFound = i;
                            i = DiscordSWGOHNameIDArray.length
                            Found = true
                        }

                        if(Found == false && !CheckIfBlankOrUndefined(DiscordSWGOHNameIDArray[i][4], DiscordSWGOHNameIDArray[i][5]))
                        {
                            if(DiscordSWGOHNameIDArray[i][4].includes(CommandArray[1]) || DiscordSWGOHNameIDArray[i][5].toLowerCase().includes(CommandArray[1].toLowerCase()))
                            {
                                AltRowFound = i;
                                i = DiscordSWGOHNameIDArray.length
                                AltFound = true
                            }
                        }
                    }
                }

                else  //what to do when gpcompare is called
                {
                    var NumberofNames = 0

                    if(CommandArray.length == 3)
                        NumberofNames = 2

                    else if(CommandArray.length == 4)
                    {
                        if(isNaN(CommandArray[3]))
                            NumberofNames = 3
                        else if(!isNaN(CommandArray[3]) && CommandArray[3] > 9999999)
                            NumberofNames = 3
                        else
                        {
                            NumberofNames = 2
                            DaysBack = CommandArray[3]
                        }
                    }
                    else if(CommandArray.length == 5)
                    {
                        NumberofNames = 3
                        DaysBack = CommandArray[4]
                    }

                    var GPCompareData = new Array(NumberofNames);

                    for (var i = 0; i < GPCompareData.length; i++)
                        GPCompareData[i] = new Array(3);

                    for(var j = 1; j <= NumberofNames; j++)
                    {
                        Found = false
                        for(var i = 0; i < DiscordSWGOHNameIDArray.length; i++)
                        {
                            if(DiscordSWGOHNameIDArray[i].length == 6)
                            {
                                DiscordSWGOHNameIDArray[i][1] = ""
                            }

                            if(DiscordSWGOHNameIDArray[i][1].toLowerCase().includes(CommandArray[j].toLowerCase()) || DiscordSWGOHNameIDArray[i][2].includes(CommandArray[j]) || DiscordSWGOHNameIDArray[i][3].toLowerCase().includes(CommandArray[j].toLowerCase()))
                            {
                                GPCompareData[j-1][0] = DiscordSWGOHNameIDArray[i][2]
                                GPCompareData[j-1][1] = DiscordSWGOHNameIDArray[i][0]
                                GPCompareData[j-1][2] = DiscordSWGOHNameIDArray[i][3]
                                i = DiscordSWGOHNameIDArray.length
                                Found = true
                            }

                            if(Found == false && !CheckIfBlankOrUndefined(DiscordSWGOHNameIDArray[i][4], DiscordSWGOHNameIDArray[i][5]))
                            {
                                if(DiscordSWGOHNameIDArray[i][4].includes(CommandArray[j]) || DiscordSWGOHNameIDArray[i][5].toLowerCase().includes(CommandArray[j].toLowerCase()))
                                {
                                    GPCompareData[j-1][0] = DiscordSWGOHNameIDArray[i][4]
                                    GPCompareData[j-1][1] = DiscordSWGOHNameIDArray[i][0]
                                    GPCompareData[j-1][2] = DiscordSWGOHNameIDArray[i][5]
                                    i = DiscordSWGOHNameIDArray.length
                                    AltFound = true
                                }
                            }
                        }
                    }                
                    
                    for(var i = 0; i < GPCompareData.length; i++)
                        if(GPCompareData[i][0] == undefined && GPCompareData[i][1] == undefined)
                        {
                            message.channel.send("Could not find user: " + CommandArray[i+1])
                            return 0;
                        }
                        
                }

                if(Found == true || AltFound == true)
                {
                    if(CallingFunction == 'lookup')
                    {
                        if(Found == true)
                            message.channel.send
                                ("__**Ally Code:**__  " + DiscordSWGOHNameIDArray[RowFound][2] + "\n"
                                + "__**SWGOH Name:**__  " + DiscordSWGOHNameIDArray[RowFound][3] + "\n"
                                + "__**Discord Name:**__  <@" + DiscordSWGOHNameIDArray[RowFound][0] + ">")

                        else if(AltFound == true)
                            message.channel.send
                                ("**This is an alt in the system** \n"
                                + "__**Ally Code:**__  " + DiscordSWGOHNameIDArray[AltRowFound][4] + "\n"
                                + "__**SWGOH Name:**__  " + DiscordSWGOHNameIDArray[AltRowFound][5] + "\n"
                                + "__**Discord Name:**__  <@" + DiscordSWGOHNameIDArray[AltRowFound][0] + ">")
                    }
                    else if(CallingFunction == 'GP')
                    {
                        if(Found == true)
                            GP(message, DiscordSWGOHNameIDArray[RowFound][0], DaysBack, AllGuildData, GuildFoundRow, false)

                        if(AltFound == true)
                            GP(message, DiscordSWGOHNameIDArray[AltRowFound][0], DaysBack, AllGuildData, GuildFoundRow, true)
                    }

                    else if(CallingFunction == 'gpcompare')
                    {
                        GPCompare(message, GPCompareData, DaysBack, AllGuildData, GuildFoundRow)
                    }
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

function GPCompare(message, GPCompareData, DaysBack, AllGuildData, GuildFoundRow)
{
    var AllyCodes = []
    var Names = []

    for(var i = 0; i < GPCompareData.length; i++)
    {
        AllyCodes.push(GPCompareData[i][0])
    }

    authorize(content, listMajors);
    function listMajors(auth)
    {  
        const sheets = google.sheets({version: 'v4', auth});

        sheets.spreadsheets.values.get({
            spreadsheetId: AllGuildData[GuildFoundRow][3],
            range: 'TotalGP!1:1',
        }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const rows = res.data.values;

                if(CheckIfBlankOrUndefined(rows))
                {
                    message.channel.send("No data in database yet.")
                    return 0;
                }

                var GPAllRaw = []
                var GPAll = []
                var GraphData = false

                for(var j = 0; j < GPCompareData.length; j++)
                {
                    (async () => {     
                        function GetSheetDataAsync1()
                        {
                            return new Promise(function(resolve,reject){
                                sheets.spreadsheets.values.get({
                                spreadsheetId: AllGuildData[GuildFoundRow][3],
                                range: 'TotalGP!' + ColumnName + '1:' + ColumnName,
                            }, function(err, res) {
                                    if (err !== null) reject(err);
                                    else
                                        resolve(res.data.values);
                                });
                            });
                        }
                        
                        for(var i = 0; i < rows[0].length; i++) //Match Allycode to column letter
                        {
                            if(AllyCodes[j] == rows[0][i])
                            {
                                var ColumnNumber = i + 1
                                var ColumnName = toColumnName(ColumnNumber)
                                i = rows[0].length
                                Continue = true
                            }
                        }

                        if(Continue == true)
                        {               
                                               
                            var RawGPWithCode = await GetSheetDataAsync1()
                            var AllyCode = RawGPWithCode[0]
                            var RawGP = RawGPWithCode.splice(1, RawGPWithCode.length)

                            if(RawGP != undefined)
                            {
                                sheets.spreadsheets.values.get({
                                    spreadsheetId: AllGuildData[GuildFoundRow][3],
                                    range: 'TotalGP!A2:A',
                                }, (err, res) => {
                                        if (err) return console.log('The API returned an error: ' + err);
                                        const RawDates = res.data.values;
                                        
                                        var GP = []
                                        var Dates = []

                                        var k = 0

                                        var SetMinDate = true 

                                        for(var i = 0; i < GPCompareData.length; i++)//Funky way to make sure the correct name matches the correct data set.  It could vary depending on a race condition.
                                        {//Name array is set as data is processed...the order data is processed can be random.
                                            if(GPCompareData[i][0] == AllyCode)
                                            Names.push(GPCompareData[i][2])
                                        }

                                        for(var i = 0; i < RawDates.length; i++)
                                        {
                                            GP[k] = RawGP[i][0]/1000000
                                            Dates[k] = RawDates[i]
                                            k++
                                        }

                                        GPAllRaw.push(GP)

                                        var ActualData = []

                                        if(GPCompareData.length == 2)
                                        {
                                            if(GPAllRaw[1] != undefined && GPAllRaw[0] != undefined)
                                            {
                                                GraphData = true
                                                
                                                for(var i = 0; i < GPAllRaw[0].length; i++)
                                                {
                                                    if(!isNaN(GPAllRaw[0][i]) || !isNaN(GPAllRaw[1][i]) && SetMinDate == true)
                                                    {
                                                        GPAll[0] = GPAllRaw[0].splice(i, GPAllRaw[0].length)
                                                        GPAll[1] = GPAllRaw[1].splice(i, GPAllRaw[1].length)
                                                        Dates = Dates.splice(i, Dates.length)
                                                        i = GPAllRaw[0].length
                                                    }
                                                }
                                                
                                                if(DaysBack != undefined)
                                                {
                                                    Dates.splice(0, Dates.length-DaysBack)
                                                    GPAll[0].splice(0, GPAll[0].length-DaysBack)
                                                    GPAll[1].splice(0, GPAll[1].length-DaysBack)
        
                                                    if(DaysBack > Dates.length)
                                                    {
                                                        if(message != 'GuildWeekly')
                                                            message.channel.send("You requested the most recent " + DaysBack + " day(s) of data, but only " + Dates.length + " day(s) of data exist.  Displaying all available data.")
                                                    }
                                                }

                                                ActualData = [{
                                                    label: Names[0],
                                                    data: GPAll[0],
                                                    backgroundColor: '#000000',
                                                    borderColor: '#000000',
                                                    fill: 'no',
                                                    borderWidth: '3',
                                                    pointBorderWidth: '1',
                                                    lineTension: '0',
                                                },

                                                {
                                                    label: Names[1],
                                                    data: GPAll[1],
                                                    backgroundColor: '#FF0000',
                                                    borderColor: '#FF0000',
                                                    fill: 'no',
                                                    borderWidth: '3',
                                                    pointBorderWidth: '1',
                                                    lineTension: '0',
                                                }]
                                            }
                                        }

                                        if(GPCompareData.length == 3)
                                        {
                                            if(GPAllRaw[2] != undefined && GPAllRaw[1] != undefined && GPAllRaw[0] != undefined)
                                            {
                                                GraphData = true
                                                for(var i = 0; i < GPAllRaw[0].length; i++)
                                                {
                                                    if(!isNaN(GPAllRaw[0][i]) || !isNaN(GPAllRaw[1][i]) && SetMinDate == true)
                                                    {
                                                        GPAll[0] = GPAllRaw[0].splice(i, GPAllRaw[0].length)
                                                        GPAll[1] = GPAllRaw[1].splice(i, GPAllRaw[1].length)
                                                        GPAll[2] = GPAllRaw[2].splice(i, GPAllRaw[2].length)
                                                        Dates = Dates.splice(i, Dates.length)
                                                        i = GPAllRaw[0].length
                                                    }
                                                }

                                                if(DaysBack != undefined)
                                                {
                                                    Dates.splice(0, Dates.length-DaysBack)
                                                    GPAll[0].splice(0, GPAll[0].length-DaysBack)
                                                    GPAll[1].splice(0, GPAll[1].length-DaysBack)
                                                    GPAll[2].splice(0, GPAll[2].length-DaysBack)
        
                                                    if(DaysBack > Dates.length)
                                                    {
                                                        if(message != 'GuildWeekly')
                                                            message.channel.send("You requested the most recent " + DaysBack + " day(s) of data, but only " + Dates.length + " day(s) of data exist.  Displaying all available data.")
                                                    }
                                                }

                                                ActualData = [{
                                                    label: Names[0],
                                                    data: GPAll[0],
                                                    backgroundColor: '#000000',
                                                    borderColor: '#000000',
                                                    fill: 'no',
                                                    borderWidth: '3',
                                                    pointBorderWidth: '1',
                                                    lineTension: '0',
                                                },

                                                {
                                                    label: Names[1],
                                                    data: GPAll[1],
                                                    backgroundColor: '#FF0000',
                                                    borderColor: '#FF0000',
                                                    fill: 'no',
                                                    borderWidth: '3',
                                                    pointBorderWidth: '1',
                                                    lineTension: '0',
                                                },
                                            
                                                {
                                                    label: Names[2],
                                                    data: GPAll[2],
                                                    backgroundColor: '#39ff33',
                                                    borderColor: '#39ff33',
                                                    fill: 'no',
                                                    borderWidth: '3',
                                                    pointBorderWidth: '1',
                                                    lineTension: '0',
                                                }]
                                            }
                                        }

                                        if(GraphData)
                                        {
                                            (async () => {

                                                const width = 800
                                                const height = 600

                                                const chartCallback = (ChartJS) => {
                                                    ChartJS.plugins.register({
                                                        beforeDraw: (chartInstance) => {
                                                            const { ctx } = chartInstance.chart
                                                            ctx.fillStyle = 'white'
                                                            ctx.fillRect(0,0, chartInstance.chart.width, chartInstance.chart.height)
                                                        }
                                                    })
                                                }

                                                const chartJSNodeCanvas = new ChartJSNodeCanvas({width, height, chartCallback});

                                                const configuration = {
                                                    type: 'line',
                                                    data: {
                                                        labels: Dates,
                                                        datasets: ActualData
                                                    },

                                                    options: {
                                                        elements: {
                                                            point:{
                                                                radius: 0
                                                            }
                                                        },
                                                        title: {
                                                            display: true,
                                                            text: 'Galactic Power Comparison',
                                                            fontSize: 28,
                                                            fontColor: '#000000'
                                                        },
                                                        legend: {
                                                            display: true,
                                                            labels: {
                                                                fontSize: 20,
                                                            },
                                                        },
                                                        scales: {
                                                            yAxes: [{
                                                                scaleLabel: {
                                                                    display: true,
                                                                    labelString: 'Galactic Power (in Millions)',
                                                                    fontSize: 24,
                                                                    fontColor: '#000000'
                                                                },
                                                                ticks: {
                                                                    fontSize: 24,
                                                                    fontColor: '#000000'
                                                                }
                                                            }],
                                                            xAxes: [{
                                                                scaleLabel: {
                                                                    display: true,
                                                                    labelString: 'Date',
                                                                    fontSize: 24,
                                                                    fontColor: '#000000'
                                                                },
                                                                ticks: {
                                                                    fontSize: 24,
                                                                    fontColor: '#000000'
                                                                }
                                                            }]
                                                        }
                                                    }
                                                }

                                                const image = await chartJSNodeCanvas.renderToBuffer(configuration)
                                                const attachment = new MessageAttachment(image)

                                                message.channel.send(attachment)
                                            })()
                                                                                        
                                          //  message.channel.send("From " + Dates[0] + " to " + Dates[Dates.length-1] + " " + Name + "'s GP has " + IncreaseorDecrease +
                                          //  " by " + PercentChange + "%.")
                                        }
                                    }
                                )
                            }
                            else
                                message.channel.send("No GP data returned for user")

                        }
                        else
                            if(message != 'GuildWeekly')
                                message.channel.send("Allycode not found within the GP data in the Mhanndalorian database")

                    })()
                }
            }
        )
    }



    
}

function toColumnName(num) {
    for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
      ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
    }
    return ret;
}

async function PostWeeklyGuildGP(){
    for(var i = 0; i < AllGuildData.length; i++)
    {
        if(AllGuildData[i][1] != '814625223906689044')//Skip Mhanndalorian Bot server
        { 
            if(await GetSubscribers(AllGuildData, i) >= 1)
                GP('GuildWeekly', 'guildGP', 90, AllGuildData, i)
            else
            {
                if(!CheckIfBlankOrUndefined(AllGuildData[i][9], AllGuildData[i][8]))
                    client.channels.cache.get(AllGuildData[i][9]).send("<@&" + AllGuildData[i][8] + ">" + " Weekly Guild Galactic Power report failed to complete.  You must have at least one Patreon subscriber "
                    +"that is registered in the Mhanndalorian database to utilize this feature.  Subscribe to Mhanndalorian Bot at <https://www.patreon.com/MhannUhdea>  Guild ID: " + AllGuildData[i][1])
            }
        }
    }
}

function UpdateTotalGP() {
    //var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
    authorize(content, listMajors);

    async function listMajors(auth)
    {
        for(var k = 0; k < AllGuildData.length; k++)
        {
            if(AllGuildData[k][1] != '814625223906689044') //Skip check Mhanndalorian Bot Server
            {
                if(!CheckIfBlankOrUndefined(AllGuildData[k][2],  AllGuildData[k][3]))
                { 
                    if(true)  //used to check for subscribers using await GetSubscribers(AllGuildData, k) >= 1
                    {           
                        const BaseURL = AllGuildData[k][2];
                        const SheetID = AllGuildData[k][3];

                        (async () => {
                            var NextAvailableRow;
                            var NextAvailableColumn;

                            var Result = await fetch(BaseURL,
                                {
                            /*     method: 'GET',
                                }).then(function (response) {
                                    var response2 = response.clone();
                                    response.json().then(function(ParsedJSON) {
                                        console.log(ParsedJSON)
                                    })
                                    return response2.json()
                                })*/
                                    method: 'GET',
                                }).then(function (response) {
                                    //console.log(response)
                                    return response.json()
                                })

                                var AllyCodeAndGP = new Array(Result.players.length);

                                for (var i = 0; i < AllyCodeAndGP.length; i++) { 
                                    AllyCodeAndGP[i] = new Array(3);
                                    AllyCodeAndGP[i][0] = '';
                                    AllyCodeAndGP[i][1] = '';
                                    AllyCodeAndGP[i][2] = 'Y';
                                }

                                for(var i = 0; i < Result.players.length; i++)
                                {
                                    AllyCodeAndGP[i][0] = Result.players[i].data.ally_code
                                    AllyCodeAndGP[i][1] = Result.players[i].data.galactic_power
                                }

                                const sheets = google.sheets({version: 'v4', auth});

                                sheets.spreadsheets.values.get({
                                    spreadsheetId: SheetID,
                                    range: 'TotalGP!A:A',
                                    }, async (err, res) => {
                                        if (err) return console.log('The API returned an error: ' + err);
                                        const rows = res.data.values;

                                        if(rows != undefined)
                                            NextAvailableRow = rows.length + 1
                                        else
                                            NextAvailableRow = 2

                                        var Today = new Date().toLocaleDateString()                            

                                        sheets.spreadsheets.values.update({
                                            spreadsheetId: SheetID,
                                            range: 'TotalGP!A' + NextAvailableRow,  
                                            valueInputOption: 'RAW',
                                            resource: {
                                                values: [[Today]]
                                            },
                                        })

                                        sheets.spreadsheets.values.update({
                                            spreadsheetId: SheetID,
                                            range: 'TotalGP!PP' + NextAvailableRow,  
                                            valueInputOption: 'USER_ENTERED',
                                            resource: {
                                                //values: [["=sum(B" + NextAvailableRow + ":PO" + NextAvailableRow + ")"]]
                                                values: [[Result.data.galactic_power]]
                                            },
                                        })

                                        sheets.spreadsheets.values.get({
                                            spreadsheetId: SheetID,
                                            range: 'TotalGP!B1:PO1',
                                            }, async (err, res) => {
                                                if (err) return console.log('The API returned an error: ' + err);
                                                const rows = res.data.values;

                                                if(rows != undefined)
                                                    NextAvailableColumn = rows[0].length + 2
                                                else
                                                    NextAvailableColumn = 2

                                                var UpdateGPData = [];
                                                var NewGPDataAllyCode = []
                                                var NewGPDataGP = []

                                                if(rows != undefined)
                                                {
                                                    for(var i = 0; i < rows[0].length; i++)
                                                    {
                                                        for(var j = 0; j < AllyCodeAndGP.length; j++)
                                                        {
                                                            //console.log(j)
                                                            //console.log("ID from sheet " + rows[0][i] + "    ID from SWGOH " + AllyCodeAndGP[j][0])
                                                            if(rows[0][i] == AllyCodeAndGP[j][0])
                                                            {
                                                                UpdateGPData[i] = AllyCodeAndGP[j][1]
                                                                AllyCodeAndGP[j][2] = 'N'
                                                                j = AllyCodeAndGP.length;
                                                            }
                                                        }
                                                    }
                                                }

                                                sheets.spreadsheets.values.update({
                                                    spreadsheetId: SheetID,
                                                    range: 'TotalGP!B' + NextAvailableRow,  
                                                    valueInputOption: 'RAW',
                                                    resource: {
                                                        values: [UpdateGPData]
                                                    },
                                                })

                                                for(var i = 0; i < AllyCodeAndGP.length; i++)
                                                    if(AllyCodeAndGP[i][2] == 'Y')
                                                    {
                                                        NewGPDataAllyCode.push(AllyCodeAndGP[i][0])
                                                        NewGPDataGP.push(AllyCodeAndGP[i][1])
                                                    }

                                                sheets.spreadsheets.values.update({
                                                    spreadsheetId: SheetID,
                                                    range: 'TotalGP!' + toColumnName(NextAvailableColumn) + '1',  
                                                    valueInputOption: 'RAW',
                                                    resource: {
                                                        values: [NewGPDataAllyCode]
                                                    },
                                                })

                                                sheets.spreadsheets.values.update({
                                                    spreadsheetId: SheetID,
                                                    range: 'TotalGP!' + toColumnName(NextAvailableColumn) + NextAvailableRow,  
                                                    valueInputOption: 'RAW',
                                                    resource: {
                                                        values: [NewGPDataGP]
                                                    },
                                                })
                                            })
                                    }
                                )
                        })()
                    }
                }
                else
                    client.users.cache.get(AllGuildData[k][5]).send("Update Total GP function could not run for " + AllGuildData[k][0] + " due to SWGOH API Link "
                    + "being blank or undefined. Please run " + AllGuildData[k][7] + "setswgohurl command.")
            }
        }
    }
}

function processMIAAlertsMhannBot(message, status) //TESTING REQUIRED
{
    //var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
    authorize(content, listMajors);

    function listMajors(auth)
    {
        const sheets = google.sheets({version: 'v4', auth});
        sheets.spreadsheets.values.get(
        {
            spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
            range: 'Guild Members & Data!G66:U119',
        }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                rows = res.data.values;
                var UserRow;

                for(var i = 0; i < rows.length; i++)
                {
                    if(rows[i][0].replace("<@","").replace(">","").replace(" ","") == message.author.id)
                    {
                        UserRow = i;
                        i = rows.length
                    }
                }

                if(status == "starting")
                {
                    if(rows[UserRow][14] == 'Y')
                    {
                        sheets.spreadsheets.values.update({
                            spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                            range: 'Guild Members & Data!U' + (UserRow + 66),
                            valueInputOption: 'USER_ENTERED',
                            resource: {
                                values: [["NTemp"]]
                            },
                        })
                        console.log("Raid reminders temporarily suspended for " + message.author.username + " due to MIA.  QZ")
                    }
                }

                if(status == "ending")
                {
                    if(rows[UserRow][14] == 'NTemp')
                    {
                        sheets.spreadsheets.values.update({
                            spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                            range: 'Guild Members & Data!U' + (UserRow + 66),
                            valueInputOption: 'USER_ENTERED',
                            resource: {
                                values: [["Y"]]
                            },
                        })
                        console.log(message.author.username + " has been resubscribed to raid reminders after being MIA.  QZ")
                    }
                }
            }
        )
    }
}

function processMIAMessage(message){
    const regex = /-d\d{1,3}/g;
    const string = message.content.match(regex);

    var Continue = true;

    (async () => {
        await message.channel.messages.fetch({ limit: 40 }).then(messages => {                
            messages.forEach(msg => {
                if(msg.id != "721885057853161583" && msg.id != message.id && Continue == true)
                    if(message.author.id == msg.author.id)
                        Continue = false
            })
        })

        if(Continue == true)
        {
            if(string == null)
            {
                (async () => {
                    console.log("MIA null error: " + message.author.username + ": " + message.content + " QZ")
                    await message.channel.send("Error. Be sure to put  -d#  at the end of your post, where # is the number of days you are gone.");
                    processMIAAlertsMhannBot(message, "ending")
                    const msgs = new Discord.Collection();
                    await message.channel.messages.fetch(message.id).then(messages => { // Fetches the messages
                        msgs.set(message.id, messages);            
                        //setTimeout(async function() {await messages.delete();}, 7000);
                    })
    
                    await message.channel.messages.fetch({limit: 2}).then(messages => {
                        const botMessages = messages.filter(msg => msg.author.bot);
                        const MessagesToDelete = botMessages.concat(msgs)
                        setTimeout(async function() {await message.channel.bulkDelete(MessagesToDelete)
                            .catch(error => {
                                console.log(error)
                                console.log("Error deleting message that was missing -d#. QZ")
                            });
                        }, 7000);
                    })              
                })()
            }
    
            else
            {                
                const days = string[0].match(/\d+/g)
                if(days <= 13 && days >= 1)
                {
                    (async () => {
                        console.log("MIA success: " + message.author.username + ": " + message.content + " QZ")
                        client.channels.cache.get("528458206192599041").send("<@" + message.author.id + "> has posted in MIA.")
                        await message.channel.send("Success!  Your MIA post will automatically be deleted in " + days + " day(s).");
                        await message.channel.send("You will not receive alerts from Mhanndalorian Bot during your MIA period.");
                        
                        processMIAAlertsMhannBot(message, "starting")
                        
                        await message.channel.messages.fetch({limit: 2}).then(messages => { //should only have to go back 1 on the limit, but this didn't always work
                            const botMessages = messages.filter(msg => msg.author.bot);
                            setTimeout(async function() {await message.channel.bulkDelete(botMessages)
                                .catch(error => {
                                    console.log(error)
                                    console.log("Error deleting successful MIA reply. QZ")
                                });
                            }, 7000);
                        })              
                    })()
                }
                else
                {
                    (async () => {
                        console.log("MIA error >= 14: " + message.author.username + ": " + message.content + " QZ")
                        await message.channel.send("Error.  Maximum number of days for an MIA post is 13.");
                        
                        processMIAAlertsMhannBot(message, "ending")
                        
                        const msgs = new Discord.Collection();
                        await message.channel.messages.fetch(message.id).then(messages => { // Fetches the message                            
                            msgs.set(message.id, messages);                      
                            //setTimeout(async function() {await messages.delete();}, 7000);
                        })
        
                        await message.channel.messages.fetch({limit: 2}).then(messages => {
                            const botMessages = messages.filter(msg => msg.author.bot);
                            const MessagesToDelete = botMessages.concat(msgs)
                            setTimeout(async function() {await message.channel.bulkDelete(MessagesToDelete)
                                .catch(error => {
                                    console.log(error)
                                    console.log("Error deleting MIA with days greater than 13. QZ")
                                });
                            }, 7000);
                        })              
                    })()
                }
            }
        }
        else
        {
            (async () => {
                console.log("MIA Error:  Duplicate posting " + message.author.username + " QZ")
                await message.channel.send("Error.  You are already MIA.  Please edit your existing MIA post or delete your existing post and create a new one.");
    
                const msgs = new Discord.Collection();
                await message.channel.messages.fetch(message.id).then(messages => { // Fetches the messages
                    msgs.set(message.id, messages);                     
                    //setTimeout(async function() {await messages.delete();}, 7000);
                })
    
                await message.channel.messages.fetch({limit: 2}).then(messages => {
                    const botMessages = messages.filter(msg => msg.author.bot);
                    const MessagesToDelete = botMessages.concat(msgs)
                    setTimeout(async function() {await message.channel.bulkDelete(MessagesToDelete)
                        .catch(error => {
                            console.log(error)
                            console.log("Error deleting duplicate MIA post. QZ")
                        });
                    }, 7000);
                })              
            })()
        }

    })()
}

function UpdateUsersAndAllycodes()
{
    //var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
    authorize(content, listMajors);

    async function listMajors(auth)
    {
        const sheets = google.sheets({version: 'v4', auth});
        MyDate = new Date()
        var hours = MyDate.getHours()
        var day = MyDate.getDay()

        for(var k = 0; k < AllGuildData.length; k++)
        {
            if(AllGuildData[k][1] != '814625223906689044') //Skip check Mhanndalorian Bot Server
            {
                if(!CheckIfBlankOrUndefined(AllGuildData[k][2]) && AllGuildData[k][2].toLowerCase().startsWith("https://swgoh.gg/api/guild"))
                {
                    if(await GetSubscribers(AllGuildData, k) < 1 && hours == 17 && (day == 6))
                    {
                        console.log("Please Subscribe - Update users and Allycodes - Guild ID: " + AllGuildData[k][1] + "   QZ")
                        client.users.cache.get(AllGuildData[k][5]).send("You have installed Mhanndalorian Bot, but do not yet have any Patrons in your Guild.  You must have at least one Patreon subscriber "
                        +"that is registered in the Mhanndalorian database to utilize certain features.  Subscribe to Mhanndalorian Bot at <https://www.patreon.com/MhannUhdea>  Guild ID: " + AllGuildData[k][1])
                    }
                    
                    const BaseURL = AllGuildData[k][2];
                    const SheetID = AllGuildData[k][3];

                    (async () => {
                        Result = await fetch(BaseURL,
                        /* {
                                method: 'GET',
                            }).then(response => response.json())*/

                            {
                                method: 'GET',
                            }).then(function (response) {
                                //console.log(response)
                                return response.json()
                            })

                            var NamesAndCodes = new Array(54);

                            for (var i = 0; i < NamesAndCodes.length; i++) { 
                                NamesAndCodes[i] = new Array(2);
                                NamesAndCodes[i][0] = '';
                                NamesAndCodes[i][1] = '';
                            }

                            for(var i = 0; i < Result.players.length; i++)
                            {
                                NamesAndCodes[i][0] = Result.players[i].data.name
                                NamesAndCodes[i][1] = Result.players[i].data.ally_code
                            }

                            sheets.spreadsheets.values.update({
                                spreadsheetId: SheetID,
                                range: 'XML Data!A3:B56',  
                                valueInputOption: 'USER_ENTERED', //CHANGED RECENTLY
                                resource: {
                                    values: NamesAndCodes
                                },
                            })

                            var time = new Date().toLocaleTimeString()
                            var date = new Date().toLocaleDateString()

                            sheets.spreadsheets.values.update({
                                spreadsheetId: SheetID,
                                range: 'Guild Members & Data!C122',  
                                valueInputOption: 'RAW',
                                resource: {
                                    values: [[date + " " + time]]
                                },
                            })
                    })()
                }
                else
                {
                    client.users.cache.get(AllGuildData[k][5]).send("UpdateUsersandAllyCodes failed to complete due to improper SWGOH API URL. "
                    + "Please run **" + AllGuildData[k][7] + "setswgohurl**")
                    console.log("SWGOH URL Error.  Guild: " + AllGuildData[k][1] + "  QZ")
                }
            }
        }
    }
}

function CleanMIA()
{
    console.log("In clean MIA function");
    (async () => {
        const now = new Date();
        const guild = client.guilds.cache.get("505515654833504266"); 

        const fetchedChannel = guild.channels.cache.find(r => r.id == "584496478412734464"); //mhann command 676092306381602826
        
        await fetchedChannel.messages.fetch({ limit: 40 }).then(messages => { //NEW:  Deletes left over bot messages in MIA channel
            const botMessages = messages.filter(msg => msg.author.bot);
            fetchedChannel.bulkDelete(botMessages)
            .catch(error => {
                console.log(error)
                console.log("Error deleting left over bot messages in MIA. QZ")
            });
        })        
        
        await fetchedChannel.messages.fetch({ limit: 40 }).then(messages => {                
        var MessagesToDelete = new Array();
            messages.forEach(msg => {
                if(msg.id != "721885057853161583")
                {
                    const regex = /-d\d{1,2}/g;
                    const string = msg.content.match(regex);
                    if(string != null)
                    {
                        const days = string[0].match(/\d+/g)
                        var timelapsedMS

                        if(msg.editedAt == null)
                            timelapsedMS = now - msg.createdAt
                        else
                            timelapsedMS = now - msg.editedAt

                        const timelapsedDays = timelapsedMS/86400000
                        if(timelapsedDays >= days) //FIX FOR TESTING
                        {
                            MessagesToDelete.push(msg)
                            console.log("Deleted MIA message from " + msg.author.username + " QZ")
                            processMIAAlertsMhannBot(msg, "ending")
                        }
                    }
                }
            })
            fetchedChannel.bulkDelete(MessagesToDelete)
            .catch(error => {
                console.log(error)
                console.log("Error deleting expired MIA messages. QZ")
            });
        })
    })()
}

async function FiveMinRaidReminder()
{
    var fetched;
    var lastMessage;
    var now = new Date();
    var MSSinceLastMsg;

    fetched = await client.channels.cache.get("709448648035008543").messages.fetch({limit: 1});
    lastMessage = fetched.first()
    MSSinceLastMsg = now - lastMessage.createdAt

    if((lastMessage.content.includes("have successfully joined") || lastMessage.content.includes("All notifications have been queued") || lastMessage.content.includes("could not be resolved")) && MSSinceLastMsg <= 3960000)
    {
        //var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
        authorize(content, listMajors);

        function listMajors(auth)
        {
            const sheets = google.sheets({version: 'v4', auth});
            sheets.spreadsheets.values.get(
            {
                spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                range: 'Guild Members & Data!G66:U119',
            }, (err, res) => {
                    if (err) return console.log('The API returned an error: ' + err);
                    const rows = res.data.values;

                    for(var i=0; i < rows.length; i++)
                    {
                        if(rows[i][14] == 'Y')
                        {
                            if(client.users.cache.get(rows[i][0].replace("<@","").replace(">","").replace(" ","")) != undefined)
                            {
                                client.users.cache.get(rows[i][0].replace("<@","").replace(">","").replace(" ","")).send(rows[i][0] + " Raid time in 5 minutes!!")
                                .catch(error => {
                                    console.log(error)
                                    console.log("Catch6")
                                });
                            }
                        }
                    }
                }
            )
        }
    }
}

authorize(content, InitializeGIFArray); //Initialize GIFdata array on bot launch

function InitializeGIFArray(auth)
{
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get(
    {
        spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
        range: 'GIFData!A2:F',
    }, (err, res) => {
            if (err) return console.log('The API returned an error: ' + err);
            GIFData = res.data.values;
        }
    )

    sheets.spreadsheets.values.get(
        {
            spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
            range: 'Guilds!A2:K30',
        }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                AllGuildData = res.data.values;

                const GuildsWithBotInstalled = client.guilds.cache.map(g => [g.id, g.ownerID])
                for(var i = 0; i < AllGuildData.length; i++)
                {
                    if(CheckIfBlankOrUndefined(AllGuildData[i][5])) //If owner is undefined
                    {
                        for(var k = 0; k < GuildsWithBotInstalled.length; k++)
                        {
                            if(AllGuildData[i][1] == GuildsWithBotInstalled[k][0]) //If guild Ids match
                            {
                                AllGuildData[i][5] = GuildsWithBotInstalled[k][1] //set owner ID
                                
                                sheets.spreadsheets.values.update({
                                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                    range: 'Guilds!F' + (i + 2),
                                    valueInputOption: 'USER_ENTERED',
                                    resource: {
                                        values: [[GuildsWithBotInstalled[k][1]]]
                                    },
                                }, (err, res) => {
                                    if (err) return console.log('The API returned an error: ' + err);
                                });

                                k = GuildsWithBotInstalled.length
                            }
                        }
                    }

                    if(CheckIfBlankOrUndefined(AllGuildData[i][7]))
                    {
                        AllGuildData[i][7] = '!' //Set default prefix

                        sheets.spreadsheets.values.update({
                            spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                            range: 'Guilds!H' + (i + 2),
                            valueInputOption: 'USER_ENTERED',
                            resource: {
                                values: [["!"]]
                            },
                        }, (err, res) => {
                            if (err) return console.log('The API returned an error: ' + err);
                        });
                    }

                }
            }
        )
}

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

    else if(searchString == "cobra"){
        URLS.push("https://i.postimg.cc/7LRbyfDJ/cobra1.gif")
        URLS.push("https://i.postimg.cc/nh0C03Pk/cobra2.gif")
        URLS.push("https://i.postimg.cc/RVTFZP4B/cobra3.gif")
        URLS.push("https://i.postimg.cc/cJP1b2MQ/cobra4.gif")
        URLS.push("https://i.postimg.cc/CxLKBjxf/cobra5.gif")
        URLS.push("https://i.postimg.cc/K8q8nR1p/cobra6.gif")
        URLS.push("https://i.postimg.cc/BQJSkxDw/cobra7.gif")
        URLS.push("https://i.postimg.cc/zfyXp8Wz/cobra8.gif")
        URLS.push("https://i.postimg.cc/wxXxwWtm/cobra9.gif")
        URLS.push("https://i.postimg.cc/j2bxsf12/cobra10.gif")
        URLS.push("https://i.postimg.cc/mg5TPJn0/cobra11.gif")
        URLS.push("https://i.postimg.cc/7hnxb6vV/cobra12.gif")
        URLS.push("https://i.postimg.cc/85WkQ4tx/cobra13.gif")
        URLS.push("https://i.postimg.cc/XYJV74sf/cobra14.gif")
        URLS.push("https://i.postimg.cc/15MmQfrR/cobra15.gif")
    }

    else if(searchString == "joey"){
        URLS.push("https://i.postimg.cc/MHqMpH36/Joey1.gif")
        URLS.push("https://i.postimg.cc/QdyTJXCm/Joey2.gif")
        URLS.push("https://i.postimg.cc/j2cWwTBz/Joey3.gif")
        URLS.push("https://i.postimg.cc/g0L6Mf6W/Joey4.gif")
        URLS.push("https://i.postimg.cc/bY9SF0ds/Joey5.gif")
        URLS.push("https://i.postimg.cc/ydq32vFS/Joey6.gif")
        URLS.push("https://i.postimg.cc/V6j0wnRZ/Joey7.gif")
        URLS.push("https://i.postimg.cc/ZKYvk9yj/Joey8.gif")
        URLS.push("https://i.postimg.cc/DyCJ72rh/Joey9.gif")
        URLS.push("https://i.postimg.cc/HkVJxfzy/Joey10.gif")
        URLS.push("https://i.postimg.cc/bJHrW8yK/Joey11.gif")
        URLS.push("https://i.postimg.cc/tJqJHf77/Joey12.gif")
        URLS.push("https://i.postimg.cc/vBdD0Dsr/Joey13.gif")
        URLS.push("https://i.postimg.cc/4xqYhB2F/Joey14.gif")
        URLS.push("https://i.postimg.cc/25WVdhPj/Joey15.gif")
    }

    else if(searchString == "rogue"){
        URLS.push("https://i.postimg.cc/G2CMgNqM/rogue1.gif")
        URLS.push("https://i.postimg.cc/BZNhNmDg/rogue2.gif")
        URLS.push("https://i.postimg.cc/LsfCTRBY/rogue3.gif")
        URLS.push("https://i.postimg.cc/7Y6KRSny/rogue4.gif")
        URLS.push("https://i.postimg.cc/KYnfTfxt/rogue5.gif")
        URLS.push("https://i.postimg.cc/Gt3XdD0G/rogue6.gif")
        URLS.push("https://i.postimg.cc/HnSBxLHK/rogue7.gif")
        URLS.push("https://i.postimg.cc/3x0n87qS/rogue8.gif")
        URLS.push("https://i.postimg.cc/wBKF3Z86/rogue9.gif")
        URLS.push("https://i.postimg.cc/prdJgt8B/rogue10.gif")
        URLS.push("https://i.postimg.cc/c4bFG6Ft/rogue11.gif")
        URLS.push("https://i.postimg.cc/B64gBFnk/rogue12.gif")
        URLS.push("https://i.postimg.cc/W387W4D3/rogue13.gif")
        URLS.push("https://i.postimg.cc/XN289pS1/rogue14.gif")
        URLS.push("https://i.postimg.cc/RhbLmbLx/rogue15.gif")
    }

    randomNumber = Math.floor((Math.random()) * URLS.length);
    return URLS[randomNumber];

}

function dmUsersMissedRaids() {
 //var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
 authorize(content, listMajors);
   
    function listMajors(auth) {
        const sheets = google.sheets({version: 'v4', auth});
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
                        client.users.cache.get(user).send("You have missed the "+ row[10] + " raid on " + row[9] + ", but luckily you purchased raid forgiveness!")
                        .catch(error => {
                            console.log(error)
                            console.log("Catch - Forgiven1")
                        });

                        const exampleEmbed = new Discord.MessageEmbed()
                        .setTitle('All is forgiven.')
                        .setImage('https://media.giphy.com/media/U1sXoHqCyA7wRzXCEx/giphy.gif')
                        client.users.cache.get(user).send(exampleEmbed)
                        .catch(error => {
                                console.log(error)
                                console.log("Catch - Forgiven2")
                        });
                            
                    }

                    else if (row[2] - row[8] == 1 && row[7] > 1 && user != ""){
                        console.log(user + " missed one raid QZ")
                        client.users.cache.get(user).send("You have missed the "+ row[10] + " raid on " + row[9] + ".")
                        .catch(error => {
                            console.log(error)
                            console.log("Catch - Missed 1 raid")
                        });
                    }

                    else if (row[2] - row[8] > 1 && user != ""){
                        console.log(user + " missed multiple raids QZ")
                        client.users.cache.get(user).send("You have missed the " + row[10] + " raid on " + row[9] + ". In addition, you have missed " + ((row[2] - 1) - row[8]) + " other raids(s) since you were last messaged.")
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

    if(searchString == "succubus" || searchString == "molly" || searchString == "mhann"
    || searchString == "greg" || searchString == "lod" || searchString == "cobra"
    || searchString == "joey" || searchString == "rogue"){
        special = true;
    }

    if(special == false){
        giphy.search('gifs', {"q": searchString, "limit": 35})
            .then((response) => {
                var TotalResponses = response.data.length;
                var ResponseIndex = Math.floor((Math.random() * 10) + 1) % TotalResponses;
                var ResponseFinal = response.data[ResponseIndex];
                var ResponseAttribution = "";

                if(ResponseFinal.user != null)
                    ResponseAttribution = "\nGIF By: " + ResponseFinal.user.username
                else
                    ResponseAttribution = ""

                const exampleEmbed = new Discord.MessageEmbed()
                .setTitle(tagLine)
                .setImage(ResponseFinal.images.fixed_height.url)

               .setFooter('POWERED BY GIPHY' + ResponseAttribution, 'https://i.postimg.cc/RZbkMxLt/GIPHY.jpg') //MINE
              // .setFooter(ResponseAttribution)

              // .setThumbnail('https://i.postimg.cc/Wzbg0cj7/GIPHY-Thumbnail-2.jpg') //PROPER
                message.channel.send(exampleEmbed);
            }).catch(() => {
                message.channel.send("You mentioned " + searchString + ", but a gif was not available!")
        })
    }
    else{
        const exampleEmbed = new Discord.MessageEmbed()
        .setTitle(tagLine)
        .setImage(specificGIF(searchString))
        //.setFooter('POWERED BY GIPHY', 'https://i.postimg.cc/RZbkMxLt/GIPHY.jpg')  //MINE (not really powered by Giphy when special = true)
            
        //.setThumbnail('https://i.postimg.cc/Wzbg0cj7/GIPHY-Thumbnail-2.jpg')  //PROPER
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

function authorize2(credentials, callback)
{
    const {client_secret, client_id, redirect_uris} = credentials.installed;
    const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]);
    var token = {"access_token":"ya29.a0AfH6SMBa53RjxvvgT_wM5531VFcmE6GM92qOCkc5A0yfp6wskFlCoaKEs95kWZExijlNiAMrXyHXL-4xzPVwPECN3kSl_rOp0_jIzG2ciM9KGKztg7R4p8A6GIJNxChpnYZ0xNluW7wlISDtO8VyVjL02Ame","refresh_token":"1//0dFJeJ2wmrEdFCgYIARAAGA0SNwF-L9IrcDvoT5oyt5b-wd4qFSoiaClGAHtIn2ryqmLkNTrvsrMx9ZpD6wtjyPyRAb8hdyPUXmw","scope":"https://www.googleapis.com/auth/drive","token_type":"Bearer","expiry_date":1615076535031}
    oAuth2Client.setCredentials(token);
    callback(oAuth2Client);
}


async function newFlairAnncouncment(){

    if (Array.isArray(NewNoStatus) && NewNoStatus.length){
        var x;
        var GuildMember;
        var User;
        var discordID;
        const guild = client.guilds.cache.get("505515654833504266");

        for (x in NewNoStatus){
            client.users.cache.get(NewNoStatus[x]).send("You have missed a raid and lost your flair.  Get back in there!")
            .catch(error => {
                console.log(error)
                console.log("Catch - Lost Flair")
        });

            discordID = NewNoStatus[x];
            User =  await client.users.fetch(discordID)
            GuildMember =  await guild.members.fetch(User);
            console.log(GuildMember.displayName + " has lost raid flair  QZ")
        }
    }

    if (newBronze != "")
        client.channels.cache.get("505515654837698563").send("Nice job! Let's congratulate the following members on just earning bronze raid status. " + newBronze)

    if (newSilver != "")
        client.channels.cache.get("505515654837698563").send("Sweet!! Congratulate the following members on just earning silver raid status. " + newSilver)

    if (newGold != "")
        client.channels.cache.get("505515654837698563").send("Excellent!!! Let's congratulate the following members on just earning gold raid status. " + newGold)
    
    if (newDiamond != "")
        client.channels.cache.get("505515654837698563").send("Amazing! 100 days with no raids missed!! Let's congratulate the following members on just earning diamond raid status. "
        +"You have proven yourself to be an able warrior.  Now, the journey begins..." + newDiamond)

    if (newHolodisk != "")
        client.channels.cache.get("505515654837698563").send("Very good young padawan.  You have discovered the holodisk which will lead you to the ancient Jedi scrolls. " + newHolodisk)

    if (newJediScroll != "")
        client.channels.cache.get("505515654837698563").send("You are now in possession of the ancient Jedi scrolls.  The knowledge contained in these scrolls will lead you to the most powerful Jedi artifact ever created. " + newJediScroll)

    if (newEye != "")
        client.channels.cache.get("505515654837698563").send("You have found the most powerful Jedi artifact ever created: The Eye of the Sun. Use this artifact to defeat the Sith Lord Darth Mhann. " + newEye)
}

function FlairUpdate(Type, callback){
    const guild = client.guilds.cache.get("505515654833504266");
    newBronze = "";
    newSilver = "";
    newGold = "";
    newDiamond = "";
    newHolodisk = "";
    newJediScroll = "";
    newEye = "";
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

          var User;
          var discordID;

            for (let i=0; i<rows.length; i++){
                if(typeof rows[i][1] != 'undefined' && rows[i][1] != "" && rows[i][0].length >= 1){
                    discordID = rows[i][1].replace("<","").replace(">","").replace("@","");
                    if(discordID != GuildLeader){
                        User =  await client.users.fetch(discordID)
                        GuildMember =  await guild.members.fetch(User)
                        .then(value =>{
                           AddFlair(value,rows[i][0],Type,rows[i][6]);
                        //   setTimeout(AddFlair,delay,value,rows[0],Type,rows[6])
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

//var CronJob2 = require('cron').CronJob;
var job2 = new CronJob('05 9,21 * * *', function() {
    console.log("Cron job DMusers who miss raids executed QZ")
    dmUsersMissedRaids();
}, null, true, 'America/New_York');
job2.start();

var time = new Date()
//if(time.getTimezoneOffset() == 240)  Uncomment the lines for CronJob3 to have a differnt raid time during DST
//{
    //var CronJob3 = require('cron').CronJob;
    var job3 = new CronJob('55 19 * * *', function() {
        console.log("Cron job 5 minute raid reminder QZ")
        FiveMinRaidReminder();
    }, null, true, 'America/New_York');
    job3.start();
//}

/*else
{
    var CronJob3 = require('cron').CronJob;
    var job3 = new CronJob('55 18 * * *', function() {
        console.log("Cron job 5 minute raid reminder QZ")
        FiveMinRaidReminder();
    }, null, true, 'America/New_York');
    job3.start();
}*/

var job4 = new CronJob('00 6,14,20 * * *', function() {
    console.log("Cron job MIA cleanup QZ")
    CleanMIA();
}, null, true, 'America/New_York');
job4.start();

var job5 = new CronJob('45 5,17 * * *', function() {
    console.log("Update Users & Allycodes from SWGOH.GG API")
    UpdateUsersAndAllycodes();
}, null, true, 'America/New_York');
job5.start();

var job6 = new CronJob('01 19 * * *', function() {
    console.log("Update Total GP")
    UpdateTotalGP()
}, null, true, 'America/New_York');
job6.start();

var job7 = new CronJob('15 19 * * 3', function() {
    console.log("Weekly Guild GP Update")
    PostWeeklyGuildGP()
}, null, true, 'America/New_York');
job7.start();

var job8 = new CronJob('30 18 * * 4', function() {
    console.log("Weekly GP Performance Individual")
    PostWeeklyGPPerformanceIndividual(AllGuildData)
}, null, true, 'America/New_York');
job8.start();

var job9 = new CronJob('0 3 * * *', function() {
    console.log("Daily Heroku Dyno Restart")
    RestartHerokuDyno()
}, null, true, 'America/New_York');
job9.start();

async function PostWeeklyGPPerformanceIndividual(AllGuildData) {
    var searchObj = {
      searchTitle1: "Highest and Lowest GP Growth by Raw GP (Past 30 Days)",
      searchTitle2: "Highest and Lowest GP Growth by Percent (Past 30 Days)",

      searchTitle3: "Highest GP Growth by Raw Increase (Past 30 Days)",
      searchTitle4: "Highest GP Growth by Percent (Past 30 Days)",
    }

    var ThreeDaysAgo = new Date();
    ThreeDaysAgo.setDate(ThreeDaysAgo.getDate() - 3);

    for(var i = 0; i < AllGuildData.length; i++)
    {
        if(AllGuildData[i][1] != '814625223906689044') //Skip the Mhanndalorian Bot server
        {
            if(await GetSubscribers(AllGuildData, i) >= 1)
            {
                if(!CheckIfBlankOrUndefined(AllGuildData[i][3]))
                    findByAnythingElse(AllGuildData[i][3], i, searchObj, ThreeDaysAgo);
                else
                    client.users.cache.get(AllGuildData[i][5]).send("FindByAnythingElse could not run due to Google spreadsheet ID not set.  Contact Mhann at <@406945430967156766>.")
            }
            else
            {
                if(!CheckIfBlankOrUndefined(AllGuildData[i][9], AllGuildData[i][8]))
                {
                    console.log("Please subscribe - Post weekly individual GP performance - Guild ID " + AllGuildData[i][1] + "   QZ")
                    client.channels.cache.get(AllGuildData[i][9]).send("<@&" + AllGuildData[i][8] + ">" + " Individual Galactic Power report failed to complete.  You must have at least one Patreon subscriber "
                    +"that is registered in the Mhanndalorian database to utilize this feature.  Subscribe to Mhanndalorian Bot at <https://www.patreon.com/MhannUhdea>  Guild ID: " + AllGuildData[i][1])
                }
                
                if(!CheckIfBlankOrUndefined(AllGuildData[i][10], AllGuildData[i][6]))
                {
                    console.log("Please subscribe - Post weekly individual GP performance officer - Guild ID " + AllGuildData[i][1] + "   QZ")
                    client.channels.cache.get(AllGuildData[i][10]).send("<@&" + AllGuildData[i][6] + ">" + " Individual Galactic Power officer report failed to complete.  You must have at least one Patreon subscriber "
                    +"that is registered in the Mhanndalorian database to utilize this feature.  Subscribe to Mhanndalorian Bot at <https://www.patreon.com/MhannUhdea>  Guild ID: " + AllGuildData[i][1])
                }
            }
        }
    }
}

function findByAnythingElse(spreadsheetId, GuildFoundRow, searchObj, ThreeDaysAgo) {
    authorize(content, listMajors);
    
    async function listMajors(auth) {
        const Sheets = google.sheets({version: 'v4', auth});

        const request = {
            spreadsheetId: spreadsheetId,  
            fields: 'sheets(charts(chartId,spec(altText,subtitle,title)))'
        };
        
        (async () => {
            var obj = await Sheets.spreadsheets.get(request);

           // console.log(obj.data.sheets[1].charts[1].spec.title)

            if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][6], AllGuildData[GuildFoundRow][8]))
            {
                client.users.cache.get(AllGuildData[GuildFoundRow][5]).send("Weekly individual GP performance failed to run.  Standard user role and/or officer role not set.  "
                + "Please run **" + AllGuildData[GuildFoundRow][7] + "setofficerrole** and/or **" + AllGuildData[GuildFoundRow][7] + "setofficerrole.** ")
                return 0;
            }

            if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][9], AllGuildData[GuildFoundRow][10]))
            {
                client.users.cache.get(AllGuildData[GuildFoundRow][5]).send("Weekly individual GP performance failed to run.  Standard user channel and/or officer channel not set.  "
                + "Please run **" + AllGuildData[GuildFoundRow][7] + "setuserchannel** and/or **" + AllGuildData[GuildFoundRow][7] + "setofficerchannel.** ")
                return 0;
            }
           
            client.channels.cache.get(AllGuildData[GuildFoundRow][10]).send("<@&" + AllGuildData[GuildFoundRow][6] + "> GP performance update for week of " + 
            ThreeDaysAgo.toLocaleDateString("en-US")) + ".\n\n" //Officer heading for post

            client.channels.cache.get(AllGuildData[GuildFoundRow][9]).send("<@&" + AllGuildData[GuildFoundRow][8] + "> GP performance update for week of " + 
            ThreeDaysAgo.toLocaleDateString("en-US")) + ".\n\n" //User heading for post

            var seconds = new Date().getTime();

            for (var i = 0; i < obj.data.sheets.length; i++)
            {
                var charts = obj.data.sheets[i].charts;
                if (charts)
                {
                    for (var j = 0; j < charts.length; j++)
                    {
                        var title = charts[j].spec.title;
                        if (title == searchObj.searchTitle1 || title == searchObj.searchTitle2)
                            client.channels.cache.get(AllGuildData[GuildFoundRow][10]).send(AllGuildData[GuildFoundRow][4].replace("-----",charts[j].chartId) + "&Time=" + seconds)

                        if (title == searchObj.searchTitle3 || title == searchObj.searchTitle4)
                            client.channels.cache.get(AllGuildData[GuildFoundRow][9]).send(AllGuildData[GuildFoundRow][4].replace("-----",charts[j].chartId) + "&Time=" + seconds)
                    }
                }
            }
       })()
    }
  }

async function AddFlair(passedMember, row, Type, SpecialF){
    var OldNickname = passedMember.displayName

    var SpecialFlairString = '';

    var newNickname;
    newNickname = passedMember.displayName.replace(/🥉/g,'').replace(/🥈/g,'').replace(/🥇/g,'').replace(/💎/g,'').replace(/📀/g,'').replace(/📜/g,'').replace(/🔆/g,'').replace(/⚔/g,'').replace(/🛡/g,'').replace(/👸/g,'');

    if(newNickname.length > 26) //NEW!!!!!
    {
        newNickname = newNickname.substring(0, 26);
    }

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
    else if(row >= 100 && row <= 199 && OldNickname != newNickname + SpecialFlairString +'💎'){
        await passedMember.setNickname(newNickname + SpecialFlairString +'💎')
        console.log(Type + " - " + passedMember.displayName + " Diamond QZ")
        if(Type == "Manual" || Type == "Cron")
            newDiamond = newDiamond + "<@" + passedMember.id + "> "
    }
    else if(row >= 200 && row <= 324 && OldNickname != newNickname + SpecialFlairString +'📀'){
        await passedMember.setNickname(newNickname + SpecialFlairString +'📀')
        console.log(Type + " - " + passedMember.displayName + " Holodisk QZ")
        if(Type == "Manual" || Type == "Cron")
            newHolodisk = newHolodisk + "<@" + passedMember.id + "> "
    }
    else if(row >= 325 && row <= 499 && OldNickname != newNickname + SpecialFlairString +'📜'){
        await passedMember.setNickname(newNickname + SpecialFlairString +'📜')
        console.log(Type + " - " + passedMember.displayName + " Jedi Scroll QZ")
        if(Type == "Manual" || Type == "Cron")
            newJediScroll = newJediScroll + "<@" + passedMember.id + "> "
    }
    else if(row >= 500 && OldNickname != newNickname + SpecialFlairString +'🔆'){
        await passedMember.setNickname(newNickname + SpecialFlairString +'🔆')
        console.log(Type + " - " + passedMember.displayName + " Jedi Eye QZ")
        if(Type == "Manual" || Type == "Cron")
            newEye = newEye + "<@" + passedMember.id + "> "
    }
    else{
        console.log(Type + " - " + passedMember.displayName + " No update needed")
    }
}

client.on('rateLimit', (RateLimitInfo) => {
    if(RateLimitInfo.path.includes("channels"))
    {
        console.log("Rate limit reached QZ")
        channelID = RateLimitInfo.path.match(/\d+/g);
        client.channels.cache.get(channelID[0]).send("Rate limit reached for this command. Please wait " + RateLimitInfo.timeout/1000 + " seconds.")
    }
})

client.on("messageDelete", msg => {
    if(msg.channel.id == "584496478412734464")
    {
        console.log("Message deleted from MIA QZ")
        processMIAAlertsMhannBot(msg, "ending")
    }
  })

client.on('messageUpdate', (oldMessage, newMessage) => {  //Handles an edit to a MIA message. 
    if(newMessage.channel.id == "584496478412734464")
    {
        console.log("Message updated in MIA QZ") 
        processMIAMessage(newMessage)
    }
})

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    if(newMember.guild.id == "505515654833504266")
    {
        if(newMember.roles.cache.has("530083964380250116") && !oldMember.roles.cache.has("530083964380250116"))
        {
            console.log(newMember.displayName + " Has become a bandit QZ")
            client.users.cache.get(newMember.user.id).send("Congratulations!! You are now an official Bandit! Please check the "
                + "new-to-server channel on the guild Discord server for some additional instructions. \n \n"
                + "Now, a little about me.  I'm Mhanndalorain bot, and I work for <@406945430967156766>. "
                + "Some of the services I provide include keeping track of raid participation, informational posts, advanced "
                + "commands, and humor. I will assign you flair (an emoji added to your username), for oustanding performance in territory wars and for your participation in "
                + "raids (you only need to sign up, doing damage is optional): \n \n"
                + "Bronze (🥉) - 14 days of no missed raids \nSilver (🥈) - 30 days of no missed raids \n"
                + "Gold(🥇) - 60 days of no missed raids \nDiamond (💎) - 100 days of no missed raids \n"
                + "?????? - Beyond 100 days you will begin a Jedi quest...\n \n"
                + "The following command will allow you to check your raid flair status at any time \n!flair \n \n"
                + "If you have any questions about my services please contact my employer, <@406945430967156766>. \n \nI have spoken. \n"
                + "This is the way.")
                .catch(error => {
                    console.log(error)
                    console.log("Catch5")
                });
            
            client.channels.cache.get("710510128381689966").send("<@" + newMember.user.id + "> , congratulations on becoming an official Bandit!  "
                + "There are a few things we need you to do to get fully set up: \n \n"
                + "1. Post a swgoh.gg acct in <#530063496382119937> \n \n"
                + "2. Register for the bots we use on the server.  To do this, you need your in game ally code. "
                + "If your ally code was 123456789 you would type the following command in the <#706614410235347034> channel: \n"
                + "       eb.123456789.register \n       Do not use dashes \n \n"
                + "3. Choose your experience! We have many, many channels on the server!  You can choose to have the "
                + "full experience with access to all channels and notifications or if you prefer a more streamlined experience "
                + "you can have access to only essential channels and notifications. To set your preference, enter one of the "
                + "following commands in the <#706614410235347034> channel: \n"
                + "       For access to all channels and notifications type:  !Full \n"
                + "       For access to only the essential channels and notifications type:  !Light \n"
                + "You can change your preference at any time! \n \n"
                + "4. Read general rules in: \n       <#529197401626378241> \n       <#530675016916795400> \n \n"
                + "5. Read raid, TW, and TB rules in: \n       <#530674764499517440> \n       <#530991189604958210> \n       <#530991579717173279> \n \n"
                + "Utilize the info, resources, and officers in the guild to maximize your gameplay.  Please contact officers (<@&505527335768948754>) "
                + "or the guild leader (<@&528746539871371294>) with any comments, questions, or concerns.  Enjoy the game and this online family! \n \n - - - - - - - - - -")
        } 
            
        //var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
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
                        if(String(row[1]).match(/\d+/) == newMember.user.id && String(row[1]).match(/\d+/) != GuildLeader.toString()){
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
    {
        console.log("New member joined server QZ")
        client.channels.cache.get("710510128381689966").send("Hey <@" + member.user.id + ">! Welcome to Wookie and the Bandit!  You won't find a more eclectic group of rebels "
            + "and scoundrels anywhere in the galaxy.  Have a look around our server and make yourself comfortable.  If you're "
            + "looking for some new droids, entertainment, pie, or good banter, stop in at the <#505515654837698563> and say hello.")

        
        client.channels.cache.get("528458206192599041").send("<@" + member.user.id + "> has joined the server.")

        const guild = client.guilds.cache.get("505515654833504266"); 

        const RecruitingRoom1 = guild.channels.cache.find(r => r.name === "recruiting-room-1");
        const RecruitingRoom2 = guild.channels.cache.find(r => r.name === "recruiting-room-2");
        const RecruitingRoom3 = guild.channels.cache.find(r => r.name === "recruiting-room-3");

        var RecruitmentRooms = [RecruitingRoom1.id, RecruitingRoom2.id, RecruitingRoom3.id];
        var RoomStatus = new Array(3)
        var lastMessage;

        (async () => {
            await client.channels.cache.get(RecruitmentRooms[0]).messages.fetch({ limit: 1 }).then(messages => { //room 1
                lastMessage = messages.first();

                if(lastMessage == undefined)
                    RoomStatus[0] = "Empty"
                else
                    RoomStatus[0] = "Busy"        
            }).catch(console.error);


            await client.channels.cache.get(RecruitmentRooms[1]).messages.fetch({ limit: 1 }).then(messages => { //room 1
                lastMessage = messages.first();

                if(lastMessage == undefined)
                    RoomStatus[1] = "Empty"
                else
                    RoomStatus[1] = "Busy"        
            }).catch(console.error);


            await client.channels.cache.get(RecruitmentRooms[2]).messages.fetch({ limit: 1 }).then(messages => { //room 1
                lastMessage = messages.first();

                if(lastMessage == undefined)
                    RoomStatus[2] = "Empty"
                else
                    RoomStatus[2] = "Busy"
            }).catch(console.error);

            var RoomFound = false;

            for(var i = 0; i < 3; i++)
            {
                if(RoomStatus[i] == "Empty")
                {
                    client.channels.cache.get("710510128381689966").send("If you are interested in speaking with an officer, head over to "
                    +"<#" + RecruitmentRooms[i] + "> and someone from <@&505527335768948754> will be in touch. "
                    + "An officer can set you up with a visitor pass that will enable you to see many more resources available on our server. \n \n - - - - - - - - - -")
                    client.channels.cache.get("528458206192599041").send("<@" + member.user.id + "> is waiting in <#" + RecruitmentRooms[i] + ">");
                    client.channels.cache.get(RecruitmentRooms[i]).send("Welcome <@" + member.user.id + ">!  Can you see this message?" )
                    client.channels.cache.get(RecruitmentRooms[i]).createOverwrite(member.user.id, {
                        VIEW_CHANNEL: true,
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true,
                        ADD_REACTIONS: true,
                        SEND_TTS_MESSAGES: true,
                        EMBED_LINKS: true,
                        ATTACH_FILES: true,
                        USE_EXTERNAL_EMOJIS: true,
                        MENTION_EVERYONE: true,
                     });
                    RoomFound = true;
                    i = 4;
                }
            }

            if(RoomFound == false)
            {
                client.channels.cache.get("528458206192599041").send("There was no empty recruiting room for <@" + member.user.id + ">")
                client.channels.cache.get("710510128381689966").send("If you are interested in speaking with an officer, head over to the"
                    +"<#505515654837698563> and mention <@&505527335768948754> and an officer will be in touch. "
                    + "An officer can set you up with a visitor pass that will enable you to see many more resources available on our server. \n \n - - - - - - - - - -")
            }
        })()

        console.log(member.displayName + " Has joined the guild QZ")
    }
});

client.on("guildMemberRemove", (member) => {
    if(member.guild.id == "505515654833504266")
    {
        client.channels.cache.get("528458206192599041").send(member.displayName + " has left the server.")
        console.log(member.displayName + " has left the server. QZ")
    }
});

client.on("guildBanAdd", (guild,user) => {
    if(guild.id == "505515654833504266")
    {
        client.channels.cache.get("528458206192599041").send(user.username + " has been banned from the server.")
        console.log(user.username + " has been banned. QZ")
    }
});

client.on("guildBanRemove", (guild,user) => {
    if(guild.id == "505515654833504266")
    {
        client.channels.cache.get("528458206192599041").send(user.username + " has been unbanned from the server.")
        console.log(user.username + " has been unbanned. QZ")
    }
});

client.on("guildCreate", function(guild){
    (async () => {
        console.log("Bot has been installed in new Guild QZ")
        var NewChannel = await guild.channels.create('Mhanndalorian-bot', {type: 'text', reason: 'Bot was installed on server'})
        const BotRole = guild.roles.cache.find(role => role.name === 'Mhanndalorian Bot')

        NewChannel.updateOverwrite(BotRole, {})
        NewChannel.send("Welcome to the Mhanndalorian Bot!  This channel will serve at the default announcement channel for Mhanndalorian bot, replacing any previous announcement channel. "
                        + "In order to get fully up and running please check out the help file using the **!help** command.  You will need to run the following commands to tell Mhanndalorian Bot "
                        + "a bit about your server.\n"
                        +"   1) !setofficerrole \n"
                        +"   2) !setuserrole \n"
                        +"   3) !setofficerchannel \n"
                        +"   4) !setswgohurl \n\n"
                        +"To utilize all features, you will need to go to https://www.patreon.com/MhannUhdea and choose a membership tier.  If you have any "
                        + "questions or problems, please reach out to me at <@406945430967156766> or on my server for Mhanndalorian Bot.")

        client.users.cache.get('406945430967156766').send("Bot has just been installed:"
        +"\n **Guild Name: **" + guild.name
        +"\n **Guild ID: **" + guild.id
        +"\n **Owner: **<@" + guild.ownerID + ">"
        +"\n - - - - - -") 

        for(var i = 0; i < AllGuildData.length; i++)
        {
            if(guild.id == AllGuildData[i][1]) //If guild is already in master sheet
            {
                authorize(content, listMajors);

                function listMajors(auth)
                {
                    AllGuildData[i][11] = 'yes'
                    AllGuildData[i][9] = NewChannel.id

                    const sheets = google.sheets({version: 'v4', auth});
                    sheets.spreadsheets.values.update({
                        spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                        range: 'Guilds!A' + (i + 2),
                        valueInputOption: 'USER_ENTERED',
                        resource: {
                            values: [[,,,,,,,,,NewChannel.id,,'yes']]
                        },
                    })
                }
                return 0;
            }
        }

        const BlankRow = AllGuildData.length + 2;

        authorize2(content, listMajors);

        async function listMajors(auth)
        {
            var drive = google.drive({version:'v3', auth});

            var fileMetadata = {
                'name': guild.name + ' (' + guild.id + ')',
                'parents': ['1BpYHQGsr-6BA45Vz_spUgmIhO0wHE6Og'],
                'mimeType': 'application/vnd.google-apps.folder'
              };
    
              
              await drive.files.create({ //create folder
                resource: fileMetadata,
                fields: 'id'
              }, function (err, folder) {
                if (err) {
                  console.log(err);
                  return;
                }                
                else
                {
                    var copyRequest = {
                        name: guild.name + ' (' + guild.id + ')',
                        fileId: '1auIKvvtl6hMzeU-FQe2He315Ya3B5Qsq-N1vlCIEy9s',
                        parents: [folder.data.id]
                    }
                
                    drive.files.copy( //create copy of blank template
                        {  // Modified
                          fileId: "1auIKvvtl6hMzeU-FQe2He315Ya3B5Qsq-N1vlCIEy9s",
                          requestBody: copyRequest  // or resource: copyRequest
                        },
                        function(err, response) {
                          if (err) {
                            console.log(err);
                            return;
                          }
                          else
                          {
                            AllGuildData.push([guild.name,guild.id,,response.data.id,,guild.ownerID,,'!',,NewChannel.id,,'yes',folder.data.id])
                            const sheets = google.sheets({version: 'v4', auth});
                            sheets.spreadsheets.values.update({
                                spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                range: 'Guilds!A' + BlankRow,
                                valueInputOption: 'USER_ENTERED',
                                resource: {
                                    values: [[guild.name,guild.id,,response.data.id,,guild.ownerID,,'!',,NewChannel.id,,'yes',folder.data.id]]
                                },
                            })
                          }
                        }
                      );


                }
            });
        }
    })()
});

client.on("guildDelete", function(guild){
    console.log("Bot has ben removed from guild QZ")
    client.users.cache.get('406945430967156766').send("Bot has just been uninstalled:"
    +"\n **Guild Name: **" + guild.name
    +"\n **Guild ID: **" + guild.id
    +"\n **Owner: **<@" + guild.ownerID + ">"
    +"\n - - - - - -") 

    for(var i = 0; i < AllGuildData.length; i++)
    {
        if(guild.id == AllGuildData[i][1])
        {
            AllGuildData[i][11] = 'no'

            authorize(content, listMajors);
            function listMajors(auth)
            {
                const sheets = google.sheets({version: 'v4', auth});
                sheets.spreadsheets.values.update({
                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                    range: 'Guilds!A' + (i + 2),
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: [[,,,,,,,,,,,'no']]
                    },
                })
                /*sheets.spreadsheets.batchUpdate({ //delte entire row when guild uninstalls bot
                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                    resource: {
                        "requests": 
                        [
                            {
                                "deleteRange": 
                                {
                                    "range": 
                                    {
                                        "sheetId": 33239746, // gid
                                        "startRowIndex": i+1,
                                        "endRowIndex": i+2
                                    },
                                    "shiftDimension": "ROWS"
                                }
                            }
                        ]
                    }
                })*/
            }

            return 0;
        }
    }
});

client.on('message', async message => {
    var bot = message.author.bot
    var wookieGuild

    if(message.guild != null)
    {
        if(message.guild.id == "505515654833504266")
            wookieGuild = true
        else
            wookieGuild = false
    }
    else
        wookieGuild = false

    if(message.channel.id == "674049431594729472" && !message.author.bot)
    {
        (async () => {                
            await message.channel.messages.fetch(message.id).then(messages => { // Fetches the messages
                messages.delete();
            })
            
        })()
    }

    if(message.channel.id == "767844286028840960")
    {
        if(message.webhookID == null)
        {
            (async () => {                
                await message.channel.messages.fetch(message.id).then(messages => { // Fetches the messages
                    messages.delete();
                })
                
            })()
        }
    }

    if(message.channel.type == 'dm' && bot == false)
    {
        message.channel.send("Mhanndalorian commands must be issued on the server and not in a direct message.")
        return 0;
    }

    if(message.channel.type == 'dm' && bot == true)
    {
        return 0;
    }

    var GuildFoundRow = -1;
    GuildFoundRow = await GuildSearch(message.guild.id)
    if(GuildFoundRow == -1)
    {
        if(bot == false)
        {
            //client.users.cache.get('406945430967156766').send(("Guild data not setup in Master Database.  Error 1.  Contact Mhann at <@406945430967156766>.  Guild ID: " + message.guild.id))
            message.channel.send(("Guild data not setup in Master Database.  Error 1.  Contact Mhann at <@406945430967156766>.  Guild ID: " + message.guild.id))
        }
        return 0;
    }

    var prefix = AllGuildData[GuildFoundRow][7]

    if(message.channel.id == "804864706200076329" && message.author.id != "470635832462540800" && message.author.id != "678748334906671145")
    {
        if(!message.content.toLowerCase().startsWith("[rancor"))
        {
            message.reply("Error damage not recorded.  You typed: **" + message.content + "**  Please use one of the following commands:  \n**[rancor 5.43**    "  +
            "Replace 5.43 with the percent damage you did. \n**[rancor abort**   This will cancel your held damage.");
 
            (async () => {                
                await message.channel.messages.fetch(message.id).then(messages => { // Fetches the messages
                    messages.delete();
                })
                
            })()
        }
    }
 
    if(message.channel.id == "709448648035008543")
    {
        var time = new Date()
        var Offset = time.getTimezoneOffset();
        var Adjustment = 0;

        if(Offset == 300)
            Adjustment = 100

        var HMString = `${time.getHours()}${time.getMinutes()}`
        var HMInt = parseInt(HMString, 10);

        var Allowed = false  //Replace 1849 - 0 and 1859 - 0 with 1849 - adjustment to have allowed posting time change with DST
        if((HMInt >= (1849 - 0) && HMInt <= (1859 - 0)) || (HMInt >= (2225 - Adjustment) && HMInt <= (2235 - Adjustment)) || (HMInt >= (2323 - Adjustment) && HMInt <= (2333 - Adjustment)))
            Allowed = true  

        if(message.author.id != "470635832462540800" || !Allowed)
        {
            (async () => {                
                await message.channel.messages.fetch(message.id).then(messages => { // Fetches the messages
                    messages.delete();
                })
                
            })()
        }
    }

    if(message.channel.id == "584496478412734464"  && !bot && wookieGuild) //676092306381602826 Mhann testing
    {
        processMIAMessage(message)                                                                  //584496478412734464 Real MIA channel   
    }

    if(message.content.toLowerCase().match(/[e][b][.]\d{9}[.][r][e][g][i][s][t][e][r]/) && (message.content.toLowerCase().startsWith("eb")) &&!bot)
    {
        console.log("Echobase Register QZ")
        UpdateMhanndalorianDatabase(message, AllGuildData, GuildFoundRow, "register");  
    }      

    if(message.content.toLowerCase().match(/[e][b][.]\d{9}[.][u][n][r][e][g][i][s][t][e][r]/) && (message.content.toLowerCase().startsWith("eb")) &&!bot)
    {
        console.log("Echobase Unregister QZ")
        UpdateMhanndalorianDatabase(message, AllGuildData, GuildFoundRow, "unregister");
    }        

    else if(message.content.startsWith(prefix) && !bot)
    {

        if((message.content.toLowerCase().startsWith(`${prefix}flair`)) && (wookieGuild || message.channel.type=='dm')){

            if(CheckMemberPatreonStatus(message.author.id) < 1)
            {
                message.channel.send("Could not execute flair command.  You must have at least a Carbonite membership on Patreon to "
                +"utilize this feature and be registered in the Mhanndalorian database.  Subscribe to Mhanndalorian Bot at <https://www.patreon.com/MhannUhdea>")
                return 0;
            }        

            //var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
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
                        if(String(row[1]).match(/\d+/) == message.author.id){
                            console.log(message.author.username + " requested flair level QZ")
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
                            if(row[0] >= 100 && row[0] <= 199){
                                message.channel.send("Congratulations!! You have had " + row[0] + " days without missing raids.  You are diamond status!!!!!");
                            }
                            if(row[0] >= 200 && row[0] <= 324){
                                message.channel.send("You are now in possession of the Jedi holodisk.  Use the information on this disc to find the ancient Jedi Scrolls. You have had " + row[0] + " days without missing raids.");
                            }
                            if(row[0] >= 325 && row[0] <= 499){
                                message.channel.send("You now have the ancient Jedi scrolls.  These will lead you to the most powerful Jedi artifact ever created. You have had " + row[0] + " days without missing raids.");
                            }
                            if(row[0] >= 500){
                                message.channel.send("You have found the ancient Jedi artifact:  The eye of the Sun.  Use this artifact to defeat Darth Mhann. You have had " + row[0] + " days without missing raids.");
                            }
                        }
                    });
                }else {
                    console.log('No data found.');
                }
                });
            }       
        }
        else if(message.content.toLowerCase().startsWith(prefix + 'setprefix')){

            if(message.channel.type =='dm')
            {
                message.channel.send("This command can not be run in a direct message. Please run the command on a server.")
                return 0;
            }

            if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][6]))
            {
                message.channel.send("Officer role not set.  Guild leader must set this value using the command " + AllGuildData[GuildFoundRow][7] + "setofficerrole before using this command.")
                return 0;
            }
            
            if(!DetermineIfOwnerOrOfficer(AllGuildData[GuildFoundRow][5], AllGuildData[GuildFoundRow][6], message))
            {
                message.channel.send("You must be an officer to execute setprefix command")
                return 0;
            }            

            var CommandArray = message.content.toLowerCase().split(' ');

            if(CommandArray[1] == undefined)
            {
                message.channel.send("Please specify a prefix after " + prefix + "setprefix.  For example:  " + prefix + "setprefix ?")
                return 0;
            }

            if(CommandArray[1].length != 1)
            {
                message.channel.send("Prefix must be a single character.")
                return 0;
            }

            AllGuildData[GuildFoundRow][7] = CommandArray[1] //set prefix in memory

            authorize(content, listMajors);
            function listMajors(auth)
            {
                const sheets = google.sheets({version: 'v4', auth});
                sheets.spreadsheets.values.update({
                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                    range: 'Guilds!H' + (GuildFoundRow + 2),
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: [[CommandArray[1]]]
                    },
                })
            }
            message.channel.send("Command prefix has been set to: " + CommandArray[1])
        }

        else if(message.content.toLowerCase().startsWith(prefix + 'setuserchannel')){
            if(message.channel.type =='dm')
            {
                message.channel.send("This command can not be run in a direct message. Please run the command on a server.")
                return 0;
            }

            if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][6]))
            {
                message.channel.send("Officer role not set.  Guild leader must set this value using the command " + AllGuildData[GuildFoundRow][7] + "setofficerrole before using this command.")
                return 0;
            }

            if(!DetermineIfOwnerOrOfficer(AllGuildData[GuildFoundRow][5], AllGuildData[GuildFoundRow][6], message))
            {
                message.channel.send("You must be an officer to execute setuserchannel command.")
                return 0;
            }

            var CommandArray = message.content.toLowerCase().split(' ');

            if(CommandArray[1] == undefined)
            {
                message.channel.send("Please specify a channel after !setuserchannel.  For example:  !setuserchannel #guildannouncments")
                return 0;
            }

            if(!CommandArray[1].startsWith("<#"))
            {
                message.channel.send("You must specify a channel after !setuserchannel.")
                return 0;
            }

            var UserChannelArgument = CommandArray[1].replace("<#","").replace(">","")

            const BotRole = message.guild.roles.cache.find(role => role.name === 'Mhanndalorian Bot');

            (async () => {
                var User =  await client.users.fetch('678748334906671145')
                var GuildMember =  await message.guild.members.fetch(User);
                var OldUserChannel = AllGuildData[GuildFoundRow][9]
                var ChannelObject = await client.channels.fetch(UserChannelArgument)

                if(OldUserChannel == UserChannelArgument)
                {
                    await message.channel.send("Error:  User channel is already set to " + ChannelObject.name + ".")
                    return 0;
                }

                try{
                    await ChannelObject.updateOverwrite(BotRole, //Update Mhanndalorian bot permissions in new user channel
                    {   
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true,
                        ADD_REACTIONS: true,
                        EMBED_LINKS: true,
                        ATTACH_FILES: true,
                        MENTION_EVERYONE: true,     
                    });
                }

                catch(e){
                    await message.channel.send("Error 4:  Mhanndalorian bot is unable to view " + ChannelObject.name + " (new user channel) and/or change permissions. Please manually add Mhanndalorian-bot role "
                    + "to this channel and ensure that both the view channel and manage permissions is allowed.")
                    return 0;
                }
                
                AllGuildData[GuildFoundRow][9] = UserChannelArgument; //set user channel in memory

                authorize(content, listMajors);
                function listMajors(auth)
                {
                    const sheets = google.sheets({version: 'v4', auth});
                    sheets.spreadsheets.values.update({
                        spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                        range: 'Guilds!J' + (GuildFoundRow + 2),
                        valueInputOption: 'USER_ENTERED',
                        resource: {
                            values: [[UserChannelArgument]]
                        },
                    })
                }

                message.channel.send("User channel has been set to: <#" + UserChannelArgument + ">")

                if(!CheckIfBlankOrUndefined(OldUserChannel))//Remove Mhanndalorian read permission from old user channel
                {          
                    var ChannelObject = await client.channels.fetch(OldUserChannel)
                    try{
                        await ChannelObject.updateOverwrite(BotRole,
                        {   
                            VIEW_CHANNEL: false, 
                        })
                    }
                    catch(e){
                        await message.channel.send("Error 5:  Mhanndalorian bot was unable to edit permissions in " + ChannelObject.name + " (old user channel) to ensure view channel permission is off.")
                    }
                }
            })()                                
        }

        else if(message.content.toLowerCase().startsWith(prefix + 'setofficerchannel')){
            if(message.channel.type =='dm')
            {
                message.channel.send("This command can not be run in a direct message. Please run the command on a server.")
                return 0;
            }

            if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][6]))
            {
                message.channel.send("Officer role not set.  Guild leader must set this value using the command " + AllGuildData[GuildFoundRow][7] + "setofficerrole before using this command.")
                return 0;
            }

            if(!DetermineIfOwnerOrOfficer(AllGuildData[GuildFoundRow][5], AllGuildData[GuildFoundRow][6], message))
            {
                message.channel.send("You must be an officer to execute setofficerchannel command.")
                return 0;
            }

            var CommandArray = message.content.toLowerCase().split(' ');

            if(CommandArray[1] == undefined)
            {
                message.channel.send("Please specify a channel after !setofficerchannel.  For example:  !setofficerchannel #officerannouncments")
                return 0;
            }

            if(!CommandArray[1].startsWith("<#"))
            {
                message.channel.send("You must specify a channel after !setofficerchannel.")
                return 0;
            }

            var OfficerChannelArgument = CommandArray[1].replace("<#","").replace(">","")
            const BotRole = message.guild.roles.cache.find(role => role.name === 'Mhanndalorian Bot');

            (async () => {
                var User =  await client.users.fetch('678748334906671145')
                var GuildMember =  await message.guild.members.fetch(User);
                var OldOfficerChannel = AllGuildData[GuildFoundRow][10]
                var ChannelObject = await client.channels.fetch(OfficerChannelArgument) 

                if(OldOfficerChannel == OfficerChannelArgument)
                {
                    await message.channel.send("Error:  Officer channel is already set to " + ChannelObject.name + ".")
                    return 0;
                }
            
                try{
                    await ChannelObject.updateOverwrite(BotRole, //Update Mhanndalorian bot permissions in new officer channel
                    {   
                        SEND_MESSAGES: true,
                        READ_MESSAGE_HISTORY: true,
                        ADD_REACTIONS: true,
                        EMBED_LINKS: true,
                        ATTACH_FILES: true,
                        MENTION_EVERYONE: true,     
                    })
                }
                catch(e){
                    await message.channel.send("Error 2:  Mhanndalorian bot is unable to view " + ChannelObject.name + " (new officer channel) and/or change permissions. Please manually add Mhanndalorian-bot role "
                    + "to this channel and ensure that both the view channel and manage permissions is allowed.")
                    return 0;
                }

                AllGuildData[GuildFoundRow][10] = OfficerChannelArgument; //set new officer channel in memory
            
                authorize(content, listMajors);
                function listMajors(auth)
                {
                    const sheets = google.sheets({version: 'v4', auth});
                    sheets.spreadsheets.values.update({
                        spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                        range: 'Guilds!K' + (GuildFoundRow + 2),
                        valueInputOption: 'USER_ENTERED',
                        resource: {
                            values: [[OfficerChannelArgument]]
                        },
                    })
                }

                message.channel.send("Officer channel has been set to: <#" + OfficerChannelArgument + ">")

                if(!CheckIfBlankOrUndefined(OldOfficerChannel))//Remove Mhanndalorian read permission from old channel officer channel
                {          
                    var ChannelObject = await client.channels.fetch(OldOfficerChannel)
                    try{
                        await ChannelObject.updateOverwrite(BotRole,
                        {   
                            VIEW_CHANNEL: false, 
                        })
                    }
                    catch(e){
                        await message.channel.send("Error 3:  Mhanndalorian bot was unable to edit permissions in " + ChannelObject.name + " (old officer channel) to ensure view channel permission is off.")
                    }
                }
            })()
        }

        else if(message.content.toLowerCase().startsWith(prefix + 'setswgohurl')){
            if(message.channel.type =='dm')
            {
                message.channel.send("This command can not be run in a direct message. Please run the command on a server.")
                return 0;
            }

            if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][6]))
            {
                message.channel.send("Officer role not set.  Guild leader must set this value using the command " + AllGuildData[GuildFoundRow][7] + "setofficerrole before using this command.")
                return 0;
            }

            if(!DetermineIfOwnerOrOfficer(AllGuildData[GuildFoundRow][5], AllGuildData[GuildFoundRow][6], message))
            {
                message.channel.send("You must be an officer to execute setswgohurl command")
                return 0;
            }

            var CommandArray = message.content.toLowerCase().split(' ');

            if(CommandArray[1] == undefined)
            {
                message.channel.send("Please specify SWGOH URL for your guild.")
                return 0
            }

            var SWGOHID = CommandArray[1].match(/[0-9]+/);

            (async () => {
                var Result = await fetch("https://swgoh.gg/api/guild/" + SWGOHID[0],
                    {
                        method: 'GET',
                    }).then(function (response) {
                        return response.json()
                    })

                    if(Result.data == undefined)
                    {
                        message.channel.send("Guild ID: " + SWGOHID[0] + " not found." )
                        return 0;
                    }        
        
                    AllGuildData[GuildFoundRow][2] = "https://swgoh.gg/api/guild/" + SWGOHID[0]//set SWGOH page in memory

                    authorize(content, listMajors);
                    function listMajors(auth)
                    {
                        const sheets = google.sheets({version: 'v4', auth});
                        sheets.spreadsheets.values.update({
                            spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                            range: 'Guilds!C' + (GuildFoundRow + 2),
                            valueInputOption: 'USER_ENTERED',
                            resource: {
                                values: [[AllGuildData[GuildFoundRow][2]]]
                            },
                        })

                        message.channel.send("Success! Guild ID has been set to: \n" + "   **ID:** " + SWGOHID[0] + "\n   **Name:** " + Result.data.name + "\n\nIf this is incorrect, please run command again.")

                        const SheetID = AllGuildData[GuildFoundRow][3];
    
                        var NamesAndCodes = new Array(54);
    
                        for (var i = 0; i < NamesAndCodes.length; i++) { 
                            NamesAndCodes[i] = new Array(2);
                            NamesAndCodes[i][0] = '';
                            NamesAndCodes[i][1] = '';
                        }

                        var today = new Date();
                        var month = today.getMonth() + 1
                        var day = today.getDate()
                        var year = today.getFullYear()

                        var InitialData = new Array(54)
                        for(var i = 0; i < InitialData.length; i++)
                            InitialData[i] = new Array(21);
    
                        for(var i = 0; i < Result.players.length; i++)
                        {
                            NamesAndCodes[i][0] = Result.players[i].data.name
                            NamesAndCodes[i][1] = Result.players[i].data.ally_code

                            InitialData[i][0] = Result.players[i].data.ally_code
                            InitialData[i][3] = month + "/" + day + "/" + year
                            InitialData[i][8] = '0'
                            InitialData[i][20] = 'Y'
                        }
    
                        sheets.spreadsheets.values.update({
                            spreadsheetId: SheetID,
                            range: 'XML Data!A3:B56',  
                            valueInputOption: 'USER_ENTERED',
                            resource: {
                                values: NamesAndCodes
                            },
                        })
    
                        var time = new Date().toLocaleTimeString()
                        var date = new Date().toLocaleDateString()
    
                        sheets.spreadsheets.values.update({
                            spreadsheetId: SheetID,
                            range: 'Guild Members & Data!C122',  
                            valueInputOption: 'RAW',
                            resource: {
                                values: [[date + " " + time]]
                            },
                        })

                        sheets.spreadsheets.values.update({
                            spreadsheetId: SheetID,
                            range: 'Guild Members & Data!A66',  
                            valueInputOption: 'USER_ENTERED',
                            resource: {
                                values: InitialData
                            },
                        })
                    }
            })()
        }

        else if(message.content.toLowerCase().startsWith(prefix + 'setuserrole')){
            if(message.channel.type =='dm')
            {
                message.channel.send("This command can not be run in a direct message. Please run the command on a server.")
                return 0;
            }

            if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][6]))
            {
                message.channel.send("Officer role not set.  Guild leader must set this value using the command " + AllGuildData[GuildFoundRow][7] + "setofficerrole before using this command.")
                return 0;
            }

            if(!DetermineIfOwnerOrOfficer(AllGuildData[GuildFoundRow][5], AllGuildData[GuildFoundRow][6], message))
            {
                message.channel.send("You must be an officer to execute setuserrole command")
                return 0;
            }

            var CommandArray = message.content.toLowerCase().split(' ');

            if(CommandArray[1] == undefined)
            {
                message.channel.send("Please specify a role after !setuserrole.  For example:  !setuserrrole @StandardUserRole")
                return 0;
            }

            if(!CommandArray[1].startsWith("<@&"))
            {
                message.channel.send("You must specify a role after !setuserrole.")
                return 0;
            }

            var UserRoleIDArgument = CommandArray[1].replace("<@&","").replace(">","")

            AllGuildData[GuildFoundRow][8] = UserRoleIDArgument //set user role in memory
            
            authorize(content, listMajors);
            function listMajors(auth)
            {
                const sheets = google.sheets({version: 'v4', auth});
                sheets.spreadsheets.values.update({
                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                    range: 'Guilds!I' + (GuildFoundRow + 2),
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: [[UserRoleIDArgument]]
                    },
                })
            }
            message.channel.send("User role has been set to: <@&" + UserRoleIDArgument + ">")
        }

        else if(message.content.toLowerCase().startsWith(prefix + 'setofficerrole')){
            (async () => {
                if(message.channel.type =='dm')
                {
                    message.channel.send("This command can not be run in a direct message. Please run the command on a server.")
                    return 0;
                }

                var ServerOwnerID = AllGuildData[GuildFoundRow][5]

                if(ServerOwnerID != message.author.id)
                {
                    message.channel.send("You must be server owner to execute this command.")
                    return 0;
                }

                var CommandArray = message.content.toLowerCase().split(' ');

                if(CommandArray[1] == undefined)
                {
                    message.channel.send("Please specify a role after !setofficerrole.  For example:  !setofficerrole @leaders")
                    return 0;
                }

                if(!CommandArray[1].startsWith("<@&"))
                {
                    message.channel.send("You must specify a role after !setofficerrole.")
                    return 0;
                }

                var OfficerRoleIDArgument = CommandArray[1].replace("<@&","").replace(">","")

                AllGuildData[GuildFoundRow][6] = OfficerRoleIDArgument //set officer role in memory
                
                authorize(content, listMajors);
                function listMajors(auth)
                {
                    const sheets = google.sheets({version: 'v4', auth});
                    sheets.spreadsheets.values.update({
                        spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                        range: 'Guilds!G' + (GuildFoundRow + 2),
                        valueInputOption: 'USER_ENTERED',
                        resource: {
                            values: [[OfficerRoleIDArgument]]
                        },
                    })
                }
                message.channel.send("Officer role has been set to: <@&" + OfficerRoleIDArgument + ">")
            })();
        }

        else if((message.content.toLowerCase().startsWith(`${prefix}full`)) && (wookieGuild)){
            const guild = client.guilds.cache.get("505515654833504266");
            const role = guild.roles.cache.find(role => role.name === 'Bandits+');

            (async () => {
                var User =  await client.users.fetch(message.author.id)
                var GuildMember =  await guild.members.fetch(User);

                if(!GuildMember.roles.cache.has("746368348052258900"))
                {
                    GuildMember.roles.add(role);
                    message.reply("You will now have access to all notifications and channels!")
                    console.log(message.author.username + " is now receiving all channels and notifications QZ")                   
                }
                else
                {
                    message.reply("You already have access to all notifications and channels!")
                }
            })()
        }

        else if((message.content.toLowerCase().startsWith(`${prefix}light`)) && (wookieGuild)){
            const guild = client.guilds.cache.get("505515654833504266");
            const role = guild.roles.cache.find(role => role.name === 'Bandits+');

            (async () => {
                var User =  await client.users.fetch(message.author.id)
                var GuildMember =  await guild.members.fetch(User);

                if(!GuildMember.roles.cache.has("746368348052258900"))
                {
                    message.reply("You already have only the essential channels and notifications!")                    
                }
                else
                {
                    GuildMember.roles.remove(role);
                    message.reply("You will now only have access to essential channels and notifications!")
                    console.log(message.author.username + " is now receiving only essential channels and notifications QZ")
                }
            })()
        }

        else if((message.content.toLowerCase().startsWith(`${prefix}alert`)) && (wookieGuild || message.channel.type=='dm')){
            var CommandArray = message.content.toLowerCase().split(' ');
            var Proceed;

            if(CommandArray[1] == "raid")
            {
                if(CommandArray[2] == "subscribe" || CommandArray[2] == "unsubscribe")
                    Proceed = true;
                else
                {
                    message.channel.send("Second argument must be either subscribe or unsubscribe")
                    Proceed = false;
                }
            }
            else
            {
                message.channel.send("First argument must be the word raid")
                Proceed = false;
            }

            if(Proceed == true)
            {
                //var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
                authorize(content, listMajors);

                function listMajors(auth)
                {
                    const sheets = google.sheets({version: 'v4', auth});
                    sheets.spreadsheets.values.get(
                    {
                        spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                        range: 'Guild Members & Data!G66:U119',
                    }, (err, res) => {
                            if (err) return console.log('The API returned an error: ' + err);
                            rows = res.data.values;
                            var UserRow;

                            for(var i = 0; i < rows.length; i++)
                                if(rows[i][0].replace("<@","").replace(">","").replace(" ","") == message.author.id)
                                {
                                    UserRow = i;
                                    i = rows.length
                                }
                            if(CommandArray[2] == "subscribe")
                            {
                                if(rows[UserRow][14] == 'Y')
                                    message.channel.send("You are already subscribed to 5 minute raid reminder.")
                                else
                                {
                                    sheets.spreadsheets.values.update({
                                        spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                        range: 'Guild Members & Data!U' + (UserRow + 66),
                                        valueInputOption: 'USER_ENTERED',
                                        resource: {
                                            values: [["Y"]]
                                        },
                                    })

                                    message.channel.send("You have sucessfully subscribed to the 5 minute raid reminder.")
                                    console.log("Subscribe to 5 minute raid reminder QZ")
                                }
                            }
                            
                            if(CommandArray[2] == "unsubscribe")
                            {
                                if(rows[UserRow][14] == 'N')
                                    message.channel.send("You are already unsubscribed from the 5 minute raid reminder.")
                                else
                                {
                                sheets.spreadsheets.values.update({
                                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                    range: 'Guild Members & Data!U' + (UserRow + 66),
                                    valueInputOption: 'USER_ENTERED',
                                    resource: {
                                        values: [["N"]]
                                    },
                                })

                                message.channel.send("You have sucessfully unsubscribed from the 5 minute raid reminder.")
                                console.log("Unsubscribe from 5 minute raid reminder QZ")
                            }

                            }
                        }
                    )
                }
            }
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}test`))
        {
        //   PostWeeklyGPPerformanceIndividual(AllGuildData)

        // dmUsersMissedRaids()

        //UpdateTotalGP();

        //PostWeeklyGuildGP()
        //FiveMinRaidReminder()
        //newFlairAnncouncment
        

        //RestartHerokuDyno()

        //CleanMIA()
        UpdateUsersAndAllycodes()
          

        //console.log(GetSubscribers(AllGuildData,GuildFoundRow))

        //UpdateTotalGP()

         // guild = client.guilds.cache.get("399955359801802762")
         // const BotRole = guild.roles.cache.find(role => role.name === 'Mhanndalorian Bot');

           //UpdateUsersAndAllycodes();

          // console.log(AllGuildData)
          //  UpdateTotalGP();
          //FiveMinRaidReminder();
            //PostWeeklyGuildGP();

            //for(var i = 0; i < AllGuildData.length; i++)
            //{
            //    PostWeeklyGPPerformanceIndividual(AllGuildData, i)
            //}

           //UpdateUsersAndAllycodes();

           //console.log(message.channel.parent.id)

            //const connection = await message.member.voice.channel.join();

           // const SkynetChannel = client.channels.cache.get("790686339518562344")
           // SkynetChannel.join();
        }
        
        else if((message.content.toLowerCase().startsWith(`${prefix}help`))){
            if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][6], AllGuildData[GuildFoundRow][8]))
            {
                message.channel.send("Officer role and/or user role not set.  An officer must set these values using the commands  **" + AllGuildData[GuildFoundRow][7] + "setuserrole @YourUserRole**  and/or  **"
                + AllGuildData[GuildFoundRow][7] + "setofficerrole @YourOfficerRole**  before others can use use this command.")

                if(message.author.id != AllGuildData[GuildFoundRow][5])
                {
                    return 0;
                }
            }

            if(wookieGuild)
            {
                (async () => {
                    if(message.channel.type == 'dm')
                    {
                        message.channel.send("This command can not be run in a direct message. Please run the command on a server.")
                        return 0;
                    }
                    
                    const guild = client.guilds.cache.get(AllGuildData[GuildFoundRow][1]); 
                    var User =  await client.users.fetch(message.author.id)
                    var GuildMember =  await guild.members.fetch(User);

                    console.log(message.author.username + " asked for help. QZ")            

                    if(message.author.id == "406945430967156766")
                    {
                        const Embed3 = new Discord.MessageEmbed()
                            .setColor('ff0000')
                            .setTitle('Commands available to Mhann Uhdea (not case sensitive)')
                            .setDescription("All commands start with " + prefix + ".  If a command has *arg* after it, it requires an argument.\n\n"
                                + "__**" + prefix + "broadcast**__ __***arg***__ - Post a message to the cantina.  *Arg* is a string. \n \n"
                                + "__**" + prefix + "demote**__ - Restore regular role after command testing. \n \n"
                                + "__**" + prefix + "dmmissedraids**__ - Send direct message to all users who have missed raids. \n \n"
                                + "__**" + prefix + "info**__ - Display information about the servers the bot is installed on. \n \n"
                                + "__**" + prefix + "promote**__ - Elevate role for command testing. \n \n"
                                + "__**" + prefix + "updateflair**__ - Update flair for everyone in guild.");
                        message.channel.send(Embed3)
                    }

                    if(GuildMember.roles.cache.has(AllGuildData[GuildFoundRow][6]))
                    {
                        const Embed2 = new Discord.MessageEmbed()
                            .setColor('#3495D5')
                            .setTitle('Commands available to those with ' + message.guild.roles.cache.get(AllGuildData[GuildFoundRow][6]).name + ' role (not case sensitive)')
                            .setDescription("All commands start with " + prefix + ".  If a command has *arg* after it, it requires an argument.\n\n"

                                + "The following commands are used to setup the bot.  Each command must be run one time for the bot to be full functional. \n"

                                + "> __**" + prefix + "setofficerchannel**__ __** #OFCChannel**__ - Sets the channel that Mhanndalorian bot will use for officer announcements. \n"
                                + "> __**" + prefix + "setofficerrole**__ __** @OFCRole**__ - Sets the role that designates a user as an officer. \n"
                                + "> __**" + prefix + "setprefix**__ __***arg***__ - Sets the prefix used for Mhanndalorian Bot commands.  Can only be run by server owner.  Default prefix is !.  Replace arg with a single character. \n"
                                + "> __**" + prefix + "setuserchannel**__ __** #UserChannel**__ - Sets the channel that Mhanndalorian bot will use for guild wide announcements. \n"
                                + "> __**" + prefix + "setuserrole**__ __** @UserRole**__ - Sets the role that designates a user as a member of the guild in game. \n\n"

                                + "__**" + prefix + "addgif**__, __***arg1***__, __***arg2***__, __***arg3***__, __***arg4***__ - Command to add "
                                + "GIF to databse. *Arg1* is the keyword to trigger GIF. *Arg2* is the phrase to search for on Giphy. *Arg3* is the "
                                + "title displayed on the GIF. *Arg4* is the category and must be either wrestling, star wars or other.\n\n"
                                + "__**" + prefix + "award**__ __***arg***__ @user1 @user2 - Award flair to user. *Arg* can be TWO (TW Offensive) or "
                                + "TWD (TW Defensive).  You can mention as many users as you want after the argument. \n");
                        message.channel.send(Embed2)

                        const Embed3 = new Discord.MessageEmbed()
                        .setColor('#3495D5')
                        .setDescription(
                                  "__**" + prefix + "clean**__ __***arg***__ - Deletes a specified number of messages from the current channel. "
                                + "*Arg* is the number of messages to delete and must be an integer less than or equal to 100. \n \n"
                                + "__**" + prefix + "delgif**__ __***arg***__ - Command to remove GIF from database. *Arg* is the keyword to "
                                + "remove \n \n"

                                + "__**" + "eb.UserAllyCode.register @DiscordUser**__ - Used to register a specific Discord user & ally code for Mhanndalorian Bot.  No dashes in ally code (eb.123456789.register). \n\n"
                                + "__**" + "eb.UserAllyCode.unregister @DiscordUser**__ - Used to unregister a specific Discord user & ally code from Mhanndalorian Bot.  No dashes in ally code (eb.123456789.unregister). \n\n"

                                + "__**" + prefix + "gp**__ - Command used to display graph of galactic power.  In addition to the ways this command can be "
                                + "run as a regular guild member, officers have access to the following 2 command options: \n"

                                + "> __**" + prefix + "gp @DiscordUser**__ - The entire GP history for a specific user will be displayed. \n"
                                + "> __**" + prefix + "gp @DiscordUser n**__ - Display GP history back up to n days for specific user (replace n with a number of days). \n \n"
                                
                                + "__**" + prefix + "status**__ - Displays date and time bot was launched along with total up time. \n \n "
                                + "__**" + prefix + "nuke**__ - Command to completely clear a channel.  Only works in the recruiting and Cynydes barrel "
                                + "channels. \n");
                        message.channel.send(Embed3)
                    }

                    const Embed = new Discord.MessageEmbed()
                        .setColor('#2FC071')
                        .setTitle('Commands available to those with ' + message.guild.roles.cache.get(AllGuildData[GuildFoundRow][8]).name + ' role (not case sensitive)')
                        .setDescription("All commands start with either" + prefix + " or eb.  If a command has *arg* after it, it requires an argument.\n\n"
                            + "__**" + prefix + "alert**__ __***arg1***__ __***arg2***__ - Subscribes or unsubscribes you from a reminder. "
                            + "*Arg1* must be the word raid. *Arg2* can be the word subscribe or unsubscribe. \n\n"
                            + "__**" + "eb.YourAllyCode.register**__ - Used to register yourself for Mhanndalorian Bot.  No dashes in ally code (eb.123456789.register). \n\n"
                            + "__**" + "eb.YourAllyCode.unregister**__ - Used to unregister yourself from Mhanndalorian Bot.  No dashes in ally code (eb.123456789.unregister). \n\n"
                            + "__**" + prefix + "flair**__ - Display number of consecutive days without missing a raid. \n \n"
                            + "__**" + prefix + "full**__ - Receive all notifications and access to all channels. \n \n"
                            + "__**" + prefix + "gifs**__ - Display all the keywords that will trigger a GIF image. \n \n"
                            + "__**" + prefix + "gp**__ - Command used to display graph of galactic power.  The command can be run in the following ways: \n"

                            + "> __**" + prefix + "gp**__ - Your entire GP history will be displayed. \n"
                            + "> __**" + prefix + "gp n**__ - Will display your GP history back up to n days (replace n with a number of days). \n "
                            + "> __**" + prefix + "gp guild**__ - Display all GP history for the entire guild. \n "
                            + "> __**" + prefix + "gp guild n**__ - Display GP history back up to n days for entire guild (replace n with a number of days). \n \n"

                            + "__**" + prefix + "help**__ - Display this help message. \n \n"
                            + "__**" + prefix + "light**__ - Receive only essential notifications and access to a streamlined set of channels. \n \n"
                            + "__**" + prefix + "lookup**__ __***arg***__ - Looks up a user by SWGOH name, SWGOH Ally Code, or Discord Name. *Arg* can "
                            + "be a SWGOH name, ally code, or discord name.  Partial input is ok. \n \n"
                            + "__**" + prefix + "santa**__ - Display a link to a live Santa tracker. \n \n "
                            + "__**" + prefix + "skynet**__ - Propaganda video for skynet. \n \n ");
                    message.channel.send(Embed)
                })()
            }
            else
            {
                (async () => {
                    if(message.channel.type == 'dm')
                    {
                        message.channel.send("This command can not be run in a direct message. Please run the command on a server.")
                        return 0;
                    }
                    
                    const guild = client.guilds.cache.get(AllGuildData[GuildFoundRow][1]); 
                    var User =  await client.users.fetch(message.author.id)
                    var GuildMember =  await guild.members.fetch(User);

                    console.log(message.author.username + " asked for help. QZ")            

                    if(message.author.id == AllGuildData[GuildFoundRow][5] || GuildMember.roles.cache.has(AllGuildData[GuildFoundRow][6]))
                    {
                        var color;
                        var title;

                        if(!CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][6]))
                            color =  message.guild.roles.cache.get(AllGuildData[GuildFoundRow][6]).hexColor
                        else
                            color = '#3495D5'

                        if(!CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][6]))
                            title = 'Commands available to those with ' + message.guild.roles.cache.get(AllGuildData[GuildFoundRow][6]).name + ' role (not case sensitive)'
                        else
                            title = 'Commands available to those with officer role (not case sensitive)'

                        const Embed2 = new Discord.MessageEmbed()
                            .setColor(color)
                            .setTitle(title)
                            .setDescription("All commands start with either" + prefix + " or eb.  If a command has *arg* after it, it requires an argument.\n\n"
                                + "The following commands are used to setup the bot.  Each command must be run one time (unless a default value is provided) for the bot to be full functional. \n"

                                + "> __**" + prefix + "setofficerchannel**__ __** #OFCChannel**__ - Sets the channel that Mhanndalorian bot will use for officer announcements. \n"
                                + "> __**" + prefix + "setofficerrole**__ __** @OFCRole**__ - Sets the role that designates a user as an officer. \n"
                                + "> __**" + prefix + "setprefix**__ __***arg***__ - Sets the prefix used for Mhanndalorian Bot commands.  Can only be run by server owner.  Default prefix is !.  Replace arg with a single character. \n"
                                + "> __**" + prefix + "setuserchannel**__ __** #UserChannel**__ - Sets the channel that Mhanndalorian bot will use for guild wide announcements.  Default is the Mhanndalorian-Bot channel. \n"
                                + "> __**" + prefix + "setuserrole**__ __** @UserRole**__ - Sets the role that designates a user as a member of the guild in game. \n"
                                + "> __**" + prefix + "setswgohurl**__ __** arg**__ - Sets SWGOH URL.  Replace arg with the link to your guild's SWGOH.GG page. \n\n"

                                + "__**" + "eb.UserAllyCode.register @DiscordUser**__ - Used to register a specific Discord user & ally code for Mhanndalorian Bot.  No dashes in ally code (eb.123456789.register). \n\n"
                                + "__**" + "eb.UserAllyCode.unregister @DiscordUser**__ - Used to unregister a specific Discord user & ally code from Mhanndalorian Bot.  No dashes in ally code (eb.123456789.unregister). \n\n"
                                
                                + "__**" + prefix + "gp**__ - (PATREON only) - Command used to display graph of galactic power.  In addition to the ways this command can be "
                                + "run as a regular guild member, officers have access to the following 2 command options: \n"

                                + "> __**" + prefix + "gp @DiscordUser**__ - (PATREON only) - The entire GP history for a specific user will be displayed. \n"
                                + "> __**" + prefix + "gp @DiscordUser n**__ - (PATREON only) - Display GP history back up to n days for specific user (replace n with a number of days). \n \n");
                        message.channel.send(Embed2)
                    }

                    var color;
                    var title;

                    if(!CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][8]))
                        color =  message.guild.roles.cache.get(AllGuildData[GuildFoundRow][8]).hexColor
                    else
                        color = '#2FC071'

                    if(!CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][8]))
                        title = 'Commands available to those with ' + message.guild.roles.cache.get(AllGuildData[GuildFoundRow][8]).name + ' role (not case sensitive)'
                    else
                        title = 'Commands available to those with standard user role (not case sensitive)'

                    const Embed = new Discord.MessageEmbed()
                        .setColor(color)                        
                        .setTitle(title)
                        .setDescription("All commands start with either " + prefix + " or eb.  If a command has *arg* after it, it requires an argument.\n\n"
                            + "__**" + "eb.YourAllyCode.register**__ - Used to register yourself for Mhanndalorian Bot.  No dashes in ally code (eb.123456789.register). \n\n"
                            + "__**" + "eb.YourAllyCode.unregister**__ - Used to unregister yourself from Mhanndalorian Bot.  No dashes in ally code (eb.123456789.unregister). \n\n"
                            + "__**" + prefix + "gp**__ - (PATREON only) - Command used to display graph of galactic power.  The command can be run in the following ways: \n"

                            + "> __**" + prefix + "gp**__ - (PATREON only) - Your entire GP history will be displayed. \n"
                            + "> __**" + prefix + "gp n**__ - (PATREON only) - Will display your GP history back up to n days (replace n with a number of days). \n "
                            + "> __**" + prefix + "gp guild**__ - (PATREON only) - Display all GP history for the entire guild. \n "
                            + "> __**" + prefix + "gp guild n**__ - (PATREON only) - Display GP history back up to n days for entire guild (replace n with a number of days). \n \n"

                            + "__**" + prefix + "gpcompare**__ - (PATREON only) - Command used to display graph that compares galactic power of members.  The user argument can be an allycode, Discord name, or SWGOH name.  Partial input is ok.  The command can be run in the following ways: \n"
                            + "> __**" + prefix + "gpcompare user1 user 2**__ - (PATREON only) - Compare galactic power history of user1 & user2. \n"
                            + "> __**" + prefix + "gpcompare user1 user 2 n**__ - (PATREON only) - Compare galactic power history of user1 & user2 up to n days back (replace n with a number of days). \n "
                            + "> __**" + prefix + "gpcompare user1 user2 user 3**__ - (PATREON only) -  Compare galactic power history of user1, user2 & user3. \n "
                            + "> __**" + prefix + "gpcompare user1 user2 user3 n**__ - (PATREON only) - Compare galactic power history of user1, user2 & user3 up to n days back (replace n with a number of days). \n \n"

                            + "__**" + prefix + "help**__ - Display this help message. \n \n"
                            + "__**" + prefix + "lookup**__ __***arg***__ - Looks up a user by SWGOH name, SWGOH Ally Code, or Discord Name. *Arg* can "
                            + "be a SWGOH name, ally code, or discord name.  Partial input is ok. \n \n");
                    message.channel.send(Embed)
                })()
            }
        }
        else if(message.content.toLowerCase().startsWith(`${prefix}gpcompare`))
        {
            console.log(message.author.username + " executed the gpcompare command.")
            if(message.channel.type == 'dm')
            {
                message.channel.send("This command can not be run in a direct message. Please run the command on a server.")
                return 0;
            }

            if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][8]))
            {
                message.channel.send("User role not set.  An officer must set this value using the command " + AllGuildData[GuildFoundRow][7] + "setuserrole before using this command.")
                return 0;
            }

            if(CheckMemberPatreonStatus(message.author.id) < 1)
            {
                message.channel.send("Could not execute gpcompare command.  You must have at least a Carbonite membership on Patreon to "
                +"utilize this feature and be registered in the Mhanndalorian database.  Subscribe to Mhanndalorian Bot at <https://www.patreon.com/MhannUhdea>")
                return 0;
            }

            if(DetermineIfGuildMemberOrOfficer(AllGuildData[GuildFoundRow][8], AllGuildData[GuildFoundRow][6], message)) //Must be a standard user or officer
            {
                var CommandArray = message.content.split(' ');

                if(CommandArray.length <= 2 || CommandArray.length >= 6)
                {
                    message.channel.send("You must specify 2 or 3 users to compare.  Replace # with number of days of history to display.  For example: \n"
                    + "**" + "   " + prefix + "gpcompare user1 user2**\n"
                    + "**" + "   " + prefix + "gpcompare user1 user2 #**\n"
                    + "**" + "   " + prefix + "gpcompare user1 user2 user3 **\n"
                    + "**" + "   " + prefix + "gpcompare user1 user2 user 3 #**\n")
                    return 0;
                }

                if(!isNaN(CommandArray[1]) && CommandArray[1] < 999)
                {
                    message.channel.send("The number entered for the first argument is too small.  When searching by allycode, you must enter at least 4 digits.")
                    return 0;
                }

                if(!isNaN(CommandArray[2]) && CommandArray[2] < 999)
                {
                    message.channel.send("The number entered for the first argument is too small.  When searching by allycode, you must enter at least 4 digits.")
                    return 0;
                }

                if(CommandArray.length == 5 && isNaN(CommandArray[4]))
                {
                    message.channel.send("When specifying 4 arguments to gpcompare function, the last one must be a number.")
                    return 0;
                }

                else(Lookup(message,'gpcompare',AllGuildData,GuildFoundRow))

            }
            else
                message.channel.send("You must be assigned the " + message.guild.roles.cache.get(AllGuildData[GuildFoundRow][8]).name + " role to execute this command.")
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}gp`))
        {
            if(message.channel.type == 'dm')
            {
                message.channel.send("This command can not be run in a direct message. Please run the command on a server.")
                return 0;
            }

            if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][8]))
            {
                message.channel.send("User role not set.  An officer must set this value using the command " + AllGuildData[GuildFoundRow][7] + "setuserrole before using this command.")
                return 0;
            }

            var CommandArray = message.content.split(' ');
            var TrialCheck = true

            if(CheckMemberPatreonStatus(message.author.id) >= 1 || (CommandArray[1] != undefined && CommandArray[1].toLowerCase() == 'guild'))
                TrialCheck = false

            if(TrialCheck)
            {
                var TrialStatus =  await GetMemberTrialStatus(AllGuildData, GuildFoundRow, message, false)
                if(TrialStatus <= 0)
                {
                    message.channel.send("Could not execute gp command.  You must have at least a Carbonite membership on Patreon to "
                    +"utilize this feature and be registered in the Mhanndalorian database.  Subscribe to Mhanndalorian Bot at <https://www.patreon.com/MhannUhdea>")
                    return 0;
                }
            }

            if(DetermineIfGuildMemberOrOfficer(AllGuildData[GuildFoundRow][8], AllGuildData[GuildFoundRow][6], message)) //Must be a standard user or officer
            {
                if(CommandArray[1] != undefined) //user entered something after gp command
                {
                    if(isNaN(CommandArray[1]))
                    {
                        if(CommandArray[1].toLowerCase() != 'guild') //user entered guild member name
                        {
                            if(CheckIfBlankOrUndefined(AllGuildData[GuildFoundRow][6]))
                            {
                                message.channel.send("Officer role not set.  Guild leader must set this value using the command " + AllGuildData[GuildFoundRow][7] + "setofficerrole before using this command.")
                                return 0;
                            }

                            if(message.channel.type != 'dm' && DetermineIfOwnerOrOfficer(AllGuildData[GuildFoundRow][5], AllGuildData[GuildFoundRow][6], message)) //must be an officer
                                Lookup(message, 'GP', AllGuildData, GuildFoundRow)
                            else
                                message.channel.send("This command must be executed by an officer in a channel on the server.")
                        }
                        else //First argument was the word guild
                        {
                            if(CommandArray[2] == undefined) //No number of days specified after guild
                                GP(message, 'guildGP', CommandArray[2], AllGuildData, GuildFoundRow)
                            else
                            {
                                if(!isNaN(CommandArray[2]) && CommandArray[2] > 0) //number of days specified after guild
                                    GP(message, 'guildGP', CommandArray[2], AllGuildData, GuildFoundRow)
                                else
                                    message.channel.send("Please specify a number of days greater than 0.")
                            }
                        }
                            
                    }
                    else
                        if(CommandArray[1] > 0 && CommandArray[1] < 9999999)
                            GP(message, message.author.id, CommandArray[1], AllGuildData, GuildFoundRow)
                        else if(CommandArray[1] > 9999999)
                            Lookup(message, 'GP', AllGuildData, GuildFoundRow)
                        else
                            message.channel.send("Please specify a number of days greater than 0.")
                }
                else //no argument provided (standard GP command)
                    GP(message, message.author.id, undefined, AllGuildData, GuildFoundRow)
            }
            else
                message.channel.send("You must be assigned the " + message.guild.roles.cache.get(AllGuildData[GuildFoundRow][8]).name + " role to execute this command.")
        }

        else if((message.content.toLowerCase().startsWith(`${prefix}gifs`)) && (wookieGuild || message.channel.type=='dm')){
            var Wrestling = "";
            var StarWars = "";
            var Other = "";

            console.log(message.author.username + " asked for GIF help. QZ")

            for(var i = 0; i < GIFData.length; i++)
            {
                if(GIFData[i][4] == "wrestling")
                    if(GIFData[i][1] == "")
                        Wrestling = Wrestling + GIFData[i][0] + ","
                    else
                        Wrestling = Wrestling + GIFData[i][0] + " (" + GIFData[i][1] + "),"

                else if(GIFData[i][4] == "star wars")
                    if(GIFData[i][1] == "")
                        StarWars = StarWars + GIFData[i][0] + ","
                    else
                        StarWars = StarWars + GIFData[i][0] + " (" + GIFData[i][1] + "),"
                
                else if(GIFData[i][4] == "other")
                    if(GIFData[i][1] == "")
                        Other = Other + GIFData[i][0] + ","
                    else
                        Other = Other + GIFData[i][0] + " (" + GIFData[i][1] + "),"
            }           
            Wrestling = Wrestling.slice(0,-1)
            Wrestling = Wrestling.split(",").sort().join(",").replace(/,/g,", ")

            StarWars = StarWars.slice(0,-1)
            StarWars = StarWars.split(",").sort().join(",").replace(/,/g,", ")

            Other = Other.slice(0,-1)
            Other = Other.split(",").sort().join(",").replace(/,/g,", ")

            const Embed = new Discord.MessageEmbed()
                .setColor('#ffff00')
                .setTitle('Keywords that will cause GIF images to appear.')
                .setDescription('A GIF will appear when any of the following keywords are mentioned (not case sensitive). '
                    + "Automatic GIF images can be overridden by using double comma ,, in the message.  Anything in parentheses "
                    + " is an alias, and will also trigger the GIF. \n\n"
                    + "__**Wrestling**__ - " + Wrestling + "\n \n"
                    + "__**Star Wars**__ - " + StarWars +  "\n \n"
                    + "__**Other**__ - " + Other + "\n \n");
            message.channel.send(Embed)
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}dmmissedraids`)){
            if(message.author.id == "406945430967156766"){
                dmUsersMissedRaids();
                message.channel.send("Users that missed raids have been direct messaged.")
            }
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}santa`)){
                message.channel.send("https://www.noradsanta.org/")
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}broadcast`)){
            if(message.author.id == "406945430967156766"){
                const messagetopost = message.content.substring(11) 
                client.channels.cache.get("505515654837698563").send(messagetopost)    //MIA channel: 584496478412734464
                message.channel.send("The following has been sent: " + messagetopost)  //Cantina:  505515654837698563
            }
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}info`)){
            if(message.author.id == "406945430967156766")
            {
                const name = client.guilds.cache.map(g => [g.name, g.id, g.ownerID, g.memberCount])
                var BotData = []
                BotData.push("Mhanndalorian bot is installed on the following servers: \n")
                for(var i = 0; i < name.length; i++)
                {
                    BotData.push("__**Name:**__ " + name[i][0] + '\n' + "__**Guild ID:**__ " +
                     name[i][1] + '\n' + "__**Owner:**__ " + '<@' + name[i][2] + '>' +'\n' +
                    "__**# Members:**__ " + name[i][3] + '\n' + '- - - - - - \n')
                }
                message.channel.send(BotData.join("") + "__**Total Servers:**__ " + client.guilds.cache.size)
            }
            else
                message.channel.send("You do not have permission to execute this command")
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}promote`)){
            if(message.author.id == "406945430967156766")
            {
                const guild = client.guilds.cache.get("505515654833504266");

                guild.roles.cache.get("713210691129049155").setPosition(guild.roles.cache.get("528746539871371294").rawPosition - 1) //set position to 1 below Wookie Master
                message.channel.send("Command Testing Activated")
            }
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}demote`)){
            if(message.author.id == "406945430967156766")
            {
                const guild = client.guilds.cache.get("505515654833504266");            
                guild.roles.cache.get("713210691129049155").setPosition(2)
                message.channel.send("Command Testing Deactivated")
            }
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}nuke`) && wookieGuild){
            if(message.member.roles.cache.has("505527335768948754"))
            {
                if(message.channel.name == "recruiting-room-1" || message.channel.name == "recruiting-room-2" ||
                message.channel.name == "recruiting-room-3" || message.channel.name == "cynydes-barrel")
                    (async () => {
                        const guild = client.guilds.cache.get("505515654833504266"); 
                        const fetchedChannel = message.guild.channels.cache.find(r => r.name === message.channel.name);
                        await fetchedChannel.delete();

                        console.log(fetchedChannel.name + " has just been nuked by " + message.member.displayName + " QZ")

                        fetchedChannel2 = await guild.channels.create(message.channel.name, {type: 'text', parent: '585993212351479808'})
                        await fetchedChannel2.lockPermissions()

                     /*   let role = guild.roles.cache.find(r => r.name == 'Officer Emeritus')
                        fetchedChannel2.updateOverwrite(role, {
                            VIEW_CHANNEL: false,
                            SEND_MESSAGES: false,
                            READ_MESSAGE_HISTORY: false,
                            ADD_REACTIONS: false,
                            SEND_TTS_MESSAGES: false,
                            EMBED_LINKS: false,
                            ATTACH_FILES: false,
                            USE_EXTERNAL_EMOJIS: false,
                            MENTION_EVERYONE: false,
                        }); */

                        if(fetchedChannel2.name == "cynydes-barrel")
                            fetchedChannel2.setPosition(1)
                        else if (fetchedChannel2.name == "recruiting-room-1")
                            fetchedChannel2.setPosition(2)
                        else if (fetchedChannel2.name == "recruiting-room-2")
                            fetchedChannel2.setPosition(3)
                        else if (fetchedChannel2.name == "recruiting-room-3")
                            fetchedChannel2.setPosition(4)
                         
                    })();
                else
                    message.channel.send("Are you nuts?  Why are you trying to nuke this room?!?!?")
            }
            else
                message.channel.send("You do not have permission to execute this command")
        }

              /*  if(message.channel.id == "555955759201124360" || message.channel.id == "575425849713623042" || message.channel.id == "712730129750818906" || message.channel.id == "676092306381602826" || message.channel.id == "712775049139978360")
                {
                    message.channel.lockPermissions()
                    .then(() => console.log('Successfully synchronized permissions with parent channel'))
                    .catch(console.error);

                    (async () => {
                        var fetched;
                        var Over14Days = false                        
                        fetched = await message.channel.messages.fetch({limit: 40});

                        while(fetched.size >= 1 && Over14Days == false)
                        {
                            console.log(fetched.size)
                            await message.channel.bulkDelete(fetched)
                            .then(value => {
                                (async () => {
                                    console.log("Bulk Delete")
                                    fetched = await message.channel.messages.fetch({limit: 40});
                                })()
                            })
                            .catch(err => {
                                Over14Days = true
                                console.log(err)
                                nuke(fetched, message)
                            //    return;
                            })
                        }
                    })()
                }
                else
                    message.channel.send("Are you nuts?  Why are you trying to nuke this room?!?!?") */
        
        else if(message.content.toLowerCase().startsWith(`${prefix}skynet`) && (wookieGuild || message.channel.type == 'dm')){
            const attachment = new MessageAttachment('https://github.com/Bhager01/Mhanndalorian-Bot/raw/master/Skynet.mp4')
            message.channel.send("Please turn your volume up.");
            message.channel.send(attachment);
        }
        
        else if(message.content.toLowerCase().startsWith(`${prefix}delgif`) && (wookieGuild || message.channel.type == 'dm')){
            (async () => {
                var Keyword = message.content.slice(8).toLowerCase();
                var Valid = true;
                var Found = false;
                var Row;

                const guild = client.guilds.cache.get("505515654833504266"); 
                var User =  await client.users.fetch(message.author.id)
                var GuildMember =  await guild.members.fetch(User);

                console.log(GuildMember.displayName + " issued delgif command. QZ")

                if(!GuildMember.roles.cache.has("505527335768948754"))
                {
                    return message.channel.send("You do not have permission to execute this command.")
                }

                if(Keyword == "")
                {
                    Valid = false
                    message.channel.send("You did not specify a GIF keyword to be removed.  Syntax: !delgif keyword")
                }

                if(Valid == true)
                {
                    for(var i = 0; i < GIFData.length; i++)
                    {
                        if(GIFData[i][0] == Keyword)
                        {
                            Row = i + 2
                            Found = true;
                            i = GIFData.length
                        }
                    }

                    if(Found == true)
                    {
                        if(GIFData[Row-2][5].toLowerCase() == "n")
                        {
                            //var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
                            authorize(content, listMajors);

                            async function listMajors(auth)
                            {
                                const sheets = google.sheets({version: 'v4', auth});
                                await sheets.spreadsheets.batchUpdate(
                                {
                                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                    resource: {
                                        "requests": 
                                        [
                                        {
                                            "deleteRange": 
                                            {
                                            "range": 
                                            {
                                                "sheetId": 143556422,
                                                "startRowIndex": Row - 1,
                                                "endRowIndex": Row
                                            },
                                            "shiftDimension": "ROWS"
                                            }
                                        }
                                        ]
                                    }
                                },(err, res) => {
                                    if (err) return console.log('The API returned an error: ' + err);

                                    sheets.spreadsheets.values.get({
                                        spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                        range: 'GIFData!A2:F',
                                        }, (err, res) => {
                                                if (err) return console.log('The API returned an error: ' + err);
                                                GIFData = res.data.values;
                                                message.channel.send("You have deleted " + Keyword + " from database.")
                                            }
                                    )

                                });
                            }
                        }
                        else
                            message.channel.send("The keyword you are trying to delete is read only.")
                    }
                    else
                        message.channel.send("GIF keyword not found in database")
                }
            })()
        }
        
        else if(message.content.toLowerCase().startsWith(`${prefix}status`) && (wookieGuild || message.channel.type == 'dm')){
            (async () => {
                const guild = client.guilds.cache.get("505515654833504266"); 
                var User =  await client.users.fetch(message.author.id)
                var GuildMember =  await guild.members.fetch(User);
                
                if(!GuildMember.roles.cache.has("505527335768948754"))
                {
                    return message.channel.send("You do not have permission to execute this command.")
                }
                
                let totalSeconds = client.uptime/1000;
                let days = Math.floor(totalSeconds / 86400);
                totalSeconds %= 86400;
                let hours = Math.floor(totalSeconds / 3600);
                totalSeconds %= 3600;
                let minutes = Math.floor(totalSeconds / 60);
                let seconds = Math.floor(totalSeconds % 60);

                message.channel.send("Bot launched on " + BotUpDate + " at " + BotUpTime + " (Eastern)\n" +
                "Total up time: " + days + " days  " + hours + " hours  " + minutes + " minutes  " + seconds + " seconds")
            })()
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}addgif`) && (wookieGuild || message.channel.type == 'dm')){
            (async () => {
                var CommandArray = message.content.split(',');
                var valid = true;
                var NextRow;

                const guild = client.guilds.cache.get("505515654833504266"); 
                var User =  await client.users.fetch(message.author.id)
                var GuildMember =  await guild.members.fetch(User);

                console.log(GuildMember.displayName + " issued addgif command. QZ")

                if(!GuildMember.roles.cache.has("505527335768948754"))
                {
                    return message.channel.send("You do not have permission to execute this command.")
                }

                if(CommandArray[1] == undefined || CommandArray[2] == undefined || CommandArray [3] == undefined || CommandArray[4] == undefined)
                {
                    message.channel.send("Invalid Command:  Syntax is: !addgif, keyword, search phrase, title on GIF, category")
                    valid = false;
                }

                if(valid == true)
                {
                    for(var i = 1; i < CommandArray.length; i++)
                    {
                        if(CommandArray[i].startsWith(" "))
                            CommandArray[i] = CommandArray[i].slice(1)
                    }

                    CommandArray[1] = CommandArray[1].toLowerCase()        
                    CommandArray[2] = CommandArray[2].toLowerCase()
                    CommandArray[4] = CommandArray[4].toLowerCase()

                    for(var i = 0; i < GIFData.length; i++)
                    {
                        if(GIFData[i][0] == CommandArray[1])
                        {
                            message.channel.send("Keyword already assigned to a GIF.  You may either remove the current keyword "
                                + "from the database and re-add it or you can choose a different keyword.");
                            valid = false;
                            i = GIFData.length;
                        }
                    }
                }

                if(valid == true)
                {
                    if(CommandArray[4] != "wrestling" && CommandArray[4] != "star wars" && CommandArray[4] != "other")
                    {
                        valid = false;
                        message.channel.send("4th argument (category) must be either wrestling, star wars, or other.")
                    }
                }

                if(valid == true)
                {
                    NextRow = GIFData.length + 2;

                    //var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
                    authorize(content, listMajors);

                    async function listMajors(auth)
                    {       
                        const sheets = google.sheets({version: 'v4', auth});
                        await sheets.spreadsheets.values.update({
                            spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                            range: 'GIFdata!A' + NextRow + ':F' + NextRow,
                            valueInputOption: 'USER_ENTERED',
                            resource: {
                                values: [[CommandArray[1],"",CommandArray[2],CommandArray[3],CommandArray[4],"n"]]
                            },
                        }, (err, res) => {
                            if (err) return console.log('The API returned an error: ' + err);

                            sheets.spreadsheets.values.get({
                                spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                range: 'GIFData!A2:F',
                                }, (err, res) => {
                                        if (err) return console.log('The API returned an error: ' + err);
                                        GIFData = res.data.values;
                                        message.channel.send("The following has been added as a GIF: \n"
                                        + "   Keyword = " + CommandArray[1] + "\n"
                                        + "   Search Term = " + CommandArray[2] + "\n"
                                        + "   Title = " + CommandArray[3] + "\n"
                                        + "   Category = " + CommandArray[4] + "\n")
                                    }
                            )
                        });
                    }
                }
            })()
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}updateflair`)){
            if(message.author.id == "406945430967156766"){
                message.channel.send("Flair is being updated for all guild members")
                FlairUpdate("Manual", newFlairAnncouncment)
            } else{
                message.channel.send(message.author.username + ", what do you think you are doing.  Turn back.  I have spoken.");
                console.log(message.author.username + " tried to execute flairupdate. QZ");
            }
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}award`) && (wookieGuild || message.channel.type=='dm')){
            (async () => {
                const guild = client.guilds.cache.get("505515654833504266"); 
                var User =  await client.users.fetch(message.author.id)
                var GuildMember =  await guild.members.fetch(User);

                console.log(message.author.username + " issued award command. QZ")

                if(GuildMember.roles.cache.has("505527335768948754"))
                { 
                    if(message.channel.type != 'dm')
                    {       
                            await message.channel.messages.fetch(message.id).then(messages => { // Fetches the messages
                            messages.delete();
                        })
                    }

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

                    if(FilteredCommandArray[1] == undefined)
                    {
                        message.channel.send("First argument cannot be blank")
                        Proceed = false;
                    }

                    for (var i = 2; i < FilteredCommandArray.length; i++){
                        InputToDiscordID = FilteredCommandArray[i].match(/\d+/g)

                        if(InputToDiscordID == null)
                        {
                            message.channel.send("You entered a discord user that does not exist.");
                            Proceed = false;
                        }
                        else
                        {
                            discordID = client.users.cache.get(InputToDiscordID[0])
                            if(discordID == undefined){ //Discord user doesn't exist
                                message.channel.send("You entered a discord user that does not exist.")
                                Proceed = false;
                            }
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

                            const guild = client.guilds.cache.get("505515654833504266");

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

                                            if(rows[i][1] != "<@" + GuildLeader.toString() + "> " && null != (rows[i][1].match(/\d+/g)))
                                            {
                                                User =  await client.users.fetch(rows[i][1].match(/\d+/g))

                                                GuildMember =  await guild.members.fetch(User)
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

                                                
                                                User =  await client.users.fetch(TempUser2[0])
                                                GuildMember =  await guild.members.fetch(User)
                                                .then(value =>{
                                                    if(TempUser2[0] != GuildLeader)
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
                                        client.channels.cache.get("505515654837698563").send("In recognition of achievement, the following member(s) have earned the " + AwardMessage + "  Excellent job!!\n" + ListMembersSpecialFlar)
                                    
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
                            message.channel.send("First argument must be TWO or TWD")
                        }
                        
                    }
                }
                else
                    message.reply('You do not have sufficient privileges to execute this command')
            })()
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}clean`) && wookieGuild){
            if(message.member.roles.cache.has("505527335768948754") && message.channel.id != "584496478412734464"){
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
                    await message.channel.messages.fetch({ limit: amount }).then(messages => { // Fetches the messages
                        console.log(message.member.displayName + ` Bulk deleted ${messages.size} messages. QZ`)
                        message.channel.bulkDelete(messages)
                        .catch(err => {
                            if(amount <= 20)
                            {
                                console.log(message.member.displayName + ' Attempted to delete messages more than 14 days old. QZ');
                                console.log(message.member.displayName + ` Individually deleted ${messages.size} messages. QZ`);
                                messages.forEach(msg => {
                                        msg.delete()
                                })
                            }
                            else
                                message.reply('The bulkdelete command did not work.  Please try deleting <= 20 messages.')
                            console.log(err);
                        });
                    })
                })()
            }
            else{
                message.reply('You do not have sufficient privileges to execute this command')
                console.log(message.member.displayName + " Tried to execute clean command. QZ")
            }
        }

        else if(message.content.toLowerCase().startsWith(`${prefix}lookup`))
        {
            if(message.channel.type == 'dm')
            {
                message.channel.send("This command can not be run in a direct message. Please run the command on a server.")
                return 0;
            }

            Lookup(message, "lookup", AllGuildData, GuildFoundRow)
        }
        else
        {
            if(DetermineIfGuildMemberOrOfficer(AllGuildData[GuildFoundRow][8], AllGuildData[GuildFoundRow][6], message))
            {
                message.channel.send(message.content + " command not recognized.  Type !help for a list of available commands.")
                console.log("Unknown Command: " + message.content + " issued by " + message.author.username + ". QZ")
            }
        }
    }
//check this xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    else if (!message.content.includes(",,") && !bot && !message.content.startsWith(`${prefix}`) && message.channel.id != "584496478412734464" && (wookieGuild || message.channel.type == 'dm'))
    {
        if(wookieGuild)
            if(message.channel.parent.id == 805097188652220436)
                return 0;

        var Key;
        var RE;

        for(var i=0; i < GIFData.length; i++)
        {
            if(GIFData[i][1] != "")
                Key = '\\b' + GIFData[i][0] + '\\b' + '|\\b' + GIFData[i][1] + '\\b'
            else
                Key = '\\b' + GIFData[i][0] + '\\b'

            RE = new RegExp(Key);

            if(message.content.toLowerCase().search(RE) >= 0)
            {
                gifPost(message, GIFData[i][2], GIFData[i][3])
                i = GIFData.length
            }
        }

    }
    else if (!message.content.includes(",,") && !bot && message.guild.id == "399955359801802762")
    {
        //console.log("Keyword for Kali")
        if(message.content.toLowerCase().search(/\bcobra\b/) >= 0)
        {
            gifPost(message, "cobra", "Cobra")
        }

        else if(message.content.toLowerCase().search(/\bjoey\b/) >= 0)
        {
            gifPost(message, "joey", "Joey")
        }

        else if(message.content.toLowerCase().search(/\brogue\b/) >= 0)
        {
            gifPost(message, "rogue", "Rogue")
        }
    } //for Kali
})

client.login(process.env.BOT_TOKEN);
