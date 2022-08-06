const axios = require('axios');

exports.loginUser = async (req, res) => {
    // USER LOGIN INPUT
    const { username, password, ok } = req.body;

    // GET USER DATA FROM DATABASE
    const response = await axios.get('http://localhost:7000/api/user-game');

    const { users } = response.data.data;

    // CHECK USERNAME AND PASSWORD
    let usernameCorrect = false;
    let passwordCorrect = false;
    let userData;

    users.forEach((user) => {
        if (!(user.password === password && user.username === username)) return;

        usernameCorrect = true;
        passwordCorrect = true;
        userData = user;
    });

    if (!usernameCorrect)
        return res.status(404).json({
            status: 'fail',
            message: 'Wrong username',
        });
    if (!passwordCorrect)
        return res.status(404).json({
            status: 'fail',
            message: 'Wrong password',
        });

    res.status(200).json({
        status: 'success',
        message: 'successful to login',
        data: {
            userData,
        },
    });

    console.log(`Success, username: ${username}, password: ${password}`, userData);
};
