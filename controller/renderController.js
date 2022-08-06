const axios = require('axios');

exports.renderHomepage = function (req, res) {
    res.render('index');
};

exports.renderGame = function (req, res) {
    res.render('game');
};

exports.renderRegister = function (req, res) {
    res.render('signIn');
};

exports.renderUserDashboard = async function (req, res) {
    const response = await axios.get('http://localhost:7000/api/user-game');

    const { users } = response.data.data;

    res.render('userDashboard', { users });
};

exports.renderBiodataDashboard = async function (req, res) {
    console.log(req.query.id);
    const response = await axios.get(
        `http://localhost:7000/api/user-game-biodata/${req.query.id}`
    );

    const { biodata } = response.data.data;

    res.render('biodataDashboard', { biodata });
};

exports.renderHistoryDashboard = async function (req, res) {
    console.log(req.query.id);
    const response = await axios.get(
        `http://localhost:7000/api/user-game-history/${req.query.id}`
    );

    const { history } = response.data.data;

    res.render('historyDashboard', { history });
};
