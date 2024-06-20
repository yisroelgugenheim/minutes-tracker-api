const db = require('./db');
const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser')
const {body, validationResult} = require('express-validator');
const signupQueries = require('./signupQueries');
router.use(bodyParser.json());

const fields = ['session_length', 'time'];

router.post('/sessions', body(fields).trim().notEmpty().escape(), async (req, res) => {
    // Validation
    const invalidResult = validationResult(req);
    if (!invalidResult.isEmpty()) {
        return res.status(400).json({ errors: invalidResult.array() });
    }

   const { session_length, time, user_id } = req.body;

    try {                  // Database operation

        if (user_id) {

        await db.query(signupQueries.postSessions, [session_length, time, user_id]);

            const session_id = await db.query(`SELECT session_id FROM sessions WHERE user_id = $1`, [user_id])

           return res.status(201).send(
            "Keep up the great work!"
        );

        };
          return res.status(400).json({message: 'did not recieve user_id'});
    }

    catch (error) {
        res.status(500).send('Server error');
    }
});

module.exports = router;
