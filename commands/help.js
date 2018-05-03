exports.run = (bot, message, args) => {
    message.channel.send({
        "embed": {
            "title": "Commands and help",
            "color": 10109676,
            "fields": [
                {
                    "name": "__`~setup`__",
                    "value": "Ex: `~setup`\nDisplays setup instructions. (Only usable by owner of server)"
                },
                {
                    "name": "__`~addMovieRole`__",
                    "value": "Ex: `~addMovieRole`\nAssigns the movie night role to user for notifications when polls or created or movie viewings start."
                },
                {
                    "name": "__`~removeMovieRole`__",
                    "value": "Ex: `~removeMovieRole`\nRemoves the movie night role from user."
                },
                {
                    "name": "__`~addMovie [title] // [year]`__",
                    "value": "Ex: `~addMovie Shrek`\nEx: `~addMovie The Shape of Water // 2017`\nAdds a movie to the movie list. (**Note**: Year is optional but will ensure the right movie is added to the list.)"
                },
                {
                    "name": "__`~removeMovie [title] // [year]`__",
                    "value": "Ex: `~addMovie Shrek`\nEx: `~addMovie The Shape of Water // 2017`\nAllows a movie night mod to remove a movie from the list. Command must be typed in movie list channel. (**Note**: Year is optional but will ensure the right movie is removed from the list.)"
                },
                {
                    "name": "__`~createMoviePoll`__",
                    "value": "Ex: `~createMoviePoll`\nSelects three random movies from the list and creates a reaction poll for users to vote on."
                },
                {
                    "name": "__`~aboutMovie [title] // [year]`__",
                    "value": "Ex: `~aboutMovie Shrek`\nEx: `~aboutMovie The Shape of Water // 2017`\nCreates a preview of selected movie featuring a plot summary, year of release, Rotten Tomatoes score, and a link to the movie's IMDB page. (**Note**: Year is optional but will ensure the right movie is displayed.)"
                }
            ]
        }
    })
}
