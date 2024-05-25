import { shuffleArray } from "./shuffleArray";

/**
 * given a sample string like 
 * ```js
 * let sampleString = 'Imperative=C;Object Oriented Programming=C++;Functional Programming=Haskell;';
 * let shuffledOutput = extractAndShufflePairs(sampleString) 
 * console.log(shuffledOutput) // {pair1: ['Functional Programming', 'Imperative', 'Object Oriented Programming'], pair2: ['C++', 'C', "Haskell"]}
 * ```
 */
export function extractAndShufflePairs(input: string, accessor="=", delimiter=';'){
    let pairs = input.trim().split(delimiter);
    if(pairs[pairs.length - 1] === '') pairs.pop();
    let pair1: string[] = [];
    let pair2: string[] = [];
    pairs.forEach(pair => {
        let [key, val] = pair.split(accessor);
        pair1.push(key);
        pair2.push(val);
    });
    pair1 = shuffleArray(pair1);
    pair2 = shuffleArray(pair2);
    return {
        pair1,
        pair2
    }
}