const express = require("express");
const router = express.Router();
const assignassignmentController = require("../controllers/assignassignmentController");

router.post('/assign',assignassignmentController.assignassginment)