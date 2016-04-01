/**
 * Get information associated with one or more Meteor Atmosphere packages
 * @module atmospherePackageInfo
 * @author Matthew Hasbach
 * @copyright Matthew Hasbach 2016
 * @license MIT
 * @param {string|Array<string>} packages - One or more Meteor Atmosphere package names
 * @param {atmospherePackageInfoCallback} cb - A callback to be executed after package information is collected
 * @example
 atmospherePackageInfo(['stevezhu:lodash', 'mjhasbach:some-invalid-pkg'], function(err, packages) {
    if (err) { return console.error(err); }

    packages.forEach(function(pkg) {
        if (pkg instanceof Error) {
            //Package not found on Atmosphere
            console.error(pkg);
        }
        else {
            console.log(pkg.latestVersion.git);
        }
    });
});
 */
function atmospherePackageInfo(packages, cb) {
    /**
     * The atmospherePackageInfo callback
     * @callback atmospherePackageInfoCallback
     * @param {Object|null} err - An Error object if an error occurred
     * @param {Object<Object>} packages - Information about one or more Meteor Atmosphere packages. packages['packageName'] will be an Error object if that package was not found on Atmosphere.
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

            let packages = {},
                reqPkgs = names.split(',');

            for (let reqPkg of reqPkgs) {
                for (let resPkg of res.body) {
                    if (resPkg.name === reqPkg) {
                        delete resPkg.name;
                        packages[reqPkg] = resPkg;
                        break;
                    }
                }

                if (!packages[reqPkg]) {
                    packages[reqPkg] = new Error('Package not found on Atmosphere');
                }
            }

            cb(null, packages);
        });
}