
var users = require('../lib/users');

exports['Add user'] = function (test) {
    var user = users.addUser('user1', 'pass1');
    
    test.ok(user);
    test.ok(user.Id);
    test.equal(user.Name, 'user1');
    test.equal(user.Password, 'pass1');
};

exports['Retrieve user'] = function (test) {
    var user = users.retrieveUser('user1', 'pass1');
    
    test.ok(user);
    test.ok(user.Id);
    test.equal(user.Name, 'user1');
    test.equal(user.Password, 'pass1');
};

exports['Get user by name'] = function (test) {
    test.ok(users.userExists('user1'));
    test.equal(users.userExists('user2'), false);
};

exports['Retrieve unknown user'] = function (test) {
    var user = users.retrieveUser('user2', 'pass2');
    
    test.equal(user, null);
};

