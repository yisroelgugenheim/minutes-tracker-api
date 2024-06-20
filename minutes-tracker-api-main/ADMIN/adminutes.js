const db = require('../db')
const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');
const signupQueries = require('../signupQueries');
router.use(bodyParser.json());

router.post('/adminutes', async (req, res) => {
    const { user_id, session_length, time } = req.body;

    if (!user_id) {
        return res.status(400).json({message: 'user id is required'});
    } else if (!session_length) {
        return res.status(400).json({message: 'session length is required'});
    } else if (!time) {
        return res.status(400).json({message: 'time is required'});
    } else {
        try {
            const hasUserId = await db.query(signupQueries.userId, [user_id]);
            if (hasUserId.rows.length) {
                await db.query(signupQueries.addMinsRtrnRows, [user_id, session_length, time]);
              return res.status(200).json({message: 'session added successfully!'});
            }
            else {
               return res.status(400).json({message: 'user id provided is invalid!'});
            }

        }
        catch (error) {
            res.status(500).send('Server error');
        }
    }
});

module.exports = router;
