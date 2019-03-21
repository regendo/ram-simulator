import { RamCommand, commands } from "./commands";

function parseScript(script: string): RamCommand[] | Error[] {
	const lines = script.split("\n").map(parseElem);
	if (lines.some((e) => e instanceof Error)) {
		return lines.filter((e): e is Error => e instanceof Error);
	}
	return lines.filter((e): e is RamCommand => e instanceof RamCommand);
}

function parseElem(elem: string): RamCommand | null | Error {
	// normalize input: Strip off comments and whitespace
	// and split into individual commands/arguments
	const words: (string | number)[] = elem
		.split("//")[0]
		.split(" ")
		.filter((word) => word !== "")
		.map((word) => {
			const num = Number.parseInt(word);
			if (num === NaN || num < 0) {
				return word;
			}
			return num;
		});
	// TODO: Implement the rest of me!
	if (Math.random() > 0.8) {
		return new Error();
	}
	if (Math.random() > 0.5) {
		return null;
	}
	return new commands.end();
}
