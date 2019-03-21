export class ParseHelper {
	static int(word: string | number): number | false {
		if (typeof word === "number" && word >= 0) {
			return word;
		}
		return false;
	}

	static char(word: string | number) {
		if (typeof word === "string" && word.length < 2) {
			return word;
		}
		return false;
	}

	static digit(word: string | number): number | false {
		if (typeof word === "number" && word >= 0 && word < 10) {
			return word;
		}
		return false;
	}

	static match(
		words: (string | number)[],
		pattern: (
			| string
			| ((word: string | number) => number | false)
			| ((word: string | number) => string | false))[]
	) {
		if (words.length !== pattern.length) {
			return false;
		}
		const matches = [];
		const zip = pattern.map((p, idx) => {
			return { pattern: p, word: words[idx] };
		});
		for (let pair of zip) {
			if (typeof pair.pattern === "string") {
				const r = new RegExp(`^${pair.pattern}$`, "i");
				if (typeof pair.word === "string" && pair.word.match(r)) {
					continue;
				} else {
					return false;
				}
			} else {
				const match = pair.pattern.call(this, pair.word);
				if (match === false) {
					return false;
				} else {
					matches.push(pair.word);
				}
			}
		}
		return matches;
	}
}
