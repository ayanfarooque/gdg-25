const News = require('../models/News.js')

exports.createNews = async (req,res) => {
    try {
        const news = new News(req.body);
        await news.save();
        res.status(201).json({messsage: "News Created Successfully", news});
    } catch (error) {
        console.error("Error creating news:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
}


exports.getnewsbyID = async (req, res) => {
    try {
        const news = await News.findOne({ newsId: req.params.newsId }); 
        if (!news) {
            return res.status(404).json({ message: "News not found" });
        }

        res.status(200).json(news);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


exports.updateNews = async (req, res) => {
    try {
        const updatedNews = await News.findByIdAndUpdate(req.params.newsId, req.body, { new: true });
        if (!updatedNews) {
            return res.status(404).json({ message: "News not found" });
        }
        res.status(200).json({ message: "News updated successfully", updatedNews });
    } catch (error) {
        console.error("Error updating news:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deleteNews = async (req, res) => {
    try {
        const deletedNews = await News.findByIdAndDelete(req.params.newsId);
        if (!deletedNews) {
            return res.status(404).json({ message: "News not found" });
        }
        res.status(200).json({ message: "News deleted successfully" });
    } catch (error) {
        console.error("Error deleting news:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getAllNews = async (req, res) => {
    try {
        const newsList = await News.find().sort({ createdAt: -1 }); 
        res.status(200).json(newsList);
    } catch (error) {
        console.error("Error fetching news:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};