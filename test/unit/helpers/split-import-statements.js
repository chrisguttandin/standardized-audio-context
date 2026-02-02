import { beforeEach, describe, expect, it } from 'vitest';
import { splitImportStatements } from '../../../src/helpers/split-import-statements';

describe('splitImportStatements()', () => {
    let url;

    beforeEach(() => {
        url = 'https://example.com/path';
    });

    describe('with a source that contains no import statement', () => {
        it('should not split anything', () => {
            const source = 'const value = 0;';

            expect(splitImportStatements(source, url)).to.deep.equal(['', source]);
        });
    });

    describe('with a source that contains an anonymous import statement', () => {
        it('should split the import statement', () => {
            const source = "import './something' const value = 0;";

            expect(splitImportStatements(source, url)).to.deep.equal(["import 'https://example.com/something'", 'const value = 0;']);
        });
    });

    describe('with a source that contains a default import statement', () => {
        it('should split the import statement', () => {
            const source = "import all from './something' const value = 0;";

            expect(splitImportStatements(source, url)).to.deep.equal([
                "import all from 'https://example.com/something'",
                'const value = 0;'
            ]);
        });
    });

    describe('with a source that contains a named import statement', () => {
        it('should split the import statement', () => {
            const source = "import { one } from './something' const value = 0;";

            expect(splitImportStatements(source, url)).to.deep.equal([
                "import { one } from 'https://example.com/something'",
                'const value = 0;'
            ]);
        });
    });

    describe('with a source that contains multiple named import statement', () => {
        it('should split the import statement', () => {
            const source = "import { one, two, three } from './something' const value = 0;";

            expect(splitImportStatements(source, url)).to.deep.equal([
                "import { one, two, three } from 'https://example.com/something'",
                'const value = 0;'
            ]);
        });
    });

    describe('with a source that contains a renamed import statement', () => {
        it('should split the import statement', () => {
            const source = "import { one as two } from './something' const value = 0;";

            expect(splitImportStatements(source, url)).to.deep.equal([
                "import { one as two } from 'https://example.com/something'",
                'const value = 0;'
            ]);
        });
    });

    describe('with a source that contains multiple renamed import statement', () => {
        it('should split the import statement', () => {
            const source = "import { one as two, two as three } from './something' const value = 0;";

            expect(splitImportStatements(source, url)).to.deep.equal([
                "import { one as two, two as three } from 'https://example.com/something'",
                'const value = 0;'
            ]);
        });
    });

    describe('with a source that contains a namespace import statement', () => {
        it('should split the import statement', () => {
            const source = "import * as mdl from './something' const value = 0;";

            expect(splitImportStatements(source, url)).to.deep.equal([
                "import * as mdl from 'https://example.com/something'",
                'const value = 0;'
            ]);
        });
    });

    describe('with a source that contains a default and a namespace import statement', () => {
        it('should split the import statement', () => {
            const source = "import all, * as mdl from './something' const value = 0;";

            expect(splitImportStatements(source, url)).to.deep.equal([
                "import all, * as mdl from 'https://example.com/something'",
                'const value = 0;'
            ]);
        });
    });

    describe('with a source that contains a default and a named import statement', () => {
        it('should split the import statement', () => {
            const source = "import all, { one } from './something' const value = 0;";

            expect(splitImportStatements(source, url)).to.deep.equal([
                "import all, { one } from 'https://example.com/something'",
                'const value = 0;'
            ]);
        });
    });

    describe('with a source that contains many different import statements', () => {
        it('should split the import statement', () => {
            const source = `import './something'
                import all from './something';
            import {
                one
            } from './something';import { one, two, three } from './something'
            import {one as two} from './something'

            import{ one as two, two as three } from './something'
            import * as mdl from './something';import all, * as mdl from './something'
            import all, { one } from './something' const value = 0;`;

            expect(splitImportStatements(source, url)).to.deep.equal([
                `import 'https://example.com/something';import all from 'https://example.com/something';import {
                one
            } from 'https://example.com/something';import { one, two, three } from 'https://example.com/something';import {one as two} from 'https://example.com/something';import{ one as two, two as three } from 'https://example.com/something';import * as mdl from 'https://example.com/something';import all, * as mdl from 'https://example.com/something';import all, { one } from 'https://example.com/something'`,
                'const value = 0;'
            ]);
        });
    });
});
