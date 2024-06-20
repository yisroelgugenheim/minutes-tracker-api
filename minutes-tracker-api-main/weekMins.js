const db = require('./db')
const {Router} = require('express');
const router = Router();
const bodyParser = require('body-parser');

router.use(bodyParser.json());

router.get('/week', async (req, res) => {
  try {
    const result = await db.query(`
      SELECT date_trunc('week', time) AS week, SUM(session_length) AS total_minutes
      FROM sessions
      GROUP BY week
      ORDER BY week;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
