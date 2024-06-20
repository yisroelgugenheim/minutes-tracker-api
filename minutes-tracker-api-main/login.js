const db = require('./db')
const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
router.use(bodyParser.json());
const bcrypt = require('bcryptjs');
const signupQueries = require('./signupQueries');

const fields = ['email', 'password'];
router.post('/login', body(fields).trim().notEmpty().escape(), async (req, res) => {
    // Validation
    const invalidResult = validationResult(req);
    if (!invalidResult.isEmpty()) {
        return res.status(400).json({ errors: invalidResult.array() });
    }

    const { email, password } = req.body;

    try {
        // Check if email exists in database
        const userResult = await db.query(signupQueries.emailUsed, [email]);
        if (userResult.rows.length === 0) {
            return res.status(400).json({message: `Your email does not match.`});
        }

        const user_id = userResult.rows[0].user_id;

        // Compare hashed password
        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: 'Your password does not match.'});
        };

        // Check if user is verified
        if (user.verified === 0) {
            return res.status(403).json({message: 'Admin has not verified you yet, sorry.'});
        };

        const result = await db.query(signupQueries.returnUserMins, [user_id]);

          if (result.rows.length) {
            return res.status(200).json({
        message: 'login successful!',
        result: result.rows,
         user_id: user.user_id,
         admin: user.admin,
         first_name: user.first_name,
         last_name: user.last_name,
         email: user.email
    });
        }
        else {
            return res.status(200).json({
                message: 'login successful!',
                pledged_minutes: user.pledged_minutes,
                 user_id: user_id,
                 admin: user.admin
            });
        }


    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;

