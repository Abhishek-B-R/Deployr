"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generate = generate;
const MAX_LEN = 5;
function generate() {
    let ans = "";
    const subset = "123456789qwertyuiopasdfghjklzxcvbnm";
    for (let i = 0; i < MAX_LEN; i++) {
        ans += subset[Math.floor(Math.random() * subset.length)];
    }
    return ans;
}
