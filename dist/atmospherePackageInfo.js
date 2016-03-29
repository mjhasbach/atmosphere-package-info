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
    var names = void 0;

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

        var invalidPkgs = [],
            reqPkgs = names.split(',');

        if (reqPkgs.length !== res.body.length) {
            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = reqPkgs[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var reqPkg = _step2.value;

                    var isValidPkg = void 0;

                    var _iteratorNormalCompletion3 = true;
                    var _didIteratorError3 = false;
                    var _iteratorError3 = undefined;

                    try {
                        for (var _iterator3 = res.body[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                            var resPkg = _step3.value;

                            if (resPkg.name === reqPkg) {
                                isValidPkg = true;
                                break;
                            }
                        }
                    } catch (err) {
                        _didIteratorError3 = true;
                        _iteratorError3 = err;
                    } finally {
                        try {
                            if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                _iterator3.return();
                            }
                        } finally {
                            if (_didIteratorError3) {
                                throw _iteratorError3;
                            }
                        }
                    }

                    if (!isValidPkg) {
                        invalidPkgs.push(reqPkg);
                    }
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }
        }

        if (invalidPkgs.length) {
            err = new Error('The following package' + (invalidPkgs.length > 1 ? 's were' : ' was') + (' not found on Meteor: ' + invalidPkgs.join(', ')));
        }

        cb(err, res.body);
    });
}
return atmospherePackageInfo;
}));
