YUI.add('module-b', function (Y, moduleName) {
    var _Base = Y.Base,
        
        _uuid = require('node-uuid');
    
    Y.ModuleB = _Base.create(moduleName, _Base, [], {
        initializer: function () {
            this.once('start', function () {
                this._app.get('/:something', function (request, response) {
                    Y.use('module-c-' + request.param('something'), function () {
                        var something = Y.ModuleC.something;
                        
                        if (something) {
                            response.send(something(_uuid.v4()));
                        } else {
                            response.send(404);
                        }
                    });
                });
            }, this);
        }
    });
}, '0.0.1', {
    requires: [
        'base'
    ]
});