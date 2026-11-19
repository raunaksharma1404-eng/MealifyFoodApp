const express = require('express');
const router = express.Router();
const budgetController = require('../controllers/budgetController');

router.get('/find', budgetController.findBudgetMeals);

module.exports = router;

