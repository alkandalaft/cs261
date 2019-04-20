const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const uuid = require('uuid/v4');
app.use(express.json());

let defaultAvatar = 'https://en.wikipedia.org/wiki/Smiley#/media/File:SNice.svg';
let root = '/api/v1';
const users = [];
let tokenSessionPairs = [];

let gameServerAddress = '107.23.194.146';
let gameServerPort = '8008';

//Create a user
app.post(`${root}/users/create`, (req, res) =>
{
    if(!req.body.username || !req.body.password)
    {
        res.status(400).send('Error, request missing information');
    }

    const user = users.find(u => u.username === req.body.username);
    if(!user)
    {
        //generate a user ID
        let idCounter = uuid();
        //if there was a specified avatar
        if(req.body.avatar)
        {        
            users.push({
                        id: idCounter,
                        username: req.body.username, 
                        password: req.body.password,
                        avatar: req.body.avatar
                        });
        }

        //else use default avatar
        else
        {
            users.push({
                        id: idCounter,
                        username: req.body.username, 
                        password: req.body.password,
                        avatar: defaultAvatar
                        });
        }

        res.status(200).send({
                                status: 'success', 
                                data: 
                                {
                                    id: idCounter, 
                                    username: req.body.username
                                }
                            });
    }

    else
    {
        res.status(200).send({
                                status: 'fail', 
                                reason: 
                                {
                                    username: 'Already taken'
                                }
                            });
    }
});

//Login, creates a new session and token
app.post(`${root}/users/login`, (req, res) =>
{
    const user = users.find(u => u.username === req.body.username);
    //check for missing user
    if(!user)
    {
        res.status(200).send({
            status: 'fail', 
            reason: 'Username/password mismatch'
        });
    }

    else if(user.password != req.body.password)
    {
        res.status(200).send({
            status: 'fail', 
            reason: 'Username/password mismatch'
        });
    }

    else
    {
        let sessionID = uuid();
        let token = uuid();

        tokenSessionPairs.push({id: user.id, session: sessionID, token: token});

        res.status(200).send({
                                status: 'success', 
                                data: 
                                {
                                    id: user.id, 
                                    session: sessionID, 
                                    token: token
                                }
                            });
    }

});

//Get a user by ID
app.post(`${root}/users/:id/get`, (req, res) => 
{
    if(!req.params.id)
    {
        res.status(400).send('Error, request missing information');
    }

    const user = users.find(u => u.id == req.params.id);
    const token = tokenSessionPairs.find(p => p.token == req.body._token);
    const session = tokenSessionPairs.find(p => p.session == req.body._session);

    //check for valid user ID
    if(!user)
    {
        res.status(200).send({
                                status: 'fail',
                                reason:
                                {
                                    id: 'Not found'
                                }
                            });
    }

    //check for authentication
    else if(!token)
    {
        res.status(200).send({
                                status: 'fail',
                                reason:
                                {
                                    _token: 'Invalid'
                                }
                            });
    }

    //typo in the unit tests? I think this should say session is invalid
    else if(!session)
    {
        res.status(200).send({
                                status: 'fail',
                                reason:
                                {
                                    _token: 'Invalid'
                                }
                            });
    }

    else
    {
        if(user.avatar != defaultAvatar)
        {
            res.status(200).send({
                                    status: 'success',
                                    data:
                                    {
                                        id: user.id,
                                        username: user.username,
                                        avatar: user.avatar
                                    }
                                });
        }
        else
        {
            res.status(200).send({
                status: 'success',
                data:
                {
                    id: user.id,
                    username: user.username,
                }
            });
        }
    }
});

//Find a user by username
app.post(`${root}/users/find/:username`, (req, res) => 
{
    if(!req.params.username)
    {
        res.status(400).send('Error, request missing information');
    }

    const user = users.find(u => u.username == req.params.username);
    const token = tokenSessionPairs.find(p => p.token == req.body._token);
    const session = tokenSessionPairs.find(p => p.session == req.body._session);

    //check for valid user username
    if(!user)
    {
        res.status(200).send({
                                status: 'fail',
                                reason:
                                {
                                    username: 'Not found'
                                }
                            });
    }

    //check for authentication
    else if(!token)
    {
        res.status(200).send({
                                status: 'fail',
                                reason:
                                {
                                    _token: 'Invalid'
                                }
                            });
    }

    //typo in the unit tests? I think this should say session is invalid
    else if(!session)
    {
        res.status(200).send({
                                status: 'fail',
                                reason:
                                {
                                    _token: 'Invalid'
                                }
                            });
    }

    else
    {
        if(user.avatar != defaultAvatar)
        {
            res.status(200).send({
                                    status: 'success',
                                    data:
                                    {
                                        id: user.id,
                                        username: user.username,
                                        avatar: user.avatar
                                    }
                                });
        }
        else
        {
            res.status(200).send({
                status: 'success',
                data:
                {
                    id: user.id,
                    username: user.username,
                }
            });
        }
    }
});

