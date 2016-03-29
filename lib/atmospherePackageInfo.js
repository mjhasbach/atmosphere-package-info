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
    let names;

    if (typeof cb !== 'function') {
        throw new TypeError('cb must be a function');
    }

    if (Object.prototype.toString.call(packages) === '[object Array]') {
        for (let pkg of packages) {
            if (typeof pkg !== 'string') {
                cb(new TypeError('package must be a string'), []);
                return;
            }
        }

        names = packages.join(',');
    }
    else if (typeof packages !== 'string') {
        cb(new TypeError('packages must be a string package name or an array of string package names'), []);
        return;
    }
    else {
        names = packages;
    }

    http.get('https://atmospherejs.com/a/packages/findByNames')
        .accept('application/json')
        .query({names: names})
        .end(function(err, res) {
            if (err) {
                cb(err, []);
                return;
            }

            let invalidPkgs = [],
                reqPkgs = names.split(',');

            if (reqPkgs.length !== res.body.length) {
                for (let reqPkg of reqPkgs) {
                    let isValidPkg;

                    for (let resPkg of res.body) {
                        if (resPkg.name === reqPkg) {
                            isValidPkg = true;
                            break;
                        }
                    }

                    if (!isValidPkg) {
                        invalidPkgs.push(reqPkg);
                    }
                }
            }

            if (invalidPkgs.length) {
                err = new Error(`The following package${invalidPkgs.length > 1 ? 's were' : ' was'}` +
                ` not found on Meteor: ${invalidPkgs.join(', ')}`);
            }

            cb(err, res.body);
        });
}