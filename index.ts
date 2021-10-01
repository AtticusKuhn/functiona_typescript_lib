class ExtensibleFunction<A, B> extends Function {
    constructor(f: (x: A) => B) {
        super('...args', 'return this.__self__.__call__(...args)')
        return Object.setPrototypeOf(f, new.target.prototype);
    }
}

export class func<A, B> extends ExtensibleFunction<A, B>/* Function*/ {
    __self__: this;
    constructor(public f: (x: A) => B) {
        super(f)
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
    //
    c<C>(f: functionLike<B, C>): func<A, C> {
        return new func<A, C>(compose<A, B, C>(this.f)(wrap(f).f))
    }
    bc<C>(f: functionLike<C, A>): func<C, B> {
        return new func<C, B>(compose<C, A, B>(wrap(f).f)(this.f))
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
const extract = <A, B>(f: functionLike<A, B>): (x: A) => B => wrap(f).f;
type functionLike<A, B> = func<A, B> | ((x: A) => B);
//@ts-ignore
type Example1<X> = X extends Function ? func<Parameters<X>[0], ReturnType<X>> : X;
function isFunction(f: any): f is Function {
    return typeof f === "function"
}
const compose = <A, B, C>(f: (x: A) => B) => (g: (y: B) => C): (t: A) => C => (z) => g(f(z));
export const eq = <T>() => new func<T, (x: T) => boolean>((a: T) => (b: T) => a === b)
// export const eq = feq<number>()

export const inc = new func<number, number>((a: number) => a + 1)
export const add = wrap((a: number) => (b: number) => a + b)

export const not = wrap((x: boolean) => !x)
export const neq = <T>() => new func<T, (x: T) => boolean>((a: T) => (b: T) => a !== b)
export const on = <A, B, C>() => new func((f: functionLike<B, functionLike<B, C>>) => (g: (a: A) => B) => (a2: A) => (a3: A): C => {
    const cf = compose(extract)(extract)(f) as (a: B) => (b: B) => C;
    return cf(g(a2))(g(a3));
});
const fget = <B extends { [x: string]: any }>(s: keyof B) => (x: B) => x[s];
export const get = wrap<string, (x: { [x: string]: {}; }) => {}>(fget)
export const map = <A, B>() => wrap((f: functionLike<A, B>) => (xs: A[]): B[] => xs.map(extract(f)))
export const filter = <A>() => wrap((f: functionLike<A, boolean>) => (xs: A[]): A[] => xs.filter(extract(f)))
export const count = <A>() => wrap((f: functionLike<A, boolean>) => (xs: A[]): number => {
    let i = 0
    for (const x of xs)
        if (extract(f)(x))
            i++
    return i
});
export const zipWith = <A, B, C>() => wrap(
    (f: functionLike<A, functionLike<B, C>>) => (xs1: A[]) => (xs2: B[]) => {
        const cf = compose(extract)(extract)(f) as (a: A) => (b: B) => C
        let xs = []
        while (xs1.length > 0 && xs2.length > 0) {
            xs.push(cf(xs1[0])(xs2[0]))
            xs1 = xs1.slice(1)
            xs2 = xs2.slice(1)
        }
        return xs
    })
export const foldl = <A, B>() => wrap((f1: functionLike<A, functionLike<B, B>>) => (b: B) => (as: A[]): B => {
    const cf = compose(extract)(extract)(f1) as (a: A) => (b: B) => B
    for (let i = 0; i < as.length; i++)
        b = cf(as[i])(b)
    return b;
})
export const foldr = <A, B>() => wrap((f1: functionLike<A, functionLike<B, B>>) => (b: B) => (as: A[]): B => {
    const cf = compose(extract)(extract)(f1) as (a: A) => (b: B) => B
    for (let i = as.length - 1; i > 0; i--)
        b = cf(as[i])(b)
    return b;
})
export const isEven = wrap((x: number) => x % 2 === 0)
export const show = wrap(JSON.stringify)
export const seq = wrap((end: number) => new Array(end).fill(0).map((_e, i) => i))
export const range = wrap((start: number) => (end: number) => new Array(end - start).fill(0).map((_e, i) => i + start))
