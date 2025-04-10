const mongoose = require("mongoose")

const resourcesSchema = new mongoose.Schema({
    resourcesId: { type: String, required: true, unique: true },
    resourcesType: { type: String, required: true },
    resourcesDate: { type: Date, default: Date.now },
    resourcesHeading: { type: String, required: true },
    resourcesContent: { type: String, required: true },
    resourcesImage: {type: String, required: true},
    stared: { type: Boolean, default: false },
    detailedContent: {type: String, required: true}
}, { timestamps: true });

module.exports = mongoose.model("resources", resourcesSchema);
