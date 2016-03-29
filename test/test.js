var uuid = require('uuid'),
    should = require('chai').should(),
    atmospherePackageInfo = require('../dist/atmospherePackageInfo');

describe('atmosphere-package-info', function() {
    it('should throw an error if cb is not a function', function(done) {
        (function() {atmospherePackageInfo('stevezhu:lodash');}).should.throw();
        done();
    });
    it('should call back an error if packages is not a string or array of strings', function(done) {
        atmospherePackageInfo(null, function(err) {
            should.exist(err);
            done();
        });
    });
    it('should get information about a Meteor Atmosphere package', function(done) {
        atmospherePackageInfo('flemay:less-autoprefixer', function(err, packages) {
            should.not.exist(err);
            packages.should.be.an('array');
            packages.should.have.length(1);
            packages[0].latestVersion.git.should.equal('https://github.com/flemay/less-autoprefixer');
            done();
        });
    });
    it('should get information about multiple Meteor Atmosphere packages', function(done) {
        atmospherePackageInfo(['stevezhu:lodash', 'suxez:jquery-serialize-object'], function(err, packages) {
            should.not.exist(err);
            packages.should.be.an('array');
            packages.should.have.length(2);
            packages[1].latestVersion.git.should.equal('https://github.com/SuxezLLC/meteor-jquery-serialize-object');
            done();
        });
    });
    it(
        'should call back an error if invalid packages are supplied, but also call back info about valid packages',
        function(done) {
            atmospherePackageInfo(['stevezhu:lodash', uuid.v4()], function(err, packages) {
                should.exist(err);
                packages.should.be.an('array');
                packages.should.have.length(1);
                packages[0].latestVersion.git.should.equal('https://github.com/stevezhu/meteor-lodash.git');
                done();
            });
        }
    );
});