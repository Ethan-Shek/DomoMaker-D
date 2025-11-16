const models = require('../models');
const Account = models.Account;

const loginPage = (req, res) => {
    return res.render('login');
};

const logout = (req, res) => {
    req.session.destroy();
    return res.redirect('/');
};

const login = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    return Account.authenticate(username, pass, (err, account) => {
        if (err || !account) {
            return res.status(401).json({ error: 'Wrong username or password!' });
        }

        req.session.account = Account.toAPI(account);

        return res.json({ redirect: '/maker' });
    });
};

const signup = (req, res) => {
    const username = `${req.body.username}`;
    const pass = `${req.body.pass}`;

    if (!username || !pass) {
        return res.status(400).json({ error: 'All fields are required!' });
    }

    return Account.generate(username, pass, (err, account) => {
        if (err) {
            if (err.code === 11000) {
                return res.status(400).json({ error: 'Username already in use.' });
            }
            return res.status(400).json({ error: 'An error occurred' });
        }

        req.session.account = Account.toAPI(account);
        return res.json({ redirect: '/maker' });
    });
};

module.exports = {
    loginPage,
    logout,
    login,
    signup,
};
