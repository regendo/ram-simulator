import { RamCommand } from "src/logic/commands";

export class RAM {
	commands: RamCommand[];
	stepCount: number;
	execState: {
		accumulator: number | string;
		memory: (number | string)[];
		line: number;
		input: string;
		inputAt: number;
		output: string;
	};
	constructor(commands: RamCommand[], input: string) {
		this.commands = commands;
		this.reset();
		this.execState.input = input;
	}

	reset(): void {
		let input = "";
		if (this.execState) {
			input = this.execState.input;
		}
		this.execState = {
			accumulator: "",
			input: input,
			inputAt: 0,
			line: 1,
			memory: [],
			output: ""
		};
		this.stepCount = 0;
	}

	execLine(): void {
		const prevLine = this.execState.line;
		const command = this.commands[this.execState.line - 1];
		command.execute(this.execState);
		this.stepCount++;
		this.validate();
		if (this.execState.line == prevLine) {
			// regular command, execution didn't jump around
			this.execState.line++;
		}
	}

	validate(): void {
		if (
			this.execState.line < 1 ||
			this.execState.line > this.commands.length ||
			(typeof this.execState.accumulator == "number" &&
				this.execState.accumulator < 0) ||
			(typeof this.execState.accumulator == "string" &&
				this.execState.accumulator.length > 1)
		) {
			throw new Error("Fail in execute#validate!");
		}
	}
}
