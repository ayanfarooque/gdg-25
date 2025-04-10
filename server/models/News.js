const mongoose = require("mongoose")

const newsSchema = new mongoose.Schema({
    newsId: { type: String, required: true, unique: true },
    newsType: { type: String, required: true },
    newsDate: { type: Date, default: Date.now },
    newsHeading: { type: String, required: true },
    newsContent: { type: String, required: true },
    newsImage: {type: String, required: true},
    stared: { type: Boolean, default: false },
    detailedContent: {type: String, required: true}
}, { timestamps: true });

module.exports = mongoose.model("News", newsSchema);
