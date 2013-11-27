
function normalize(text) {
    var result = '';
    var lastch;
    
    for (n in text) {
        var ch = text[n].toLowerCase();
        
        if (ch <= ' ')
            ch = '_';
            
        if (lastch === '_' && ch === '_')
            continue;

        result += ch;
        lastch = ch;
    }
    
    return result;
}

function pluralize(text) {
    var l = text.length;
    
    if (text[l-1] === 'y') {
        text = text.substring(0, l-1);
        text += 'ies';
        return text;
    }
    
    return text + 's';
}

function toInteger(value) {
    if (typeof value === 'string')
        return parseInt(value);
        
    return value;
}

function toBoolean(value) {
    return value && value != 'false';
}

function error(res, error) {
    res.render('error', { title: 'Error', error: error });
}

function clone(obj) {
    var newobj = { };
    
    for (var n in obj)
        newobj[n] = obj[n];
        
    return newobj;
}

function isUrl(text) {
    if (!text)
        return false;
        
    if (typeof text !== 'string')
        return false;
        
    if (text.length <= 7)
        return false;
        
    if (text.substring(0,7) === 'http://')
        return true;
        
    if (text.substring(0,8) === 'https://')
        return true;
        
    return false;
}

function isImage(text) {
    if (!isUrl(text))
        return false;
        
    if (contains(text, ".gif?"))
        return true;
        
    if (contains(text, ".jpg?"))
        return true;
        
    if (contains(text, ".jpeg?"))
        return true;
        
    if (contains(text, ".bmp?"))
        return true;
        
    if (contains(text, ".png?"))
        return true;
        
    if (endsWith(text, ".png"))
        return true;
        
    if (endsWith(text, ".gif"))
        return true;
        
    if (endsWith(text, ".jpg"))
        return true;
        
    if (endsWith(text, ".jpeg"))
        return true;
        
    if (endsWith(text, ".bmp"))
        return true;
        
    return false;
}

function contains(text, subtext) {
    return text.indexOf(subtext) >= 0;
}

function endsWith(text, subtext) {
    var l = text.length;
    var l2 = subtext.length;
    
    if (l < l2)
        return false;
        
    if (text.substring(l - l2) === subtext)
        return true;
        
    return false;
}

var helper = {
    isUrl: isUrl,
    isImage: isImage
}

module.exports = {
    normalize: normalize,
    pluralize: pluralize,
    toInteger: toInteger,
    toBoolean: toBoolean,
    clone: clone,
    helper: helper,
    error: error
}