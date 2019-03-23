/**
 * Check if all parantheses in input are opened `(` and closed `)` correctly:
 * - Every paranthesis that is opened is also closed.
 * - Only parantheses that have actually be opened are being closed.
 *
 * @param input String to check, terminated by '#'.
 * @returns Truth value as 'T' or 'F' on output.
 */
export const script = `
// 1: Count of parantheses that are currently open
// 2: Value 1 to help with decrementing
dload 0
store 1
dload 1
store 2
read
if '#' then 19
if '(' then 10
if ')' then 14
goto 5
load 1
add 2
store 1
goto 5
load 1
if 0 then 21
sub 2
store 1
goto 5
load 1
if 0 then 23
write 'F'
goto 24
write 'T'
end
`;
