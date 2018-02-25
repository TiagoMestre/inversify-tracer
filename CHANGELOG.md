
1.1.0 / 25-02-2018
===================

* Upgrade tooling and project structure
* Remove unnecessary code
* Add full code coverage
* Simplify "simple" example
* Add dependencies and devDependencies badges

### Breaking changes

* Remove function parameter transformation to string (<Function>)
* Remove CallInfo properties: arguments and parameters.
* Add CallInfo property parameters (Parameter[]) example: [{ name: "paramValue", value: 32 }]
* InvalidFilterError and InvalidTracerEventError have the "name" property with the same name as the class name instead of "Error"
* Change to InvalidFilterError and InvalidTracerEventError error message

1.0.7 / 10-11-2016
===================

* Add inversify 3.0.0 support
* Change the log of a function argument to '<Function>'
* Add definition documentation

1.0.6 / 10-11-2016
===================

* Fix multiple proxies to constant objects
* Fix inversify dictionary iteration
* Add more tests
