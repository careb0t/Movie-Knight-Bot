const Guild = require("../models/Guild.js")
const axios = require("axios")
exports.run = (bot, message, args) => {
    let movieArgs = String(args).replace(",", " ").split("//")
    let movieTitle = movieArgs[0]
    let movieYear = movieArgs[1]
    let url = "http://www.omdbapi.com/?t=" + movieTitle + "&y=" + movieYear + "&type=movie&r=json&plot=full&apikey=553813e7"
    axios
        .get(url)
        .then(response => {
            if (response.data.Response == "False") {
                message.channel.send("No results found. Try another movie!")
                return
            }
            let responseTitle = response.data.Title
            let responseYear = response.data.Year === undefined ? "N/A" : response.data.Year
            let responsePlot = response.data.Plot === undefined ? "N/A" : response.data.Plot
            let responseRatings = response.data.Ratings[1] === undefined ? "N/A" : response.data.Ratings[1].Value
            let responsePoster = response.data.Poster === undefined ? "N/A" : response.data.Poster
            let responseLink = response.data.imdbID === undefined ? "N/A" : response.data.imdbID
            message.channel.send({
                "embed": {
                    "title": responseTitle,
                    "description": responsePlot,
                    "color": 14250239,
                    "thumbnail": {
                        "url": responsePoster
                    },
                    "fields": [{
                            "name": "Year :calendar:",
                            "value": responseYear,
                            "inline": true
                        },
                        {
                            "name": "Rotten Tomatoes Score :tomato:",
                            "value": responseRatings,
                            "inline": true
                        },
                        {
                            "name": "\u200b",
                            "value": "[View more information about this movie!](http://www.imdb.com/title/" + responseLink + "/)"
                        }
                    ]
                }
            })
        })
}