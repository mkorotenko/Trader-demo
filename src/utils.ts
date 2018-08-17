
export function toArray<T>(data: any): Array<T> {
    return Array.prototype.slice.call(data);
}
