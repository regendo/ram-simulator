import * as React from "react";

export class Footer extends React.Component {
	public render() {
		return (
			<footer>
				<p>
					This site was made using{" "}
					<a href="https://typescriptlang.org">Typescript</a> and
					<a href="https://reactjs.org">
						<img src="react2.svg" className="logo" alt="react" />
						React
					</a>
					.
				</p>
				<p>
					Check it out on
					<a href="https://github.com/regendo/ram-simulator">
						<img src="github.svg" alt="github" className="logo" />
						github
					</a>
					!
				</p>
			</footer>
		);
	}
}
