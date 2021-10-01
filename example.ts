import { eq, func, get, inc, map, on, seq, show } from "./index"
// example 1:  make a function to test if 2 objects have the same "name" attribute
const sameName: func<{ name: string }, (x: { name: string }) => boolean> = on<{ name: string }, string, boolean>().a(eq<string>().f).a(get("name"))
const test = sameName.a({ name: "alice" }).a({ name: "alice" })
console.log("do the 2 objects have the same name?", test)
//example 2: increase a number then turn it to a string
const incrementThenString = inc.c(show)
console.log("incrementThenString(2) = ", incrementThenString(2))
//example 3: increase every element of a list
const incrementList = map<number, number>().a(inc)
const list = incrementList.a(seq.a(10))
console.log("mapped sequence is", list)