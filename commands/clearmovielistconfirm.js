const Guild = require("../models/Guild.js")
exports.run = (bot, message, args) => {
    Guild.findOne({ guild_id: message.guild.id }, function (err, guild) {
        if (message.channel.id != guild.movie_night_channel_id) return
        if (!message.member.roles.has(guild.moderator_role_id)) {
            message.channel.send("Only movie night moderators can clear the list!")
            return
        }
        guild.request_list = []
        guild.save(function(err) {
            if (err) throw err
            console.log(guild)
        })
        async function clear() {
            const fetched = await bot.channels.get(guild.movie_list_channel_id).fetchMessages({limit: 99});
            bot.channels.get(guild.movie_list_channel_id).bulkDelete(fetched);
        }
        clear();
        message.channel.send("Movie list cleared!")
    })
}