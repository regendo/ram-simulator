/**
 * Count occurences of '1' and check if it occurs more often than it doesn't. (Half or more characters are '1'.)
 *
 * @param input String to check, terminated by '#'.
 * @returns Truth value as 'T' or 'F' on output.
 */
export const script = `
// 1: Count '1's
// 2: Count for everything else
dload 0
store 1
store 2
read // :read
if '#' then 15 // goto :compare
if '1' then 11 // goto :increment
dload 1
add 2
store 2
goto 4 // goto :read
dload 1 // :increment
add 1
store 1
goto 4 // goto :read
load 2 // :compare
sub 1
if 0 then 20 // goto :success
write 'F'
goto 21 // goto :end
write 'T' // :success
end
`;
