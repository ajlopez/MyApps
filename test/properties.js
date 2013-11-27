
var applications = require('../lib/applications');

var app;

exports['Create property'] = function (test) {
    test.async();
    
    createEntity(process);
    
    var newent;
    
    function process(err, ent) {
        test.equal(err, null);
        test.ok(ent);
        newent = ent;
        
        applications.createProperty(app, ent.Id, 'My Property', { Description: 'My First Property' }, process2);
    }
    
    function process2(err, prop) {
        test.equal(err, null);
        test.ok(prop);
        test.ok(prop.Id);
        test.equal(prop.EntityId, newent.Id);
        test.equal(prop.Name, 'My Property');
        test.equal(prop.Description, 'My First Property');
        test.done();
    }
}

exports['Create and retrieve properties'] = function (test) {
    test.async();
    
    createEntity(process);
    
    var newent;
    
    function process(err, ent) {
        test.equal(err, null);
        test.ok(ent);
        newent = ent;
        
        createProperties(app, ent, 4, process2);
    }
    
    function process2(err, prop) {
        test.equal(err, null);
        
        var props = newent.Properties;
        test.ok(props);
        test.ok(Array.isArray(props));
        test.equal(props.length, 4);
        
        for (var k = 0; k < props.length; k++) {
            var property = props[k];
            test.ok(property.Id);
            test.equal(property.EntityId, newent.Id);
            test.equal(property.Name, 'Property ' + (k + 1));
            test.equal(property.Description, 'My Property ' + (k + 1));
        }
        
        test.done();
    }
}

function createEntity(next) {
    createApplication(function (err, newapp) {
        app = newapp;
        var n = Math.floor(Math.random() * 10000000);
        applications.createEntity(newapp, 'Entity ' + n, { Description: 'My Entity ' + n }, next);
    });
}

function createApplication(next) {
    var n = Math.floor(Math.random() * 10000000);
    
    applications.createApplication('Application ' + n, { Description: 'My Application ' + n }, next);
}

function createProperties(app, ent, nprops, next) {
    var k = 0;
    
    step();
    
    function step() {
        k++;
        
        if (k > nprops) {
            next(null, null);
            return;
        }
        
        applications.createProperty(app, ent.Id, 'Property ' + k, { Description: 'My Property ' + k }, step);
    }
}

