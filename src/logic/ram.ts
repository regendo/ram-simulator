import { RamCommand } from "src/logic/commands";

/**
 * State of a RAM that commands have access to.
 */
export class RamState {
	accumulator: number | string;
	memory: (number | string)[];
	line: number;
	input: string;
	inputAt: number;
	output: string;
	done: boolean;
}
/**
 * Simulated RAM that can execute supplied commands step-by-step or all at once.
 */
export class RAM {
	commands: RamCommand[];
	stepCount: number;
	state: RamState;
	initialMemory: (string | number)[];
	/**
	 * Creates an instance of RAM.
	 * @param commands List of commands to execute.
	 * @param [input] (Optional.) Input string.
	 * @param [memory] (Optional.) Pre-initialized memory, in case your RAM program reads input from memory instead of from the input string. Note the 0th memory address remains unused.
	 */
	constructor(
		commands: RamCommand[],
		input: string = "",
		memory: (string | number)[] = []
	) {
		this.commands = commands;
		this.initialMemory = [...memory];
		this.reset();
		this.state.input = input;
	}

	/**
	 * Resets the RAM to a clean state so that the program can be re-run from the start.
	 */
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
			memory: [...this.initialMemory],
			output: "",
			done: false
		};
		this.stepCount = 0;
	}

	canExecuteLine(): boolean {
		return !this.state.done && !!this.commands[this.state.line - 1];
	}

	/**
	 * Run the program until the end.
	 */
	execFull(): void {
		while (this.canExecuteLine()) {
			this.execLine();
		}
	}

	/**
	 * Run just the next line of the program.
	 */
	execLine(): void {
		if (!this.canExecuteLine()) {
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
