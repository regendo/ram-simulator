export class ParseHelper {
	// TODO: type for valid memory indices and lines (integer >= 1)
	/**
	 * Matches a non-negative number (>= 0).
	 * @param word Input to match.
	 * @returns Matched number, or `false` if the input didn't match.
	 */
	static int(word: string | number): number | false {
		if (typeof word === "number" && word >= 0) {
			return word;
		}
		return false;
	}

	/**
	 * Matches a single character (an empty or 1-length string).
	 * @param word Input to match.
	 * @returns Matched character, or `false` if the input didn't match.
	 */
	static char(word: string | number): string | false {
		// TODO: empty strings aren't really characters. Do we even have those? _Can_ we even have those, with how we split our input into words?
		if (typeof word === "string" && word.length < 2) {
			return word;
		}
		return false;
	}

	/**
	 * Matches a single digit (the numbers 0-9).
	 * @param word Input to match.
	 * @returns Matched digit, or `false` if the input didn't match.
	 */
	static digit(word: string | number): number | false {
		if (typeof word === "number" && word >= 0 && word < 10) {
			return word;
		}
		return false;
	}

	/**
	 * Try to match input to a supplied pattern of strings and ParseHelper functions.
	 *
	 * Each pair of input word and pattern will be matched in order. If any match fails, `false` is returned.
	 * - A string pattern is matched literally and has to match the whole string but case is ignored. (The string pattern `"hello"` matches the input word `"Hello"` but not the input word `"Hello!"` because that contains an additional character.)
	 * - A function pattern is matched by invoking that function with the input as parameter.
	 *
	 * Only the inputs that match a function are returned. String matches are intended just for confirmation, not for retrieving values.
	 *
	 * Example:
	 *
	 * - The pattern `["hello", "user", ParseHelper.int]` matches the input `["Hello", "User", 53]` and returns `53`.
	 * - The pattern `["goodbye", "user", ParseHelper.digit]` doesn't match the input `["Goodbye", "User", 53]` (because 53 is an integer, not a digit) and returns `false`.
	 *
	 * @param words Input to match.
	 * @param pattern Pattern to match.
	 * @returns List of function matches, or `false` if the input didn't completely match the patterns.
	 */
	static match(
		words: (string | number)[],
		pattern: (
			| ((word: string | number) => number | false) // int, digit
			| ((word: string | number) => string | false) // char
			| string)[]
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
