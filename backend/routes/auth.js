/**
 * Authentication Routes
 * POST /api/auth/login - User login
 */

const express = require('express');
const { login } = require('../controllers/authController');

const router = express.Router();

// POST /login
router.post('/login', login);

module.exports = router;
