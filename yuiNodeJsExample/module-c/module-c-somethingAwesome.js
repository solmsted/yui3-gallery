YUI.add('module-c-somethingAwesome', function (Y, moduleName) {
    Y.namespace('ModuleC').somethingAwesome = function (uuid) {
        // do something awesome
        return uuid;
    };
}, '0.0.1', {
    requires: [
        'yui-base'
    ]
});