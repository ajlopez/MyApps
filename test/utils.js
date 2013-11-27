
var utils = require('../lib/utils');

exports['Normalize word'] = function (test) {
    test.equal(utils.normalize('Customer'), 'customer');
    test.equal(utils.normalize('customer'), 'customer');
};

exports['Normalize phrase'] = function (test) {
    test.equal(utils.normalize('My Apps'), 'my_apps');
    test.equal(utils.normalize('my apps'), 'my_apps');
    test.equal(utils.normalize('my    apps'), 'my_apps');
    test.equal(utils.normalize('Property 1'), 'property_1');
};

exports['Pluralize word'] = function (test) {
    test.equal(utils.pluralize('Customer'), 'Customers');
    test.equal(utils.pluralize('City'), 'Cities');
};

exports['Helper is url'] = function (test) {
    test.equal(utils.helper.isUrl('Customer'), false);
    test.equal(utils.helper.isUrl(123), false);
    test.equal(utils.helper.isUrl('http://google.com'), true);
    test.equal(utils.helper.isUrl('https://github.com'), true);
};

exports['Helper is image'] = function (test) {
    test.equal(utils.helper.isImage('Customer'), false);
    test.equal(utils.helper.isImage(123), false);
    
    test.equal(utils.helper.isImage('http://google.com/logo'), false);
    
    test.equal(utils.helper.isImage('http://google.com/logo.png'), true);
    test.equal(utils.helper.isImage('http://google.com/logo.jpg'), true);
    test.equal(utils.helper.isImage('http://google.com/logo.jpeg'), true);
    test.equal(utils.helper.isImage('http://google.com/logo.gif'), true);
    test.equal(utils.helper.isImage('http://google.com/logo.bmp'), true);
    
    test.equal(utils.helper.isImage('http://google.com/logo.png?a'), true);
    test.equal(utils.helper.isImage('http://google.com/logo.jpg?a'), true);
    test.equal(utils.helper.isImage('http://google.com/logo.jpeg?a'), true);
    test.equal(utils.helper.isImage('http://google.com/logo.gif?a'), true);
    test.equal(utils.helper.isImage('http://google.com/logo.bmp?a'), true);
};

