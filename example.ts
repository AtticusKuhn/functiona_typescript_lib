import { eq, func, get, on } from "./index"
// make a function to test if 2 objects have the same "name" attribute
const sameName: func<{ name: string }, (x: { name: string }) => boolean> = on<{ name: string }, string, boolean>()(eq<string>()).a(get("name"))
const test = sameName.a({ name: "alice" }).a({ name: "alice" })
console.log("do the 2 objects have the same name?", test)