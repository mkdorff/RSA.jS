const bigInt = require("big-integer");
const readline = require("readline-sync");
const CODE_BASE = bigInt(127); // Full ASCII Support
const e = bigInt(65537);

function encodeMessage(str) {
  return str.split("").reduce(
      (sum, letter, idx, arr) =>
        sum.add(bigInt(letter.charCodeAt()).multiply(CODE_BASE.pow(arr.length - idx))
      ), bigInt(0)
    );
}

const msg = readline.question("What message would you like to encrypt? ");
const encodedMsg = encodeMessage(msg);

const randMin = encodedMsg.divide(4);
const randMax = encodedMsg.multiply(4);

let p, q, n, λ;
do {
  p = bigInt.randBetween(randMin, randMax);
  q = bigInt.randBetween(randMin, randMax);
  n = p.multiply(q);
  λ = bigInt.lcm(p.minus(1), q.minus(1));
} while (!p.isProbablePrime() || !q.isProbablePrime() || p.equals(q) || n.lesser(encodedMsg) || λ.lesser(e))
const d = e.modInv(λ);

console.log(`\np: ${p}`)
console.log(`q: ${q}`)
console.log(`n: ${n}`)
console.log(`λ: ${λ}`)
console.log(`e: ${e}`)
console.log(`d: ${d}`)

const remainderToChar = (r, pow) =>
  String.fromCharCode(r.divide(CODE_BASE.pow(pow - 1)).valueOf());

const getChars = (num, pow = 2) => {
  const { quotient: q, remainder: r } = num.divmod(CODE_BASE.pow(pow));
  return q.eq(0)
    ? [remainderToChar(r, pow)]
    : [...getChars(num.minus(r), pow + 1), remainderToChar(r, pow)];
};

const decodeMessage = num => getChars(num).join("");

const c = encodedMsg.modPow(e, n);
const m = c.modPow(d, n);
const original = decodeMessage(m);
console.log(`Generated cyphertext: ${c.valueOf()}`);
console.log(`Original message: ${original}`);