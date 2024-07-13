const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String }, // Password is no longer required for Google users
    cartData: { type: Object, default: {} },
    googleId: { type: String, unique: true }, // Add a field for the Google ID
    picture: { type: String }, // Optional: to store the user's Google profile picture
}, { minimize: false });

module.exports = mongoose.model("User", userSchema);
