//Dependencies
const botSettings = require("./botsettings.json")
const Discord = require("discord.js")
const axios = require("axios")
const fs = require("fs")
const mongoose = require("mongoose")
const Guild = require("./models/Guild.js")

//So we don't have to type Discord.Client(); every time
const bot = new Discord.Client();

//Connect to database
mongoose.connect("mongodb+srv://" + botSettings.dbUsername + ":" + botSettings.dbPassword + "@movie-knight-vaypj.mongodb.net/movie-knight")

//So we know the bot is working
bot.on("ready", () => {
    console.log("Movie Knight, at your service!")
    Guild.find({}, function (err, guild) {
        let guildList = bot.guilds.map(guilds => {
            let guildListId = guilds.id
            let guildListName = guilds.name
            guildObj= {id: guildListId, name: guildListName}
            return guildObj
        })
        for (i = 0; i < guildList.length; i++) {
            var index = -1;
            for (j = 0; j < guild.length; j++) {
                if (guild[j].guild_id === guildList[i].id) index = i;
            }
            if (index < 0) {
                const newGuild = new Guild({
                    guild_name: guildList[i].name,
                    guild_id: guildList[i].id,
                    guild_prefix: "~",
                    owner_id: guild.ownerID,
                    moderator_role_id: "",
                    movie_night_role_id: "",
                    movie_night_channel_id: "",
                    movie_cooldown: "",
                    request_list: []
                })
                newGuild.save(function (err) {
                    if (err) throw err
                    console.log("Guild created!")
                })
            }
        }
        console.log("Existing guild database check complete!")
    })
});

//Bot creates database document when joining server and gives setup instructions
bot.on("guildCreate", guild => {
    const newGuild = new Guild({ 
        guild_name: guild.name,
        guild_id: guild.id,
        guild_prefix: "~",
        owner_id: guild.ownerID,
        moderator_role_id: "",
        movie_night_role_id: "",
        movie_night_channel_id: "",
        movie_cooldown: "",
        request_list: []
    })
    newGuild.save(function (err) {
        if (err) throw err
        console.log("Guild created!")
    })
    let defaultChannel = "";
    guild.channels.forEach((channel) => {
        if (channel.type == "text" && defaultChannel == "") {
            if (channel.permissionsFor(guild.me).has("SEND_MESSAGES")) {
                defaultChannel = channel;
            }
        }
    })
    defaultChannel.send({
        "embed": {
            "title": "**Movie Knight is here!**",
            "description": "Movie Knight is a Discord community movie night bot that handles movie night roles, displays information on movies, creates a community movie request list, and creates polls from the community list for users to vote on a movie to be viewed!\n\nTo get set up Movie Knight, type `~setup` (Setup is restricted to owners. An admin or bot testing channel is recommended for the setup process!) \n\n To see a list of commands and examples, type `~help`\n\n For more information, screenshots, and more, visit Movie Knight's [website](https://ufufuru.github.io/)!",
            "color": 10973164
        }
    })
})

//Deletes database document when leaving server
bot.on("guildDelete", guild => {
    Guild.findOneAndRemove({guild_id: guild.id}, function(err) {
        if (err) throw (err)
        console.log("Guild deleted!")
    })
})

//Command handler
bot.on("message", message => {
    //Prefix+command structure
    Guild.findOne({guild_id: message.guild.id}, function(err, guild) {
        if (err) throw err
        const guildPrefix = guild.guild_prefix
        const args = message.content.slice(guildPrefix.length).trim().split(/ +/g)
        const command = args.shift().toLowerCase()
    
        //If bot is the author or the prefix isn't the first character, return
        if (message.author.bot) return
        if (message.content.indexOf(guildPrefix) !== 0) return
        //if (message.channel.id !== "MOVIE CHANNEL ID") return

        //Check for commands
        try {
            let commandFile = require(`./commands/${command}.js`);
            commandFile.run(bot, message, args);
        } catch (err) {
            console.error(err);
        }
    })
})

bot.login(botSettings.token)