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
        let url = "http://www.omdbapi.com/?t=" + movieTitle + "&y=" + movieYear + "&type=movie&r=json&plot=full&apikey=553813e7"
        axios
            .get(url)
            .then(response => {
                if (response.data.Response == "False") {
                    onCooldown.delete(message.author.id)
                    message.channel.send("No results found. Check your spelling, or try another movie!")
                    return
                }
                let responseTitle = response.data.Title
                let responseYear = response.data.Year
                let responsePlot = response.data.Plot
                let responseRatings = response.data.Ratings
                let responsePoster = response.data.Poster
                let responseLink = response.data.imdbID
                let entry = guild.request_list.find(e => {
                        return e.title === responseTitle
                })
                console.log(entry)
                if (entry) {
                     onCooldown.delete(message.author.id)
                    message.channel.send("This movie is already on the list!")
                    return
                }
                let movieObj = new Object()
                movieObj.title = responseTitle
                movieObj.ratings = responseRatings[1] === undefined ? "N/A" : responseRatings[1].Value
                movieObj.year = responseYear === undefined ? "N/A" : responseYear
                movieObj.plot = responsePlot === undefined ? "N/A" : responsePlot
                movieObj.poster = responsePoster === undefined ? "N/A" : responsePoster
                movieObj.link = responseLink === undefined ? "N/A" : response.data.imdbID
                console.log(movieObj)
                Guild.findByIdAndUpdate(guildDocID,
                    {$push: {request_list: movieObj}},
                    {safe: true, upsert: true, new: true},
                    function (err, docguild) {
                        if (err) throw err
                        console.log(guild)
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
                                "value": responseYear,
                                "inline": true
                            },
                            {
                                "name": "Rotten Tomatoes Score :tomato:",
                                "value": movieObj.ratings,
                                "inline": true
                            },
                            {
                                "name": ":mag:",
                                "value": "[View more information about this movie!](http://www.imdb.com/title/" + responseLink + "/)"
                            }
                        ]
                    }
                })
            })
    })
}