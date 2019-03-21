import { RamState } from "./execute";

export abstract class RamCommand {
	param: number;
	execute(state: RamState): void {}
}

class RamDirectLoad extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(state: RamState) {
		state.accumulator = this.param;
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
}

class RamGoto extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(state: RamState) {
		state.line = this.param;
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
}

class RamStore extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(state: RamState) {
		state.memory[this.param] = state.accumulator;
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
}

class RamRead extends RamCommand {
	constructor() {
		super();
	}
	execute(state: RamState) {
		state.accumulator = state.input[state.inputAt];
		state.inputAt++;
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
}

class RamEnd extends RamCommand {
	constructor() {
		super();
	}
	execute(state: RamState) {
		state.done = true;
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
