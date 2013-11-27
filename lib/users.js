
var users = { };
var maxid = 0;

function addUser(name, pwd) {
    var user = {
        Id: ++maxid,
        Name: name,
        Password: pwd
    }
    
    users[user.Id] = user;
    
    return user;
}

function retrieveUser(name, pwd) {
    for (var n in users) {
        var user = users[n];
        
        if (user.Name === name && user.Password == pwd)
            return user;
    }
    
    return null;
}

function userExists(name, pwd) {
    for (var n in users) {
        var user = users[n];
        
        if (user.Name === name)
            return true;
    }
    
    return false;
}

function getCurrentUserId(req) {
    if (req && req.session && req.session.userId)
        return req.session.userId;
    return null;
}

function ensureLogin(req, res, next) {
    console.log('ensure');
    if (!getCurrentUserId(req)) {
        console.log('redirect');
        res.redirect('/login');
    }
    else {
        console.log('next');
        next();
    }
}

module.exports = {
    getCurrentUserId: getCurrentUserId,
    addUser: addUser,
    retrieveUser: retrieveUser,
    userExists: userExists,
    ensureLogin: ensureLogin
}