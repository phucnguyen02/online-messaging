const express = require('express'); // Web framework for Node.js
const router = express.Router(); // Creates an instance of an Express Router
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {insertUser, deleteUser, findUsername, verifyUserPassword, getAllUsers} = require('../controllers/usersController')

router.post('/register', (req, res) => {
    console.log(req.body.password);
    bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
        insertUser(req.body.username, hashedPassword).then((result) => {
            res.status(201).send({message: 'User created successfully', result})
        }).catch((error) => {
            res.status(500).send({message: 'Error creating user', error});
        });
    }).catch((e) => {
        res.status(500).send({message: 'Password not hashed successfully', e})
    })
})

router.post('/login', (req, res) => {
    findUsername(req.body.username).then((user) => {
        bcrypt.compare(req.body.password, user.dataValues.password).then((passwordCheck) => {
            if(!passwordCheck){
                return res.status(400).send({message: 'Passwords do not match'})
            }
            
            const token = jwt.sign(
                {
                    userID: user.dataValues.userID,
                    username: req.body.username
                },
                "RANDOM-TOKEN",
                {expiresIn: "24h"}
            )

            res.status(200).send({
                message: 'Login successful',
                username: req.body.username,
                token
            })
        }).catch((error) => {
            res.status(400).send({message: 'Passwords do not match', error});
        })
    }).catch((e) => {
        res.status(404).send({message: 'Username does not exist', e});
    })
})

router.get('/getAllUsers', (req, res) => {
    getAllUsers().then((users) => res.send(users));
})


module.exports = router;
