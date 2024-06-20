const db = require('../db')
const { Router } = require('express');
const router = Router();
const bodyParser = require('body-parser');
const signupQueries = require('../signupQueries');
router.use(bodyParser.json());

router.post('/isunder', async (req, res) => {
    const { user_id } = req.body;

    try {
        const result = await db.query(signupQueries.isMinutesUnder, [user_id]);

        if (result.rows.length > 0) {

            return res.status(200).json({
                message: 'Data fetched successfully',
                results: result.rows.map(row => ({
                    ...row,
                    minutes_under: row.minutes_under
                }))
            });
        }
    }
    catch (error) {
        return res.status(500).send('Server error');
    }
});

module.exports = router;



