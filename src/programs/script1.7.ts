/**
 * Transform a decimal number into binary.
 *
 * @param number Decimal number >= 0 at memory location 1.
 * @returns Binary number on output.
 */
export const script = `
dload 1
store 2
dload 2
store 3
load 1
sub 2
if 0 then 12
load 2
mul 3
store 2
goto 5
load 2
sub 1
if 0 then 17
write '0'
goto 21
write '1'
load 1
sub 2
store 1
load 2
div 3
store 2
if 0 then 26
goto 12
write '#'
end
`;
