const Guild = require("../models/Guild.js")
const onCooldown = require("../sets/oncooldown.js")
const axios = require("axios")
exports.run = (bot, message, args) => {
    Guild.findOne({ guild_id: message.guild.id }, function (err, guild) {
        if (message.channel.id != guild.movie_night_channel_id) return
        if (message.author.id == !guild.moderator_role_id || !guild.owner_id) {
            message.channel.send("Only moderators can remove movies from the list!")
            return
        }
        let movieTitle = args
        let url = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&type=movie&r=json&plot=full&apikey=553813e7"
        axios
            .get(url)
            .then(response => {
                if (response.data.Response == "False") {
                    message.channel.send("Bad response from IMDB API. Check your spelling!")
                    return
                }
                let responseTitle = response.data.Title
                let responseYear = response.data.Year
                let responsePlot = response.data.Plot
                let responseRatings = response.data.Ratings
                let responsePoster = response.data.Poster
                let responseLink = response.data.imdbID
                let index = guild.request_list.findIndex(e => {
                    return e.title === responseTitle
                })
                if (index === -1) {
                    message.channel.send("This movie isn't on the list!")
                    return
                }
                guild.request_list.splice(index, 1)
                guild.save(function(err) {
                    if (err) throw err
                    console.log(guild)
                    message.channel.send("Removed movie from list!")
                })
                bot.channels.get(guild.movie_list_channel_id).fetchMessages()
                    .then(messages => {
                        let checkList = messages.map(msg => {
                            let checkTitle = msg.embeds[0].title
                            let checkId = msg.id
                            checkObj = {id: checkId, title: checkTitle}
                            return checkObj
                        })
                        console.log(checkList)
                        let index = checkList.findIndex(e => {
                            return e.title === responseTitle
                        })
                        let duplicateMessageId = checkList[index].id
                        bot.channels.get(guild.movie_list_channel_id).fetchMessage(duplicateMessageId)
                            .then(message => {
                                message.delete()
                            })
                            .catch(console.error)
                    })      
            })
    })
}