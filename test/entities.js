
var applications = require('../lib/applications.js');

var app;

exports['Create entity'] = function (test) {
    test.async();
    
    createApplication(process);
    
    function process(err, newapp) {
        test.equal(err, null);
        test.ok(newapp);
        app = newapp;
        
        applications.createEntity(newapp, 'My Entity', { Description: 'My First Entity' }, process2);       
    }
    
    function process2(err, ent) {
        test.equal(err, null);
        test.ok(ent);
        test.ok(ent.Id);
        test.equal(ent.ApplicationId, app.Id);
        test.equal(ent.Name, 'My Entity');
        test.equal(ent.Description, 'My First Entity');
        test.equal(ent.PluralName, 'My Entities');
        test.done();
    }
}

exports['Update entity'] = function (test) {
    test.async();
    
    applications.updateEntity(app, app.Entities[0].Id, { NewDescription: 'New Description' }, process);
    
    function process(err, ent) {
        test.equal(err, null);
        test.ok(ent);
        test.equal(ent.Description, 'My First Entity');
        test.equal(ent.Name, 'My Entity');
        test.equal(ent.NewDescription, 'New Description');
        test.done();
    }
}

exports['Create and retrieve entity'] = function (test) {
    test.async();
    
    createApplication(process);
    
    var newapp;
    
    function process(err, app) {
        test.equal(err, null);
        test.ok(app);
        newapp = app;
        
        applications.createEntity(app, 'My Entity', { Description: 'My First Entity' }, process2);       
    }
    
    var newent;
    
    function process2(err, ent) {
        test.equal(err, null);
        test.ok(ent);
        test.ok(ent.Id);
        newent = ent;
        var ent = applications.getEntity(newapp, ent.Id);
        test.equal(err, null);
        test.ok(ent);
        test.equal(ent.Id, newent.Id);
        test.equal(ent.ApplicationId, newapp.Id);
        test.equal(ent.Name, newent.Name);
        test.equal(ent.Description, newent.Description);
        test.done();
    }
}

exports['Create and retrieve entities'] = function (test) {
    test.async();
    
    createApplication(process);
    
    var newapp;
    
    function process(err, app) {
        test.equal(err, null);
        test.ok(app);
        newapp = app;
        createEntities(app, 4, process2);
    }
    
    function process2(err, ent) {
        test.equal(err, null);
        var ents = newapp.Entities;
        test.ok(ents);
        test.ok(Array.isArray(ents));
        test.equal(ents.length, 4);
        
        for (var k = 0; k < ents.length; k++) {
            var ent = ents[k];
            test.ok(ent.Id);
            test.equal(ent.ApplicationId, newapp.Id);
            test.equal(ent.Name, 'Entity ' + (k+1));
            test.equal(ent.Description, 'My Entity ' + (k+1));
        }

        test.done();
    }
}

function createApplication(next) {
    var n = Math.floor(Math.random() * 10000000);
    
    applications.createApplication('Application ' + n, { Description: 'My Application ' + n }, next);
}

function createEntities(app, nents, next) {
    var k = 0;
    
    step();
    
    function step() {
        k++;
        
        if (k > nents) {
            next(null, null);
            return;
        }
        
        applications.createEntity(app, 'Entity ' + k, { Description: 'My Entity ' + k },
            function (err, data) {
                if (err)
                    next(err, null);
                else
                    step();
            });
    }
}
