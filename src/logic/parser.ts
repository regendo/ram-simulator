import { RamCommand, commands } from "./commands";

function parseScript(script: string): RamCommand[] | Error[] {
	const lines = script.split("\n").map(parseElem);
	if (lines.some((e) => e instanceof Error)) {
		return lines.filter((e): e is Error => e instanceof Error);
	}
	return lines.filter((e): e is RamCommand => e instanceof RamCommand);
}

function parseElem(elem: string): RamCommand | null | Error {
	// TODO: Implement me!
	if (Math.random() > 0.8) {
		return new Error();
	}
	if (Math.random() > 0.5) {
		return null;
	}
	return new commands.end();
}
