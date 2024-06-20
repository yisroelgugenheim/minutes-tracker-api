const express = require('express');
const app = express();
const cors = require('cors');
const getUsersHandler = require('./ADMIN/getUsers');
const getMinsHandler = require('./ADMIN/getMins');
const updateMinsHandler = require('./ADMIN/updateMins');
const verifyUserHandler = require('./ADMIN/verify');
const adminutesHandler = require('./ADMIN/adminutes');
const createAdminHandler = require('./ADMIN/adminify');
const getUserWeeksHandler = require('./ADMIN/getUserWeeks');
const getIfUnderMinsHandler = require('./ADMIN/ifMinsUnder');
const postMinsHandler = require('./postMins');
const weekMinsHandler = require('./weekMins');
const loginHandler = require('./login');
const resetPasswordHandler = require('./resetPassword');
const signupHandler = require('./signup');
app.use(express.json());
app.use(cors());
app.use('/', postMinsHandler);
app.use('/', weekMinsHandler);
app.use('/', loginHandler);
app.use('/', signupHandler);
app.use('/', resetPasswordHandler);
app.use('/', getUsersHandler);
app.use('/', getMinsHandler);
app.use('/', updateMinsHandler);
app.use('/', verifyUserHandler);
app.use('/', adminutesHandler);
app.use('/', createAdminHandler);
app.use('/', getUserWeeksHandler);
app.use('/', getIfUnderMinsHandler);

app.get('/', (req, res) => {
    res.send('hello!')
});
const port = 3000 || process.env.PORT;
app.listen(port);


