/**
 * Constants
 */

const CR = 0x0D;
const LF = 0x0A;

/**
 * Extracts text lines from a buffer, moving the remaining relevant data
 * to the beginning of the buffer
 *
 * @param {Buffer} buffer The buffer to be parsed
 * @param {number} size The amount of relevant bytes within the buffer
 * @param {string} encoding The encoding of the text within the buffer
 * @param {Array} lines Target array where extracted lines will be stored
 * @returns {number} Amount of bytes which are not part of any line
 */
function bufferToLines(buffer, size, encoding, lines) {
    const slice = buffer.slice(0, size);
    let remainder, lineEnd, lineStart = 0;
    while ((lineEnd = slice.indexOf(LF, lineStart)) >= 0) {
        lines.push(slice.toString(
            encoding,
            lineStart,
            (lineEnd > 0 && slice[lineEnd - 1] === CR) ? lineEnd - 1 : lineEnd
        ));
        lineStart = lineEnd + 1;
    }
    remainder = size - lineStart;
    if (remainder > 0 && lineStart > 0) {
        buffer.copy(buffer, 0, lineStart, size);
    }
    return remainder;
}

/**
 * Exports
 */

module.exports = bufferToLines;
