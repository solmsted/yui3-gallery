YUI.add('module-c-somethingWonderful', function (Y, moduleName) {
    Y.namespace('ModuleC').somethingWonderful = function (uuid) {
        // do something wonderful
        return uuid;
    };
}, '0.0.1', {
    requires: [
        'yui-base'
    ]
});