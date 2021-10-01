class ExtensibleFunction<A, B> extends Function {
    constructor(f: (x: A) => B) {
        super('...args', 'return this.__self__.__call__(...args)')
        return Object.setPrototypeOf(f, new.target.prototype);
    }
}



export class func<A, B> extends ExtensibleFunction<A, B>/* Function*/ {
    __self__: this;
    constructor(public f: (x: A) => B) {
        // super("return " + JSON.stringify(f) + ";");
        super(f)
        // const self = this.bind(this)
        // this.__self__ = self
        // return self
    }
    __call__(a: A): B {
        return this.f(a)
    }
    call() {
        return 1;
    }
    a(a: A): Example1<typeof f> {
        const f = this.f(a);
        if (isFunction(f)) {
            //@ts-ignore
            return new func<Parameters<typeof f>[0], ReturnType<typeof f>>(f);
        } else {
            //@ts-ignore
            return f;
        }
    };
    c<C>(f: functionLike<B, C>): func<A, C> {
        const ff = wrap(f)
        //@ts-ignore
        const composed = (x: A): C => ff.a(this.f(x))
        return new func(composed)
    }
}
function wrap<A, B>(f: functionLike<A, B>): func<A, B> {
    if (isFunction(f)) {
        //@ts-ignore
        return new func(f)
    } else {
        return f
    }
}
type functionLike<A, B> = func<A, B> | ((x: A) => B);
//@ts-ignore
type Example1<X> = X extends Function ? func<Parameters<X>[0], ReturnType<X>> : X;
function isFunction(f: any): f is Function {
    return typeof f === "function"
}
export const eq = <T>() => new func<T, (x: T) => boolean>((a: T) => (b: T) => a === b)
// export const eq = feq<number>()

export const inc = new func<number, number>((a: number) => a + 1)

export const not = wrap((x: boolean) => !x)
export const neq = <T>() => new func<T, (x: T) => boolean>((a: T) => (b: T) => a !== b)
export const on = <A, B, C>() => new func((f: (b1: B) => (b2: B) => C) => (g: (a: A) => B) => (a2: A) => (a3: A): C => f(g(a2))(g(a3)))
const fget = <B extends { [x: string]: any }>(s: keyof B) => (x: B) => x[s];
export const get = wrap<string, (x: { [x: string]: {}; }) => {}>(fget)
//x => x.name !== equpping.name
