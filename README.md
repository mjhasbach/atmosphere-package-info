<a name="module_atmospherePackageInfo"></a>

## atmospherePackageInfo
Get information associated with one or more Meteor Atmosphere packages

**Author:** Matthew Hasbach  
**License**: MIT  
**Copyright**: Matthew Hasbach 2016  

| Param | Type | Description |
| --- | --- | --- |
| packages | <code>string</code> &#124; <code>Array.&lt;string&gt;</code> | One or more Meteor Atmosphere package names |
| cb | <code>atmospherePackageInfoCallback</code> | A callback to be executed after package information is collected |

**Example**  
```js
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
```
<a name="module_atmospherePackageInfo..atmospherePackageInfoCallback"></a>

### atmospherePackageInfo~atmospherePackageInfoCallback : <code>function</code>
The atmospherePackageInfo callback

**Kind**: inner typedef of <code>[atmospherePackageInfo](#module_atmospherePackageInfo)</code>  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Object</code> &#124; <code>null</code> | An Error object if an error occurred |
| packages | <code>Object.&lt;Object&gt;</code> | Information about one or more Meteor Atmosphere packages. packages['packageName'] will be an Error object if that package was not found on Atmosphere. |

