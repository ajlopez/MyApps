
var utils = require('./utils');

var applications = { };

function Property(ent, name, data) {
    this.Id = getPropertyMaxId(ent) + 1;
    this.Name = name;
    this.EntityId = ent.Id;
    copyProperties(data, this);
}

function Entity(app, name, data) {
    this.Id = getEntityMaxId(app) + 1;
    this.Name = name;
    this.ApplicationId = app.Id;
    copyProperties(data, this);
    this.Properties = [];
    
    if (this.Name && !this.PluralName)
        this.PluralName = utils.pluralize(this.Name);
}

function createProperty(app, entid, name, options, next) {
    var ent = getEntity(app, entid);
    
    if (!ent) {
        next('Entity not found', null);
        return;
    }
    
    var prop = new Property(ent, name, options);
    ent.Properties.push(prop);
    next(null, prop);
}

function updateProperty(app, entid, propid, data, next) {
    getProperty(app, entid, propid, process);
    
    function process(err, prop) {
        if (err) {
            next(err, null);
            return;
        }
        
        if (!prop) {
            next('Property not found', null);
            return;
        }
        
        copyProperties(data, prop);
        
        next(null, prop);
    }
}

function getProperty(app, entid, propid, next) {
    var ent = getEntity(app, entid);
    
    if (!ent) {
        next('Entity not found', null);
        return;
    }
    
    for (var n in ent.Properties) {
        var prop = ent.Properties[n];
        
        if (prop.Id === propid) {
            next(null, prop);
            return;
        }
    }
    
    next(null, null);
}

function removeProperty(app, entid, propid, next) {
    var ent = getEntity(app, entid);
    
    if (!ent) {
        next('Entity not found', null);
        return;
    }
    
    for (var n in ent.Properties) {
        var prop = ent.Properties[n];
        
        if (prop.Id === propid) {
            n = parseInt(n);
            var left = ent.Properties.slice(0, n);
            var right = ent.Properties.slice(n + 1);
            ent.Properties = left.concat(right);
            next(null, null);
            return;
        }
    }
    
    next(null, null);
}

function getPropertyMaxId(ent) {
    var maxid = 0;
    
    ent.Properties.forEach(function (property) {
        if (property.Id > maxid)
            maxid = property.Id;
    });
    
    return maxid;
}

function getApplicationMaxId() {
    var maxid = 0;
    
    for (n in applications) {
        var application = applications[n];
        if (application.Id > maxid)
            maxid = application.Id;
    };
    
    return maxid;
}

function Application(name, options) {
    this.Id = getApplicationMaxId() + 1;
    this.Name = name;
    copyProperties(options, this);
    this.Entities = [];
}

function getEntityMaxId(app) {
    var maxid = 0;
    
    app.Entities.forEach(function (entity) {
        if (entity.Id > maxid)
            maxid = entity.Id;
    });
    
    return maxid;
}

function createEntity(app, name, data, next) {
    var ent = new Entity(app, name, data);
    app.Entities.push(ent);
    next(null, ent);
}

function updateEntity(app, entid, data, next) {
    var ent = getEntity(app, entid);
    
    if (!ent) {
        next('Entity not found', null);
        return;
    }
    
    copyProperties(data, ent);
        
    next(null, ent);
}

function getEntity(app, entid) {
    for (var n in app.Entities) {
        var entity = app.Entities[n];
        
        if (entity.Id === entid)
            return entity;
    }
    
    return null;
}

function createApplication(name, data, next) {
    var application = new Application(name, data);
    
    applications[application.Id] = application;
    
    next(null, application);
}

function updateApplication(id, userid, data, next) {
    getApplication(id, process);
    
    function process(err, app) {
        if (err) {
            next(err, null);
            return;
        }
        
        if (!app || app.OwnerId !== userid) {
            next('Application not found', null);
            return;
        }
        
        copyProperties(data, app);
        
        next(null, app);
    }
}

function getApplication(id, next) {
    if (applications[id])
        next(null, applications[id]);
    else
        next(null, null);
}

function getApplicationsByOwnerId(ownerid, next) {
    var result = [];
    
    for (var n in applications) {
        var app = applications[n];
        
        if (app.OwnerId === ownerid)
            result.push(app);
    }
    
    next(null, result);
}

function copyProperties(from, to) {
    Object.keys(from).forEach(function (key) {
        if (key[0] < 'A' || key[0] > 'Z')
            return;
            
        to[key] = from[key];
    });
}

function load(apps) {
    applications = apps;
}

module.exports = {
    createApplication: createApplication,
    getApplication: getApplication,
    getApplicationsByOwnerId: getApplicationsByOwnerId,
    updateApplication: updateApplication,
    
    createEntity: createEntity,
    getEntity: getEntity,
    updateEntity: updateEntity,
    
    createProperty: createProperty,
    getProperty: getProperty,
    updateProperty: updateProperty,
    removeProperty: removeProperty,
    
    load: load
};

