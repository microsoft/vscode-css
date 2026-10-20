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

			describe('@layer', function () {
				it('tokenises layer statement lists', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@layer reset, framework.theme;').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.layer.header.css', 'keyword.control.at-rule.layer.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.layer.header.css', 'keyword.control.at-rule.layer.css'], value: 'layer' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.layer.header.css', 'variable.parameter.layer-name.css'], value: 'reset' });
					assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.layer.header.css', 'punctuation.separator.list.comma.css'], value: ',' });
					assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.layer.header.css', 'variable.parameter.layer-name.css'], value: 'framework' });
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.layer.header.css', 'punctuation.accessor.layer.css'], value: '.' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.layer.header.css', 'variable.parameter.layer-name.css'], value: 'theme' });
					assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'punctuation.terminator.rule.css'], value: ';' });
				});

				it('embeds rulesets and other at-rules', function () {
					var lines;
					lines = testGrammar.tokenizeLines("@layer framework {\n  @media (width >= 20em) {\n    .button { color: red; }\n  }\n}");
					assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.at-rule.layer.header.css', 'keyword.control.at-rule.layer.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.layer.header.css', 'keyword.control.at-rule.layer.css'], value: 'layer' });
					assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.layer.header.css', 'variable.parameter.layer-name.css'], value: 'framework' });
					assert.deepStrictEqual(lines[0][5], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'punctuation.section.layer.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(lines[1][2], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css'], value: 'media' });
					assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'meta.at-rule.media.body.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
					assert.deepStrictEqual(lines[2][2], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'meta.at-rule.media.body.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'button' });
					assert.deepStrictEqual(lines[4][0], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'punctuation.section.layer.end.bracket.curly.css'], value: '}' });
				});

				it('tokenises anonymous and nested layers', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@layer { .foo {} }').tokens;
					assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.layer.header.css', 'keyword.control.at-rule.layer.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.layer.header.css', 'keyword.control.at-rule.layer.css'], value: 'layer' });
					assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'punctuation.section.layer.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'punctuation.section.layer.end.bracket.curly.css'], value: '}' });

					tokens = testGrammar.tokenizeLine('@layer foo { @layer bar { .foo {} } }').tokens;
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'meta.at-rule.layer.header.css', 'keyword.control.at-rule.layer.css', 'punctuation.definition.keyword.css'], value: '@' });
					assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'meta.at-rule.layer.header.css', 'keyword.control.at-rule.layer.css'], value: 'layer' });
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'meta.at-rule.layer.header.css', 'variable.parameter.layer-name.css'], value: 'bar' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'meta.at-rule.layer.body.css', 'punctuation.section.layer.begin.bracket.curly.css'], value: '{' });
					assert.deepStrictEqual(tokens[20], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'meta.at-rule.layer.body.css', 'punctuation.section.layer.end.bracket.curly.css'], value: '}' });
					assert.deepStrictEqual(tokens[22], { scopes: ['source.css', 'meta.at-rule.layer.body.css', 'punctuation.section.layer.end.bracket.curly.css'], value: '}' });
				});
			});

			describe('@import layer', function () {
				it('tokenises imported layer names', function () {
					var tokens;
					tokens = testGrammar.tokenizeLine('@import url("theme.css") layer(framework.theme);').tokens;
					assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.layer.css', 'support.function.layer.css'], value: 'layer' });
					assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.layer.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
					assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.layer.css', 'variable.parameter.layer-name.css'], value: 'framework' });
					assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.layer.css', 'punctuation.accessor.layer.css'], value: '.' });
					assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.layer.css', 'variable.parameter.layer-name.css'], value: 'theme' });
					assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.layer.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });

					tokens = testGrammar.tokenizeLine('@import "theme.css" layer;').tokens;
					assert.deepStrictEqual(tokens[7], { scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.other.layer.css'], value: 'layer' });
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

	describe('CSS Nesting', function () {
		it('tokenizes the nesting selector &', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('& {}').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.nesting.css'], value: '&' });
		});

		it('tokenizes the nesting selector & with class', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('&.foo {}').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.nesting.css'], value: '&' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'foo' });
		});

		it('tokenizes the nesting selector & with pseudo-class', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('&:hover {}').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.nesting.css'], value: '&' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css'], value: ':' });
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'hover' });
		});

		it('tokenizes the nesting selector & inside a rule', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('  & > .bar {}').tokens;
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.nesting.css'], value: '&' });
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css'], value: '>' });
		});

		it('tokenizes nested selector with suffix &', function () {
			var lines;
			lines = testGrammar.tokenizeLines('.foo::before {\n  content: "Hello";\n\n  .important & {\n    color: red;\n  }\n}');
			assert.deepStrictEqual(lines[0][0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
			assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'foo' });
			assert.deepStrictEqual(lines[0][2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css'], value: '::' });
			assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'before' });

			assert.deepStrictEqual(lines[3][1], { scopes: ['source.css', 'meta.property-list.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
			assert.deepStrictEqual(lines[3][2], { scopes: ['source.css', 'meta.property-list.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'important' });
			assert.deepStrictEqual(lines[3][4], { scopes: ['source.css', 'meta.property-list.css', 'meta.selector.css', 'entity.name.tag.nesting.css'], value: '&' });
		});
	});

	describe('advanced property values', function () {
		it('tokenizes json-like structures in custom properties', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('.foo { --json: { "foo": "bar" }; }').tokens;
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'variable.css'], value: '--json' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.section.group.begin.bracket.curly.css'], value: '{' });
			assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
			assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css'], value: 'foo' });
			assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
			assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: ': ' });
			assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
			assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css'], value: 'bar' });
			assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
			assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.section.group.end.bracket.curly.css'], value: '}' });
		});

		it('tokenizes json-like structures with boolean values', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine(':root { --foo: { "bar": true }; }').tokens;
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'variable.css'], value: '--foo' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.section.group.begin.bracket.curly.css'], value: '{' });
			assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css'], value: '"' });
			assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css'], value: 'bar' });
			assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css'], value: '"' });
			assert.deepStrictEqual(tokens[13], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css'], value: ': true ' });
			assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.section.group.end.bracket.curly.css'], value: '}' });
		});

		it('tokenizes curly braces in function arguments', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('.foo { color: --foo({1, 2, 3}, 4); }').tokens;
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'color' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css'], value: ':' });
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.custom.css', 'support.function.custom.css'], value: '--foo' });
			assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.custom.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
			assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.custom.css', 'punctuation.section.group.begin.bracket.curly.css'], value: '{' });
			assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.custom.css', 'constant.numeric.css'], value: '1' });
			assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.custom.css', 'punctuation.separator.list.comma.css'], value: ',' });
			assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.custom.css', 'constant.numeric.css'], value: '2' });
			assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.custom.css', 'punctuation.separator.list.comma.css'], value: ',' });
			assert.deepStrictEqual(tokens[17], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.custom.css', 'constant.numeric.css'], value: '3' });
			assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.custom.css', 'punctuation.section.group.end.bracket.curly.css'], value: '}' });
			assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.custom.css', 'punctuation.separator.list.comma.css'], value: ',' });
			assert.deepStrictEqual(tokens[21], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.custom.css', 'constant.numeric.css'], value: '4' });
			assert.deepStrictEqual(tokens[22], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.custom.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
		});

		it('tokenizes if() function', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('.foo { color: if(style(--foo: 1), red, blue); }').tokens;
			assert.deepStrictEqual(tokens[8], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'if' });
			assert.deepStrictEqual(tokens[9], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
			assert.deepStrictEqual(tokens[10], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'meta.function.misc.css', 'support.function.misc.css'], value: 'style' });
			assert.deepStrictEqual(tokens[11], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css'], value: '(' });
			assert.deepStrictEqual(tokens[12], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'meta.function.misc.css', 'variable.parameter.misc.css'], value: '--foo:' });
			assert.deepStrictEqual(tokens[14], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'meta.function.misc.css', 'constant.numeric.css'], value: '1' });
			assert.deepStrictEqual(tokens[15], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
			assert.deepStrictEqual(tokens[16], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.separator.list.comma.css'], value: ',' });
			assert.deepStrictEqual(tokens[18], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.constant.color.w3c-standard-color-name.css'], value: 'red' });
			assert.deepStrictEqual(tokens[19], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.separator.list.comma.css'], value: ',' });
			assert.deepStrictEqual(tokens[21], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.constant.color.w3c-standard-color-name.css'], value: 'blue' });
			assert.deepStrictEqual(tokens[22], { scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css'], value: ')' });
		});
	});

	describe('container queries', function () {
		it('does not treat a longer identifier as a size feature', function () {
			// The size feature names have to stop at a word boundary, or
			// `widthish` picks up `support.type.property-name.container.css`
			// from the `width` alternative.
			var tokens = testGrammar.tokenizeLine('@container (widthish > 10px) {}').tokens;
			assert.deepStrictEqual(tokens[4], {
				scopes: ['source.css', 'meta.at-rule.container.header.css'],
				value: 'widthish '
			});
		});

		it('scopes both braces of a @container body', function () {
			// The opening brace is covered by the omitted-prelude test, but
			// nothing pinned the closing one, so it could be renamed without
			// any test failing. Every other at-rule with a body asserts both.
			var tokens = testGrammar.tokenizeLine('@container (width > 1px) { .x { color: red; } }').tokens;
			assert.deepStrictEqual(tokens[12], {
				scopes: [
					'source.css',
					'meta.at-rule.container.body.css',
					'punctuation.section.container.begin.bracket.curly.css'
				],
				value: '{'
			});
			assert.deepStrictEqual(tokens[27], {
				scopes: [
					'source.css',
					'meta.at-rule.container.body.css',
					'punctuation.section.container.end.bracket.curly.css'
				],
				value: '}'
			});
		});

		it('scopes both parentheses of a grouped scroll-state() condition', function () {
			// The inner group and the function call close with different
			// punctuation scopes; neither closing parenthesis was pinned.
			var tokens = testGrammar.tokenizeLine('@container scroll-state((stuck: top)) {}').tokens;
			assert.deepStrictEqual(tokens[10], {
				scopes: [
					'source.css',
					'meta.at-rule.container.header.css',
					'meta.function.scroll-state.css',
					'punctuation.definition.parameters.end.bracket.round.css'
				],
				value: ')'
			});
			assert.deepStrictEqual(tokens[11], {
				scopes: [
					'source.css',
					'meta.at-rule.container.header.css',
					'meta.function.scroll-state.css',
					'punctuation.section.function.end.bracket.round.css'
				],
				value: ')'
			});
		});

		it('supports comments between scroll-state conditions', function () {
			var tokens = testGrammar.tokenizeLine('@container scroll-state(stuck: top/* c */and (snapped: x)) {').tokens;
			var head = ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'comment.block.css'];
			assert.deepStrictEqual(tokens.find(x => x.value === '/*').scopes, head.concat(['punctuation.definition.comment.begin.css']));
			assert.deepStrictEqual(tokens.find(x => x.value === ' c ').scopes, head);
			assert.deepStrictEqual(tokens.find(x => x.value === '*/').scopes, head.concat(['punctuation.definition.comment.end.css']));
			assert.deepStrictEqual(tokens.find(x => x.value === 'and').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'keyword.operator.logical.and.container.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'snapped').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.type.property-name.container.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'x').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.constant.property-value.css']);
		});

		it('tokenizes @container logical operators', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('@container (min-width: 400px) and (max-width: 900px) {').tokens;
			var and = tokens.find(t => t.value === 'and');
			assert.deepStrictEqual(and.scopes, ['source.css', 'meta.at-rule.container.header.css', 'keyword.operator.logical.and.container.css']);
		});

		it('tokenizes @container scroll-state() queries', function () {
			var tokens = testGrammar.tokenizeLine('@container scroll-state(stuck: block-start) {').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'scroll-state').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.function.scroll-state.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'stuck').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.type.property-name.container.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'block-start').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.constant.property-value.css']);
		});

		it('tokenizes @container style() queries', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('@container style(--theme: dark) {').tokens;
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'support.function.style.css'], value: 'style' });
		});

		it('tokenizes @container with a container name', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('@container card (min-width: 400px) { .x { color: red; } }').tokens;
			assert.deepStrictEqual(tokens[0], { scopes: ['source.css', 'meta.at-rule.container.header.css', 'keyword.control.at-rule.container.css', 'punctuation.definition.keyword.css'], value: '@' });
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.container.header.css', 'keyword.control.at-rule.container.css'], value: 'container' });
			assert.deepStrictEqual(tokens[3], { scopes: ['source.css', 'meta.at-rule.container.header.css', 'variable.parameter.container-name.css'], value: 'card' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.container.header.css', 'punctuation.definition.parameters.begin.bracket.round.css'], value: '(' });
			assert.deepStrictEqual(tokens[6], { scopes: ['source.css', 'meta.at-rule.container.header.css', 'support.type.property-name.container.css'], value: 'min-width' });
		});

		it('tokenizes grouped @container scroll-state() conditions', function () {
			var tokens = testGrammar.tokenizeLine('@container scroll-state((stuck: top) or (scrolled: block-start)) {').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'or').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'keyword.operator.logical.or.container.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'scrolled').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.type.property-name.container.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'block-start').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.constant.property-value.css']);
		});

		it('tokenizes scroll-state features in boolean context', function () {
			var tokens = testGrammar.tokenizeLine('@container scroll-state((stuck) or snapped) {').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'stuck').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.type.property-name.container.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'snapped').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.type.property-name.container.css']);
		});

		it('uses distinct size and scroll-state feature grammars', function () {
			var tokens = testGrammar.tokenizeLine('@container (width > 10px) {').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'width').scopes, ['source.css', 'meta.at-rule.container.header.css', 'support.type.property-name.container.css']);

			tokens = testGrammar.tokenizeLine('@container (stuck: top) {').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'stuck').scopes, ['source.css', 'meta.at-rule.container.header.css']);

			tokens = testGrammar.tokenizeLine('@container scroll-state(width: 10px) {').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value.includes('width')).scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css']);
		});

		it('uses values associated with each scroll-state feature', function () {
			var tokens = testGrammar.tokenizeLine('@container scroll-state((stuck: top) and (snapped: both) and (scrollable: inline)) {').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'top').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.constant.property-value.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'both').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.constant.property-value.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'inline').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.constant.property-value.css']);

			tokens = testGrammar.tokenizeLine('@container scroll-state(stuck: x) {').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value.trim() === 'x').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css']);
		});

		it('keeps a prelude that is merely continued on the next line intact', function () {
			// A prelude may legally span lines until its `{`, so a bare
			// unterminated one must keep running -- exactly as an unterminated
			// `@media` or `@supports` prelude has always done. Only a `{` that
			// ends the line is treated as evidence of a mistake. Asserted so
			// that a future change to this behaviour is a deliberate one.
			var lines = testGrammar.tokenizeLines('@container style(--theme: dark\n.after { color: red; }');
			assert.deepStrictEqual(lines[1].find(t => t.value.trim() === '.after').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'meta.property-value.css']);
		});

		it('keeps a legal balanced block inside a condition in the header', function () {
			// `<general-enclosed>` is `( <any-value>? )` and `<any-value>` admits
			// a balanced block, so this must stay inside the header, matching what
			// an `@media` prelude already does.
			var tokens = testGrammar.tokenizeLine('@container ({ future }) {').tokens;
			var future = tokens.find(t => t.value.includes('future'));
			assert.ok(future, '`future` missing');
			assert.ok(future.scopes.includes('meta.at-rule.container.header.css'),
				'left the header: ' + future.scopes.join(' '));
		});

		it('keeps a balanced block in a style() query value inside the query', function () {
			// A custom property value may legally contain a `{...}` block, so the
			// braces belong to the value and the query continues past them.
			['@container style(--x: {a})', '@container style(--grid: {display:grid})', '@container style(--x: {a; b})'].forEach(function (prelude) {
				var lines = testGrammar.tokenizeLines(prelude + ' {\n.z { color: red; }\n}');
				// The braces must stay inside the value as a group, not be
				// released to the enclosing query.
				assert.deepStrictEqual(lines[0].find(t => t.value === '{').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'meta.property-value.css', 'punctuation.section.group.begin.bracket.curly.css'], prelude);
				assert.deepStrictEqual(lines[0].filter(t => t.value === '}').pop().scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'meta.property-value.css', 'punctuation.section.group.end.bracket.curly.css'], prelude);
				assert.deepStrictEqual(lines[0].find(t => t.value === ')').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'punctuation.section.function.end.bracket.round.css'], prelude);
				assert.deepStrictEqual(lines[1].find(t => t.value === 'z').scopes, ['source.css', 'meta.at-rule.container.body.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], prelude);
			});
		});

		it('keeps a balanced block in a style() query value across lines', function () {
			// The same block spanning lines must not be mistaken for the
			// container body; the rule after the query still belongs to it.
			var lines = testGrammar.tokenizeLines('@container style(--x: {\n  color: red;\n}) { .z { color: blue; } }');
			assert.deepStrictEqual(lines[2].find(t => t.value === 'z').scopes, ['source.css', 'meta.at-rule.container.body.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']);
			assert.deepStrictEqual(lines[2].find(t => t.value === 'blue').scopes, ['source.css', 'meta.at-rule.container.body.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css']);
		});

		it('keeps a semicolon or brace that the query itself closes', function () {
			// `<general-enclosed>` is `( <any-value>? )` and `<any-value>`
			// permits a top-level `;`, while `<declaration-value>` permits one
			// inside any balanced block. Neither ends the query, so forward
			// compatible syntax keeps its scopes.
			[
				['@container (future; syntax)', 'meta.at-rule.container.header.css'],
				['@container (future { syntax })', 'meta.at-rule.container.header.css'],
				['@container style(--x: [a;b])', 'meta.at-rule.container.header.css'],
				['@container style(--x: (a;b))', 'meta.at-rule.container.header.css'],
				['@container style(foo(a;b))', 'meta.at-rule.container.header.css'],
				['@container style((foo;bar))', 'meta.at-rule.container.header.css']
			].forEach(function (probe) {
				var lines = testGrammar.tokenizeLines(probe[0] + ' {\n.z { color: red; }\n}');
				var close = lines[0].filter(t => t.value === ')').pop();
				assert.ok(close.scopes.indexOf(probe[1]) !== -1, probe[0] + ' -> ) left the header: ' + close.scopes.join('|'));
				assert.deepStrictEqual(lines[1].find(t => t.value === 'z').scopes, ['source.css', 'meta.at-rule.container.body.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], probe[0]);
			});
		});

		it('keeps a style() query that is cut off by a brace inside the query', function () {
			// `style()` wraps `<declaration-value>`, which may legally contain a
			// balanced `{...}` block, so a `{` here stays part of the query.
			var lines = testGrammar.tokenizeLines('@container style(--theme: dark{\n.after { color: red; }\n}');
			assert.ok(lines[0].find(t => t.value === '{').scopes.includes('meta.at-rule.container.header.css'));
		});

		it('keeps a brace that the query itself closes, in every region', function () {
			// One case per region where `<any-value>` or `<declaration-value>`
			// admits a balanced block. A `{` closed later on the same line
			// belongs to the query, not to the rule that follows it.
			[
				['@container style({a})', 'container'],
				['@container style(--x: {a})', 'container'],
				['@container scroll-state({a})', 'container'],
				['@container scroll-state(stuck: {a})', 'container'],
				['@container scroll-state(snapped: {a})', 'container'],
				['@container scroll-state(scrollable: {a})', 'container']
			].forEach(function (probe) {
				var lines = testGrammar.tokenizeLines(probe[0] + ' {\n.z { color: red; }\n}');
				var close = lines[0].filter(t => t.value === ')').pop();
				assert.ok(close.scopes.indexOf('meta.at-rule.' + probe[1] + '.header.css') !== -1, probe[0] + ' -> ) left the header: ' + close.scopes.join('|'));
				assert.deepStrictEqual(lines[1].find(t => t.value === 'z').scopes, ['source.css', 'meta.at-rule.' + probe[1] + '.body.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], probe[0]);
			});
		});

		it('scopes a comma between container conditions', function () {
			var tokens = testGrammar.tokenizeLine('@container card (width > 30em), style(--large: true) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === ',').scopes, ['source.css', 'meta.at-rule.container.header.css', 'punctuation.separator.list.comma.css']);
		});

		it('keeps an escape inside the container name it begins', function () {
			// `\63 ard` is one custom-ident spelling `card`, so the escape and
			// the rest of the identifier belong to the same name.
			var tokens = testGrammar.tokenizeLine('@container \\63 ard (width > 1px) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '\\63').scopes, ['source.css', 'meta.at-rule.container.header.css', 'variable.parameter.container-name.css', 'constant.character.escape.codepoint.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === ' ard').scopes, ['source.css', 'meta.at-rule.container.header.css', 'variable.parameter.container-name.css']);
		});

		it('does not take an identifier for a container name unless the condition follows', function () {
			// Without this the name matcher runs at every identifier in the
			// prelude, which is both wrong and quadratic.
			var tokens = testGrammar.tokenizeLine('@container one two (width > 1px) {}').tokens;
			assert.strictEqual(tokens.filter(x => x.scopes.includes('variable.parameter.container-name.css')).length, 1);
			assert.deepStrictEqual(tokens.find(x => x.scopes.includes('variable.parameter.container-name.css')).value, 'two');
		});

		it('nests a query in parentheses instead of closing at the first bracket', function () {
			var tokens = testGrammar.tokenizeLine('@container ((width > 1px) and (height > 2px)) {}').tokens;
			var parens = tokens.filter(x => x.value === '(' || x.value === ')');
			assert.strictEqual(parens.length, 6);
			parens.forEach(function (t) {
				assert.ok(t.scopes.includes(t.value === '(' ? 'punctuation.definition.parameters.begin.bracket.round.css' : 'punctuation.definition.parameters.end.bracket.round.css'), JSON.stringify(t));
			});
			assert.deepStrictEqual(tokens.find(x => x.value === 'and').scopes, ['source.css', 'meta.at-rule.container.header.css', 'keyword.operator.logical.and.container.css']);
		});

		it('does not let a bracket inside a string close a general-enclosed query', function () {
			// `<general-enclosed>` only has to be balanced, and a `)` in a
			// string is not a bracket.
			var tokens = testGrammar.tokenizeLine('@container (future(")")) {}').tokens;
			var inString = tokens.filter(x => x.value === ')' && x.scopes.includes('string.quoted.double.css'));
			assert.strictEqual(inString.length, 1);
			assert.deepStrictEqual(tokens[tokens.length - 1].scopes, ['source.css', 'meta.at-rule.container.body.css', 'punctuation.section.container.end.bracket.curly.css']);
		});

		it('tokenizes a function in a scroll-state feature value', function () {
			// A feature value is a component value, so `var()` may stand in
			// for the keyword, and its `)` is not the query's.
			var tokens = testGrammar.tokenizeLine('@container scroll-state(scrollable: var(--edge, bottom)) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '--edge').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'meta.function.variable.css', 'variable.argument.css']);
			assert.deepStrictEqual(tokens[tokens.length - 1].scopes, ['source.css', 'meta.at-rule.container.body.css', 'punctuation.section.container.end.bracket.curly.css']);
		});

		it('tokenizes a negated style() query', function () {
			var tokens = testGrammar.tokenizeLine('@container style(not (--theme: dark)) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'not').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'keyword.operator.logical.not.container.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === '--theme').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'variable.css']);
		});

		it('tokenizes a style() range query', function () {
			// A range is not a declaration, so it must not be read as one.
			var tokens = testGrammar.tokenizeLine('@container style(--level >= 2) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '>=').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'keyword.operator.comparison.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === '2').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'constant.numeric.css']);
		});

		it('groups style() queries in parentheses', function () {
			var tokens = testGrammar.tokenizeLine('@container style((--a: 1) and (--b: 2)) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'and').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'keyword.operator.logical.and.container.css']);
			assert.strictEqual(tokens.filter(x => x.scopes.includes('punctuation.definition.parameters.begin.bracket.round.css')).length, 2);
		});

		it('leaks a semicolon-terminated container rule, which has no such form', function () {
			// @container has no semicolon form, so `@container nonsense;` is
			// malformed and must leak like any other malformed prelude. The
			// test for a leak is that the line below tokenizes differently
			// from the same line on its own; matching means the grammar
			// recovered, which is what this must not do.
			var scopesOf = ts => ts.map(t => t.scopes.join(',')).join('|');
			var clean = scopesOf(testGrammar.tokenizeLine('.after { color: red; }').tokens);
			['@container nonsense;', '@container (width > 1px{', '@container style(--x: y{'].forEach(function (bad) {
				var lines = testGrammar.tokenizeLines(bad + '\n.after { color: red; }');
				assert.notStrictEqual(scopesOf(lines[1]), clean, 'recovered after: ' + bad);
			});
		});

		it('scopes a style range written without spaces, value first, or chained', function () {
			[
				['@container style(--level>=2) {}', '>='],
				['@container style(2 < --level) {}', '<'],
				['@container style(1 < --level < 3) {}', '<']
			].forEach(function (pair) {
				var tokens = testGrammar.tokenizeLine(pair[0]).tokens;
				var op = tokens.find(x => x.value.trim() === pair[1]);
				assert.deepStrictEqual(op.scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'keyword.operator.comparison.css'], pair[0]);
			});
			var name = testGrammar.tokenizeLine('@container style(--level>=2) {}').tokens.find(x => x.value === '--level');
			assert.ok(name, 'the custom property name must not swallow the operator');
		});

		it('keeps a declaration whose value holds a bracketed semicolon out of the range rule', function () {
			var tokens = testGrammar.tokenizeLine('@container style(--x: [a;b]) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '--x').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'variable.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === '[a;b]').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'meta.property-value.css']);
			assert.ok(!tokens.some(x => x.scopes.includes('punctuation.terminator.rule.css')), 'the bracketed semicolon ended the declaration');
			assert.ok(!tokens.some(x => x.scopes.includes('meta.selector.css')), 'the bracketed semicolon started a selector');
		});

		it('takes a bare declaration directly in the container body', function () {
			var body = ['source.css', 'meta.at-rule.container.body.css'];
			var tokens = testGrammar.tokenizeLine('@container (width>1px) { --x: y; }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '--x').scopes, body.concat(['variable.css']));
			assert.deepStrictEqual(tokens.find(x => x.value === ':').scopes, body.concat(['punctuation.separator.key-value.css']));
			assert.deepStrictEqual(tokens.find(x => x.value === 'y').scopes, body.concat(['meta.property-value.css', 'support.constant.property-value.css']));
			assert.deepStrictEqual(tokens.find(x => x.value === ';').scopes, body.concat(['punctuation.terminator.rule.css']));
		});

		it('keeps a bracket inside a scroll-state string out of the balancing', function () {
			var head = ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'string.quoted.double.css'];
			var tokens = testGrammar.tokenizeLine('@container scroll-state("a)b") {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'a)b').scopes, head);
			// The closing bracket of the string must not end the function.
			assert.deepStrictEqual(tokens.filter(x => x.scopes.includes('punctuation.section.function.end.bracket.round.css')).length, 1);
			assert.deepStrictEqual(tokens.find(x => x.value === '{').scopes, ['source.css', 'meta.at-rule.container.body.css', 'punctuation.section.container.begin.bracket.curly.css']);
		});

		it('parses comments, escapes, strings, numbers and functions in every container context', function () {
			[
			["@container (width>1px) { a { color: red; } }", "color", ["source.css","meta.at-rule.container.body.css","meta.property-list.css","meta.property-name.css","support.type.property-name.css"]],
			["@container /*c*/ card (width>1px) {}", "c", ["source.css","meta.at-rule.container.header.css","comment.block.css"]],
			["@container ca\\72 d (width>1px) {}", "\\72", ["source.css","meta.at-rule.container.header.css","variable.parameter.container-name.css","constant.character.escape.codepoint.css"]],
			["@container style(/*c*/ --x: 1) {}", "c", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","comment.block.css"]],
			["@container style(--x /*c*/ > 1) {}", "c", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","comment.block.css"]],
			["@container style(--x: 1 /*c*/) {}", "c", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","meta.property-value.css","comment.block.css"]],
			["@container (orientation: landscape) {}", "landscape", ["source.css","meta.at-rule.container.header.css","support.constant.property-value.css"]],
			["@container (/*c*/ width>1px) {}", "c", ["source.css","meta.at-rule.container.header.css","comment.block.css"]],
			["@container (width > calc(1px + 2px)) {}", "calc", ["source.css","meta.at-rule.container.header.css","meta.function.calc.css","support.function.calc.css"]],
			["@container (foo: \"a)b\") {}", "a)b", ["source.css","meta.at-rule.container.header.css","string.quoted.double.css"]],
			["@container foo(bar(baz)) {}", "bar", ["source.css","meta.at-rule.container.header.css","meta.function.misc.css","meta.function.misc.css","support.function.misc.css"]],
			["@container foo(/*c*/) {}", "c", ["source.css","meta.at-rule.container.header.css","meta.function.misc.css","comment.block.css"]],
			["@container foo(1px) {}", "1", ["source.css","meta.at-rule.container.header.css","meta.function.misc.css","constant.numeric.css"]],
			["@container scroll-state(/*c*/ stuck: top) {}", "c", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","comment.block.css"]],
			["@container scroll-state(future(x)) {}", "future", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","meta.function.misc.css","support.function.misc.css"]],
			["@container scroll-state(future(\"a)b\")) {}", "a)b", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","meta.function.misc.css","string.quoted.double.css"]],
			["@container scroll-state(stuck: calc(1px)) {}", "calc", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","meta.function.calc.css","support.function.calc.css"]],
			["@container scroll-state(snapped: /*c*/ x) {}", "c", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","comment.block.css"]],
			["@container scroll-state(snapped: calc(1px)) {}", "calc", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","meta.function.calc.css","support.function.calc.css"]],
			["@container scroll-state(scrollable: /*c*/ x) {}", "c", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","comment.block.css"]],
			].forEach(function (c) {
				var token = testGrammar.tokenizeLine(c[0]).tokens.find(x => x.value === c[1]);
				assert.ok(token, c[1] + ' not found in ' + c[0]);
				assert.deepStrictEqual(token.scopes, c[2], c[0]);
			});
		});

		it('marks the punctuation and separators of every container query context', function () {
			[
			["@container style(--x: red) {}", [
				["(", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.section.function.begin.bracket.round.css"]],
				["--x", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","variable.css"]],
				[":", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.separator.key-value.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.section.function.end.bracket.round.css"]],
			]],
			["@container style(--x >= 2) {}", [
				["(", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.section.function.begin.bracket.round.css"]],
				["--x", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","variable.css"]],
				[">=", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","keyword.operator.comparison.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.section.function.end.bracket.round.css"]],
			]],
			["@container style((--a: 1) or (--b: 2)) {}", [
				["(", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.section.function.begin.bracket.round.css"]],
				["(", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.definition.parameters.begin.bracket.round.css"]],
				["--a", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","variable.css"]],
				[":", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.separator.key-value.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.definition.parameters.end.bracket.round.css"]],
				["(", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.definition.parameters.begin.bracket.round.css"]],
				["--b", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","variable.css"]],
				[":", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.separator.key-value.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.definition.parameters.end.bracket.round.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.section.function.end.bracket.round.css"]],
			]],
			["@container style(not (--a: 1)) {}", [
				["(", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.section.function.begin.bracket.round.css"]],
				["(", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.definition.parameters.begin.bracket.round.css"]],
				["--a", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","variable.css"]],
				[":", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.separator.key-value.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.definition.parameters.end.bracket.round.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","meta.function.style.css","punctuation.section.function.end.bracket.round.css"]],
			]],
			["@container (width: 1px) {}", [
				["(", ["source.css","meta.at-rule.container.header.css","punctuation.definition.parameters.begin.bracket.round.css"]],
				[":", ["source.css","meta.at-rule.container.header.css","punctuation.separator.key-value.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","punctuation.definition.parameters.end.bracket.round.css"]],
			]],
			["@container (width >= 1px) {}", [
				["(", ["source.css","meta.at-rule.container.header.css","punctuation.definition.parameters.begin.bracket.round.css"]],
				[">=", ["source.css","meta.at-rule.container.header.css","keyword.operator.comparison.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","punctuation.definition.parameters.end.bracket.round.css"]],
			]],
			["@container foo(bar) {}", [
				["(", ["source.css","meta.at-rule.container.header.css","meta.function.misc.css","punctuation.section.function.begin.bracket.round.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","meta.function.misc.css","punctuation.section.function.end.bracket.round.css"]],
			]],
			["@container scroll-state(stuck: top) {}", [
				["(", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.section.function.begin.bracket.round.css"]],
				[":", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.separator.key-value.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.section.function.end.bracket.round.css"]],
			]],
			["@container scroll-state(snapped: x) {}", [
				["(", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.section.function.begin.bracket.round.css"]],
				[":", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.separator.key-value.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.section.function.end.bracket.round.css"]],
			]],
			["@container scroll-state(scrollable: x) {}", [
				["(", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.section.function.begin.bracket.round.css"]],
				[":", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.separator.key-value.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.section.function.end.bracket.round.css"]],
			]],
			["@container scroll-state((stuck: top)) {}", [
				["(", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.section.function.begin.bracket.round.css"]],
				["(", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.definition.parameters.begin.bracket.round.css"]],
				[":", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.separator.key-value.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.definition.parameters.end.bracket.round.css"]],
				[")", ["source.css","meta.at-rule.container.header.css","meta.function.scroll-state.css","punctuation.section.function.end.bracket.round.css"]],
			]],
			].forEach(function (c) {
				var line = c[0];
				var tokens = testGrammar.tokenizeLine(line).tokens
					.filter(x => /^(?:[(:)]|--\w+|>=)$/.test(x.value.trim()));
				assert.strictEqual(tokens.length, c[1].length, line);
				tokens.forEach(function (t, i) {
					assert.strictEqual(t.value.trim(), c[1][i][0], line);
					assert.deepStrictEqual(t.scopes, c[1][i][1], line + ' @' + i);
				});
			});
		});

		it('tokenizes every size container feature, with and without a range prefix', function () {
			var head = ['source.css', 'meta.at-rule.container.header.css'];
			['width', 'height', 'inline-size', 'block-size', 'aspect-ratio', 'orientation'].forEach(function (feature) {
				['', 'min-', 'max-'].forEach(function (prefix) {
					// `orientation` is a discrete feature, so it takes no range prefix.
					if (prefix && feature === 'orientation') return;
					var name = prefix + feature;
					var tokens = testGrammar.tokenizeLine('@container (' + name + ': 1px) {}').tokens;
					assert.deepStrictEqual(tokens.find(x => x.value === name).scopes, head.concat(['support.type.property-name.container.css']), name);
				});
			});
		});

		it('tokenizes every scroll-state feature value', function () {
			var head = ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css'];
			var physical = ['none', 'top', 'right', 'bottom', 'left', 'inline-start', 'inline-end', 'block-start', 'block-end'];
			var logical = ['none', 'x', 'y', 'block', 'inline', 'both'];
			var cases = [
				['stuck', physical],
				['snapped', logical],
				['scrollable', physical.concat(['x', 'y', 'block', 'inline'])],
				['scrolled', physical.concat(['x', 'y', 'block', 'inline'])]
			];
			cases.forEach(function (pair) {
				pair[1].forEach(function (value) {
					var tokens = testGrammar.tokenizeLine('@container scroll-state(' + pair[0] + ': ' + value + ') {}').tokens;
					assert.deepStrictEqual(tokens.find(x => x.value === pair[0]).scopes, head.concat(['support.type.property-name.container.css']), pair[0]);
					assert.deepStrictEqual(tokens.find(x => x.value === value).scopes, head.concat(['support.constant.property-value.css']), pair[0] + ': ' + value);
				});
			});
		});

		it('tokenizes an aspect-ratio range as a ratio', function () {
			var head = ['source.css', 'meta.at-rule.container.header.css', 'meta.ratio.css'];
			var tokens = testGrammar.tokenizeLine('@container (aspect-ratio > 16/9) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '16').scopes, head.concat(['constant.numeric.css']));
			assert.deepStrictEqual(tokens.find(x => x.value === '9').scopes, head.concat(['constant.numeric.css']));
			assert.deepStrictEqual(tokens.find(x => x.value === '/').scopes, head.concat(['keyword.operator.arithmetic.css']));
		});

		it('reads the logical operators in any case in every container context', function () {
			var head = ['source.css', 'meta.at-rule.container.header.css'];
			[
				['@container (width>1px) AND (height>1px) {}', 'AND', 'and', head],
				['@container (width>1px) OR (height>1px) {}', 'OR', 'or', head],
				['@container NOT (width>1px) {}', 'NOT', 'not', head],
				['@container style((--a:1) AND (--b:2)) {}', 'AND', 'and', head.concat(['meta.function.style.css'])],
				['@container style((--a:1) OR (--b:2)) {}', 'OR', 'or', head.concat(['meta.function.style.css'])],
				['@container style(NOT (--x:1)) {}', 'NOT', 'not', head.concat(['meta.function.style.css'])],
				['@container scroll-state((stuck: top) AND (snapped: x)) {}', 'AND', 'and', head.concat(['meta.function.scroll-state.css'])],
				['@container scroll-state((stuck: top) OR (snapped: x)) {}', 'OR', 'or', head.concat(['meta.function.scroll-state.css'])],
				['@container scroll-state(NOT (stuck: top)) {}', 'NOT', 'not', head.concat(['meta.function.scroll-state.css'])],
				['@container ((width>1px) AND (height>1px)) {}', 'AND', 'and', head],
				['@container ((width>1px) OR (height>1px)) {}', 'OR', 'or', head],
				['@container (NOT (width>1px)) {}', 'NOT', 'not', head]
			].forEach(function (c) {
				var tokens = testGrammar.tokenizeLine(c[0]).tokens;
				// The scope name stays lowercase whatever the source case.
				assert.deepStrictEqual(tokens.find(x => x.value === c[1]).scopes, c[3].concat(['keyword.operator.logical.' + c[2] + '.container.css']), c[0]);
			});
		});

		it('does not read a reserved word as a container name', function () {
			// The spec reserves these four names, and no others.
			['none', 'and', 'or', 'not'].forEach(function (word) {
				var tokens = testGrammar.tokenizeLine('@container ' + word + ' (width > 1px) {}').tokens;
				assert.ok(!tokens.some(x => x.scopes.includes('variable.parameter.container-name.css')), word + ' was read as a container name');
			});
			var tokens = testGrammar.tokenizeLine('@container card (width > 1px) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'card').scopes, ['source.css', 'meta.at-rule.container.header.css', 'variable.parameter.container-name.css']);
		});

		it('reads a query function name as a container name when no bracket follows', function () {
			// `style` and `scroll-state` are ordinary custom identifiers. Only an
			// immediately following bracket makes either one a query function.
			['style', 'scroll-state'].forEach(function (word) {
				var name = testGrammar.tokenizeLine('@container ' + word + ' (width > 1px) {}').tokens;
				assert.deepStrictEqual(name.find(x => x.value === word).scopes, ['source.css', 'meta.at-rule.container.header.css', 'variable.parameter.container-name.css'], word + ' was not read as a container name');
			});
			var style = testGrammar.tokenizeLine('@container style(--theme: dark) {}').tokens;
			assert.deepStrictEqual(style.find(x => x.value === 'style').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'support.function.style.css']);
			var scrollState = testGrammar.tokenizeLine('@container scroll-state(stuck: top) {}').tokens;
			assert.deepStrictEqual(scrollState.find(x => x.value === 'scroll-state').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.function.scroll-state.css']);
		});

		it('reads a container name that no query follows', function () {
			// The query is optional, so a name may run straight into the body.
			var tokens = testGrammar.tokenizeLine('@container card {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'card').scopes, ['source.css', 'meta.at-rule.container.header.css', 'variable.parameter.container-name.css']);
			var comment = testGrammar.tokenizeLine('@container card /* c */ {}').tokens;
			assert.deepStrictEqual(comment.find(x => x.value === 'card').scopes, ['source.css', 'meta.at-rule.container.header.css', 'variable.parameter.container-name.css']);
		});

		it('reads a container name that follows a comma directly', function () {
			// The prelude is a comma-separated list, so a name may begin at a comma.
			var tokens = testGrammar.tokenizeLine('@container a (width > 1px),b (height > 1px) {}').tokens;
			var head = ['source.css', 'meta.at-rule.container.header.css', 'variable.parameter.container-name.css'];
			assert.deepStrictEqual(tokens.find(x => x.value === 'a').scopes, head);
			assert.deepStrictEqual(tokens.find(x => x.value === 'b').scopes, head);
		});

		it('matches the at-rule and both query functions whatever their case', function () {
			var atRule = testGrammar.tokenizeLine('@CONTAINER (width > 1px) {}').tokens;
			assert.deepStrictEqual(atRule.find(x => x.value === 'CONTAINER').scopes, ['source.css', 'meta.at-rule.container.header.css', 'keyword.control.at-rule.container.css']);
			var style = testGrammar.tokenizeLine('@container STYLE(--theme: dark) {}').tokens;
			assert.deepStrictEqual(style.find(x => x.value === 'STYLE').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'support.function.style.css']);
			var scrollState = testGrammar.tokenizeLine('@container SCROLL-STATE(stuck: top) {}').tokens;
			assert.deepStrictEqual(scrollState.find(x => x.value === 'SCROLL-STATE').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'support.function.scroll-state.css']);
		});

		it('reads an escaped general-enclosed function name as one name', function () {
			// `f\6f o` spells `foo`, so the function name runs across the escape.
			var tokens = testGrammar.tokenizeLine('@container f\\6f o(bar) {}').tokens;
			var head = ['source.css', 'meta.at-rule.container.header.css', 'meta.function.misc.css', 'support.function.misc.css'];
			assert.deepStrictEqual(tokens.find(x => x.value === 'f').scopes, head);
			assert.deepStrictEqual(tokens.find(x => x.value === '\\6f').scopes, head.concat(['constant.character.escape.codepoint.css']));
			assert.deepStrictEqual(tokens.find(x => x.value === ' o').scopes, head);
		});

		it('takes an unknown query function for general-enclosed wherever it is valid', function () {
			['@container future(foo) {}', '@container (future(foo)) {}', '@container style(future(foo)) {}'].forEach(function (line) {
				var tokens = testGrammar.tokenizeLine(line).tokens;
				assert.deepStrictEqual(tokens.find(x => x.value === 'future').scopes.slice(-1), ['support.function.misc.css'], line);
			});
		});

		it('takes a keyword only where a size container feature accepts one', function () {
			// A size container feature takes a length or a ratio. Only
			// `orientation` takes a keyword, so the media feature values that
			// `@media` accepts are not query values here.
			['@container (orientation: portrait) {', '@container card (orientation: landscape) {'].forEach(function (line) {
				var tokens = testGrammar.tokenizeLine(line).tokens;
				var token = tokens.find(x => x.value === 'portrait' || x.value === 'landscape');
				assert.deepStrictEqual(token.scopes, [
					'source.css', 'meta.at-rule.container.header.css', 'support.constant.property-value.css'
				], line);
			});
			[
				['@container (width: fullscreen) {', 'fullscreen'],
				['@container (width > interlace) {', 'interlace'],
				['@container (min-width: coarse) {', 'coarse'],
				['@container scroll-state(stuck: portrait) {', 'portrait']
			].forEach(function (pair) {
				var tokens = testGrammar.tokenizeLine(pair[0]).tokens;
				assert.ok(!tokens.some(t => t.value === pair[1] && t.scopes.includes('support.constant.property-value.css')),
					pair[1] + ' read as a query value in: ' + pair[0]);
			});
		});

		it('reads a logical operator that follows a closing parenthesis', function () {
			// A `)` already separates the identifier, so no space is required.
			[
				['@container (width>1px)and(height>1px) {}', 'and', 'keyword.operator.logical.and.container.css'],
				['@container style((--a:1)and(--b:2)) {}', 'and', 'keyword.operator.logical.and.container.css'],
				['@container scroll-state((stuck)or(snapped)) {}', 'or', 'keyword.operator.logical.or.container.css']
			].forEach(function (t) {
				var tokens = testGrammar.tokenizeLine(t[0]).tokens;
				assert.deepStrictEqual(tokens.find(x => x.value === t[1]).scopes.slice(-1), [t[2]], t[0]);
			});
		});

	});

	describe('@property, @scope and @starting-style', function () {
		it('consumes the whitespace that terminates a hex escape in a custom property name', function () {
			// `\\31 foo` is the single identifier `--1foo`: the space ends the hex
			// escape rather than ending the name.
			var tokens = testGrammar.tokenizeLine('@property --\\31 foo { syntax: "*"; }').tokens;
			var tail = tokens.find(t => t.value === ' foo');
			assert.ok(tail && tail.scopes.includes('variable.css'), 'the escape terminator and what follows it stay part of the name');
		});

		it('keeps a prelude that legally spans lines in the header', function () {
			// `<any-value>` permits a top-level `;` and `<declaration-value>`
			// permits one inside any balanced block, so a prelude whose `)`
			// only arrives on a later line still holds together.
			[
				'@container (future;\n syntax)',
				'@container style(--x: [a;\n b])',
				'@container style(--x: (a;\n b))',
				'@container style(foo(a;\n b))',
				'@container (min-width: 1px) and\n (max-width: 9px)',
				'@scope (.a) to\n (.b)'
			].forEach(function (prelude) {
				var lines = testGrammar.tokenizeLines(prelude + ' {\n.z { color: red; }\n}');
				var close = lines[1].filter(t => t.value === ')').pop();
				assert.ok(close.scopes.some(s => s.startsWith('meta.at-rule.')), prelude + ' -> ) left the header: ' + close.scopes.join('|'));
				assert.deepStrictEqual(lines[2].find(t => t.value === 'z').scopes, ['source.css', 'meta.at-rule.container.body.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'].map(function (s) {
					return prelude.startsWith('@scope') ? s.replace('container', 'scope') : s;
				}), prelude);
			});
		});

		it('keeps scoping the closing parenthesis of a well-formed prelude', function () {
			var tokens = testGrammar.tokenizeLine('@container (width > 400px) {').tokens;
			assert.deepStrictEqual(tokens.find(t => t.value === ')').scopes, ['source.css', 'meta.at-rule.container.header.css', 'punctuation.definition.parameters.end.bracket.round.css']);
			tokens = testGrammar.tokenizeLine('@container style(--theme: dark) {').tokens;
			assert.deepStrictEqual(tokens.find(t => t.value === ')').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.style.css', 'punctuation.section.function.end.bracket.round.css']);
			tokens = testGrammar.tokenizeLine('@container scroll-state(stuck: top) {').tokens;
			assert.deepStrictEqual(tokens.find(t => t.value === ')').scopes, ['source.css', 'meta.at-rule.container.header.css', 'meta.function.scroll-state.css', 'punctuation.section.function.end.bracket.round.css']);
			tokens = testGrammar.tokenizeLine('@scope (.a) to (.b) {').tokens;
			assert.deepStrictEqual(tokens.find(t => t.value === ')').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.start.css', 'punctuation.definition.parameters.end.bracket.round.css']);
			assert.deepStrictEqual(tokens.filter(t => t.value === ')')[1].scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'punctuation.definition.parameters.end.bracket.round.css']);
		});

		it('parses the body of a @starting-style rule', function () {
			// The only existing assertion was on the at-keyword, so the whole
			// body could be emptied without a test failing.
			var tokens = testGrammar.tokenizeLine('@starting-style { .z { opacity: 0; } }').tokens;
			assert.deepStrictEqual(tokens[3], {
				scopes: [
					'source.css',
					'meta.at-rule.starting-style.body.css',
					'punctuation.section.starting-style.begin.bracket.curly.css'
				],
				value: '{'
			});
			assert.deepStrictEqual(tokens[6], {
				scopes: [
					'source.css',
					'meta.at-rule.starting-style.body.css',
					'meta.selector.css',
					'entity.other.attribute-name.class.css'
				],
				value: 'z'
			});
			assert.deepStrictEqual(tokens[10], {
				scopes: [
					'source.css',
					'meta.at-rule.starting-style.body.css',
					'meta.property-list.css',
					'meta.property-name.css',
					'support.type.property-name.css'
				],
				value: 'opacity'
			});
			assert.deepStrictEqual(tokens[18], {
				scopes: [
					'source.css',
					'meta.at-rule.starting-style.body.css',
					'punctuation.section.starting-style.end.bracket.curly.css'
				],
				value: '}'
			});
		});

		it('scopes @property descriptors and the custom property name', function () {
			var lines;
			lines = testGrammar.tokenizeLines('@property --my-color {\n  syntax: "<color>";\n  inherits: false;\n}\n.after { color: red; }');
			assert.deepStrictEqual(lines[0][1], { scopes: ['source.css', 'meta.at-rule.property.header.css', 'keyword.control.at-rule.property.css'], value: 'property' });
			assert.deepStrictEqual(lines[0][3], { scopes: ['source.css', 'meta.at-rule.property.header.css', 'variable.css'], value: '--my-color' });
			assert.deepStrictEqual(lines[1][1], { scopes: ['source.css', 'meta.at-rule.property.body.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'syntax' });
			assert.deepStrictEqual(lines[2][1], { scopes: ['source.css', 'meta.at-rule.property.body.css', 'meta.property-name.css', 'support.type.property-name.css'], value: 'inherits' });
			// The generic at-rule fallback already closed this block correctly, so
			// this only guards the dedicated rule against regressing that behaviour.
			assert.deepStrictEqual(lines[4][0], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
			assert.deepStrictEqual(lines[4][1], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'after' });
		});

		it('scopes the closing brace of a @scope body', function () {
			var tokens = testGrammar.tokenizeLine('@scope (.a) { .x { color: red; } }').tokens;
			assert.deepStrictEqual(tokens[23], {
				scopes: [
					'source.css',
					'meta.at-rule.scope.body.css',
					'punctuation.section.scope.end.bracket.curly.css'
				],
				value: '}'
			});
		});

		it('tokenizes @property descriptor values and closes its body', function () {
			// The existing test asserted the descriptor names but none of
			// their values, so `initial-value` and the generic value path
			// could both be removed without a failure.
			var lines = testGrammar.tokenizeLines('@property --x {\n  syntax: "*";\n  inherits: false;\n  initial-value: red;\n}');
			assert.deepStrictEqual(lines[1][5], {
				scopes: [
					'source.css',
					'meta.at-rule.property.body.css',
					'meta.property-value.css',
					'string.quoted.double.css'
				],
				value: '*'
			});
			assert.deepStrictEqual(lines[2][4], {
				scopes: [
					'source.css',
					'meta.at-rule.property.body.css',
					'meta.property-value.css'
				],
				value: 'false'
			});
			assert.deepStrictEqual(lines[3][1], {
				scopes: [
					'source.css',
					'meta.at-rule.property.body.css',
					'meta.property-name.css',
					'support.type.property-name.css'
				],
				value: 'initial-value'
			});
			assert.deepStrictEqual(lines[3][4], {
				scopes: [
					'source.css',
					'meta.at-rule.property.body.css',
					'meta.property-value.css',
					'support.constant.color.w3c-standard-color-name.css'
				],
				value: 'red'
			});
			assert.deepStrictEqual(lines[4][0], {
				scopes: [
					'source.css',
					'meta.at-rule.property.body.css',
					'punctuation.section.property-list.end.bracket.curly.css'
				],
				value: '}'
			});
		});

		it('tokenizes @property names beginning with a digit after the required dashes', function () {
			var tokens = testGrammar.tokenizeLine('@property --4-grid-columns {').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '--4-grid-columns').scopes, ['source.css', 'meta.at-rule.property.header.css', 'variable.css']);
		});

		it('tokenizes @scope preludes as selectors', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('@scope (.a) to (.b) {').tokens;
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.scope.header.css', 'keyword.control.at-rule.scope.css'], value: 'scope' });
			// The selector before `to` is the scope root and the one after it is
			// the scoping limit, so the two carry different scopes.
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.start.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css'], value: '.' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.start.css', 'entity.other.attribute-name.class.css'], value: 'a' });
			var to = tokens.find(t => t.value === 'to');
			assert.deepStrictEqual(to.scopes, ['source.css', 'meta.at-rule.scope.header.css', 'keyword.operator.logical.scope.css']);
			assert.deepStrictEqual(tokens.find(t => t.value === 'b').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'entity.other.attribute-name.class.css']);
			// A scope root may itself contain a functional pseudo-class, whose
			// closing parenthesis must not end the prelude region.
			var nested = testGrammar.tokenizeLine('@scope (:has(.a)) to (.b) {').tokens;
			assert.deepStrictEqual(nested.find(t => t.value === 'has').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.start.css', 'entity.other.attribute-name.pseudo-class.css']);
			assert.deepStrictEqual(nested.find(t => t.value === 'b').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'entity.other.attribute-name.class.css']);
		});

		it('tokenizes @starting-style', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('@starting-style { .z { opacity: 0; } }').tokens;
			assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.starting-style.header.css', 'keyword.control.at-rule.starting-style.css'], value: 'starting-style' });
		});

		it('tokenizes block at-rules whose prelude is omitted entirely', function () {
			[
				['@container{ .x { color: red; } }', 'container'],
				['@scope{ .x { color: red; } }', 'scope'],
				['@starting-style{ .x { color: red; } }', 'starting-style']
			].forEach(function (pair) {
				var tokens = testGrammar.tokenizeLine(pair[0]).tokens;
				assert.deepStrictEqual(tokens[1], { scopes: ['source.css', 'meta.at-rule.' + pair[1] + '.header.css', 'keyword.control.at-rule.' + pair[1] + '.css'], value: pair[1] }, pair[0]);
				assert.deepStrictEqual(tokens[2].scopes, ['source.css', 'meta.at-rule.' + pair[1] + '.body.css', 'punctuation.section.' + pair[1] + '.begin.bracket.curly.css'], pair[0]);
			});
		});
		it('balances the brackets of a functional pseudo-class it does not recognise', function () {
			// The `)` of `:host(.a)` is not the one that closes the scope
			// root, or a valid selector is mis-scoped and a malformed one
			// resumes as though it had closed.
			var tokens = testGrammar.tokenizeLine('@scope (:host(.a)) to (.b) { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'to').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'keyword.operator.logical.scope.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'b').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'entity.other.attribute-name.class.css']);
		});

		it('leaks an unclosed scope root whether or not the pseudo-class is recognised', function () {
			// `:has()` is recognised and `:host()` is not, and both have to
			// behave the same when the root is left open.
			['@scope (:has(.a){', '@scope (:host(.a){'].forEach(function (prelude) {
				var lines = testGrammar.tokenizeLines(prelude + '\n.after { color: red; }');
				assert.ok(lines[1][0].scopes.includes('meta.at-rule.scope.header.css'), prelude + ' -> ' + JSON.stringify(lines[1][0].scopes));
			});
		});

		it('recognises an escaped scoping limit keyword', function () {
			var tokens = testGrammar.tokenizeLine('@scope (.a) t\\6f (.b) { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 't\\6f ').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'keyword.operator.logical.scope.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'b').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'entity.other.attribute-name.class.css']);
		});

		it('ends a hexadecimal escape in a custom property name at any whitespace', function () {
			// A form feed terminates the escape and belongs to the name, so
			// the rest of the name is not lost.
			var tokens = testGrammar.tokenizeLine('@property --\\31\ffoo { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '\ffoo').scopes, ['source.css', 'meta.at-rule.property.header.css', 'variable.css']);
		});

		it('reads the scoping limit written with simple escapes', function () {
			// A backslash before a non-hexadecimal character is a valid CSS
			// escape for that character, so `\t\o` spells `to`.
			var tokens = testGrammar.tokenizeLine('@scope (.a) \\t\\o (.b) { }').tokens;
			assert.ok(tokens.find(x => x.scopes.includes('keyword.operator.logical.scope.css')), 'no scoping limit keyword');
			assert.ok(tokens.find(x => x.scopes.includes('meta.scope.limit.css')), 'no scoping limit');
		});

		it('reads the scoping limit at the six-digit escape boundary', function () {
			// Six hexadecimal digits are the most an escape may have, so
			// `\\000074` is `t` but `\\0000074` is not.
			var six = testGrammar.tokenizeLine('@scope (.a) \\000074o (.b) { }').tokens;
			assert.deepStrictEqual(six.find(x => x.value === '\\000074o').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'keyword.operator.logical.scope.css']);
			assert.deepStrictEqual(six.find(x => x.value === 'b').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'entity.other.attribute-name.class.css']);

			var seven = testGrammar.tokenizeLine('@scope (.a) \\0000074o (.b) { }').tokens;
			assert.ok(!seven.some(x => x.scopes.includes('keyword.operator.logical.scope.css')), 'seven-digit escape read as `to`');
			assert.ok(!seven.some(x => x.scopes.includes('meta.scope.limit.css')), 'seven-digit escape opened a scoping limit');
		});

		it('ends the scoping limit keyword escape at a form feed', function () {
			var tokens = testGrammar.tokenizeLine('@scope (.a) t\\6f\f(.b) { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 't\\6f\f').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'keyword.operator.logical.scope.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'b').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'entity.other.attribute-name.class.css']);
		});

		it('balances parentheses of a nested unknown function in the scope root', function () {
			var tokens = testGrammar.tokenizeLine('@scope (:host(foo(.a)) > .b) to (.c) { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'b').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.start.css', 'entity.other.attribute-name.class.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'c').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'entity.other.attribute-name.class.css']);
		});

		it('ignores a parenthesis inside a string when balancing the scope root', function () {
			var tokens = testGrammar.tokenizeLine('@scope (:host(")" .a) > .b) to (.c) { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'b').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.start.css', 'entity.other.attribute-name.class.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'c').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'entity.other.attribute-name.class.css']);
		});

		it('balances parentheses of a functional pseudo-class in the scoping limit', function () {
			var tokens = testGrammar.tokenizeLine('@scope (.a) to (:host(.b) > .c) { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'c').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'entity.other.attribute-name.class.css']);
		});

		it('reads the new at-rules and the scoping limit keyword in any case', function () {
			var scope = testGrammar.tokenizeLine('@SCOPE (.a) TO (.b) { }').tokens;
			assert.deepStrictEqual(scope.find(x => x.value === 'SCOPE').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'keyword.control.at-rule.scope.css']);
			assert.deepStrictEqual(scope.find(x => x.value === 'TO').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'keyword.operator.logical.scope.css']);
			assert.deepStrictEqual(scope.find(x => x.value === 'b').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'entity.other.attribute-name.class.css']);

			var property = testGrammar.tokenizeLine('@PROPERTY --x { SYNTAX: "*"; }').tokens;
			assert.deepStrictEqual(property.find(x => x.value === 'PROPERTY').scopes, ['source.css', 'meta.at-rule.property.header.css', 'keyword.control.at-rule.property.css']);
			assert.deepStrictEqual(property.find(x => x.value === 'SYNTAX').scopes, ['source.css', 'meta.at-rule.property.body.css', 'meta.property-name.css', 'support.type.property-name.css']);

			var starting = testGrammar.tokenizeLine('@STARTING-STYLE { a { color: red; } }').tokens;
			assert.deepStrictEqual(starting.find(x => x.value === 'STARTING-STYLE').scopes, ['source.css', 'meta.at-rule.starting-style.header.css', 'keyword.control.at-rule.starting-style.css']);
		});

		it('allows comments around the scoping limit keyword', function () {
			var tokens = testGrammar.tokenizeLine('@scope /*head*/ (.a) to /*limit*/ (.b) { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'head').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'comment.block.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'limit').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'comment.block.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'b').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'entity.other.attribute-name.class.css']);
		});

		it('marks the punctuation of the new at-rules', function () {
			var tokens = testGrammar.tokenizeLine('@scope (.a) to (.b) { }').tokens;
			var ats = tokens.filter(x => x.scopes.includes('punctuation.definition.keyword.css'));
			assert.strictEqual(ats.length, 1);
			assert.deepStrictEqual(ats[0].scopes, ['source.css', 'meta.at-rule.scope.header.css', 'keyword.control.at-rule.scope.css', 'punctuation.definition.keyword.css']);

			var opens = tokens.filter(x => x.scopes.includes('punctuation.definition.parameters.begin.bracket.round.css'));
			assert.strictEqual(opens.length, 2);
			assert.ok(opens[0].scopes.includes('meta.scope.start.css'), 'scope root parenthesis unmarked');
			assert.ok(opens[1].scopes.includes('meta.scope.limit.css'), 'scoping limit parenthesis unmarked');

			var property = testGrammar.tokenizeLine('@property --x { }').tokens;
			assert.deepStrictEqual(property.find(x => x.value === '{').scopes, ['source.css', 'meta.at-rule.property.body.css', 'punctuation.section.property-list.begin.bracket.curly.css']);
		});

		it('does not read an over-long escape as the scoping limit', function () {
			// A hexadecimal escape is at most six digits, so `\00000074`
			// is not `t` and there is no scoping limit here.
			var tokens = testGrammar.tokenizeLine('@scope (.a) \\00000074o (.b) { }').tokens;
			assert.ok(!tokens.some(x => x.scopes.includes('keyword.operator.logical.scope.css')), 'over-long escape read as `to`');
			assert.ok(!tokens.some(x => x.scopes.includes('meta.scope.limit.css')), 'over-long escape opened a scoping limit');
		});


		it('tokenizes a declaration written directly in the @scope body', function () {
			var tokens = testGrammar.tokenizeLine('@scope (.a) { color: red; }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'color').scopes, ['source.css', 'meta.at-rule.scope.body.css', 'meta.property-name.css', 'support.type.property-name.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'red').scopes, ['source.css', 'meta.at-rule.scope.body.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === ';').scopes, ['source.css', 'meta.at-rule.scope.body.css', 'punctuation.terminator.rule.css']);
		});

		it('tokenizes a declaration in a nested @starting-style body', function () {
			// A top-level `@starting-style` holds style rules. A declaration is
			// written straight into the body only when the rule is nested in one.
			var tokens = testGrammar.tokenizeLine('#target { @starting-style { opacity: 0; } }').tokens;
			var head = ['source.css', 'meta.property-list.css', 'meta.at-rule.starting-style.body.css'];
			assert.deepStrictEqual(tokens.find(x => x.value === 'opacity').scopes, head.concat(['meta.property-name.css', 'support.type.property-name.css']));
			assert.deepStrictEqual(tokens.find(x => x.value === '0').scopes, head.concat(['meta.property-value.css', 'constant.numeric.css']));
			assert.deepStrictEqual(tokens.find(x => x.value === ';').scopes, head.concat(['punctuation.terminator.rule.css']));
		});

		it('tokenizes a scoping limit written without a scope root', function () {
			// Both boundaries are optional, so `to (...)` may stand alone.
			var tokens = testGrammar.tokenizeLine('@scope to (.limit) { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'to').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'keyword.operator.logical.scope.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'limit').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'entity.other.attribute-name.class.css']);
		});

		it('tokenizes a list of @property names', function () {
			// `@property <custom-property-name>#` registers every name in the list.
			var tokens = testGrammar.tokenizeLine('@property --width, --height, --depth { }').tokens;
			var head = ['source.css', 'meta.at-rule.property.header.css'];
			['--width', '--height', '--depth'].forEach(function (name) {
				assert.deepStrictEqual(tokens.find(x => x.value === name).scopes, head.concat(['variable.css']), name);
			});
			assert.deepStrictEqual(tokens.filter(x => x.value === ',').length, 2);
			tokens.filter(x => x.value === ',').forEach(function (comma) {
				assert.deepStrictEqual(comma.scopes, head.concat(['punctuation.separator.list.comma.css']));
			});
		});

		it('keeps a balanced block in an initial-value inside the value', function () {
			// A registered initial value is a `<declaration-value>`, which admits a
			// balanced block, so the descriptor after it is still a descriptor.
			var lines = testGrammar.tokenizeLines('@property --x {\n  initial-value: {"foo":"bar"};\n  inherits: false;\n}');
			assert.deepStrictEqual(lines[2].find(x => x.value === 'inherits').scopes, ['source.css', 'meta.at-rule.property.body.css', 'meta.property-name.css', 'support.type.property-name.css']);
		});

		it('leaks past a malformed semicolon form exactly as main does', function () {
			// These at-rules take no semicolon form. A malformed one must swallow
			// what follows rather than resume, which is what a browser does.
			['@scope (.a); .after { color: red; }', '@property --x; .after { color: red; }'].forEach(function (line) {
				var tokens = testGrammar.tokenizeLine(line).tokens;
				assert.ok(!tokens.some(x => x.scopes.includes('meta.selector.css')), line + ' recovered at the semicolon');
			});
		});

		it('tokenizes a comment between @starting-style and its body', function () {
			var tokens = testGrammar.tokenizeLine('@starting-style /* c */ { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '/*').scopes, ['source.css', 'meta.at-rule.starting-style.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === ' c ').scopes, ['source.css', 'meta.at-rule.starting-style.header.css', 'comment.block.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === '*/').scopes, ['source.css', 'meta.at-rule.starting-style.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']);
		});

		it('tokenizes a comment between @property and the property name', function () {
			var tokens = testGrammar.tokenizeLine('@property /* c */ --x { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === ' c ').scopes, ['source.css', 'meta.at-rule.property.header.css', 'comment.block.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === '--x').scopes, ['source.css', 'meta.at-rule.property.header.css', 'variable.css']);
		});

		it('tokenizes a comment inside the @property body', function () {
			var tokens = testGrammar.tokenizeLine('@property --x { /* c */ syntax: "*"; }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === ' c ').scopes, ['source.css', 'meta.at-rule.property.body.css', 'comment.block.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'syntax').scopes, ['source.css', 'meta.at-rule.property.body.css', 'meta.property-name.css', 'support.type.property-name.css']);
		});

		it('tokenizes an escape inside the @property body', function () {
			var tokens = testGrammar.tokenizeLine('@property --x { synt\\61 x: "*"; }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '\\61').scopes, ['source.css', 'meta.at-rule.property.body.css', 'constant.character.escape.codepoint.css']);
		});

		it('marks the at sign of @starting-style and @property', function () {
			var starting = testGrammar.tokenizeLine('@starting-style { }').tokens;
			assert.deepStrictEqual(starting[0], { scopes: ['source.css', 'meta.at-rule.starting-style.header.css', 'keyword.control.at-rule.starting-style.css', 'punctuation.definition.keyword.css'], value: '@' });
			var property = testGrammar.tokenizeLine('@property --x { }').tokens;
			assert.deepStrictEqual(property[0], { scopes: ['source.css', 'meta.at-rule.property.header.css', 'keyword.control.at-rule.property.css', 'punctuation.definition.keyword.css'], value: '@' });
		});

		it('tokenizes a selector inside a balanced group in the scope root', function () {
			var tokens = testGrammar.tokenizeLine('@scope (:unknownfn(.a) .b) { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'a').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.start.css', 'entity.other.attribute-name.class.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'b').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.start.css', 'entity.other.attribute-name.class.css']);
		});

		it('tokenizes a selector inside a balanced group in the scoping limit', function () {
			var tokens = testGrammar.tokenizeLine('@scope (.a) to (:unknownfn(#b)) { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'b').scopes, ['source.css', 'meta.at-rule.scope.header.css', 'meta.scope.limit.css', 'entity.other.attribute-name.id.css']);
		});
	});

	describe('value functions', function () {
		it('bounds an unterminated env() to a single argument name', function () {
			// The name is the first argument, so the region that looks for it
			// closes as soon as the first argument turns out not to be a name.
			// Nothing on the line below an unterminated env() is scoped as one.
			var lines = testGrammar.tokenizeLines('a { padding: env(\n.after > p { color: red; }');
			assert.deepStrictEqual(lines[1].filter(t => t.scopes.includes('variable.argument.css')).map(t => t.value), []);
		});

		it('closes anchor() and anchor-size()', function () {
			// The closing parenthesis of the anchor rule was the one part of
			// it no test asserted, so its scope could be renamed freely.
			var tokens = testGrammar.tokenizeLine('a { top: anchor(--x bottom); width: anchor-size(--x width); }').tokens;
			[12, 23].forEach(function (index) {
				assert.deepStrictEqual(tokens[index], {
					scopes: [
						'source.css',
						'meta.property-list.css',
						'meta.property-value.css',
						'meta.function.anchor.css',
						'punctuation.section.function.end.bracket.round.css'
					],
					value: ')'
				}, 'token ' + index);
			});
		});

		it('does not abandon the line when an env() argument cannot be named', function () {
			// Before the argument region excluded the characters its own `end`
			// matches, `begin` and `end` both matched at zero width and the
			// tokenizer emitted the remainder of the line as a single token.
			var prefix = ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css'];
			var tokens = testGrammar.tokenizeLine('a { padding: env(;) }').tokens;
			assert.deepStrictEqual(tokens.slice(9, 11), [
				{ scopes: prefix, value: ';' },
				{ scopes: prefix.concat('punctuation.section.function.end.bracket.round.css'), value: ')' }
			]);

			// An unbalanced `{` keeps the block open, exactly as it does for any
			// other function, but the line is still tokenized to its end.
			tokens = testGrammar.tokenizeLine('a { padding: env({) }').tokens;
			assert.deepStrictEqual(tokens[9], { scopes: prefix.concat('punctuation.section.group.begin.bracket.curly.css'), value: '{' });
			assert.deepStrictEqual(tokens[11], { scopes: prefix.concat('punctuation.section.group.end.bracket.curly.css'), value: '}' });
		});

		it('does not absorb whitespace into env() argument scopes', function () {
			var prefix = ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css'];
			assert.deepStrictEqual(testGrammar.tokenizeLine('a { padding: env( safe-area-inset-top ); }').tokens.slice(8, 12), [
				{ scopes: prefix.concat('punctuation.section.function.begin.bracket.round.css'), value: '(' },
				{ scopes: prefix, value: ' ' },
				{ scopes: prefix.concat('support.constant.property-value.css'), value: 'safe-area-inset-top' },
				{ scopes: prefix, value: ' ' }
			]);

			assert.deepStrictEqual(testGrammar.tokenizeLine('a { padding: env( --custom ); }').tokens.slice(8, 12), [
				{ scopes: prefix.concat('punctuation.section.function.begin.bracket.round.css'), value: '(' },
				{ scopes: prefix, value: ' ' },
				{ scopes: prefix.concat('variable.argument.css'), value: '--custom' },
				{ scopes: prefix, value: ' ' }
			]);
		});

		it('does not scope env() fallback values as environment variables', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a { padding: env(--custom, red); }').tokens;
			assert.deepStrictEqual(tokens.find(t => t.value === 'red').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'support.constant.color.w3c-standard-color-name.css']);
			assert.ok(!tokens.find(t => t.value === 'red' && t.scopes.includes('variable.argument.css')));
		});

		it('keeps an escaped env() identifier in a single token', function () {
			// `\61 bc` is one CSS identifier: the space terminates the hex escape.
			var tokens = testGrammar.tokenizeLine('a { padding: env(\\61 bc, 1px); }').tokens;
			assert.deepStrictEqual(tokens.find(t => t.scopes.includes('variable.argument.css')), {
				scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'variable.argument.css'],
				value: '\\61 bc'
			});
		});

		it('keeps functions that the css-values-5 draft still defines', function () {
			// The draft defines the value-cycling function as `cycle()`;
			// `toggle()` was its earlier name and no longer appears in it.
			['progress', 'cycle'].forEach(function (fn) {
				var tokens = testGrammar.tokenizeLine('a { width: ' + fn + '(1px, 2px); }').tokens;
				var t = tokens.find(x => x.value === fn);
				assert.deepStrictEqual(t.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], fn);
			});
		});

		it('keeps nested functions scoped inside env() arguments', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a { padding: env(--custom calc(1 + 1), 10px); }').tokens;
			assert.deepStrictEqual(tokens.find(t => t.value === 'calc').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'meta.function.calc.css', 'support.function.calc.css']);
			assert.deepStrictEqual(tokens.find(t => t.value === '10').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'constant.numeric.css']);
		});

		it('recognises the timeline functions in a value', function () {
			// The `animation-timeline` property name itself is left to
			// microsoft/vscode-css#32; this covers the functions in its value.
			['view', 'scroll'].forEach(function (fn) {
				var tokens = testGrammar.tokenizeLine('a { animation-timeline: ' + fn + '(block); }').tokens;
				assert.deepStrictEqual(tokens.find(x => x.value === fn).scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], fn);
			});
		});

		it('scopes a custom color space in color-mix()', function () {
			// <color-space> accepts a <dashed-ident> naming an @color-profile.
			var tokens = testGrammar.tokenizeLine('a { color: color-mix(in --brand-space, red, blue); }').tokens;
			assert.deepStrictEqual(tokens.find(t => t.value === '--brand-space').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'variable.parameter.misc.css']);
		});

		it('scopes only the first argument of env() as the variable name', function () {
			// css-env-1 is `env( <custom-ident> <integer>*, <declaration-value>? )`,
			// so a second identifier is not a second environment variable name.
			[
				['a { padding: env(--x --y); }', '--x', '--y'],
				['a { padding: env(safe-area-inset-top other); }', 'safe-area-inset-top', 'other']
			].forEach(function (pair) {
				var tokens = testGrammar.tokenizeLine(pair[0]).tokens;
				assert.ok(tokens.find(t => t.value === pair[1] && t.scopes.length === 5), pair[0]);
				assert.ok(!tokens.find(t => t.value.includes(pair[2]) && t.scopes.length > 4), pair[0]);
			});
		});

		it('tokenizes additional math functions', function () {
			['mod', 'rem', 'round'].forEach(function (fn) {
				var tokens = testGrammar.tokenizeLine('a { width: ' + fn + '(10px, 3px); }').tokens;
				var t = tokens.find(x => x.value === fn);
				assert.deepStrictEqual(t.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css'], fn);
			});
		});

		it('tokenizes anchor() and anchor-size()', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a { top: anchor(--x bottom); }').tokens;
			var fn = tokens.find(t => t.value === 'anchor');
			assert.deepStrictEqual(fn.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.anchor.css', 'support.function.misc.css']);
			var arg = tokens.find(t => t.value === '--x');
			assert.deepStrictEqual(arg.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.anchor.css', 'variable.argument.css']);

			tokens = testGrammar.tokenizeLine('a { width: anchor-size(--x width); }').tokens;
			var fn2 = tokens.find(t => t.value === 'anchor-size');
			assert.deepStrictEqual(fn2.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.anchor.css', 'support.function.misc.css']);
		});

		it('tokenizes color-mix() as a color function', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a { color: color-mix(in oklch, red, blue); }').tokens;
			var fn = tokens.find(t => t.value === 'color-mix');
			assert.deepStrictEqual(fn.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css']);
		});

		it('tokenizes color-mix() interpolation keywords', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a { color: color-mix(in oklch longer hue, red 40%, blue); }').tokens;
			// `in`, the colorspace and the hue-interpolation method are not property
			// values, so they need their own scope rather than falling through unscoped.
			assert.deepStrictEqual(tokens.find(t => t.value === 'in').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'variable.parameter.misc.css']);
			assert.deepStrictEqual(tokens.find(t => t.value === 'oklch').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'variable.parameter.misc.css']);
			assert.deepStrictEqual(tokens.find(t => t.value === 'longer').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'variable.parameter.misc.css']);
			assert.deepStrictEqual(tokens.find(t => t.value === 'red').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.constant.color.w3c-standard-color-name.css']);
		});

		it('tokenizes env() arguments separated from the bracket by a comment', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a { padding: env(/* c */ safe-area-inset-top, 10px); }').tokens;
			assert.deepStrictEqual(tokens.find(t => t.value === 'safe-area-inset-top').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'support.constant.property-value.css']);
			assert.deepStrictEqual(tokens.find(t => t.value === '/*').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']);
		});

		it('tokenizes env() arguments written on a continuation line', function () {
			var lines;
			lines = testGrammar.tokenizeLines('a {\n\tpadding-top: env(\n\t\tsafe-area-inset-top,\n\t\t12px\n\t);\n}');
			assert.deepStrictEqual(lines[2].find(t => t.value === 'safe-area-inset-top').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'support.constant.property-value.css']);

			lines = testGrammar.tokenizeLines('a {\n\tpadding-top: env(\n\t\t--custom,\n\t\t12px\n\t);\n}');
			assert.deepStrictEqual(lines[2].find(t => t.value === '--custom').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'variable.argument.css']);
		});

		it('tokenizes env() indices as numeric values', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a { width: env(viewport-segment-width 0 0, 10px); }').tokens;
			assert.deepStrictEqual(tokens.find(t => t.value === 'viewport-segment-width').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'support.constant.property-value.css']);
			assert.deepStrictEqual(tokens.find(t => t.value === '0').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'constant.numeric.css']);
		});

		it('tokenizes env() with a known environment variable', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a { padding: env(safe-area-inset-top); }').tokens;
			var fn = tokens.find(t => t.value === 'env');
			assert.deepStrictEqual(fn.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'support.function.misc.css']);
			var arg = tokens.find(t => t.value === 'safe-area-inset-top');
			assert.deepStrictEqual(arg.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'support.constant.property-value.css']);
		});

		it('tokenizes light-dark() as a color function', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a { color: light-dark(white, black); }').tokens;
			var fn = tokens.find(t => t.value === 'light-dark');
			assert.deepStrictEqual(fn.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css']);
		});

		it('tokenizes the logical anchor-size() keywords', function () {
			['block', 'inline', 'self-block', 'self-inline'].forEach(function (keyword) {
				var tokens = testGrammar.tokenizeLine('a { width: anchor-size(--x ' + keyword + '); }').tokens;
				var t = tokens.find(x => x.value === keyword);
				assert.deepStrictEqual(t.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.anchor.css', 'support.constant.property-value.css'], keyword);
			});
		});
		it('keeps an escaped anchor name whole', function () {
			// `--\61 nchor` is one dashed-ident spelling `--anchor`, and the
			// space terminates the escape rather than the name.
			var tokens = testGrammar.tokenizeLine('a { top: anchor(--\\61 nchor bottom); }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '--\\61 nchor').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.anchor.css', 'variable.argument.css']);
		});

		it('keeps an escaped custom colour space whole', function () {
			var tokens = testGrammar.tokenizeLine('a { color: color-mix(in --my\\2d space, red, blue); }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '--my\\2d space').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'variable.parameter.misc.css']);
		});

		it('does not take a later identifier for an environment variable name', function () {
			// The name is the first component. If the first component cannot
			// be a name then the call has none, and `red` is just a value.
			['env(calc(foo) red)', 'env(var(--x) red)', 'env("bad" red)', 'env(10px red)'].forEach(function (call) {
				var tokens = testGrammar.tokenizeLine('a { padding: ' + call + '; }').tokens;
				var red = tokens.find(x => x.value === 'red');
				assert.ok(!red.scopes.includes('variable.argument.css'), call + ' -> ' + JSON.stringify(red.scopes));
				assert.ok(red.scopes.includes('support.constant.color.w3c-standard-color-name.css'), call + ' -> ' + JSON.stringify(red.scopes));
			});
		});

		it('still scopes an environment variable name that is the first component', function () {
			var tokens = testGrammar.tokenizeLine('a { padding: env(safe-area-inset-top, 0px); }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'safe-area-inset-top').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'support.constant.property-value.css']);
			var custom = testGrammar.tokenizeLine('a { padding: env(--custom-name, 0px); }').tokens;
			assert.deepStrictEqual(custom.find(x => x.value === '--custom-name').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'variable.argument.css']);
		});

		// Every name this change adds to a list is asserted here, so that
		// removing one from the grammar fails a test.
		function eachScopes(cases, tail) {
			cases.forEach(function (pair) {
				var tokens = testGrammar.tokenizeLine(pair[1]).tokens;
				var token = tokens.find(x => x.value === pair[0]);
				assert.ok(token, pair[0] + ' produced no token in: ' + pair[1]);
				assert.deepStrictEqual(token.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css'].concat(tail), pair.join(' in '));
			});
		}

		it('names every environment variable it adds', function () {
			eachScopes([
				['safe-area-inset-right', 'a { top: env(safe-area-inset-right); }'],
				['safe-area-max-inset-top', 'a { top: env(safe-area-max-inset-top); }'],
				['titlebar-area-x', 'a { top: env(titlebar-area-x); }'],
				['keyboard-inset-height', 'a { top: env(keyboard-inset-height); }'],
				['viewport-segment-width', 'a { top: env(viewport-segment-width); }'],
				['preferred-text-scale', 'a { top: env(preferred-text-scale); }']
			], ['meta.function.env.css', 'support.constant.property-value.css']);
		});

		it('names every color function it adds', function () {
			eachScopes([
				['color-mix', 'a { color: color-mix(in oklch, red, blue); }'],
				['light-dark', 'a { color: light-dark(red, blue); }'],
				['contrast-color', 'a { color: contrast-color(red); }'],
				['device-cmyk', 'a { color: device-cmyk(0 0 0 1); }']
			], ['meta.function.color.css', 'support.function.misc.css']);
		});

		it('names every value function it adds', function () {
			eachScopes([
				['mod', 'a { width: mod(x); }'],
				['calc-size', 'a { width: calc-size(x); }'],
				['calc-mix', 'a { width: calc-mix(x); }'],
				['calc-interpolate', 'a { width: calc-interpolate(x); }'],
				['random', 'a { width: random(x); }'],
				['cycle', 'a { width: cycle(x); }'],
				['palette-mix', 'a { width: palette-mix(x); }'],
				['paint', 'a { background: paint(x); }'],
				['sibling-index', 'a { width: sibling-index(x); }'],
				['sibling-count', 'a { width: sibling-count(x); }'],
				['random-item', 'a { width: random-item(--k, 1px, 2px); }']
			], ['meta.function.misc.css', 'support.function.misc.css']);
		});

		it('names every anchor side it adds', function () {
			eachScopes([
				['self-start', 'a { top: anchor(--a self-start); }'],
				['self-end', 'a { top: anchor(--a self-end); }'],
				['self-block', 'a { width: anchor-size(--a self-block); }']
			], ['meta.function.anchor.css', 'support.constant.property-value.css']);
		});

		it('reads an environment variable name that starts with a digit', function () {
			// `env()` takes a `<custom-ident>`, and `--1foo` is one: a digit may
			// follow the two hyphens even though it may not start a bare ident.
			var tokens = testGrammar.tokenizeLine('a { padding: env(--1foo, 0px); }').tokens;
			var token = tokens.find(x => x.value === '--1foo');
			assert.deepStrictEqual(token.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'variable.argument.css']);
		});

		it('leaves an identifier alone in the colour functions that take no interpolation method', function () {
			// `color-mix()` is the only one of these that takes a
			// `<color-interpolation-method>`, so an identifier in the others is
			// not a colour space and is left to `#property-values`.
			['a { color: light-dark(foo, bar); }', 'a { color: contrast-color(foo); }', 'a { color: device-cmyk(foo 0 0 1); }'].forEach(function (line) {
				var tokens = testGrammar.tokenizeLine(line).tokens;
				var token = tokens.find(x => x.value.trim() === 'foo');
				assert.deepStrictEqual(token.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css'], line);
			});
		});

		it('reads a colour space in color-mix() only', function () {
			var tokens = testGrammar.tokenizeLine('a { color: color-mix(in --brand-space, red, blue); }').tokens;
			var token = tokens.find(x => x.value === '--brand-space');
			assert.deepStrictEqual(token.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'variable.parameter.misc.css']);
		});

		it('keeps the anchor() and anchor-size() keyword sets apart', function () {
			// `anchor()` takes an `<anchor-side>` and `anchor-size()` takes an
			// `<anchor-size>`. The two sets are disjoint, so neither function
			// takes the other's keywords. Only the keywords that are not also
			// ordinary property values are checked: `top` is a property value
			// in its own right, so `#property-values` scopes it in either
			// function whatever this matcher does.
			[
				['a { top: anchor(--a width); }', 'width'],
				['a { top: anchor(--a height); }', 'height'],
				['a { top: anchor(--a self-block); }', 'self-block'],
				['a { top: anchor(--a self-inline); }', 'self-inline'],
				['a { width: anchor-size(--a self-start); }', 'self-start'],
				['a { width: anchor-size(--a self-end); }', 'self-end']
			].forEach(function (c) {
				var tokens = testGrammar.tokenizeLine(c[0]).tokens;
				assert.ok(!tokens.some(x => x.value === c[1] && x.scopes.includes('support.constant.property-value.css')), c[0]);
			});
		});

		it('leaves the color functions that were already here alone', function () {
			// The interpolation-keyword matcher is only on the functions this
			// change adds, so an identifier in rgb() is scoped as it was.
			var tokens = testGrammar.tokenizeLine('a { color: rgb(foo); }').tokens;
			var token = tokens.find(x => x.value === 'foo');
			assert.deepStrictEqual(token.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css']);
		});

		it('scopes an interpolation keyword in the color functions it adds', function () {
			var tokens = testGrammar.tokenizeLine('a { color: color-mix(in oklch, red, blue); }').tokens;
			var token = tokens.find(x => x.value === 'oklch');
			assert.deepStrictEqual(token.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'variable.parameter.misc.css']);
		});

		it('does not name an env() argument that cannot be a name', function () {
			// The name is the first argument. A dimension is not a name, and
			// neither is a CSS-wide keyword, so neither is scoped as one and
			// nor is anything after them.
			['a { padding: env(-10px, red); }', 'a { padding: env(initial, red); }'].forEach(function (line) {
				var tokens = testGrammar.tokenizeLine(line).tokens;
				assert.deepStrictEqual(tokens.filter(t => t.scopes.includes('variable.argument.css')).map(t => t.value), [], line);
			});
		});

		it('does not name an env() identifier from a following line', function () {
			// The first argument is on the next line and is not a name, so the
			// identifier after it is not promoted to one.
			var lines = testGrammar.tokenizeLines('a { padding: env(\n\t10px red\n); }');
			var named = lines.flat().filter(t => t.scopes.includes('variable.argument.css'));
			assert.deepStrictEqual(named, []);
		});

		it('reads an anchor name that begins with a digit', function () {
			// A `<dashed-ident>` is `--` and then any name characters, so a
			// digit may follow the two hyphens.
			var tokens = testGrammar.tokenizeLine('a { top: anchor(--1foo top); }').tokens;
			var token = tokens.find(x => x.value === '--1foo');
			assert.deepStrictEqual(token.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.anchor.css', 'variable.argument.css']);
		});

		it('does not read an anchor name out of a longer identifier', function () {
			var tokens = testGrammar.tokenizeLine('a { top: anchor(foo--bar top); }').tokens;
			assert.ok(!tokens.some(t => t.scopes.includes('variable.argument.css')), 'read a name out of `foo--bar`');
		});

		it('ends an env() escape on a form feed', function () {
			// A form feed is whitespace, so it terminates a hexadecimal
			// escape rather than ending the name: `--\61\fb` is `--ab`, and
			// the name does not stop short at the escape.
			var tokens = testGrammar.tokenizeLine('a { padding: env(--\\61\fb); }').tokens;
			var token = tokens.find(x => x.scopes.includes('variable.argument.css'));
			assert.strictEqual(token.value, '--\\61\fb');
		});

		it('tokenizes every known environment variable name', function () {
			var expected = ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'support.constant.property-value.css'];
			var names = [].concat(
				['top', 'right', 'bottom', 'left'].map(x => 'safe-area-inset-' + x),
				['top', 'right', 'bottom', 'left'].map(x => 'safe-area-max-inset-' + x),
				['x', 'y', 'width', 'height'].map(x => 'titlebar-area-' + x),
				['top', 'right', 'bottom', 'left', 'width', 'height'].map(x => 'keyboard-inset-' + x),
				['top', 'right', 'bottom', 'left', 'width', 'height'].map(x => 'viewport-segment-' + x),
				['preferred-text-scale']
			);
			assert.strictEqual(names.length, 25);
			names.forEach(function (name) {
				var tokens = testGrammar.tokenizeLine('a { padding: env(' + name + ', red); }').tokens;
				assert.deepStrictEqual(tokens.find(x => x.value === name).scopes, expected, name);
			});
		});

		it('does not read a CSS-wide keyword as an environment variable name', function () {
			['initial', 'inherit', 'unset', 'revert', 'revert-layer', 'default'].forEach(function (word) {
				var tokens = testGrammar.tokenizeLine('a { padding: env(' + word + ', red); }').tokens;
				var token = tokens.find(x => x.value === word);
				assert.ok(token, word);
				assert.ok(!token.scopes.includes('variable.argument.css'), word + ' was read as an environment variable name');
			});
			// A name that merely starts with one of them is still a name.
			var tokens = testGrammar.tokenizeLine('a { padding: env(initial-position, red); }').tokens;
			assert.ok(tokens.find(x => x.value === 'initial-position').scopes.includes('variable.argument.css'));
		});

		it('gives up on an environment variable name when the first component is a function', function () {
			// The name is the first component, so a function in that position
			// means there is no name and no later identifier may take its place.
			var lines = testGrammar.tokenizeLines('a { padding: env(\n  /* before */ calc(x)\n  /* after */ red\n); }');
			var found = lines[2].find(x => x.value === 'red');
			assert.ok(found, 'red not tokenized');
			assert.deepStrictEqual(lines[1].find(x => x.value === 'calc').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.env.css', 'meta.function.calc.css', 'support.function.calc.css']);
			assert.ok(!found.scopes.includes('variable.argument.css'), 'a later line was read as the environment variable name');
			assert.ok(found.scopes.includes('support.constant.color.w3c-standard-color-name.css'));
		});

		it('tokenizes every anchor and anchor-size keyword', function () {
			// Each keyword is checked in the function that takes it: the
			// `<anchor-side>` set belongs to `anchor()` and the `<anchor-size>`
			// set to `anchor-size()`.
			[
				['anchor', ['top', 'right', 'bottom', 'left', 'center', 'start', 'end', 'self-start', 'self-end', 'inside', 'outside']],
				['anchor-size', ['width', 'height', 'block', 'inline', 'self-block', 'self-inline']]
			].forEach(function (pair) {
				pair[1].forEach(function (keyword) {
					var line = 'a { top: ' + pair[0] + '(--a ' + keyword + '); }';
					var tokens = testGrammar.tokenizeLine(line).tokens.filter(x => x.value === keyword);
					var token = tokens[tokens.length - 1];
					assert.ok(token, pair[0] + ' ' + keyword);
					assert.deepStrictEqual(token.scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.anchor.css', 'support.constant.property-value.css'], pair[0] + ' ' + keyword);
				});
			});
		});

		it('takes a length or a colour as an anchor fallback', function () {
			var head = ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.anchor.css'];
			var length = testGrammar.tokenizeLine('a { top: anchor(--a 10px); }').tokens;
			assert.deepStrictEqual(length.find(x => x.value === '10').scopes, head.concat(['constant.numeric.css']));
			assert.deepStrictEqual(length.find(x => x.value === 'px').scopes, head.concat(['constant.numeric.css', 'keyword.other.unit.px.css']));
			var colour = testGrammar.tokenizeLine('a { top: anchor(--a red); }').tokens;
			assert.deepStrictEqual(colour.find(x => x.value === 'red').scopes, head.concat(['support.constant.color.w3c-standard-color-name.css']));
		});

		it('scopes the brackets and the anchor name of anchor-size()', function () {
			// `anchor-size()` is matched separately from `anchor()`, so its own
			// brackets and name are asserted rather than assumed.
			var head = ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.anchor.css'];
			var tokens = testGrammar.tokenizeLine('a { width: anchor-size(--a width); }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '(').scopes, head.concat(['punctuation.section.function.begin.bracket.round.css']));
			assert.deepStrictEqual(tokens.find(x => x.value === ')').scopes, head.concat(['punctuation.section.function.end.bracket.round.css']));
			assert.deepStrictEqual(tokens.find(x => x.value === '--a').scopes, head.concat(['variable.argument.css']));
		});

		it('takes a length or a keyword as an anchor-size fallback', function () {
			var head = ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.anchor.css'];
			var length = testGrammar.tokenizeLine('a { width: anchor-size(--a, 10px); }').tokens;
			assert.deepStrictEqual(length.find(x => x.value === '10').scopes, head.concat(['constant.numeric.css']));
			assert.deepStrictEqual(length.find(x => x.value === 'px').scopes, head.concat(['constant.numeric.css', 'keyword.other.unit.px.css']));
			var keyword = testGrammar.tokenizeLine('a { width: anchor-size(--a, auto); }').tokens;
			assert.deepStrictEqual(keyword.find(x => x.value === 'auto').scopes, head.concat(['support.constant.property-value.css']));
		});

		it('takes a custom colour space whose name starts with a digit', function () {
			var tokens = testGrammar.tokenizeLine('a { color: color-mix(in --1foo, red, blue); }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '--1foo').scopes, ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'variable.parameter.misc.css']);
		});

		it('marks the brackets of the colour and anchor functions', function () {
			[
				['a { color: rgb(0 0 0); }', 'meta.function.color.css'],
				['a { color: color-mix(in --1foo, red, blue); }', 'meta.function.color.css'],
				['a { top: anchor(--a top); }', 'meta.function.anchor.css']
			].forEach(function (c) {
				var tokens = testGrammar.tokenizeLine(c[0]).tokens;
				var head = ['source.css', 'meta.property-list.css', 'meta.property-value.css', c[1]];
				assert.deepStrictEqual(tokens.find(x => x.value === '(').scopes, head.concat(['punctuation.section.function.begin.bracket.round.css']), c[0]);
				assert.deepStrictEqual(tokens.filter(x => x.value === ')')[0].scopes, head.concat(['punctuation.section.function.end.bracket.round.css']), c[0]);
			});
		});

	});

	describe('Selectors 4 and 5', function () {
		it('accepts an `of` clause not separated from its selector by a space', function () {
			// `of` is an identifier, so a class, id, attribute or comment may follow
			// it directly. Requiring whitespace dropped the selector on the floor.
			[['a:nth-child(2 of.x) {}', 'x', 'entity.other.attribute-name.class.css'],
			 ['a:nth-child(2 of#x) {}', 'x', 'entity.other.attribute-name.id.css'],
			 ['a:nth-child(2 of/*c*/.x) {}', 'x', 'entity.other.attribute-name.class.css']].forEach(function (probe) {
				var tokens = testGrammar.tokenizeLine(probe[0]).tokens;
				assert.deepStrictEqual(tokens.find(t => t.value === 'of').scopes, ['source.css', 'meta.selector.css', 'keyword.operator.logical.of.css'], probe[0]);
				assert.deepStrictEqual(tokens.find(t => t.value === probe[1]).scopes, ['source.css', 'meta.selector.css', probe[2]], probe[0]);
			});
			var attr = testGrammar.tokenizeLine('a:nth-child(2 of[hidden]) {}').tokens;
			assert.deepStrictEqual(attr.find(t => t.value === 'hidden').scopes, ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']);
		});

		it('closes every new functional selector', function () {
			// Each of these rules is new on this branch and none of them had
			// its closing parenthesis asserted, so the scope could be renamed
			// without a failure.
			[
				['a:state(loading) {}', 5],
				['a::part(button) {}', 5],
				['a::highlight(search) {}', 5],
				['a::view-transition-old(hero) {}', 5],
				['a::scroll-button(next) {}', 5],
				['a::slotted(.x) {}', 6]
			].forEach(function (pair) {
				var tokens = testGrammar.tokenizeLine(pair[0]).tokens;
				assert.deepStrictEqual(tokens[pair[1]], {
					scopes: [
						'source.css',
						'meta.selector.css',
						'punctuation.section.function.end.bracket.round.css'
					],
					value: ')'
				}, pair[0]);
			});
		});

		it('gives a single-argument selector only its sole argument', function () {
			// `:state()` takes one `<ident>`, `::highlight()` one
			// `<custom-ident>`, `::scroll-button()` one direction and a
			// view-transition pseudo-element one `<pt-name-selector>`. A second
			// argument is invalid, so it is not scoped as one.
			[
				['a:state(foo bar) {}', 'bar'],
				['a::highlight(foo bar) {}', 'bar'],
				['a::scroll-button(up down) {}', 'down'],
				['a::view-transition-old(foo bar) {}', 'bar']
			].forEach(function (c) {
				var tokens = testGrammar.tokenizeLine(c[0]).tokens;
				assert.ok(!tokens.some(x => x.value === c[1] && x.scopes.some(sc => sc.startsWith('variable.parameter') || sc === 'support.constant.property-value.css')), c[0]);
			});
		});

		it('takes more than one identifier in ::part() only', function () {
			// css-shadow-parts-1 defines `::part( <ident># )`, so both names
			// here are arguments.
			var tokens = testGrammar.tokenizeLine('a::part(foo bar) {}').tokens;
			['foo', 'bar'].forEach(function (name) {
				assert.deepStrictEqual(tokens.find(x => x.value === name).scopes, ['source.css', 'meta.selector.css', 'variable.parameter.pseudo-element.css'], name);
			});
		});

		it('requires a valid identifier start in a selector argument', function () {
			// css-syntax-3: an ident sequence starts with an ident-start code
			// point, two hyphens, or a hyphen and an ident-start code point.
			// A lone hyphen, a digit after one hyphen, and a leading digit are
			// none of those, and the matcher does not take the tail of one.
			['a:state(-) {}', 'a:state(-1foo) {}', 'a:state(1foo) {}'].forEach(function (line) {
				var tokens = testGrammar.tokenizeLine(line).tokens;
				assert.ok(!tokens.some(x => x.scopes.includes('variable.parameter.state-name.css')), line);
			});
			var ok = testGrammar.tokenizeLine('a:state(--x) {}').tokens;
			assert.deepStrictEqual(ok.find(x => x.value === '--x').scopes, ['source.css', 'meta.selector.css', 'variable.parameter.state-name.css']);
		});

		it('does not take a reserved word as a custom identifier', function () {
			// css-values-4: the CSS-wide keywords are not valid
			// `<custom-ident>`s, and `default` is reserved as well.
			['default', 'initial', 'inherit', 'unset', 'revert', 'revert-layer'].forEach(function (word) {
				['a::highlight(' + word + ') {}', 'a::view-transition-old(' + word + ') {}'].forEach(function (line) {
					var tokens = testGrammar.tokenizeLine(line).tokens;
					assert.ok(!tokens.some(x => x.scopes.includes('variable.parameter.pseudo-element.css')), line);
				});
			});
			// `:state()` takes an `<ident>`, which has no such exclusion.
			var tokens = testGrammar.tokenizeLine('a:state(default) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'default').scopes, ['source.css', 'meta.selector.css', 'variable.parameter.state-name.css']);
		});

		it('does not read a class selector as a view-transition name', function () {
			// `<pt-name-selector>` is `'*' | <custom-ident>`. The class
			// additions in css-view-transitions-2 are not implemented here, so
			// a class is left to tokenize as an ordinary class selector.
			var tokens = testGrammar.tokenizeLine('a::view-transition-old(.active) {}').tokens;
			assert.ok(!tokens.some(x => x.scopes.includes('variable.parameter.pseudo-element.css')));
		});

		it('reads a comment before a selector argument', function () {
			[
				['a:state(/*c*/ foo) {}', 'foo', 'variable.parameter.state-name.css'],
				['a::highlight(/*c*/ foo) {}', 'foo', 'variable.parameter.pseudo-element.css'],
				['a::scroll-button(/*c*/ up) {}', 'up', 'support.constant.property-value.css'],
				['a::view-transition-old(/*c*/ *) {}', '*', 'entity.name.tag.wildcard.css'],
				['a::scroll-button(/*c*/ *) {}', '*', 'entity.name.tag.wildcard.css'],
				['a:local-link(/*c*/ 2) {}', '2', 'constant.numeric.css']
			].forEach(function (c) {
				var tokens = testGrammar.tokenizeLine(c[0]).tokens;
				assert.deepStrictEqual(tokens.find(x => x.value === c[1]).scopes, ['source.css', 'meta.selector.css', c[2]], c[0]);
				assert.deepStrictEqual(tokens.find(x => x.value === 'c').scopes, ['source.css', 'meta.selector.css', 'comment.block.css'], c[0]);
			});
		});

		it('reads a comment after a selector argument', function () {
			// The argument is still the sole argument, so it keeps its scope,
			// and the comment is a comment rather than part of it.
			[
				['a:state(foo /*c*/) {}', 'foo', 'variable.parameter.state-name.css'],
				['a::highlight(foo /*c*/) {}', 'foo', 'variable.parameter.pseudo-element.css'],
				['a::part(foo /*c*/) {}', 'foo', 'variable.parameter.pseudo-element.css'],
				['a::scroll-button(up /*c*/) {}', 'up', 'support.constant.property-value.css'],
				['a::view-transition-old(foo /*c*/) {}', 'foo', 'variable.parameter.pseudo-element.css'],
				['a:local-link(2 /*c*/) {}', '2', 'constant.numeric.css']
			].forEach(function (c) {
				var tokens = testGrammar.tokenizeLine(c[0]).tokens;
				assert.deepStrictEqual(tokens.find(x => x.value === c[1]).scopes, ['source.css', 'meta.selector.css', c[2]], c[0]);
				assert.deepStrictEqual(tokens.find(x => x.value === 'c').scopes, ['source.css', 'meta.selector.css', 'comment.block.css'], c[0]);
			});
		});

		it('reads a selector argument written on its own line', function () {
			// A `\G` anchor does not survive a line break, so the matchers
			// take a line start as well: a wrapped selector is still valid.
			[
				['a:state(\n\tfoo\n) {}', 'foo', 'variable.parameter.state-name.css'],
				['a::highlight(\n\tfoo\n) {}', 'foo', 'variable.parameter.pseudo-element.css'],
				['a::part(\n\tfoo\n) {}', 'foo', 'variable.parameter.pseudo-element.css'],
				['a::scroll-button(\n\tup\n) {}', 'up', 'support.constant.property-value.css'],
				['a::scroll-button(\n\t*\n) {}', '*', 'entity.name.tag.wildcard.css'],
				['a::view-transition-old(\n\tfoo\n) {}', 'foo', 'variable.parameter.pseudo-element.css'],
				['a::view-transition-old(\n\t*\n) {}', '*', 'entity.name.tag.wildcard.css'],
				['a:local-link(\n\t2\n) {}', '2', 'constant.numeric.css']
			].forEach(function (c) {
				var lines = testGrammar.tokenizeLines(c[0]);
				var token = lines[1].find(x => x.value === c[1]);
				assert.deepStrictEqual(token && token.scopes, ['source.css', 'meta.selector.css', c[2]], c[0]);
			});
		});

		it('does not read a keyword written as an escape', function () {
			// A keyword list is written out, so `up` spelled `\75 p` and `of`
			// spelled `\6f f` are not recognised. Nothing is scoped wrongly:
			// the argument is simply left alone, as it is on `main`.
			[
				['a::scroll-button(\\75 p) {}', 'support.constant.property-value.css'],
				['a:nth-child(2n \\6f f a) {}', 'keyword.operator.logical.of.css']
			].forEach(function (c) {
				var tokens = testGrammar.tokenizeLine(c[0]).tokens;
				assert.ok(!tokens.some(x => x.scopes.includes(c[1])), c[0]);
			});
		});

		it('takes a non-negative integer in the functional :local-link()', function () {
			// selectors-5: "As a functional pseudo-class, :local-link() can
			// also accept a non-negative integer as its sole argument".
			var tokens = testGrammar.tokenizeLine('a:local-link(2) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === ':').scopes, ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === 'local-link').scopes, ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === '(').scopes, ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === ')').scopes, ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === '2').scopes, ['source.css', 'meta.selector.css', 'constant.numeric.css']);
			['a:local-link(-1) {}', 'a:local-link(2 3) {}'].forEach(function (line) {
				var bad = testGrammar.tokenizeLine(line).tokens;
				assert.ok(!bad.some(x => x.scopes.includes('constant.numeric.css')), line);
			});
		});

		it('does not treat a longer identifier as a selector it adds', function () {
			// Each name list has to stop at a word boundary. Without one,
			// `:local-linkish` and `::view-transition-oldish` pick up the
			// scopes that belong to the shorter names they start with.
			['a:local-linkish {}', 'a::view-transition-oldish {}'].forEach(function (line) {
				var tokens = testGrammar.tokenizeLine(line).tokens;
				assert.ok(!tokens.some(x => x.scopes.some(sc => sc.startsWith('entity.other.attribute-name.pseudo'))), line);
			});
		});

		it('keeps pseudo-classes deferred to Selectors 5', function () {
			['blank', 'local-link'].forEach(function (pseudoClass) {
				var tokens = testGrammar.tokenizeLine('a:' + pseudoClass + ' {}').tokens;
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: pseudoClass });
			});
		});

		it('releases the closing parenthesis of an of clause', function () {
			// `:nth-child(An+B of S)` ends the selector subregion before the
			// pseudo-class rule closes, and that release was unpinned.
			var tokens = testGrammar.tokenizeLine('a:nth-child(2 of .x) {}').tokens;
			assert.deepStrictEqual(tokens[6], {
				scopes: ['source.css', 'meta.selector.css', 'keyword.operator.logical.of.css'],
				value: 'of'
			});
			assert.deepStrictEqual(tokens[10], {
				scopes: [
					'source.css',
					'meta.selector.css',
					'punctuation.section.function.end.bracket.round.css'
				],
				value: ')'
			});
		});

		it('tokenizes ::part() and ::slotted()', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a::part(btn) {}').tokens;
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'part' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'variable.parameter.pseudo-element.css'], value: 'btn' });

			tokens = testGrammar.tokenizeLine('a::slotted(.x) {}').tokens;
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: 'slotted' });
			assert.deepStrictEqual(tokens[5], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'], value: 'x' });
		});

		it('tokenizes :state() with a custom identifier', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a:state(loading) {}').tokens;
			assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: 'state' });
			assert.deepStrictEqual(tokens[4], { scopes: ['source.css', 'meta.selector.css', 'variable.parameter.state-name.css'], value: 'loading' });
		});

		it('tokenizes additional pseudo-classes', function () {
			['popover-open', 'user-valid', 'user-invalid', 'placeholder-shown', 'autofill', 'modal', 'defined', 'open'].forEach(function (pc) {
				var tokens = testGrammar.tokenizeLine('a:' + pc + ' {}').tokens;
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], value: pc });
			});
		});

		it('tokenizes additional pseudo-elements', function () {
			['details-content', 'file-selector-button', 'target-text', 'backdrop', 'marker'].forEach(function (pe) {
				var tokens = testGrammar.tokenizeLine('a::' + pe + ' {}').tokens;
				assert.deepStrictEqual(tokens[2], { scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css'], value: pe });
			});
		});

		it('tokenizes functional :host() rather than the bare pseudo-class', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a:host(.dark) {}').tokens;
			var host = tokens.find(t => t.value === 'host');
			assert.deepStrictEqual(host.scopes, ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']);
			var open = tokens.find(t => t.value === '(');
			assert.deepStrictEqual(open.scopes, ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']);
			var cls = tokens.find(t => t.value === 'dark');
			assert.deepStrictEqual(cls.scopes, ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']);
		});

		it('tokenizes scroll marker position pseudo-classes', function () {
			['target-before', 'target-current', 'target-after'].forEach(function (pseudoClass) {
				var tokens = testGrammar.tokenizeLine('a:' + pseudoClass + ' {}').tokens;
				assert.deepStrictEqual(tokens.find(x => x.value === pseudoClass).scopes, ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css'], pseudoClass);
			});
		});

		it('tokenizes the `of` clause of :nth-child()', function () {
			var tokens;
			tokens = testGrammar.tokenizeLine('a:nth-child(2 of .x) {}').tokens;
			var of = tokens.find(t => t.value === 'of');
			assert.deepStrictEqual(of.scopes, ['source.css', 'meta.selector.css', 'keyword.operator.logical.of.css']);
			var cls = tokens.find(t => t.value === 'x');
			assert.deepStrictEqual(cls.scopes, ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']);
		});

		it('uses the argument grammar for each functional pseudo-element', function () {
			var tokens = testGrammar.tokenizeLine('a::part(left)::view-transition-old(*)::scroll-button(next)::scroll-button(*) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'left'), { scopes: ['source.css', 'meta.selector.css', 'variable.parameter.pseudo-element.css'], value: 'left' });
			assert.deepStrictEqual(tokens.filter(x => x.value === '*').map(x => x.scopes), [
				['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css'],
				['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css']
			]);
			assert.deepStrictEqual(tokens.find(x => x.value === 'next'), { scopes: ['source.css', 'meta.selector.css', 'support.constant.property-value.css'], value: 'next' });

			tokens = testGrammar.tokenizeLine('a::part(*) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '*').scopes, ['source.css', 'meta.selector.css']);
		});
		it('accepts a universal or namespaced selector after an of clause', function () {
			var tokens = testGrammar.tokenizeLine('li:nth-child(2 of*) { }').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === 'of').scopes, ['source.css', 'meta.selector.css', 'keyword.operator.logical.of.css']);
			assert.deepStrictEqual(tokens.find(x => x.value === '*').scopes, ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css']);
			var ns = testGrammar.tokenizeLine('li:nth-last-child(odd of*|div) { }').tokens;
			assert.deepStrictEqual(ns.find(x => x.value === 'of').scopes, ['source.css', 'meta.selector.css', 'keyword.operator.logical.of.css']);
			assert.deepStrictEqual(ns.find(x => x.value === 'div').scopes, ['source.css', 'meta.selector.css', 'entity.name.tag.css']);
		});

		it('accepts a leading escape in a custom identifier argument', function () {
			// The class grammar already handles `.\_foo`, and these take the
			// same custom identifier.
			[
				['::part(\\_foo) { }', 'variable.parameter.pseudo-element.css'],
				[':state(\\_foo) { }', 'variable.parameter.state-name.css'],
				['::highlight(\\_foo) { }', 'variable.parameter.pseudo-element.css'],
				['::view-transition-old(\\_foo) { }', 'variable.parameter.pseudo-element.css']
			].forEach(function (pair) {
				var tokens = testGrammar.tokenizeLine(pair[0]).tokens;
				assert.deepStrictEqual(tokens.find(x => x.value === '\\_').scopes, ['source.css', 'meta.selector.css', pair[1], 'constant.character.escape.css'], pair[0]);
				assert.deepStrictEqual(tokens.find(x => x.value === 'foo').scopes, ['source.css', 'meta.selector.css', pair[1]], pair[0]);
			});
		});

		it('marks a comma or a combinator in ::slotted() invalid', function () {
			// ::slotted() takes one compound selector, not a selector list.
			var list = testGrammar.tokenizeLine('::slotted(.a, .b) { }').tokens;
			assert.deepStrictEqual(list.find(x => x.value === ',').scopes, ['source.css', 'meta.selector.css', 'invalid.illegal.comma.css']);
			var child = testGrammar.tokenizeLine('::slotted(.a > .b) { }').tokens;
			assert.deepStrictEqual(child.find(x => x.value === '>').scopes, ['source.css', 'meta.selector.css', 'invalid.illegal.combinator.css']);
			var ok = testGrammar.tokenizeLine('::slotted(span.a) { }').tokens;
			assert.deepStrictEqual(ok.find(x => x.value === 'span').scopes, ['source.css', 'meta.selector.css', 'entity.name.tag.css']);
		});

		// Every name this change adds to a list is asserted here, so that
		// removing one from the grammar fails a test.
		function eachSel(cases, want) {
			cases.forEach(function (pair) {
				var tokens = testGrammar.tokenizeLine(pair[1]).tokens;
				var token = tokens.find(x => x.value === pair[0]);
				assert.ok(token, pair[0] + ' produced no token in: ' + pair[1]);
				assert.deepStrictEqual(token.scopes, want, pair[1]);
			});
		}

		it('names every pseudo-class it adds', function () {
			eachSel([
				['picture-in-picture', 'a:picture-in-picture {}'],
				['unchecked', 'a:unchecked {}'],
				['volume-locked', 'a:volume-locked {}'],
				['autofill', 'a:autofill {}'],
				['blank', 'a:blank {}'],
				['buffering', 'a:buffering {}'],
				['current', 'a:current {}'],
				['defined', 'a:defined {}'],
				['future', 'a:future {}'],
				['local-link', 'a:local-link {}'],
				['modal', 'a:modal {}'],
				['muted', 'a:muted {}'],
				['past', 'a:past {}'],
				['paused', 'a:paused {}'],
				['placeholder-shown', 'a:placeholder-shown {}'],
				['playing', 'a:playing {}'],
				['popover-open', 'a:popover-open {}'],
				['seeking', 'a:seeking {}'],
				['stalled', 'a:stalled {}'],
				['target-after', 'a:target-after {}'],
				['target-before', 'a:target-before {}'],
				['target-current', 'a:target-current {}'],
				['user-invalid', 'a:user-invalid {}'],
				['user-valid', 'a:user-valid {}'],
				['visited', 'a:visited {}']
			], ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']);
		});

		it('names every pseudo-element it adds', function () {
			eachSel([
				['scroll-marker-group', 'a::scroll-marker-group {}'],
				['view-transition', 'a::view-transition {}'],
				['checkmark', 'a::checkmark {}'],
				['details-content', 'a::details-content {}'],
				['file-selector-button', 'a::file-selector-button {}'],
				['picker-icon', 'a::picker-icon {}'],
				['scroll-marker', 'a::scroll-marker {}'],
				['spelling-error', 'a::spelling-error {}'],
				['target-text', 'a::target-text {}'],
				['column', 'a::column {}']
			], ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']);
		});

		it('names the functional pseudo-class it adds', function () {
			eachSel([
				['host-context', 'a:host-context(.x) {}']
			], ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']);
		});

		it('names every functional pseudo-element it adds', function () {
			eachSel([
				['part', 'a::part(n) {}'],
				['view-transition-group', 'a::view-transition-group(n) {}'],
				['view-transition-group-children', 'a::view-transition-group-children(n) {}'],
				['view-transition-image-pair', 'a::view-transition-image-pair(n) {}'],
				['view-transition-new', 'a::view-transition-new(n) {}']
			], ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']);
		});

		it('recognises every scroll-button direction', function () {
			eachSel([
				['block-start', 'a::scroll-button(block-start) {}'],
				['block-end', 'a::scroll-button(block-end) {}'],
				['inline-start', 'a::scroll-button(inline-start) {}'],
				['inline-end', 'a::scroll-button(inline-end) {}'],
				['up', 'a::scroll-button(up) {}'],
				['down', 'a::scroll-button(down) {}'],
				['left', 'a::scroll-button(left) {}'],
				['right', 'a::scroll-button(right) {}'],
				['prev', 'a::scroll-button(prev) {}'],
				['next', 'a::scroll-button(next) {}']
			], ['source.css', 'meta.selector.css', 'support.constant.property-value.css']);
		});

		it('marks a combinator inside a compound-selector pseudo-class', function () {
			// :host() and :host-context() each take a single compound selector,
			// and the descendant combinator is written as whitespace.
			[
				[':host(.a > .b) {}', '>'],
				[':host(.a + .b) {}', '+'],
				[':host(.a ~ .b) {}', '~'],
				[':host(.a || .b) {}', '||'],
				[':host(.a .b) {}', ' '],
				[':host(.a\t.b) {}', '\t'],
				[':host(.a\f.b) {}', '\f'],
				[':HOST(.a .b) {}', ' '],
				[':Host-Context(.a .b) {}', ' '],
				[':host-context(.a ~ .b) {}', '~'],
				[':current(.a .b) {}', ' '],
				[':current(.a, .b .c) {}', ' '],
				[':host(.a/**/ .b) {}', ' '],
				[':host(.\\61  .b) {}', ' '],
				[':host(.\\\\61 .b) {}', ' '],
				[':host(.\\\\61  .b) {}', '  '],
				['::slotted(.a .b) {}', ' '],
				['::slotted(.a > .b) {}', '>'],
				['::slotted(.a || .b) {}', '||']
			].forEach(function (pair) {
				var tokens = testGrammar.tokenizeLine(pair[0]).tokens;
				var token = tokens.find(x => x.scopes.includes('invalid.illegal.combinator.css'));
				assert.ok(token, 'no combinator marked in: ' + pair[0]);
				assert.strictEqual(token.value, pair[1], pair[0]);
			});
		});

		it('marks a selector list where only one compound selector is allowed', function () {
			[':host(.a, .b) {}', ':host-context(.a, .b) {}', '::slotted(.a, .b) {}'].forEach(function (line) {
				var tokens = testGrammar.tokenizeLine(line).tokens;
				var token = tokens.find(x => x.scopes.includes('invalid.illegal.comma.css'));
				assert.ok(token, 'no comma marked in: ' + line);
				assert.strictEqual(token.value, ',', line);
			});
		});

		it('leaves a valid compound selector alone', function () {
			// A compound selector has no combinator in it. Whitespace that
			// terminates a hexadecimal escape belongs to the name before it, so
			// `.\\61 .b` is the single compound selector `.a.b`.
			[
				':host(.a.b) {}',
				'::slotted( .a ) {}',
				':host(.a/**/.b) {}',
				':host(.\\61 .b) {}',
				':host(\\64 iv.x) {}',
				'::slotted([data-x="a b"]) {}',
				':host([title="a > b"]) {}',
				':current(.a, .b) {}',
				':host(.\\\\\\61 .b) {}',
				':host(.\\\\\\\\\\61 .b) {}',
				'::slotted(.\\61 .b) {}'
			].forEach(function (line) {
				var tokens = testGrammar.tokenizeLine(line).tokens;
				assert.ok(!tokens.some(t => t.scopes.some(sc => sc.startsWith('invalid'))), line);
			});
		});

		it('still allows a complex selector where one is valid', function () {
			// These take complex selectors, or a list of them, so the compound
			// selector restriction above must not reach them.
			[
				':is(.a .b) {}',
				':not(.a .b) {}',
				':has(.a .b) {}',
				':where(.a .b) {}',
				':matches(.a .b) {}',
				':current(.a, .b) {}',
				':is(.a, .b) {}'
			].forEach(function (line) {
				var tokens = testGrammar.tokenizeLine(line).tokens;
				assert.ok(!tokens.some(t => t.scopes.some(sc => sc.startsWith('invalid'))), line);
			});
		});

		it('keeps a compound-selector pseudo-class open across a nested function', function () {
			// The closing bracket of a nested function does not end :host().
			var tokens = testGrammar.tokenizeLine(':host(:not(.a)) .b {}').tokens;
			var token = tokens.find(x => x.value === 'b');
			assert.deepStrictEqual(token.scopes, [
				'source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'
			]);
		});

		it('punctuates every functional selector it adds', function () {
			// The name, its leading colons and both brackets are all scoped.
			[
				[':host', 'pseudo-class', ':host(.a) {}'],
				[':host-context', 'pseudo-class', ':host-context(.a) {}'],
				[':state', 'pseudo-class', ':state(a) {}'],
				[':current', 'pseudo-class', ':current(.a) {}'],
				['::part', 'pseudo-element', '::part(a) {}'],
				['::highlight', 'pseudo-element', '::highlight(a) {}'],
				['::slotted', 'pseudo-element', '::slotted(.a) {}'],
				['::scroll-button', 'pseudo-element', '::scroll-button(up) {}'],
				['::view-transition-group', 'pseudo-element', '::view-transition-group(a) {}'],
				['::view-transition-group-children', 'pseudo-element', '::view-transition-group-children(a) {}'],
				['::view-transition-image-pair', 'pseudo-element', '::view-transition-image-pair(a) {}'],
				['::view-transition-new', 'pseudo-element', '::view-transition-new(a) {}'],
				['::view-transition-old', 'pseudo-element', '::view-transition-old(a) {}']
			].forEach(function (row) {
				var colons = row[0].startsWith('::') ? '::' : ':';
				var name = row[0].slice(colons.length);
				var tokens = testGrammar.tokenizeLine(row[2]).tokens;
				var base = ['source.css', 'meta.selector.css'];
				assert.deepStrictEqual(tokens.find(x => x.value === name).scopes,
					base.concat(['entity.other.attribute-name.' + row[1] + '.css']), row[2]);
				assert.deepStrictEqual(tokens.find(x => x.value === colons).scopes,
					base.concat(['entity.other.attribute-name.' + row[1] + '.css', 'punctuation.definition.entity.css']), row[2]);
				assert.deepStrictEqual(tokens.find(x => x.value === '(').scopes,
					base.concat(['punctuation.section.function.begin.bracket.round.css']), row[2]);
				assert.deepStrictEqual(tokens.find(x => x.value === ')').scopes,
					base.concat(['punctuation.section.function.end.bracket.round.css']), row[2]);
			});
		});

		it('reads a comment inside every functional selector it adds', function () {
			[
				':state(/*c*/ a) {}',
				'::part(/*c*/ a) {}',
				'::highlight(/*c*/ a) {}',
				'::view-transition-group(/*c*/ a) {}',
				'::view-transition-old(/*c*/ a) {}',
				'::scroll-button(/*c*/ up) {}'
			].forEach(function (line) {
				var tokens = testGrammar.tokenizeLine(line).tokens;
				assert.ok(tokens.some(t => t.value === 'c' && t.scopes.includes('comment.block.css')),
					'no comment in: ' + line);
			});
		});

		it('keeps ::slotted() open across a nested function and a string', function () {
			[
				'::slotted(:not(.a)) .b {}',
				'::slotted([title=")"]) .b {}'
			].forEach(function (line) {
				var tokens = testGrammar.tokenizeLine(line).tokens;
				assert.deepStrictEqual(tokens.find(x => x.value === 'b').scopes, [
					'source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css'
				], line);
			});
		});

		it('names the parity keywords in a child-indexed function', function () {
			['nth-child', 'nth-last-child', 'nth-of-type', 'nth-last-of-type'].forEach(function (fn) {
				['even', 'odd'].forEach(function (kw) {
					var line = 'a:' + fn + '(' + kw + ') {}';
					var tokens = testGrammar.tokenizeLine(line).tokens;
					assert.deepStrictEqual(tokens.find(x => x.value === kw).scopes,
						['source.css', 'meta.selector.css', 'support.constant.parity.css'], line);
				});
			});
		});

		it('takes an of-clause only in the child-indexed functions', function () {
			// :nth-child() and :nth-last-child() take `of <selector>`, the typed
			// variants do not.
			[':nth-child(2 of .x)', ':nth-last-child(2 of .x)'].forEach(function (sel) {
				var tokens = testGrammar.tokenizeLine('a' + sel + ' {}').tokens;
				assert.ok(tokens.some(t => t.value === 'of' && t.scopes.includes('keyword.operator.logical.of.css')), sel);
				assert.ok(tokens.some(t => t.value === 'x' && t.scopes.includes('entity.other.attribute-name.class.css')), sel);
			});
			[':nth-of-type(2 of .x)', ':nth-last-of-type(2 of .x)'].forEach(function (sel) {
				var tokens = testGrammar.tokenizeLine('a' + sel + ' {}').tokens;
				assert.ok(!tokens.some(t => t.scopes.includes('keyword.operator.logical.of.css')), sel);
				assert.ok(!tokens.some(t => t.value === 'x' && t.scopes.includes('entity.other.attribute-name.class.css')), sel);
			});
		});

	});

	describe('media features', function () {

		function eachSel(cases, want) {
			cases.forEach(function (pair) {
				var tokens = testGrammar.tokenizeLine(pair[1]).tokens;
				var token = tokens.find(x => x.value === pair[0]);
				assert.ok(token, pair[0] + ' produced no token in: ' + pair[1]);
				assert.deepStrictEqual(token.scopes, want, pair[1]);
			});
		}

		it('recognises interaction media features', function () {
			['pointer', 'any-pointer', 'hover', 'any-hover', 'update', 'scripting'].forEach(function (mf) {
				var tokens = testGrammar.tokenizeLine('@media (' + mf + ': none) {}').tokens;
				var t = tokens.find(x => x.value === mf);
				assert.deepStrictEqual(t.scopes, ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], mf);
			});
		});

		it('recognises user-preference media features', function () {
			['prefers-color-scheme', 'prefers-contrast', 'prefers-reduced-motion', 'forced-colors', 'dynamic-range'].forEach(function (mf) {
				var tokens = testGrammar.tokenizeLine('@media (' + mf + ': none) {}').tokens;
				var t = tokens.find(x => x.value === mf);
				assert.deepStrictEqual(t.scopes, ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], mf);
			});
		});

		it('treats viewport segments as range features', function () {
			[
				'horizontal-viewport-segments',
				'min-horizontal-viewport-segments',
				'max-horizontal-viewport-segments',
				'vertical-viewport-segments',
				'min-vertical-viewport-segments',
				'max-vertical-viewport-segments'
			].forEach(function (mf) {
				var tokens = testGrammar.tokenizeLine('@media (' + mf + ': 2) {}').tokens;
				var t = tokens.find(x => x.value === mf);
				assert.deepStrictEqual(t.scopes, ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], mf);
			});

			var tokens = testGrammar.tokenizeLine('@media (horizontal-viewport-segments > 1) {}').tokens;
			assert.deepStrictEqual(tokens.find(x => x.value === '>').scopes, ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.comparison.css']);
		});

		it('recognises the values of each discrete media feature it names', function () {
			// A feature name without its values is only half of the feature,
			// so every name this change adds is paired with its values.
			[
				['overflow-block', 'paged'],
				['overflow-block', 'scroll'],
				['overflow-inline', 'scroll'],
				['inverted-colors', 'inverted'],
				['nav-controls', 'back'],
				['video-color-gamut', 'p3'],
				['ua-color-scheme', 'dark'],
				['environment-blending', 'opaque'],
				['environment-blending', 'additive'],
				['environment-blending', 'subtractive'],
				['scripting', 'initial-only'],
				['update', 'slow'],
				['prefers-color-scheme', 'dark'],
				['prefers-reduced-motion', 'reduce'],
				['prefers-contrast', 'more'],
				['forced-colors', 'active'],
				['color-gamut', 'p3'],
				['dynamic-range', 'high']
			].forEach(function (pair) {
				var tokens = testGrammar.tokenizeLine('@media (' + pair[0] + ': ' + pair[1] + ') {}').tokens;
				assert.deepStrictEqual(tokens.find(x => x.value === pair[0]).scopes, ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css'], pair.join(': '));
				assert.deepStrictEqual(tokens.find(x => x.value === pair[1]).scopes, ['source.css', 'meta.at-rule.media.header.css', 'support.constant.property-value.css'], pair.join(': '));
			});
		});

		it('names every media feature it adds', function () {
			eachSel([
				['horizontal-viewport-segments', '@media (horizontal-viewport-segments: none) {}'],
				['any-pointer', '@media (any-pointer: none) {}'],
				['update', '@media (update: none) {}'],
				['prefers-contrast', '@media (prefers-contrast: none) {}'],
				['video-color-gamut', '@media (video-color-gamut: srgb) {}'],
				['ua-color-scheme', '@media (ua-color-scheme: light) {}'],
				['prefers-reduced-motion', '@media (prefers-reduced-motion: none) {}'],
				['prefers-reduced-transparency', '@media (prefers-reduced-transparency: none) {}'],
				['prefers-reduced-data', '@media (prefers-reduced-data: none) {}'],
				['forced-colors', '@media (forced-colors: none) {}'],
				['inverted-colors', '@media (inverted-colors: none) {}'],
				['dynamic-range', '@media (dynamic-range: none) {}'],
				['video-dynamic-range', '@media (video-dynamic-range: none) {}'],
				['scripting', '@media (scripting: none) {}'],
				['color-gamut', '@media (color-gamut: none) {}'],
				['environment-blending', '@media (environment-blending: none) {}']
			], ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css']);
		});

		it('recognises every media feature value it adds', function () {
			eachSel([
				['no-preference', '@media (prefers-reduced-motion: no-preference) {}'],
				['coarse', '@media (any-pointer: coarse) {}'],
				['fine', '@media (any-pointer: fine) {}'],
				['slow', '@media (update: slow) {}'],
				['fast', '@media (update: fast) {}'],
				['more', '@media (prefers-contrast: more) {}'],
				['less', '@media (prefers-contrast: less) {}'],
				['custom', '@media (prefers-contrast: custom) {}'],
				['initial-only', '@media (scripting: initial-only) {}'],
				['rec2020', '@media (color-gamut: rec2020) {}'],
				['standard', '@media (dynamic-range: standard) {}'],
				['high', '@media (dynamic-range: high) {}'],
				['paged', '@media (overflow-block: paged) {}'],
				['enabled', '@media (scripting: enabled) {}'],
				['light', '@media (prefers-color-scheme: light) {}'],
				['active', '@media (forced-colors: active) {}'],
				['none', '@media (forced-colors: none) {}'],
				['srgb', '@media (color-gamut: srgb) {}']
			], ['source.css', 'meta.at-rule.media.header.css', 'support.constant.property-value.css']);
		});

	});

	describe('property names', function () {

		function eachSel(cases, want) {
			cases.forEach(function (pair) {
				var tokens = testGrammar.tokenizeLine(pair[1]).tokens;
				var token = tokens.find(x => x.value === pair[0]);
				assert.ok(token, pair[0] + ' produced no token in: ' + pair[1]);
				assert.deepStrictEqual(token.scopes, want, pair[1]);
			});
		}

		it('recognises additional property names as supported', function () {
			[
				'anchor-name', 'position-anchor', 'position-area', 'field-sizing',
				'view-transition-name', 'contain-intrinsic-size', 'scroll-timeline',
				'margin-trim', 'content-visibility', 'text-wrap-style', 'interpolate-size'
			].forEach(function (prop) {
				var tokens = testGrammar.tokenizeLine('a { ' + prop + ': inherit; }').tokens;
				var t = tokens.find(x => x.value === prop);
				assert.deepStrictEqual(t.scopes, ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css'], prop);
			});
		});

		it('names every property it adds', function () {
			eachSel([
				['view-transition-group', 'a { view-transition-group: inherit; }'],
				['animation-timeline', 'a { animation-timeline: inherit; }'],
				['animation-range', 'a { animation-range: inherit; }'],
				['animation-range-start', 'a { animation-range-start: inherit; }'],
				['animation-range-end', 'a { animation-range-end: inherit; }'],
				['view-transition-scope', 'a { view-transition-scope: inherit; }'],
				['scroll-target-group', 'a { scroll-target-group: inherit; }'],
				['print-color-adjust', 'a { print-color-adjust: inherit; }'],
				['corner-top-left-shape', 'a { corner-top-left-shape: inherit; }'],
				['corner-top-right-shape', 'a { corner-top-right-shape: inherit; }'],
				['corner-bottom-right-shape', 'a { corner-bottom-right-shape: inherit; }'],
				['corner-bottom-left-shape', 'a { corner-bottom-left-shape: inherit; }'],
				['corner-start-start-shape', 'a { corner-start-start-shape: inherit; }'],
				['corner-start-end-shape', 'a { corner-start-end-shape: inherit; }'],
				['corner-end-start-shape', 'a { corner-end-start-shape: inherit; }'],
				['corner-end-end-shape', 'a { corner-end-end-shape: inherit; }'],
				['corner-shape', 'a { corner-shape: round; }'],
				['anchor-name', 'a { anchor-name: inherit; }'],
				['anchor-scope', 'a { anchor-scope: inherit; }'],
				['position-anchor', 'a { position-anchor: inherit; }'],
				['position-area', 'a { position-area: inherit; }'],
				['position-try', 'a { position-try: inherit; }'],
				['position-try-fallbacks', 'a { position-try-fallbacks: inherit; }'],
				['position-try-order', 'a { position-try-order: inherit; }'],
				['position-visibility', 'a { position-visibility: inherit; }'],
				['animation-composition', 'a { animation-composition: inherit; }'],
				['scroll-timeline', 'a { scroll-timeline: inherit; }'],
				['scroll-timeline-axis', 'a { scroll-timeline-axis: inherit; }'],
				['scroll-timeline-name', 'a { scroll-timeline-name: inherit; }'],
				['timeline-scope', 'a { timeline-scope: inherit; }'],
				['view-timeline', 'a { view-timeline: inherit; }'],
				['view-timeline-axis', 'a { view-timeline-axis: inherit; }'],
				['view-timeline-inset', 'a { view-timeline-inset: inherit; }'],
				['view-timeline-name', 'a { view-timeline-name: inherit; }'],
				['view-transition-class', 'a { view-transition-class: inherit; }'],
				['view-transition-name', 'a { view-transition-name: inherit; }'],
				['contain-intrinsic-block-size', 'a { contain-intrinsic-block-size: inherit; }'],
				['contain-intrinsic-height', 'a { contain-intrinsic-height: inherit; }'],
				['contain-intrinsic-inline-size', 'a { contain-intrinsic-inline-size: inherit; }'],
				['contain-intrinsic-size', 'a { contain-intrinsic-size: inherit; }'],
				['contain-intrinsic-width', 'a { contain-intrinsic-width: inherit; }'],
				['content-visibility', 'a { content-visibility: inherit; }'],
				['field-sizing', 'a { field-sizing: inherit; }'],
				['forced-color-adjust', 'a { forced-color-adjust: inherit; }'],
				['hyphenate-limit-chars', 'a { hyphenate-limit-chars: inherit; }'],
				['interpolate-size', 'a { interpolate-size: inherit; }'],
				['margin-trim', 'a { margin-trim: inherit; }'],
				['math-depth', 'a { math-depth: inherit; }'],
				['math-shift', 'a { math-shift: inherit; }'],
				['math-style', 'a { math-style: inherit; }'],
				['scroll-initial-target', 'a { scroll-initial-target: inherit; }'],
				['scroll-marker-group', 'a { scroll-marker-group: inherit; }'],
				['text-autospace', 'a { text-autospace: inherit; }'],
				['text-box', 'a { text-box: inherit; }'],
				['text-box-edge', 'a { text-box-edge: inherit; }'],
				['text-box-trim', 'a { text-box-trim: inherit; }'],
				['text-spacing-trim', 'a { text-spacing-trim: inherit; }'],
				['text-wrap-mode', 'a { text-wrap-mode: inherit; }'],
				['text-wrap-style', 'a { text-wrap-style: inherit; }'],
				['overlay', 'a { overlay: inherit; }'],
				['word-space-transform', 'a { word-space-transform: inherit; }'],
				['reading-flow', 'a { reading-flow: inherit; }'],
				['reading-order', 'a { reading-order: inherit; }'],
				['dynamic-range-limit', 'a { dynamic-range-limit: inherit; }']
			], ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']);
		});

	});
});
