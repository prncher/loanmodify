const express = require('express');
const router = express.Router();
const utils = require('./utils');

// In memory databse 
const database = {};

router.setFirebase = (fb) => router.fb = fb;

router.get('/isLoggedIn', (request, response) => {
    if (!request.session.loggedIn) {
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
    if (!request.session.loggedIn) {
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
    if (!request.body || !request.body.userEmail || !request.body.password || !request.body.name) {
        response.json({
            'status': 'failed',
            'message': 'Request missing email or password!'
        })

        return
    }

    let userEmail = request.body.userEmail;
    let password = request.body.password;
    let name = request.body.name;

    this.fb.auth().createUserWithEmailAndPassword(userEmail, password)
        .then((user) => {
            // Signed in 
            database[userEmail] = {
                'name': name,
                'id': utils.randomBase64URLBuffer()
            }

            response.json({
                'status': 'ok'
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            response.json({
                'status': 'failed: ' + errorCode,
                'message': `Email ${userEmail} already exists -` + errorMessage
            })

            return
        });

    // if(database[userEmail]) {
    //     response.json({
    //         'status': 'failed',
    //         'message': `Email ${userEmail} already exists`
    //     })

    //     return
    // }


    // database[userEmail] = {
    //     'password': password,
    //     'name': name,
    //     'id': utils.randomBase64URLBuffer()
    // }

    // request.session.loggedIn = true;
    // request.session.userEmail = userEmail

    response.json({
        'status': 'ok'
    })
})


router.post('/login', (request, response) => {
    if (!request.body || !request.body.userEmail || !request.body.password) {
        response.json({
            'status': 'failed',
            'message': 'Request missing email or password!'
        });

        return
    }

    let userEmail = request.body.userEmail;
    let password = request.body.password;

    this.fb.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
            // Signed in 
            request.session.loggedIn = true;
            request.session.userEmail = userEmail

            response.json({
                'status': 'ok'
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            response.json({
                'status': 'failed: ' + errorCode,
                'message': `Email ${userEmail} already exists -` + errorMessage
            })

            return
        });

    // if (!database[userEmail] || database[userEmail].password !== password) {
    //     response.json({
    //         'status': 'failed',
    //         'message': `Wrong email or password!`
    //     });

    //     return
    // }

    request.session.loggedIn = true;
    request.session.userEmail = userEmail

    response.json({
        'status': 'ok'
    })
})

module.exports = router;
