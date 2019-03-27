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
	};

	constructor(props: {}) {
		super(props);
		this.state = { memory: [""] };
	}

	script = React.createRef<HTMLTextAreaElement>();
	input = React.createRef<HTMLInputElement>();
	output = React.createRef<HTMLDivElement>();
	ram: RAM;

	runAndDisplayOutput = (event: React.FormEvent) => {
		event.preventDefault();
		if (!this.ram || this.ram.state.done) {
			this.loadRAM();
		}
		if (this.ram && this.ram.canExecuteLine()) {
			this.ram.execFull();
			this.updateOutput();
		}
	};

	executeOneStep = () => {
		if (!this.ram) {
			this.loadRAM();
		}
		if (this.ram && this.ram.canExecuteLine()) {
			this.ram.execLine();
			this.updateOutput();
		}
	};

	loadRAM = () => {
		const script = this.script.current;
		const input = this.input.current;
		if (script && input) {
			const program = parseScript(script.value);
			if (isCommandArray(program)) {
				script.classList.remove("error");
				this.ram = new RAM(program, input.value);
			} else {
				script.classList.add("error");
				console.error(program);
			}
		}
		this.updateOutput();
	};

	updateOutput = () => {
		if (this.ram && this.ram.commands.length > 0) {
			this.output.current!.innerHTML = JSON.stringify({
				acc: this.ram.state.accumulator,
				step: this.ram.stepCount,
				line: this.ram.state.line,
				input: this.ram.state.input,
				inputAt: this.ram.state.inputAt,
				output: this.ram.state.output,
				done: this.ram.state.done
			});
			this.setState({ memory: this.ram.state.memory });
		} else {
			this.output.current!.innerHTML = "";
			this.setState({ memory: [""] });
		}
	};

	public render() {
		return (
			<div className="App">
				<header className="App-header">
					<h1 className="App-title">RAM Simulator</h1>
				</header>
				<div className="body">
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
						placeholder={`// enter your RAM program here
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
					<form id="simulator" onSubmit={this.runAndDisplayOutput}>
						<input
							ref={this.input}
							className="code"
							spellCheck={false}
							autoCapitalize="off"
							autoCorrect="off"
							placeholder="010110#"
						/>
						<button type="submit">Execute full script</button>
						<button type="button" onClick={this.executeOneStep}>
							Execute one step
						</button>
						<button type="button" onClick={this.loadRAM}>
							Load/Reset RAM
						</button>
					</form>
					<div id="output" ref={this.output} />

					<Memory memory={this.state.memory} />
				</div>
				<Footer />
			</div>
		);
	}
}

export default App;
