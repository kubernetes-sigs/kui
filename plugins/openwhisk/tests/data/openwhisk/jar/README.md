The jar file is included in the repo to facilitate the tests, so that
we don't depend on gradle or some such in the test rig. If you need to
rebuild the jar, do the following:


```sh
curl -O https://repo1.maven.org/maven2/com/google/code/gson/gson/2.6.2/gson-2.6.2.jar
javac -target 8 -source 8 echo.java -cp gson-2.6.2.jar
jar cf echo.jar echo.class
```

Note that, as of this writing (20180521), the source and target
versions are important; the currently OpenWhisk does not support any
more recent bytecode target than 8.
