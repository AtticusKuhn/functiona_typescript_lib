# About
This is a typescript library for functional programming, inspired by haskell.
# Example
Here is an example of how to use it
```ts
import { add, count, eq, get, inc, isEven, map, on, range, seq, show, zipWith } from "./index"
// example 1:  make a function to test if 2 objects have the same "name" attribute
const sameName = on<{ name: string }, string, boolean>().a(eq<string>().f).a(get("name"))
const test = sameName.a({ name: "alice" }).a({ name: "alice" })
console.log("do the 2 objects have the same name?", test) // true
//example 2: increase a number then turn it to a string
const incrementThenString = inc.c(show)
console.log("incrementThenString(2) = ", incrementThenString(2)) // "3"
//example 3: increase every element of a list
const incrementList = map<number, number>().a(inc)
const list = incrementList.a(seq.a(10))
console.log("mapped sequence is", list) // [ 1, 2, 3, 4, 5,6, 7, 8, 9, 10 ]
// how many even numbers are less than 100?
const counter = seq.c(count<number>().a(isEven));
console.log("how many even numbers are less than 100?", counter(100)) // 50
// add 2 lists
const addLists = zipWith<number, number, number>().a(add.f)
console.log("adding 2 lists", addLists.a(range.a(10).a(20)).a(seq(5))) // [ 10, 12, 14, 16, 18 ]
```