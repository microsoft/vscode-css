import { describe, it } from 'node:test';
import assert from 'node:assert';
import testGrammar from '../testing-util/test.mjs';

describe('CSS grammar', function () {
	it('parses the grammar', function () {
		assert.ok(testGrammar.grammar);
		assert.equal(testGrammar.grammar._grammar.scopeName, 'source.css');
	});

	describe('selectors', function () {
		it('tokenizes type selectors', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('p {}').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'p' });
		});

		it('tokenizes the universal selector', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('*').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css'], value: '*' });
		});

		it('tokenises combinators', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a > b + * ~ :not(.nah)').tokens;
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css'], value: '>' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css'], value: '+' });
			assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css'], value: '~' });
		});

		it('highlights deprecated combinators', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('.sooo /deep/ >>>_.>>>').tokens;
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'invalid.deprecated.combinator.css'], value: '/deep/' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'invalid.deprecated.combinator.css'], value: '>>>' });
		});

		it('tokenizes complex selectors', function () {
			var lines, tokens;
			tokens = testGrammar.tokenizeLine('[disabled], [disabled] + p').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ["source.css", "meta.selector.css", "meta.attribute-selector.css", "punctuation.definition.entity.begin.bracket.square.css"], value: '[' });
			assert.deepStrictEqual(tokens[1], { scopes: ["source.css", "meta.selector.css", "meta.attribute-selector.css", "entity.other.attribute-name.css"], value: 'disabled' });
			assert.deepStrictEqual(tokens[2], { scopes: ["source.css", "meta.selector.css", "meta.attribute-selector.css", "punctuation.definition.entity.end.bracket.square.css"], value: ']' });
			assert.deepStrictEqual(tokens[3], { scopes: ["source.css", "meta.selector.css", "punctuation.separator.list.comma.css"], value: ',' });
			assert.deepStrictEqual(tokens[5], { scopes: ["source.css", "meta.selector.css", "meta.attribute-selector.css", "punctuation.definition.entity.begin.bracket.square.css"], value: '[' });
			assert.deepStrictEqual(tokens[6], { scopes: ["source.css", "meta.selector.css", "meta.attribute-selector.css", "entity.other.attribute-name.css"], value: 'disabled' });
			assert.deepStrictEqual(tokens[7], { scopes: ["source.css", "meta.selector.css", "meta.attribute-selector.css", "punctuation.definition.entity.end.bracket.square.css"], value: ']' });
			assert.deepStrictEqual(tokens[9], { scopes: ["source.css", "meta.selector.css", "keyword.operator.combinator.css"], value: '+' });
			assert.deepStrictEqual(tokens[11], { scopes: ["source.css", "meta.selector.css", "entity.name.tag.css"], value: 'p' });

			lines = testGrammar.tokenizeLines("[disabled]:not(:first-child)::before:hover\n  ~ div.object\n  + #id.thing:hover > strong ~ p::before,\na::last-of-type,/*Comment*/::selection > html[lang^=en-AU],\n*>em.i.ly[data-name|=\"Life\"] { }");
			assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
			assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'disabled' });
			assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
			assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'not' });
			assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
			assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
			assert.deepStrictEqual(lines[0][7], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'first-child' });
			assert.deepStrictEqual(lines[0][8], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
			assert.deepStrictEqual(lines[0][9], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css'], value: '::' });
			assert.deepStrictEqual(lines[0][10], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'before' });
			assert.deepStrictEqual(lines[0][11], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
			assert.deepStrictEqual(lines[0][12], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'hover' });
			assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css'], value: '~' });
			assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'div' });
			assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
			assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'object' });
			assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css'], value: '+' });
			assert.deepStrictEqual(lines[2][3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css'], value: '#' });
			assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css'], value: 'id' });
			assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
			assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'thing' });
			assert.deepStrictEqual(lines[2][7], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
			assert.deepStrictEqual(lines[2][8], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'hover' });
			assert.deepStrictEqual(lines[2][10], { scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css'], value: '>' });
			assert.deepStrictEqual(lines[2][12], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'strong' });
			assert.deepStrictEqual(lines[2][14], { scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css'], value: '~' });
			assert.deepStrictEqual(lines[2][16], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'p' });
			assert.deepStrictEqual(lines[2][17], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css'], value: '::' });
			assert.deepStrictEqual(lines[2][18], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'before' });
			assert.deepStrictEqual(lines[2][19], { scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.list.comma.css'], value: ',' });
			assert.deepStrictEqual(lines[3][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
			assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
			assert.deepStrictEqual(lines[3][2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'invalid.illegal.colon.css'], value: ':' });
			assert.deepStrictEqual(lines[3][3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'last-of-type' });
			assert.deepStrictEqual(lines[3][4], { scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.list.comma.css'], value: ',' });
			assert.deepStrictEqual(lines[3][5], { scopes: ['source.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
			assert.deepStrictEqual(lines[3][6], { scopes: ['source.css', 'comment.block.css'], value: 'Comment' });
			assert.deepStrictEqual(lines[3][7], { scopes: ['source.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
			assert.deepStrictEqual(lines[3][8], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css'], value: '::' });
			assert.deepStrictEqual(lines[3][9], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'selection' });
			assert.deepStrictEqual(lines[3][11], { scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css'], value: '>' });
			assert.deepStrictEqual(lines[3][13], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'html' });
			assert.deepStrictEqual(lines[3][14], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
			assert.deepStrictEqual(lines[3][15], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'lang' });
			assert.deepStrictEqual(lines[3][16], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '^=' });
			assert.deepStrictEqual(lines[3][17], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css'], value: 'en-AU' });
			assert.deepStrictEqual(lines[3][18], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			assert.deepStrictEqual(lines[3][19], { scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.list.comma.css'], value: ',' });
			assert.deepStrictEqual(lines[4][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css'], value: '*' });
			assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css'], value: '>' });
			assert.deepStrictEqual(lines[4][2], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'em' });
			assert.deepStrictEqual(lines[4][3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
			assert.deepStrictEqual(lines[4][4], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'i' });
			assert.deepStrictEqual(lines[4][5], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
			assert.deepStrictEqual(lines[4][6], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'ly' });
			assert.deepStrictEqual(lines[4][7], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
			assert.deepStrictEqual(lines[4][8], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'data-name' });
			assert.deepStrictEqual(lines[4][9], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '|=' });
			assert.deepStrictEqual(lines[4][10], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
			assert.deepStrictEqual(lines[4][11], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css'], value: 'Life' });
			assert.deepStrictEqual(lines[4][12], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
			assert.deepStrictEqual(lines[4][13], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			assert.deepStrictEqual(lines[4][15], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			assert.deepStrictEqual(lines[4][17], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
		});

		describe('custom elements (as type selectors)', function () {
			it('only tokenizes identifiers beginning with [a-z]', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('pearl-1941 1941-pearl -pearl-1941').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css'], value: 'pearl-1941' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css'], value: ' 1941-pearl -pearl-1941' });
			});

			it('tokenizes custom elements containing non-ASCII letters', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('pokémon-ピカチュウ').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css'], value: 'pokémon-ピカチュウ' });
			});

			it('does not tokenize identifiers containing [A-Z]', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('Basecamp-schedule basecamp-Schedule').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css'], value: 'Basecamp-schedule basecamp-Schedule' });
			});

			it('does not tokenize identifiers containing no hyphens', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('halo_night').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css'], value: 'halo_night' });
			});

			it('does not tokenise identifiers following an @ symbol', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('@some-weird-new-feature').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css', 'punctuation.definition.keyword.css'], value: '@' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css'], value: 'some-weird-new-feature' });
			});

			it('does not tokenise identifiers in unfamiliar functions', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('some-edgy-new-function()').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css'], value: 'some-edgy-new-function(' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css'], value: ')' });
			});
		});

		describe('attribute selectors', function () {
			it('tokenizes attribute selectors without values', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('[title]').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'title' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('tokenizes attribute selectors with identifier values', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('[hreflang|=fr]').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'hreflang' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '|=' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css'], value: 'fr' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('tokenizes attribute selectors with string values', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('[href^="http://www.w3.org/"]').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'href' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '^=' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css'], value: 'http://www.w3.org/' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('tokenizes CSS qualified attribute names with wildcard prefix', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('[*|title]').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css'], value: '*' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'title' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('tokenizes CSS qualified attribute names with namespace prefix', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('[marvel|origin=radiation]').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css'], value: 'marvel' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'origin' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '=' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css'], value: 'radiation' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('tokenizes CSS qualified attribute names without namespace prefix', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('[|data-hp="75"]').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'data-hp' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '=' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css'], value: '75' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('tokenises compound ID/attribute selectors', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('#div[id="0"]{ }').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css'], value: '#' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css'], value: 'div' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'id' });
				assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });

				tokens = testGrammar.tokenizeLine('.bar#div[id="0"]').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'bar' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css'], value: '#' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css'], value: 'div' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'id' });
			});

			it('tokenises compound class/attribute selectors', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('.div[id="0"]{ }').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'div' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'id' });
				assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });

				tokens = testGrammar.tokenizeLine('#bar.div[id]').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css'], value: '#' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css'], value: 'bar' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'div' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'id' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('allows whitespace to be inserted between tokens', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('span[  er|lang  |=   "%%"   ]').tokens;
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: '  ' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css'], value: 'er' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'lang' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: '  ' });
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '|=' });
				assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: '   ' });
				assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
				assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css'], value: '%%' });
				assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
				assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: '   ' });
				assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('tokenises escape sequences inside attribute selectors', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('a[name\\[0\\]="value"]').tokens;
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'name' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css', 'constant.character.escape.css'], value: '\\[' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: '0' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css', 'constant.character.escape.css'], value: '\\]' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '=' });
				assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('tokenises escape sequences inside namespace prefixes', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('a[name\\ space|Get\\ It\\?="kek"]').tokens;
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css'], value: 'name' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css', 'constant.character.escape.css'], value: '\\ ' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css'], value: 'space' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'Get' });
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css', 'constant.character.escape.css'], value: '\\ ' });
				assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'It' });
				assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css', 'constant.character.escape.css'], value: '\\?' });
				assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '=' });
				assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('tokenises comments inside attribute selectors', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('span[/*]*/lang]').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'span' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css'], value: ']' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'lang' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('tokenises quoted strings in attribute selectors', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('a[href^="#"] a[href^= "#"] a[href^="#" ]').tokens;
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css'], value: '#' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
				assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '^=' });
				assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: ' ' });
				assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
				assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css'], value: '#' });
				assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
				assert.deepStrictEqual(tokens[23], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
				assert.deepStrictEqual(tokens[24], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css'], value: '#' });
				assert.deepStrictEqual(tokens[25], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
				assert.deepStrictEqual(tokens[26], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: ' ' });
				assert.deepStrictEqual(tokens[27], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });

				tokens = testGrammar.tokenizeLine("a[href^='#'] a[href^=  '#'] a[href^='#' ]").tokens;
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css'], value: "'" });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css'], value: '#' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css'], value: "'" });
				assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '^=' });
				assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: '  ' });
				assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css'], value: "'" });
				assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css'], value: '#' });
				assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css'], value: "'" });
				assert.deepStrictEqual(tokens[23], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css'], value: "'" });
				assert.deepStrictEqual(tokens[24], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css'], value: '#' });
				assert.deepStrictEqual(tokens[25], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css'], value: "'" });
				assert.deepStrictEqual(tokens[26], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: ' ' });
				assert.deepStrictEqual(tokens[27], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('tokenises unquoted strings in attribute selectors', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('span[class~=Java]').tokens;
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '~=' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css'], value: 'Java' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });

				tokens = testGrammar.tokenizeLine('span[class^=  0xDEADCAFE=|~BEEFBABE  ]').tokens;
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '^=' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: '  ' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css'], value: '0xDEADCAFE=|~BEEFBABE' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: '  ' });
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('tokenises escape sequences in unquoted strings', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('a[name\\[0\\]=a\\BAD\\AF\\]a\\ i] {}').tokens;
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '=' });
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css'], value: 'a' });
				assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css', 'constant.character.escape.codepoint.css'], value: '\\BAD' });
				assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css', 'constant.character.escape.codepoint.css'], value: '\\AF' });
				assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css', 'constant.character.escape.css'], value: '\\]' });
				assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css'], value: 'a' });
				assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css', 'constant.character.escape.css'], value: '\\ ' });
				assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css'], value: 'i' });
				assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
				assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			});

			it('tokenises the ignore-case modifier at the end of a selector', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('a[attr=val i] a[attr="val" i] a[attr=\'val\'I] a[val^=  \'"\'i] a[attr= i] a[attr= i i]').tokens;
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'storage.modifier.ignore-case.css'], value: 'i' });
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
				assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: ' ' });
				assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'storage.modifier.ignore-case.css'], value: 'i' });
				assert.deepStrictEqual(tokens[26], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css'], value: "'" });
				assert.deepStrictEqual(tokens[27], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'storage.modifier.ignore-case.css'], value: 'I' });
				assert.deepStrictEqual(tokens[28], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
				assert.deepStrictEqual(tokens[34], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: '  ' });
				assert.deepStrictEqual(tokens[35], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css'], value: "'" });
				assert.deepStrictEqual(tokens[36], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css'], value: '"' });
				assert.deepStrictEqual(tokens[37], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css'], value: "'" });
				assert.deepStrictEqual(tokens[38], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'storage.modifier.ignore-case.css'], value: 'i' });
				assert.deepStrictEqual(tokens[39], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
				assert.deepStrictEqual(tokens[44], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '=' });
				assert.deepStrictEqual(tokens[45], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: ' ' });
				assert.deepStrictEqual(tokens[46], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css'], value: 'i' });
				assert.deepStrictEqual(tokens[47], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
				assert.deepStrictEqual(tokens[52], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '=' });
				assert.deepStrictEqual(tokens[53], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: ' ' });
				assert.deepStrictEqual(tokens[54], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css'], value: 'i' });
				assert.deepStrictEqual(tokens[55], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: ' ' });
				assert.deepStrictEqual(tokens[56], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'storage.modifier.ignore-case.css'], value: 'i' });
				assert.deepStrictEqual(tokens[57], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});

			it('tokenises attribute selectors spanning multiple lines', function () {
				var lines;
				lines = testGrammar.tokenizeLines("span[\n  \\x20{2}\n  ns|lang/**/\n  |=\n\"pt\"]");
				assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'span' });
				assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css'], value: '  ' });
				assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css'], value: 'ns' });
				assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(lines[2][3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'lang' });
				assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
				assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
				assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '|=' });
				assert.deepStrictEqual(lines[4][0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
				assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css'], value: 'pt' });
				assert.deepStrictEqual(lines[4][2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
				assert.deepStrictEqual(lines[4][3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });

				lines = testGrammar.tokenizeLines("span[/*===\n==|span[/*}\n====*/*|lang/*]=*/~=/*\"|\"*/\"en-AU\"/*\n |\n*/\ni]");
				assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
				assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css'], value: '===' });
				assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css'], value: '==|span[/*}' });
				assert.deepStrictEqual(lines[2][0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css'], value: '====' });
				assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
				assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css'], value: '*' });
				assert.deepStrictEqual(lines[2][3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'lang' });
				assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
				assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css'], value: ']=' });
				assert.deepStrictEqual(lines[2][7], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
				assert.deepStrictEqual(lines[2][8], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '~=' });
				assert.deepStrictEqual(lines[2][9], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
				assert.deepStrictEqual(lines[2][10], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css'], value: '"|"' });
				assert.deepStrictEqual(lines[2][11], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
				assert.deepStrictEqual(lines[2][12], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
				assert.deepStrictEqual(lines[2][13], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css'], value: 'en-AU' });
				assert.deepStrictEqual(lines[2][14], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
				assert.deepStrictEqual(lines[2][15], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
				assert.deepStrictEqual(lines[3][0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css'], value: ' |' });
				assert.deepStrictEqual(lines[4][0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
				assert.deepStrictEqual(lines[5][0], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'storage.modifier.ignore-case.css'], value: 'i' });
				assert.deepStrictEqual(lines[5][1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
			});
		});

		describe('class selectors', function () {
			it('tokenizes class selectors containing non-ASCII letters', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('.étendard').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'étendard' });

				tokens = testGrammar.tokenizeLine('.スポンサー').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'スポンサー' });
			});

			it('tokenizes a class selector consisting of two hypens', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('.--').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: '--' });
			});

			it('tokenizes class selectors consisting of one (valid) character', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('._').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: '_' });
			});

			it('tokenises class selectors starting with an escape sequence', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('.\\33\\44-model {').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'constant.character.escape.codepoint.css'], value: '\\33' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'constant.character.escape.codepoint.css'], value: '\\44' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: '-model' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			});

			it('tokenises class selectors ending with an escape sequence', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('.la\\{tex\\} {').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'la' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'constant.character.escape.css'], value: '\\{' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'tex' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'constant.character.escape.css'], value: '\\}' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			});

			it('marks a class invalid if it contains unescaped ASCII punctuation or symbols other than "-" and "_"', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('.B!W{').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css'], value: 'B!W' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			});

			it('marks a class invalid if it starts with ASCII digits ([0-9])', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('.666{').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css'], value: '666' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			});

			it('marks a class invalid if it starts with "-" followed by ASCII digits', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('.-911-{').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css'], value: '-911-' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			});

			it('marks a class invalid if it consists of only one hyphen', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('.-{').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css'], value: '-' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			});
		});

		describe('id selectors', function () {
			it('tokenizes id selectors consisting of ASCII letters', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('#unicorn').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css'], value: '#' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css'], value: 'unicorn' });
			});

			it('tokenizes id selectors containing non-ASCII letters', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('#洪荒之力').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css'], value: '#' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css'], value: '洪荒之力' });
			});

			it('tokenizes id selectors containing [0-9], "-", or "_"', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('#_zer0-day').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css'], value: '#' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css'], value: '_zer0-day' });
			});

			it('tokenizes id selectors beginning with two hyphens', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('#--d3bug--').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css'], value: '#' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css'], value: '--d3bug--' });
			});

			it('marks an id invalid if it contains ASCII punctuation or symbols other than "-" and "_"', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('#sort!{').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css'], value: '#' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css'], value: 'sort!' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			});

			it('marks an id invalid if it starts with ASCII digits ([0-9])', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('#666{').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css'], value: '#' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css'], value: '666' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			});

			it('marks an id invalid if it starts with "-" followed by ASCII digits', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('#-911-{').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css'], value: '#' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css'], value: '-911-' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			});

			it('marks an id invalid if it consists of one hyphen only', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('#-{').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css'], value: '#' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css'], value: '-' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			});

			it('tokenises ID selectors starting with an escape sequence', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('#\\33\\44-model {').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css'], value: '#' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'constant.character.escape.codepoint.css'], value: '\\33' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'constant.character.escape.codepoint.css'], value: '\\44' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css'], value: '-model' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			});

			it('tokenises ID selectors ending with an escape sequence', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('#la\\{tex\\} {').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css'], value: '#' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css'], value: 'la' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'constant.character.escape.css'], value: '\\{' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css'], value: 'tex' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'constant.character.escape.css'], value: '\\}' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			});
		});

		describe('namespace prefixes', function () {
			it('tokenises arbitrary namespace prefixes', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('foo|h1 { }').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.namespace-prefix.css'], value: 'foo' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'h1' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css'], value: ' ' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
			});

			it('tokenises anonymous namespace prefixes', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('*|abbr {}').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.namespace-prefix.css'], value: '*' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'abbr' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css'], value: ' ' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });

				tokens = testGrammar.tokenizeLine('*|* {}').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.namespace-prefix.css'], value: '*' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css'], value: '*' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css'], value: ' ' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });

				tokens = testGrammar.tokenizeLine('foo|*  { }').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.namespace-prefix.css'], value: 'foo' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css'], value: '*' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });

				tokens = testGrammar.tokenizeLine('|[svg|attr=name]{}').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css'], value: 'svg' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'attr' });
			});

			it('tokenises the "no-namespace" prefix', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('|h1   { }').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.css'], value: '|' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'h1' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
			});

			it("doesn't tokenise prefixes without a selector", function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('*| { }').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css'], value: '*' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css'], value: '|' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css'], value: ' ' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				tokens = testGrammar.tokenizeLine('*|{ }').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css'], value: '*' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css'], value: '|' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
			});
		});

		describe('at-rules', function () {
			describe('@charset', function () {
				it('tokenises @charset rules at the start of a file', function () {
					var lines;
					lines = testGrammar.tokenizeLines('@charset "US-ASCII";');
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css'], value: 'charset' });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.at-rule.charset.css'], value: ' ' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css'], value: 'US-ASCII' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css'], value: ';' });

					lines = testGrammar.tokenizeLines('/* Not the first line */\n@charset "UTF-8";');
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'comment.block.css'], value: ' Not the first line ' });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css'], value: 'charset' });
				});

				it('highlights invalid @charset statements', function () {
					var lines;
					lines = testGrammar.tokenizeLines(" @charset 'US-ASCII';");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.leading-whitespace.charset.css'], value: ' ' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css'], value: 'charset' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.not-double-quoted.charset.css'], value: "'US-ASCII'" });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css'], value: ';' });

					lines = testGrammar.tokenizeLines('@charset  "iso-8859-15";');
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css'], value: 'charset' });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.whitespace.charset.css'], value: '  ' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css'], value: 'iso-8859-15' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css'], value: ';' });

					lines = testGrammar.tokenizeLines('@charset"US-ASCII";');
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.no-whitespace.charset.css'], value: '@charset"US-ASCII"' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css'], value: ';' });

					lines = testGrammar.tokenizeLines('@charset "UTF-8" ;');
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css'], value: 'charset' });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.at-rule.charset.css'], value: ' ' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css'], value: 'UTF-8' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.unexpected-characters.charset.css'], value: ' ' });
					assert.deepStrictEqual(lines[0][7], { scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css'], value: ';' });

					lines = testGrammar.tokenizeLines('@charset "WTF-8" /* Nope */ ;');
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css'], value: 'charset' });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.at-rule.charset.css'], value: ' ' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css'], value: 'WTF-8' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.unexpected-characters.charset.css'], value: ' /* Nope */ ' });
					assert.deepStrictEqual(lines[0][7], { scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css'], value: ';' });

					lines = testGrammar.tokenizeLines('@charset "UTF-8');
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css'], value: 'charset' });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.at-rule.charset.css'], value: ' ' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.unclosed-string.charset.css'], value: '"UTF-8' });

					lines = testGrammar.tokenizeLines("@CHARSET 'US-ASCII';");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.not-lowercase.charset.css'], value: '@CHARSET' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.charset.css'], value: " 'US-ASCII'" });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css'], value: ';' });
				});
			});
			describe('@import', function () {
				it('tokenises @import statements', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@import url("file.css");').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css'], value: 'import' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'support.function.url.css'], value: 'url' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css'], value: 'file.css' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css'], value: ';' });

					tokens = testGrammar.tokenizeLine('@import "file.css";').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css'], value: 'import' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css'], value: 'file.css' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css'], value: ';' });

					tokens = testGrammar.tokenizeLine("@import 'file.css';").tokens;
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css'], value: "'" });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.single.css'], value: 'file.css' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css'], value: "'" });
				});
				it("doesn't let injected comments impact parameter matching", function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@import /* url("name"); */ "1.css";').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css'], value: 'import' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css'], value: ' url("name"); ' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css'], value: '1.css' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css'], value: ';' });

					tokens = testGrammar.tokenizeLine('@import/* Comment */"2.css";').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css'], value: 'import' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css'], value: ' Comment ' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css'], value: '2.css' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css'], value: ';' });
				});
				it('correctly handles word boundaries', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@import"file.css";').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css'], value: 'import' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css'], value: 'file.css' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css'], value: ';' });

					tokens = testGrammar.tokenizeLine('@import-file.css;').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css'], value: 'import-file' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.header.css'], value: '.css' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.header.css', 'punctuation.terminator.rule.css'], value: ';' });
				});

				it('matches a URL that starts on the next line', function () {
					var lines;
					lines = testGrammar.tokenizeLines('@import\nurl("file.css");');
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css'], value: 'import' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'support.function.url.css'], value: 'url' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css'], value: 'file.css' });
					assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css'], value: ';' });
				});

				// Skipped because `vscode-textmate` does not produce this token
				it.skip('matches a URL that starts on the next line and produces a token for whitespace', function () {
					var lines;
					lines = testGrammar.tokenizeLines('@import\nurl("file.css");');
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.at-rule.import.css'], value: '' });
				});

				it('matches comments inside query lists', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@import url("1.css") print /* url(";"); */ all;').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css'], value: 'import' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'support.function.url.css'], value: 'url' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css'], value: '1.css' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.import.css', 'support.constant.media.css'], value: 'print' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css'], value: ' url(";"); ' });
					assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.at-rule.import.css', 'support.constant.media.css'], value: 'all' });
					assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css'], value: ';' });
				});

				it('highlights deprecated media types', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@import "astral.css" projection;').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css'], value: 'import' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css'], value: 'astral.css' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.import.css', 'invalid.deprecated.constant.media.css'], value: 'projection' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css'], value: ';' });
				});

				it('highlights media features in query lists', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@import url(\'landscape.css\') screen and (orientation:landscape);').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css'], value: 'import' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'support.function.url.css'], value: 'url' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css'], value: '\'' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.single.css'], value: 'landscape.css' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css'], value: '\'' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.import.css', 'support.constant.media.css'], value: 'screen' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.operator.logical.and.media.css'], value: 'and' });
					assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.at-rule.import.css', 'support.type.property-name.media.css'], value: 'orientation' });
					assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.at-rule.import.css', 'support.constant.property-value.css'], value: 'landscape' });
					assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css'], value: ';' });
				});
			});

			describe('@media', function () {
				it('tokenises @media keywords correctly', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@media(max-width: 37.5em) { }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], value: 'max-width' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css'], value: '37.5' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css'], value: ' ' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css'], value: '}' });

					tokens = testGrammar.tokenizeLine('@media not print and (max-width: 37.5em){ }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.not.media.css'], value: 'not' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css'], value: 'print' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css'], value: 'and' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], value: 'max-width' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css'], value: '37.5' });
					assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
					assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css'], value: '}' });
				});
				it('highlights deprecated media types', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@media (max-device-width: 2px){ }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], value: 'max-device-width' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css'], value: '2' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css'], value: '}' });
				});

				it('highlights vendored media features', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@media (-webkit-foo: bar){ b{ } }').tokens;
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css'], value: '-webkit-foo' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.media.header.css'], value: ' bar' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css'], value: '{' });

					tokens = testGrammar.tokenizeLine('@media screen and (-ms-high-contrast:black-on-white){ }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css'], value: 'screen' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css'], value: 'and' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css'], value: '-ms-high-contrast' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.media.header.css'], value: 'black-on-white' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css'], value: '}' });

					tokens = testGrammar.tokenizeLine('@media (_moz-a:b){}').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css'], value: '_moz-a' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.media.header.css'], value: 'b' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });

					tokens = testGrammar.tokenizeLine('@media (-hp-foo:bar){}').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css'], value: '-hp-foo' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.media.header.css'], value: 'bar' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });

					tokens = testGrammar.tokenizeLine('@media (mso-page-size:wide){}').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css'], value: 'mso-page-size' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.media.header.css'], value: 'wide' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
				});

				it('tokenises @media immediately following a closing brace', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('h1 { }@media only screen { } h2 { }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'h1' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.only.media.css'], value: 'only' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css'], value: 'screen' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'h2' });
					assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[20], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });

					tokens = testGrammar.tokenizeLine('h1 { }@media only screen { }h2 { }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'h1' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.only.media.css'], value: 'only' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css'], value: 'screen' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'h2' });
					assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});

				it('tokenises level 4 media-query syntax', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@media (min-width >= 0px)\n   and (max-width <= 400)\n   and (min-height > 400)\n   and (max-height < 200)");
					assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.comparison.css'], value: '>=' });
					assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.comparison.css'], value: '<=' });
					assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.comparison.css'], value: '>' });
					assert.deepStrictEqual(lines[3][6], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.comparison.css'], value: '<' });
				});

				it('tokenises comments between media types', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@media/* */only/* */screen/* */and (min-width:1100px){}').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.only.media.css'], value: 'only' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css'], value: 'screen' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css'], value: 'and' });
					assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], value: 'min-width' });
					assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css'], value: '1100' });
					assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(tokens[20], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[21], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[22], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css'], value: '}' });
				});

				it('tokenises comments between media features', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@media/*=*/(max-width:/**/37.5em)/*=*/and/*=*/(/*=*/min-height/*:*/:/*=*/1.2em/*;*/){}').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css'], value: '=' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], value: 'max-width' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css'], value: '37.5' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css'], value: '=' });
					assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css'], value: 'and' });
					assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css'], value: '=' });
					assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[20], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[21], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[22], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css'], value: '=' });
					assert.deepStrictEqual(tokens[23], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[24], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], value: 'min-height' });
					assert.deepStrictEqual(tokens[25], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[26], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css'], value: ':' });
					assert.deepStrictEqual(tokens[27], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[28], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[29], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[30], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css'], value: '=' });
					assert.deepStrictEqual(tokens[31], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[32], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css'], value: '1.2' });
					assert.deepStrictEqual(tokens[33], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
					assert.deepStrictEqual(tokens[34], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[35], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css'], value: ';' });
					assert.deepStrictEqual(tokens[36], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[37], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[38], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[39], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css'], value: '}' });
				});
			});

			it('matches media queries across lines', function () {
				var lines;
				lines = testGrammar.tokenizeLines("@media only screen and (min-width : /* 40 */\n  320px),\n  not print and (max-width: 480px)  /* kek */ and (-webkit-min-device-pixel-ratio /*:*/ : 2),\nonly speech and (min-width: 10em),  /* wat */     (-webkit-min-device-pixel-ratio: 2) { }");
				assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
				assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
				assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.only.media.css'], value: 'only' });
				assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css'], value: 'screen' });
				assert.deepStrictEqual(lines[0][7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css'], value: 'and' });
				assert.deepStrictEqual(lines[0][9], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
				assert.deepStrictEqual(lines[0][10], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], value: 'min-width' });
				assert.deepStrictEqual(lines[0][12], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
				assert.deepStrictEqual(lines[0][14], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
				assert.deepStrictEqual(lines[0][15], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css'], value: ' 40 ' });
				assert.deepStrictEqual(lines[0][16], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
				assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css'], value: '320' });
				assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
				assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
				assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.list.comma.css'], value: ',' });
				assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.not.media.css'], value: 'not' });
				assert.deepStrictEqual(lines[2][3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css'], value: 'print' });
				assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css'], value: 'and' });
				assert.deepStrictEqual(lines[2][7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
				assert.deepStrictEqual(lines[2][8], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], value: 'max-width' });
				assert.deepStrictEqual(lines[2][9], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
				assert.deepStrictEqual(lines[2][11], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css'], value: '480' });
				assert.deepStrictEqual(lines[2][12], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
				assert.deepStrictEqual(lines[2][13], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
				assert.deepStrictEqual(lines[2][15], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
				assert.deepStrictEqual(lines[2][16], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css'], value: ' kek ' });
				assert.deepStrictEqual(lines[2][17], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
				assert.deepStrictEqual(lines[2][19], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css'], value: 'and' });
				assert.deepStrictEqual(lines[2][21], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
				assert.deepStrictEqual(lines[2][22], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css'], value: '-webkit-min-device-pixel-ratio' });
				assert.deepStrictEqual(lines[2][24], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
				assert.deepStrictEqual(lines[2][25], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css'], value: ':' });
				assert.deepStrictEqual(lines[2][26], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
				assert.deepStrictEqual(lines[2][28], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
				assert.deepStrictEqual(lines[2][30], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css'], value: '2' });
				assert.deepStrictEqual(lines[2][31], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
				assert.deepStrictEqual(lines[2][32], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.list.comma.css'], value: ',' });
				assert.deepStrictEqual(lines[3][0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.only.media.css'], value: 'only' });
				assert.deepStrictEqual(lines[3][2], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css'], value: 'speech' });
				assert.deepStrictEqual(lines[3][4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css'], value: 'and' });
				assert.deepStrictEqual(lines[3][6], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
				assert.deepStrictEqual(lines[3][7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], value: 'min-width' });
				assert.deepStrictEqual(lines[3][8], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
				assert.deepStrictEqual(lines[3][10], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css'], value: '10' });
				assert.deepStrictEqual(lines[3][11], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
				assert.deepStrictEqual(lines[3][12], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
				assert.deepStrictEqual(lines[3][13], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.list.comma.css'], value: ',' });
				assert.deepStrictEqual(lines[3][15], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
				assert.deepStrictEqual(lines[3][16], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css'], value: ' wat ' });
				assert.deepStrictEqual(lines[3][17], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
				assert.deepStrictEqual(lines[3][19], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
				assert.deepStrictEqual(lines[3][20], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css'], value: '-webkit-min-device-pixel-ratio' });
				assert.deepStrictEqual(lines[3][21], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
				assert.deepStrictEqual(lines[3][23], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css'], value: '2' });
				assert.deepStrictEqual(lines[3][24], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
				assert.deepStrictEqual(lines[3][26], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css'], value: '{' });
				assert.deepStrictEqual(lines[3][28], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css'], value: '}' });
			});

			it('highlights invalid commas', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('@media , {}').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'invalid.illegal.comma.css'], value: ',' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css'], value: '{' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css'], value: '}' });

				tokens = testGrammar.tokenizeLine('@media , ,screen {}').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'invalid.illegal.comma.css'], value: ', ,' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css'], value: 'screen' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css'], value: '{' });
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css'], value: '}' });
			});

			it('allows spaces inside ratio values', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('@media (min-aspect-ratio: 3 / 4) and (max-aspect-ratio: 20   /   17) {}').tokens;
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css', 'constant.numeric.css'], value: '3' });
				assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css'], value: ' ' });
				assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css', 'keyword.operator.arithmetic.css'], value: '/' });
				assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css'], value: ' ' });
				assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css', 'constant.numeric.css'], value: '4' });
				assert.deepStrictEqual(tokens[20], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css', 'constant.numeric.css'], value: '20' });
				assert.deepStrictEqual(tokens[21], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css'], value: '   ' });
				assert.deepStrictEqual(tokens[22], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css', 'keyword.operator.arithmetic.css'], value: '/' });
				assert.deepStrictEqual(tokens[23], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css'], value: '   ' });
				assert.deepStrictEqual(tokens[24], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css', 'constant.numeric.css'], value: '17' });
			});

			describe('@keyframes', function () {
				it('tokenises keyframe lists correctly', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@keyframes important1 {\n  from { margin-top: 50px;\n         margin-bottom: 100px }\n  50%  { margin-top: 150px !important; } /* Ignored */\n  to   { margin-top: 100px; }\n}");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css'], value: 'keyframes' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css'], value: 'important1' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css'], value: ' ' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css'], value: 'from' });
					assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'margin-top' });
					assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[1][8], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '50' });
					assert.deepStrictEqual(lines[1][9], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(lines[1][10], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'margin-bottom' });
					assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '100' });
					assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(lines[2][7], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.percentage.css'], value: '50%' });
					assert.deepStrictEqual(lines[3][3], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[3][5], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'margin-top' });
					assert.deepStrictEqual(lines[3][6], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[3][8], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '150' });
					assert.deepStrictEqual(lines[3][9], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(lines[3][11], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'keyword.other.important.css'], value: '!important' });
					assert.deepStrictEqual(lines[3][12], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[3][14], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[3][16], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[3][17], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'comment.block.css'], value: ' Ignored ' });
					assert.deepStrictEqual(lines[3][18], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css'], value: 'to' });
					assert.deepStrictEqual(lines[4][3], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[4][5], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'margin-top' });
					assert.deepStrictEqual(lines[4][6], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[4][8], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '100' });
					assert.deepStrictEqual(lines[4][9], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(lines[4][10], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[4][12], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[5][0], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.end.bracket.curly.css'], value: '}' });
				});

				it('matches injected comments', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@keyframes/*{*/___IDENT__/*}\n  { Nah { margin-top: 2em; }\n*/{ from");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css'], value: 'keyframes' });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css'], value: '{' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css'], value: '___IDENT__' });
					assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[0][7], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css'], value: '}' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css'], value: '  { Nah { margin-top: 2em; }' });
					assert.deepStrictEqual(lines[2][0], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[2][3], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css'], value: 'from' });
				});

				it('matches offset keywords case-insensitively', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@keyframes Give-them-both { fROm { } To {} }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css'], value: 'keyframes' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css'], value: 'Give-them-both' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css'], value: ' ' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css'], value: 'fROm' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css'], value: 'To' });
					assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.end.bracket.curly.css'], value: '}' });
				});

				it('matches percentile offsets', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@keyframes identifier { -50.2% } @keyframes ident2 { .25%}').tokens;
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.percentage.css'], value: '-50.2%' });
					assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.percentage.css'], value: '.25%' });
				});

				it('highlights escape sequences inside identifiers', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@keyframes A\\1F602Z').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css'], value: 'keyframes' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css'], value: 'A' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css', 'constant.character.escape.codepoint.css'], value: '\\1F602' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css'], value: 'Z' });
				});
			});

			describe('@supports', function () {
				it('tokenises feature queries', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@supports (font-size: 1em) { }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css'], value: 'supports' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.supports.header.css'], value: ' ' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'font-size' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css'], value: '1' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css'], value: ' ' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.end.bracket.curly.css'], value: '}' });
				});

				it('matches logical operators', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@supports not (font-size: 1em){ }\n@supports (font-size: 1em) and (font-size: 1em){ }\n@supports (font-size: 1em) or (font-size: 1em){ }");
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.not.css'], value: 'not' });
					assert.deepStrictEqual(lines[1][11], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.and.css'], value: 'and' });
					assert.deepStrictEqual(lines[2][11], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.or.css'], value: 'or' });
				});

				it('matches custom variables in feature queries', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@supports (--foo: green){}').tokens;
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'variable.css'], value: '--foo' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css'], value: 'green' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css'], value: ')' });
				});

				it("doesn't mistake brackets in string literals for feature queries", function () {
					var lines;
					lines = testGrammar.tokenizeLines("@supports not ((tab-size:4) or (-moz-tab-size:4)){\n  body::before{content: \"Come on, Microsoft (Get it together already)…\"; }\n}");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css'], value: 'supports' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.not.css'], value: 'not' });
					assert.deepStrictEqual(lines[0][7], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'tab-size' });
					assert.deepStrictEqual(lines[0][12], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'keyword.operator.logical.feature.or.css'], value: 'or' });
					assert.deepStrictEqual(lines[0][15], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.vendored.property-name.css'], value: '-moz-tab-size' });
					assert.deepStrictEqual(lines[0][20], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'body' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css'], value: '::' });
					assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'before' });
					assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'content' });
					assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[1][8], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(lines[1][9], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css'], value: 'Come on, Microsoft (Get it together already)…' });
					assert.deepStrictEqual(lines[1][10], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(lines[1][11], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[1][13], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[2][0], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.end.bracket.curly.css'], value: '}' });
				});

				it('tokenises multiple feature queries', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@supports (display:table-cell) or ((display:list-item) and (display:run-in)){').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css'], value: 'supports' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'display' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'table-cell' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.or.css'], value: 'or' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'display' });
					assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'list-item' });
					assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'keyword.operator.logical.feature.and.css'], value: 'and' });
					assert.deepStrictEqual(tokens[20], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[21], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'display' });
					assert.deepStrictEqual(tokens[22], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[23], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'run-in' });
					assert.deepStrictEqual(tokens[24], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[25], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[26], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.begin.bracket.curly.css'], value: '{' });
				});

				it('embeds rulesets and other at-rules', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@supports (animation-name: test) {\n  #node {\n    animation-name: test;\n  }\n  body > header[data-name=\"attr\"] ~ *:not(:first-child){\n    content: \"😂👌\"\n  }\n  @keyframes important1 {\n    from {\n      margin-top: 50px;\n      margin-bottom: 100px\n    }\n    50%  { margin-top: 150px !important; } /* Ignored */\n    to   { margin-top: 100px; }\n  }\n}");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css'], value: 'supports' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'animation-name' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[0][7], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css'], value: 'test' });
					assert.deepStrictEqual(lines[0][8], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[0][10], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css'], value: '#' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.id.css'], value: 'node' });
					assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'animation-name' });
					assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css'], value: 'test' });
					assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'body' });
					assert.deepStrictEqual(lines[4][3], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'keyword.operator.combinator.css'], value: '>' });
					assert.deepStrictEqual(lines[4][5], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'header' });
					assert.deepStrictEqual(lines[4][6], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css'], value: '[' });
					assert.deepStrictEqual(lines[4][7], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css'], value: 'data-name' });
					assert.deepStrictEqual(lines[4][8], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css'], value: '=' });
					assert.deepStrictEqual(lines[4][9], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(lines[4][10], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css'], value: 'attr' });
					assert.deepStrictEqual(lines[4][11], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(lines[4][12], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css'], value: ']' });
					assert.deepStrictEqual(lines[4][14], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'keyword.operator.combinator.css'], value: '~' });
					assert.deepStrictEqual(lines[4][16], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.name.tag.wildcard.css'], value: '*' });
					assert.deepStrictEqual(lines[4][17], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(lines[4][18], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'not' });
					assert.deepStrictEqual(lines[4][19], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[4][20], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(lines[4][21], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'first-child' });
					assert.deepStrictEqual(lines[4][22], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[4][23], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[5][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'content' });
					assert.deepStrictEqual(lines[5][2], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[5][4], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(lines[5][5], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css'], value: '😂👌' });
					assert.deepStrictEqual(lines[5][6], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(lines[6][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[7][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[7][2], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css'], value: 'keyframes' });
					assert.deepStrictEqual(lines[7][4], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css'], value: 'important1' });
					assert.deepStrictEqual(lines[7][6], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[8][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css'], value: 'from' });
					assert.deepStrictEqual(lines[8][3], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[9][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'margin-top' });
					assert.deepStrictEqual(lines[9][2], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[9][4], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '50' });
					assert.deepStrictEqual(lines[9][5], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(lines[9][6], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[10][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'margin-bottom' });
					assert.deepStrictEqual(lines[10][2], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[10][4], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '100' });
					assert.deepStrictEqual(lines[10][5], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(lines[11][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[12][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.percentage.css'], value: '50%' });
					assert.deepStrictEqual(lines[12][3], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[12][5], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'margin-top' });
					assert.deepStrictEqual(lines[12][6], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[12][8], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '150' });
					assert.deepStrictEqual(lines[12][9], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(lines[12][11], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'keyword.other.important.css'], value: '!important' });
					assert.deepStrictEqual(lines[12][12], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[12][14], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[12][16], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[12][17], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'comment.block.css'], value: ' Ignored ' });
					assert.deepStrictEqual(lines[12][18], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[13][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css'], value: 'to' });
					assert.deepStrictEqual(lines[13][3], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[13][5], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'margin-top' });
					assert.deepStrictEqual(lines[13][6], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[13][8], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '100' });
					assert.deepStrictEqual(lines[13][9], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(lines[13][10], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[13][12], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[14][1], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[15][0], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.end.bracket.curly.css'], value: '}' });
				});

				it('matches injected comments', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@supports/*===*/not/*==****************|\n==*/(display:table-cell)/*============*/ and (display: list-item)/*}*/{}");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css'], value: 'supports' });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css'], value: '===' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.not.css'], value: 'not' });
					assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[0][7], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css'], value: '==****************|' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css'], value: '==' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'display' });
					assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'table-cell' });
					assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[1][7], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[1][8], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css'], value: '============' });
					assert.deepStrictEqual(lines[1][9], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[1][11], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.and.css'], value: 'and' });
					assert.deepStrictEqual(lines[1][13], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[1][19], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[1][20], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css'], value: '}' });
					assert.deepStrictEqual(lines[1][21], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[1][22], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[1][23], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.end.bracket.curly.css'], value: '}' });
				});

				it('matches feature queries across multiple lines', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@supports\n  (box-shadow: 0 0 2px rgba(0,0,0,.5) inset) or\n  (-moz-box-shadow: 0 0 2px black inset) or\n  (-webkit-box-shadow: 0 0 2px black inset) or\n  (-o-box-shadow: 0 0 2px black inset)\n{ .noticebox { } }");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css'], value: 'supports' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'box-shadow' });
					assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css'], value: '0' });
					assert.deepStrictEqual(lines[1][7], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css'], value: '0' });
					assert.deepStrictEqual(lines[1][9], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css'], value: '2' });
					assert.deepStrictEqual(lines[1][10], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(lines[1][12], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'rgba' });
					assert.deepStrictEqual(lines[1][13], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[1][14], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '0' });
					assert.deepStrictEqual(lines[1][15], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
					assert.deepStrictEqual(lines[1][16], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '0' });
					assert.deepStrictEqual(lines[1][17], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
					assert.deepStrictEqual(lines[1][18], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '0' });
					assert.deepStrictEqual(lines[1][19], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
					assert.deepStrictEqual(lines[1][20], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '.5' });
					assert.deepStrictEqual(lines[1][21], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[1][23], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'inset' });
					assert.deepStrictEqual(lines[1][24], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[1][26], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.or.css'], value: 'or' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.vendored.property-name.css'], value: '-moz-box-shadow' });
					assert.deepStrictEqual(lines[2][3], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css'], value: '0' });
					assert.deepStrictEqual(lines[2][7], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css'], value: '0' });
					assert.deepStrictEqual(lines[2][9], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css'], value: '2' });
					assert.deepStrictEqual(lines[2][10], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(lines[2][12], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css'], value: 'black' });
					assert.deepStrictEqual(lines[2][14], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'inset' });
					assert.deepStrictEqual(lines[2][15], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[2][17], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.or.css'], value: 'or' });
					assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[3][2], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.vendored.property-name.css'], value: '-webkit-box-shadow' });
					assert.deepStrictEqual(lines[3][3], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[3][5], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css'], value: '0' });
					assert.deepStrictEqual(lines[3][7], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css'], value: '0' });
					assert.deepStrictEqual(lines[3][9], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css'], value: '2' });
					assert.deepStrictEqual(lines[3][10], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(lines[3][12], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css'], value: 'black' });
					assert.deepStrictEqual(lines[3][14], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'inset' });
					assert.deepStrictEqual(lines[3][15], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[3][17], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.or.css'], value: 'or' });
					assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[4][2], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.vendored.property-name.css'], value: '-o-box-shadow' });
					assert.deepStrictEqual(lines[4][3], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[4][5], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css'], value: '0' });
					assert.deepStrictEqual(lines[4][7], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css'], value: '0' });
					assert.deepStrictEqual(lines[4][9], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css'], value: '2' });
					assert.deepStrictEqual(lines[4][10], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(lines[4][12], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css'], value: 'black' });
					assert.deepStrictEqual(lines[4][14], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'inset' });
					assert.deepStrictEqual(lines[4][15], { scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[5][0], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[5][2], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
					assert.deepStrictEqual(lines[5][3], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'noticebox' });
					assert.deepStrictEqual(lines[5][5], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[5][7], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[5][9], { scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.end.bracket.curly.css'], value: '}' });
				});
			});

			describe('@namespace', function () {
				it('tokenises @namespace statements correctly', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@namespace "XML";').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css'], value: 'namespace' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.namespace.css'], value: ' ' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css'], value: 'XML' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css'], value: ';' });

					tokens = testGrammar.tokenizeLine('@namespace  prefix  "XML"  ;').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css'], value: 'namespace' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.namespace.css'], value: '  ' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css'], value: 'prefix' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.namespace.css'], value: '  ' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css'], value: 'XML' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.namespace.css'], value: '  ' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css'], value: ';' });

					tokens = testGrammar.tokenizeLine('@namespace url("http://a.bc/");').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css'], value: 'namespace' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.namespace.css'], value: ' ' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'support.function.url.css'], value: 'url' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css'], value: 'http://a.bc/' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css'], value: ';' });
				});

				it("doesn't confuse a prefix of 'url' as a function", function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@namespace url url("http://a.bc/");').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css'], value: 'namespace' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css'], value: 'url' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'support.function.url.css'], value: 'url' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css'], value: 'http://a.bc/' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css'], value: ';' });
				});

				it('permits injected comments between tokens', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@namespace/*=*/pre/*=*/"url"/*=*/;').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css'], value: 'namespace' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css'], value: '=' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css'], value: 'pre' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css'], value: '=' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css'], value: 'url' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css'], value: '=' });
					assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css'], value: ';' });
				});

				it('allows no spaces between "@namespace" and quoted URLs', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@namespace"XML";').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css'], value: 'namespace' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css'], value: 'XML' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css'], value: ';' });
				});

				it('tokenises escape sequences in prefixes', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@namespace pre\\ fix "http://url/";').tokens;
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css'], value: 'pre' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css', 'constant.character.escape.css'], value: '\\ ' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css'], value: 'fix' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
				});

				it('allows arguments to span multiple lines', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@namespace\nprefix\"XML\";");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css'], value: 'namespace' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css'], value: 'prefix' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css'], value: 'XML' });
					assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css'], value: ';' });

					lines = testGrammar.tokenizeLines("@namespace\n\n  prefix\n\nurl(\"http://a.bc/\");");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css'], value: 'namespace' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css'], value: 'prefix' });
					assert.deepStrictEqual(lines[4][0], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'support.function.url.css'], value: 'url' });
					assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[4][2], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(lines[4][3], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css'], value: 'http://a.bc/' });
					assert.deepStrictEqual(lines[4][4], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(lines[4][5], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[4][6], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css'], value: ';' });
				});
			});

			describe('font-feature declarations', function () {
				it('tokenises font-feature blocks', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@font-feature-values Font name 2 { }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css'], value: 'font-feature-values' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.font-features.css'], value: ' ' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css'], value: 'Font name 2' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css'], value: ' ' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});

				it('allows font-feature names to start on a different line', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@font-feature-values\nFont name 2\n{");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css'], value: 'font-feature-values' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css'], value: 'Font name 2' });
					assert.deepStrictEqual(lines[2][0], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
				});

				it('matches injected comments', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@font-feature-values/*{*/Font/*}*/name/*{*/2{').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css'], value: 'font-feature-values' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css'], value: '{' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css'], value: 'Font' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css'], value: '}' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css'], value: 'name' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css'], value: '{' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css'], value: '2' });
					assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
				});

				it('tokenises at-rules for feature names', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@swash{ swashy: 2; }\n@ornaments{ ident: 2; }\n@annotation{ ident: 1; }\n@stylistic{ stylish: 2; }\n@styleset{ sets: 2 3 4; }\n@character-variant{ charvar: 2 }");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css'], value: 'swash' });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css'], value: 'swashy' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[0][7], { scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css'], value: '2' });
					assert.deepStrictEqual(lines[0][8], { scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[0][10], { scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.at-rule.ornaments.css', 'keyword.control.at-rule.ornaments.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.ornaments.css', 'keyword.control.at-rule.ornaments.css'], value: 'ornaments' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.at-rule.ornaments.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.at-rule.ornaments.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css'], value: 'ident' });
					assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.at-rule.ornaments.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[1][7], { scopes: ['source.css', 'meta.at-rule.ornaments.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css'], value: '2' });
					assert.deepStrictEqual(lines[1][8], { scopes: ['source.css', 'meta.at-rule.ornaments.css', 'meta.property-list.font-feature.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[1][10], { scopes: ['source.css', 'meta.at-rule.ornaments.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[2][0], { scopes: ['source.css', 'meta.at-rule.annotation.css', 'keyword.control.at-rule.annotation.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.annotation.css', 'keyword.control.at-rule.annotation.css'], value: 'annotation' });
					assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.at-rule.annotation.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.at-rule.annotation.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css'], value: 'ident' });
					assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.at-rule.annotation.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[2][7], { scopes: ['source.css', 'meta.at-rule.annotation.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css'], value: '1' });
					assert.deepStrictEqual(lines[2][8], { scopes: ['source.css', 'meta.at-rule.annotation.css', 'meta.property-list.font-feature.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[2][10], { scopes: ['source.css', 'meta.at-rule.annotation.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[3][0], { scopes: ['source.css', 'meta.at-rule.stylistic.css', 'keyword.control.at-rule.stylistic.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.at-rule.stylistic.css', 'keyword.control.at-rule.stylistic.css'], value: 'stylistic' });
					assert.deepStrictEqual(lines[3][2], { scopes: ['source.css', 'meta.at-rule.stylistic.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[3][4], { scopes: ['source.css', 'meta.at-rule.stylistic.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css'], value: 'stylish' });
					assert.deepStrictEqual(lines[3][5], { scopes: ['source.css', 'meta.at-rule.stylistic.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[3][7], { scopes: ['source.css', 'meta.at-rule.stylistic.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css'], value: '2' });
					assert.deepStrictEqual(lines[3][8], { scopes: ['source.css', 'meta.at-rule.stylistic.css', 'meta.property-list.font-feature.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[3][10], { scopes: ['source.css', 'meta.at-rule.stylistic.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[4][0], { scopes: ['source.css', 'meta.at-rule.styleset.css', 'keyword.control.at-rule.styleset.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.at-rule.styleset.css', 'keyword.control.at-rule.styleset.css'], value: 'styleset' });
					assert.deepStrictEqual(lines[4][2], { scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[4][4], { scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css'], value: 'sets' });
					assert.deepStrictEqual(lines[4][5], { scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[4][7], { scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css'], value: '2' });
					assert.deepStrictEqual(lines[4][9], { scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css'], value: '3' });
					assert.deepStrictEqual(lines[4][11], { scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css'], value: '4' });
					assert.deepStrictEqual(lines[4][12], { scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[4][14], { scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[5][0], { scopes: ['source.css', 'meta.at-rule.character-variant.css', 'keyword.control.at-rule.character-variant.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[5][1], { scopes: ['source.css', 'meta.at-rule.character-variant.css', 'keyword.control.at-rule.character-variant.css'], value: 'character-variant' });
					assert.deepStrictEqual(lines[5][2], { scopes: ['source.css', 'meta.at-rule.character-variant.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[5][4], { scopes: ['source.css', 'meta.at-rule.character-variant.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css'], value: 'charvar' });
					assert.deepStrictEqual(lines[5][5], { scopes: ['source.css', 'meta.at-rule.character-variant.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[5][7], { scopes: ['source.css', 'meta.at-rule.character-variant.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css'], value: '2' });
					assert.deepStrictEqual(lines[5][9], { scopes: ['source.css', 'meta.at-rule.character-variant.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});

				it('matches feature-name rules case-insensitively', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@sWASH{ swashy: 2; }\n@ornaMENts{ ident: 2; }\n@anNOTatION{ ident: 1; }\n@styLISTic{ stylish: 2; }\n@STYLEset{ sets: 2 3 4; }\n@CHARacter-VARiant{ charvar: 2 }");
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css'], value: 'sWASH' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.ornaments.css', 'keyword.control.at-rule.ornaments.css'], value: 'ornaMENts' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.annotation.css', 'keyword.control.at-rule.annotation.css'], value: 'anNOTatION' });
					assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.at-rule.stylistic.css', 'keyword.control.at-rule.stylistic.css'], value: 'styLISTic' });
					assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.at-rule.styleset.css', 'keyword.control.at-rule.styleset.css'], value: 'STYLEset' });
					assert.deepStrictEqual(lines[5][1], { scopes: ['source.css', 'meta.at-rule.character-variant.css', 'keyword.control.at-rule.character-variant.css'], value: 'CHARacter-VARiant' });
				});

				it('matches comments inside feature-name rules', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@font-feature-values Font name 2 {\n@swash{/*\n========*/swashy:/**/2;/**/}\n}");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css'], value: 'font-feature-values' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css'], value: 'Font name 2' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css'], value: 'swash' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[2][0], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'comment.block.css'], value: '========' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css'], value: 'swashy' });
					assert.deepStrictEqual(lines[2][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css'], value: '2' });
					assert.deepStrictEqual(lines[2][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[2][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[2][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[2][10], { scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[3][0], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});

				it('highlights escape sequences inside feature-names', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@swash{ s\\000077a\\73hy: 1; }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css'], value: 'swash' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css'], value: 's' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css', 'constant.character.escape.codepoint.css'], value: '\\000077' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css'], value: 'a' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css', 'constant.character.escape.codepoint.css'], value: '\\73' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css'], value: 'hy' });
				});
			});

			describe('@page', function () {
				it('tokenises @page blocks correctly', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@page :first { }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css'], value: 'page' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css'], value: ' ' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'first' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css'], value: ' ' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});

				it.skip('tokenizes @page:right {} correctly', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@page:right{}').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css'], value: 'page' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'right' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});

				it('tokenizes @page {} correctly', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@page {}').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css'], value: 'page' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css'], value: ' ' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});

				it.skip('tokenizes @page{} correctly', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@page{}').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css'], value: 'page' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});
			});

			describe('@counter-style', function () {
				it('tokenises them and their contents correctly', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@counter-style winners-list {\n  system: fixed;\n  symbols: url(gold-medal.svg) url(silver-medal.svg) url(bronze-medal.svg);\n  suffix: \" \";\n}");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css'], value: 'counter-style' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'variable.parameter.style-name.css'], value: 'winners-list' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'system' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'fixed' });
					assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'symbols' });
					assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'support.function.url.css'], value: 'url' });
					assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'variable.parameter.url.css'], value: 'gold-medal.svg' });
					assert.deepStrictEqual(lines[2][7], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[2][9], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'support.function.url.css'], value: 'url' });
					assert.deepStrictEqual(lines[2][10], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[2][11], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'variable.parameter.url.css'], value: 'silver-medal.svg' });
					assert.deepStrictEqual(lines[2][12], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[2][14], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'support.function.url.css'], value: 'url' });
					assert.deepStrictEqual(lines[2][15], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[2][16], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'variable.parameter.url.css'], value: 'bronze-medal.svg' });
					assert.deepStrictEqual(lines[2][17], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[2][18], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'suffix' });
					assert.deepStrictEqual(lines[3][2], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[3][4], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(lines[3][6], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(lines[3][7], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[4][0], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});

				it('matches injected comments', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@counter-style/*{*/winners-list/*}*/{ system: fixed; }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css'], value: 'counter-style' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'comment.block.css'], value: '{' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'variable.parameter.style-name.css'], value: 'winners-list' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'comment.block.css'], value: '}' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'system' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'fixed' });
					assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});

				it("allows the counter-style's name to start on a different line", function () {
					var lines;
					lines = testGrammar.tokenizeLines("@counter-style\nwinners-list");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css'], value: 'counter-style' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'variable.parameter.style-name.css'], value: 'winners-list' });
				});

				it("highlights escape sequences inside the style's name", function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@counter-style A\\01F602z').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css'], value: 'counter-style' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'variable.parameter.style-name.css'], value: 'A' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'variable.parameter.style-name.css', 'constant.character.escape.codepoint.css'], value: '\\01F602' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'variable.parameter.style-name.css'], value: 'z' });
				});
			});

			describe('@document', function () {
				it('correctly tokenises @document rules', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@document url(http://www.w3.org/),\n  url-prefix(http://www.w3.org/Style/), /* Comment */\n  domain(/**/mozilla.org),\n  regexp(\"https:.*\") {\n    body{ color: #f00; }\n  }");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'keyword.control.at-rule.document.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'keyword.control.at-rule.document.css'], value: 'document' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.url.css', 'support.function.url.css'], value: 'url' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.url.css', 'variable.parameter.url.css'], value: 'http://www.w3.org/' });
					assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[0][7], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'punctuation.separator.list.comma.css'], value: ',' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'support.function.document-rule.css'], value: 'url-prefix' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'variable.parameter.document-rule.css'], value: 'http://www.w3.org/Style/' });
					assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'punctuation.separator.list.comma.css'], value: ',' });
					assert.deepStrictEqual(lines[1][7], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[1][8], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'comment.block.css'], value: ' Comment ' });
					assert.deepStrictEqual(lines[1][9], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'support.function.document-rule.css'], value: 'domain' });
					assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[2][3], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'variable.parameter.document-rule.css'], value: 'mozilla.org' });
					assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[2][7], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'punctuation.separator.list.comma.css'], value: ',' });
					assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'support.function.document-rule.css'], value: 'regexp' });
					assert.deepStrictEqual(lines[3][2], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[3][3], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(lines[3][4], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'string.quoted.double.css'], value: 'https:.*' });
					assert.deepStrictEqual(lines[3][5], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(lines[3][6], { scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[3][8], { scopes: ['source.css', 'meta.at-rule.document.body.css', 'punctuation.section.document.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'body' });
					assert.deepStrictEqual(lines[4][2], { scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[4][4], { scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'color' });
					assert.deepStrictEqual(lines[4][5], { scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[4][7], { scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css'], value: '#' });
					assert.deepStrictEqual(lines[4][8], { scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.color.rgb-value.hex.css'], value: 'f00' });
					assert.deepStrictEqual(lines[4][9], { scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[4][11], { scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(lines[5][1], { scopes: ['source.css', 'meta.at-rule.document.body.css', 'punctuation.section.document.end.bracket.curly.css'], value: '}' });
				});
			});

			describe('@viewport', function () {
				it('tokenises @viewport blocks correctly', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@viewport { min-width: 640px; max-width: 800px; }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.viewport.css', 'keyword.control.at-rule.viewport.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.viewport.css', 'keyword.control.at-rule.viewport.css'], value: 'viewport' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css'], value: ' ' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'min-width' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '640' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'max-width' });
					assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '800' });
					assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
					assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});

				it('tokenises them across lines', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@-O-VIEWPORT\n{\n  zoom: 0.75;\n  min-zoom: 0.5;\n  max-zoom: 0.9;\n}");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.viewport.css', 'keyword.control.at-rule.viewport.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.viewport.css', 'keyword.control.at-rule.viewport.css'], value: '-O-VIEWPORT' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'zoom' });
					assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '0.75' });
					assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'min-zoom' });
					assert.deepStrictEqual(lines[3][2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[3][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '0.5' });
					assert.deepStrictEqual(lines[3][5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'max-zoom' });
					assert.deepStrictEqual(lines[4][2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[4][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '0.9' });
					assert.deepStrictEqual(lines[4][5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[5][0], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});

				it('tokenises injected comments', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@-ms-viewport/*{*/{/*\n==*/orientation: landscape;\n}");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.viewport.css', 'keyword.control.at-rule.viewport.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.viewport.css', 'keyword.control.at-rule.viewport.css'], value: '-ms-viewport' });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.at-rule.viewport.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.viewport.css', 'comment.block.css'], value: '{' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.at-rule.viewport.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.property-list.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.property-list.css', 'comment.block.css'], value: '==' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.property-list.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'orientation' });
					assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'landscape' });
					assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(lines[2][0], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});
			});

			describe('unknown at-rules', function () {
				it('correctly parses single-line unknown at-rules closing with semicolons', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@foo;\n@foo ;\n@foo a;\n@foo ();\n@foo (a);");
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css'], value: 'foo' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css'], value: 'foo' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css'], value: 'foo' });
					assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.at-rule.header.css'], value: ' a' });
					assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css'], value: 'foo' });
					assert.deepStrictEqual(lines[3][2], { scopes: ['source.css', 'meta.at-rule.header.css'], value: ' ()' });
					assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css'], value: 'foo' });
					assert.deepStrictEqual(lines[4][2], { scopes: ['source.css', 'meta.at-rule.header.css'], value: ' (a)' });
				});

				it('correctly parses single-line unknown at-rules closing with ;', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@foo bar;\n.foo");
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css'], value: 'foo' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'foo' });
				});
			});
		});

		describe('capitalisation', function () {
			it('ignores case in at-rules', function () {
				var lines;
				lines = testGrammar.tokenizeLines("@IMPoRT url(\"file.css\");\n@MEdIA (MAX-WIDTH: 2px){ }\n@pAgE :fIRST { }\n@NAMEspace \"A\";\n@foNT-FacE {}");
				assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css'], value: 'IMPoRT' });
				assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'MEdIA' });
				assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], value: 'MAX-WIDTH' });
				assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css'], value: 'pAgE' });
				assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'fIRST' });
				assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css'], value: 'NAMEspace' });
				assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.at-rule.font-face.css', 'keyword.control.at-rule.font-face.css'], value: 'foNT-FacE' });
			});

			it('ignores case in property names', function () {
				var lines;
				lines = testGrammar.tokenizeLines("a{ COLOR: #fff; }\na{ gRId-tEMPLaTe: none; }\na{ bACkgrOUND-iMAGE: none; }\na{ -MOZ-IMAGE: none; }");
				assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'COLOR' });
				assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'gRId-tEMPLaTe' });
				assert.deepStrictEqual(lines[2][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'bACkgrOUND-iMAGE' });
				assert.deepStrictEqual(lines[3][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.vendored.property-name.css'], value: '-MOZ-IMAGE' });
			});

			it('ignores case in property keywords', function () {
				var lines;
				lines = testGrammar.tokenizeLines("a{ color: INItIaL; }\na{ color: trAnsPAREnT; }\na{ color: rED; }\na{ color: unSET; }\na{ color: NONe; }\na{ style: lOWER-lATIN; }\na{ color: -WebkIT-foo; }\na{ font: HelVETica; }");
				assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'INItIaL' });
				assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'trAnsPAREnT' });
				assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css'], value: 'rED' });
				assert.deepStrictEqual(lines[3][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'unSET' });
				assert.deepStrictEqual(lines[4][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'NONe' });
				assert.deepStrictEqual(lines[5][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.list-style-type.css'], value: 'lOWER-lATIN' });
				assert.deepStrictEqual(lines[6][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.vendored.property-value.css'], value: '-WebkIT-foo' });
				assert.deepStrictEqual(lines[7][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.font-name.css'], value: 'HelVETica' });
			});

			it('ignores case in selectors', function () {
				var lines;
				lines = testGrammar.tokenizeLines("DIV:HOVER { }\n#id::BefORE { }\n#id::aFTEr { }\nTABle:nTH-cHILD(2N+1) {}\nhtML:NOT(.htiml) {}\nI::BACKDROP\nI::-mOZ-thing {}");
				assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'DIV' });
				assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'HOVER' });
				assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'BefORE' });
				assert.deepStrictEqual(lines[2][3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'aFTEr' });
				assert.deepStrictEqual(lines[3][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'TABle' });
				assert.deepStrictEqual(lines[3][2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'nTH-cHILD' });
				assert.deepStrictEqual(lines[3][4], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: '2N+1' });
				assert.deepStrictEqual(lines[4][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'htML' });
				assert.deepStrictEqual(lines[4][2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'NOT' });
				assert.deepStrictEqual(lines[5][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'I' });
				assert.deepStrictEqual(lines[5][2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'BACKDROP' });
				assert.deepStrictEqual(lines[6][2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: '-mOZ-thing' });
			});

			it('ignores case in function names', function () {
				var lines;
				lines = testGrammar.tokenizeLines("a{ color: RGBa(); }\na{ color: hslA(); }\na{ color: URL(); }\na{ content: ATTr(); }\na{ content: CoUNTer(); }\na{ content: cuBIC-beZIER()}\na{ content: sTePs()}\na{ content: cALc(2 + 2)}");
				assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'RGBa' });
				assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'hslA' });
				assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.url.css', 'support.function.url.css'], value: 'URL' });
				assert.deepStrictEqual(lines[3][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'ATTr' });
				assert.deepStrictEqual(lines[4][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'CoUNTer' });
				assert.deepStrictEqual(lines[5][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'support.function.timing-function.css'], value: 'cuBIC-beZIER' });
				assert.deepStrictEqual(lines[6][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'support.function.timing-function.css'], value: 'sTePs' });
				assert.deepStrictEqual(lines[7][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'support.function.calc.css'], value: 'cALc' });
			});

			it('ignores case in unit names', function () {
				var lines;
				lines = testGrammar.tokenizeLines("a{width: 20EM; }\na{width: 20ReM; }\na{width: 8tURN; }\na{width: 20S; }\na{width: 20CM}\na{width: 2gRAd}");
				assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '20' });
				assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'EM' });
				assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.rem.css'], value: 'ReM' });
				assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'width' });
				assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.turn.css'], value: 'tURN' });
				assert.deepStrictEqual(lines[3][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.s.css'], value: 'S' });
				assert.deepStrictEqual(lines[4][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '20' });
				assert.deepStrictEqual(lines[4][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.cm.css'], value: 'CM' });
				assert.deepStrictEqual(lines[5][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.grad.css'], value: 'gRAd' });
			});
		});

		describe('pseudo-classes', function () {
			it('tokenizes regular pseudo-classes', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('p:first-child').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'p' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'first-child' });
			});

			it("doesn't tokenise pseudo-classes if followed by a semicolon or closed bracket", function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('p{ left:left }').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'p' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'left' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
				assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'left' });
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
			});

			describe(':dir()', function () {
				it('tokenises :dir() and its keywords', function () {
					var lines;
					lines = testGrammar.tokenizeLines("a:dir(ltr ){ }\n*:dir( rtl){ }");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'dir' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.selector.css', 'support.constant.text-direction.css'], value: 'ltr' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.selector.css'], value: ' ' });
					assert.deepStrictEqual(lines[0][6], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css'], value: '*' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'dir' });
					assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.selector.css'], value: ' ' });
					assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.selector.css', 'support.constant.text-direction.css'], value: 'rtl' });
					assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
				});

				it('allows :dir() to include comments and newlines', function () {
					var lines;
					lines = testGrammar.tokenizeLines(":DIR(/**\n==*/ltr/*\n*/)");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'DIR' });
					assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[0][4], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css'], value: '*' });
					assert.deepStrictEqual(lines[1][0], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css'], value: '==' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.selector.css', 'support.constant.text-direction.css'], value: 'ltr' });
					assert.deepStrictEqual(lines[1][3], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(lines[2][0], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
				});
			});

			describe(':lang()', function () {
				it('tokenizes :lang()', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine(':lang(zh-Hans-CN,es-419)').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'lang' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'support.constant.language-range.css'], value: 'zh-Hans-CN' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.list.comma.css'], value: ',' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'support.constant.language-range.css'], value: 'es-419' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
				});

				it('does not tokenize unquoted language ranges containing asterisks', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine(':lang(zh-*-CN)').tokens;
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css'], value: 'zh-*-CN' });
				});

				it('tokenizes language ranges containing asterisks quoted as strings', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine(':lang("zh-*-CN",\'*-ab-\')').tokens;
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'string.quoted.double.css', 'support.constant.language-range.css'], value: 'zh-*-CN' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.list.comma.css'], value: ',' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.selector.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css'], value: "'" });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.selector.css', 'string.quoted.single.css', 'support.constant.language-range.css'], value: '*-ab-' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.selector.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css'], value: "'" });
				});
			});

			describe(':not()', function () {
				it('tokenises other selectors inside :not()', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('*:not(.class-name):not(div) {}').tokens;
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'not' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'class-name' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'not' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'div' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
				});

				it('tokenises injected comments', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('*:not(/*(*/.class-name/*)*/):not(/*b*/) {}').tokens;
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'not' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css'], value: '(' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'class-name' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css'], value: ')' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'not' });
					assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
					assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css'], value: 'b' });
					assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
					assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
				});
			});

			describe(':nth-*()', function () {
				it('tokenizes :nth-child()', function () {
					var tokens;
					tokens = testGrammar.tokenizeLines(':nth-child(2n+1)\n:nth-child(2n -1)\n:nth-child(-2n+ 1)\n:nth-child(-2n - 1)\n:nth-child(odd)\n:nth-child(even)\n:nth-child(  odd   )\n:nth-child(  even  )');
					assert.deepStrictEqual(tokens[0][0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(tokens[0][1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'nth-child' });
					assert.deepStrictEqual(tokens[0][2], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[0][3], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: '2n+1' });
					assert.deepStrictEqual(tokens[0][4], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[1][3], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: '2n -1' });
					assert.deepStrictEqual(tokens[2][3], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: '-2n+ 1' });
					assert.deepStrictEqual(tokens[3][3], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: '-2n - 1' });
					assert.deepStrictEqual(tokens[4][3], { scopes: ['source.css', 'meta.selector.css', 'support.constant.parity.css'], value: 'odd' });
					assert.deepStrictEqual(tokens[5][3], { scopes: ['source.css', 'meta.selector.css', 'support.constant.parity.css'], value: 'even' });
					assert.deepStrictEqual(tokens[6][3], { scopes: ['source.css', 'meta.selector.css'], value: '  ' });
					assert.deepStrictEqual(tokens[6][4], { scopes: ['source.css', 'meta.selector.css', 'support.constant.parity.css'], value: 'odd' });
					assert.deepStrictEqual(tokens[7][4], { scopes: ['source.css', 'meta.selector.css', 'support.constant.parity.css'], value: 'even' });
					assert.deepStrictEqual(tokens[7][5], { scopes: ['source.css', 'meta.selector.css'], value: '  ' });
				});

				it('tokenizes :nth-last-child()', function () {
					var tokens;
					tokens = testGrammar.tokenizeLines(':nth-last-child(2n)\n:nth-last-child( -2n)\n:nth-last-child( 2n )\n:nth-last-child(even)');
					assert.deepStrictEqual(tokens[0][0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(tokens[0][1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'nth-last-child' });
					assert.deepStrictEqual(tokens[0][2], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[0][3], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: '2n' });
					assert.deepStrictEqual(tokens[0][4], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[1][4], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: '-2n' });
					assert.deepStrictEqual(tokens[2][4], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: '2n' });
					assert.deepStrictEqual(tokens[2][6], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[3][3], { scopes: ['source.css', 'meta.selector.css', 'support.constant.parity.css'], value: 'even' });
				});

				it('tokenizes :nth-of-type()', function () {
					var tokens;
					tokens = testGrammar.tokenizeLines('img:nth-of-type(+n+1)\nimg:nth-of-type(-n+1)\nimg:nth-of-type(n+1)');
					assert.deepStrictEqual(tokens[0][1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(tokens[0][2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'nth-of-type' });
					assert.deepStrictEqual(tokens[0][3], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[0][4], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: '+n+1' });
					assert.deepStrictEqual(tokens[0][5], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[1][4], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: '-n+1' });
					assert.deepStrictEqual(tokens[2][4], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: 'n+1' });
				});

				it('tokenizes ::nth-last-of-type()', function () {
					var tokens;
					tokens = testGrammar.tokenizeLines('h1:nth-last-of-type(-1)\nh1:nth-last-of-type(+2)\nh1:nth-last-of-type(3)');
					assert.deepStrictEqual(tokens[0][1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
					assert.deepStrictEqual(tokens[0][2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'nth-last-of-type' });
					assert.deepStrictEqual(tokens[0][3], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[0][4], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: '-1' });
					assert.deepStrictEqual(tokens[0][5], { scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					assert.deepStrictEqual(tokens[1][4], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: '+2' });
					assert.deepStrictEqual(tokens[2][4], { scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css'], value: '3' });
				});
			});
		});

		describe('pseudo-elements', function () {
			it('tokenizes both : and :: notations for pseudo-elements introduced in CSS 1 and 2', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('.opening:first-letter').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'opening' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css'], value: ':' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'first-letter' });

				tokens = testGrammar.tokenizeLine('q::after').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'q' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css'], value: '::' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'after' });
			});

			it('tokenizes both : and :: notations for vendor-prefixed pseudo-elements', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine(':-ms-input-placeholder').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css'], value: ':' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: '-ms-input-placeholder' });

				tokens = testGrammar.tokenizeLine('::-webkit-input-placeholder').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css'], value: '::' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: '-webkit-input-placeholder' });
			});

			it('only tokenizes the :: notation for other pseudo-elements', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('::selection').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css'], value: '::' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'selection' });

				tokens = testGrammar.tokenizeLine(':selection').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css'], value: ':selection' });
			});
		});
		describe('compound selectors', function () {
			it('tokenizes the combination of type selectors followed by class selectors', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('very-custom.class').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css'], value: 'very-custom' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'class' });
			});

			it('tokenizes the combination of type selectors followed by pseudo-classes', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('very-custom:hover').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css'], value: 'very-custom' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'hover' });
			});

			it('tokenizes the combination of type selectors followed by pseudo-elements', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('very-custom::shadow').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css'], value: 'very-custom' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css'], value: '::' });
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'shadow' });
			});
		});
	});

	describe('property lists (declaration blocks)', function () {
		it('tokenizes inline property lists', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('div { font-size: inherit; }').tokens;
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'font-size' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'inherit' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
			assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
		});

		it('tokenizes compact inline property lists', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('div{color:inherit;float:left}').tokens;
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'color' });
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'inherit' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'float' });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'left' });
			assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
		});

		it('tokenizes multiple inline property lists', function () {
			var tokens;
			tokens = testGrammar.tokenizeLines('very-custom { color: inherit }\nanother-one  {  display  :  none  ;  }');
			assert.deepStrictEqual(tokens[0][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css'], value: 'very-custom' });
			assert.deepStrictEqual(tokens[0][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'color' });
			assert.deepStrictEqual(tokens[0][5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[0][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'inherit' });
			assert.deepStrictEqual(tokens[0][8], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][9], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
			assert.deepStrictEqual(tokens[1][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css'], value: 'another-one' });
			assert.deepStrictEqual(tokens[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'display' });
			assert.deepStrictEqual(tokens[1][5], { scopes: ['source.css', 'meta.property-list.css'], value: '  ' });
			assert.deepStrictEqual(tokens[1][6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[1][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'none' });
			assert.deepStrictEqual(tokens[1][9], { scopes: ['source.css', 'meta.property-list.css'], value: '  ' });
			assert.deepStrictEqual(tokens[1][10], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
			assert.deepStrictEqual(tokens[1][12], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
		});

		it('tokenizes custom properties', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine(':root { --white: #FFF; }').tokens;
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'variable.css'], value: '--white' });
		});

		it('tokenises commas between property values', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a{ text-shadow: a, b; }').tokens;
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.separator.list.comma.css'], value: ',' });
		});

		it('tokenises superfluous semicolons', function () {
			var i, j, lines;
			lines = testGrammar.tokenizeLines('.test{   width:  20em;;;;;;;;;\n;;;;;;;;;height: 10em; }');
			for (i = j = 0; j <= 8; i = ++j) {
				assert.deepStrictEqual(lines[0][i + 9], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
				assert.deepStrictEqual(lines[1][i], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
			}
			assert.deepStrictEqual(lines[1][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'height' });
		});

		describe('values', function () {
			it('tokenizes color keywords', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('#jon { color: snow; }').tokens;
				assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.color.w3c-extended-color-name.css'], value: 'snow' });
			});

			it('tokenises RGBA values in hex notation', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('p{ color: #f030; }').tokens;
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css'], value: '#' });
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.color.rgb-value.hex.css'], value: 'f030' });
				assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
				assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });

				tokens = testGrammar.tokenizeLine('a{ color: #CAFEBABE; }').tokens;
				assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
				assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'color' });
				assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css'], value: '#' });
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.color.rgb-value.hex.css'], value: 'CAFEBABE' });
				assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
				assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });

				tokens = testGrammar.tokenizeLine('a{ color: #CAFEBABEF; }').tokens;
				assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: '#CAFEBABEF' });
			});

			it('tokenizes common font names', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('p { font-family: Verdana, Helvetica, sans-serif; }').tokens;
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.font-name.css'], value: 'Verdana' });
				assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.font-name.css'], value: 'Helvetica' });
				assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.font-name.css'], value: 'sans-serif' });
			});

			it('tokenizes predefined list style types', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('ol.myth { list-style-type: cjk-earthly-branch }').tokens;
				assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.list-style-type.css'], value: 'cjk-earthly-branch' });
			});

			it('tokenizes numeric values', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('div { font-size: 14px; }').tokens;
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '14' });
				assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
			});

			it('does not tokenize invalid numeric values', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('div { font-size: test14px; }').tokens;
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: 'test14px' });

				tokens = testGrammar.tokenizeLine('div { font-size: test-14px; }').tokens;
				assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: 'test-14px' });
			});

			it('tokenizes vendor-prefixed values', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('.edge { cursor: -webkit-zoom-in; }').tokens;
				assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.vendored.property-value.css'], value: '-webkit-zoom-in' });

				tokens = testGrammar.tokenizeLine('.edge { width: -moz-min-content; }').tokens;
				assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.vendored.property-value.css'], value: '-moz-min-content' });

				tokens = testGrammar.tokenizeLine('.edge { display: -ms-grid; }').tokens;
				assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.vendored.property-value.css'], value: '-ms-grid' });
			});

			it('tokenizes custom variables', function () {
				var tokens;
				tokens = testGrammar.tokenizeLine('div { color: var(--primary-color) }').tokens;
				assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'variable.argument.css'], value: '--primary-color' });
			});

			it('tokenises numeric values correctly', function () {
				var lines;
				lines = testGrammar.tokenizeLines(".a   { a:       12em  }\n.a   { a:     4.01ex  }\n.a   { a:   -456.8ch  }\n.a   { a:      0.0REM }\n.a   { a:     +0.0vh  }\n.a   { a:     -0.0vw  }\n.a   { a:       .6px  }\n.a   { a:     10e3mm  }\n.a   { a:     10E3cm  }\n.a   { a:  -3.4e+2In  }\n.a   { a:  -3.4e-2ch  }\n.a   { a:    +.5E-2%  }\n.a   { a:   -3.4e-2%  }");
				assert.deepStrictEqual(lines[0][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '12' });
				assert.deepStrictEqual(lines[0][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
				assert.deepStrictEqual(lines[1][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '4.01' });
				assert.deepStrictEqual(lines[1][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.ex.css'], value: 'ex' });
				assert.deepStrictEqual(lines[2][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '-456.8' });
				assert.deepStrictEqual(lines[2][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.ch.css'], value: 'ch' });
				assert.deepStrictEqual(lines[3][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '0.0' });
				assert.deepStrictEqual(lines[3][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.rem.css'], value: 'REM' });
				assert.deepStrictEqual(lines[4][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '+0.0' });
				assert.deepStrictEqual(lines[4][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.vh.css'], value: 'vh' });
				assert.deepStrictEqual(lines[5][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '-0.0' });
				assert.deepStrictEqual(lines[5][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.vw.css'], value: 'vw' });
				assert.deepStrictEqual(lines[6][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '.6' });
				assert.deepStrictEqual(lines[6][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
				assert.deepStrictEqual(lines[7][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '10e3' });
				assert.deepStrictEqual(lines[7][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.mm.css'], value: 'mm' });
				assert.deepStrictEqual(lines[8][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '10E3' });
				assert.deepStrictEqual(lines[8][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.cm.css'], value: 'cm' });
				assert.deepStrictEqual(lines[9][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '-3.4e+2' });
				assert.deepStrictEqual(lines[9][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.in.css'], value: 'In' });
				assert.deepStrictEqual(lines[10][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '-3.4e-2' });
				assert.deepStrictEqual(lines[10][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.ch.css'], value: 'ch' });
				assert.deepStrictEqual(lines[11][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '+.5E-2' });
				assert.deepStrictEqual(lines[11][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
				assert.deepStrictEqual(lines[12][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '-3.4e-2' });
				assert.deepStrictEqual(lines[12][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
			});

			describe('functional notation', function () {
				describe('attr()', function () {
					it('tokenises parameters correctly and case-insensitively', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('a{content:aTTr(data-width px, inherit)}').tokens;
						assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'aTTr' });
						assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css'], value: 'data-width' });
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css'], value: 'px' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.constant.property-value.css'], value: 'inherit' });
						assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					});

					it('matches variables', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('a{content:ATTR(VAR(--name) px, "N/A")}').tokens;
						assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'ATTR' });
						assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'meta.function.variable.css', 'support.function.misc.css'], value: 'VAR' });
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'meta.function.variable.css', 'variable.argument.css'], value: '--name' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css'], value: 'px' });
						assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
						assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css'], value: 'N/A' });
						assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
						assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					});
				});

				describe('calc()', function () {
					it('tokenises calculations', function () {
						var lines;
						lines = testGrammar.tokenizeLines("a{\n  width: calc(3px + -1em);\n  width: calc(3px - -1em);\n  width: calc(3px * 2);\n  width: calc(3px / 2);\n}");
						assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'support.function.calc.css'], value: 'calc' });
						assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css'], value: '3' });
						assert.deepStrictEqual(lines[1][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
						assert.deepStrictEqual(lines[1][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css'], value: '+' });
						assert.deepStrictEqual(lines[1][11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css'], value: '-1' });
						assert.deepStrictEqual(lines[1][12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
						assert.deepStrictEqual(lines[1][13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[2][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css'], value: '-' });
						assert.deepStrictEqual(lines[2][11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css'], value: '-1' });
						assert.deepStrictEqual(lines[2][12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
						assert.deepStrictEqual(lines[3][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
						assert.deepStrictEqual(lines[3][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css'], value: '*' });
						assert.deepStrictEqual(lines[4][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
						assert.deepStrictEqual(lines[4][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css'], value: '/' });
						assert.deepStrictEqual(lines[4][11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css'], value: '2' });
					});

					it('requires whitespace around + and - operators', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('a{ width: calc(3px+1em); }').tokens;
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css'], value: '+' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css'], value: '1' });
						assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });

						tokens = testGrammar.tokenizeLine('a{ width: calc(3px--1em); height: calc(10-1em);}').tokens;
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css'], value: '--1em' });
						assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css'], value: '10' });
						assert.deepStrictEqual(tokens[20], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css'], value: '-1em' });
					});

					it('does not require whitespace around * and / operators', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('a{ width: calc(3px*2); }').tokens;
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css'], value: '*' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css'], value: '2' });

						tokens = testGrammar.tokenizeLine('a{ width: calc(3px/2); }').tokens;
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css'], value: '/' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css'], value: '2' });
					});

					it('matches variable expansions inside calculations', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('.foo { margin-top: calc(var(--gap) + 1px); }').tokens;
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'support.function.calc.css'], value: 'calc' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'meta.function.variable.css', 'support.function.misc.css'], value: 'var' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'meta.function.variable.css', 'variable.argument.css'], value: '--gap' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css'], value: '+' });
						assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css'], value: '1' });
						assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
						assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(tokens[20], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
						assert.deepStrictEqual(tokens[22], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					});
				});

				describe('colours', function () {
					it('tokenises colour functions correctly', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('a{ color: rgb(187,255,221); }').tokens;
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'rgb' });
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '187' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '255' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '221' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });

						tokens = testGrammar.tokenizeLine('a{ color: RGBa( 100%, 0% ,20.17% ,.5 ); }').tokens;
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'RGBa' });
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '100' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '0' });
						assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
						assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '20.17' });
						assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
						assert.deepStrictEqual(tokens[20], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[21], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '.5' });
						assert.deepStrictEqual(tokens[23], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });

						tokens = testGrammar.tokenizeLine('a{color:HSL(0,  00100%,50%)}').tokens;
						assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'HSL' });
						assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '0' });
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '00100' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '50' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
						assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });

						tokens = testGrammar.tokenizeLine('a{color:HSLa(2,.0%,1%,.7)}').tokens;
						assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'HSLa' });
						assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '2' });
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '.0' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '1' });
						assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '.7' });
						assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					});

					it('matches variables as colour components', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('a{ color: RGBA(var(--red), 0% , 20%, .2)}').tokens;
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'support.function.misc.css'], value: 'var' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'variable.argument.css'], value: '--red' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
					});

					it('matches comments between colour components', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('a{ color: rgba(/**/255/*=*/,0,/*2.2%*/51/*,*/0.2)}').tokens;
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '255' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css'], value: '=' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(tokens[20], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '51' });
						assert.deepStrictEqual(tokens[21], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(tokens[22], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css'], value: ',' });
						assert.deepStrictEqual(tokens[23], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(tokens[24], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css'], value: '0.2' });
					});

					it('allows colour components to be split across lines', function () {
						var lines;
						lines = testGrammar.tokenizeLines(".frost{\n  background-color: rgba(\n    var(--red),    /* Red */\n    var(--green),  /* Green */\n    var(--blue),   /* Blue */\n    /* var(--test),\n    /**/var(--opacity) /* Transparency */\n  );\n}");
						assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'rgba' });
						assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'support.function.misc.css'], value: 'var' });
						assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[2][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'variable.argument.css'], value: '--red' });
						assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[2][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css'], value: ' Red ' });
						assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'support.function.misc.css'], value: 'var' });
						assert.deepStrictEqual(lines[3][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'variable.argument.css'], value: '--green' });
						assert.deepStrictEqual(lines[3][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[3][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css'], value: ' Green ' });
						assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'support.function.misc.css'], value: 'var' });
						assert.deepStrictEqual(lines[4][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[4][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'variable.argument.css'], value: '--blue' });
						assert.deepStrictEqual(lines[4][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[4][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[4][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css'], value: ' Blue ' });
						assert.deepStrictEqual(lines[4][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(lines[5][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(lines[5][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css'], value: ' var(--test),' });
						assert.deepStrictEqual(lines[6][0], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css'], value: '    /*' });
						assert.deepStrictEqual(lines[6][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(lines[6][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'support.function.misc.css'], value: 'var' });
						assert.deepStrictEqual(lines[6][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[6][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'variable.argument.css'], value: '--opacity' });
						assert.deepStrictEqual(lines[6][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[6][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(lines[6][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css'], value: ' Transparency ' });
						assert.deepStrictEqual(lines[6][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(lines[7][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					});
				});

				describe('gradients', function () {
					it('tokenises linear gradients', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('a{ background-image: linear-gradient( 45deg, blue, red ); }').tokens;
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css'], value: 'linear-gradient' });
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css'], value: '45' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.deg.css'], value: 'deg' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.color.w3c-standard-color-name.css'], value: 'blue' });
						assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.color.w3c-standard-color-name.css'], value: 'red' });
						assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });

						tokens = testGrammar.tokenizeLine('a{ background-image: LINear-graDIEnt( ellipse to left top, blue, red);').tokens;
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css'], value: 'LINear-graDIEnt' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css'], value: 'ellipse' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'keyword.operator.gradient.css'], value: 'to' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css'], value: 'left' });
						assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css'], value: 'top' });
						assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.color.w3c-standard-color-name.css'], value: 'blue' });
						assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[21], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.color.w3c-standard-color-name.css'], value: 'red' });
					});

					it('tokenises radial gradients', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('a{ background-image: radial-gradient(farthest-corner at 45px 45px , #f00 0%, #00f 100%);}').tokens;
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css'], value: 'radial-gradient' });
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css'], value: 'farthest-corner' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'keyword.operator.gradient.css'], value: 'at' });
						assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css'], value: '45' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
						assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css'], value: '45' });
						assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
						assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[20], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css'], value: '#' });
						assert.deepStrictEqual(tokens[21], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css'], value: 'f00' });
						assert.deepStrictEqual(tokens[23], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css'], value: '0' });
						assert.deepStrictEqual(tokens[24], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });

						tokens = testGrammar.tokenizeLine('a{ background-image: RADial-gradiENT(16px at 60px 50%,#000 0%, #000 14px, rgba(0,0,0,.3) 18px, transparent 19px)}').tokens;
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css'], value: 'RADial-gradiENT' });
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css'], value: '16' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'keyword.operator.gradient.css'], value: 'at' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css'], value: '60' });
						assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
						assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css'], value: '50' });
						assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
						assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css'], value: '#' });
						assert.deepStrictEqual(tokens[20], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css'], value: '000' });
						assert.deepStrictEqual(tokens[33], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'rgba' });
						assert.deepStrictEqual(tokens[34], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[35], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'constant.numeric.css'], value: '0' });
						assert.deepStrictEqual(tokens[36], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[41], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'constant.numeric.css'], value: '.3' });
						assert.deepStrictEqual(tokens[42], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(tokens[48], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css'], value: 'transparent' });
					});

					it('matches gradients that span multiple lines with injected comments', function () {
						var lines;
						lines = testGrammar.tokenizeLines("a{\n  background-image: raDIAL-gradiENT(\n    ellipse farthest-corner/*@*/at/*@*/470px 47px,/*===\n========*/#FFFF80 20%, rgba(204, 153, 153, 0.4) 30%,/*))))))))}*/#E6E6FF 60%); }");
						assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css'], value: 'raDIAL-gradiENT' });
						assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css'], value: 'ellipse' });
						assert.deepStrictEqual(lines[2][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css'], value: 'farthest-corner' });
						assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css'], value: '@' });
						assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(lines[2][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'keyword.operator.gradient.css'], value: 'at' });
						assert.deepStrictEqual(lines[2][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(lines[2][11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css'], value: '470' });
						assert.deepStrictEqual(lines[2][12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
						assert.deepStrictEqual(lines[2][16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[2][17], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(lines[2][18], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css'], value: '===' });
						assert.deepStrictEqual(lines[3][0], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css'], value: '========' });
						assert.deepStrictEqual(lines[3][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css'], value: '#' });
						assert.deepStrictEqual(lines[3][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css'], value: 'FFFF80' });
						assert.deepStrictEqual(lines[3][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'rgba' });
						assert.deepStrictEqual(lines[3][10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[3][20], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'constant.numeric.css'], value: '0.4' });
						assert.deepStrictEqual(lines[3][21], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[3][26], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(lines[3][27], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css'], value: '))))))))}' });
						assert.deepStrictEqual(lines[3][28], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(lines[3][29], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css'], value: '#' });
						assert.deepStrictEqual(lines[3][30], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css'], value: 'E6E6FF' });
					});

					it('highlights vendored gradient functions', function () {
						var lines;
						lines = testGrammar.tokenizeLines(".grad {\n  background-image: -webkit-linear-gradient(top,  /* For Chrome 25 and Safari 6, iOS 6.1, Android 4.3 */ hsl(0, 80%, 70%), #bada55);\n  background-image:    -moz-linear-gradient(top,  /* For Firefox (3.6 to 15) */ hsl(0, 80%, 70%), #bada55);\n  background-image:      -o-linear-gradient(top,  /* For old Opera (11.1 to 12.0) */  hsl(0, 80%, 70%), #bada55);\n}");
						assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css'], value: '-webkit-linear-gradient' });
						assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css'], value: 'top' });
						assert.deepStrictEqual(lines[1][10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css'], value: ' For Chrome 25 and Safari 6, iOS 6.1, Android 4.3 ' });
						assert.deepStrictEqual(lines[1][13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'hsl' });
						assert.deepStrictEqual(lines[1][22], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'constant.numeric.css'], value: '70' });
						assert.deepStrictEqual(lines[1][23], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
						assert.deepStrictEqual(lines[1][24], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[1][27], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css'], value: '#' });
						assert.deepStrictEqual(lines[1][28], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css'], value: 'bada55' });
						assert.deepStrictEqual(lines[1][29], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css'], value: '-moz-linear-gradient' });
						assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css'], value: 'top' });
						assert.deepStrictEqual(lines[2][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[2][10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css'], value: ' For Firefox (3.6 to 15) ' });
						assert.deepStrictEqual(lines[2][13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'hsl' });
						assert.deepStrictEqual(lines[2][14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[2][24], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[2][29], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[3][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css'], value: '-o-linear-gradient' });
						assert.deepStrictEqual(lines[3][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[3][10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css'], value: ' For old Opera (11.1 to 12.0) ' });
						assert.deepStrictEqual(lines[3][13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'hsl' });
						assert.deepStrictEqual(lines[3][14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					});

					it('highlights antique Webkit syntax as deprecated', function () {
						var lines;
						lines = testGrammar.tokenizeLines(".grad {\n  background-image: -webkit-gradient(linear, 0% 0%, 0% 100%,\n    from( rgb(0, 171, 235)),\n    color-stop(0.5, rgb(255, 255, 255)),\n    color-stop(0.5, rgb(102, 204, 0)),\n    to(rgb(255, 255, 255))),\n    -webkit-gradient(radial, 45 45, 10, 52 50, 30, from(#A7D30C), to(rgba(1,159,98,0)), color-stop(90%, #019F62)),\n        -webkit-gradient(radial, 105 105, 20, 112 120, 50, from(#ff5f98), to(rgba(255,1,136,0)), color-stop(75%, #ff0188)),\n        -webkit-gradient(radial, 95 15, 15, 102 20, 40, from(#00c9ff), to(rgba(0,201,255,0)), color-stop(80%, #00b5e2)),\n        -webkit-gradient(radial, 0 150, 50, 0 140, 90, from(#f4f201), to(rgba(228, 199,0,0)), color-stop(80%, #e4c700));\n}");
						assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.gradient.function.css'], value: '-webkit-gradient' });
						assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'support.constant.property-value.css'], value: 'linear' });
						assert.deepStrictEqual(lines[1][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[1][19], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css'], value: '100' });
						assert.deepStrictEqual(lines[1][20], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
						assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.function.css'], value: 'from' });
						assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'rgb' });
						assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[2][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'constant.numeric.css'], value: '171' });
						assert.deepStrictEqual(lines[2][10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[2][14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.function.css'], value: 'color-stop' });
						assert.deepStrictEqual(lines[3][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[3][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css'], value: '0.5' });
						assert.deepStrictEqual(lines[3][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[3][16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[3][17], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.function.css'], value: 'color-stop' });
						assert.deepStrictEqual(lines[4][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[4][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css'], value: '0.5' });
						assert.deepStrictEqual(lines[4][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[4][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'rgb' });
						assert.deepStrictEqual(lines[4][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[4][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'constant.numeric.css'], value: '102' });
						assert.deepStrictEqual(lines[4][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[4][11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'constant.numeric.css'], value: '204' });
						assert.deepStrictEqual(lines[4][12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[4][14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'constant.numeric.css'], value: '0' });
						assert.deepStrictEqual(lines[4][15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[4][16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[4][17], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[5][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.function.css'], value: 'to' });
						assert.deepStrictEqual(lines[5][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[5][12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[5][13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[5][14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[5][15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[6][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.gradient.function.css'], value: '-webkit-gradient' });
						assert.deepStrictEqual(lines[6][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[6][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'support.constant.property-value.css'], value: 'radial' });
						assert.deepStrictEqual(lines[6][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[6][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css'], value: '45' });
						assert.deepStrictEqual(lines[6][31], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'support.function.misc.css'], value: 'rgba' });
						assert.deepStrictEqual(lines[7][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.gradient.function.css'], value: '-webkit-gradient' });
						assert.deepStrictEqual(lines[7][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[9][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.gradient.function.css'], value: '-webkit-gradient' });
						assert.deepStrictEqual(lines[9][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[9][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'support.constant.property-value.css'], value: 'radial' });
						assert.deepStrictEqual(lines[9][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[9][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css'], value: '0' });
						assert.deepStrictEqual(lines[9][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css'], value: '150' });
						assert.deepStrictEqual(lines[9][54], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[9][55], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
						assert.deepStrictEqual(lines[10][0], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					});
				});

				describe('other functions', function () {
					it('tokenises basic-shape functions', function () {
						var lines;
						lines = testGrammar.tokenizeLines("a{\n  shape-outside: circle(20em/*=*/at 50% 50%);\n  shape-outside: inset(1em, 1em, 1em, 1em);\n}");
						assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'support.function.shape.css'], value: 'circle' });
						assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css'], value: '20' });
						assert.deepStrictEqual(lines[1][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
						assert.deepStrictEqual(lines[1][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(lines[1][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'comment.block.css'], value: '=' });
						assert.deepStrictEqual(lines[1][10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(lines[1][11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'keyword.operator.shape.css'], value: 'at' });
						assert.deepStrictEqual(lines[1][13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css'], value: '50' });
						assert.deepStrictEqual(lines[1][14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
						assert.deepStrictEqual(lines[1][16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css'], value: '50' });
						assert.deepStrictEqual(lines[1][17], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css'], value: '%' });
						assert.deepStrictEqual(lines[1][18], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'support.function.shape.css'], value: 'inset' });
						assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css'], value: '1' });
						assert.deepStrictEqual(lines[2][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
						assert.deepStrictEqual(lines[2][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[2][10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css'], value: '1' });
						assert.deepStrictEqual(lines[2][11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
						assert.deepStrictEqual(lines[2][12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[2][14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css'], value: '1' });
						assert.deepStrictEqual(lines[2][15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
						assert.deepStrictEqual(lines[2][16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[2][18], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css'], value: '1' });
						assert.deepStrictEqual(lines[2][19], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
						assert.deepStrictEqual(lines[2][20], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					});
					it('tokenises OpenType feature functions', function () {
						var lines;
						lines = testGrammar.tokenizeLines(".font{\n  font-variant-alternates: stylistic(user-defined-ident);\n  font-variant-alternates: styleset(user-defined-ident);\n  font-variant-alternates: character-variant(user-defined-ident);\n  font-variant-alternates: swash(user-defined-ident);\n  font-variant-alternates: ornaments(user-defined-ident);\n  font-variant-alternates: annotation(user-defined-ident);\n  font-variant-alternates: swash(ident1) annotation(ident2);\n}");
						assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'stylistic' });
						assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css'], value: 'user-defined-ident' });
						assert.deepStrictEqual(lines[1][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'styleset' });
						assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css'], value: 'user-defined-ident' });
						assert.deepStrictEqual(lines[2][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[3][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'character-variant' });
						assert.deepStrictEqual(lines[3][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[3][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css'], value: 'user-defined-ident' });
						assert.deepStrictEqual(lines[3][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[4][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'swash' });
						assert.deepStrictEqual(lines[4][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[4][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css'], value: 'user-defined-ident' });
						assert.deepStrictEqual(lines[4][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[5][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'ornaments' });
						assert.deepStrictEqual(lines[5][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[5][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css'], value: 'user-defined-ident' });
						assert.deepStrictEqual(lines[5][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[6][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'annotation' });
						assert.deepStrictEqual(lines[6][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[6][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css'], value: 'user-defined-ident' });
						assert.deepStrictEqual(lines[6][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[7][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'swash' });
						assert.deepStrictEqual(lines[7][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[7][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css'], value: 'ident1' });
						assert.deepStrictEqual(lines[7][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[7][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'annotation' });
						assert.deepStrictEqual(lines[7][10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[7][11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css'], value: 'ident2' });
						assert.deepStrictEqual(lines[7][12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					});

					it('tokenises image-set()', function () {
						var lines;
						lines = testGrammar.tokenizeLines("a{\n    background-image: image-set( \"foo.png\" 1x,\n                                 \"foo-2x.png\" 2x,\n                                 \"foo-print.png\" 600dpi );\n}");
						assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
						assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
						assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'background-image' });
						assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
						assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'image-set' });
						assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(lines[1][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
						assert.deepStrictEqual(lines[1][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css'], value: 'foo.png' });
						assert.deepStrictEqual(lines[1][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
						assert.deepStrictEqual(lines[1][11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'constant.numeric.other.density.css'], value: '1x' });
						assert.deepStrictEqual(lines[1][12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
						assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css'], value: 'foo-2x.png' });
						assert.deepStrictEqual(lines[2][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
						assert.deepStrictEqual(lines[2][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'constant.numeric.other.density.css'], value: '2x' });
						assert.deepStrictEqual(lines[2][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
						assert.deepStrictEqual(lines[3][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css'], value: 'foo-print.png' });
						assert.deepStrictEqual(lines[3][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
						assert.deepStrictEqual(lines[3][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'constant.numeric.css'], value: '600' });
						assert.deepStrictEqual(lines[3][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'constant.numeric.css', 'keyword.other.unit.dpi.css'], value: 'dpi' });
						assert.deepStrictEqual(lines[3][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(lines[3][9], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
						assert.deepStrictEqual(lines[4][0], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
					});
				});

				describe('timing-functions', function () {
					it('tokenises them correctly', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('a{ zoom: cubic-bezier(/**/1.2,/*=*/0,0,0/**/)}').tokens;
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'support.function.timing-function.css'], value: 'cubic-bezier' });
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'constant.numeric.css'], value: '1.2' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css'], value: '=' });
						assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'constant.numeric.css'], value: '0' });
						assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'constant.numeric.css'], value: '0' });
						assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'constant.numeric.css'], value: '0' });
						assert.deepStrictEqual(tokens[20], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(tokens[21], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(tokens[22], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					});

					it('highlights the "start" and "end" keywords', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('a{ before: steps(0, start); after: steps(1, end); }').tokens;
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'support.function.timing-function.css'], value: 'steps' });
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'constant.numeric.css'], value: '0' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'support.constant.step-direction.css'], value: 'start' });
						assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(tokens[23], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'support.constant.step-direction.css'], value: 'end' });
					});
				});

				describe('variables', function () {
					it('scopes var() statements as variables', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('a{color: var(--name)}').tokens;
						assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
						assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
						assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'color' });
						assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
						assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'support.function.misc.css'], value: 'var' });
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'variable.argument.css'], value: '--name' });
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });

						tokens = testGrammar.tokenizeLine('a{color: var(  --name  )}').tokens;
						assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'support.function.misc.css'], value: 'var' });
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'variable.argument.css'], value: '--name' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					});

					it('allows injected comments', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('a{ color: var( /*=*/ --something ) }').tokens;
						assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'support.function.misc.css'], value: 'var' });
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'comment.block.css'], value: '=' });
						assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'variable.argument.css'], value: '--something' });
						assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
					});

					it('tokenises fallback values', function () {
						var tokens;
						tokens = testGrammar.tokenizeLine('.bar{ width: var(--page-width, /*;;;);*/ 2); }').tokens;
						assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'support.function.misc.css'], value: 'var' });
						assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
						assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'variable.argument.css'], value: '--page-width' });
						assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.separator.list.comma.css'], value: ',' });
						assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
						assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'comment.block.css'], value: ';;;);' });
						assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
						assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'constant.numeric.css'], value: '2' });
						assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
						assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					});
				});

				it('does not tokenise functions with whitespace between name and parameters', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('a{ p: attr (title); }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css'], value: 'p' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: 'attr (title' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css'], value: ')' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });

					tokens = testGrammar.tokenizeLine('a{url:url (s)}').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css'], value: 'url' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: 'url (s' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css'], value: ')' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });

					tokens = testGrammar.tokenizeLine('a{content:url ("http://github.com/");}').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'content' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: 'url (' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css'], value: 'http://github.com/' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css'], value: ')' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });

					tokens = testGrammar.tokenizeLine('a{content: url (http://a.pl/)}').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'content' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: 'url (http://a.pl/' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css'], value: ')' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });

					tokens = testGrammar.tokenizeLine('a{ color: rgb (187,255,221); }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'color' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: 'rgb (' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '187' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.separator.list.comma.css'], value: ',' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '255' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.separator.list.comma.css'], value: ',' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '221' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css'], value: ')' });
					assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
					assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
				});
			});
			describe('Unicode ranges', function () {
				it('tokenises single codepoints', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('a{ a: U+A5 }').tokens;
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css'], value: 'U+A5' });
				});

				it('tokenises codepoint ranges', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('a{ a: U+0025-00FF }').tokens;
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css'], value: 'U+0025' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css', 'punctuation.separator.dash.unicode-range.css'], value: '-' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css'], value: '00FF' });

					tokens = testGrammar.tokenizeLine('a{ unicode-range: u+0-7F }').tokens;
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css'], value: 'u+0' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css', 'punctuation.separator.dash.unicode-range.css'], value: '-' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css'], value: '7F' });
				});

				it('tokenises wildcard ranges', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('a{ unicode-range: U+4?? }').tokens;
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css'], value: 'U+4??' });

					tokens = testGrammar.tokenizeLine('a{ unicode-range: U+0025-00FF, U+4?? }').tokens;
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css'], value: 'U+0025' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css', 'punctuation.separator.dash.unicode-range.css'], value: '-' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css'], value: '00FF' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.separator.list.comma.css'], value: ',' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css'], value: 'U+4??' });
				});
			});
		});
	});

	describe('escape sequences', function () {
		it('tokenizes escape sequences in single-quoted strings', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine("very-custom { content: '\\c0ffee' }").tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css'], value: 'very-custom' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css'], value: ' ' });
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'content' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css'], value: "'" });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'constant.character.escape.codepoint.css'], value: '\\c0ffee' });
		});

		it('tokenizes escape sequences in double-quoted strings', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('very-custom { content: "\\c0ffee" }').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css'], value: 'very-custom' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css'], value: ' ' });
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'content' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'constant.character.escape.codepoint.css'], value: '\\c0ffee' });
		});

		it('tokenises escape sequences in selectors', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('\\61 \\{ {  } \\}').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'constant.character.escape.codepoint.css'], value: '\\61' });
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'constant.character.escape.css'], value: '\\{' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'constant.character.escape.css'], value: '\\}' });

			tokens = testGrammar.tokenizeLine('\\61\\ \\. \\@media {}').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'constant.character.escape.codepoint.css'], value: '\\61' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'constant.character.escape.css'], value: '\\ ' });
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'constant.character.escape.css'], value: '\\.' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'constant.character.escape.css'], value: '\\@' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css'], value: 'media' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css'], value: ' ' });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
		});

		it('tokenises escape sequences in property lists', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a { \\77\\69\\64\\74\\68: 20px; }').tokens;
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'constant.character.escape.codepoint.css'], value: '\\77' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'constant.character.escape.codepoint.css'], value: '\\69' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'constant.character.escape.codepoint.css'], value: '\\64' });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'constant.character.escape.codepoint.css'], value: '\\74' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'constant.character.escape.codepoint.css'], value: '\\68' });
			assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
		});

		it('tokenises escape sequences in property values', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a { content: \\1F764; }').tokens;
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.character.escape.codepoint.css'], value: '\\1F764' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
			assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
		});
	});

	describe('unclosed strings', function () {
		it('highlights an unterminated string as an error', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine("a{ content: 'aaaa").tokens;
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css'], value: "'" });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'invalid.illegal.unclosed.string.css'], value: 'aaaa' });

			tokens = testGrammar.tokenizeLine('a{ content: "aaaa').tokens;
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'invalid.illegal.unclosed.string.css'], value: 'aaaa' });
		});

		it.skip("knows when a string is line-wrapped - a", function () {
			var lines;
			lines = testGrammar.tokenizeLines("a{\n  content: \"aaaaa\\\\\\\naaa\"; color: red;\n}");
			assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
			assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css'], value: 'aaaaa' });
			assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'constant.character.escape.css'], value: '\\\\' });
			assert.deepStrictEqual(lines[1][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'constant.character.escape.newline.css'], value: '\\' });
			assert.deepStrictEqual(lines[2][0], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css'], value: 'aaa' });
			assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
			assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
			assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'color' });
		});

		it.skip("knows when a string is line-wrapped - b", function () {
			var lines;
			lines = testGrammar.tokenizeLines("a{\n  content: 'aaaaa\\\\\\\naaa'; color: red;\n}");
			assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css'], value: "'" });
			assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css'], value: 'aaaaa' });
			assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'constant.character.escape.css'], value: '\\\\' });
			assert.deepStrictEqual(lines[1][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'constant.character.escape.newline.css'], value: '\\' });
			assert.deepStrictEqual(lines[2][0], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css'], value: 'aaa' });
			assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css'], value: "'" });
			assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
			assert.deepStrictEqual(lines[2][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'color' });
		});

		it('highlights escape sequences inside invalid strings', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a{ content: "aaa\\"aa').tokens;
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'invalid.illegal.unclosed.string.css'], value: 'aaa' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'invalid.illegal.unclosed.string.css', 'constant.character.escape.css'], value: '\\"' });
			assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'invalid.illegal.unclosed.string.css'], value: 'aa' });

			tokens = testGrammar.tokenizeLine("a{ content: 'aaa\\'aa").tokens;
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css'], value: "'" });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'invalid.illegal.unclosed.string.css'], value: 'aaa' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'invalid.illegal.unclosed.string.css', 'constant.character.escape.css'], value: "\\'" });
			assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'invalid.illegal.unclosed.string.css'], value: 'aa' });
		});

		it.skip('highlights unclosed lines in line-wrapped strings', function () {
			var lines;
			lines = testGrammar.tokenizeLines("a{\n  content: \"aaa\\\"aa\\\naaaa\naaaa; color: red;\n}");
			assert.deepStrictEqual(lines[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
			assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css'], value: 'aaa' });
			assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'constant.character.escape.css'], value: '\\"' });
			assert.deepStrictEqual(lines[1][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css'], value: 'aa' });
			assert.deepStrictEqual(lines[1][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'constant.character.escape.newline.css'], value: '\\' });
			assert.deepStrictEqual(lines[2][0], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'invalid.illegal.unclosed.string.css'], value: 'aaaa' });
			assert.deepStrictEqual(lines[3][0], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: 'aaaa' });
			assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
			assert.deepStrictEqual(lines[3][3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'color' });
			assert.deepStrictEqual(lines[3][4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(lines[3][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css'], value: 'red' });
			assert.deepStrictEqual(lines[3][7], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
			assert.deepStrictEqual(lines[4][0], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
		});
	});

	describe('comments', function () {
		it('tokenises comments inside @import statements', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('@import /* url("name"); */ "1.css";').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css'], value: '@' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css'], value: 'import' });
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css'], value: ' url("name"); ' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css'], value: '1.css' });
			assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
			assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css'], value: ';' });

			tokens = testGrammar.tokenizeLine('@import/*";"*/ url("2.css");').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css'], value: '@' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css'], value: 'import' });
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css'], value: '";"' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'support.function.url.css'], value: 'url' });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
			assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css'], value: '2.css' });
			assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
			assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
			assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css'], value: ';' });

			tokens = testGrammar.tokenizeLine('@import url("3.css") print /* url(";"); */;').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css'], value: '@' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css'], value: 'import' });
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'support.function.url.css'], value: 'url' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css'], value: '3.css' });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
			assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.import.css', 'support.constant.media.css'], value: 'print' });
			assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
			assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css'], value: ' url(";"); ' });
			assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
			assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css'], value: ';' });
		});

		it('tokenises comments inside @font-face statements', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('@font-face/*"{;}"*/{}').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.font-face.css', 'keyword.control.at-rule.font-face.css', 'punctuation.definition.keyword.css'], value: '@' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.font-face.css', 'keyword.control.at-rule.font-face.css'], value: 'font-face' });
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.font-face.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.font-face.css', 'comment.block.css'], value: '"{;}"' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.font-face.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
		});

		it('tokenizes comments before media queries', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('/* comment */ @media').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'comment.block.css'], value: ' comment ' });
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
		});

		it('tokenizes comments after media queries', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('@media/* comment */ ()').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css'], value: ' comment ' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
		});

		it('tokenizes comments inside query lists', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('@media (max-height: 40em/* comment */)').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], value: 'max-height' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css'], value: '40' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.em.css'], value: 'em' });
			assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
			assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css'], value: ' comment ' });
			assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
			assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css'], value: ')' });
		});

		it('tokenizes inline comments', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('section {border:4px/*padding:1px*/}').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'section' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css'], value: ' ' });
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'border' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '4' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
			assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css'], value: 'padding:1px' });
			assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
			assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
		});

		it('tokenizes multi-line comments', function () {
			var lines;
			lines = testGrammar.tokenizeLines("  section {\n    border:4px /*1px;\n    padding:1px*/\n}");
			assert.deepStrictEqual(lines[1][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: ' ' });
			assert.deepStrictEqual(lines[1][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css', 'punctuation.definition.comment.begin.css'], value: '/*' });
			assert.deepStrictEqual(lines[1][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css'], value: '1px;' });
			assert.deepStrictEqual(lines[2][0], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css'], value: '    padding:1px' });
			assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css', 'punctuation.definition.comment.end.css'], value: '*/' });
			assert.deepStrictEqual(lines[3][0], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
		});
	});

	describe('Animations', function () {
		it('does not confuse animation names with predefined keywords', function () {
			var tokens;
			tokens = testGrammar.tokenizeLines('.animated {\n  animation-name: orphan-black;\n  animation-name: line-scale;\n}');
			assert.deepStrictEqual(tokens[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: 'orphan-black' });
			assert.deepStrictEqual(tokens[2][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: 'line-scale' });
		});
	});

	describe('Transforms', function () {
		it('tokenizes transform functions', function () {
			var tokens;
			tokens = testGrammar.tokenizeLines('.transformed {\n  transform: matrix(0, 1.5, -1.5, 0, 0, 100px);\n  transform: rotate(90deg) translateX(100px) scale(1.5);\n}');
			assert.deepStrictEqual(tokens[1][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'transform' });
			assert.deepStrictEqual(tokens[1][2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[1][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.function.transform.css'], value: 'matrix' });
			assert.deepStrictEqual(tokens[1][5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
			assert.deepStrictEqual(tokens[1][6], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '0' });
			assert.deepStrictEqual(tokens[1][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.separator.list.comma.css'], value: ',' });
			assert.deepStrictEqual(tokens[1][12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '-1.5' });
			assert.deepStrictEqual(tokens[1][22], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
			assert.deepStrictEqual(tokens[1][23], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
			assert.deepStrictEqual(tokens[2][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.function.transform.css'], value: 'rotate' });
			assert.deepStrictEqual(tokens[2][10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.function.transform.css'], value: 'translateX' });
			assert.deepStrictEqual(tokens[2][16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.function.transform.css'], value: 'scale' });
		});
	});

	describe("performance regressions", function () {
		it("does not hang when tokenizing invalid input preceding an equals sign", function () {
			var start;
			start = Date.now();
			testGrammar.tokenizeLine('<![CDATA[啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊啊"=');
			assert.ok(Date.now() - start < 5000);
		});

		it("does not hang when tokenizing accidental HTML tags", function () {
			var start;
			start = Date.now();
			testGrammar.tokenizeLines("<body>\n  [}~" + ('ÁÂÃÄÅÆÇÈÊËÍÎ'.repeat(100)) + "\n</body>");
			assert.ok(Date.now() - start < 5000);
		});
	});

	// Skipped because `firstLineRegex.scanner` does not exist in `vscode-textmate`
	describe.skip("firstLineMatch", function () {
		it("recognises Emacs modelines", function () {
			var invalid, j, k, len, len1, line, ref, ref1, valid;
			valid = "#-*- CSS -*-\n#-*- mode: CSS -*-\n/* -*-css-*- */\n// -*- CSS -*-\n/* -*- mode:CSS -*- */\n// -*- font:bar;mode:CSS -*-\n// -*- font:bar;mode:CSS;foo:bar; -*-\n// -*-font:mode;mode:CSS-*-\n// -*- foo:bar mode: css bar:baz -*-\n\" -*-foo:bar;mode:css;bar:foo-*- \";\n\" -*-font-mode:foo;mode:css;foo-bar:quux-*-\"\n\"-*-font:x;foo:bar; mode : CsS; bar:foo;foooooo:baaaaar;fo:ba;-*-\";\n\"-*- font:x;foo : bar ; mode : cSS ; bar : foo ; foooooo:baaaaar;fo:ba-*-\";";
			ref = valid.split(/\n/);
			for (j = 0, len = ref.length; j < len; j++) {
				line = ref[j];
				assert.notEqual(testGrammar.grammar.firstLineRegex.scanner.findNextMatchSync(line), null);
			}
			invalid = "/* --*css-*- */\n/* -*-- CSS -*-\n/* -*- -- CSS -*-\n/* -*- CSS -;- -*-\n// -*- CCSS -*-\n// -*- CSS; -*-\n// -*- css-stuff -*-\n/* -*- model:css -*-\n/* -*- indent-mode:css -*-\n// -*- font:mode;CSS -*-\n// -*- mode: -*- CSS\n// -*- mode: I-miss-plain-old-css -*-\n// -*-font:mode;mode:css--*-";
			ref1 = invalid.split(/\n/);
			for (k = 0, len1 = ref1.length; k < len1; k++) {
				line = ref1[k];
				assert.equal(testGrammar.grammar.firstLineRegex.scanner.findNextMatchSync(line), null)
			}
		});

		it("recognises Vim modelines", function () {
			var invalid, j, k, len, len1, line, ref, ref1, valid;
			valid = "vim: se filetype=css:\n# vim: se ft=css:\n# vim: set ft=CSS:\n# vim: set filetype=CSS:\n# vim: ft=CSS\n# vim: syntax=CSS\n# vim: se syntax=css:\n# ex: syntax=CSS\n# vim:ft=css\n# vim600: ft=css\n# vim>600: set ft=css:\n# vi:noai:sw=3 ts=6 ft=CSS\n# vi::::::::::noai:::::::::::: ft=CSS\n# vim:ts=4:sts=4:sw=4:noexpandtab:ft=cSS\n# vi:: noai : : : : sw   =3 ts   =6 ft  =Css\n# vim: ts=4: pi sts=4: ft=CSS: noexpandtab: sw=4:\n# vim: ts=4 sts=4: ft=css noexpandtab:\n# vim:noexpandtab sts=4 ft=css ts=4\n# vim:noexpandtab:ft=css\n# vim:ts=4:sts=4 ft=css:noexpandtab:\x20\n# vim:noexpandtab titlestring=hi\|there\\\\ ft=css ts=4";
			ref = valid.split(/\n/);
			for (j = 0, len = ref.length; j < len; j++) {
				line = ref[j];
				assert.notEqual(testGrammar.grammar.firstLineRegex.scanner.findNextMatchSync(line), null);
			}
			invalid = "ex: se filetype=css:\n_vi: se filetype=CSS:\n vi: se filetype=CSS\n# vim set ft=css3\n# vim: soft=css\n# vim: clean-syntax=css:\n# vim set ft=css:\n# vim: setft=CSS:\n# vim: se ft=css backupdir=tmp\n# vim: set ft=css set cmdheight=1\n# vim:noexpandtab sts:4 ft:CSS ts:4\n# vim:noexpandtab titlestring=hi\\|there\\ ft=CSS ts=4\n# vim:noexpandtab titlestring=hi\\|there\\\\\\ ft=CSS ts=4";
			ref1 = invalid.split(/\n/);
			for (k = 0, len1 = ref1.length; k < len1; k++) {
				line = ref1[k];
				assert.equal(testGrammar.grammar.firstLineRegex.scanner.findNextMatchSync(line), null);
			}
		});
	});

	describe("Missing supported properties regressions", function () {
		it("recognises place-items property as supported", function () {
			var tokens;
			tokens = testGrammar.tokenizeLines('a { place-items: center center; }');
			assert.deepStrictEqual(tokens[0][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
			assert.deepStrictEqual(tokens[0][1], { scopes: ['source.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			assert.deepStrictEqual(tokens[0][3], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'place-items' });
			assert.deepStrictEqual(tokens[0][5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[0][6], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'center' });
			assert.deepStrictEqual(tokens[0][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'center' });
			assert.deepStrictEqual(tokens[0][10], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
			assert.deepStrictEqual(tokens[0][11], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][12], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
		});

		it("recognises place-self property as supported", function () {
			var tokens;
			tokens = testGrammar.tokenizeLines('a { place-self: center center; }');
			assert.deepStrictEqual(tokens[0][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
			assert.deepStrictEqual(tokens[0][1], { scopes: ['source.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			assert.deepStrictEqual(tokens[0][3], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'place-self' });
			assert.deepStrictEqual(tokens[0][5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[0][6], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'center' });
			assert.deepStrictEqual(tokens[0][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'center' });
			assert.deepStrictEqual(tokens[0][10], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
			assert.deepStrictEqual(tokens[0][11], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][12], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
		});

		it("recognises place-content property as supported", function () {
			var tokens;
			tokens = testGrammar.tokenizeLines('a { place-content: center center; }');
			assert.deepStrictEqual(tokens[0][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
			assert.deepStrictEqual(tokens[0][1], { scopes: ['source.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			assert.deepStrictEqual(tokens[0][3], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'place-content' });
			assert.deepStrictEqual(tokens[0][5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[0][6], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'center' });
			assert.deepStrictEqual(tokens[0][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css'], value: 'center' });
			assert.deepStrictEqual(tokens[0][10], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
			assert.deepStrictEqual(tokens[0][11], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][12], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
		});

		it("recognises row-gap property as supported", function () {
			var tokens;
			tokens = testGrammar.tokenizeLines('a { row-gap: 5px; }');
			assert.deepStrictEqual(tokens[0][0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css'], value: 'a' });
			assert.deepStrictEqual(tokens[0][1], { scopes: ['source.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][2], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css'], value: '{' });
			assert.deepStrictEqual(tokens[0][3], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'row-gap' });
			assert.deepStrictEqual(tokens[0][5], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[0][6], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][7], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css'], value: '5' });
			assert.deepStrictEqual(tokens[0][8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css'], value: 'px' });
			assert.deepStrictEqual(tokens[0][9], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css'], value: ';' });
			assert.deepStrictEqual(tokens[0][10], { scopes: ['source.css', 'meta.property-list.css'], value: ' ' });
			assert.deepStrictEqual(tokens[0][11], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css'], value: '}' });
		});
	});
});
