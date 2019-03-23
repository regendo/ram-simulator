import { RamCommand } from "./commands";

/**
 * Parses a text script that describes a RAM program into a list of executeable RAM commands.
 * @param script RAM program in text form.
 * @returns script List of commands, or list of errors if some lines could not be matched.
 */
export function parseScript(script: string): RamCommand[] | Error[] {
	const lines = script.split("\n").map(parseElem);
	if (lines.some((e) => e instanceof Error)) {
		return lines.filter((e): e is Error => e instanceof Error);
	}
	return lines.filter((e): e is RamCommand => e instanceof RamCommand);
}

/**
 * Parses a line that describes a RAM command into that executeable command.
 *
 * This function ignores comments preceded by `//` and ignores excessive whitespace.
 * @param elem
 * @returns The executeable command if it can be constructed.
 * @returns `null` if the line does not contain a command.
 * @returns An error if the lines contains _something_ that is likely intended as a command but doesn't match any known commands. (Likely caused by a typo or a syntax error on the user's side.)
 */
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
