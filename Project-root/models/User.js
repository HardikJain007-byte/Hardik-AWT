const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
    username: { type: String, unique: true, required: true },
    passwordHash: { type: String, required: true }
});

// behaves like setPassword()
userSchema.methods.setPassword = async function (plainPassword) {
    this.passwordHash = await bcrypt.hash(plainPassword, 10);
};

// validate entered password
userSchema.methods.validatePassword = function (plainPassword) {
    return bcrypt.compare(plainPassword, this.passwordHash);
};

module.exports = mongoose.model("User", userSchema);
