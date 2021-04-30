/** An argument type's options object. */
export interface ArgumentSpecifier {
    type: string;
}
/** An argument's options interface and its return type inside a type tuple. */
export declare type ArgumentType<A extends ArgumentSpecifier = ArgumentSpecifier, R = any> = [A, R];
/**
 * A function that takes an args array and the options for the argument and
 * returns a value that matches the expected type of the argument.
 */
export declare type ArgumentResolver<A extends ArgumentType = ArgumentType> = (args: string[], opts: A[0]) => A[1] | Promise<A[1]>;
/** Registers a custom argument type for use with `parseArgs` */
export declare function registerArgumentType<T extends ArgumentType>(id: T[0]['type'], func: ArgumentResolver<T>): void;
/** Parses command arguments according to a list of argument types. */
export declare function parseArgs<T extends ArgumentType[]>(args: string[], specifiers: [T[0][0]]): Promise<[T[0][1]]>;
export declare function parseArgs<T extends ArgumentType[]>(args: string[], specifiers: [T[0][0], T[1][0]]): Promise<[T[0][1], T[1][1]]>;
export declare function parseArgs<T extends ArgumentType[]>(args: string[], specifiers: [T[0][0], T[1][0], T[2][0]]): Promise<[T[0][1], T[1][1], T[2][1]]>;
export declare function parseArgs<T extends ArgumentType[]>(args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1]]>;
export declare function parseArgs<T extends ArgumentType[]>(args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0], T[4][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1], T[4][1]]>;
export declare function parseArgs<T extends ArgumentType[]>(args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0], T[4][0], T[5][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1], T[4][1], T[5][1]]>;
export declare function parseArgs<T extends ArgumentType[]>(args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0], T[4][0], T[5][0], T[6][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1], T[4][1], T[5][1], T[6][1]]>;
export declare function parseArgs<T extends ArgumentType[]>(args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0], T[4][0], T[5][0], T[6][0], T[7][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1], T[4][1], T[5][1], T[6][1], T[7][1]]>;
export declare function parseArgs<T extends ArgumentType[]>(args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0], T[4][0], T[5][0], T[6][0], T[7][0], T[8][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1], T[4][1], T[5][1], T[6][1], T[7][1], T[8][1]]>;
export declare function parseArgs<T extends ArgumentType[]>(args: string[], specifiers: [T[0][0], T[1][0], T[2][0], T[3][0], T[4][0], T[5][0], T[6][0], T[7][0], T[8][0], T[9][0]]): Promise<[T[0][1], T[1][1], T[2][1], T[3][1], T[4][1], T[5][1], T[6][1], T[7][1], T[8][1], T[9][1]]>;
