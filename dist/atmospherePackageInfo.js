;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['superagent'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('superagent'));
  } else {
    root.atmospherePackageInfo = factory(root.superagent);
  }
}(this, function(http) {
'use strict';

/**
 * Get information associated with one or more Meteor Atmosphere packages
 * @module atmospherePackageInfo
 * @author Matthew Hasbach
 * @copyright Matthew Hasbach 2016
 * @license MIT
 * @param {string|Array<string>} packages - One or more Meteor Atmosphere package names
 * @param {atmospherePackageInfoCallback} cb - A callback to be executed after package information is collected
 * @example
 atmospherePackageInfo(['stevezhu:lodash', 'suxez:jquery-serialize-object'], function(err, packages) {
    if (err) { return console.error(err); }
    console.log(packages[0].latestVersion.git);
});
 */
function atmospherePackageInfo(packages, cb) {
    /**
     * The atmospherePackageInfo callback
     * @callback atmospherePackageInfoCallback
     * @param {Object|null} err - An error object if an error occurred
     * @param {Array<Object>} packages - Information about one or more Meteor Atmosphere packages
     */
    var names = undefined;

    if (typeof cb !== 'function') {
        throw new TypeError('cb must be a function');
    }

    if (Object.prototype.toString.call(packages) === '[object Array]') {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
            for (var _iterator = packages[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                var pkg = _step.value;

                if (typeof pkg !== 'string') {
                    cb(new TypeError('package must be a string'), []);
                    return;
                }
            }
        } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
        } finally {
            try {
                if (!_iteratorNormalCompletion && _iterator.return) {
                    _iterator.return();
                }
            } finally {
                if (_didIteratorError) {
                    throw _iteratorError;
                }
            }
        }

        names = packages.join(',');
    } else if (typeof packages !== 'string') {
        cb(new TypeError('packages must be a string package name or an array of string package names'), []);
        return;
    } else {
        names = packages;
    }

    http.get('https://atmospherejs.com/a/packages/findByNames').accept('application/json').query({ names: names }).end(function (err, res) {
        if (err) {
            cb(err, []);
            return;
        }

        cb(null, res.body);
    });
}
return atmospherePackageInfo;
}));
