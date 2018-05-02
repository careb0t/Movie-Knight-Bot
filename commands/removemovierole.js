const Guild = require("../models/Guild.js")
exports.run = (bot, message, args) => {
    Guild.findOne({ guild_id: message.guild.id }, function (err, guild) {
        if (message.channel.id !== guild.movie_night_channel_id) return
        if (message.member.roles.has(guild.movie_night_role_id)) {
            let movieRole = message.guild.roles.find("id", guild.movie_night_role_id)
            message.member.removeRole(movieRole).catch(console.error)
            message.channel.send("You have removed the movie night role!")
        } else {
            message.channel.send("You don't have the movie night role!")
        }
    })
}