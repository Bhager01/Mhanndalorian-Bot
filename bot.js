const { Intents } = require("discord.js");
const Discord = require('discord.js');
const {MessageAttachment} = require('discord.js');
const {CanvasRenderService} = require('chartjs-node-canvas')
const intents = new Intents([
    Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
    "GUILD_MEMBERS", // lets you request guild members (i.e. fixes the issue)
    "GUILD_PRESENCES",
]);
const client = new Discord.Client({ ws: { intents } });

const {google} = require('googleapis');
const fetch = require('node-fetch');
const giffyToken = "s5PcPTErWAqH6dU57Bfk1WXF5n6F4DTY";
const prefix = "!"

var newBronze = "";
var newSilver = "";
var newGold = "";
var newDiamond = "";
var newHolodisk = "";
var newJediScroll = ""
var newEye = "";
var NewNoStatus = [];
var BadWords =  ['fuck', 'shit', 'pissoff', 'dickhead', 'asshole', 'sonofabitch', 'bitch', 'bastard', 'cunt', 'goddamn', 
                'motherfucker', 'hell', 'holyshit', 'dick', 'cock', 'pussy', 'ass', 'ballsack', 'blowjob', 'fag',
                'tit', 'vagina', 'screwyou']

var GphApiClient = require('giphy-js-sdk-core');
giphy = GphApiClient(giffyToken)

var GIFData;
var BotUpTime;
var BotUpDate

