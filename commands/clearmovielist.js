const Guild = require("../models/Guild.js")
exports.run = (bot, message, args) => {
    Guild.findOne({ guild_id: message.guild.id }, function (err, guild) {
    if (message.channel.id != guild.movie_night_channel_id) return
    if (!message.member.roles.has(guild.moderator_role_id)) {
        message.channel.send("Only movie night moderators can clear the list!")
        return
    }
    message.channel.send("Are you sure? This cannot be undone! If you really want to clear the list, type `~clearMovieListConfirm`!")
})
}