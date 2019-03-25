import * as React from "react";
import "./App.css";
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
		this.loadRAM();
		if (this.ram) {
			this.ram.execFull();
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
	};

	updateOutput = () => {
		if (this.ram) {
			this.output.current!.innerHTML = JSON.stringify(this.ram.state);
		}
	};

	public render() {
		return (
			<div className="App">
				<header className="App-header">
					<img src="logo.svg" className="App-logo" alt="logo" />
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
					<button type="submit">Execute</button>
				</form>
				<div id="output" ref={this.output} />
			</div>
		);
	}
}

export default App;
