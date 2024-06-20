const signup = 'INSERT INTO users(first_name, last_name, email, password, pledged_minutes) VALUES($1, $2, $3, $4, $5)';
const updateQuery = 'UPDATE users SET admin = 1 WHERE password = $1';

const updatePassword = 'UPDATE users SET password = $1 WHERE email = $2';

const hasLastName = 'SELECT * FROM users WHERE users.last_name = $1';

const emailUsed = 'SELECT * FROM users WHERE users.email = $1';

const postSessions = 'INSERT into sessions(session_length, time, user_id) VALUES($1, $2, $3)';

const getAllSessions = 'SELECT * FROM sessions WHERE user_id = $1';

const getRecentSessions = `
        SELECT * FROM sessions
        WHERE user_id = $1
        AND time >= NOW() - INTERVAL '1 month'
        `;

const userId = 'SELECT * FROM users WHERE user_id = $1';

const verify = 'UPDATE users SET verified = 1 WHERE user_id = $1';

const makeAdmin = 'UPDATE users SET verified = 1, admin = 1 WHERE user_id = $1';

const updateSession = 'UPDATE sessions SET session_length = $1 WHERE session_id = $2';

const isMinutesUnder = ` SELECT
        date_trunc('week', sessions.time) AS week_start,
        users.pledged_minutes * 12 AS quarterly_pledged_minutes, -- Weekly pledge multiplied by 12 weeks for 3 months
        SUM(sessions.session_length) AS total_minutes,
        CASE
            WHEN SUM(sessions.session_length) >= users.pledged_minutes * 12 THEN 'Met or Exceeded'
            ELSE 'Under'
        END AS status,
        GREATEST(users.pledged_minutes * 12 - SUM(sessions.session_length), 0) AS minutes_under
    FROM
        sessions
    JOIN
        users ON sessions.user_id = users.user_id
    WHERE
        sessions.user_id = $1
        AND sessions.time >= NOW() - INTERVAL '3 months'
    GROUP BY
        date_trunc('week', sessions.time), users.pledged_minutes
    ORDER BY
        date_trunc('week', sessions.time);
    `;

    const returnUserMins = `
    SELECT
      date_trunc('week', sessions.time) AS week,
      users.pledged_minutes AS pledged_minutes,
      SUM(sessions.session_length) AS total_minutes
    FROM
      sessions
    JOIN users ON sessions.user_id = users.user_id
    WHERE sessions.user_id = $1
    GROUP BY week, users.pledged_minutes
    ORDER BY week;
    `;

    const returnUserWeeks = `
        SELECT
        date_trunc('week', sessions.time) AS week_start,
        users.pledged_minutes AS pledged_minutes,
        SUM(sessions.session_length) AS total_minutes,
        CASE
          WHEN SUM(sessions.session_length) >= users.pledged_minutes THEN 'Met or Exceeded'
          ELSE 'Under'
        END AS status,
        GREATEST(users.pledged_minutes - SUM(sessions.session_length), 0) AS minutes_under
      FROM
        sessions
      JOIN users ON sessions.user_id = users.user_id
      WHERE sessions.user_id = $1 AND sessions.time >= NOW() - INTERVAL '1 month'
      GROUP BY date_trunc('week', sessions.time), users.pledged_minutes
      ORDER BY date_trunc('week', sessions.time);
        `;

    const getAllUserWeeks = `
        SELECT
        date_trunc('week', sessions.time) AS week_start,
        users.pledged_minutes AS pledged_minutes,
        SUM(sessions.session_length) AS total_minutes,
        CASE
          WHEN SUM(sessions.session_length) >= users.pledged_minutes THEN 'Met or Exceeded'
          ELSE 'Under'
        END AS status,
        GREATEST(users.pledged_minutes - SUM(sessions.session_length), 0) AS minutes_under
      FROM
        sessions
      JOIN users ON sessions.user_id = users.user_id
      WHERE sessions.user_id = $1
      GROUP BY date_trunc('week', sessions.time), users.pledged_minutes
      ORDER BY date_trunc('week', sessions.time);
    `;

    const addMinsRtrnRows = `INSERT INTO sessions(user_id, session_length, time) VALUES($1, $2, $3) RETURNING *
    `;

    const getUsers = 'SELECT user_id, first_name, last_name, verified, admin FROM users';



module.exports = {
    signup,
    updateQuery,
    hasLastName,
     emailUsed,
     postSessions,
     getAllSessions,
     getRecentSessions,
     userId,
     updatePassword,
     verify,
     makeAdmin,
     updateSession,
     isMinutesUnder,
     returnUserMins,
     returnUserWeeks,
     getAllUserWeeks,
     getUsers,
     addMinsRtrnRows
}
