module.exports = {
    fullpath: require('path').join(__dirname, 'module-a.js'),
    requires: [
        'base',
        'module-b'
    ],
    type: 'js'
};