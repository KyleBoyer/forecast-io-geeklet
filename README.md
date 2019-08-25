# forecast-io-geeklet

Inside the `c` folder is a class that you will need to run `clang CoreLocationTest.m -framework cocoa -framework CoreLocation` to compile. This then generates a file named `a.out` which can be run. When run, it outputs to stdOut HTML for an iframe with your current location embeded in a url referring to the other project. Within the `server` folder is a nodejs express server, and a Dockerfile for convenience which will serve you the custom embedded forecast.io widget.

Finally, once all those are working in harmony, you can setup a `Web Page` Geeklet, and define the content as a script:

```
#!/bin/bash
echo `~/a.out`
```
