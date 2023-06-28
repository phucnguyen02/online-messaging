const express = require('express'); // Web framework for Node.js
const router = express.Router(); // Creates an instance of an Express Router
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {insertUser, deleteUser, findUsername, getAllUsers} = require('../controllers/usersController')

router.post('/register', (req, res) => {
    findUsername(req.body.username).then((user) => {
        if(user)
            res.status(500).json({message: 'Username already exists'});
        else{
            bcrypt.hash(req.body.password, 10).then((hashedPassword) => {
                insertUser(req.body.username, hashedPassword).then((result) => {
                    res.status(201).json({message: 'User created successfully', result})
                }).catch((error) => {
                    res.status(500).json({message: 'Error creating user', error});
                });
            }).catch((e) => {
                res.status(500).json({message: 'Password not hashed successfully', e})
            })
        }
    }).catch((e) => {
        res.status(500).json({message: 'An error occurred while retrieving the user', e}) 
    });
    
   
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
            res.status(400).send({message: 'An error occurred while validating the password', error});
        })
    }).catch((e) => {
        res.status(404).send({message: 'Username does not exist', e});
    })
})

router.get('/getAllUsers', (req, res) => {
    getAllUsers().then((users) => {
        res.status(201).send(users);
    }).catch((e) => {
        res.status(404).send({message: 'An error occurred while fetching all users', e})
    });
})


module.exports = router;