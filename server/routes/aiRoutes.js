const express = require('express');
const router = express.Router();
const aiAssistantController = require('../controllers/aiAssistantController');

router.post('/recommend', aiAssistantController.getAIRecommendations);

module.exports = router;

