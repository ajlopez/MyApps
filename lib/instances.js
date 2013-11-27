
var utils = require('./utils'),
    stores = require('./stores');

function makeInstance(props, data) {
    var inst = { };
    
    copyProperties(data, inst);
    reviewProperties(props, inst);
    return inst;
}

function createInstance(app, ent, data, next) {
    var store = stores.getStore(getStoreName(app, ent));
    var instance = makeInstance(ent.Properties, data);
    store.add(instance, next);
}

function updateInstance(app, ent, instid, data, next) {
    var store = stores.getStore(getStoreName(app, ent));
    
    store.getById(instid, process);
    
    function process(err, inst) {
        if (err) {
            next(err, null);
            return;
        }
        
        copyProperties(data, inst);
        store.save(inst, next);
    }
}

function getInstances(app, ent, next) {
    var store = stores.getStore(getStoreName(app, ent));
    store.find(next);
}

function getInstance(app, ent, id, next) {
    var store = stores.getStore(getStoreName(app, ent));
    store.getById(id, next);
}

function removeInstance(app, ent, id, next) {
    var store = stores.getStore(getStoreName(app, ent));
    store.remove(id, next);
}

function getStoreName(app, ent) {
    var plural = ent.PluralName;
    
    if (!plural)
        plural = utils.pluralize(ent.Name);
        
    var name = utils.normalize(app.Name) + '__' + app.Id + '__' + utils.normalize(plural);
    
    return name;
}

function copyProperties(from, to) {
    Object.keys(from).forEach(function (key) {
        to[utils.normalize(key)] = from[key];
    });
}

function reviewProperties(props, inst) {
    props.forEach(function (prop) {
        if (!prop.Type)
            return;
        
        if (prop.Type === 'Number') {
            var name = utils.normalize(prop.Name);
            
            if (!inst.hasOwnProperty(name))
                return;
            
            if (typeof inst[name] === 'string')
                inst[name] = parseInt(inst[name]);
        }
    });
}

module.exports = {
    makeInstance: makeInstance,
    getStoreName: getStoreName,
    
    createInstance: createInstance,
    getInstances: getInstances,
    getInstance: getInstance,
    updateInstance: updateInstance,
    removeInstance: removeInstance
};

