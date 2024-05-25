
/**
 * given a sample string like 
 * ```js
 * let sampleString = 'Imperative=C;Object Oriented Programming=C++;Functional Programming=Haskell;';
 * extractKeysAndValues(sampleString) 
 * {
 * 'Functional Programming':"Haskell" , 
 * 'Imperative' : 'C', 
 * 'Object Oriented Programming': 'C++',
 * }
 * ```
 */
export function extractKeysAndValues(input: string, accessor="=", delimiter=';'){
    let obj: {[x: string]: string} = {};
    input.split(delimiter).forEach(pair => {
    if(!pair.length) return;
    let [key, value] = pair.split(accessor);
    obj[key] = value;
 })
 return obj;
}