YUI.add('module-a', function (Y, moduleName) {
    var _Base = Y.Base,
        
        _express = require('express');
    
    Y.ModuleA = _Base.create(moduleName, _Base, [
        Y.ModuleB
    ], {
        destructor: function () {
            this._app.close();
            delete this._app;
        },
        initializer: function () {
            var app = _express();
            this._app = app;
            
            this.publish('start', {
                fireOnce: true,
                defaultFn: function () {
                    app.listen(this.get('port'));
                }
            });
        },
        start: function () {
            this.fire('start');
            return this;
        }
    }, {
        ATTRS: {
            port: {
                value: 8080
            }
        }
    });
}, '0.0.1', {
    requires: [
        'base',
        'module-b'
    ]
});