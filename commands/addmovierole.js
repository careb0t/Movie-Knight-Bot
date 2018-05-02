const Guild = require("../models/Guild.js")
exports.run = (bot, message, args) => {
    Guild.findOne({ guild_id: message.guild.id }, function (err, guild) {
        if (message.channel.id !== guild.movie_night_channel_id) return
        if (message.member.roles.has(guild.movie_night_role_id)) {
            message.channel.send("You already have the movie night role!")
            return
        }
        let movieRole = message.guild.roles.find("id", guild.movie_night_role_id)
        message.member.addRole(movieRole).catch(console.error)
        message.channel.send("You were given the movie night role!")
    })
}