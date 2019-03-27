import * as React from "react";

export class Memory extends React.Component<{ memory: (string | number)[] }> {
	constructor(props: { memory: (string | number)[] }) {
		super(props);
	}

	public render() {
		return (
			<ol>
				{// first element of memory is never used
				this.props.memory.slice(1).map((elem, idx) => {
					return <li key={idx + 1}>{elem}</li>;
				})}
			</ol>
		);
	}
}
