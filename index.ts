class func<A, B>{
    constructor(public f: (x: A) => B) {

    }
    a(a: A): Example1<typeof f> {//B | func<Parameters<B & Function>[0], ReturnType<B & Function>> {
        // const tf = this.f;
        const f = this.f(a);
        if (isFunction(f)) {
            // type x = Example1<typeof f>
            //@ts-ignore
            return new func<Parameters<typeof f>[0], ReturnType<typeof f>>(f);
        } else {
            //@ts-ignore
            return f;
        }
    }
    c<C>(f: functionLike<B, C>): func<A, C> {
        const ff = wrap(f)
        //@ts-ignore
        const composed = (x: A): C => ff.a(this.f(x))
        return new func(composed)
    }
}
function wrap<A, B>(f: functionLike<A, B>): func<A, B> {
    if (isFunction(f)) {
        return new func(f)
    } else {
        return f
    }
}
type functionLike<A, B> = func<A, B> | ((x: A) => B);
// type e = Function extends Function;
//@ts-ignore
type Example1<X> = X extends Function ? func<Parameters<X>[0], ReturnType<X>> : X;
function isFunction(f: any): f is Function {
    return typeof f === "function"
}
const feq = <T>() => new func<T, (x: T) => boolean>((a: T) => (b: T) => a === b)
const eq = feq<number>()
const a = eq.a(1).a(1);
const c = eq.a(1);
console.log("a", a, "c", c)
const finc = () => new func<number, number>((a: number) => a + 1)
const inc = finc()
const b = inc.a(1)
const plus_three = inc.c(inc)
const six = plus_three.a(3)
console.log("b", b)
console.log("plus_three", six)

// export const eq = <T>(a: T) => (b: T) => a === b;
export const neq = <T>(a: T) => (b: T) => a !== b;
export const on = <A, B, C>(f: (b1: B) => (b2: B) => C) => (g: (a: A) => B) => (a2: A) => (a3: A): C => f(g(a2))(g(a3))
export const get = <T extends { [a: string]: string }>(s: string) => (x: T) => x[s];
//x => x.name !== equpping.name
