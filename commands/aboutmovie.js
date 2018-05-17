var moment = require('moment')
const Guild = require("../models/Guild.js")
const axios = require("axios")
exports.run = (bot, message, args) => {
    if (message.channel.id != guild.movie_night_channel_id) return
    let movieArgs = String(args).replace(",", " ").split("//")
    let movieTitle = movieArgs[0]
    let movieYear = movieArgs[1]
    let url = "https://api.themoviedb.org/3/search/movie?include_adult=false&query=" + movieTitle + "&year=" + movieYear + "&api_key=2f9030e4912af0f2b862c44f7a8181e6"
    axios
        .get(url)
        .then(response => {
            if (response.data.total_response == "0") {
                message.channel.send("No results found. Try another movie!")
                return
            }
            let responseTitle = response.data.results[0].title
                let responseYear = response.data.results[0].release_date
                let responsePlot = response.data.results[0].overview
                let responseRatings = response.data.results[0].vote_average
                let responsePoster = "https://image.tmdb.org/t/p/w1280" + response.data.results[0].poster_path
                let responseLink = "https://www.themoviedb.org/movie/" + response.data.results[0].id
            message.channel.send({
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
}