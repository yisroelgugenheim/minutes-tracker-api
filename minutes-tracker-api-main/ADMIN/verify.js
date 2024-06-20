const db = require('../db')
const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');
router.use(bodyParser.json());
const signupQueries = require('../signupQueries');

// verify a user based on their id
router.post('/verify', async (req, res) => {
    const {user_id} = req.body;

    if (!user_id) {
        return res.status(400).json({message: 'user id is required'});
    }

    try {
        // get the user by id
        const userResult = await db.query(signupQueries.userId, [user_id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json('User not found');
        }

       // update the user to verified status
        await db.query(signupQueries.verify, [user_id]);

        return res.status(200).json({message: 'User verified successfully!'});
    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
