# About
This is a typescript library for functional programming, inspired by haskell.
# Example
Here is an example of how to use it
```ts
// example 1:  make a function to test if 2 objects have the same "name" attribute
const sameName = on<{ name: string }, string, boolean>().a(eq<string>()).a(get("name"))
const test = sameName.a({ name: "alice" }).a({ name: "alice" })
console.log("do the 2 objects have the same name?", test) // true

//example 2: increase a number then turn it to a string
const incrementThenString = inc.c(show)
console.log("incrementThenString(2) = ", incrementThenString(2)) // "3"

//example 3: increase every element of a list
const incrementList = map<number, number>().a(inc)
const list = incrementList.a(seq.a(10))
console.log("mapped sequence is", list) // [ 1, 2, 3, 4, 5,6, 7, 8, 9, 10 ]

// example 4: how many even numbers are less than 100?
const counter = count<number>().a(isEven).bc(seq)
console.log("how many even numbers are less than 100?", counter(100)) // 50

// example 6: add 2 lists
const addLists = zipWith<number, number, number>().a(add)
console.log("adding 2 lists", addLists.a(range.a(10).a(20)).a(seq(5))) // [ 10, 12, 14, 16, 18 ]

// example 7: sum a list
const sumList = seq.c(foldl<number, number>().a(add).a(0))
console.log("sum of all numbers from 0 to 99 = ", sumList.a(100)) // 4950

// example 8: get number of occuerances in a list
const numList = [1, 2, 3, 5, 1, 2, 3, 4, 2, 1, 2, 3, 3, 2, 1, 3, 4, 2]
const count2s = count<number>().a(eq<number>().a(2))
console.log("number of 2s in the list is", count2s(numList))
```
# Purpose
The purpose of the library is to have functional design that uses object-oriented and
class-based syntax in order to introduce object-oriented programmers to try functional
programming.
# Methods
The `func` class is the central class of this library, and it has some methods
- a: apply, like the `$` operator in haskell
- c: compose, like the `.` operator in haskell
- bc: backwards compose, like compose but with the order reversed. 
# Functions
This library contains several useful functions, here is the documentation:
- eq: are 2 things equal
- inc: increment a number
- add: add 2 numbers
- not: inver a boolean
- neq: are 2 things not equal
- on: same as `on` in haskell
- get: get a key from an object
- map: same as `map` in haskell
- filter: same as `filter` in haskell 
- count: same as `count` in haskell
-  zipWith: same as `zipWith` in haskell
- foldl: same as `foldl` in haskell
- foldr: same as `foldr` in haskell
- isEven: same as `isEven` in haskell
- show: same as `show` in haskell
- seq: generate a list of numbers ending at numebr
- range: generate a list of numbers between range 
