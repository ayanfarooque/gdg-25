const express = require('express');
const {
     
    getResource, 
    updateResources,  
    deleteResources,  
    getAllResources
} = require('../controllers/resourceController.js');  

const router = express.Router();

router.get('/resources', getAllResources);
router.get('/resources/:resourcesId', getResource);
router.put('/resources/:resourcesId', updateResources);
router.delete('/resources/:resourcesId', deleteResources);

module.exports = router;
