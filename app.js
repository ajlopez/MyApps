
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes/index')
  , routesinstances = require('./routes/instances')
  , adminapps = require('./routes/admin/applications')
  , adminents = require('./routes/admin/entities')
  , adminprops = require('./routes/admin/properties')
  , engine = require('ejs-locals')
  , http = require('http')
  , path = require('path')
  , fs = require('fs')
  , applications = require('./lib/applications')
  , instances = require('./lib/instances')
  , users = require('./lib/users')
  , stores = require('./lib/stores');
  
if (fs.existsSync(path.join(__dirname, 'applications.json'))) {
    var myapps = require('./applications.json');
    applications.load(myapps);
    
    if (fs.existsSync(path.join(__dirname, 'customers.json'))) {
        var mycustomers = require('./customers.json');
        var store = stores.getStore(instances.getStoreName(myapps['1'], myapps['1'].Entities[0]));
        store.load(mycustomers);
    }
}
 
var app = express();

app.engine('ejs', engine);

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(express.cookieParser('mary had a little lamb'));
app.use(express.session());
app.use(function (req, res, next) {
    res.locals.req = req;
    res.locals.res = res;
    next();
});

app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/login', routes.login);
app.get('/logout', routes.logout);
app.post('/login', routes.dologin);
app.post('/register', routes.register);
app.get('/application/:id', users.ensureLogin, routes.application);
app.get('/application/:id/entity/:eid', users.ensureLogin, routes.entity);
app.get('/application/:id/entity/:eid/new', users.ensureLogin, routesinstances.create);
app.post('/application/:id/entity/:eid/new', users.ensureLogin, routesinstances.insert);
app.get('/application/:id/entity/:eid/instance/:iid', users.ensureLogin, routesinstances.view);
app.get('/application/:id/entity/:eid/instance/:iid/edit', users.ensureLogin, routesinstances.edit);
app.post('/application/:id/entity/:eid/instance/:iid/edit', users.ensureLogin, routesinstances.update);
app.get('/application/:id/entity/:eid/instance/:iid/remove', users.ensureLogin, routesinstances.remove);

app.get('/admin/application', users.ensureLogin, adminapps.index);
app.get('/admin/application/new', users.ensureLogin, adminapps.create);
app.post('/admin/application/new', users.ensureLogin, adminapps.insert);
app.get('/admin/application/:id', users.ensureLogin, adminapps.view);
app.get('/admin/application/:id/edit', users.ensureLogin, adminapps.edit);
app.post('/admin/application/:id/edit', users.ensureLogin, adminapps.update);

app.get('/admin/application/:id/entity/new', users.ensureLogin, adminents.create);
app.post('/admin/application/:id/entity/new', users.ensureLogin, adminents.insert);
app.get('/admin/application/:id/entity/:eid', users.ensureLogin, adminents.view);
app.get('/admin/application/:id/entity/:eid/edit', users.ensureLogin, adminents.edit);
app.post('/admin/application/:id/entity/:eid/edit', users.ensureLogin, adminents.update);

app.get('/admin/application/:id/entity/:eid/property/new', users.ensureLogin, adminprops.create);
app.post('/admin/application/:id/entity/:eid/property/new', users.ensureLogin, adminprops.insert);
app.get('/admin/application/:id/entity/:eid/property/:pid/edit', users.ensureLogin, adminprops.edit);
app.post('/admin/application/:id/entity/:eid/property/:pid/edit', users.ensureLogin, adminprops.update);
app.get('/admin/application/:id/entity/:eid/property/:pid/remove', users.ensureLogin, adminprops.remove);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
