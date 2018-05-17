var moment = require('moment');
const Guild = require("../models/Guild.js")
const onCooldown = require("../sets/oncooldown.js")
const axios = require("axios")
exports.run = (bot, message, args) => {
    Guild.findOne({ guild_id: message.guild.id }, function (err, guild) {
        const guildDocID = guild._id
        if (message.channel.id != guild.movie_night_channel_id) return
        if (guild.movie_list_channel_id == null) {
            message.channel.send("There is no movie list channel! Remove and add this movie again, or set the movie list channel ID with `~setup`")
            return
        }
        if (onCooldown.has(message.author.id) && message.author.id !== message.guild.ownerID) {
            message.channel.send("Only one request per " + guild.movie_cooldown + " day(s)!")
            return
        }
        onCooldown.add(message.author.id);
        setTimeout(() => {
            onCooldown.delete(message.author.id);
        }, 1000 * 60 * 60 * guild.movie_cooldown);
        console.log(1000 * 60 * 60 * guild.movie_cooldown)
        let movieArgs = String(args).replace(",", " ").split("//")
        let movieTitle = movieArgs[0]
        let movieYear = movieArgs[1]
        let url = "https://api.themoviedb.org/3/search/movie?include_adult=false&query=" + movieTitle + "&year=" + movieYear + "&api_key=2f9030e4912af0f2b862c44f7a8181e6"
        axios
            .get(url)
            .then(response => {
                if (response.data.total_results == "0") {
                    onCooldown.delete(message.author.id)
                    message.channel.send("No results found. Check your spelling, or try another movie!")
                    return
                }
                console.log(response.data.results[0])
                let responseTitle = response.data.results[0].title
                let responseYear = response.data.results[0].release_date
                let responsePlot = response.data.results[0].overview
                let responseRatings = response.data.results[0].vote_average
                let responsePoster = "https://image.tmdb.org/t/p/w1280" + response.data.results[0].poster_path
                let responseLink = "https://www.themoviedb.org/movie/" + response.data.results[0].id
                let entry = guild.request_list.find(e => {
                        return e.title === responseTitle
                })
                if (entry) {
                     onCooldown.delete(message.author.id)
                    message.channel.send("This movie is already on the list!")
                    return
                }
                
                let movieObj = new Object()
                movieObj.title = responseTitle
                movieObj.ratings = responseRatings === undefined ? "N/A" : responseRatings
                movieObj.year = responseYear === undefined ? "N/A" : responseYear
                movieObj.plot = responsePlot === undefined ? "N/A" : responsePlot
                movieObj.poster = responsePoster === undefined ? "N/A" : responsePoster
                movieObj.link = responseLink === undefined ? "N/A" : responseLink
                Guild.findByIdAndUpdate(guildDocID,
                    {$push: {request_list: movieObj}},
                    {safe: true, upsert: true, new: true},
                    function (err, docguild) {
                        if (err) throw err
                        message.channel.send(movieObj.title +" added to list.")  
                    }
                )
                bot.channels.get(guild.movie_list_channel_id).send({
                    "embed": {
                        "title": responseTitle,
                        "description": responsePlot,
                        "color": 14250239,
                        "thumbnail": {
                            "url": responsePoster
                        },
                        "fields": [
                            {
                                "name": "Year :calendar:",
                                "value": moment(responseYear).format("MMMM Do, YYYY"),
                                "inline": true
                            },
                            {
                                "name": "Average Rating :trophy:",
                                "value": (responseRatings*10).toString() + "%",
                                "inline": true
                            },
                            {
                                "name": "\u200b",
                                "value": "[View more information about this movie!]("+ responseLink + ")"
                            }
                        ]
                    }
                })
            })
    })
}