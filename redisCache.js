class RedisCache {
    constructor() {
        this.cache = {};  
        this.expiryTimes = {}; 
    }

    set(key, value, ttl = null) {
        const currentTime = Date.now();
        this.cache[key] = value;

        // If ttl is provided, calculate the expiration time and set it
        if (ttl) {
            this.expiryTimes[key] = currentTime + ttl * 1000;

            setTimeout(() => {
                if (Date.now() >= this.expiryTimes[key]) {
                    this.delete(key);
                }
            }, ttl * 1000);
        }
    }

    get(key) {
        const currentTime = Date.now();
        const expiryTime = this.expiryTimes[key];

        if (expiryTime && currentTime >= expiryTime) {
            this.delete(key);
            return null;
        }

        return this.cache.hasOwnProperty(key) ? this.cache[key] : null;
    }

    delete(key) {
        delete this.cache[key];
        delete this.expiryTimes[key];
    }

    showCache() {
        console.log(this.cache);
    }
}


const cache = new RedisCache();

cache.set('name', 'John', 5); // The key 'name' will expire after 5 seconds
cache.set('age', 30); // No expiration for 'age'

console.log(cache.get('name'));  // Output: John
console.log(cache.get('age'));   // Output: 30

// Wait for 6 seconds to check expiration
setTimeout(() => {
    console.log(cache.get('name'));  // Output: null (expired)
    console.log(cache.get('age'));   // Output: 30 (still in cache)
    cache.showCache();  // Should only show { age: 30 }
}, 6000);