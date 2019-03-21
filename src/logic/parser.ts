import { RamCommand } from "./commands";

export function parseScript(script: string): RamCommand[] | Error[] {
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
		.split(/\s/)
		.filter((word) => word !== "")
		.map((word) => {
			const num = Number.parseInt(word);
			if (isNaN(num) || num < 0) {
				if (
					word.length === 3 &&
					(word[0] === "'" || word[0] === '"') &&
					word[0] === word[word.length - 1]
				) {
					return word.slice(1, -1);
				}
				return word;
			}
			return num;
		});
	if (words.length === 0) {
		return null;
	}
	const match = RamCommand.matchAndConstruct(words);
	if (match) {
		return match;
	}
	return new Error(`No command matches the line "${words.join(" ")}"!`);
}
