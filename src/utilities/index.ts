import { operators } from "../operators"

export function hasOwnProperty<X extends {}, Y extends PropertyKey>(obj: X, prop: Y): obj is X & Record<Y, unknown> {
    if (typeof obj !== "object") {
        return false
    }
    return Object.hasOwnProperty.call(obj, prop)
}

export function objectKeys(input: {}) {
    if (input instanceof Object) {
        try {
            return Object.keys(input)
        } catch (error) {
            return undefined
        }
    }
    return undefined
}

export function propsToArray(obj) { 
    const attributes: string[] = []
    void (function add(obj) {
        for (const [k,v] of Object.entries(obj)) {
            if (!operators.includes(k as any)){
                attributes.push(k)
            }
            if (isObject(v)) {
                add(v)
            }
        }
    })(obj)
    return attributes
}

export function isObject(obj: any) {
    if (typeof obj == "object" && !Array.isArray(obj) && obj !== null) {
        return true
    }
    return false
}

export function splitItems(items: Array<any>): Array<any> {
    const group = []
    void (function split(items: Array<any>) {
        const first = items.slice(0, 25)
        const rest = items.slice(25)
        group.push(first)
        if (rest.length > 25) {
            return split(rest)
        } else {
            if (rest.length > 0) {
                group.push(rest)
            }
        }
    })(items)
    return group
}