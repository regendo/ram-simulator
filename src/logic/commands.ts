import { ParseHelper } from "./parseHelper";
import { RamState } from "./ram";

/**
 * Abstract class that all commands inherit from.
 *
 * Provides static `matchAndConstruct` method that constructs the appropriate command to your input.
 */
export abstract class RamCommand {
	/**
	 * Finds a command that matches the supplied input and constructs that command.
	 *
	 * Commands inheriting from this super class should overwrite this method to match and construct just that specific command.
	 *
	 * @param words Sequence of strings and numbers that represent the command.
	 * @returns Constructed matching command, if any. False otherwise.
	 */
	public static matchAndConstruct(
		words: (string | number)[]
	): false | RamCommand {
		const match = Object.keys(commands)
			.map((key) => {
				const command: typeof RamCommand = commands[key];
				const match = command.matchAndConstruct(words);
				if (match) {
					return match;
				}
				return false;
			})
			.find((val) => !!val);
		return match || false;
	}
	param: number;
	execute(state: RamState): void {
		throw new Error("Method not implemented.");
	}
}

/**
 * Command `dload {value}` that loads supplied value into the accumulator.
 */
class RamDirectLoad extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(state: RamState) {
		state.accumulator = this.param;
	}
	static matchAndConstruct(words: (string | number)[]): false | RamDirectLoad {
		const match = ParseHelper.match(words, ["dload", ParseHelper.int]);
		if (match) {
			const num = match[0];
			if (typeof num === "number") {
				return new RamDirectLoad(num);
			}
		}
		return false;
	}
}

/**
 * Command `load {index}` that loads the value located in the memory at supplied index into the accumulator.
 */
class RamLoad extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(state: RamState) {
		state.accumulator = state.memory[this.param];
	}
	static matchAndConstruct(words: (string | number)[]): false | RamLoad {
		const match = ParseHelper.match(words, ["load", ParseHelper.int]);
		if (match) {
			const num = match[0];
			if (typeof num === "number") {
				return new RamLoad(num);
			}
		}
		return false;
	}
}

/**
 * Command `iload {index}` that loads the value referenced in the memory at supplied index into the accumulator.
 * (It loads `memory[memory[index]]`.)
 */
class RamILoad extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(state: RamState) {
		const index = state.memory[this.param];
		if (typeof index === "number") {
			state.accumulator = state.memory[index];
		}
	}
	static matchAndConstruct(words: (string | number)[]): false | RamILoad {
		const match = ParseHelper.match(words, ["iload", ParseHelper.int]);
		if (match) {
			const num = match[0];
			if (typeof num === "number") {
				return new RamILoad(num);
			}
		}
		return false;
	}
}

/**
 * Command `goto {line}` that jumps to supplied line in the program. The next command to be executed will be the one located at supplied line.
 */
class RamGoto extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(state: RamState) {
		state.line = this.param;
	}
	static matchAndConstruct(words: (string | number)[]): false | RamGoto {
		const match = ParseHelper.match(words, ["goto", ParseHelper.int]);
		if (match) {
			const num = match[0];
			if (typeof num === "number") {
				return new RamGoto(num);
			}
		}
		return false;
	}
}

/**
 * Command `if {condition} then {line}` that jumps to supplied line in the program if the accumulator value equals supplied condition value, and does nothing otherwise.
 */
class RamIfThen extends RamCommand {
	condition: string | number;

	constructor(condition: string | number, param: number) {
		super();
		this.condition = condition;
		this.param = param;
	}
	execute(state: RamState) {
		if (state.accumulator === this.condition) {
			state.line = this.param;
		}
	}
	static matchAndConstruct(words: (string | number)[]): false | RamIfThen {
		const match =
			ParseHelper.match(words, [
				"if",
				ParseHelper.int,
				"then",
				ParseHelper.int
			]) ||
			ParseHelper.match(words, [
				"if",
				ParseHelper.char,
				"then",
				ParseHelper.int
			]);
		if (match) {
			const condition = match[0];
			const goto = match[1];
			if (typeof goto === "number") {
				return new RamIfThen(condition, goto);
			}
		}
		return false;
	}
}

/**
 * Command `store {index}` that stores the accumulator value into the memory at supplied index.
 */
class RamStore extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(state: RamState) {
		state.memory[this.param] = state.accumulator;
	}
	static matchAndConstruct(words: (string | number)[]): false | RamStore {
		const match = ParseHelper.match(words, ["store", ParseHelper.int]);
		if (match) {
			const num = match[0];
			if (typeof num === "number") {
				return new RamStore(num);
			}
		}
		return false;
	}
}

/**
 * Command `istore {index}` that stores the accumulator value into the memory at the position referenced by supplied index.
 * (It stores into `memory[memory[index]]`.)
 */
