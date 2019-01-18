const mongoose = require("mongoose")
const Schema = mongoose.Schema

//Create Mongoose schema
const guildSchema = new Schema({
    guild_name: String,
    guild_id: { type: String, unique: true },
    guild_icon: String,
    guild_prefix: String,
    owner_id: String,
    moderator_role_id: String,
    movie_night_role_id: String,
    movie_night_channel_id: String,
    movie_list_channel_id: String,
    movie_cooldown: String,
    request_list: []
})

//Create Mongoose model
const Guild = mongoose.model("Guild", guildSchema)
module.exports = Guild