// Libraries:
// big-integer          : handling integers of arbitrary sizes
// random-number-csprng : cryptographically secure random number generator
// quick-is-prime       : uses a cached Sieve of Eratosthenes algorithm

const bigInt = require("big-integer");
const rand = require("random-number-csprng");
const isPrime = require("quick-is-prime");

// Constants
const RAND_MAX = 40000000; // Max n of 1599998480000357
const CODE_BASE = bigInt(127); // Full ASCII Support up to 6 chars
const E = bigInt(65537);

const randPrime = async existing => {
  const num = await rand(0, RAND_MAX);
  return isPrime(num) && (!existing || num !== existing.valueOf())
    ? bigInt(num)
    : randPrime(existing);
};

const charArrayToBigInt = (sum, letter, idx, arr) =>
  sum.add(
    bigInt(letter.charCodeAt()).multiply(CODE_BASE.pow(arr.length - idx))
  );

const encodeMessage = str => str.split("").reduce(charArrayToBigInt, bigInt(0));

const remainderToChar = (r, pow) =>
  String.fromCharCode(r.divide(CODE_BASE.pow(pow - 1)).valueOf());

const getChars = (num, pow = 2) => {
  const { quotient: q, remainder: r } = num.divmod(CODE_BASE.pow(pow));
  return q.eq(0)
    ? [remainderToChar(r, pow)]
    : [...getChars(num.minus(r), pow + 1), remainderToChar(r, pow)];
};

const decodeMessage = num => getChars(num).join("");

const generateKeys = async () => {
  const p = await randPrime();
  const q = await randPrime(p);
  const n = p.multiply(q);
  const λ = bigInt.lcm(p.minus(1), q.minus(1));
  return λ.greater(E) ? { n, λ } : generateKeys();
};

const RSA = async msg => {
  const { n, λ } = await generateKeys();
  const e = E;
  const d = e.modInv(λ);

  console.log(`Public Key  (n: ${n}, e: ${e})`);
  console.log(`Private Key (n: ${n}, d: ${d})`);

  const cmsg = encodeMessage(msg);
  if (cmsg.greater(n)) {
    console.log("The message is too long for the generated keys");
    return;
  }

  const c = cmsg.modPow(e, n);
  const m = c.modPow(d, n);
  const original = decodeMessage(m);
  console.log(`Generated cyphertext: ${c.valueOf()}`);
  console.log(`Original message: ${original}`);
};

RSA("age");

// console.log(`p: ${p}`)
// console.log(`q: ${q}`)
// console.log(`n: ${n}`)
// console.log(`λ: ${λ}`)
// console.log(`e: ${e}`)
// console.log(`d: ${d}`)

// console.log(`Encode message:       ${cmsg.valueOf()}`);
// console.log(`Decrypted cyphertext: ${m.valueOf()}`);
