# main function

eyvery app should have a main function.

e.g.

```go
function main() {

  print("hello world");
}
```

# types

//
type | summary| example
--- | --- | ---
`string` | A sequence of Unicode code points. | `"hello world"`
`number` | Any number int or float | `123` or `1.23`
`boolean` | `true` or `false`. | `true`
`array` | A sequence of values of the same type. | `[1, 2, 3]`
`map` | A collection of key-value pairs. | `{ "a": 1, "b": 2 }`
`timestamp` | A date and time. | `"2018-01-01T00:00:00.000Z"`

```sh

// strings

var name = "hayder";

// numbers

var age = 24

// booleans

var isAvalible = true;


```

## array/list types

a list is a collection of values of the same type.

```typescript
var mylist = [1, 2, 3, 4, 5];

var names = ["hayder", "Jay", "any"];
```

## Interface

interfaces is a way to define a set of properties.

```go
interface mytype {
  name string;
  age int;
  isAvalible bool;
}
```

## map types

mapping is a way to define a set of key-value pairs.

```typescript
var mymap = {
  name: "hayder",
  age: 24,
};
```

## enum types

enums are a way to define a set of constants.

```typescript
enum mytype {
  success,
  fail,
  waiting,
}
```

## enum values

```typescript
enum mytype {
  success = 0,
  fail = 1,
  waiting = 2,
}
```

e.g.
switch case using enum

```typescript
enum status {
    success = 0,
    fail = 1,
    waiting = 2,
}
function myfunc {
  @param value status;
  switch (value) {
    case success => print("success");
    case fail => print("fail");
    case waiting => print("waiting");
    default => print("unknown");
  }
}

```

# functions

```typescript
void hello {
  @param {
      name string;
      age int?;
      isAvalible bool;
  };


  print("Hello " + name);
}
```

another example:

```typescript
function hello {
  @param {
      name: string;
      age: number;
      isAvalible: boolean;
      address: Map<string, any>;
  }
  @return string;
  var {name,age}= params;
  return "Hello " + name;
}
//
function main() {
  hello({
    name: "Hayder",
    age: 24,
  });
}
>> "Hello Hayder 24"
```

# async functions

```typescript
async function foo {
  var foo = await bar();
}
```

## hooks

`init` Called during the construction of the async resource

`before` Called before the callback of the resource is called

`after` Called after the callback of the resource is called

`destroy` Called when the resource is destroyed

```typescript
async function main {
    //
    async.hooks({
        init: () {},
        before: () {},
        after: () {},
        destroy: () {},

    });
}
```

## Parallelism

parallel is a way to execute multiple tasks in parallel.

```typescript
async.parallel(
    task1: (callback)=> {
        print("task1");
    },
    task2: (callback)=> {
        print("task2");
    }
);
```

another example:

```typescript

async.parallel([
    myTask1,
    myTask2,
    myTask3
], (err, results)=> {
    if (err) {
     print("error"
    } else {
     print(results);
});
```

## series

When we have to run multiple tasks which depend on the output of the previous task, series comes to our rescue.

Callback function receives an array of result objects when all the tasks have been completed. If an error is encountered in any of the task, no more functions are run but the final callback is called with the error value.

```typeScript
async.series({
    task1 = (callback)=> {
        print("task1");
        callback(1);
    },
    task2 = (callback)=> {
        print("task2");
        callback(2);
    }
}, (err, results)=> {
    if (err) {
        print("error");
    } else {
        print(results);

    }
});

>> [1,2]
```

#### examples

```typescript
async.series([
    myTask1,
    myTask2,
    myTask3
], (err, results)=> {
    if (err) {
     print("error"
    } else {
     print(results);
});
```

# advanced types

## union types

union types are a way to define a set of types.

```typescript

type mytype = string | number | boolean | any;

var foo:mytype = "hayder";
>> "hayder"
var bar<mytype> = 24;
>> 24
var baz:mytype = true;
>> true
var qux:mytype = null;
>> null
```

## tuples

```typescript
type PersonProps = [string, number]

var tuple<PersonProps> = ["first", 2, true];
>> ["first", 2, true]
```

# Extenstions

Extensions are a way to add new functionality to existing types or classes/interfaces.

```dart
extension mytype on string {


    // geter
    var get isEmpty => this.length == 0? true : false;

    // or use a function
    function isEmpty() {
        if (this.length == 0) {
            return true;
        }
        return false;
    }
}
```

// e.g.

```dart
var name = "";
print(name.isEmpty)
>> true
```

more examples:

```go
// extension on interface
interface Foo {
  name string;
  age int;
}
```

```dart

extension Bar on Foo {
    // getter
   bool get isAvalible => this.age > 18;
    //function
    function isAvalible() {
        if (this.age > 18) {
            return true;
        }
        return false;
    }
}

```

// e.g.

```typescript

var result<Foo> = {
    name : "hayder",
    age : 24,
};
result.isAvalible();
>> true
```

another example:

```dart
// extension on string
ext MyExt on string {
    function API () {
        return "http://www.google.com/$this";
    }
}
var myendpoint = "hayder".API();
>> "http://www.google.com/hayder"
```

// another example:

```typescript
class A {
    val msg = "Hello world"
}
function A.printString(){
    print(this.string)
}
```

# Nullable types

nullable or optional types are a way to define a type that can be null or undefined.

```go
interface Mytype {
    name string; // required
    age int?; // optional
    isAvalible bool?; // optional
}
```

