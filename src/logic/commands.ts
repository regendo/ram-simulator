import { RamState } from "./ram";
import { ParseHelper } from "./parseHelper";

export abstract class RamCommand {
	static matchAndConstruct(words: (string | number)[]): false | RamCommand {
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
