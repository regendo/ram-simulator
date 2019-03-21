export abstract class RamCommand {
	param: number;
	execute(execState: Object): void {}
}

class RamDirectLoad extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(execState: { accumulator: number }) {
		execState.accumulator = this.param;
	}
}

class RamLoad extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(execState: {
		accumulator: string | number;
		memory: (string | number)[];
		line: number;
	}) {
		execState.accumulator = execState.memory[this.param];
	}
}

class RamILoad extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(execState: {
		accumulator: string | number;
		memory: (string | number)[];
		line: number;
	}) {
		const index = execState.memory[this.param];
		if (typeof index === "number") {
			execState.accumulator = execState.memory[index];
		}
	}
}

class RamGoto extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(execState: { line: number }) {
		execState.line = this.param;
	}
}

class RamIfThen extends RamCommand {
	condition: string | number;

	constructor(condition: string | number, param: number) {
		super();
		this.condition = condition;
		this.param = param;
	}
	execute(execState: { accumulator: string | number; line: number }) {
		if (execState.accumulator === this.condition) {
			execState.line = this.param;
		}
	}
}

class RamStore extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(execState: {
		accumulator: string | number;
		memory: (string | number)[];
		line: number;
	}) {
		execState.memory[this.param] = execState.accumulator;
	}
}

class RamIStore extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(execState: {
		accumulator: string | number;
		memory: (string | number)[];
		line: number;
	}) {
		const index = execState.memory[this.param];
		if (typeof index === "number") {
			execState.memory[index] = execState.accumulator;
		}
	}
}

class RamAdd extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(execState: { accumulator: number; memory: (string | number)[] }) {
		const toAdd = execState.memory[this.param];
		if (typeof toAdd === "number") {
			execState.accumulator += toAdd;
		}
	}
}

class RamSub extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(execState: { accumulator: number; memory: (string | number)[] }) {
		const toAdd = execState.memory[this.param];
		if (typeof toAdd === "number") {
			const result = Math.max(0, execState.accumulator - toAdd);
			execState.accumulator = result;
		}
	}
}

class RamRead extends RamCommand {
	constructor() {
		super();
	}
	execute(execState: {
		accumulator: string | number;
		input: string;
		inputAt: number;
	}) {
		execState.accumulator = execState.input[execState.inputAt];
		execState.inputAt++;
	}
}

class RamWrite extends RamCommand {
	char: string;
	constructor(char: string) {
		super();
		this.char = char;
	}
	execute(execState: { output: string }) {
		execState.output += this.char;
	}
}

class RamMul extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(execState: { accumulator: number; memory: (string | number)[] }) {
		const toMul = execState.memory[this.param];
		if (typeof toMul === "number") {
			execState.accumulator *= toMul;
		}
	}
}

class RamDiv extends RamCommand {
	constructor(param: number) {
		super();
		this.param = param;
	}
	execute(execState: { accumulator: number; memory: (string | number)[] }) {
		const toDiv = execState.memory[this.param];
		if (typeof toDiv === "number") {
			const result = Math.floor(execState.accumulator / toDiv);
			execState.accumulator = result;
		}
	}
}

class RamEnd extends RamCommand {
	constructor() {
		super();
	}
	execute(execState: { done: boolean }) {
		execState.done = true;
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
