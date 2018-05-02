const Guild = require("../models/Guild.js")
exports.run = (bot, message, args) => {
    Guild.findOne({guild_id: message.guild.id}, function (err, guild) {
        if (!message.member.roles.has(guild.moderator_role_id)) {
            message.channel.send("Only movie night moderators can create polls!")
            return
        }
        if (guild.request_list.length < 3) {
            message.channel.send("There aren't enough movies on the list. Add some more!")
        }
        function shuffle(array) {
            var currentIndex = array.length,
                temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }
            return array;
        }
        guild.request_list = shuffle(guild.request_list)
        let firstMovie = guild.request_list[0]
        let secondMovie = guild.request_list[1]
        let thirdMovie = guild.request_list[2]
        message.channel.send({
            "embed": {
                "title": firstMovie.title,
                "description": firstMovie.plot,
                "color": 14250239,
                "thumbnail": {
                    "url": firstMovie.poster
                },
                "fields": [{
                        "name": "Year :calendar:",
                        "value": firstMovie.year,
                        "inline": true
                    },
                    {
                        "name": "Rotten Tomatoes Score :tomato:",
                        "value": firstMovie.ratings,
                        "inline": true
                    },
                    {
                        "name": ":scales:",
                        "value": "To vote for this movie, click on :smiling_imp: below the poll message."
                    },
                    {
                        "name": "\u200b",
                        "value": "[View more information about this movie!](http://www.imdb.com/title/" + firstMovie.link + "/)"
                    },
                    
                ]
            }
        })
        message.channel.send({
            "embed": {
                "title": secondMovie.title,
                "description": secondMovie.plot,
                "color": 14250239,
                "thumbnail": {
                    "url": secondMovie.poster
                },
                "fields": [{
                        "name": "Year :calendar:",
                        "value": secondMovie.year,
                        "inline": true
                    },
                    {
                        "name": "Rotten Tomatoes Score :tomato:",
                        "value": secondMovie.ratings,
                        "inline": true
                    },
                    {
                        "name": ":scales:",
                        "value": "To vote for this movie, click on :skull: below the poll message."
                    },
                    {
                        "name": "\u200b",
                        "value": "[View more information about this movie!](http://www.imdb.com/title/" + secondMovie.link + "/)"
                    },
                    
                ]
            }
        })
        message.channel.send({
            "embed": {
                "title": thirdMovie.title,
                "description": thirdMovie.plot,
                "color": 14250239,
                "thumbnail": {
                    "url": thirdMovie.poster
                },
                "fields": [{
                        "name": "Year :calendar:",
                        "value": thirdMovie.year,
                        "inline": true
                    },
                    {
                        "name": "Rotten Tomatoes Score :tomato:",
                        "value": thirdMovie.ratings,
                        "inline": true
                    },
                    {
                        "name": ":scales:",
                        "value": "To vote for this movie, click on :ghost: below the poll message."
                    },
                    {
                        "name": "\u200b",
                        "value": "[View more information about this movie!](http://www.imdb.com/title/" + thirdMovie.link + "/)"
                    },
                    
                ]
            }
        })
        message.channel.send("<@&" + guild.movie_night_role_id + "> **React with the corresponding symbol to vote for your movie of choice**\n\n***:smiling_imp: : " + firstMovie.title + "\n\n:japanese_ogre: : " + secondMovie.title + "\n\n:ghost: : " + thirdMovie.title + "***")
            .then(message => {
                message.react("😈")
                message.react("👹")
                message.react("👻")
            })
            .catch(console.error)
    })
}