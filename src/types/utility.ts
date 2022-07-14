export type ValueOf<T> = T[keyof T]

export type PickOnly<T,K extends keyof T> = Pick<T,K> & {[P in Exclude<keyof T,K>]?: never}

export type RecursivePartial<T> = {
    [P in keyof T]?: RecursivePartial<T[P]>
}