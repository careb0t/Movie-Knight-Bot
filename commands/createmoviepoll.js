var moment = require('moment')
const Guild = require("../models/Guild.js")
exports.run = (bot, message, args) => {
    Guild.findOne({guild_id: message.guild.id}, function (err, guild) {
        console.log("guild.request_list.length=" + guild.request_list.length)
        if (!message.member.roles.has(guild.moderator_role_id)) {
            message.channel.send("Only movie night moderators can create polls!")
            return
        }
        if (guild.request_list.length < 3) {
            message.channel.send("There aren't enough movies on the list. Add some more!")
            return
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
                        "value": moment(firstMovie.year).format("MMMM Do, YYYY"),
                        "inline": true
                    },
                    {
                        "name": "Average Rating :trophy:",
                        "value": (firstMovie.ratings*10).toString() + "%",
                        "inline": true
                    },
                    {
                        "name": "\u200b",
                        "value": "To vote for this movie, click on :smiling_imp: below the poll message."
                    },
                    {
                        "name": "\u200b",
                        "value": "[View more information about this movie!]("+ firstMovie.link + ")"
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
                        "value": moment(secondMovie.year).format("MMMM Do, YYYY"),
                        "inline": true
                    },
                    {
                        "name": "Average Rating :trophy:",
                        "value": (secondMovie.ratings*10).toString() + "%",
                        "inline": true
                    },
                    {
                        "name": "\u200b",
                        "value": "To vote for this movie, click on :skull: below the poll message."
                    },
                    {
                        "name": "\u200b",
                        "value": "[View more information about this movie!]("+ secondMovie.link + ")"
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
                        "value": moment(thirdMovie.year).format("MMMM Do, YYYY"),
                        "inline": true
                    },
                    {
                        "name": "Average Rating :trophy:",
                        "value": (thirdMovie.ratings*10).toString() + "%",
                        "inline": true
                    },
                    {
                        "name": "\u200b",
                        "value": "To vote for this movie, click on :ghost: below the poll message."
                    },
                    {
                        "name": "\u200b",
                        "value": "[View more information about this movie!]("+ thirdMovie.link + ")"
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