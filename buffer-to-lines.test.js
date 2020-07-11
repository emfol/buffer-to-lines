const bufferToLines = require('./buffer-to-lines');

describe('bufferToLines', () => {

    it('should parse complete lines', () => {
        let buffer = Buffer.allocUnsafe(256);
        let string = 'The essence of all beautiful art,\nall great art,\nis gratitude.\n';
        let size = buffer.write(string, 'utf8');
        let lines = [];

        expect(size).toBe(string.length);
        expect(bufferToLines(buffer, size, 'utf8', lines)).toBe(0);
        expect(lines).toStrictEqual([
            'The essence of all beautiful art,',
            'all great art,',
            'is gratitude.'
        ]);
    });

    it('should parse incomplete lines', () => {
        let buffer = Buffer.allocUnsafe(256);
        let string = 'The essence of all beautiful art,\nall great art,\nis gratitude.\n - Friedrich Nietzsche';
        let size = buffer.write(string, 'utf8');
        let lines = [];

        expect(size).toBe(string.length);
        string = ' - Friedrich Nietzsche';
        expect(bufferToLines(buffer, size, 'utf8', lines)).toBe(string.length);
        expect(lines).toStrictEqual([
            'The essence of all beautiful art,',
            'all great art,',
            'is gratitude.'
        ]);
        expect(buffer.toString('utf8', 0, string.length)).toBe(string);
    });

    it('should parse incomplete lines with CRLF line separators', () => {
        let buffer = Buffer.allocUnsafe(256);
        let string = 'The essence of all beautiful art,\r\nall great art,\r\nis gratitude.\r\n - Friedrich Nietzsche';
        let size = buffer.write(string, 'utf8');
        let lines = [];

        expect(size).toBe(string.length);
        string = ' - Friedrich Nietzsche';
        expect(bufferToLines(buffer, size, 'utf8', lines)).toBe(string.length);
        expect(lines).toStrictEqual([
            'The essence of all beautiful art,',
            'all great art,',
            'is gratitude.'
        ]);
        expect(buffer.toString('utf8', 0, string.length)).toBe(string);
    });

    it('should parse empty and incomplete lines', () => {
        let buffer = Buffer.allocUnsafe(256);
        let string = '\nThe essence of all beautiful art,\nall great art,\nis gratitude.\n - Friedrich Nietzsche';
        let size = buffer.write(string, 'utf8');
        let lines = [];

        expect(size).toBe(string.length);
        string = ' - Friedrich Nietzsche';
        expect(bufferToLines(buffer, size, 'utf8', lines)).toBe(string.length);
        expect(lines).toStrictEqual([
            '',
            'The essence of all beautiful art,',
            'all great art,',
            'is gratitude.'
        ]);
        expect(buffer.toString('utf8', 0, string.length)).toBe(string);
    });

    it('should parse empty and incomplete lines with CRLF line separators', () => {
        let buffer = Buffer.allocUnsafe(256);
        let string = '\r\nThe essence of all beautiful art,\r\nall great art,\r\nis gratitude.\r\n - Friedrich Nietzsche';
        let size = buffer.write(string, 'utf8');
        let lines = [];

        expect(size).toBe(string.length);
        string = ' - Friedrich Nietzsche';
        expect(bufferToLines(buffer, size, 'utf8', lines)).toBe(string.length);
        expect(lines).toStrictEqual([
            '',
            'The essence of all beautiful art,',
            'all great art,',
            'is gratitude.'
        ]);
        expect(buffer.toString('utf8', 0, string.length)).toBe(string);
    });

    it('should parse dynamic buffers', () => {
        let buffer = Buffer.allocUnsafe(256);
        let string = 'The essence of all beautiful art,\nall great art,\nis gratitude.\n - Friedrich Nietzsche';
        let author = ' is the author!\n';
        let size = buffer.write(string, 'utf8');
        let lines = [];

        expect(size).toBe(string.length);
        string = ' - Friedrich Nietzsche';
        expect(bufferToLines(buffer, size, 'utf8', lines)).toBe(string.length);
        expect(lines).toStrictEqual([
            'The essence of all beautiful art,',
            'all great art,',
            'is gratitude.'
        ]);
        expect(buffer.toString('utf8', 0, string.length)).toBe(string);

        // reset lines
        lines = [];

        expect(bufferToLines(buffer, string.length, 'utf8', lines)).toBe(string.length);
        expect(lines).toStrictEqual([]);
        expect(buffer.slice(string.length).write(author, 'utf8')).toBe(author.length);
        expect(bufferToLines(buffer, string.length + author.length, 'utf8', lines)).toBe(0);
        expect(lines).toStrictEqual([
            ' - Friedrich Nietzsche is the author!'
        ]);
    });

    it('should support completely empty lines', () => {
        let buffer = Buffer.allocUnsafe(256);
        let string = '\n\nThe end...';
        let remainder = 'The end...';
        let size = buffer.write(string, 'utf8');
        let lines = [];

        expect(size).toBe(string.length);
        expect(bufferToLines(buffer, size, 'utf8', lines)).toBe(remainder.length);
        expect(lines).toStrictEqual([
            '',
            ''
        ]);
        expect(buffer.toString('utf8', 0, remainder.length)).toBe(remainder);
    });

    it('should support mixed line ending formats', () => {
        let buffer = Buffer.allocUnsafe(256);
        let string = '\n\r\nFoo!\nBar!\r\nThe end...';
        let remainder = 'The end...';
        let size = buffer.write(string, 'utf8');
        let lines = [];

        expect(size).toBe(string.length);
        expect(bufferToLines(buffer, size, 'utf8', lines)).toBe(remainder.length);
        expect(lines).toStrictEqual([
            '',
            '',
            'Foo!',
            'Bar!',
        ]);
        expect(buffer.toString('utf8', 0, remainder.length)).toBe(remainder);
    });

});
