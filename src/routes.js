const express  = require('express');
const router   = express.Router();
const utils    = require('./utils');

var firebase = require("firebase/app");

// In memory databse 
const database = {};

router.get('/isLoggedIn', (request, response) => {
    if(!request.session.loggedIn) {
        response.json({
            'status': 'failed'
        })
    } else {
        response.json({
            'status': 'ok'
        })
    }
})

router.get('/logout', (request, response) => {
    request.session.loggedIn = false;
    request.session.userEmail = undefined;

    response.json({
        'status': 'ok'
    })
})

router.get('/accountInfo', (request, response) => {
    if(!request.session.loggedIn) {
        response.json({
            'status': 'failed',
            'message': 'Access denied'
        })
    } else {
        response.json({
            'status': 'ok',
            'name': database[request.session.userEmail].name,
        })
    }
})

router.post('/register', (request, response) => {
    if(!request.body || !request.body.userEmail || !request.body.password || !request.body.name) {
        response.json({
            'status': 'failed',
            'message': 'Request missing email or password!'
        })

        return
    }

    let userEmail = request.body.userEmail;
    let password = request.body.password;
    let name     = request.body.name;

    if(database[userEmail]) {
        response.json({
            'status': 'failed',
            'message': `Email ${userEmail} already exists`
        })

        return
    }


    database[userEmail] = {
        'password': password,
        'name': name,
        'id': utils.randomBase64URLBuffer()
    }

    request.session.loggedIn = true;
    request.session.userEmail = userEmail

    response.json({
        'status': 'ok'
    })
})


router.post('/login', (request, response) => {
    if(!request.body || !request.body.userEmail || !request.body.password) {
        response.json({
            'status': 'failed',
            'message': 'Request missing email or password!'
        });

        return
    }

    let userEmail = request.body.userEmail;
    let password = request.body.password;

    if(!database[userEmail] || database[userEmail].password !== password) {
        response.json({
            'status': 'failed',
            'message': `Wrong email or password!`
        });

        return
    }

    request.session.loggedIn = true;
    request.session.userEmail = userEmail

    response.json({
        'status': 'ok'
    })
})

module.exports = router;
