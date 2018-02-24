Hi guys
---
I just wanted to implement RSA in JS. Just for kicks and giggles. 

`functionalRSA.js` was my stab at writing the RSA with functional programming. It was fun, it works, it only supports message up to **6 characters long**. So it kind of sucks. It might be the recursion (especially on finding a random number that is also a prime and meets the other requirements) but JS is supposed to have TCO nowadays so it might not. It's probably (maybe also) the isPrime library I'm using. It's using a cached Sieve of Eratosthenes algorithm so... bigger the number (plus ...uhh... weirdness of it), the longer it takes and more memory it consumes. Either way, I'm blowing the heap when I set a higher max rand number. This also uses a cryptographically secure random number generator. Yay.

`functionalRSA.min.js` was a manual minifiying, just for fun. I haven't even run it because I got bored.

`index.js` supports all ascii characters and can handle any length of message, time and memory permitting. I'm too lazy to clean it up since I did it last. I consented to using a less secure random function and use a 'probable prime' for faster computing and to not blow the heap. I also replaced all my recursions with... loops. shudder.

If you're wondering how I magically made a string into one number as you no doubt are, I TAKE THE CHAR CODE AND MULTIPLY BY 127(ASCII) TO THE POWER OF THE POSITION IT'S IN. Ugh, I can't find a link to explain it on the interwebs. Okay, TLDR version

Say we have 3 characters in our alphabet. a, b, c. a=1, b=2, c=3. Then we make a message. "acaab".

```
                 a    c    a    a    b
value            1    3    1    1    2
position         5    4    3    2    1
multiplier       3^5  3^4  3^3  3^2  3^1
----------------------------------------
weighted value   243 +243 +27  +9   +6  =  528

Now we deconstruct 528
... Uhh..
I just did it wrong. I don't rememeber how this works. Whatever, look at my code, it's all there.

If YOU are ever reading this and actually want to know more or need to do this, just leave an issue or something. idk.
```

Great, I'm going to find something else to do on my weekend now.