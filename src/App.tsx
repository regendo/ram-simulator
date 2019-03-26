import * as React from "react";
import "./App.css";
import { Footer } from "./Footer";
import { parseScript } from "./logic/parser";
import { isCommandArray } from "./logic/run";
import { RAM } from "./logic/ram";

class App extends React.Component {
	script = React.createRef<HTMLTextAreaElement>();
	input = React.createRef<HTMLInputElement>();
	output = React.createRef<HTMLDivElement>();
	ram: RAM;

	runAndDisplayOutput = (event: React.FormEvent) => {
		event.preventDefault();
		if (!this.ram || this.ram.state.done) {
			this.loadRAM();
		}
		if (this.ram) {
			this.ram.execFull();
			this.updateOutput();
		}
	};

	executeOneStep = () => {
		if (!this.ram) {
			this.loadRAM();
		}
		if (this.ram) {
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
				this.ram = new RAM(program, input.value);
			} else {
				console.error(program);
			}
		}
		this.updateOutput();
	};

	updateOutput = () => {
		if (this.ram) {
			this.output.current!.innerHTML = JSON.stringify(this.ram.state);
		} else {
			this.output.current!.innerHTML = "";
		}
	};

	public render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src="react.svg" className="App-logo" alt="logo" />
					<h1 className="App-title">RAM simulator in Typescript and React</h1>
				</header>
				<form onSubmit={this.runAndDisplayOutput}>
					<textarea
						id="script"
						autoCapitalize="none"
						autoComplete="off"
						required
						spellCheck={false}
						ref={this.script}
					/>
					<input ref={this.input} />
					<button type="submit">Execute full script</button>
					<button type="button" onClick={this.executeOneStep}>
						Execute one step
					</button>
					<button type="button" onClick={this.loadRAM}>
						Load/Reset RAM
					</button>
				</form>
				<div id="output" ref={this.output} />
				<Footer />
			</div>
		);
	}
}

export default App;
