# language

```typescript
// this is enum
enum ident {sucess, failed,unknown}
//enum with value
enum ident {sucess = 1, failed = 2,unknown = 3}
//
// varaible
something = 1;
something = "hello";
something = true;
something = [1,2,3];
something = null;
// variable with type
something Int = 1;
something String = "hello";
something Bool = true;
something Array<Int> = [1,2,3];
something [Int] = [1,2,3];
something <Array<String>> = ["hello", "world"];

//types
type something = Int;
// union
type something = Int | String;

// string literals
type something = "hello" | "world";

// tuple
type something = (Int, String);

// class
 something {
    // constructor
    init(a: Int, b: String) {
        this.a = a;
        this.b = b;
    }
    // method
    method(a: Int, b: String) {
        this.a = a;
        this.b = b;
    }
}
// interface
something {
    name: String;
    age: Int;
    isAvailable: bool;
}
// switch
switch (something) {
    case 1 => print("one");
    case 2 => print("two");
    case 3 => print("three");
    default => print("default");
}
// for
for (let i = 0; i < 10; i++) {
    print(i);
}
// for in
for (var i in something) {
    print(i);
}

// function with return
func someFunction(a: Int, b: Int) {
    this.a = a;
    this.b = b;
    return a + b;/
}
// is
if (something is Int) {
    print("something is Int");
}
if (something is String) {
    print("something is String");
}
if (something is Array<Int>) {
    print("something is Array<Int>");
}
if (something is Array<String>) {
    print("something is Array<String>");
}
if (something is enum ){
    print("something is enum");
}

```

// the langauge type system is sound
// varaible must have a value

```typescript
var myVar = 1;
var myVar = "hello";
var myVar = true;
var myVar = [1, 2, 3];
var myVar = null;
```

// by default

// if value is null then type is Ident?

// optional

```typescript
myIT {
name: String?;
age: Int?;
isAvailable: bool?;
}
```

// OR

```typescript
myIT {
@optional
name: String;
@optional
age: Int;
@optional
isAvailable: bool | null;
}
```

// extends

```typescript
MyClass extends MySuperClass {
    // constructor
    init(a: Int, b: String) {
        this.a = a;
        this.b = b;
    }
    // method
    method(a: Int, b: String) {
        this.a = a;
        this.b = b;
    }
}
```

switch (something) {
1 => print("one");
2 => print("two");
3 => print("three");
default => print("default");
}
