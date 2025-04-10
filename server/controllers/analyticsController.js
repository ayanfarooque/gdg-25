const Analytics = require('../models/Analytics.js')

exports.getStudentAnalytics = async (req,res) => {
    try {
        const {studentId} = req.params;
        const analytics = await Analytics.findOne({studentId}).populate("scores.subjectId growthPoints.subjectId")

        if (!analytics) {
            return res.status(404).json({ success: false, message: "Analytics not found" });
        }

        res.status(200).json({ success: true, analytics });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.updateStudyHours = async (req,res) => {
    try {
        const {studentId} = req.params;
        const{subjectId,hoursSpent} = req.body;

        let analytics = await Analytics.findOne({studentId})

        if(!analytics){
            return res.status(404).json({success: false,message: "Analytics not found"})
        }

        let subjectHours = analytics.studyHours.find(s => s.subjectId.equals(subjectId));

        if (subjectHours) {
            subjectHours.hoursSpent += hoursSpent;
        } else {
            analytics.studyHours.push({ subjectId, hoursSpent });
        }

        await analytics.save();
        res.status(200).json({ success: true, message: "Study hours updated", analytics });
    } 
     catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.addTestScore = async (req,res) => {
    try {
        const {studentId} = req.params
        const {subjectId, subjectName, testId,testDate,testMarks} = req.body;

        let analytics = await Analytics.findOne({studentId});

        if(!analytics){
            analytics = new Analytics({
                studentId,
                scores: [],
                growthPoints: [],
                totalGrowthPoints: 0
            })
        }

        let subject = analytics.scores.find(s => s.subjectId.equals(subjectId));

        if(!subject){
            analytics.scores.push({subjectId,subjectName,tests: [{testId, testDate, testMarks}]})
        } else {
            subject.tests.push({ testId, testDate, testMarks });
        }

        await analytics.save();
        res.status(200).json({ success: true, message: "Test score added", analytics });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}

exports.updateGrowthPoints = async (req,res) => {
    try {
        const {studentId} = req.params;
        const {subjectId, subjectPoints} = req.body;

        let analytics = await Analytics.findOne({studentId});
        if(!analytics){
            return res.status(404).json({success:false,message: "Analytics not found"})
        }

        let subjectGrowth = analytics.growthPoints.find(s => s.subjectId.equals(subjectId))

        if (subjectGrowth) {
            subjectGrowth.subjectPoints += subjectPoints;
        } else {
            analytics.growthPoints.push({ subjectId, subjectPoints });
        }

        //analytics.growthPoints is assumed to be an array of objects, where each object has a property called subjectPoints.
        // .reduce((sum, s) => sum + s.subjectPoints, 0) iterates over this array and accumulates the sum of all subjectPoints, starting with an initial value of 0.
        // The result is stored in analytics.totalGrowthPoints
        analytics.totalGrowthPoints = analytics.growthPoints.reduce((sum, s) => sum + s.subjectPoints, 0);

        await analytics.save();
        res.status(200).json({ success: true, message: "Growth points updated", analytics });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
}