import * as React from "react";
import { TSLogo } from "./logos/TS";
import { GithubLogo } from "./logos/Github";
import { ReactLogo } from "./logos/React";

export class Footer extends React.Component {
	public render() {
		return (
			<footer>
				<p>
					Made with 💙 using
					<a href="https://typescriptlang.org">
						<TSLogo />
						Typescript
					</a>{" "}
					and
					<a href="https://reactjs.org">
						<ReactLogo />
						React
					</a>
					.
				</p>
				<p>
					Check it out on
					<a href="https://github.com/regendo/ram-simulator">
						<GithubLogo />
						github
					</a>
					!
				</p>
			</footer>
		);
	}
}
