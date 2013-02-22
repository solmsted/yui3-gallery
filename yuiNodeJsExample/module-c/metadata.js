module.exports = {
    base: __dirname + require('path').sep,
    patterns: {
        'module-c-': {
            configFn: function (module) {
                module.path = module.name + '.js';
                module.type = 'js';
            }
        }
    }
};