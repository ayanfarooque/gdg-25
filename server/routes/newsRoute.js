const express = require('express')
const router = express.Router()

const {createNews,getnewsbyID,updateResources,deleteResources,getAllNews} = require('../controllers/newsController.js')

router.post('/create-news',createNews)

router.get('/news',getAllNews)
router.get('/news/:newsId',getnewsbyID)
//router.put('/news/:newsId',updateNews)
//router.delete('/news/:newsId',deleteNews)


module.exports = router;