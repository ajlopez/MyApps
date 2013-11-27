
var applications = require('../lib/applications');

var newapp;

exports["Create application"] = function (test) {
    test.async();
    
    applications.createApplication('First Application', { Description: 'My First Application', OwnerId: 1 }, process);
    
    function process(err, app) {
        test.equal(err, null);
        test.ok(app);
        newapp = app;
        test.ok(app.Id);
        test.equal(app.Name, 'First Application');
        test.equal(app.Description, 'My First Application');
        test.done();
    }
};

exports["Retrieve application"] = function (test) {
    test.async();
    
    applications.getApplication(newapp.Id, process);
    
    function process(err, app) {
        test.equal(err, null);
        test.ok(app);        test.equal(app.Id, newapp.Id);
        test.equal(app.Name, newapp.Name);
        test.equal(app.Description, newapp.Description);
        test.done();
    }
};

exports["Create second application"] = function (test) {
    test.async();
    
    applications.createApplication('Second Application', { Description: 'My Second Application' }, process);
    
    function process(err, app) {
        test.equal(err, null);
        test.ok(app);
        test.notEqual(app.Id, newapp.Id);
        test.equal(app.Name, 'Second Application');
        test.equal(app.Description, 'My Second Application');
        test.done();
    }
};

exports["Retrieve applications by owner id"] = function (test) {
    test.async();
    
    var ownerid = generateOwnerId();
    
    createApplications(3, ownerid, process);
    
    function process(err, app) {
        test.equal(err, null);
        applications.getApplicationsByOwnerId(ownerid, process2);
    }
    
    function process2(err, apps) {
        test.equal(err, null);
        test.ok(apps);
        test.ok(Array.isArray(apps));
        test.equal(apps.length, 3);
        
        for (var k = 0; k < 3; k++)
            test.equal(apps[0].OwnerId, ownerid);
        
        test.done();
    }
};

exports["Update and retrieve application"] = function (test) {
    test.async();
    
    applications.updateApplication(newapp.Id, 1, { Description: 'New Description' }, process);
    
    function process(err, app) {
        test.equal(err, null);
        test.ok(app);
        test.equal(app.Id, newapp.Id);
        test.equal(app.Name, newapp.Name);
        test.equal(app.Description, 'New Description');
        test.done();
        applications.getApplication(newapp.Id, process2);
    }
    
    function process2(err, app) {
        test.equal(err, null);
        test.ok(app);
        test.equal(app.Id, newapp.Id);
        test.equal(app.Name, newapp.Name);
        test.equal(app.Description, 'New Description');
        test.done();
    }
};

exports["Try update application of other owner"] = function (test) {
    test.async();
    
    applications.updateApplication(newapp.Id, 2, { Description: 'New Description' }, process);
    
    function process(err, app) {
        test.ok(err);
        test.done();
    }
};

exports["Load and retrieve applications"] = function (test) {
    test.async();
    
    applications.load(require('./applications.json'));
    
    applications.getApplicationsByOwnerId(1, process);
    
    function process(err, apps) {
        test.equal(err, null);
        test.ok(apps);
        test.ok(Array.isArray(apps));
        test.ok(apps.length > 0);
        test.done();    
    }
};

function generateOwnerId() {
    return Math.floor(Math.random() * 10000000);
}

function createApplications(napps, ownerid, next) {
    var k = 0;
    
    step();
    
    function step() {
        k++;
        
        if (k > napps) {
            next(null, null);
            return;
        }
        
        applications.createApplication('Application ' + k, { Description: 'My Application ' + k, OwnerId: ownerid },
            function (err, data) {
                if (err)
                    next(err, null);
                else
                    step();
            });
    }
}

