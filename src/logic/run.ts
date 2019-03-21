import { RamCommand } from "./commands";
import { parseScript } from "./parser";
import { RAM } from "./ram";

function isCommandArray(ary: Error[] | RamCommand[]): ary is RamCommand[] {
	return (
		Array.isArray(ary) &&
		ary.every((elem: Error | RamCommand) => elem instanceof RamCommand)
	);
}

export function run(
	script: string,
	input: string = "",
	memory: (string | number)[] = []
) {
	const parsedScript = parseScript(script);
	if (isCommandArray(parsedScript)) {
		const ram = new RAM(parsedScript, input, memory);
		ram.execFull();
		console.table(ram.state);
	} else {
		console.log(parsedScript);
	}
}
