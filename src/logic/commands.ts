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

export const commands = {
	load: RamLoad,
	store: RamStore,
	dload: RamDirectLoad
};
