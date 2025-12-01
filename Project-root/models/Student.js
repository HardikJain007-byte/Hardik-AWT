const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
    sapId: { type: String, required: true },
    name: { type: String, required: true },
    marks: { type: Number, required: true, min: 0, max: 100 }
});

module.exports = mongoose.model("Student", studentSchema);
