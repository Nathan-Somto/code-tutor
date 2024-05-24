export function shuffleArray<T>(arr: T[]){
    // a solution that does not mutate the original array
    return arr.slice().sort(() => Math.random() - 0.5);
}