app.post(`${root}/users/:id/update`, (req, res) =>
{
    if(!req.params.id)
    {
        res.status(400).send('Error, request missing information');
    }

    const user = users.find(u => u.id == req.params.id);
    const token = tokenSessionPairs.find(p => p.token == req.body._token);
    const session = tokenSessionPairs.find(p => p.session == req.body._session);

    //check for valid user username
    if(!user)
    {
        res.status(200).send({
                                status: 'fail',
                                reason:
                                {
                                    id: 'Not found'
                                }
                            });
        return;
    }

    //check for authentication
    else if(!token)
    {
        res.status(200).send({
                                status: 'fail',
                                reason:
                                {
                                    _token: 'Invalid'
                                }
                            });
        return;
    }

    //typo in the unit tests? I think this should say session is invalid
    else if(!session)
    {
        res.status(200).send({
                                status: 'fail',
                                reason:
                                {
                                    _token: 'Invalid'
                                }
                            });
        return;
    }

    //can only modify self
    for(i = 0; i <= tokenSessionPairs.length; i++)
    {
        if(i == tokenSessionPairs.length)
        {
            res.status(200).send({
                status: 'fail',
                reason:
                {
                    id: 'Forbidden'
                }
            });  
            return;
        }

        const temp = tokenSessionPairs[i];
        if(temp.id == req.params.id && temp.token == req.body._token)
        {
            break;
        }
    }

    //only changing the password
    if(req.body.newPassword && !req.body.avatar)
    {
        //need both an old and new password to change
        if(!req.body.oldPassword || req.body.oldPassword != user.password)
        {
            res.status(200).send({
                status: 'fail',
                reason:
                {
                    oldPassword: 'Forbidden'
                }
            });
        }
        else if(req.body.newPassword == req.body.oldPassword)
        {
            res.status(200).send({
                                    status: 'fail',
                                    reason:
                                    {
                                        oldPassword: 'Forbidden'
                                    }
                                });
        }
        else
        {
            user.password = req.body.newPassword;
            res.status(200).send({
                status: 'success',
                data:
                {
                    passwordChanged: true,
                }
            });
        }
    }

    //only changing avatar
    else if(!req.body.newPassword && req.body.avatar)
    {
        user.avatar = req.body.avatar;
        res.status(200).send({
            status: 'success',
            data:
            {
                passwordChanged: false,
                avatar: req.body.avatar
            }
        });
    }

    //changing both avatar and password
    else if(req.body.newPassword && req.body.avatar)
    {
        if(!req.body.oldPassword || req.body.oldPassword != user.password)
        {
            res.status(200).send({
                status: 'fail',
                reason:
                {
                    oldPassword: 'Forbidden'
                }
            });
        }
        else if(req.body.newPassword == req.body.oldPassword)
        {
            res.status(200).send({
                                    status: 'fail',
                                    reason:
                                    {
                                        oldPassword: 'Forbidden'
                                    }
                                });
        }
        else
        {
            user.password = req.body.newPassword;
        }

        user.avatar = req.body.avatar;
        res.status(200).send({
            status: 'success',
            data:
            {
                passwordChanged: true,
                avatar: req.body.avatar
            }
        });
    }
    else
    {
        res.status(200).send({
            status: 'success',
            data:
            {
                passwordChanged: false,
            }
        });
    }
});

//Connect to the game server
app.post('/api/v1/game/connect', (req, res) =>
{
    const token = tokenSessionPairs.find(p => p.token == req.body._token);
    const session = tokenSessionPairs.find(p => p.session == req.body._session);
    const user = users.find(u => u.id == token.id);

    //check for authentication
    if(!token)
    {
        res.status(200).send({
                                status: 'fail',
                                reason:
                                {
                                    _token: 'Invalid'
                                }
                            });
        return;
    }

    //typo in the unit tests? I think this should say session is invalid
    else if(!session)
    {
        res.status(200).send({
                                status: 'fail',
                                reason:
                                {
                                    _token: 'Invalid'
                                }
                            });
        return;
    }

    //check for valid user username
    else if(!user)
    {
        res.status(200).send({
                                status: 'fail',
                                reason:
                                {
                                    id: 'Not found'
                                }
                            });
        return;
    }

    //user found, return the server and their info
    res.status(200).send({
        status: 'success',
        data:
        {
            id: user.id,
            username: user.username,
            avatar: user.avatar,
            server: `${gameServerAddress}:${gameServerPort}`
        }
    });
});

const port = process.env.PORT || 3300;
app.listen(port, () => console.log(`Listening on port ${port}...`));
