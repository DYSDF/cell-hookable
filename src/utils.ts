export const isPlainObj = (obj: any) => typeof obj === 'object' && Object.getPrototypeOf(obj) === Object.prototype
