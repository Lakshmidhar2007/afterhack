const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

router.post('/search', aiController.searchProjects);
router.post('/chat', aiController.chatWithAI);

module.exports = router;
