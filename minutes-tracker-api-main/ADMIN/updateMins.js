const db = require('../db')
const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');
const {body, validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const signupQueries = require('../signupQueries');
router.use(bodyParser.json());

const fields = ['session_id', 'session_length'];

router.put('/updateminutes', body(fields).trim().notEmpty().escape(), async (req, res) => {

    const invalidResult = validationResult(req);
    if (!invalidResult.isEmpty()) {
        return res.status(400).json({ errors: invalidResult.array() });
        }
        const { session_length, session_id} = req.body;

        try {

            await db.query(signupQueries.updateSession, [session_length, session_id]);

           return res.status(200).json({message: 'minutes updated successfully!'});

        } catch (error) {
            res.status(400).send('server error');

        }
});

module.exports = router;






