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
    ba<C>(f: func<func<A, B>, C>): C {
        return f(this)
    }
    c<C>(f: functionLike<B, C>): func<A, C> {
        return new func<A, C>(compose<A, B, C>(this.f)(wrap(f).f))
    }
    bc<C>(f: functionLike<C, A>): func<C, B> {
        return new func<C, B>(compose<C, A, B>(wrap(f).f)(this.f))
    }
}
export class Monad<A> {
    constructor(public x: A) { }
    rtrn(x: A): Monad<A> { return new Monad<A>(x) }
    Mbind<B>(f: func<A, Monad<B>>) { return f.a(this.x) }
}
export class Functor<T> {
    constructor(public x: T) { }
    //@ts-ignore
    i<B>(f: func<T, B>): Functor<B> { return new Functor(f.a(this.x)) }
}
export class LinkedList<T> extends Array implements Monad<T>, Functor<T> {
    x: T;
    constructor(public xs: T[]) {
        super(xs.length)
        this.x = xs[0]
    }
    rtrn(a: T): Monad<T> {
        //@ts-ignore
        return [a]
    }
    i<B>(f: func<T, B>): LinkedList<B> { return new LinkedList(this.xs.map(f.f)) }
    Mbind<B>(f: func<T, Monad<B>>): Monad<B> { return f.a(this.xs[0]); }
    head(): T { return this.xs[0] }
    tail(): T[] { return this.xs.slice(1) }
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
export const gt = wrap((x: number) => (y: number) => x > y)
export const lt = wrap((x: number) => (y: number) => x < y)

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
export const seq = wrap((end: number) => new LinkedList(new Array(end).fill(0).map((_e, i) => i)))
export const range = wrap((start: number) => (end: number) => new LinkedList(new Array(end - start).fill(0).map((_e, i) => i + start)))
export const i = <T, X>() => wrap((f: func<T, X>) => (x: Functor<T>): Functor<X> => x.i(f))
export const rtrn = <T>() => wrap((x: T): Monad<T> => new Monad<T>(x))
export const forLoop = <T, B>() => wrap((inital: T) => (done: functionLike<T, boolean>) => (step: functionLike<T, T>) => (transform: functionLike<T, B>): LinkedList<B> => {
    const d: (x: T) => boolean = extract(done);
    const s = extract(step)
    const t = extract(transform)
    let stack: LinkedList<B> = new LinkedList([])
    for (let i = inital; d(i); i = s(i)) {
        stack.push(t(i))
    }
    return stack;
})
export const sequence = <T>() => wrap((inital: number) => (done: functionLike<number, boolean>) => (transform: functionLike<number, T>) => forLoop<number, T>().a(inital).a(done).a(inc).a(transform))
export const sumList = foldl<number, number>().a(add).a(0)
export const sigmaSum = sumList.c(sequence<number>())
export const power = wrap((x: number) => (y: number) => x ** y)
export const flip = <A, B, C>() => wrap((f: functionLike<A, functionLike<B, C>>): func<B, func<A, C>> => {
    const ff = extract(f)
    return wrap((B: B) => wrap((A: A): C => extract(ff(A))(B)))
})