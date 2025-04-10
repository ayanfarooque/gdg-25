const Resources = require('../models/Resources.js');

exports.getResource = async (req, res) => {
    try {
        const resource = await Resources.findById(req.params.resourcesId); // Fixed variable name
        if (!resource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        res.status(200).json(resource);
    } catch (error) {
        console.error("Error fetching Resource:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.updateResources = async (req, res) => {
    try {
        const updatedResource = await Resources.findByIdAndUpdate(
            req.params.resourcesId, 
            req.body, 
            { new: true }
        );
        if (!updatedResource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        res.status(200).json({ message: "Resource updated successfully", updatedResource });
    } catch (error) {
        console.error("Error updating Resource:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.deleteResources = async (req, res) => {
    try {
        const deletedResource = await Resources.findByIdAndDelete(req.params.resourcesId);
        if (!deletedResource) {
            return res.status(404).json({ message: "Resource not found" });
        }
        res.status(200).json({ message: "Resource deleted successfully" });
    } catch (error) {
        console.error("Error deleting Resource:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.getAllResources = async (req, res) => {
    try {
        const resourcesList = await Resources.find().sort({ createdAt: -1 });
        res.status(200).json(resourcesList);
    } catch (error) {
        console.error("Error fetching Resources:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
