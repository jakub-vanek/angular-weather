import {Injectable} from '@angular/core';

interface CacheItem<T> {
    expiresAt: number;
    value: T;
}

@Injectable()
export class CacheService<T> {

    constructor(private ttlMillis: number) { }

    get(key: string): T | undefined {
        const cached = localStorage.getItem(key);
        if (cached) {
            const cacheItem: CacheItem<T> = JSON.parse(cached);
            if (cacheItem.expiresAt && cacheItem.expiresAt > new Date().getTime()) {
                return cacheItem.value;
            } else {
                localStorage.removeItem(key);
            }
        }
        return undefined;
    }

    set(key: string, value: T): void {
        const cacheItem: CacheItem<T> = { expiresAt: new Date().getTime() + this.ttlMillis, value: value }
        localStorage.setItem(key, JSON.stringify(cacheItem));
    }
}