or

```go
interface Mytype {
    name string; // required
    age int?; // optional
    isAvalible bool?; // optional
}
```

e.g.

```typescript
var foo<Mytype> = {
  name = "hayder",
  age = 24,
  isAvalible = null,
};
print(foo.isAvalible);
>> null
```

# statements

## if statment

```sh
var value = true;

if (value) {
    print("Hello world");
} else {
    print("something else");
}
```

another example:

```typescript
var value = true;
if (value) {
  print("value is true");
}
throw {
  error: "error",
  message: "failed",
};
```

## switch statement

```java
var value = 10;

switch (value) {
    case 1 =>  print("one");
    case 2 =>  print("two");
    case 3 =>  print("three");
    default => print("default");
}

```

## for loop

```dart
var mylist = [1,2,3,4,5];
for (var i = 0; i < mylist.length; i++) {
    print(mylist[i]);
}
>> 1 2 3 4 5

// or use build-in forEach

mylist.forEach((item)=> {
    print(item);
});

```

## while loop

```dart
var i = 0;
while (i < 10) {
    print(i);
    i++;
}
```

### comments

```typescript
// this is a comment
```

# annotations

`@deprecated`: use this to mark a function or props as deprecated

// e.g.

```dart

@deprecated(msg: "This is deprecated")

```

# Memory

`@memory`: use this to allocate memory of a variable or value in bytes

// e.g.
// mark the whole interface

```typescript
@memory(size: 4)
interface Mytype {
    name string;
    age number;
}
```

or per property

```typescript
interface Mytype {
    @memory(size: 2)
    name string;
    age number;
}
```

```typescript
@memory(size: 1024)
var result = await getResult();
```

with functions

note : this is will mark the return value of the function

// e.g.

```typescript

@memory(size: 2)
function<number> age() {
    return 24;
}
```

# Built-in functions

```dart
var mylist = [1,2,3,4,5];
// check if list is empty

print(mylist.isEmpty);

>> false

// check if list is not empty
print(mylist.isNotEmpty);

>> true

// get length of list
print(mylist.length);

>> 5

// get first element of list
print(mylist.first);

>> 1

// get last element of list
print(mylist.last);

>> 5

// reverse list
mylist.reverse();
print(mylist.first);

>> [5,4,3,2,1]

// for each
mylist.forEach((item)=> {
    print(item);
});
>> 1 2 3 4 5
```

## get type

```sh
var mylist = [1,2,3,4,5];
print(mylist.getType());
>> list
```

## `as` keyword

```dart
var test = getResult() as string;
print(test);
>> "hayder"
```

## `is` keyword

```dart
var foo = "hayder";
if (foo is string) {
    print("string");
} else {
    print("not string");
}
```

# `delayed` function

delyed function is a function which is called after a specified time.

\*time in milliseconds

```sh
delayed(100,() => {
    print("Hello world");
});
```

## `future`

A Future represents a potential value, or error, that will be available at some time in the future. A Future can be complete with a value or with an error. Programmers can plug callbacks for each case

```sh
 async function getResult() {
     return http.get("your endpoint")
     .then((value) =>{
         return value.text();
     }).catch((error) => {
         print(error);
     };
   }
```

an example of using `future`

```dart
future<String> result = getResult();
result.then((value) => {
    print(value);
}).catch((error) => {
    print(error);
});
```

## `stream `

stream is a way to asynchronously process data.

`listen` : is a function that takes a stream and a callback.

`catch`: is a function that catches errors from a stream.

`cancel`: is a function to cancel subscription.

// e.g.
create a stream

```typescript
// create a stream
stream getdocs() {
  for (var i = 0; i < 10; i++) {
    return string.format("{0}", i);
  }
}
```

```typescript
getdocs.listen((value) => {
  print(value);
});
getdocs.catch((error) => {
  print(error);
});
// cancel
getdocs.cancel();
```

# import package or file

import a module

```sh
import os;
```

import a module with alias

```sh
import os as System;
```

import only one thing from a module

```sh
import {foo} from os;

```

import file

```sh
import "./file.ts";
```

### define a package

```go
package mypackage
```

# unsafe

```rust
unsafe function bar(){
  print("Hello world");
}
```

# standrard library

## http

```rust
import http;

function main() {
    var response = http.get("http://www.google.com");
    //
    print(response.statusCode);

}
>> 200
```

## system

```typescript
import system;
```

## io

```typescript
import io;
```

## path

```typescript
import path;
```

# key words

// table of contents
keyword | summary
------- | -------
`function` | A function declaration.
`var` | A variable declaration.
`const` | A constant declaration.
`true` | `true`
`false` | `false`
`null` | `null` value
`enum` | An enum declaration.
`type` | A type alias.
`if` | An if-then-else statement.
`else` | An else statement.
`while` | A while loop.
`do` | A do-while loop.
`for` | A for loop.
`switch` | A switch statement.
`case` | A case statement.
`default` | A default statement.
`return` | A return statement.
`throw` | A throw statement.
`try` | A try-catch-finally statement.
`catch` | A catch statement.
`finally` | A finally statement.
`with` | A with statement.
`interface` | An interface declaration.
`extenstion` | An extension declaration.
`async` | An async function declaration.
`await` | An await expression.
`import` | An import statement.
`export` | An export statement.
`package` | A module declaration.
`as` | An alias for a type.
`is` | A type guard. True if the object has the specified type
