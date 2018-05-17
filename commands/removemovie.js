var moment = require('moment')
const Guild = require("../models/Guild.js")
const onCooldown = require("../sets/oncooldown.js")
const axios = require("axios")
exports.run = (bot, message, args) => {
    Guild.findOne({ guild_id: message.guild.id }, function (err, guild) {
        console.log(guild.moderator_role_id)
        if (message.channel.id != guild.movie_night_channel_id) return
        if (!message.member.roles.has(guild.moderator_role_id)) {
            message.channel.send("Only movie night moderators can remove movies!")
            return
        }
        let movieArgs = String(args).replace(",", " ").split("//")
        let movieTitle = movieArgs[0]
        let movieYear = movieArgs[1]
        let url = "https://api.themoviedb.org/3/search/movie?include_adult=false&query=" + movieTitle + "&year=" + movieYear + "&api_key=2f9030e4912af0f2b862c44f7a8181e6"
        axios
            .get(url)
            .then(response => {
                if (response.data.total_results == "0") {
                    message.channel.send("Bad response from TMDB API. Check your spelling!")
                    return
                }
                let responseTitle = response.data.results[0].title
                let responseYear = response.data.results[0].release_date
                let responsePlot = response.data.results[0].overview
                let responseRatings = response.data.results[0].vote_average
                let responsePoster = "https://image.tmdb.org/t/p/w1280" + response.data.results[0].poster_path
                let responseLink = "https://www.themoviedb.org/movie/" + response.data.results[0].id
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