/**
 * Read a binary number and parse it into a decimal number.
 *
 * @param input Binary number to parse, terminated by '#'.
 * @returns Parsed number at memory location 1.
 */
export const script = `
dload 0
store 1
read // :read
if '#' then 15 // goto :end
store 2
load 1
add 1
store 1
load 2
if '0' then 3 // goto :read
dload 1
add 1
store 1
goto 3 // goto :read
end // :end
`;
