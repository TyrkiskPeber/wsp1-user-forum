const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')

const db = require('../utils/database.js');
const promisePool = db.promise();


/* GET home page. */

router.get('/login', async function (req, res, next) {
    res.render('login.njk',
        {
            title: 'Login'
        });
});

router.post('/login', async function (req, res, next) {
    const { username, password } = req.body;
    if (username === "" && password === "") {
        return res.send('Username is Required')
    }
    else if (username === "") {
        return res.send('Username is Required')
    }
    else if (password === "") {
        return res.send('Password is Required')
    }
    else {
        const [user] = await promisePool.query(`SELECT * FROM lg09users WHERE name = ?`, [username])
        bcrypt.compare(password, user[0].password, function (err, result) {
            if (result === true) {
                req.session.userid = user[0].id;
                req.session.username = user[0].name;
                req.session.loggedin;                               //Används för att visa relevanta knappar i nav
                return res.redirect('/profile')
            }
            else {
                return res.send('Invalid username or password')
            }
        })
    }
});

router.get('/profile', async function (req, res, next) {
    if (req.session.username && req.session.userid) {               //Kollar ifall det finns en 'user' i sessionen
        res.render('profile.njk', {
            name: req.session.username,
        },
        console.log(req.session.userid, req.session.username))
    }
    else {
        return res.status(401).send('Access denied'),
        console.log(req.session.userid, req.session.username)
    }
})

router.post('/logout', async function (req, res, next) {
    if (req.session.username && req.session.userid) {
        req.session.destroy()
        return res.redirect('/forum')
    }
    else {
        return res.status(401).send('Access denied')
    }
})

router.get('/register', async function (req, res, next) {
    res.render('register.njk')
    

})

router.post('/register', async function (req, res, next) {
    const { username, password, passwordConfirmation } = req.body;
    if (username === "" && password === "" && passwordConfirmation === "") {
        return res.send('Username is Required')
    }
    else if (username === "") {
        return res.send('Username is Required')
    }
    else if (password === "") {
        return res.send('Password is Required')
    }
    else if (passwordConfirmation === "") {
        return res.send('Passwords should match')
    }

    if (password == passwordConfirmation) {

        bcrypt.hash(password, 10, async function (err, hash) {
            const [rows] = await promisePool.query("SELECT * FROM lg09users WHERE name = ?", [username])
            console.log(rows[0])
            if (rows.length === 0) {
                const [user] = await promisePool.query("INSERT INTO lg09users (name, password) VALUES (?, ?)", [username, hash])
                req.session.username = user[0].name
                return res.redirect('/profile')
            }
            else {
                return res.send('Username is already taken')
            }

        });

    }
    else {
        return res.send('Passwords do not match')
    }
})

router.get('/crypt/:password', async function (req, res, next) {
    console.log(req.params)
    const password = req.params.password

    bcrypt.hash(password, 10, function (err, hash) {
        console.log(hash)
        return res.json({ hash });

    });

})



router.post('/new-post', async function (req, res, next) {
    const { title, content } = req.body;
    const author = req.session.userid
    const [rows] = await promisePool.query("INSERT INTO lg09forum (authorId, title, content) VALUES (?, ?, ?)", [author, title, content]);
    res.redirect('/forum');
});

router.get('/new-post', async function (req, res, next) {
    const [users] = await promisePool.query(`SELECT lg09forum.*, lg09users.name FROM lg09forum
    JOIN lg09users ON lg09forum.authorId = lg09users.id`);
    if (req.session.userid && req.session.username) {               //Kollar ifall det finns en 'user' i sessionen
        res.render('new-post.njk', {
            title: 'Nytt inlägg',
            users,

        });
    }
    else {
        return res.status(401).send('Access denied, must be logged in to post')
    }
});

router.get('/forum', async function (req, res, next) {
    const [rows] = await promisePool.query(`SELECT lg09forum.*, lg09users.name FROM lg09forum
    JOIN lg09users ON lg09forum.authorId = lg09users.id`);
    res.render('forum.njk', {
        rows: rows,
        title: 'Nazarick',

    });
});

module.exports = router;