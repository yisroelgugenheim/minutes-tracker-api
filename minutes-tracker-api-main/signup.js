const db = require('./db');
const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const signupQueries = require('./signupQueries');
const bcrypt = require('bcryptjs');
router.use(bodyParser.json());

router.post('/signup',
  [
    // Validate and sanitize first and last names
    body('first_name').trim().matches(/^[a-zA-Z'-\s]+$/).withMessage('Invalid characters in first name'),
    body('last_name').trim().matches(/^[a-zA-Z'-\s]+$/).withMessage('Invalid characters in last name'),

    // Validate email allowing special characters
    body('email').trim().isEmail().withMessage('Invalid email address'),

    // removing leading/trailing spaces from password
    body('password').trim().matches(/^[\x21-\x7E]+$/).withMessage('Invalid characters in password'),

    // Validate pledged minutes to ensure it's a number
    body('pledged_minutes').trim().isNumeric().withMessage('Pledged minutes must be a number'),
  ],
   async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
   // signup logic
  const { first_name, last_name, email, password, pledged_minutes } = req.body;
  try {
      // check for duplicate email
      const userResult = await db.query(signupQueries.emailUsed, [email]);
      if (userResult.rows.length) {
        return res.status(400).json({message: 'Your email is already registered. Please log in.'});
      }
     // Password hashing
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
    // Database operation
      await db.query(signupQueries.signup, [first_name, last_name, email, hashedPassword, pledged_minutes]);
      res.status(201).json({
        message: 'You successfully signed up! An administrator will verify your credentials in due time. Have a great day!'
      });
    } catch (error) {
         res.status(500).send('Server error');
    }
});

module.exports = router;