client.once('ready', () => {
    console.log('Ready')
    client.channels.cache.get("584496478412734464").messages.fetch({ limit: 40 }) //Cache message from MIA channel
    BotUpTime = new Date().toLocaleTimeString()
    BotUpDate = new Date().toLocaleDateString()
})

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function GP(message, DiscordIDParam, DaysBack){
    content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
    authorize(content, listMajors);

    async function listMajors(auth)
    {  
        const sheets = google.sheets({version: 'v4', auth});
        const DiscordID = DiscordIDParam;

        sheets.spreadsheets.values.get({
            spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
            range: 'Guild Members & Data!A66:G119',
        }, (err, res) => {
                if (err) return console.log('The API returned an error: ' + err);
                const rows = res.data.values;
                var Continue = false

                var Name = ''

                if(DiscordIDParam != 'guildGP')
                {
                    for(var i = 0; i < rows.length; i++) //Match discord ID of author to SWGOH Ally code
                    {
                        if(rows[i][6] != undefined && DiscordID == rows[i][6].replace("<@","").replace(">","").replace(" ",""))
                        {
                            Allycode = rows[i][0];
                            Name = rows[i][1];
                            i = rows.length
                            Continue = true
                        }
                    }
                }
                else
                {
                    Allycode = 999
                    Name = 'the guild'
                    Continue = true
                }

                if(Continue == true)
                {
                    Continue = false

                    sheets.spreadsheets.values.get({
                        spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                        range: 'TotalGP!1:1',
                    }, (err, res) => {
                            if (err) return console.log('The API returned an error: ' + err);
                            const rows = res.data.values;
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
                                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                    range: 'TotalGP!' + ColumnName + '2:' + ColumnName,
                                }, (err, res) => {
                                        if (err) return console.log('The API returned an error: ' + err);
                                        const RawGP = res.data.values;

                                        if(RawGP != undefined)
                                        {
                                            sheets.spreadsheets.values.get({
                                                spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                                range: 'TotalGP!A2:A',
                                            }, (err, res) => {
                                                    if (err) return console.log('The API returned an error: ' + err);
                                                    const RawDates = res.data.values;
                                                    
                                                    var GP = []
                                                    var Dates = []

                                                    for(var i = 0; i < RawGP.length; i++)
                                                    {
                                                        GP[i] = RawGP[i][0]/1000000
                                                    }

                                                    for(var i = 0; i < RawDates.length; i++)
                                                    {
                                                        Dates[i] = RawDates[i][0]
                                                    }

                                                    Dates.splice(GP.length, 5000);  //No need to have dates if there is no GP data for that date

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

                                                        const canvas = new CanvasRenderService(width, height, chartCallback)

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
                                                                        pointBorderWidth: '15',
                                                                        lineTension: '0',
                                                                    }
                                                                ]
                                                            },

                                                            options: {
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

                                                        const image = await canvas.renderToBuffer(configuration)
                                                        const attachment = new MessageAttachment(image)

                                                        if(message != 'GuildWeekly')
                                                            message.channel.send(attachment)
                                                        else
                                                            client.channels.cache.get("532618076705783809").send(attachment)
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
                                                        var TwoDaysAgo = new Date();
                                                        TwoDaysAgo.setDate(TwoDaysAgo.getDate() - 2);
                                                        client.channels.cache.get("532618076705783809").send("<@&530083964380250116> Weekly Galactic Power Update for week of " + TwoDaysAgo.toLocaleDateString("en-US") + "." +
                                                        "  The graph below will eventually contain data for the previous 90 days.\n\n From " +
                                                        Dates[0] + " to " + Dates[Dates.length-1] + " " + Name + "'s GP has " + IncreaseorDecrease + " by " + PercentChange + "%.")
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

function Lookup(message, CallingFunction)
{
    var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
    authorize(content, listMajors);

    if(CallingFunction == 'lookup')
        console.log(message.author.username + " issued lookup command. QZ")
    
    function listMajors(auth)
    {
        const guild = client.guilds.cache.get("505515654833504266");
        
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
                var DaysBack;

                if(CommandArray[1].match(/[\s](\d+)($)/))
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
                
                (async () => { 
                    await guild.members.fetch()                    
                })()

                DiscordSWGOHNameIDArray  = guild.roles.cache.get('530083964380250116').members.map(m => [m.id, m.displayName])

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

                for(var j = 0; j < DiscordSWGOHNameIDArray.length; j++)
                {
                    if(DiscordSWGOHNameIDArray[j][2] == undefined || DiscordSWGOHNameIDArray[j][3] == undefined)
                    DiscordSWGOHNameIDArray.splice(j,1)
                }
            
                for(var i = 0; i < DiscordSWGOHNameIDArray.length; i++)
                {
                //  if(DiscordSWGOHNameIDArray[i][1].toLowerCase() == CommandArray[1].toLowerCase() || DiscordSWGOHNameIDArray[i][2] == CommandArray[1] || DiscordSWGOHNameIDArray[i][3].toLowerCase() == CommandArray[1].toLowerCase())
                    if(DiscordSWGOHNameIDArray[i][1].toLowerCase().includes(CommandArray[1].toLowerCase()) || DiscordSWGOHNameIDArray[i][2].includes(CommandArray[1]) || DiscordSWGOHNameIDArray[i][3].toLowerCase().includes(CommandArray[1].toLowerCase()))
                    {
                        RowFound = i;
                        i = DiscordSWGOHNameIDArray.length
                        Found = true
                    }
                }

                if(Found == true)
                {
                    if(CallingFunction == 'lookup')
                    {
                        (async () => { 
                            User =  await client.users.fetch(DiscordSWGOHNameIDArray[RowFound][0])                         
                            GuildMember =  await guild.members.fetch(User)
                            DisplayNamed = GuildMember.displayName
                            message.channel.send
                                ("__**Ally Code:**__  " + DiscordSWGOHNameIDArray[RowFound][2] + "\n"
                                + "__**SWGOH Name:**__  " + DiscordSWGOHNameIDArray[RowFound][3] + "\n"
                                + "__**Discord Name:**__  <@" + DiscordSWGOHNameIDArray[RowFound][0] + ">")
                        })()
                    }
                    else if(CallingFunction == 'GP')
                        GP(message, DiscordSWGOHNameIDArray[RowFound][0], DaysBack)
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

function toColumnName(num) {
    for (var ret = '', a = 1, b = 26; (num -= a) >= 0; a = b, b *= 26) {
      ret = String.fromCharCode(parseInt((num % b) / a) + 65) + ret;
    }
    return ret;
}

function PostWeeklyGuildGP(){
    GP('GuildWeekly', 'guildGP', 90)
}

function UpdateTotalGP() {
    var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
    authorize(content, listMajors);

    function listMajors(auth)
    {
        const sheets = google.sheets({version: 'v4', auth});
        const BaseURL = "https://swgoh.gg/api/guild/55879";

        (async () => {
            var NextAvailableRow;
            var NextAvailableColumn;

            Result = await fetch(BaseURL,
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
                    console.log(response)
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
                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
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
                            spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                            range: 'TotalGP!A' + NextAvailableRow,  
                            valueInputOption: 'RAW',
                            resource: {
                                values: [[Today]]
                            },
                        })

                        sheets.spreadsheets.values.update({
                            spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                            range: 'TotalGP!PP' + NextAvailableRow,  
                            valueInputOption: 'USER_ENTERED',
                            resource: {
                                values: [["=sum(B" + NextAvailableRow + ":PO" + NextAvailableRow + ")"]]
                            },
                        })

                        sheets.spreadsheets.values.get({
                            spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
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
                                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
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
                                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                    range: 'TotalGP!' + toColumnName(NextAvailableColumn) + '1',  
                                    valueInputOption: 'RAW',
                                    resource: {
                                        values: [NewGPDataAllyCode]
                                    },
                                })

                                sheets.spreadsheets.values.update({
                                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                                    range: 'TotalGP!' + toColumnName(NextAvailableColumn) + NextAvailableRow,  
                                    valueInputOption: 'RAW',
                                    resource: {
                                        values: [NewGPDataGP]
                                    },
                                })



                                //console.log(UpdateGPData)
                            })
                    }
                )
        })()
    }
}

function processMIAAlertsMhannBot(message, status) //TESTING REQUIRED
{
    var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
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
    var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
    authorize(content, listMajors);

    function listMajors(auth)
    {
        const sheets = google.sheets({version: 'v4', auth});
        const BaseURL = "https://swgoh.gg/api/guild/55879";

        (async () => {
            Result = await fetch(BaseURL,
               /* {
                    method: 'GET',
                }).then(response => response.json())*/

                {
                    method: 'GET',
                }).then(function (response) {
                    console.log(response)
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
                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                    range: 'XML Data!A3:B56',  
                    valueInputOption: 'USER_ENTERED',
                    resource: {
                        values: NamesAndCodes
                    },
                })

                var time = new Date().toLocaleTimeString()
                var date = new Date().toLocaleDateString()

                sheets.spreadsheets.values.update({
                    spreadsheetId: '1p5nViz3_kCnurF9sHZE1PGsu22RXxh-qf_7JkonbipQ',
                    range: 'Guild Members & Data!C122',  
                    valueInputOption: 'RAW',
                    resource: {
                        values: [[date + " " + time]]
                    },
                })
        })()
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

    if((lastMessage.content.includes("have successfully joined") || lastMessage.content.includes("notifications have been sent") || lastMessage.content.includes("could not be resolved")) && MSSinceLastMsg <= 3960000)
    {
        var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
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

async function nuke(fetched, message) {
    fetched = await message.channel.messages.fetch({limit: 20});
    promise = fetched.clear()

    await sleep(60000).then((values) => {
        FinalPromise = Promise.all(promise)
    })

    FinalPromise.then((values) => {
        (async () => {
            console.log("Nuke Function")
            fetched = await message.channel.messages.fetch({limit: 20});
            console.log("fetched=" + fetched.size)
            if(fetched.size >= 1)
                nuke(fetched, message)
        })()
    })
}

var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
authorize(content, listMajors);

function listMajors(auth)
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
 var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
 authorize(content, listMajors);
   
    function listMajors(auth) {
        const sheets = google.sheets({version: 'v4', auth});
        const guild = client.guilds.cache.get("505515654833504266");
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

          var GuildMember;
          var User;
          var discordID;

            for (let i=0; i<rows.length; i++){
                if(typeof rows[i][1] != 'undefined' && rows[i][1] != "" && rows[i][0].length >= 1){
                    discordID = rows[i][1].replace("<","").replace(">","").replace("@","");
                    if(discordID != 378053516067078149){
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

//var CronJob4 = require('cron').CronJob;
var job4 = new CronJob('00 6,14,20 * * *', function() {
    console.log("Cron job MIA cleanup QZ")
    CleanMIA();
}, null, true, 'America/New_York');
job4.start();

//var CronJob5 = require('cron').CronJob;
var job5 = new CronJob('45 5,17 * * *', function() {
    console.log("Update Users & Allycodes from SWGOH.GG API")
    UpdateUsersAndAllycodes();
}, null, true, 'America/New_York');
job5.start();

//var CronJob6 = require('cron').CronJob;
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
        channelID = RateLimitInfo.path.match(/\d+/g);
        client.channels.cache.get(channelID[0]).send("Rate limit reached for this command. Please wait " + RateLimitInfo.timeout/1000 + " seconds.")
    }
})

client.on("messageDelete", msg => {
    if(msg.channel.id == "584496478412734464")
        processMIAAlertsMhannBot(msg, "ending")
  })

client.on('messageUpdate', (oldMessage, newMessage) => {  //Handles an edit to a MIA message.  
    if(newMessage.channel.id == "584496478412734464")
        processMIAMessage(newMessage)
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
    {
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

client.on('message', message => {
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

    if(message.channel.id == "767844286028840960" || message.channel.id == "674049431594729472")
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
 
    if(message.channel.id == "709448648035008543")
    {
        var time = new Date()
        var Offset = time.getTimezoneOffset();
        var Adjustment = 0;

        if(Offset == 300)
            Adjustment = 100

        var HMString = `${time.getHours()}${time.getMinutes()}`
        var HMInt = parseInt(HMString, 10);

        var Allowed = false  //Replace 1849 - 0 and 1859 - 0 with 1849 - adjustment to have allowed posting time chaneg with DST
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

   /* if(message.author.id == "198905950919196672")
    {
        for(var i=0; i <= BadWords.length; i++)
        {
            if(message.content.toLowerCase().replace(/\w\s\w/g, "").includes(BadWords[i]))
            {
              //  (async () => {
              //  fetched = await message.channel.messages.fetch({limit: 1});
              //  fetched.clear();
              //  })()

                message.channel.send("You said a bad word Cynyde.  This had been recorded.")
                message.react('👎');
                message.react('❌');
                console.log("Bad word QZ")
            }
        }
    } */

    if(message.content.toLowerCase().match(/[e][b][.]\d{9}[.][r][e][g][i][s][t][e][r]/) && !bot && wookieGuild){
        if(message.member.roles.cache.has("530083964380250116"))
        {
            var allyCode = String(message.content.slice(3,12));
            var officer;

            console.log(message.member.displayName + " issued echo base register command. QZ")

            if(message.content.includes("@"))
            {
                if(message.member.roles.cache.has("505527335768948754"))
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
                                const Embed = new Discord.MessageEmbed()
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
                                    
                                    const Embed2 = new Discord.MessageEmbed()
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
                                    
                                    const Embed3 = new Discord.MessageEmbed()
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
                    }else {
                        console.log('No data found.');
                    }
                    });
                }                
            }
        }
        else
            message.channel.send("You must have the role of Bandit to execute this command");
    }

    else if(message.content.startsWith(`${prefix}`) && !bot)
    {
        if((message.content.toLowerCase().startsWith(`${prefix}flair`)) && (wookieGuild || message.channel.type=='dm')){
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
                var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
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
            UpdateTotalGP();
            //PostWeeklyGuildGP();
            //UpdateUsersAndAllycodes();
        }
        
        else if((message.content.toLowerCase().startsWith(`${prefix}help`)) && (wookieGuild || message.channel.type=='dm')){
            (async () => {
                
                const guild = client.guilds.cache.get("505515654833504266"); 
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

                if(GuildMember.roles.cache.has("505527335768948754"))
                {
                    const Embed2 = new Discord.MessageEmbed()
                        .setColor('#3495D5')
                        .setTitle('Commands available to those with Wook-Tang role (not case sensitive)')
                        .setDescription("All commands start with " + prefix + ".  If a command has *arg* after it, it requires an argument.\n\n"
                            + "__**" + prefix + "addgif**__, __***arg1***__, __***arg2***__, __***arg3***__, __***arg4***__ - Command to add "
                            + "GIF to databse. *Arg1* is the keyword to trigger GIF. *Arg2* is the phrase to search for on Giphy. *Arg3* is the "
                            + "title displayed on the GIF. *Arg4* is the category and must be either wrestling, star wars or other.\n\n"
                            + "__**" + prefix + "award**__ __***arg***__ @user1 @user2 - Award flair to user. *Arg* can be TWO (TW Offensive) or "
                            + "TWD (TW Defensive).  You can mention as many users as you want after the argument. \n \n"
                            + "__**" + prefix + "clean**__ __***arg***__ - Deletes a specified number of messages from the current channel. "
                            + "*Arg* is the number of messages to delete and must be an integer less than or equal to 100. \n \n"
                            + "__**" + prefix + "delgif**__ __***arg***__ - Command to remove GIF from database. *Arg* is the keyword to "
                            + "remove \n \n"
                            + "__**" + prefix + "status**__ - Displays date and time bot was launched along with total up time. \n \n "
                            + "__**" + prefix + "nuke**__ - Command to completely clear a channel.  Only works in the recruiting and Cynydes barrel "
                            + "channels. \n");
                    message.channel.send(Embed2)
                }

                const Embed = new Discord.MessageEmbed()
                    .setColor('#2FC071')
                    .setTitle('Commands available to those with bandit role (not case sensitive)')
                    .setDescription("All commands start with " + prefix + ".  If a command has *arg* after it, it requires an argument.\n\n"
                        + "__**" + prefix + "alert**__ __***arg1***__ __***arg2***__ - Subscribes or unsubscribes you from a reminder. "
                        + "*Arg1* must be the word raid. *Arg2* can be the word subscribe or unsubscribe. \n\n"
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
                        + "be a SWGOH name, ally code, or discord name.  Partial input is ok. \n \n");
                message.channel.send(Embed)
            })()
        }

        else if((message.content.toLowerCase().startsWith(`${prefix}gp`)) && (wookieGuild || message.channel.type=='dm'))
        {
            (async () => {
                
                const guild = client.guilds.cache.get("505515654833504266"); 
                var User =  await client.users.fetch(message.author.id)
                var GuildMember =  await guild.members.fetch(User);

                if(GuildMember.roles.cache.has("530083964380250116")) //Must be a bandit
                {
                    var CommandArray = message.content.split(' ');

                    if(CommandArray[1] != undefined)
                    {
                        if(isNaN(CommandArray[1]))
                        {
                            if(CommandArray[1].toLowerCase() != 'guild')
                            {
                                if(GuildMember.roles.cache.has("505527335768948754")) //must have wooktang role
                                    Lookup(message, 'GP')
                                else
                                    message.channel.send("You do not have sufficient prividleges to execute this command.")
                            }
                            else //First argument was the word guild
                                if(CommandArray[2] == undefined)
                                    GP(message, 'guildGP', CommandArray[2])
                                else
                                {
                                    if(!isNaN(CommandArray[2]) && CommandArray[2] > 0)
                                        GP(message, 'guildGP', CommandArray[2])
                                    else
                                        message.channel.send("Please specify a number of days greater than 0.")
                                }
                                
                        }
                        else
                            if(CommandArray[1] > 0)
                                GP(message, message.author.id, CommandArray[1])
                            else
                                message.channel.send("Please specify a number of days greater than 0.")
                    }
                    else //no argument provided
                        GP(message, message.author.id)
                }
                else
                    message.channel.send("You must be have the role of bandit to execute this command.")
            })()
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
                            var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
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

                    var content = {"installed":{"client_id":"842290271074-u9kfivj3l2i5deugh3ppit9mo6i8oltr.apps.googleusercontent.com","project_id":"mhanndalorian-1581969700452","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://oauth2.googleapis.com/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"ZPufJMDMo8OuJ-JxOk6X3OXw","redirect_uris":["urn:ietf:wg:oauth:2.0:oob","http://localhost"]}}
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

                                            if(rows[i][1] != "<@378053516067078149> " && null != (rows[i][1].match(/\d+/g)))
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

        else if(message.content.toLowerCase().startsWith(`${prefix}lookup`) &&  (wookieGuild || message.channel.type=='dm')){
            Lookup(message, "lookup")
        }
        else
        {
            (async () => { 
                const guild = client.guilds.cache.get("505515654833504266"); 
                var User =  await client.users.fetch(message.author.id)
                var GuildMember =  await guild.members.fetch(User);

                if(GuildMember.roles.cache.has("530083964380250116"))
                {
                    message.channel.send(message.content + " command not recognized.  Type !help for a list of available commands.")
                    console.log("Unknown Command: " + message.content + " issued by " + message.author.username + ". QZ")
                }
            })()
        }
    }
//check this xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
    else if (!message.content.includes(",,") && !bot && !message.content.startsWith(`${prefix}`) && message.channel.id != "584496478412734464" && (wookieGuild || message.channel.type == 'dm'))
    {
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
