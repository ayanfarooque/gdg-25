const Event = require('../models/Calendar.js');

exports.getEvents = async (req,res) => {
    try {
        const events = await Event.find({studentIds: req.user.id});
        res.json(events);
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

exports.createEvent = async (req,res) => {
    try {
        const {title,description,date,studentIds} = req.body;
        if (!title || !date || !studentIds || studentIds.length === 0) {
            return res.status(400).json({ success: false, message: "Please provide all required fields" });
        }

        const event = new Event({
            title,
            description,
            date,
            createdBy: req.teacher._id,//notehere we get teacher id through authteacher middlweare which is just place before this api call
            studentIds
        })
        await event.save();
        res.status(201).json({ success: true, message: "Event created successfully", event });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error creating event", error: error.message });
    }
}

exports.updateEvent = async (req, res) => {
    try {
        const { eventId } = req.params;
        const { title, description, date, studentIds } = req.body;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        //if it fails use req.teacher.id same for above and do it in classroom controller aswell
        if (event.createdBy.toString() !== req.teacher._id) {
            return res.status(403).json({ success: false, message: "Unauthorized to update this event" });
        }

        event.title = title || event.title;
        event.description = description || event.description;
        event.date = date || event.date;
        event.studentIds = studentIds || event.studentIds;

        await event.save();
        res.status(200).json({ success: true, message: "Event updated successfully", event });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error updating event", error: error.message });
    }
};

exports.deleteEvent = async (req, res) => {
    try {
        const { eventId } = req.params;

        const event = await Event.findById(eventId);
        if (!event) return res.status(404).json({ success: false, message: "Event not found" });

        //if it fails use req.teacher.id same for above and do it in classroom controller aswell
        if (event.createdBy.toString() !== req.teacher.id) {
            return res.status(403).json({ success: false, message: "Unauthorized to delete this event" });
        }

        await Event.findByIdAndDelete(eventId);
        res.status(200).json({ success: true, message: "Event deleted successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Error deleting event", error: error.message });
    }
};