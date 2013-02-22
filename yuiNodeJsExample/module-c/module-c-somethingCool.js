YUI.add('module-c-somethingCool', function (Y, moduleName) {
    Y.namespace('ModuleC').somethingCool = function (uuid) {
        // do something cool
        return uuid;
    };
}, '0.0.1', {
    requires: [
        'yui-base'
    ]
});