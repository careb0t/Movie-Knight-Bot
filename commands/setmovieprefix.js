const Guild = require("../models/Guild.js")
exports.run = (bot, message, args) => {
    if (message.author.id !== message.guild.ownerID) {
        message.channel.send("Only the server owner can use this command!")
        return
    }
    if (args == "") {
        message.channel.send("Command is empty!")
        return
    }
    Guild.findOne({guild_id: message.guild.id}, function (err, guild) {
        guild.guild_prefix = args
        guild.save(function(err) {
            if (err) throw err
            message.channel.send("Movie prefix updated!")
            console.log(guild)
        })
    })
}