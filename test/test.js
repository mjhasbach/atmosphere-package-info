"use strict";

let uuid = require('uuid'),
    should = require('chai').should(),
    atmospherePackageInfo = require('../dist/atmospherePackageInfo');

let pkgs = [
    {
        name: 'stevezhu:lodash',
        repo: 'https://github.com/stevezhu/meteor-lodash.git'
    },
    {
        name: 'flemay:less-autoprefixer',
        repo: 'https://github.com/flemay/less-autoprefixer'
    },
    {
        name: 'suxez:jquery-serialize-object',
        repo: 'https://github.com/SuxezLLC/meteor-jquery-serialize-object'
    }
];

describe('atmosphere-package-info', function() {
    it('should throw an error if cb is not a function', function(done) {
        (function() {atmospherePackageInfo(pkgs[0].name);}).should.throw();
        done();
    });
    it('should call back an error if packages is not a string or array of strings', function(done) {
        atmospherePackageInfo(null, function(err) {
            should.exist(err);
            done();
        });
    });
    it('should get information about a Meteor Atmosphere package', function(done) {
        let pkg = pkgs[1];

        atmospherePackageInfo(pkg.name, function(err, packages) {
            should.not.exist(err);
            packages.should.be.an('object');
            packages[pkg.name].should.be.an('object');
            packages[pkg.name].latestVersion.git.should.equal(pkg.repo);
            done();
        });
    });
    it('should get information about multiple Meteor Atmosphere packages', function(done) {
        let repoPkg = pkgs[2],
            queryPkgs = [pkgs[0].name, repoPkg.name];

        atmospherePackageInfo(queryPkgs, function(err, packages) {
            should.not.exist(err);
            packages.should.be.an('object');
            packages.should.have.all.keys(queryPkgs);
            packages[repoPkg.name].latestVersion.git.should.equal(repoPkg.repo);
            done();
        });
    });
    it(
        'should call back a packages object which contains errors for invalid packages',
        function(done) {
            let repoPkg = pkgs[0],
                fakePkg = uuid.v4(),
                queryPkgs = [repoPkg.name, fakePkg];
            
            atmospherePackageInfo(queryPkgs, function(err, packages) {
                should.not.exist(err);
                packages.should.be.an('object');
                packages.should.have.all.keys(queryPkgs);
                packages[repoPkg.name].latestVersion.git.should.equal(repoPkg.repo);
                packages[fakePkg].should.be.an('error');
                done();
            });
        }
    );
});