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
				script.classList.remove("error");
				this.ram = new RAM(program, input.value);
				this.updateOutput();
			} else {
				script.classList.add("error");
				console.error(program);
			}
		}
	};

	updateOutput = () => {
		if (this.ram && this.ram.commands.length > 0) {
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
						read          // jump point :read
						if '#' then 5 // goto :end
						write
						goto 1        // loop back to :read
						end           // jump point :end`}
					/>
					<form id="simulator" onSubmit={this.runAndDisplayOutput}>
						<input ref={this.input} className="code" placeholder="010110#" />
						<button type="submit">Execute full script</button>
						<button type="button" onClick={this.executeOneStep}>
							Execute one step
						</button>
						<button type="button" onClick={this.loadRAM}>
							Load/Reset RAM
						</button>
					</form>
					<div id="output" ref={this.output} />
				</div>
				<Footer />
			</div>
		);
	}
}

export default App;