class RamIStore extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(state: RamState) {
		const index = state.memory[this.param];
		if (typeof index === "number") {
			state.memory[index] = state.accumulator;
		}
	}
	static matchAndConstruct(words: (string | number)[]): false | RamIStore {
		const match = ParseHelper.match(words, ["istore", ParseHelper.int]);
		if (match) {
			const num = match[0];
			if (typeof num === "number") {
				return new RamIStore(num);
			}
		}
		return false;
	}
}

/**
 * Command `add {index}` that increases the accumulator value by the value located in memory at supplied index.
 */
class RamAdd extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(state: RamState) {
		const toAdd = state.memory[this.param];
		if (typeof toAdd === "number" && typeof state.accumulator === "number") {
			state.accumulator += toAdd;
		}
	}
	static matchAndConstruct(words: (string | number)[]): false | RamAdd {
		const match = ParseHelper.match(words, ["add", ParseHelper.int]);
		if (match) {
			const num = match[0];
			if (typeof num === "number") {
				return new RamAdd(num);
			}
		}
		return false;
	}
}

/**
 * Command `sub {index}` that decreases the accumulator value by the value located in memory at supplied index.
 *
 * Note that negative values are not supported. If this command would decrease the accumulator value below 0, it is set to 0 instead.
 */
class RamSub extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(state: RamState) {
		const toAdd = state.memory[this.param];
		if (typeof toAdd === "number" && typeof state.accumulator === "number") {
			const result = Math.max(0, state.accumulator - toAdd);
			state.accumulator = result;
		}
	}
	static matchAndConstruct(words: (string | number)[]): false | RamSub {
		const match = ParseHelper.match(words, ["sub", ParseHelper.int]);
		if (match) {
			const num = match[0];
			if (typeof num === "number") {
				return new RamSub(num);
			}
		}
		return false;
	}
}

/**
 * Command `read` that reads the next character of the input into the accumulator.
 */
class RamRead extends RamCommand {
	constructor() {
		super();
	}
	execute(state: RamState) {
		state.accumulator = state.input[state.inputAt];
		state.inputAt++;
	}
	static matchAndConstruct(words: (string | number)[]): false | RamRead {
		const match = ParseHelper.match(words, ["read"]);
		if (match) {
			return new RamRead();
		}
		return false;
	}
}

/**
 * Commnad `write` that appends the accumulator character to the output.
 */
class RamWrite extends RamCommand {
	char: string;
	constructor(char: string) {
		super();
		this.char = char;
	}
	execute(state: RamState) {
		state.output += this.char;
	}
	static matchAndConstruct(words: (string | number)[]): false | RamWrite {
		const match = ParseHelper.match(words, ["write", ParseHelper.char]);
		if (match) {
			const char = match[0];
			if (typeof char === "string") {
				return new RamWrite(char);
			}
		}
		return false;
	}
}

/**
 * Command `mul {index}` that multiplies the accumulator value by the value located in memory at supplied index.
 */
class RamMul extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(state: RamState) {
		const toMul = state.memory[this.param];
		if (typeof toMul === "number" && typeof state.accumulator === "number") {
			state.accumulator *= toMul;
		}
	}
	static matchAndConstruct(words: (string | number)[]): false | RamMul {
		const match = ParseHelper.match(words, ["mul", ParseHelper.int]);
		if (match) {
			const num = match[0];
			if (typeof num === "number") {
				return new RamMul(num);
			}
		}
		return false;
	}
}

/**
 * Command `div {index}` that divides the accumulator value by the value located in memory at supplied index.
 *
 * Note that only integers are supported. If the result of the division doesn't result in a whole number, it is rounded down.
 */
class RamDiv extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(state: RamState) {
		const toDiv = state.memory[this.param];
		if (typeof toDiv === "number" && typeof state.accumulator === "number") {
			const result = Math.floor(state.accumulator / toDiv);
			state.accumulator = result;
		}
	}
	static matchAndConstruct(words: (string | number)[]): false | RamDiv {
		const match = ParseHelper.match(words, ["div", ParseHelper.int]);
		if (match) {
			const num = match[0];
			if (typeof num === "number") {
				return new RamDiv(num);
			}
		}
		return false;
	}
}

/**
 * Command `end` that ends the execution of the program.
 */
class RamEnd extends RamCommand {
	constructor() {
		super();
	}
	execute(state: RamState) {
		state.done = true;
	}
	static matchAndConstruct(words: (string | number)[]): false | RamEnd {
		const match = ParseHelper.match(words, ["end"]);
		if (match) {
			return new RamEnd();
		}
		return false;
	}
}

export const commands = {
	load: RamLoad,
	store: RamStore,
	dload: RamDirectLoad,
	goto: RamGoto,
	ifthen: RamIfThen,
	add: RamAdd,
	sub: RamSub,
	read: RamRead,
	write: RamWrite,
	end: RamEnd,
	mul: RamMul,
	div: RamDiv,
	iload: RamILoad,
	istore: RamIStore
};
