const db = require('../db')
const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
const signupQueries = require('../signupQueries');
router.use(bodyParser.json());

router.post('/getminutes', async(req, res) => {
    try {
        const {user_id} = req.body;
        const result = await db.query(signupQueries.getRecentSessions, [user_id]);
        res.status(200).json(result.rows);
    }
    catch (error) {
        res.status(500).send('server error');
    }
});

router.post('/allminutes', async(req, res) => {
    try {
        const {user_id} = req.body;
        const result = await db.query(signupQueries.getAllSessions, [user_id]);
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).send('server error');
    }
});


module.exports = router;
