const db = require('./db');
const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const signupQueries = require('./signupQueries');
router.use(bodyParser.json());

router.put('/resetpassword',
    body(['email', 'password', 'confirmPassword']).trim().notEmpty().escape(),
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password, confirmPassword } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ message: `Passwords do not match; password was: ${password} and confirmed password was: ${confirmPassword}` });
        }

        try {
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const hasEmail = await db.query(signupQueries.emailUsed, [email]);

            if (hasEmail.rows.length) {
                await db.query(signupQueries.updatePassword, [hashedPassword, email]);
                return res.status(200).json({ message: 'Password updated successfully.' });
            } else {
                return res.status(400).json({ message: 'User not found.' });
            }
        } catch (error) {
            return res.status(500).json({ message: 'An error occurred, please try again later.' });
        }
});

module.exports = router;
