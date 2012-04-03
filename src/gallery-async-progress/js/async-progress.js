/**
 * @module gallery-async-progress
 */
(function (Y, moduleName) {
    'use strict';
    
    var _Plugin = Y.Plugin,
        
        _invoke = Y.Array.invoke;

    /**
     * Asynchronous command runner progress plugin.
     * @class Y.Plugin.AsyncProgress
     * @extends Y.Plugin.Base
     * @param {Object} config Configuration Object.
     */
    _Plugin.AsyncProgress = Y.Base.create(moduleName, _Plugin.Base, [], {
        destructor: function () {
            _invoke(this._subscriptions, 'detach');
        },
        initializer: function () {
            var completed = 0,
                host = this.get('host'),
                run = host.get('run'),
                total = run.length;
                
            this._subscriptions = _invoke(run, 'on', 'complete', function () {
                completed += 1;
                
                /**
                 * @event progress
                 * @for Y.Async
                 * @param {Number} completed
                 * @param {Number} total
                 */
                host.fire('progress', {
                    completed: completed,
                    total: total
                });
            });
        }
    }, {
        NS: 'progress'
    });
}(Y, arguments[1]));