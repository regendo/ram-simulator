import * as React from "react";
import "./App.css";
import { Footer } from "./Footer";
import { parseScript } from "./logic/parser";
import { isCommandArray } from "./logic/run";
import { RAM } from "./logic/ram";
import { Memory } from "./Memory";

class App extends React.Component {
	state: {
		memory: (string | number)[];
		ram: RAM | undefined;
	};

	constructor(props: {}) {
		super(props);
		this.state = { memory: ["", "", "", ""], ram: undefined };
	}

	callbackToEditMemory = (idx: number, elem: string) => {
		// input value is always a string
		let value: string | number = Number.parseInt(elem);
		if (Number.isNaN(value)) {
			value = elem;
		}

		const memory = this.state.memory;
		memory[idx] = value;
		console.table(this.state.memory);
		console.table(memory);
		this.setState({ memory: memory });
	};

	script = React.createRef<HTMLTextAreaElement>();
	input = React.createRef<HTMLInputElement>();
	output = React.createRef<HTMLDivElement>();

	runAndDisplayOutput = () => {
		if (!this.state.ram || this.state.ram.state.done) {
			return;
		}
		while (this.state.ram && this.state.ram.canExecuteLine()) {
			this.executeOneStep();
		}
	};

	executeOneStep = () => {
		if (!this.state.ram) {
			return;
		}
		if (this.state.ram && this.state.ram.canExecuteLine()) {
			this.state.ram.execLine();
			this.updateOutput();
		}
	};

	toggleDisplayedButtons = () => {
		document
			.querySelectorAll("button.exec")
			.forEach((elem) => elem.classList.toggle("hidden"));
		document
			.querySelectorAll("button.unlock")
			.forEach((elem) => elem.classList.toggle("hidden"));
		document
			.querySelectorAll("button.lock")
			.forEach((elem) => elem.classList.toggle("hidden"));
		this.script.current!.disabled = !this.script.current!.disabled;
		this.input.current!.disabled = !this.input.current!.disabled;
	};

	loadRAM = (event: React.FormEvent) => {
		event.preventDefault();
		const script = this.script.current;
		const input = this.input.current;
		if (script && input) {
			const program = parseScript(script.value);
			if (isCommandArray(program)) {
				script.classList.remove("error");
				this.setState({
					ram: new RAM(program, input.value, this.state.memory)
				});
				this.toggleDisplayedButtons();
			} else {
				script.classList.add("error");
				console.error(program);
			}
		}
		this.updateOutput();
	};

	unloadRAM = () => {
		if (this.state.ram) {
			this.state.ram.reset();
		}
		this.updateOutput(); // TODO: update memory in separate function
		this.setState((state, p) => {
			return { ...state, ram: undefined };
		}, this.updateOutput);
		this.toggleDisplayedButtons();
	};

	updateOutput = () => {
		if (this.state.ram && this.state.ram.commands.length > 0) {
			this.output.current!.innerHTML = JSON.stringify({
				acc: this.state.ram.state.accumulator,
				step: this.state.ram.stepCount,
				line: this.state.ram.state.line,
				input: this.state.ram.state.input,
				inputAt: this.state.ram.state.inputAt,
				output: this.state.ram.state.output,
				done: this.state.ram.state.done
			});
			this.setState({ memory: this.state.ram.state.memory });
		} else {
			this.output.current!.innerHTML = "";
		}
	};

	public render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">RAM Simulator</h1>
				</header>
				<div className="body">
					<div className="flex">
						<textarea
							id="script"
							form="simulator"
							autoCapitalize="none"
							autoComplete="off"
							autoFocus={true}
							cols={40}
							required
							spellCheck={false}
							ref={this.script}
							className="code"
							placeholder={`// enter your program here
						// program that inverts a binary number
						read
						if '0' then 5
						if '1' then 7
						goto 9        // end if other character
						write '1'
						goto 1
						write '0'
						goto 1
						end`}
						/>
						<div>
							<input
								ref={this.input}
								className="code"
								spellCheck={false}
								autoCapitalize="off"
								autoCorrect="off"
								placeholder="010110#"
								form="simulator"
							/>
							<Memory
								memory={this.state.memory}
								allowEdit={!this.state.ram}
								callback={this.callbackToEditMemory}
							/>
						</div>
						<form id="simulator" onSubmit={this.loadRAM}>
							<button className="lock" type="submit">
								Lock & Load RAM
							</button>
							<button
								className="unlock hidden"
								type="button"
								onClick={this.unloadRAM}
							>
								Unlock & Reset RAM
							</button>
							<button
								className="exec hidden"
								type="button"
								onClick={this.runAndDisplayOutput}
							>
								Execute full script
							</button>
							<button
								className="exec hidden"
								type="button"
								onClick={this.executeOneStep}
							>
								Execute one step
							</button>
						</form>
					</div>
					<div id="output" ref={this.output} />
				</div>
				<Footer />
			</div>
		);
	}
}

export default App;
