import { RamCommand } from "src/logic/commands";

export class RamState {
	accumulator: number | string;
	memory: (number | string)[];
	line: number;
	input: string;
	inputAt: number;
	output: string;
	done: boolean;
}
export class RAM {
	commands: RamCommand[];
	stepCount: number;
	state: RamState;
	constructor(commands: RamCommand[], input: string) {
		this.commands = commands;
		this.reset();
		this.state.input = input;
	}

	reset(): void {
		let input = "";
		if (this.state) {
			input = this.state.input;
		}
		this.state = {
			accumulator: "",
			input: input,
			inputAt: 0,
			line: 1,
			memory: [],
			output: "",
			done: false
		};
		this.stepCount = 0;
	}

	execLine(): void {
		if (this.state.done) {
			return;
		}
		const prevLine = this.state.line;
		const command = this.commands[this.state.line - 1];
		command.execute(this.state);
		this.stepCount++;
		this.validate();
		if (this.state.line == prevLine && !this.state.done) {
			// regular command, execution didn't jump around
			this.state.line++;
		}
	}

	validate(): void {
		if (
			this.state.line < 1 ||
			this.state.line > this.commands.length ||
			(typeof this.state.accumulator == "number" &&
				this.state.accumulator < 0) ||
			(typeof this.state.accumulator == "string" &&
				this.state.accumulator.length > 1)
		) {
			throw new Error("Fail in execute#validate!");
		}
	}
}
