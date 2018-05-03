exports.run = (bot, message, args) => {
    if (message.author.id !== message.guild.ownerID) {
        message.channel.send("Only the server owner can set up Movie Knight!")
        return
    }
    message.channel.send("Check the website for detailed setup instructions and information!")
}