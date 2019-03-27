import * as React from "react";

export class Memory extends React.Component<{
	memory: (string | number)[];
	allowEdit: boolean;
	callback: (idx: number, elem: string | number) => void;
}> {
	constructor(props: {
		memory: (string | number)[];
		allowEdit: boolean;
		callback: (idx: number, elem: string | number) => void;
	}) {
		super(props);
	}

	valueEditor = (idx: number, elem: number | string) => {
		if (!this.props.allowEdit) {
			return elem;
		}
		return (
			<input
				key={`memory-{idx}`}
				onChange={(event) => this.props.callback(idx, event.target.value)}
				value={elem}
				placeholder="(empty)"
			/>
		);
	};

	public render() {
		return (
			<ol className="memory">
				<li className="header">
					<h3>Memory</h3>
				</li>
				{// first element of memory is never used
				this.props.memory.slice(1).map((elem, i) => {
					const idx = i + 1;
					return (
						<li key={idx}>
							<p className="memoryIndex">{idx}</p>
							<p className="memoryValue">{this.valueEditor(idx, elem)}</p>
						</li>
					);
				})}
			</ol>
		);
	}
}
