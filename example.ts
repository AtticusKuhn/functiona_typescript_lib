import { add, count, eq, foldl, get, gt, inc, isEven, map, on, power, range, seq, sequence, show, zipWith } from "./index"


// example 1:  make a function to test if 2 objects have the same "name" attribute
const sameName = on<{ name: string, [x: string]: any }, string, boolean>().a(eq<string>()).a(get("name"))
const test = sameName.a({ name: "alice", age: 2 }).a({ name: "alice", age: 30 })
console.log("do the 2 objects have the same name?", test) // true

//example 2: increase a number then turn it to a string
const incrementThenString = inc.c(show)
console.log("incrementThenString(2) = ", incrementThenString(2)) // "3"

//example 3: increase every element of a list
const incrementList = map<number, number>().a(inc)
const list = incrementList.a(seq.a(10))
console.log("mapped sequence is", show.a(list)) // [ 1, 2, 3, 4, 5,6, 7, 8, 9, 10 ]

// example 4: how many even numbers are less than 100?
const counter = count<number>().a(isEven).bc(seq)
console.log("how many even numbers are less than 100?", counter(100)) // 50

// example 6: add 2 lists
const addLists = zipWith<number, number, number>().a(add)
console.log("adding 2 lists", addLists.a(range.a(10).a(20)).a(seq(5))) // [ 10, 12, 14, 16, 18 ]

// example 7: sum a list
const sumList = foldl<number, number>().a(add).a(0).bc(seq)
console.log("sum of all numbers from 0 to 99 = ", sumList.a(100)) // 4950

// example 8: get number of occuerances in a list
const numList = [1, 2, 3, 5, 1, 2, 3, 4, 2, 1, 2, 3, 3, 2, 1, 3, 4, 2]
const count2s = eq<number>().a(2).ba(count<number>())
console.log("number of 2s in the list is", count2s(numList)) // 6

// example 9: get squares from 1 to 100
const powers = sequence<number>().a(0).a(gt.a(10)).a(power.a(2))
console.log("powers of 2 from 1 to 10", show.a(powers))