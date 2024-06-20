const db = require('../db')
const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');
const signupQueries = require('../signupQueries');
router.use(bodyParser.json());

router.get('/getusers', async(req, res) => {
    try {
       const users = await db.query(signupQueries.getUsers);
       if (users.rows.length) {
        // Create an array of user objects with id and label properties
        const userList = users.rows.map(user => ({
            id: user.user_id,
            verified: user.verified,
            admin: user.admin,
            label: `${user.first_name} ${user.last_name}`
        }));
        return res.json(userList);
       } else {
         return res.status(400).json({message: 'Unable to retrieve users!'});
       }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});


router.get('/unverified', async(req, res) => {
    try {
       const users = await db.query(`SELECT user_id, first_name, last_name FROM users WHERE users.verified = 0`);
       if (users.rows.length) {
        // Create an array of user objects with id and label properties
        const userList = users.rows.map(user => ({
            id: user.user_id,
            label: `${user.first_name} ${user.last_name}`
        }));
        return res.json(userList);
       } else {
         return res.status(400).json('Unable to retrieve users!');
       }
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;
