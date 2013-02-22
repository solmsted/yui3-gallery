#!/usr/bin/env node

require('yui').YUI({
    modules: {
        'module-a': require('module-a'),
        'module-b': require('module-b')
    },
    groups: {
        'module-c': require('module-c')
    }
}).use('module-a', function (Y) {
    var moduleA = new Y.ModuleA().start();
});