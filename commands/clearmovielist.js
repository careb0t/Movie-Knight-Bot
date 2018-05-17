exports.run = (bot, message, args) => {
    if (message.channel.id != guild.movie_night_channel_id) return
    if (message.author.id == !guild.moderator_role_id || !guild.owner_id) {
        message.channel.send("Only moderators can remove movies from the list!")
        return
    }
    message.channel.send("Are you sure? This cannot be undone! If you really want to clear the list, type `~clearMovieListConfirm`!")
}