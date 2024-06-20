const db = require('../db')
const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');
const signupQueries = require('../signupQueries');
router.use(bodyParser.json());

// Endpoint to verify a user based on their id
router.post('/adminify', async (req, res) => {
    const {user_id} = req.body;

    if (!user_id) {
        return res.status(400).json({message: 'user id is required'});
    }

    try {
        // get the user by id
        const userResult = await db.query(signupQueries.userId, [user_id]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({message: 'User not found'});
        }

       // update the user's status to admin
        await db.query(signupQueries.makeAdmin, [user_id]);

        return res.status(200).json({message: 'User is now an admin'});

    } catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
