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
      assert.deepStrictEqual(tokens[0], {
        value: 'p',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
      });
    });

    it('tokenizes the universal selector', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('*').tokens;
      assert.deepStrictEqual(tokens[0], {
        value: '*',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css']
      });
    });

    it('tokenises combinators', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('a > b + * ~ :not(.nah)').tokens;
      assert.deepStrictEqual(tokens[2], {
        value: '>',
        scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: '+',
        scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css']
      });
      assert.deepStrictEqual(tokens[10], {
        value: '~',
        scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css']
      });
    });

    it('highlights deprecated combinators', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('.sooo /deep/ >>>_.>>>').tokens;
      assert.deepStrictEqual(tokens[3], {
        value: '/deep/',
        scopes: ['source.css', 'invalid.deprecated.combinator.css']
      });
      assert.deepStrictEqual(tokens[5], {
        value: '>>>',
        scopes: ['source.css', 'invalid.deprecated.combinator.css']
      });
    });

    it('tokenizes complex selectors', function () {
      var lines, tokens;
      tokens = testGrammar.tokenizeLine('[disabled], [disabled] + p').tokens;
      assert.deepStrictEqual(tokens[0], {
        value: '[',
        scopes: ["source.css", "meta.selector.css", "meta.attribute-selector.css", "punctuation.definition.entity.begin.bracket.square.css"]
      });
      assert.deepStrictEqual(tokens[1], {
        value: 'disabled',
        scopes: ["source.css", "meta.selector.css", "meta.attribute-selector.css", "entity.other.attribute-name.css"]
      });
      assert.deepStrictEqual(tokens[2], {
        value: ']',
        scopes: ["source.css", "meta.selector.css", "meta.attribute-selector.css", "punctuation.definition.entity.end.bracket.square.css"]
      });
      assert.deepStrictEqual(tokens[3], {
        value: ',',
        scopes: ["source.css", "meta.selector.css", "punctuation.separator.list.comma.css"]
      });
      assert.deepStrictEqual(tokens[5], {
        value: '[',
        scopes: ["source.css", "meta.selector.css", "meta.attribute-selector.css", "punctuation.definition.entity.begin.bracket.square.css"]
      });
      assert.deepStrictEqual(tokens[6], {
        value: 'disabled',
        scopes: ["source.css", "meta.selector.css", "meta.attribute-selector.css", "entity.other.attribute-name.css"]
      });
      assert.deepStrictEqual(tokens[7], {
        value: ']',
        scopes: ["source.css", "meta.selector.css", "meta.attribute-selector.css", "punctuation.definition.entity.end.bracket.square.css"]
      });
      assert.deepStrictEqual(tokens[9], {
        value: '+',
        scopes: ["source.css", "meta.selector.css", "keyword.operator.combinator.css"]
      });
      assert.deepStrictEqual(tokens[11], {
        value: 'p',
        scopes: ["source.css", "meta.selector.css", "entity.name.tag.css"]
      });
      lines = testGrammar.tokenizeLines("[disabled]:not(:first-child)::before:hover\n  ~ div.object\n  + #id.thing:hover > strong ~ p::before,\na::last-of-type,/*Comment*/::selection > html[lang^=en-AU],\n*>em.i.ly[data-name|=\"Life\"] { }");
      assert.deepStrictEqual(lines[0][0], {
        value: '[',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
      });
      assert.deepStrictEqual(lines[0][1], {
        value: 'disabled',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
      });
      assert.deepStrictEqual(lines[0][2], {
        value: ']',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
      });
      assert.deepStrictEqual(lines[0][3], {
        value: ':',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
      });
      assert.deepStrictEqual(lines[0][4], {
        value: 'not',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
      });
      assert.deepStrictEqual(lines[0][5], {
        value: '(',
        scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
      });
      assert.deepStrictEqual(lines[0][6], {
        value: ':',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
      });
      assert.deepStrictEqual(lines[0][7], {
        value: 'first-child',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
      });
      assert.deepStrictEqual(lines[0][8], {
        value: ')',
        scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
      });
      assert.deepStrictEqual(lines[0][9], {
        value: '::',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css']
      });
      assert.deepStrictEqual(lines[0][10], {
        value: 'before',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
      });
      assert.deepStrictEqual(lines[0][11], {
        value: ':',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
      });
      assert.deepStrictEqual(lines[0][12], {
        value: 'hover',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
      });
      assert.deepStrictEqual(lines[1][1], {
        value: '~',
        scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css']
      });
      assert.deepStrictEqual(lines[1][3], {
        value: 'div',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
      });
      assert.deepStrictEqual(lines[1][4], {
        value: '.',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
      });
      assert.deepStrictEqual(lines[1][5], {
        value: 'object',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
      });
      assert.deepStrictEqual(lines[2][1], {
        value: '+',
        scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css']
      });
      assert.deepStrictEqual(lines[2][3], {
        value: '#',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css']
      });
      assert.deepStrictEqual(lines[2][4], {
        value: 'id',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css']
      });
      assert.deepStrictEqual(lines[2][5], {
        value: '.',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
      });
      assert.deepStrictEqual(lines[2][6], {
        value: 'thing',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
      });
      assert.deepStrictEqual(lines[2][7], {
        value: ':',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
      });
      assert.deepStrictEqual(lines[2][8], {
        value: 'hover',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
      });
      assert.deepStrictEqual(lines[2][10], {
        value: '>',
        scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css']
      });
      assert.deepStrictEqual(lines[2][12], {
        value: 'strong',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
      });
      assert.deepStrictEqual(lines[2][14], {
        value: '~',
        scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css']
      });
      assert.deepStrictEqual(lines[2][16], {
        value: 'p',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
      });
      assert.deepStrictEqual(lines[2][17], {
        value: '::',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css']
      });
      assert.deepStrictEqual(lines[2][18], {
        value: 'before',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
      });
      assert.deepStrictEqual(lines[2][19], {
        value: ',',
        scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.list.comma.css']
      });
      assert.deepStrictEqual(lines[3][0], {
        value: 'a',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
      });
      assert.deepStrictEqual(lines[3][1], {
        value: ':',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
      });
      assert.deepStrictEqual(lines[3][2], {
        value: ':',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'invalid.illegal.colon.css']
      });
      assert.deepStrictEqual(lines[3][3], {
        value: 'last-of-type',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
      });
      assert.deepStrictEqual(lines[3][4], {
        value: ',',
        scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.list.comma.css']
      });
      assert.deepStrictEqual(lines[3][5], {
        value: '/*',
        scopes: ['source.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
      });
      assert.deepStrictEqual(lines[3][6], {
        value: 'Comment',
        scopes: ['source.css', 'comment.block.css']
      });
      assert.deepStrictEqual(lines[3][7], {
        value: '*/',
        scopes: ['source.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
      });
      assert.deepStrictEqual(lines[3][8], {
        value: '::',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css']
      });
      assert.deepStrictEqual(lines[3][9], {
        value: 'selection',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
      });
      assert.deepStrictEqual(lines[3][11], {
        value: '>',
        scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css']
      });
      assert.deepStrictEqual(lines[3][13], {
        value: 'html',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
      });
      assert.deepStrictEqual(lines[3][14], {
        value: '[',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
      });
      assert.deepStrictEqual(lines[3][15], {
        value: 'lang',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
      });
      assert.deepStrictEqual(lines[3][16], {
        value: '^=',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
      });
      assert.deepStrictEqual(lines[3][17], {
        value: 'en-AU',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css']
      });
      assert.deepStrictEqual(lines[3][18], {
        value: ']',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
      });
      assert.deepStrictEqual(lines[3][19], {
        value: ',',
        scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.list.comma.css']
      });
      assert.deepStrictEqual(lines[4][0], {
        value: '*',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css']
      });
      assert.deepStrictEqual(lines[4][1], {
        value: '>',
        scopes: ['source.css', 'meta.selector.css', 'keyword.operator.combinator.css']
      });
      assert.deepStrictEqual(lines[4][2], {
        value: 'em',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
      });
      assert.deepStrictEqual(lines[4][3], {
        value: '.',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
      });
      assert.deepStrictEqual(lines[4][4], {
        value: 'i',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
      });
      assert.deepStrictEqual(lines[4][5], {
        value: '.',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
      });
      assert.deepStrictEqual(lines[4][6], {
        value: 'ly',
        scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
      });
      assert.deepStrictEqual(lines[4][7], {
        value: '[',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
      });
      assert.deepStrictEqual(lines[4][8], {
        value: 'data-name',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
      });
      assert.deepStrictEqual(lines[4][9], {
        value: '|=',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
      });
      assert.deepStrictEqual(lines[4][10], {
        value: '"',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
      });
      assert.deepStrictEqual(lines[4][11], {
        value: 'Life',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css']
      });
      assert.deepStrictEqual(lines[4][12], {
        value: '"',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
      });
      assert.deepStrictEqual(lines[4][13], {
        value: ']',
        scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
      });
      assert.deepStrictEqual(lines[4][15], {
        value: '{',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
      });
      assert.deepStrictEqual(lines[4][17], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
    });

    describe('custom elements (as type selectors)', function () {
      it('only tokenizes identifiers beginning with [a-z]', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('pearl-1941 1941-pearl -pearl-1941').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'pearl-1941',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: ' 1941-pearl -pearl-1941',
          scopes: ['source.css', 'meta.selector.css']
        });
      });

      it('tokenizes custom elements containing non-ASCII letters', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('pokémon-ピカチュウ').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'pokémon-ピカチュウ',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css']
        });
      });

      it('does not tokenize identifiers containing [A-Z]', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('Basecamp-schedule basecamp-Schedule').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'Basecamp-schedule basecamp-Schedule',
          scopes: ['source.css', 'meta.selector.css']
        });
      });

      it('does not tokenize identifiers containing no hyphens', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('halo_night').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'halo_night',
          scopes: ['source.css', 'meta.selector.css']
        });
      });

      it('does not tokenise identifiers following an @ symbol', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('@some-weird-new-feature').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '@',
          scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css', 'punctuation.definition.keyword.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'some-weird-new-feature',
          scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css']
        });
      });
      
      it('does not tokenise identifiers in unfamiliar functions', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('some-edgy-new-function()').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'some-edgy-new-function(',
          scopes: ['source.css', 'meta.selector.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: ')',
          scopes: ['source.css']
        });
      });
    });

    describe('attribute selectors', function () {
      it('tokenizes attribute selectors without values', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('[title]').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'title',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });

      it('tokenizes attribute selectors with identifier values', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('[hreflang|=fr]').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'hreflang',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '|=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: 'fr',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });

      it('tokenizes attribute selectors with string values', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('[href^="http://www.w3.org/"]').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'href',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '^=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: 'http://www.w3.org/',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });

      it('tokenizes CSS qualified attribute names with wildcard prefix', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('[*|title]').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '*',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: 'title',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });

      it('tokenizes CSS qualified attribute names with namespace prefix', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('[marvel|origin=radiation]').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'marvel',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: 'origin',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: 'radiation',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });

      it('tokenizes CSS qualified attribute names without namespace prefix', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('[|data-hp="75"]').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: 'data-hp',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: '=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '75',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
        });
        assert.deepStrictEqual(tokens[7], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });

      it('tokenises compound ID/attribute selectors', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('#div[id="0"]{ }').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'div',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: 'id',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[8], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
        tokens = testGrammar.tokenizeLine('.bar#div[id="0"]').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'bar',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: 'div',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: 'id',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
      });

      it('tokenises compound class/attribute selectors', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('.div[id="0"]{ }').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'div',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: 'id',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[8], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
        tokens = testGrammar.tokenizeLine('#bar.div[id]').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'bar',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: 'div',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: 'id',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });

      it('allows whitespace to be inserted between tokens', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('span[  er|lang  |=   "%%"   ]').tokens;
        assert.deepStrictEqual(tokens[1], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '  ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: 'er',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: 'lang',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: '  ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[7], {
          value: '|=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[8], {
          value: '   ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[9], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
        });
        assert.deepStrictEqual(tokens[10], {
          value: '%%',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css']
        });
        assert.deepStrictEqual(tokens[11], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
        });
        assert.deepStrictEqual(tokens[12], {
          value: '   ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[13], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });

      it('tokenises escape sequences inside attribute selectors', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('a[name\\[0\\]="value"]').tokens;
        assert.deepStrictEqual(tokens[2], {
          value: 'name',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: '\\[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css', 'constant.character.escape.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '0',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '\\]',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css', 'constant.character.escape.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: '=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[10], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });

      it('tokenises escape sequences inside namespace prefixes', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('a[name\\ space|Get\\ It\\?="kek"]').tokens;
        assert.deepStrictEqual(tokens[2], {
          value: 'name',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: '\\ ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css', 'constant.character.escape.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: 'space',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: 'Get',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[7], {
          value: '\\ ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css', 'constant.character.escape.css']
        });
        assert.deepStrictEqual(tokens[8], {
          value: 'It',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[9], {
          value: '\\?',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css', 'constant.character.escape.css']
        });
        assert.deepStrictEqual(tokens[10], {
          value: '=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[14], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });

      it('tokenises comments inside attribute selectors', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('span[/*]*/lang]').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'span',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '/*',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '*/',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: 'lang',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });

      it('tokenises quoted strings in attribute selectors', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('a[href^="#"] a[href^= "#"] a[href^="#" ]').tokens;
        assert.deepStrictEqual(tokens[4], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
        });
        assert.deepStrictEqual(tokens[12], {
          value: '^=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[13], {
          value: ' ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[14], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
        });
        assert.deepStrictEqual(tokens[15], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css']
        });
        assert.deepStrictEqual(tokens[16], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
        });
        assert.deepStrictEqual(tokens[23], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
        });
        assert.deepStrictEqual(tokens[24], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css']
        });
        assert.deepStrictEqual(tokens[25], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
        });
        assert.deepStrictEqual(tokens[26], {
          value: ' ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[27], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
        tokens = testGrammar.tokenizeLine("a[href^='#'] a[href^=  '#'] a[href^='#' ]").tokens;
        assert.deepStrictEqual(tokens[4], {
          value: "'",
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: "'",
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css']
        });
        assert.deepStrictEqual(tokens[12], {
          value: '^=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[13], {
          value: '  ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[14], {
          value: "'",
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css']
        });
        assert.deepStrictEqual(tokens[15], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css']
        });
        assert.deepStrictEqual(tokens[16], {
          value: "'",
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css']
        });
        assert.deepStrictEqual(tokens[23], {
          value: "'",
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css']
        });
        assert.deepStrictEqual(tokens[24], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css']
        });
        assert.deepStrictEqual(tokens[25], {
          value: "'",
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css']
        });
        assert.deepStrictEqual(tokens[26], {
          value: ' ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[27], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });

      it('tokenises unquoted strings in attribute selectors', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('span[class~=Java]').tokens;
        assert.deepStrictEqual(tokens[3], {
          value: '~=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: 'Java',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
        tokens = testGrammar.tokenizeLine('span[class^=  0xDEADCAFE=|~BEEFBABE  ]').tokens;
        assert.deepStrictEqual(tokens[3], {
          value: '^=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '  ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '0xDEADCAFE=|~BEEFBABE',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: '  ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[7], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });

      it('tokenises escape sequences in unquoted strings', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('a[name\\[0\\]=a\\BAD\\AF\\]a\\ i] {}').tokens;
        assert.deepStrictEqual(tokens[6], {
          value: '=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[7], {
          value: 'a',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css']
        });
        assert.deepStrictEqual(tokens[8], {
          value: '\\BAD',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css', 'constant.character.escape.codepoint.css']
        });
        assert.deepStrictEqual(tokens[9], {
          value: '\\AF',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css', 'constant.character.escape.codepoint.css']
        });
        assert.deepStrictEqual(tokens[10], {
          value: '\\]',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css', 'constant.character.escape.css']
        });
        assert.deepStrictEqual(tokens[11], {
          value: 'a',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css']
        });
        assert.deepStrictEqual(tokens[12], {
          value: '\\ ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css', 'constant.character.escape.css']
        });
        assert.deepStrictEqual(tokens[13], {
          value: 'i',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css']
        });
        assert.deepStrictEqual(tokens[14], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[16], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
      });

      it('tokenises the ignore-case modifier at the end of a selector', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('a[attr=val i] a[attr="val" i] a[attr=\'val\'I] a[val^=  \'"\'i] a[attr= i] a[attr= i i]').tokens;
        assert.deepStrictEqual(tokens[6], {
          value: 'i',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'storage.modifier.ignore-case.css']
        });
        assert.deepStrictEqual(tokens[7], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[16], {
          value: ' ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[17], {
          value: 'i',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'storage.modifier.ignore-case.css']
        });
        assert.deepStrictEqual(tokens[26], {
          value: "'",
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css']
        });
        assert.deepStrictEqual(tokens[27], {
          value: 'I',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'storage.modifier.ignore-case.css']
        });
        assert.deepStrictEqual(tokens[28], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[34], {
          value: '  ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[35], {
          value: "'",
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css']
        });
        assert.deepStrictEqual(tokens[36], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css']
        });
        assert.deepStrictEqual(tokens[37], {
          value: "'",
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css']
        });
        assert.deepStrictEqual(tokens[38], {
          value: 'i',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'storage.modifier.ignore-case.css']
        });
        assert.deepStrictEqual(tokens[39], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[44], {
          value: '=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[45], {
          value: ' ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[46], {
          value: 'i',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css']
        });
        assert.deepStrictEqual(tokens[47], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[52], {
          value: '=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(tokens[53], {
          value: ' ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[54], {
          value: 'i',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.unquoted.attribute-value.css']
        });
        assert.deepStrictEqual(tokens[55], {
          value: ' ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(tokens[56], {
          value: 'i',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'storage.modifier.ignore-case.css']
        });
        assert.deepStrictEqual(tokens[57], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });
      
      it('tokenises attribute selectors spanning multiple lines', function () {
        var lines;
        lines = testGrammar.tokenizeLines("span[\n  \\x20{2}\n  ns|lang/**/\n  |=\n\"pt\"]");
        assert.deepStrictEqual(lines[0][0], {
          value: 'span',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
        });
        assert.deepStrictEqual(lines[0][1], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(lines[1][0], {
          value: '  ',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css']
        });
        assert.deepStrictEqual(lines[2][1], {
          value: 'ns',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css']
        });
        assert.deepStrictEqual(lines[2][2], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(lines[2][3], {
          value: 'lang',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(lines[2][4], {
          value: '/*',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
        });
        assert.deepStrictEqual(lines[2][5], {
          value: '*/',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
        });
        assert.deepStrictEqual(lines[3][1], {
          value: '|=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(lines[4][0], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
        });
        assert.deepStrictEqual(lines[4][1], {
          value: 'pt',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css']
        });
        assert.deepStrictEqual(lines[4][2], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
        });
        assert.deepStrictEqual(lines[4][3], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
        lines = testGrammar.tokenizeLines("span[/*===\n==|span[/*}\n====*/*|lang/*]=*/~=/*\"|\"*/\"en-AU\"/*\n |\n*/\ni]");
        assert.deepStrictEqual(lines[0][2], {
          value: '/*',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
        });
        assert.deepStrictEqual(lines[0][3], {
          value: '===',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css']
        });
        assert.deepStrictEqual(lines[1][0], {
          value: '==|span[/*}',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css']
        });
        assert.deepStrictEqual(lines[2][0], {
          value: '====',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css']
        });
        assert.deepStrictEqual(lines[2][1], {
          value: '*/',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
        });
        assert.deepStrictEqual(lines[2][2], {
          value: '*',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css']
        });
        assert.deepStrictEqual(lines[2][3], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(lines[2][4], {
          value: 'lang',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
        assert.deepStrictEqual(lines[2][5], {
          value: '/*',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
        });
        assert.deepStrictEqual(lines[2][6], {
          value: ']=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css']
        });
        assert.deepStrictEqual(lines[2][7], {
          value: '*/',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
        });
        assert.deepStrictEqual(lines[2][8], {
          value: '~=',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
        });
        assert.deepStrictEqual(lines[2][9], {
          value: '/*',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
        });
        assert.deepStrictEqual(lines[2][10], {
          value: '"|"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css']
        });
        assert.deepStrictEqual(lines[2][11], {
          value: '*/',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
        });
        assert.deepStrictEqual(lines[2][12], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
        });
        assert.deepStrictEqual(lines[2][13], {
          value: 'en-AU',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css']
        });
        assert.deepStrictEqual(lines[2][14], {
          value: '"',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
        });
        assert.deepStrictEqual(lines[2][15], {
          value: '/*',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
        });
        assert.deepStrictEqual(lines[3][0], {
          value: ' |',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css']
        });
        assert.deepStrictEqual(lines[4][0], {
          value: '*/',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
        });
        assert.deepStrictEqual(lines[5][0], {
          value: 'i',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'storage.modifier.ignore-case.css']
        });
        assert.deepStrictEqual(lines[5][1], {
          value: ']',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
        });
      });
    });

    describe('class selectors', function () {
      it('tokenizes class selectors containing non-ASCII letters', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('.étendard').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'étendard',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
        });
        tokens = testGrammar.tokenizeLine('.スポンサー').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'スポンサー',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
        });
      });

      it('tokenizes a class selector consisting of two hypens', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('.--').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '--',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
        });
      });

      it('tokenizes class selectors consisting of one (valid) character', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('._').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '_',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
        });
      });

      it('tokenises class selectors starting with an escape sequence', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('.\\33\\44-model {').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '\\33',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'constant.character.escape.codepoint.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '\\44',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'constant.character.escape.codepoint.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: '-model',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
      });

      it('tokenises class selectors ending with an escape sequence', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('.la\\{tex\\} {').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'la',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '\\{',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'constant.character.escape.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: 'tex',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '\\}',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'constant.character.escape.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
      });

      it('marks a class invalid if it contains unescaped ASCII punctuation or symbols other than "-" and "_"', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('.B&W{').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'B&W',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
      });

      it('marks a class invalid if it starts with ASCII digits ([0-9])', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('.666{').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '666',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
      });

      it('marks a class invalid if it starts with "-" followed by ASCII digits', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('.-911-{').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '-911-',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
      });
      
      it('marks a class invalid if it consists of only one hyphen', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('.-{').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '-',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
      });
    });

    describe('id selectors', function () {
      it('tokenizes id selectors consisting of ASCII letters', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('#unicorn').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'unicorn',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css']
        });
      });

      it('tokenizes id selectors containing non-ASCII letters', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('#洪荒之力').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '洪荒之力',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css']
        });
      });

      it('tokenizes id selectors containing [0-9], "-", or "_"', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('#_zer0-day').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '_zer0-day',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css']
        });
      });

      it('tokenizes id selectors beginning with two hyphens', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('#--d3bug--').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '--d3bug--',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css']
        });
      });

      it('marks an id invalid if it contains ASCII punctuation or symbols other than "-" and "_"', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('#sort!{').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'sort!',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
      });

      it('marks an id invalid if it starts with ASCII digits ([0-9])', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('#666{').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '666',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
      });

      it('marks an id invalid if it starts with "-" followed by ASCII digits', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('#-911-{').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '-911-',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
      });

      it('marks an id invalid if it consists of one hyphen only', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('#-{').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '-',
          scopes: ['source.css', 'meta.selector.css', 'invalid.illegal.bad-identifier.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
      });

      it('tokenises ID selectors starting with an escape sequence', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('#\\33\\44-model {').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '\\33',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'constant.character.escape.codepoint.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '\\44',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'constant.character.escape.codepoint.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: '-model',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
      });
      
      it('tokenises ID selectors ending with an escape sequence', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('#la\\{tex\\} {').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '#',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'la',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '\\{',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'constant.character.escape.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: 'tex',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '\\}',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'constant.character.escape.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
      });
    });

    describe('namespace prefixes', function () {
      it('tokenises arbitrary namespace prefixes', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('foo|h1 { }').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'foo',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.namespace-prefix.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: 'h1',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: ' ',
          scopes: ['source.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: '}',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
        });
      });

      it('tokenises anonymous namespace prefixes', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('*|abbr {}').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '*',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.namespace-prefix.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: 'abbr',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: ' ',
          scopes: ['source.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '}',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
        });
        tokens = testGrammar.tokenizeLine('*|* {}').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '*',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.namespace-prefix.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '*',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: ' ',
          scopes: ['source.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '}',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
        });
        tokens = testGrammar.tokenizeLine('foo|*  { }').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'foo',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.namespace-prefix.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '*',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: '}',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
        });
        tokens = testGrammar.tokenizeLine('|[svg|attr=name]{}').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '[',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: 'svg',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.namespace-prefix.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: 'attr',
          scopes: ['source.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
        });
      });

      it('tokenises the "no-namespace" prefix', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('|h1   { }').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'h1',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '}',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
        });
      });
      
      it("doesn't tokenise prefixes without a selector", function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('*| { }').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '*',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: ' ',
          scopes: ['source.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '}',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
        });
        tokens = testGrammar.tokenizeLine('*|{ }').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '*',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '|',
          scopes: ['source.css', 'meta.selector.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: '}',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
        });
      });
    });

    describe('at-rules', function () {
      describe('@charset', function () {
        it('tokenises @charset rules at the start of a file', function () {
          var lines;
          lines = testGrammar.tokenizeLines('@charset "US-ASCII";');
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'charset',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: ' ',
            scopes: ['source.css', 'meta.at-rule.charset.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: 'US-ASCII',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(lines[0][6], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css']
          });
          lines = testGrammar.tokenizeLines('/* Not the first line */\n@charset "UTF-8";');
          assert.deepStrictEqual(lines[0][0], {
            value: '/*',
            scopes: ['source.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: ' Not the first line ',
            scopes: ['source.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: '*/',
            scopes: ['source.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[1][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: 'charset',
            scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css']
          });
        });
        
        it('highlights invalid @charset statements', function () {
          var lines;
          lines = testGrammar.tokenizeLines(" @charset 'US-ASCII';");
          assert.deepStrictEqual(lines[0][0], {
            value: ' ',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.leading-whitespace.charset.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: 'charset',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: "'US-ASCII'",
            scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.not-double-quoted.charset.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css']
          });
          lines = testGrammar.tokenizeLines('@charset  "iso-8859-15";');
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'charset',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: '  ',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.whitespace.charset.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: 'iso-8859-15',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(lines[0][6], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css']
          });
          lines = testGrammar.tokenizeLines('@charset"US-ASCII";');
          assert.deepStrictEqual(lines[0][0], {
            value: '@charset"US-ASCII"',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.no-whitespace.charset.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css']
          });
          lines = testGrammar.tokenizeLines('@charset "UTF-8" ;');
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'charset',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: ' ',
            scopes: ['source.css', 'meta.at-rule.charset.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: 'UTF-8',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(lines[0][6], {
            value: ' ',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.unexpected-characters.charset.css']
          });
          assert.deepStrictEqual(lines[0][7], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css']
          });
          lines = testGrammar.tokenizeLines('@charset "WTF-8" /* Nope */ ;');
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'charset',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: ' ',
            scopes: ['source.css', 'meta.at-rule.charset.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: 'WTF-8',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(lines[0][6], {
            value: ' /* Nope */ ',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.unexpected-characters.charset.css']
          });
          assert.deepStrictEqual(lines[0][7], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css']
          });
          lines = testGrammar.tokenizeLines('@charset "UTF-8');
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'charset',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'keyword.control.at-rule.charset.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: ' ',
            scopes: ['source.css', 'meta.at-rule.charset.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: '"UTF-8',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.unclosed-string.charset.css']
          });
          lines = testGrammar.tokenizeLines("@CHARSET 'US-ASCII';");
          assert.deepStrictEqual(lines[0][0], {
            value: '@CHARSET',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'invalid.illegal.not-lowercase.charset.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: " 'US-ASCII'",
            scopes: ['source.css', 'meta.at-rule.charset.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.charset.css', 'punctuation.terminator.rule.css']
          });
        });
      });
      describe('@import', function () {
        it('tokenises @import statements', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@import url("file.css");').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'import',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'url',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'support.function.url.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'file.css',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css']
          });
          tokens = testGrammar.tokenizeLine('@import "file.css";').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'import',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: 'file.css',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css']
          });
          tokens = testGrammar.tokenizeLine("@import 'file.css';").tokens;
          assert.deepStrictEqual(tokens[3], {
            value: "'",
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: 'file.css',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.single.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: "'",
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css']
          });
        });
        it("doesn't let injected comments impact parameter matching", function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@import /* url("name"); */ "1.css";').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'import',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: ' url("name"); ',
            scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '1.css',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css']
          });
          tokens = testGrammar.tokenizeLine('@import/* Comment */"2.css";').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'import',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: ' Comment ',
            scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: '2.css',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css']
          });
        });
        it('correctly handles word boundaries', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@import"file.css";').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'import',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'file.css',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css']
          });
          tokens = testGrammar.tokenizeLine('@import-file.css;').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'import-file',
            scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '.css',
            scopes: ['source.css', 'meta.at-rule.header.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.header.css', 'punctuation.terminator.rule.css']
          });
        });
        it('matches a URL that starts on the next line', function () {
          var lines;
          lines = testGrammar.tokenizeLines('@import\nurl("file.css");');
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'import',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css']
          });

          // Skipped because `vscode-textmate` does not produce this token
          it.skip('produces a token for whitespace', function () {
            assert.deepStrictEqual(lines[0][2], {
              value: '',
              scopes: ['source.css', 'meta.at-rule.import.css']
            });
          });

          assert.deepStrictEqual(lines[1][0], {
            value: 'url',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'support.function.url.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[1][2], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(lines[1][3], {
            value: 'file.css',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(lines[1][4], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(lines[1][5], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[1][6], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css']
          });
        });
        it('matches comments inside query lists', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@import url("1.css") print /* url(";"); */ all;').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'import',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'url',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'support.function.url.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: '1.css',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: 'print',
            scopes: ['source.css', 'meta.at-rule.import.css', 'support.constant.media.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[13], {
            value: ' url(";"); ',
            scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[14], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[16], {
            value: 'all',
            scopes: ['source.css', 'meta.at-rule.import.css', 'support.constant.media.css']
          });
          assert.deepStrictEqual(tokens[17], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css']
          });
        });
        it('highlights deprecated media types', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@import "astral.css" projection;').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'import',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: 'astral.css',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: 'projection',
            scopes: ['source.css', 'meta.at-rule.import.css', 'invalid.deprecated.constant.media.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css']
          });
        });
        
        it('highlights media features in query lists', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@import url(\'landscape.css\') screen and (orientation:landscape);').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'import',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'url',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'support.function.url.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '\'',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'landscape.css',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.single.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '\'',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: 'screen',
            scopes: ['source.css', 'meta.at-rule.import.css', 'support.constant.media.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: 'and',
            scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.operator.logical.and.media.css']
          });
          assert.deepStrictEqual(tokens[14], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.definition.parameters.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[15], {
            value: 'orientation',
            scopes: ['source.css', 'meta.at-rule.import.css', 'support.type.property-name.media.css']
          });
          assert.deepStrictEqual(tokens[16], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[17], {
            value: 'landscape',
            scopes: ['source.css', 'meta.at-rule.import.css', 'support.constant.property-value.css']
          });
          assert.deepStrictEqual(tokens[18], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.definition.parameters.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[19], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css']
          });
        });
      });
      describe('@media', function () {
        it('tokenises @media keywords correctly', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@media(max-width: 37.5em) { }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'media',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'max-width',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: '37.5',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: 'em',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: ' ',
            scopes: ['source.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css']
          });
          tokens = testGrammar.tokenizeLine('@media not print and (max-width: 37.5em){ }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'media',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'not',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.not.media.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'print',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: 'and',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: 'max-width',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[13], {
            value: '37.5',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[14], {
            value: 'em',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
          });
          assert.deepStrictEqual(tokens[15], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[16], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[18], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css']
          });
        });
        it('highlights deprecated media types', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@media (max-device-width: 2px){ }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'media',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: 'max-device-width',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '2',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css']
          });
        });
        it('highlights vendored media features', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@media (-webkit-foo: bar){ b{ } }').tokens;
          assert.deepStrictEqual(tokens[3], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '-webkit-foo',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: ' bar',
            scopes: ['source.css', 'meta.at-rule.media.header.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css']
          });
          tokens = testGrammar.tokenizeLine('@media screen and (-ms-high-contrast:black-on-white){ }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'media',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'screen',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'and',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '-ms-high-contrast',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: 'black-on-white',
            scopes: ['source.css', 'meta.at-rule.media.header.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[14], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css']
          });
          tokens = testGrammar.tokenizeLine('@media (_moz-a:b){}').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'media',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '_moz-a',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'b',
            scopes: ['source.css', 'meta.at-rule.media.header.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
          });
          tokens = testGrammar.tokenizeLine('@media (-hp-foo:bar){}').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'media',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '-hp-foo',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'bar',
            scopes: ['source.css', 'meta.at-rule.media.header.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
          });
          tokens = testGrammar.tokenizeLine('@media (mso-page-size:wide){}').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'media',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: 'mso-page-size',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'wide',
            scopes: ['source.css', 'meta.at-rule.media.header.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
          });
        });
        it('tokenises @media immediately following a closing brace', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('h1 { }@media only screen { } h2 { }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: 'h1',
            scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'media',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: 'only',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.only.media.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: 'screen',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[14], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[16], {
            value: 'h2',
            scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(tokens[18], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[20], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          tokens = testGrammar.tokenizeLine('h1 { }@media only screen { }h2 { }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: 'h1',
            scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'media',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: 'only',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.only.media.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: 'screen',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[14], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[15], {
            value: 'h2',
            scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(tokens[17], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[19], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });
        it('tokenises level 4 media-query syntax', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@media (min-width >= 0px)\n   and (max-width <= 400)\n   and (min-height > 400)\n   and (max-height < 200)");
          assert.deepStrictEqual(lines[0][6], {
            value: '>=',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.comparison.css']
          });
          assert.deepStrictEqual(lines[1][6], {
            value: '<=',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.comparison.css']
          });
          assert.deepStrictEqual(lines[2][6], {
            value: '>',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.comparison.css']
          });
          assert.deepStrictEqual(lines[3][6], {
            value: '<',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.comparison.css']
          });
        });
        it('tokenises comments between media types', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@media/* */only/* */screen/* */and (min-width:1100px){}').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'media',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'only',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.only.media.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: 'screen',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[13], {
            value: 'and',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css']
          });
          assert.deepStrictEqual(tokens[15], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[16], {
            value: 'min-width',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css']
          });
          assert.deepStrictEqual(tokens[17], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[18], {
            value: '1100',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[19], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(tokens[20], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[21], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[22], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css']
          });
        });
        
        it('tokenises comments between media features', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@media/*=*/(max-width:/**/37.5em)/*=*/and/*=*/(/*=*/min-height/*:*/:/*=*/1.2em/*;*/){}').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'media',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '=',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'max-width',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: '37.5',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: 'em',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[13], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[14], {
            value: '=',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[15], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[16], {
            value: 'and',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css']
          });
          assert.deepStrictEqual(tokens[17], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[18], {
            value: '=',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[19], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[20], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[21], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[22], {
            value: '=',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[23], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[24], {
            value: 'min-height',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css']
          });
          assert.deepStrictEqual(tokens[25], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[26], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[27], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[28], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[29], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[30], {
            value: '=',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[31], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[32], {
            value: '1.2',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[33], {
            value: 'em',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
          });
          assert.deepStrictEqual(tokens[34], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[35], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[36], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[37], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[38], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[39], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css']
          });
        });
      });

      it('matches media queries across lines', function () {
        var lines;
        lines = testGrammar.tokenizeLines("@media only screen and (min-width : /* 40 */\n  320px),\n  not print and (max-width: 480px)  /* kek */ and (-webkit-min-device-pixel-ratio /*:*/ : 2),\nonly speech and (min-width: 10em),  /* wat */     (-webkit-min-device-pixel-ratio: 2) { }");
        assert.deepStrictEqual(lines[0][0], {
          value: '@',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
        });
        assert.deepStrictEqual(lines[0][1], {
          value: 'media',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
        });
        assert.deepStrictEqual(lines[0][3], {
          value: 'only',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.only.media.css']
        });
        assert.deepStrictEqual(lines[0][5], {
          value: 'screen',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css']
        });
        assert.deepStrictEqual(lines[0][7], {
          value: 'and',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css']
        });
        assert.deepStrictEqual(lines[0][9], {
          value: '(',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
        });
        assert.deepStrictEqual(lines[0][10], {
          value: 'min-width',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css']
        });
        assert.deepStrictEqual(lines[0][12], {
          value: ':',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
        });
        assert.deepStrictEqual(lines[0][14], {
          value: '/*',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
        });
        assert.deepStrictEqual(lines[0][15], {
          value: ' 40 ',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css']
        });
        assert.deepStrictEqual(lines[0][16], {
          value: '*/',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
        });
        assert.deepStrictEqual(lines[1][1], {
          value: '320',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[1][2], {
          value: 'px',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
        });
        assert.deepStrictEqual(lines[1][3], {
          value: ')',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
        });
        assert.deepStrictEqual(lines[1][4], {
          value: ',',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.list.comma.css']
        });
        assert.deepStrictEqual(lines[2][1], {
          value: 'not',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.not.media.css']
        });
        assert.deepStrictEqual(lines[2][3], {
          value: 'print',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css']
        });
        assert.deepStrictEqual(lines[2][5], {
          value: 'and',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css']
        });
        assert.deepStrictEqual(lines[2][7], {
          value: '(',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
        });
        assert.deepStrictEqual(lines[2][8], {
          value: 'max-width',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css']
        });
        assert.deepStrictEqual(lines[2][9], {
          value: ':',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
        });
        assert.deepStrictEqual(lines[2][11], {
          value: '480',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[2][12], {
          value: 'px',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
        });
        assert.deepStrictEqual(lines[2][13], {
          value: ')',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
        });
        assert.deepStrictEqual(lines[2][15], {
          value: '/*',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
        });
        assert.deepStrictEqual(lines[2][16], {
          value: ' kek ',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css']
        });
        assert.deepStrictEqual(lines[2][17], {
          value: '*/',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
        });
        assert.deepStrictEqual(lines[2][19], {
          value: 'and',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css']
        });
        assert.deepStrictEqual(lines[2][21], {
          value: '(',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
        });
        assert.deepStrictEqual(lines[2][22], {
          value: '-webkit-min-device-pixel-ratio',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css']
        });
        assert.deepStrictEqual(lines[2][24], {
          value: '/*',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
        });
        assert.deepStrictEqual(lines[2][25], {
          value: ':',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css']
        });
        assert.deepStrictEqual(lines[2][26], {
          value: '*/',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
        });
        assert.deepStrictEqual(lines[2][28], {
          value: ':',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
        });
        assert.deepStrictEqual(lines[2][30], {
          value: '2',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[2][31], {
          value: ')',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
        });
        assert.deepStrictEqual(lines[2][32], {
          value: ',',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.list.comma.css']
        });
        assert.deepStrictEqual(lines[3][0], {
          value: 'only',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.only.media.css']
        });
        assert.deepStrictEqual(lines[3][2], {
          value: 'speech',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css']
        });
        assert.deepStrictEqual(lines[3][4], {
          value: 'and',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.operator.logical.and.media.css']
        });
        assert.deepStrictEqual(lines[3][6], {
          value: '(',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
        });
        assert.deepStrictEqual(lines[3][7], {
          value: 'min-width',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css']
        });
        assert.deepStrictEqual(lines[3][8], {
          value: ':',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
        });
        assert.deepStrictEqual(lines[3][10], {
          value: '10',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[3][11], {
          value: 'em',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
        });
        assert.deepStrictEqual(lines[3][12], {
          value: ')',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
        });
        assert.deepStrictEqual(lines[3][13], {
          value: ',',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.list.comma.css']
        });
        assert.deepStrictEqual(lines[3][15], {
          value: '/*',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
        });
        assert.deepStrictEqual(lines[3][16], {
          value: ' wat ',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css']
        });
        assert.deepStrictEqual(lines[3][17], {
          value: '*/',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
        });
        assert.deepStrictEqual(lines[3][19], {
          value: '(',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
        });
        assert.deepStrictEqual(lines[3][20], {
          value: '-webkit-min-device-pixel-ratio',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.vendored.property-name.media.css']
        });
        assert.deepStrictEqual(lines[3][21], {
          value: ':',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
        });
        assert.deepStrictEqual(lines[3][23], {
          value: '2',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[3][24], {
          value: ')',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
        });
        assert.deepStrictEqual(lines[3][26], {
          value: '{',
          scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css']
        });
        assert.deepStrictEqual(lines[3][28], {
          value: '}',
          scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css']
        });
      });

      it('highlights invalid commas', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('@media , {}').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '@',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'media',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: ',',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'invalid.illegal.comma.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: '{',
          scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: '}',
          scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css']
        });
        tokens = testGrammar.tokenizeLine('@media , ,screen {}').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '@',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'media',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: ', ,',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'invalid.illegal.comma.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: 'screen',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.constant.media.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: '{',
          scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.begin.bracket.curly.css']
        });
        assert.deepStrictEqual(tokens[7], {
          value: '}',
          scopes: ['source.css', 'meta.at-rule.media.body.css', 'punctuation.section.media.end.bracket.curly.css']
        });
      });

      it('allows spaces inside ratio values', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('@media (min-aspect-ratio: 3 / 4) and (max-aspect-ratio: 20   /   17) {}').tokens;
        assert.deepStrictEqual(tokens[7], {
          value: '3',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(tokens[8], {
          value: ' ',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css']
        });
        assert.deepStrictEqual(tokens[9], {
          value: '/',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css', 'keyword.operator.arithmetic.css']
        });
        assert.deepStrictEqual(tokens[10], {
          value: ' ',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css']
        });
        assert.deepStrictEqual(tokens[11], {
          value: '4',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(tokens[20], {
          value: '20',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(tokens[21], {
          value: '   ',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css']
        });
        assert.deepStrictEqual(tokens[22], {
          value: '/',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css', 'keyword.operator.arithmetic.css']
        });
        assert.deepStrictEqual(tokens[23], {
          value: '   ',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css']
        });
        assert.deepStrictEqual(tokens[24], {
          value: '17',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'meta.ratio.css', 'constant.numeric.css']
        });
      });
      describe('@keyframes', function () {
        it('tokenises keyframe lists correctly', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@keyframes important1 {\n  from { margin-top: 50px;\n         margin-bottom: 100px }\n  50%  { margin-top: 150px !important; } /* Ignored */\n  to   { margin-top: 100px; }\n}");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'keyframes',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: 'important1',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: ' ',
            scopes: ['source.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: 'from',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css']
          });
          assert.deepStrictEqual(lines[1][3], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[1][5], {
            value: 'margin-top',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[1][6], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[1][8], {
            value: '50',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[1][9], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(lines[1][10], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[2][1], {
            value: 'margin-bottom',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[2][2], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[2][4], {
            value: '100',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[2][5], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(lines[2][7], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[3][1], {
            value: '50%',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.percentage.css']
          });
          assert.deepStrictEqual(lines[3][3], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[3][5], {
            value: 'margin-top',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[3][6], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[3][8], {
            value: '150',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[3][9], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(lines[3][11], {
            value: '!important',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'keyword.other.important.css']
          });
          assert.deepStrictEqual(lines[3][12], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[3][14], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[3][16], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[3][17], {
            value: ' Ignored ',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[3][18], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[4][1], {
            value: 'to',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css']
          });
          assert.deepStrictEqual(lines[4][3], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[4][5], {
            value: 'margin-top',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[4][6], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[4][8], {
            value: '100',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[4][9], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(lines[4][10], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[4][12], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[5][0], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.end.bracket.curly.css']
          });
        });
        it('matches injected comments', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@keyframes/*{*/___IDENT__/*}\n  { Nah { margin-top: 2em; }\n*/{ from");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'keyframes',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: '___IDENT__',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css']
          });
          assert.deepStrictEqual(lines[0][6], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[0][7], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[1][0], {
            value: '  { Nah { margin-top: 2em; }',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[2][0], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[2][1], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[2][3], {
            value: 'from',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css']
          });
        });
        it('matches offset keywords case-insensitively', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@keyframes Give-them-both { fROm { } To {} }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'keyframes',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'Give-them-both',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: ' ',
            scopes: ['source.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: 'fROm',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[13], {
            value: 'To',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css']
          });
          assert.deepStrictEqual(tokens[15], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[16], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[18], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.end.bracket.curly.css']
          });
        });
        it('matches percentile offsets', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@keyframes identifier { -50.2% } @keyframes ident2 { .25%}').tokens;
          assert.deepStrictEqual(tokens[7], {
            value: '-50.2%',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.percentage.css']
          });
          assert.deepStrictEqual(tokens[18], {
            value: '.25%',
            scopes: ['source.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.percentage.css']
          });
        });
        
        it('highlights escape sequences inside identifiers', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@keyframes A\\1F602Z').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'keyframes',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'A',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '\\1F602',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css', 'constant.character.escape.codepoint.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'Z',
            scopes: ['source.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css']
          });
        });
      });
      describe('@supports', function () {
        it('tokenises feature queries', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@supports (font-size: 1em) { }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'supports',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: ' ',
            scopes: ['source.css', 'meta.at-rule.supports.header.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: 'font-size',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '1',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: 'em',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: ' ',
            scopes: ['source.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[13], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.end.bracket.curly.css']
          });
        });
        it('matches logical operators', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@supports not (font-size: 1em){ }\n@supports (font-size: 1em) and (font-size: 1em){ }\n@supports (font-size: 1em) or (font-size: 1em){ }");
          assert.deepStrictEqual(lines[0][3], {
            value: 'not',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.not.css']
          });
          assert.deepStrictEqual(lines[1][11], {
            value: 'and',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.and.css']
          });
          assert.deepStrictEqual(lines[2][11], {
            value: 'or',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.or.css']
          });
        });
        it('matches custom variables in feature queries', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@supports (--foo: green){}').tokens;
          assert.deepStrictEqual(tokens[3], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '--foo',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'variable.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: 'green',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css']
          });
        });
        it("doesn't mistake brackets in string literals for feature queries", function () {
          var lines;
          lines = testGrammar.tokenizeLines("@supports not ((tab-size:4) or (-moz-tab-size:4)){\n  body::before{content: \"Come on, Microsoft (Get it together already)…\"; }\n}");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'supports',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: 'not',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.not.css']
          });
          assert.deepStrictEqual(lines[0][7], {
            value: 'tab-size',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[0][12], {
            value: 'or',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'keyword.operator.logical.feature.or.css']
          });
          assert.deepStrictEqual(lines[0][15], {
            value: '-moz-tab-size',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.vendored.property-name.css']
          });
          assert.deepStrictEqual(lines[0][20], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: 'body',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(lines[1][2], {
            value: '::',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(lines[1][3], {
            value: 'before',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
          });
          assert.deepStrictEqual(lines[1][4], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[1][5], {
            value: 'content',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[1][6], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[1][8], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(lines[1][9], {
            value: 'Come on, Microsoft (Get it together already)…',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(lines[1][10], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(lines[1][11], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[1][13], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[2][0], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.end.bracket.curly.css']
          });
        });
        it('tokenises multiple feature queries', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@supports (display:table-cell) or ((display:list-item) and (display:run-in)){').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'supports',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: 'display',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'table-cell',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: 'or',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.or.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[13], {
            value: 'display',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(tokens[14], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[15], {
            value: 'list-item',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css']
          });
          assert.deepStrictEqual(tokens[16], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[18], {
            value: 'and',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'keyword.operator.logical.feature.and.css']
          });
          assert.deepStrictEqual(tokens[20], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[21], {
            value: 'display',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(tokens[22], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[23], {
            value: 'run-in',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css']
          });
          assert.deepStrictEqual(tokens[24], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[25], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[26], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.begin.bracket.curly.css']
          });
        });
        it('embeds rulesets and other at-rules', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@supports (animation-name: test) {\n  #node {\n    animation-name: test;\n  }\n  body > header[data-name=\"attr\"] ~ *:not(:first-child){\n    content: \"😂👌\"\n  }\n  @keyframes important1 {\n    from {\n      margin-top: 50px;\n      margin-bottom: 100px\n    }\n    50%  { margin-top: 150px !important; } /* Ignored */\n    to   { margin-top: 100px; }\n  }\n}");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'supports',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: 'animation-name',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[0][7], {
            value: 'test',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css']
          });
          assert.deepStrictEqual(lines[0][8], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[0][10], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: '#',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.id.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(lines[1][2], {
            value: 'node',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.id.css']
          });
          assert.deepStrictEqual(lines[1][4], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[2][1], {
            value: 'animation-name',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[2][2], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[2][4], {
            value: 'test',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css']
          });
          assert.deepStrictEqual(lines[2][5], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[3][1], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[4][1], {
            value: 'body',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(lines[4][3], {
            value: '>',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'keyword.operator.combinator.css']
          });
          assert.deepStrictEqual(lines[4][5], {
            value: 'header',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(lines[4][6], {
            value: '[',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.begin.bracket.square.css']
          });
          assert.deepStrictEqual(lines[4][7], {
            value: 'data-name',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'entity.other.attribute-name.css']
          });
          assert.deepStrictEqual(lines[4][8], {
            value: '=',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'keyword.operator.pattern.css']
          });
          assert.deepStrictEqual(lines[4][9], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(lines[4][10], {
            value: 'attr',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(lines[4][11], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(lines[4][12], {
            value: ']',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'meta.attribute-selector.css', 'punctuation.definition.entity.end.bracket.square.css']
          });
          assert.deepStrictEqual(lines[4][14], {
            value: '~',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'keyword.operator.combinator.css']
          });
          assert.deepStrictEqual(lines[4][16], {
            value: '*',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.name.tag.wildcard.css']
          });
          assert.deepStrictEqual(lines[4][17], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(lines[4][18], {
            value: 'not',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(lines[4][19], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[4][20], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(lines[4][21], {
            value: 'first-child',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(lines[4][22], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[4][23], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[5][1], {
            value: 'content',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[5][2], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[5][4], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(lines[5][5], {
            value: '😂👌',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(lines[5][6], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(lines[6][1], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[7][1], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[7][2], {
            value: 'keyframes',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.header.css', 'keyword.control.at-rule.keyframes.css']
          });
          assert.deepStrictEqual(lines[7][4], {
            value: 'important1',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.header.css', 'variable.parameter.keyframe-list.css']
          });
          assert.deepStrictEqual(lines[7][6], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[8][1], {
            value: 'from',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css']
          });
          assert.deepStrictEqual(lines[8][3], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[9][1], {
            value: 'margin-top',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[9][2], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[9][4], {
            value: '50',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[9][5], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(lines[9][6], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[10][1], {
            value: 'margin-bottom',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[10][2], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[10][4], {
            value: '100',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[10][5], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(lines[11][1], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[12][1], {
            value: '50%',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.percentage.css']
          });
          assert.deepStrictEqual(lines[12][3], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[12][5], {
            value: 'margin-top',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[12][6], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[12][8], {
            value: '150',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[12][9], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(lines[12][11], {
            value: '!important',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'keyword.other.important.css']
          });
          assert.deepStrictEqual(lines[12][12], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[12][14], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[12][16], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[12][17], {
            value: ' Ignored ',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[12][18], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[13][1], {
            value: 'to',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'entity.other.keyframe-offset.css']
          });
          assert.deepStrictEqual(lines[13][3], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[13][5], {
            value: 'margin-top',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[13][6], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[13][8], {
            value: '100',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[13][9], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(lines[13][10], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[13][12], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[14][1], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.at-rule.keyframes.body.css', 'punctuation.section.keyframes.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[15][0], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.end.bracket.curly.css']
          });
        });
        it('matches injected comments', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@supports/*===*/not/*==****************|\n==*/(display:table-cell)/*============*/ and (display: list-item)/*}*/{}");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'supports',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: '===',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: 'not',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.not.css']
          });
          assert.deepStrictEqual(lines[0][6], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[0][7], {
            value: '==****************|',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[1][0], {
            value: '==',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[1][2], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[1][3], {
            value: 'display',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[1][4], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[1][5], {
            value: 'table-cell',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css']
          });
          assert.deepStrictEqual(lines[1][6], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[1][7], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[1][8], {
            value: '============',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[1][9], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[1][11], {
            value: 'and',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.and.css']
          });
          assert.deepStrictEqual(lines[1][13], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[1][19], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[1][20], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[1][21], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[1][22], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[1][23], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.end.bracket.curly.css']
          });
        });
        
        it('matches feature queries across multiple lines', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@supports\n  (box-shadow: 0 0 2px rgba(0,0,0,.5) inset) or\n  (-moz-box-shadow: 0 0 2px black inset) or\n  (-webkit-box-shadow: 0 0 2px black inset) or\n  (-o-box-shadow: 0 0 2px black inset)\n{ .noticebox { } }");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'supports',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.control.at-rule.supports.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[1][2], {
            value: 'box-shadow',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[1][3], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[1][5], {
            value: '0',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[1][7], {
            value: '0',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[1][9], {
            value: '2',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[1][10], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(lines[1][12], {
            value: 'rgba',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css']
          });
          assert.deepStrictEqual(lines[1][13], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[1][14], {
            value: '0',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[1][15], {
            value: ',',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
          });
          assert.deepStrictEqual(lines[1][16], {
            value: '0',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[1][17], {
            value: ',',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
          });
          assert.deepStrictEqual(lines[1][18], {
            value: '0',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[1][19], {
            value: ',',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
          });
          assert.deepStrictEqual(lines[1][20], {
            value: '.5',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[1][21], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[1][23], {
            value: 'inset',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css']
          });
          assert.deepStrictEqual(lines[1][24], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[1][26], {
            value: 'or',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.or.css']
          });
          assert.deepStrictEqual(lines[2][1], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[2][2], {
            value: '-moz-box-shadow',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.vendored.property-name.css']
          });
          assert.deepStrictEqual(lines[2][3], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[2][5], {
            value: '0',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[2][7], {
            value: '0',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[2][9], {
            value: '2',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[2][10], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(lines[2][12], {
            value: 'black',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css']
          });
          assert.deepStrictEqual(lines[2][14], {
            value: 'inset',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css']
          });
          assert.deepStrictEqual(lines[2][15], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[2][17], {
            value: 'or',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.or.css']
          });
          assert.deepStrictEqual(lines[3][1], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[3][2], {
            value: '-webkit-box-shadow',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.vendored.property-name.css']
          });
          assert.deepStrictEqual(lines[3][3], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[3][5], {
            value: '0',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[3][7], {
            value: '0',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[3][9], {
            value: '2',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[3][10], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(lines[3][12], {
            value: 'black',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css']
          });
          assert.deepStrictEqual(lines[3][14], {
            value: 'inset',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css']
          });
          assert.deepStrictEqual(lines[3][15], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[3][17], {
            value: 'or',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'keyword.operator.logical.feature.or.css']
          });
          assert.deepStrictEqual(lines[4][1], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[4][2], {
            value: '-o-box-shadow',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-name.css', 'support.type.vendored.property-name.css']
          });
          assert.deepStrictEqual(lines[4][3], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[4][5], {
            value: '0',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[4][7], {
            value: '0',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[4][9], {
            value: '2',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[4][10], {
            value: 'px',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(lines[4][12], {
            value: 'black',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css']
          });
          assert.deepStrictEqual(lines[4][14], {
            value: 'inset',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'meta.property-value.css', 'support.constant.property-value.css']
          });
          assert.deepStrictEqual(lines[4][15], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.supports.header.css', 'meta.feature-query.css', 'punctuation.definition.condition.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[5][0], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[5][2], {
            value: '.',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(lines[5][3], {
            value: 'noticebox',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
          });
          assert.deepStrictEqual(lines[5][5], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[5][7], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[5][9], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.supports.body.css', 'punctuation.section.supports.end.bracket.curly.css']
          });
        });
      });
      describe('@namespace', function () {
        it('tokenises @namespace statements correctly', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@namespace "XML";').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'namespace',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: ' ',
            scopes: ['source.css', 'meta.at-rule.namespace.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: 'XML',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css']
          });
          tokens = testGrammar.tokenizeLine('@namespace  prefix  "XML"  ;').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'namespace',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '  ',
            scopes: ['source.css', 'meta.at-rule.namespace.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'prefix',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '  ',
            scopes: ['source.css', 'meta.at-rule.namespace.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'XML',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '  ',
            scopes: ['source.css', 'meta.at-rule.namespace.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css']
          });
          tokens = testGrammar.tokenizeLine('@namespace url("http://a.bc/");').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'namespace',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: ' ',
            scopes: ['source.css', 'meta.at-rule.namespace.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'url',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'support.function.url.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'http://a.bc/',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css']
          });
        });
        it("doesn't confuse a prefix of 'url' as a function", function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@namespace url url("http://a.bc/");').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'namespace',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'url',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'url',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'support.function.url.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: 'http://a.bc/',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css']
          });
        });
        it('permits injected comments between tokens', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@namespace/*=*/pre/*=*/"url"/*=*/;').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'namespace',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '=',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'pre',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '=',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: 'url',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[13], {
            value: '=',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[14], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[15], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css']
          });
        });
        it('allows no spaces between "@namespace" and quoted URLs', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@namespace"XML";').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'namespace',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'XML',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css']
          });
        });
        it('tokenises escape sequences in prefixes', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@namespace pre\\ fix "http://url/";').tokens;
          assert.deepStrictEqual(tokens[3], {
            value: 'pre',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '\\ ',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css', 'constant.character.escape.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'fix',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
        });
        
        it('allows arguments to span multiple lines', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@namespace\nprefix\"XML\";");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'namespace',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css']
          });
          assert.deepStrictEqual(lines[1][0], {
            value: 'prefix',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(lines[1][2], {
            value: 'XML',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(lines[1][3], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(lines[1][4], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css']
          });
          lines = testGrammar.tokenizeLines("@namespace\n\n  prefix\n\nurl(\"http://a.bc/\");");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'namespace',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css']
          });
          assert.deepStrictEqual(lines[2][1], {
            value: 'prefix',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'entity.name.function.namespace-prefix.css']
          });
          assert.deepStrictEqual(lines[4][0], {
            value: 'url',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'support.function.url.css']
          });
          assert.deepStrictEqual(lines[4][1], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[4][2], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(lines[4][3], {
            value: 'http://a.bc/',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(lines[4][4], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(lines[4][5], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[4][6], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.namespace.css', 'punctuation.terminator.rule.css']
          });
        });
      });
      describe('font-feature declarations', function () {
        it('tokenises font-feature blocks', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@font-feature-values Font name 2 { }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'font-feature-values',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: ' ',
            scopes: ['source.css', 'meta.at-rule.font-features.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'Font name 2',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: ' ',
            scopes: ['source.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });
        it('allows font-feature names to start on a different line', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@font-feature-values\nFont name 2\n{");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'font-feature-values',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css']
          });
          assert.deepStrictEqual(lines[1][0], {
            value: 'Font name 2',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css']
          });
          assert.deepStrictEqual(lines[2][0], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
        });
        it('matches injected comments', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@font-feature-values/*{*/Font/*}*/name/*{*/2{').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'font-feature-values',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'Font',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: 'name',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[13], {
            value: '2',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css']
          });
          assert.deepStrictEqual(tokens[14], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
        });
        it('tokenises at-rules for feature names', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@swash{ swashy: 2; }\n@ornaments{ ident: 2; }\n@annotation{ ident: 1; }\n@stylistic{ stylish: 2; }\n@styleset{ sets: 2 3 4; }\n@character-variant{ charvar: 2 }");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'swash',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: 'swashy',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[0][7], {
            value: '2',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[0][8], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[0][10], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[1][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.ornaments.css', 'keyword.control.at-rule.ornaments.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: 'ornaments',
            scopes: ['source.css', 'meta.at-rule.ornaments.css', 'keyword.control.at-rule.ornaments.css']
          });
          assert.deepStrictEqual(lines[1][2], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.ornaments.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[1][4], {
            value: 'ident',
            scopes: ['source.css', 'meta.at-rule.ornaments.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css']
          });
          assert.deepStrictEqual(lines[1][5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.ornaments.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[1][7], {
            value: '2',
            scopes: ['source.css', 'meta.at-rule.ornaments.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[1][8], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.ornaments.css', 'meta.property-list.font-feature.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[1][10], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.ornaments.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[2][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.annotation.css', 'keyword.control.at-rule.annotation.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[2][1], {
            value: 'annotation',
            scopes: ['source.css', 'meta.at-rule.annotation.css', 'keyword.control.at-rule.annotation.css']
          });
          assert.deepStrictEqual(lines[2][2], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.annotation.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[2][4], {
            value: 'ident',
            scopes: ['source.css', 'meta.at-rule.annotation.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css']
          });
          assert.deepStrictEqual(lines[2][5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.annotation.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[2][7], {
            value: '1',
            scopes: ['source.css', 'meta.at-rule.annotation.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[2][8], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.annotation.css', 'meta.property-list.font-feature.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[2][10], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.annotation.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[3][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.stylistic.css', 'keyword.control.at-rule.stylistic.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[3][1], {
            value: 'stylistic',
            scopes: ['source.css', 'meta.at-rule.stylistic.css', 'keyword.control.at-rule.stylistic.css']
          });
          assert.deepStrictEqual(lines[3][2], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.stylistic.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[3][4], {
            value: 'stylish',
            scopes: ['source.css', 'meta.at-rule.stylistic.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css']
          });
          assert.deepStrictEqual(lines[3][5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.stylistic.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[3][7], {
            value: '2',
            scopes: ['source.css', 'meta.at-rule.stylistic.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[3][8], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.stylistic.css', 'meta.property-list.font-feature.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[3][10], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.stylistic.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[4][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.styleset.css', 'keyword.control.at-rule.styleset.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[4][1], {
            value: 'styleset',
            scopes: ['source.css', 'meta.at-rule.styleset.css', 'keyword.control.at-rule.styleset.css']
          });
          assert.deepStrictEqual(lines[4][2], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[4][4], {
            value: 'sets',
            scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css']
          });
          assert.deepStrictEqual(lines[4][5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[4][7], {
            value: '2',
            scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[4][9], {
            value: '3',
            scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[4][11], {
            value: '4',
            scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[4][12], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[4][14], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.styleset.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[5][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.character-variant.css', 'keyword.control.at-rule.character-variant.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[5][1], {
            value: 'character-variant',
            scopes: ['source.css', 'meta.at-rule.character-variant.css', 'keyword.control.at-rule.character-variant.css']
          });
          assert.deepStrictEqual(lines[5][2], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.character-variant.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[5][4], {
            value: 'charvar',
            scopes: ['source.css', 'meta.at-rule.character-variant.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css']
          });
          assert.deepStrictEqual(lines[5][5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.character-variant.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[5][7], {
            value: '2',
            scopes: ['source.css', 'meta.at-rule.character-variant.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[5][9], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.character-variant.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });
        it('matches feature-name rules case-insensitively', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@sWASH{ swashy: 2; }\n@ornaMENts{ ident: 2; }\n@anNOTatION{ ident: 1; }\n@styLISTic{ stylish: 2; }\n@STYLEset{ sets: 2 3 4; }\n@CHARacter-VARiant{ charvar: 2 }");
          assert.deepStrictEqual(lines[0][1], {
            value: 'sWASH',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: 'ornaMENts',
            scopes: ['source.css', 'meta.at-rule.ornaments.css', 'keyword.control.at-rule.ornaments.css']
          });
          assert.deepStrictEqual(lines[2][1], {
            value: 'anNOTatION',
            scopes: ['source.css', 'meta.at-rule.annotation.css', 'keyword.control.at-rule.annotation.css']
          });
          assert.deepStrictEqual(lines[3][1], {
            value: 'styLISTic',
            scopes: ['source.css', 'meta.at-rule.stylistic.css', 'keyword.control.at-rule.stylistic.css']
          });
          assert.deepStrictEqual(lines[4][1], {
            value: 'STYLEset',
            scopes: ['source.css', 'meta.at-rule.styleset.css', 'keyword.control.at-rule.styleset.css']
          });
          assert.deepStrictEqual(lines[5][1], {
            value: 'CHARacter-VARiant',
            scopes: ['source.css', 'meta.at-rule.character-variant.css', 'keyword.control.at-rule.character-variant.css']
          });
        });
        it('matches comments inside feature-name rules', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@font-feature-values Font name 2 {\n@swash{/*\n========*/swashy:/**/2;/**/}\n}");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'font-feature-values',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'keyword.control.at-rule.font-feature-values.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: 'Font name 2',
            scopes: ['source.css', 'meta.at-rule.font-features.css', 'variable.parameter.font-name.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[1][0], {
            value: '@',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: 'swash',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css']
          });
          assert.deepStrictEqual(lines[1][2], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[1][3], {
            value: '/*',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[2][0], {
            value: '========',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[2][1], {
            value: '*/',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[2][2], {
            value: 'swashy',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css']
          });
          assert.deepStrictEqual(lines[2][3], {
            value: ':',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[2][4], {
            value: '/*',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[2][5], {
            value: '*/',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[2][6], {
            value: '2',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[2][7], {
            value: ';',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[2][8], {
            value: '/*',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[2][9], {
            value: '*/',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[2][10], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[3][0], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });
        
        it('highlights escape sequences inside feature-names', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@swash{ s\\000077a\\73hy: 1; }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'swash',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'keyword.control.at-rule.swash.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: 's',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '\\000077',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css', 'constant.character.escape.codepoint.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'a',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '\\73',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css', 'constant.character.escape.codepoint.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: 'hy',
            scopes: ['source.css', 'meta.at-rule.swash.css', 'meta.property-list.font-feature.css', 'variable.font-feature.css']
          });
        });
      });
      describe('@page', function () {
        
        it('tokenises @page blocks correctly', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@page :first { }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'page',
            scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: ' ',
            scopes: ['source.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: ':',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: 'first',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: ' ',
            scopes: ['source.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });

        it.skip('tokenizes @page:right {} correctly', function () {
          var tokens = testGrammar.tokenizeLine('@page:right{}').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'page',
            scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: ':',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'right',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });

        it('tokenizes @page {} correctly', function () {
          var tokens = testGrammar.tokenizeLine('@page {}').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'page',
            scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: ' ',
            scopes: ['source.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });

        it.skip('tokenizes @page{} correctly', function () {
          var tokens = testGrammar.tokenizeLine('@page{}').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'page',
            scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });
      });

      describe('@counter-style', function () {
        it('tokenises them and their contents correctly', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@counter-style winners-list {\n  system: fixed;\n  symbols: url(gold-medal.svg) url(silver-medal.svg) url(bronze-medal.svg);\n  suffix: \" \";\n}");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'counter-style',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: 'winners-list',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'variable.parameter.style-name.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: 'system',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[1][2], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[1][4], {
            value: 'fixed',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'support.constant.property-value.css']
          });
          assert.deepStrictEqual(lines[1][5], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[2][1], {
            value: 'symbols',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[2][2], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[2][4], {
            value: 'url',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'support.function.url.css']
          });
          assert.deepStrictEqual(lines[2][5], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[2][6], {
            value: 'gold-medal.svg',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'variable.parameter.url.css']
          });
          assert.deepStrictEqual(lines[2][7], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[2][9], {
            value: 'url',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'support.function.url.css']
          });
          assert.deepStrictEqual(lines[2][10], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[2][11], {
            value: 'silver-medal.svg',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'variable.parameter.url.css']
          });
          assert.deepStrictEqual(lines[2][12], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[2][14], {
            value: 'url',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'support.function.url.css']
          });
          assert.deepStrictEqual(lines[2][15], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[2][16], {
            value: 'bronze-medal.svg',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'variable.parameter.url.css']
          });
          assert.deepStrictEqual(lines[2][17], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[2][18], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[3][1], {
            value: 'suffix',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[3][2], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[3][4], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(lines[3][6], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(lines[3][7], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[4][0], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });
        it('matches injected comments', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@counter-style/*{*/winners-list/*}*/{ system: fixed; }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'counter-style',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'winners-list',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'variable.parameter.style-name.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: 'system',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[14], {
            value: 'fixed',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'meta.property-value.css', 'support.constant.property-value.css']
          });
          assert.deepStrictEqual(tokens[15], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(tokens[17], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.counter-style.body.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });
        it("allows the counter-style's name to start on a different line", function () {
          var lines;
          lines = testGrammar.tokenizeLines("@counter-style\nwinners-list");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'counter-style',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css']
          });
          assert.deepStrictEqual(lines[1][0], {
            value: 'winners-list',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'variable.parameter.style-name.css']
          });
        });
        
        it("highlights escape sequences inside the style's name", function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@counter-style A\\01F602z').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'counter-style',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'keyword.control.at-rule.counter-style.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'A',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'variable.parameter.style-name.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '\\01F602',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'variable.parameter.style-name.css', 'constant.character.escape.codepoint.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'z',
            scopes: ['source.css', 'meta.at-rule.counter-style.header.css', 'variable.parameter.style-name.css']
          });
        });
      });
      describe('@document', function () {
        
        it('correctly tokenises @document rules', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@document url(http://www.w3.org/),\n  url-prefix(http://www.w3.org/Style/), /* Comment */\n  domain(/**/mozilla.org),\n  regexp(\"https:.*\") {\n    body{ color: #f00; }\n  }");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'keyword.control.at-rule.document.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'document',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'keyword.control.at-rule.document.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: 'url',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.url.css', 'support.function.url.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: 'http://www.w3.org/',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.url.css', 'variable.parameter.url.css']
          });
          assert.deepStrictEqual(lines[0][6], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[0][7], {
            value: ',',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'punctuation.separator.list.comma.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: 'url-prefix',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'support.function.document-rule.css']
          });
          assert.deepStrictEqual(lines[1][2], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[1][3], {
            value: 'http://www.w3.org/Style/',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'variable.parameter.document-rule.css']
          });
          assert.deepStrictEqual(lines[1][4], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[1][5], {
            value: ',',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'punctuation.separator.list.comma.css']
          });
          assert.deepStrictEqual(lines[1][7], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[1][8], {
            value: ' Comment ',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[1][9], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[2][1], {
            value: 'domain',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'support.function.document-rule.css']
          });
          assert.deepStrictEqual(lines[2][2], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[2][3], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[2][4], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[2][5], {
            value: 'mozilla.org',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'variable.parameter.document-rule.css']
          });
          assert.deepStrictEqual(lines[2][6], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[2][7], {
            value: ',',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'punctuation.separator.list.comma.css']
          });
          assert.deepStrictEqual(lines[3][1], {
            value: 'regexp',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'support.function.document-rule.css']
          });
          assert.deepStrictEqual(lines[3][2], {
            value: '(',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[3][3], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(lines[3][4], {
            value: 'https:.*',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(lines[3][5], {
            value: '"',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(lines[3][6], {
            value: ')',
            scopes: ['source.css', 'meta.at-rule.document.header.css', 'meta.function.document-rule.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[3][8], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.document.body.css', 'punctuation.section.document.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[4][1], {
            value: 'body',
            scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(lines[4][2], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[4][4], {
            value: 'color',
            scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[4][5], {
            value: ':',
            scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[4][7], {
            value: '#',
            scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css']
          });
          assert.deepStrictEqual(lines[4][8], {
            value: 'f00',
            scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.color.rgb-value.hex.css']
          });
          assert.deepStrictEqual(lines[4][9], {
            value: ';',
            scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[4][11], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.document.body.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[5][1], {
            value: '}',
            scopes: ['source.css', 'meta.at-rule.document.body.css', 'punctuation.section.document.end.bracket.curly.css']
          });
        });
      });
      describe('@viewport', function () {
        it('tokenises @viewport blocks correctly', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('@viewport { min-width: 640px; max-width: 800px; }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.viewport.css', 'keyword.control.at-rule.viewport.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'viewport',
            scopes: ['source.css', 'meta.at-rule.viewport.css', 'keyword.control.at-rule.viewport.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: ' ',
            scopes: ['source.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'min-width',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: ':',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '640',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: 'px',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: ';',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: 'max-width',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(tokens[13], {
            value: ':',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[15], {
            value: '800',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[16], {
            value: 'px',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
          });
          assert.deepStrictEqual(tokens[17], {
            value: ';',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(tokens[19], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });
        it('tokenises them across lines', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@-O-VIEWPORT\n{\n  zoom: 0.75;\n  min-zoom: 0.5;\n  max-zoom: 0.9;\n}");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.viewport.css', 'keyword.control.at-rule.viewport.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: '-O-VIEWPORT',
            scopes: ['source.css', 'meta.at-rule.viewport.css', 'keyword.control.at-rule.viewport.css']
          });
          assert.deepStrictEqual(lines[1][0], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[2][1], {
            value: 'zoom',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[2][2], {
            value: ':',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[2][4], {
            value: '0.75',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[2][5], {
            value: ';',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[3][1], {
            value: 'min-zoom',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[3][2], {
            value: ':',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[3][4], {
            value: '0.5',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[3][5], {
            value: ';',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[4][1], {
            value: 'max-zoom',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[4][2], {
            value: ':',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[4][4], {
            value: '0.9',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(lines[4][5], {
            value: ';',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[5][0], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });
        
        it('tokenises injected comments', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@-ms-viewport/*{*/{/*\n==*/orientation: landscape;\n}");
          assert.deepStrictEqual(lines[0][0], {
            value: '@',
            scopes: ['source.css', 'meta.at-rule.viewport.css', 'keyword.control.at-rule.viewport.css', 'punctuation.definition.keyword.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: '-ms-viewport',
            scopes: ['source.css', 'meta.at-rule.viewport.css', 'keyword.control.at-rule.viewport.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: '/*',
            scopes: ['source.css', 'meta.at-rule.viewport.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: '{',
            scopes: ['source.css', 'meta.at-rule.viewport.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: '*/',
            scopes: ['source.css', 'meta.at-rule.viewport.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(lines[0][6], {
            value: '/*',
            scopes: ['source.css', 'meta.property-list.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[1][0], {
            value: '==',
            scopes: ['source.css', 'meta.property-list.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: '*/',
            scopes: ['source.css', 'meta.property-list.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[1][2], {
            value: 'orientation',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(lines[1][3], {
            value: ':',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(lines[1][5], {
            value: 'landscape',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
          });
          assert.deepStrictEqual(lines[1][6], {
            value: ';',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(lines[2][0], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });
      });
      describe('unknown at-rules', function () {
        it('correctly parses single-line unknown at-rules closing with semicolons', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@foo;\n@foo ;\n@foo a;\n@foo ();\n@foo (a);");
          assert.deepStrictEqual(lines[0][1], {
            value: 'foo',
            scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: 'foo',
            scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css']
          });
          assert.deepStrictEqual(lines[2][1], {
            value: 'foo',
            scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css']
          });
          assert.deepStrictEqual(lines[2][2], {
            value: ' a',
            scopes: ['source.css', 'meta.at-rule.header.css']
          });
          assert.deepStrictEqual(lines[3][1], {
            value: 'foo',
            scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css']
          });
          assert.deepStrictEqual(lines[3][2], {
            value: ' ()',
            scopes: ['source.css', 'meta.at-rule.header.css']
          });
          assert.deepStrictEqual(lines[4][1], {
            value: 'foo',
            scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css']
          });
          assert.deepStrictEqual(lines[4][2], {
            value: ' (a)',
            scopes: ['source.css', 'meta.at-rule.header.css']
          });
        });
        
        it('correctly parses single-line unknown at-rules closing with ;', function () {
          var lines;
          lines = testGrammar.tokenizeLines("@foo bar;\n.foo");
          assert.deepStrictEqual(lines[0][1], {
            value: 'foo',
            scopes: ['source.css', 'meta.at-rule.header.css', 'keyword.control.at-rule.css']
          });
          assert.deepStrictEqual(lines[1][0], {
            value: '.',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: 'foo',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
          });
        });
      });
    });

    describe('capitalisation', function () {
      it('ignores case in at-rules', function () {
        var lines;
        lines = testGrammar.tokenizeLines("@IMPoRT url(\"file.css\");\n@MEdIA (MAX-WIDTH: 2px){ }\n@pAgE :fIRST { }\n@NAMEspace \"A\";\n@foNT-FacE {}");
        assert.deepStrictEqual(lines[0][1], {
          value: 'IMPoRT',
          scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css']
        });
        assert.deepStrictEqual(lines[1][1], {
          value: 'MEdIA',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
        });
        assert.deepStrictEqual(lines[1][4], {
          value: 'MAX-WIDTH',
          scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css']
        });
        assert.deepStrictEqual(lines[2][1], {
          value: 'pAgE',
          scopes: ['source.css', 'meta.at-rule.page.css', 'keyword.control.at-rule.page.css']
        });
        assert.deepStrictEqual(lines[2][4], {
          value: 'fIRST',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
        });
        assert.deepStrictEqual(lines[3][1], {
          value: 'NAMEspace',
          scopes: ['source.css', 'meta.at-rule.namespace.css', 'keyword.control.at-rule.namespace.css']
        });
        assert.deepStrictEqual(lines[4][1], {
          value: 'foNT-FacE',
          scopes: ['source.css', 'meta.at-rule.font-face.css', 'keyword.control.at-rule.font-face.css']
        });
      });

      it('ignores case in property names', function () {
        var lines;
        lines = testGrammar.tokenizeLines("a{ COLOR: #fff; }\na{ gRId-tEMPLaTe: none; }\na{ bACkgrOUND-iMAGE: none; }\na{ -MOZ-IMAGE: none; }");
        assert.deepStrictEqual(lines[0][3], {
          value: 'COLOR',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
        });
        assert.deepStrictEqual(lines[1][3], {
          value: 'gRId-tEMPLaTe',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
        });
        assert.deepStrictEqual(lines[2][3], {
          value: 'bACkgrOUND-iMAGE',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
        });
        assert.deepStrictEqual(lines[3][3], {
          value: '-MOZ-IMAGE',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.vendored.property-name.css']
        });
      });

      it('ignores case in property keywords', function () {
        var lines;
        lines = testGrammar.tokenizeLines("a{ color: INItIaL; }\na{ color: trAnsPAREnT; }\na{ color: rED; }\na{ color: unSET; }\na{ color: NONe; }\na{ style: lOWER-lATIN; }\na{ color: -WebkIT-foo; }\na{ font: HelVETica; }");
        assert.deepStrictEqual(lines[0][6], {
          value: 'INItIaL',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
        });
        assert.deepStrictEqual(lines[1][6], {
          value: 'trAnsPAREnT',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
        });
        assert.deepStrictEqual(lines[2][6], {
          value: 'rED',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css']
        });
        assert.deepStrictEqual(lines[3][6], {
          value: 'unSET',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
        });
        assert.deepStrictEqual(lines[4][6], {
          value: 'NONe',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
        });
        assert.deepStrictEqual(lines[5][6], {
          value: 'lOWER-lATIN',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.list-style-type.css']
        });
        assert.deepStrictEqual(lines[6][6], {
          value: '-WebkIT-foo',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.vendored.property-value.css']
        });
        assert.deepStrictEqual(lines[7][6], {
          value: 'HelVETica',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.font-name.css']
        });
      });

      it('ignores case in selectors', function () {
        var lines;
        lines = testGrammar.tokenizeLines("DIV:HOVER { }\n#id::BefORE { }\n#id::aFTEr { }\nTABle:nTH-cHILD(2N+1) {}\nhtML:NOT(.htiml) {}\nI::BACKDROP\nI::-mOZ-thing {}");
        assert.deepStrictEqual(lines[0][0], {
          value: 'DIV',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
        });
        assert.deepStrictEqual(lines[0][2], {
          value: 'HOVER',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
        });
        assert.deepStrictEqual(lines[1][3], {
          value: 'BefORE',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
        });
        assert.deepStrictEqual(lines[2][3], {
          value: 'aFTEr',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
        });
        assert.deepStrictEqual(lines[3][0], {
          value: 'TABle',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
        });
        assert.deepStrictEqual(lines[3][2], {
          value: 'nTH-cHILD',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
        });
        assert.deepStrictEqual(lines[3][4], {
          value: '2N+1',
          scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[4][0], {
          value: 'htML',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
        });
        assert.deepStrictEqual(lines[4][2], {
          value: 'NOT',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
        });
        assert.deepStrictEqual(lines[5][0], {
          value: 'I',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
        });
        assert.deepStrictEqual(lines[5][2], {
          value: 'BACKDROP',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
        });
        assert.deepStrictEqual(lines[6][2], {
          value: '-mOZ-thing',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
        });
      });

      it('ignores case in function names', function () {
        var lines;
        lines = testGrammar.tokenizeLines("a{ color: RGBa(); }\na{ color: hslA(); }\na{ color: URL(); }\na{ content: ATTr(); }\na{ content: CoUNTer(); }\na{ content: cuBIC-beZIER()}\na{ content: sTePs()}\na{ content: cALc(2 + 2)}");
        assert.deepStrictEqual(lines[0][6], {
          value: 'RGBa',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css']
        });
        assert.deepStrictEqual(lines[1][6], {
          value: 'hslA',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css']
        });
        assert.deepStrictEqual(lines[2][6], {
          value: 'URL',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.url.css', 'support.function.url.css']
        });
        assert.deepStrictEqual(lines[3][6], {
          value: 'ATTr',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css']
        });
        assert.deepStrictEqual(lines[4][6], {
          value: 'CoUNTer',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css']
        });
        assert.deepStrictEqual(lines[5][6], {
          value: 'cuBIC-beZIER',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'support.function.timing-function.css']
        });
        assert.deepStrictEqual(lines[6][6], {
          value: 'sTePs',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'support.function.timing-function.css']
        });
        assert.deepStrictEqual(lines[7][6], {
          value: 'cALc',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'support.function.calc.css']
        });
      });
      
      it('ignores case in unit names', function () {
        var lines;
        lines = testGrammar.tokenizeLines("a{width: 20EM; }\na{width: 20ReM; }\na{width: 8tURN; }\na{width: 20S; }\na{width: 20CM}\na{width: 2gRAd}");
        assert.deepStrictEqual(lines[0][5], {
          value: '20',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[0][6], {
          value: 'EM',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
        });
        assert.deepStrictEqual(lines[1][6], {
          value: 'ReM',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.rem.css']
        });
        assert.deepStrictEqual(lines[2][2], {
          value: 'width',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
        });
        assert.deepStrictEqual(lines[2][6], {
          value: 'tURN',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.turn.css']
        });
        assert.deepStrictEqual(lines[3][6], {
          value: 'S',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.s.css']
        });
        assert.deepStrictEqual(lines[4][5], {
          value: '20',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[4][6], {
          value: 'CM',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.cm.css']
        });
        assert.deepStrictEqual(lines[5][6], {
          value: 'gRAd',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.grad.css']
        });
      });
    });

    describe('pseudo-classes', function () {
      it('tokenizes regular pseudo-classes', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('p:first-child').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'p',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: ':',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: 'first-child',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
        });
      });

      it("doesn't tokenise pseudo-classes if followed by a semicolon or closed bracket", function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('p{ left:left }').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'p',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: 'left',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: ':',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
        });
        assert.deepStrictEqual(tokens[5], {
          value: 'left',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
        });
        assert.deepStrictEqual(tokens[7], {
          value: '}',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
        });
      });
      describe(':dir()', function () {
        it('tokenises :dir() and its keywords', function () {
          var lines;
          lines = testGrammar.tokenizeLines("a:dir(ltr ){ }\n*:dir( rtl){ }");
          assert.deepStrictEqual(lines[0][0], {
            value: 'a',
            scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: ':',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: 'dir',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: '(',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: 'ltr',
            scopes: ['source.css', 'meta.selector.css', 'support.constant.text-direction.css']
          });
          assert.deepStrictEqual(lines[0][5], {
            value: ' ',
            scopes: ['source.css', 'meta.selector.css']
          });
          assert.deepStrictEqual(lines[0][6], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(lines[1][0], {
            value: '*',
            scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.wildcard.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: ':',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(lines[1][2], {
            value: 'dir',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(lines[1][3], {
            value: '(',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[1][4], {
            value: ' ',
            scopes: ['source.css', 'meta.selector.css']
          });
          assert.deepStrictEqual(lines[1][5], {
            value: 'rtl',
            scopes: ['source.css', 'meta.selector.css', 'support.constant.text-direction.css']
          });
          assert.deepStrictEqual(lines[1][6], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
        });
        
        it('allows :dir() to include comments and newlines', function () {
          var lines;
          lines = testGrammar.tokenizeLines(":DIR(/**\n==*/ltr/*\n*/)");
          assert.deepStrictEqual(lines[0][0], {
            value: ':',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(lines[0][1], {
            value: 'DIR',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(lines[0][2], {
            value: '(',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(lines[0][3], {
            value: '/*',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[0][4], {
            value: '*',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[1][0], {
            value: '==',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css']
          });
          assert.deepStrictEqual(lines[1][1], {
            value: '*/',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[1][2], {
            value: 'ltr',
            scopes: ['source.css', 'meta.selector.css', 'support.constant.text-direction.css']
          });
          assert.deepStrictEqual(lines[1][3], {
            value: '/*',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(lines[2][0], {
            value: '*/',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(lines[2][1], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
        });
      });
      describe(':lang()', function () {
        it('tokenizes :lang()', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine(':lang(zh-Hans-CN,es-419)').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: ':',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: 'lang',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: '(',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'zh-Hans-CN',
            scopes: ['source.css', 'meta.selector.css', 'support.constant.language-range.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: ',',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.list.comma.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'es-419',
            scopes: ['source.css', 'meta.selector.css', 'support.constant.language-range.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
        });
        it('does not tokenize unquoted language ranges containing asterisks', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine(':lang(zh-*-CN)').tokens;
          assert.deepStrictEqual(tokens[3], {
            value: 'zh-*-CN',
            scopes: ['source.css', 'meta.selector.css']
          });
        });
        
        it('tokenizes language ranges containing asterisks quoted as strings', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine(':lang("zh-*-CN",\'*-ab-\')').tokens;
          assert.deepStrictEqual(tokens[3], {
            value: '"',
            scopes: ['source.css', 'meta.selector.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: 'zh-*-CN',
            scopes: ['source.css', 'meta.selector.css', 'string.quoted.double.css', 'support.constant.language-range.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '"',
            scopes: ['source.css', 'meta.selector.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: ',',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.separator.list.comma.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: "'",
            scopes: ['source.css', 'meta.selector.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '*-ab-',
            scopes: ['source.css', 'meta.selector.css', 'string.quoted.single.css', 'support.constant.language-range.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: "'",
            scopes: ['source.css', 'meta.selector.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css']
          });
        });
      });
      describe(':not()', function () {
        it('tokenises other selectors inside :not()', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('*:not(.class-name):not(div) {}').tokens;
          assert.deepStrictEqual(tokens[1], {
            value: ':',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: 'not',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '(',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '.',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'class-name',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: ':',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: 'not',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: '(',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: 'div',
            scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
        });
        
        it('tokenises injected comments', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('*:not(/*(*/.class-name/*)*/):not(/*b*/) {}').tokens;
          assert.deepStrictEqual(tokens[2], {
            value: 'not',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: '(',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: '/*',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '(',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: '*/',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '.',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: 'class-name',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: '/*',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: '*/',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[13], {
            value: ':',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(tokens[14], {
            value: 'not',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(tokens[15], {
            value: '(',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[16], {
            value: '/*',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
          });
          assert.deepStrictEqual(tokens[17], {
            value: 'b',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css']
          });
          assert.deepStrictEqual(tokens[18], {
            value: '*/',
            scopes: ['source.css', 'meta.selector.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
          });
          assert.deepStrictEqual(tokens[19], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
        });
      });
      describe(':nth-*()', function () {
        it('tokenizes :nth-child()', function () {
          var tokens;
          tokens = testGrammar.tokenizeLines(':nth-child(2n+1)\n:nth-child(2n -1)\n:nth-child(-2n+ 1)\n:nth-child(-2n - 1)\n:nth-child(odd)\n:nth-child(even)\n:nth-child(  odd   )\n:nth-child(  even  )');
          assert.deepStrictEqual(tokens[0][0], {
            value: ':',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(tokens[0][1], {
            value: 'nth-child',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(tokens[0][2], {
            value: '(',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[0][3], {
            value: '2n+1',
            scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[0][4], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[1][3], {
            value: '2n -1',
            scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[2][3], {
            value: '-2n+ 1',
            scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[3][3], {
            value: '-2n - 1',
            scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[4][3], {
            value: 'odd',
            scopes: ['source.css', 'meta.selector.css', 'support.constant.parity.css']
          });
          assert.deepStrictEqual(tokens[5][3], {
            value: 'even',
            scopes: ['source.css', 'meta.selector.css', 'support.constant.parity.css']
          });
          assert.deepStrictEqual(tokens[6][3], {
            value: '  ',
            scopes: ['source.css', 'meta.selector.css']
          });
          assert.deepStrictEqual(tokens[6][4], {
            value: 'odd',
            scopes: ['source.css', 'meta.selector.css', 'support.constant.parity.css']
          });
          assert.deepStrictEqual(tokens[7][4], {
            value: 'even',
            scopes: ['source.css', 'meta.selector.css', 'support.constant.parity.css']
          });
          assert.deepStrictEqual(tokens[7][5], {
            value: '  ',
            scopes: ['source.css', 'meta.selector.css']
          });
        });
        it('tokenizes :nth-last-child()', function () {
          var tokens;
          tokens = testGrammar.tokenizeLines(':nth-last-child(2n)\n:nth-last-child( -2n)\n:nth-last-child( 2n )\n:nth-last-child(even)');
          assert.deepStrictEqual(tokens[0][0], {
            value: ':',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(tokens[0][1], {
            value: 'nth-last-child',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(tokens[0][2], {
            value: '(',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[0][3], {
            value: '2n',
            scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[0][4], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[1][4], {
            value: '-2n',
            scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[2][4], {
            value: '2n',
            scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[2][6], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[3][3], {
            value: 'even',
            scopes: ['source.css', 'meta.selector.css', 'support.constant.parity.css']
          });
        });
        it('tokenizes :nth-of-type()', function () {
          var tokens;
          tokens = testGrammar.tokenizeLines('img:nth-of-type(+n+1)\nimg:nth-of-type(-n+1)\nimg:nth-of-type(n+1)');
          assert.deepStrictEqual(tokens[0][1], {
            value: ':',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(tokens[0][2], {
            value: 'nth-of-type',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(tokens[0][3], {
            value: '(',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[0][4], {
            value: '+n+1',
            scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[0][5], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[1][4], {
            value: '-n+1',
            scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[2][4], {
            value: 'n+1',
            scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
          });
        });
        
        it('tokenizes ::nth-last-of-type()', function () {
          var tokens;
          tokens = testGrammar.tokenizeLines('h1:nth-last-of-type(-1)\nh1:nth-last-of-type(+2)\nh1:nth-last-of-type(3)');
          assert.deepStrictEqual(tokens[0][1], {
            value: ':',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
          });
          assert.deepStrictEqual(tokens[0][2], {
            value: 'nth-last-of-type',
            scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
          });
          assert.deepStrictEqual(tokens[0][3], {
            value: '(',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.begin.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[0][4], {
            value: '-1',
            scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[0][5], {
            value: ')',
            scopes: ['source.css', 'meta.selector.css', 'punctuation.section.function.end.bracket.round.css']
          });
          assert.deepStrictEqual(tokens[1][4], {
            value: '+2',
            scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[2][4], {
            value: '3',
            scopes: ['source.css', 'meta.selector.css', 'constant.numeric.css']
          });
        });
      });
    });

    describe('pseudo-elements', function () {
      it('tokenizes both : and :: notations for pseudo-elements introduced in CSS 1 and 2', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('.opening:first-letter').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'opening',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: ':',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: 'first-letter',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
        });
        tokens = testGrammar.tokenizeLine('q::after').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'q',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '::',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: 'after',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
        });
      });

      it('tokenizes both : and :: notations for vendor-prefixed pseudo-elements', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine(':-ms-input-placeholder').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: ':',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '-ms-input-placeholder',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
        });
        tokens = testGrammar.tokenizeLine('::-webkit-input-placeholder').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '::',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '-webkit-input-placeholder',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
        });
      });
      
      it('only tokenizes the :: notation for other pseudo-elements', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('::selection').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: '::',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: 'selection',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
        });
        tokens = testGrammar.tokenizeLine(':selection').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: ':selection',
          scopes: ['source.css', 'meta.selector.css']
        });
      });
    });
    describe('compound selectors', function () {
      it('tokenizes the combination of type selectors followed by class selectors', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('very-custom.class').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'very-custom',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '.',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: 'class',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.class.css']
        });
      });

      it('tokenizes the combination of type selectors followed by pseudo-classes', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('very-custom:hover').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'very-custom',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: ':',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: 'hover',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-class.css']
        });
      });
      
      it('tokenizes the combination of type selectors followed by pseudo-elements', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('very-custom::shadow').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'very-custom',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '::',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css', 'punctuation.definition.entity.css']
        });
        assert.deepStrictEqual(tokens[2], {
          value: 'shadow',
          scopes: ['source.css', 'meta.selector.css', 'entity.other.attribute-name.pseudo-element.css']
        });
      });
    });
  });

  describe('property lists (declaration blocks)', function () {
    it('tokenizes inline property lists', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('div { font-size: inherit; }').tokens;
      assert.deepStrictEqual(tokens[4], {
        value: 'font-size',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(tokens[5], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: 'inherit',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: ';',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
      });
      assert.deepStrictEqual(tokens[10], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
    });

    it('tokenizes compact inline property lists', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('div{color:inherit;float:left}').tokens;
      assert.deepStrictEqual(tokens[2], {
        value: 'color',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(tokens[3], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[4], {
        value: 'inherit',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
      });
      assert.deepStrictEqual(tokens[5], {
        value: ';',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: 'float',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: 'left',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
      });
      assert.deepStrictEqual(tokens[9], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
    });

    it('tokenizes multiple inline property lists', function () {
      var tokens;
      tokens = testGrammar.tokenizeLines('very-custom { color: inherit }\nanother-one  {  display  :  none  ;  }');
      assert.deepStrictEqual(tokens[0][0], {
        value: 'very-custom',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css']
      });
      assert.deepStrictEqual(tokens[0][4], {
        value: 'color',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(tokens[0][5], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[0][7], {
        value: 'inherit',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
      });
      assert.deepStrictEqual(tokens[0][8], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[0][9], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
      assert.deepStrictEqual(tokens[1][0], {
        value: 'another-one',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css']
      });
      assert.deepStrictEqual(tokens[1][4], {
        value: 'display',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(tokens[1][5], {
        value: '  ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[1][6], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[1][8], {
        value: 'none',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
      });
      assert.deepStrictEqual(tokens[1][9], {
        value: '  ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[1][10], {
        value: ';',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
      });
      assert.deepStrictEqual(tokens[1][12], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
    });

    it('tokenizes custom properties', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine(':root { --white: #FFF; }').tokens;
      assert.deepStrictEqual(tokens[5], {
        value: '--white',
        scopes: ['source.css', 'meta.property-list.css', 'variable.css']
      });
    });

    it('tokenises commas between property values', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('a{ text-shadow: a, b; }').tokens;
      assert.deepStrictEqual(tokens[7], {
        value: ',',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.separator.list.comma.css']
      });
    });

    it('tokenises superfluous semicolons', function () {
      var i, j, lines;
      lines = testGrammar.tokenizeLines('.test{   width:  20em;;;;;;;;;\n;;;;;;;;;height: 10em; }');
      for (i = j = 0; j <= 8; i = ++j) {
        assert.deepStrictEqual(lines[0][i + 9], {
          value: ';',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
        });
        assert.deepStrictEqual(lines[1][i], {
          value: ';',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
        });
      }
      assert.deepStrictEqual(lines[1][9], {
        value: 'height',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
    });
    describe('values', function () {
      it('tokenizes color keywords', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('#jon { color: snow; }').tokens;
        assert.deepStrictEqual(tokens[8], {
          value: 'snow',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.color.w3c-extended-color-name.css']
        });
      });

      it('tokenises RGBA values in hex notation', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('p{ color: #f030; }').tokens;
        assert.deepStrictEqual(tokens[6], {
          value: '#',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css']
        });
        assert.deepStrictEqual(tokens[7], {
          value: 'f030',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.color.rgb-value.hex.css']
        });
        assert.deepStrictEqual(tokens[8], {
          value: ';',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
        });
        assert.deepStrictEqual(tokens[10], {
          value: '}',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
        });
        tokens = testGrammar.tokenizeLine('a{ color: #CAFEBABE; }').tokens;
        assert.deepStrictEqual(tokens[0], {
          value: 'a',
          scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
        });
        assert.deepStrictEqual(tokens[1], {
          value: '{',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
        });
        assert.deepStrictEqual(tokens[3], {
          value: 'color',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
        });
        assert.deepStrictEqual(tokens[4], {
          value: ':',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
        });
        assert.deepStrictEqual(tokens[6], {
          value: '#',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css']
        });
        assert.deepStrictEqual(tokens[7], {
          value: 'CAFEBABE',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.color.rgb-value.hex.css']
        });
        assert.deepStrictEqual(tokens[8], {
          value: ';',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
        });
        assert.deepStrictEqual(tokens[10], {
          value: '}',
          scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
        });
        tokens = testGrammar.tokenizeLine('a{ color: #CAFEBABEF; }').tokens;
        assert.deepStrictEqual(tokens[6], {
          value: '#CAFEBABEF',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
        });
      });

      it('tokenizes common font names', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('p { font-family: Verdana, Helvetica, sans-serif; }').tokens;
        assert.deepStrictEqual(tokens[7], {
          value: 'Verdana',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.font-name.css']
        });
        assert.deepStrictEqual(tokens[10], {
          value: 'Helvetica',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.font-name.css']
        });
        assert.deepStrictEqual(tokens[13], {
          value: 'sans-serif',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.font-name.css']
        });
      });

      it('tokenizes predefined list style types', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('ol.myth { list-style-type: cjk-earthly-branch }').tokens;
        assert.deepStrictEqual(tokens[9], {
          value: 'cjk-earthly-branch',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.list-style-type.css']
        });
      });

      it('tokenizes numeric values', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('div { font-size: 14px; }').tokens;
        assert.deepStrictEqual(tokens[7], {
          value: '14',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(tokens[8], {
          value: 'px',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
        });
      });

      it('does not tokenize invalid numeric values', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('div { font-size: test14px; }').tokens;
        assert.deepStrictEqual(tokens[7], {
          value: 'test14px',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
        });
        tokens = testGrammar.tokenizeLine('div { font-size: test-14px; }').tokens;
        assert.deepStrictEqual(tokens[7], {
          value: 'test-14px',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
        });
      });

      it('tokenizes vendor-prefixed values', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('.edge { cursor: -webkit-zoom-in; }').tokens;
        assert.deepStrictEqual(tokens[8], {
          value: '-webkit-zoom-in',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.vendored.property-value.css']
        });
        tokens = testGrammar.tokenizeLine('.edge { width: -moz-min-content; }').tokens;
        assert.deepStrictEqual(tokens[8], {
          value: '-moz-min-content',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.vendored.property-value.css']
        });
        tokens = testGrammar.tokenizeLine('.edge { display: -ms-grid; }').tokens;
        assert.deepStrictEqual(tokens[8], {
          value: '-ms-grid',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.vendored.property-value.css']
        });
      });

      it('tokenizes custom variables', function () {
        var tokens;
        tokens = testGrammar.tokenizeLine('div { color: var(--primary-color) }').tokens;
        assert.deepStrictEqual(tokens[9], {
          value: '--primary-color',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'variable.argument.css']
        });
      });

      it('tokenises numeric values correctly', function () {
        var lines;
        lines = testGrammar.tokenizeLines(".a   { a:       12em  }\n.a   { a:     4.01ex  }\n.a   { a:   -456.8ch  }\n.a   { a:      0.0REM }\n.a   { a:     +0.0vh  }\n.a   { a:     -0.0vw  }\n.a   { a:       .6px  }\n.a   { a:     10e3mm  }\n.a   { a:     10E3cm  }\n.a   { a:  -3.4e+2In  }\n.a   { a:  -3.4e-2ch  }\n.a   { a:    +.5E-2%  }\n.a   { a:   -3.4e-2%  }");
        assert.deepStrictEqual(lines[0][8], {
          value: '12',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[0][9], {
          value: 'em',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
        });
        assert.deepStrictEqual(lines[1][8], {
          value: '4.01',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[1][9], {
          value: 'ex',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.ex.css']
        });
        assert.deepStrictEqual(lines[2][8], {
          value: '-456.8',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[2][9], {
          value: 'ch',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.ch.css']
        });
        assert.deepStrictEqual(lines[3][8], {
          value: '0.0',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[3][9], {
          value: 'REM',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.rem.css']
        });
        assert.deepStrictEqual(lines[4][8], {
          value: '+0.0',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[4][9], {
          value: 'vh',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.vh.css']
        });
        assert.deepStrictEqual(lines[5][8], {
          value: '-0.0',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[5][9], {
          value: 'vw',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.vw.css']
        });
        assert.deepStrictEqual(lines[6][8], {
          value: '.6',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[6][9], {
          value: 'px',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
        });
        assert.deepStrictEqual(lines[7][8], {
          value: '10e3',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[7][9], {
          value: 'mm',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.mm.css']
        });
        assert.deepStrictEqual(lines[8][8], {
          value: '10E3',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[8][9], {
          value: 'cm',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.cm.css']
        });
        assert.deepStrictEqual(lines[9][8], {
          value: '-3.4e+2',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[9][9], {
          value: 'In',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.in.css']
        });
        assert.deepStrictEqual(lines[10][8], {
          value: '-3.4e-2',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[10][9], {
          value: 'ch',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.ch.css']
        });
        assert.deepStrictEqual(lines[11][8], {
          value: '+.5E-2',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[11][9], {
          value: '%',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
        });
        assert.deepStrictEqual(lines[12][8], {
          value: '-3.4e-2',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
        });
        assert.deepStrictEqual(lines[12][9], {
          value: '%',
          scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
        });
      });
      describe('functional notation', function () {
        describe('attr()', function () {
          it('tokenises parameters correctly and case-insensitively', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('a{content:aTTr(data-width px, inherit)}').tokens;
            assert.deepStrictEqual(tokens[4], {
              value: 'aTTr',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[6], {
              value: 'data-width',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css']
            });
            assert.deepStrictEqual(tokens[8], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: 'inherit',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.constant.property-value.css']
            });
            assert.deepStrictEqual(tokens[12], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: '}',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
            });
          });
          
          it('matches variables', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('a{content:ATTR(VAR(--name) px, "N/A")}').tokens;
            assert.deepStrictEqual(tokens[4], {
              value: 'ATTR',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[6], {
              value: 'VAR',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'meta.function.variable.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[7], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[8], {
              value: '--name',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'meta.function.variable.css', 'variable.argument.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css']
            });
            assert.deepStrictEqual(tokens[12], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[14], {
              value: '"',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
            });
            assert.deepStrictEqual(tokens[15], {
              value: 'N/A',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css']
            });
            assert.deepStrictEqual(tokens[16], {
              value: '"',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
            });
            assert.deepStrictEqual(tokens[17], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css']
            });
          });
        });
        describe('calc()', function () {
          it('tokenises calculations', function () {
            var lines;
            lines = testGrammar.tokenizeLines("a{\n  width: calc(3px + -1em);\n  width: calc(3px - -1em);\n  width: calc(3px * 2);\n  width: calc(3px / 2);\n}");
            assert.deepStrictEqual(lines[1][4], {
              value: 'calc',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'support.function.calc.css']
            });
            assert.deepStrictEqual(lines[1][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[1][6], {
              value: '3',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[1][7], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
            });
            assert.deepStrictEqual(lines[1][9], {
              value: '+',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css']
            });
            assert.deepStrictEqual(lines[1][11], {
              value: '-1',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[1][12], {
              value: 'em',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
            });
            assert.deepStrictEqual(lines[1][13], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][9], {
              value: '-',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css']
            });
            assert.deepStrictEqual(lines[2][11], {
              value: '-1',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[2][12], {
              value: 'em',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
            });
            assert.deepStrictEqual(lines[3][7], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
            });
            assert.deepStrictEqual(lines[3][9], {
              value: '*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css']
            });
            assert.deepStrictEqual(lines[4][7], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
            });
            assert.deepStrictEqual(lines[4][9], {
              value: '/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css']
            });
            assert.deepStrictEqual(lines[4][11], {
              value: '2',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css']
            });
          });
          it('requires whitespace around + and - operators', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('a{ width: calc(3px+1em); }').tokens;
            assert.deepStrictEqual(tokens[9], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: '+',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: '1',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[12], {
              value: 'em',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
            });
            tokens = testGrammar.tokenizeLine('a{ width: calc(3px--1em); height: calc(10-1em);}').tokens;
            assert.deepStrictEqual(tokens[9], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: '--1em',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css']
            });
            assert.deepStrictEqual(tokens[19], {
              value: '10',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[20], {
              value: '-1em',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css']
            });
          });
          it('does not require whitespace around * and / operators', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('a{ width: calc(3px*2); }').tokens;
            assert.deepStrictEqual(tokens[9], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: '*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: '2',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css']
            });
            tokens = testGrammar.tokenizeLine('a{ width: calc(3px/2); }').tokens;
            assert.deepStrictEqual(tokens[9], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: '/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: '2',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css']
            });
          });
          
          it('matches variable expansions inside calculations', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('.foo { margin-top: calc(var(--gap) + 1px); }').tokens;
            assert.deepStrictEqual(tokens[8], {
              value: 'calc',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'support.function.calc.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: 'var',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'meta.function.variable.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[12], {
              value: '--gap',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'meta.function.variable.css', 'variable.argument.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[15], {
              value: '+',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'keyword.operator.arithmetic.css']
            });
            assert.deepStrictEqual(tokens[17], {
              value: '1',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[18], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
            });
            assert.deepStrictEqual(tokens[19], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.calc.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[20], {
              value: ';',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
            });
            assert.deepStrictEqual(tokens[22], {
              value: '}',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
            });
          });
        });
        describe('colours', function () {
          it('tokenises colour functions correctly', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('a{ color: rgb(187,255,221); }').tokens;
            assert.deepStrictEqual(tokens[6], {
              value: 'rgb',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[7], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[8], {
              value: '187',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: '255',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[12], {
              value: '221',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css']
            });
            tokens = testGrammar.tokenizeLine('a{ color: RGBa( 100%, 0% ,20.17% ,.5 ); }').tokens;
            assert.deepStrictEqual(tokens[6], {
              value: 'RGBa',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[7], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: '100',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: '%',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: '0',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[14], {
              value: '%',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
            });
            assert.deepStrictEqual(tokens[16], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[17], {
              value: '20.17',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[18], {
              value: '%',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
            });
            assert.deepStrictEqual(tokens[20], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[21], {
              value: '.5',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[23], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css']
            });
            tokens = testGrammar.tokenizeLine('a{color:HSL(0,  00100%,50%)}').tokens;
            assert.deepStrictEqual(tokens[4], {
              value: 'HSL',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[6], {
              value: '0',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[7], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: '00100',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: '%',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[12], {
              value: '50',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: '%',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
            });
            assert.deepStrictEqual(tokens[14], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css']
            });
            tokens = testGrammar.tokenizeLine('a{color:HSLa(2,.0%,1%,.7)}').tokens;
            assert.deepStrictEqual(tokens[4], {
              value: 'HSLa',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[6], {
              value: '2',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[7], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[8], {
              value: '.0',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: '%',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: '1',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[12], {
              value: '%',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[14], {
              value: '.7',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[15], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css']
            });
          });
          it('matches variables as colour components', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('a{ color: RGBA(var(--red), 0% , 20%, .2)}').tokens;
            assert.deepStrictEqual(tokens[7], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[8], {
              value: 'var',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: '--red',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'variable.argument.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[12], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
          });
          it('matches comments between colour components', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('a{ color: rgba(/**/255/*=*/,0,/*2.2%*/51/*,*/0.2)}').tokens;
            assert.deepStrictEqual(tokens[8], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: '255',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(tokens[12], {
              value: '=',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(tokens[14], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[16], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[17], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(tokens[19], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(tokens[20], {
              value: '51',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[21], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(tokens[22], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css']
            });
            assert.deepStrictEqual(tokens[23], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(tokens[24], {
              value: '0.2',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'constant.numeric.css']
            });
          });
          
          it('allows colour components to be split across lines', function () {
            var lines;
            lines = testGrammar.tokenizeLines(".frost{\n  background-color: rgba(\n    var(--red),    /* Red */\n    var(--green),  /* Green */\n    var(--blue),   /* Blue */\n    /* var(--test),\n    /**/var(--opacity) /* Transparency */\n  );\n}");
            assert.deepStrictEqual(lines[1][4], {
              value: 'rgba',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[1][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][1], {
              value: 'var',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[2][2], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][3], {
              value: '--red',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'variable.argument.css']
            });
            assert.deepStrictEqual(lines[2][4], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][8], {
              value: ' Red ',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[3][1], {
              value: 'var',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[3][3], {
              value: '--green',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'variable.argument.css']
            });
            assert.deepStrictEqual(lines[3][5], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[3][8], {
              value: ' Green ',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[4][1], {
              value: 'var',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[4][2], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[4][3], {
              value: '--blue',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'variable.argument.css']
            });
            assert.deepStrictEqual(lines[4][4], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[4][5], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[4][8], {
              value: ' Blue ',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[4][9], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(lines[5][1], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(lines[5][2], {
              value: ' var(--test),',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[6][0], {
              value: '    /*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[6][1], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(lines[6][2], {
              value: 'var',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[6][3], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[6][4], {
              value: '--opacity',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'variable.argument.css']
            });
            assert.deepStrictEqual(lines[6][5], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[6][7], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(lines[6][8], {
              value: ' Transparency ',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[6][9], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(lines[7][1], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css']
            });
          });
        });
        describe('gradients', function () {
          it('tokenises linear gradients', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('a{ background-image: linear-gradient( 45deg, blue, red ); }').tokens;
            assert.deepStrictEqual(tokens[6], {
              value: 'linear-gradient',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css']
            });
            assert.deepStrictEqual(tokens[7], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: '45',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: 'deg',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.deg.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: 'blue',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.color.w3c-standard-color-name.css']
            });
            assert.deepStrictEqual(tokens[14], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[16], {
              value: 'red',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.color.w3c-standard-color-name.css']
            });
            assert.deepStrictEqual(tokens[18], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[19], {
              value: ';',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
            });
            tokens = testGrammar.tokenizeLine('a{ background-image: LINear-graDIEnt( ellipse to left top, blue, red);').tokens;
            assert.deepStrictEqual(tokens[6], {
              value: 'LINear-graDIEnt',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: 'ellipse',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: 'to',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'keyword.operator.gradient.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: 'left',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css']
            });
            assert.deepStrictEqual(tokens[15], {
              value: 'top',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css']
            });
            assert.deepStrictEqual(tokens[16], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[18], {
              value: 'blue',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.color.w3c-standard-color-name.css']
            });
            assert.deepStrictEqual(tokens[19], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[21], {
              value: 'red',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.color.w3c-standard-color-name.css']
            });
          });
          it('tokenises radial gradients', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('a{ background-image: radial-gradient(farthest-corner at 45px 45px , #f00 0%, #00f 100%);}').tokens;
            assert.deepStrictEqual(tokens[6], {
              value: 'radial-gradient',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css']
            });
            assert.deepStrictEqual(tokens[7], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[8], {
              value: 'farthest-corner',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: 'at',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'keyword.operator.gradient.css']
            });
            assert.deepStrictEqual(tokens[12], {
              value: '45',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
            });
            assert.deepStrictEqual(tokens[15], {
              value: '45',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[16], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
            });
            assert.deepStrictEqual(tokens[18], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[20], {
              value: '#',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css']
            });
            assert.deepStrictEqual(tokens[21], {
              value: 'f00',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css']
            });
            assert.deepStrictEqual(tokens[23], {
              value: '0',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[24], {
              value: '%',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
            });
            tokens = testGrammar.tokenizeLine('a{ background-image: RADial-gradiENT(16px at 60px 50%,#000 0%, #000 14px, rgba(0,0,0,.3) 18px, transparent 19px)}').tokens;
            assert.deepStrictEqual(tokens[6], {
              value: 'RADial-gradiENT',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css']
            });
            assert.deepStrictEqual(tokens[7], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[8], {
              value: '16',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: 'at',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'keyword.operator.gradient.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: '60',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[14], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
            });
            assert.deepStrictEqual(tokens[16], {
              value: '50',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[17], {
              value: '%',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
            });
            assert.deepStrictEqual(tokens[18], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[19], {
              value: '#',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css']
            });
            assert.deepStrictEqual(tokens[20], {
              value: '000',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css']
            });
            assert.deepStrictEqual(tokens[33], {
              value: 'rgba',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[34], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[35], {
              value: '0',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[36], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[41], {
              value: '.3',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[42], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[48], {
              value: 'transparent',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css']
            });
          });
          it('matches gradients that span multiple lines with injected comments', function () {
            var lines;
            lines = testGrammar.tokenizeLines("a{\n  background-image: raDIAL-gradiENT(\n    ellipse farthest-corner/*@*/at/*@*/470px 47px,/*===\n========*/#FFFF80 20%, rgba(204, 153, 153, 0.4) 30%,/*))))))))}*/#E6E6FF 60%); }");
            assert.deepStrictEqual(lines[1][4], {
              value: 'raDIAL-gradiENT',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css']
            });
            assert.deepStrictEqual(lines[2][1], {
              value: 'ellipse',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css']
            });
            assert.deepStrictEqual(lines[2][3], {
              value: 'farthest-corner',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css']
            });
            assert.deepStrictEqual(lines[2][4], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(lines[2][5], {
              value: '@',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[2][6], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(lines[2][7], {
              value: 'at',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'keyword.operator.gradient.css']
            });
            assert.deepStrictEqual(lines[2][8], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(lines[2][11], {
              value: '470',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[2][12], {
              value: 'px',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
            });
            assert.deepStrictEqual(lines[2][16], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[2][17], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(lines[2][18], {
              value: '===',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[3][0], {
              value: '========',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[3][2], {
              value: '#',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css']
            });
            assert.deepStrictEqual(lines[3][3], {
              value: 'FFFF80',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css']
            });
            assert.deepStrictEqual(lines[3][9], {
              value: 'rgba',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[3][10], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[3][20], {
              value: '0.4',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[3][21], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[3][26], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(lines[3][27], {
              value: '))))))))}',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[3][28], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(lines[3][29], {
              value: '#',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css']
            });
            assert.deepStrictEqual(lines[3][30], {
              value: 'E6E6FF',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css']
            });
          });
          it('highlights vendored gradient functions', function () {
            var lines;
            lines = testGrammar.tokenizeLines(".grad {\n  background-image: -webkit-linear-gradient(top,  /* For Chrome 25 and Safari 6, iOS 6.1, Android 4.3 */ hsl(0, 80%, 70%), #bada55);\n  background-image:    -moz-linear-gradient(top,  /* For Firefox (3.6 to 15) */ hsl(0, 80%, 70%), #bada55);\n  background-image:      -o-linear-gradient(top,  /* For old Opera (11.1 to 12.0) */  hsl(0, 80%, 70%), #bada55);\n}");
            assert.deepStrictEqual(lines[1][4], {
              value: '-webkit-linear-gradient',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css']
            });
            assert.deepStrictEqual(lines[1][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[1][6], {
              value: 'top',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css']
            });
            assert.deepStrictEqual(lines[1][10], {
              value: ' For Chrome 25 and Safari 6, iOS 6.1, Android 4.3 ',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[1][13], {
              value: 'hsl',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[1][22], {
              value: '70',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[1][23], {
              value: '%',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
            });
            assert.deepStrictEqual(lines[1][24], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[1][27], {
              value: '#',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css', 'punctuation.definition.constant.css']
            });
            assert.deepStrictEqual(lines[1][28], {
              value: 'bada55',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'constant.other.color.rgb-value.hex.css']
            });
            assert.deepStrictEqual(lines[1][29], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][4], {
              value: '-moz-linear-gradient',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css']
            });
            assert.deepStrictEqual(lines[2][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][6], {
              value: 'top',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.constant.property-value.css']
            });
            assert.deepStrictEqual(lines[2][7], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[2][10], {
              value: ' For Firefox (3.6 to 15) ',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[2][13], {
              value: 'hsl',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[2][14], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][24], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][29], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[3][4], {
              value: '-o-linear-gradient',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'support.function.gradient.css']
            });
            assert.deepStrictEqual(lines[3][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[3][10], {
              value: ' For old Opera (11.1 to 12.0) ',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[3][13], {
              value: 'hsl',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[3][14], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css']
            });
          });
          
          it('highlights antique Webkit syntax as deprecated', function () {
            var lines;
            lines = testGrammar.tokenizeLines(".grad {\n  background-image: -webkit-gradient(linear, 0% 0%, 0% 100%,\n    from( rgb(0, 171, 235)),\n    color-stop(0.5, rgb(255, 255, 255)),\n    color-stop(0.5, rgb(102, 204, 0)),\n    to(rgb(255, 255, 255))),\n    -webkit-gradient(radial, 45 45, 10, 52 50, 30, from(#A7D30C), to(rgba(1,159,98,0)), color-stop(90%, #019F62)),\n        -webkit-gradient(radial, 105 105, 20, 112 120, 50, from(#ff5f98), to(rgba(255,1,136,0)), color-stop(75%, #ff0188)),\n        -webkit-gradient(radial, 95 15, 15, 102 20, 40, from(#00c9ff), to(rgba(0,201,255,0)), color-stop(80%, #00b5e2)),\n        -webkit-gradient(radial, 0 150, 50, 0 140, 90, from(#f4f201), to(rgba(228, 199,0,0)), color-stop(80%, #e4c700));\n}");
            assert.deepStrictEqual(lines[1][4], {
              value: '-webkit-gradient',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.gradient.function.css']
            });
            assert.deepStrictEqual(lines[1][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[1][6], {
              value: 'linear',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'support.constant.property-value.css']
            });
            assert.deepStrictEqual(lines[1][7], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[1][19], {
              value: '100',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[1][20], {
              value: '%',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
            });
            assert.deepStrictEqual(lines[2][1], {
              value: 'from',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.function.css']
            });
            assert.deepStrictEqual(lines[2][2], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][4], {
              value: 'rgb',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[2][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][9], {
              value: '171',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[2][10], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[2][14], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[3][1], {
              value: 'color-stop',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.function.css']
            });
            assert.deepStrictEqual(lines[3][2], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[3][3], {
              value: '0.5',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[3][4], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[3][16], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[3][17], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[4][1], {
              value: 'color-stop',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.function.css']
            });
            assert.deepStrictEqual(lines[4][2], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[4][3], {
              value: '0.5',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[4][4], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[4][6], {
              value: 'rgb',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[4][7], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[4][8], {
              value: '102',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[4][9], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[4][11], {
              value: '204',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[4][12], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[4][14], {
              value: '0',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[4][15], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[4][16], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[4][17], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[5][1], {
              value: 'to',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.function.css']
            });
            assert.deepStrictEqual(lines[5][2], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[5][12], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[5][13], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[5][14], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[5][15], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[6][1], {
              value: '-webkit-gradient',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.gradient.function.css']
            });
            assert.deepStrictEqual(lines[6][2], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[6][3], {
              value: 'radial',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'support.constant.property-value.css']
            });
            assert.deepStrictEqual(lines[6][4], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[6][8], {
              value: '45',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[6][31], {
              value: 'rgba',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'meta.function.color.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[7][1], {
              value: '-webkit-gradient',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.gradient.function.css']
            });
            assert.deepStrictEqual(lines[7][2], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[9][1], {
              value: '-webkit-gradient',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'invalid.deprecated.gradient.function.css']
            });
            assert.deepStrictEqual(lines[9][2], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[9][3], {
              value: 'radial',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'support.constant.property-value.css']
            });
            assert.deepStrictEqual(lines[9][4], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[9][6], {
              value: '0',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[9][8], {
              value: '150',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[9][54], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.gradient.invalid.deprecated.gradient.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[9][55], {
              value: ';',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
            });
            assert.deepStrictEqual(lines[10][0], {
              value: '}',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
            });
          });
        });
        describe('other functions', function () {
          it('tokenises basic-shape functions', function () {
            var lines;
            lines = testGrammar.tokenizeLines("a{\n  shape-outside: circle(20em/*=*/at 50% 50%);\n  shape-outside: inset(1em, 1em, 1em, 1em);\n}");
            assert.deepStrictEqual(lines[1][4], {
              value: 'circle',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'support.function.shape.css']
            });
            assert.deepStrictEqual(lines[1][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[1][6], {
              value: '20',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[1][7], {
              value: 'em',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
            });
            assert.deepStrictEqual(lines[1][8], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(lines[1][9], {
              value: '=',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'comment.block.css']
            });
            assert.deepStrictEqual(lines[1][10], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(lines[1][11], {
              value: 'at',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'keyword.operator.shape.css']
            });
            assert.deepStrictEqual(lines[1][13], {
              value: '50',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[1][14], {
              value: '%',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
            });
            assert.deepStrictEqual(lines[1][16], {
              value: '50',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[1][17], {
              value: '%',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.percentage.css']
            });
            assert.deepStrictEqual(lines[1][18], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][4], {
              value: 'inset',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'support.function.shape.css']
            });
            assert.deepStrictEqual(lines[2][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][6], {
              value: '1',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[2][7], {
              value: 'em',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
            });
            assert.deepStrictEqual(lines[2][8], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[2][10], {
              value: '1',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[2][11], {
              value: 'em',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
            });
            assert.deepStrictEqual(lines[2][12], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[2][14], {
              value: '1',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[2][15], {
              value: 'em',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
            });
            assert.deepStrictEqual(lines[2][16], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[2][18], {
              value: '1',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[2][19], {
              value: 'em',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
            });
            assert.deepStrictEqual(lines[2][20], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.shape.css', 'punctuation.section.function.end.bracket.round.css']
            });
          });
          it('tokenises OpenType feature functions', function () {
            var lines;
            lines = testGrammar.tokenizeLines(".font{\n  font-variant-alternates: stylistic(user-defined-ident);\n  font-variant-alternates: styleset(user-defined-ident);\n  font-variant-alternates: character-variant(user-defined-ident);\n  font-variant-alternates: swash(user-defined-ident);\n  font-variant-alternates: ornaments(user-defined-ident);\n  font-variant-alternates: annotation(user-defined-ident);\n  font-variant-alternates: swash(ident1) annotation(ident2);\n}");
            assert.deepStrictEqual(lines[1][4], {
              value: 'stylistic',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[1][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[1][6], {
              value: 'user-defined-ident',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css']
            });
            assert.deepStrictEqual(lines[1][7], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][4], {
              value: 'styleset',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[2][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[2][6], {
              value: 'user-defined-ident',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css']
            });
            assert.deepStrictEqual(lines[2][7], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[3][4], {
              value: 'character-variant',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[3][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[3][6], {
              value: 'user-defined-ident',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css']
            });
            assert.deepStrictEqual(lines[3][7], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[4][4], {
              value: 'swash',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[4][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[4][6], {
              value: 'user-defined-ident',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css']
            });
            assert.deepStrictEqual(lines[4][7], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[5][4], {
              value: 'ornaments',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[5][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[5][6], {
              value: 'user-defined-ident',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css']
            });
            assert.deepStrictEqual(lines[5][7], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[6][4], {
              value: 'annotation',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[6][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[6][6], {
              value: 'user-defined-ident',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css']
            });
            assert.deepStrictEqual(lines[6][7], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[7][4], {
              value: 'swash',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[7][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[7][6], {
              value: 'ident1',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css']
            });
            assert.deepStrictEqual(lines[7][7], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[7][9], {
              value: 'annotation',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[7][10], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[7][11], {
              value: 'ident2',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'variable.parameter.misc.css']
            });
            assert.deepStrictEqual(lines[7][12], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css']
            });
          });
          
          it('tokenises image-set()', function () {
            var lines;
            lines = testGrammar.tokenizeLines("a{\n    background-image: image-set( \"foo.png\" 1x,\n                                 \"foo-2x.png\" 2x,\n                                 \"foo-print.png\" 600dpi );\n}");
            assert.deepStrictEqual(lines[0][0], {
              value: 'a',
              scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
            });
            assert.deepStrictEqual(lines[0][1], {
              value: '{',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
            });
            assert.deepStrictEqual(lines[1][1], {
              value: 'background-image',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
            });
            assert.deepStrictEqual(lines[1][2], {
              value: ':',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
            });
            assert.deepStrictEqual(lines[1][4], {
              value: 'image-set',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(lines[1][5], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(lines[1][7], {
              value: '"',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
            });
            assert.deepStrictEqual(lines[1][8], {
              value: 'foo.png',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css']
            });
            assert.deepStrictEqual(lines[1][9], {
              value: '"',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
            });
            assert.deepStrictEqual(lines[1][11], {
              value: '1x',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'constant.numeric.other.density.css']
            });
            assert.deepStrictEqual(lines[1][12], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[2][1], {
              value: '"',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
            });
            assert.deepStrictEqual(lines[2][2], {
              value: 'foo-2x.png',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css']
            });
            assert.deepStrictEqual(lines[2][3], {
              value: '"',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
            });
            assert.deepStrictEqual(lines[2][5], {
              value: '2x',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'constant.numeric.other.density.css']
            });
            assert.deepStrictEqual(lines[2][6], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(lines[3][1], {
              value: '"',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
            });
            assert.deepStrictEqual(lines[3][2], {
              value: 'foo-print.png',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css']
            });
            assert.deepStrictEqual(lines[3][3], {
              value: '"',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
            });
            assert.deepStrictEqual(lines[3][5], {
              value: '600',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(lines[3][6], {
              value: 'dpi',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'constant.numeric.css', 'keyword.other.unit.dpi.css']
            });
            assert.deepStrictEqual(lines[3][8], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.misc.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(lines[3][9], {
              value: ';',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
            });
            assert.deepStrictEqual(lines[4][0], {
              value: '}',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
            });
          });
        });
        describe('timing-functions', function () {
          it('tokenises them correctly', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('a{ zoom: cubic-bezier(/**/1.2,/*=*/0,0,0/**/)}').tokens;
            assert.deepStrictEqual(tokens[6], {
              value: 'cubic-bezier',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'support.function.timing-function.css']
            });
            assert.deepStrictEqual(tokens[7], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[8], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: '1.2',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[12], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: '=',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css']
            });
            assert.deepStrictEqual(tokens[14], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(tokens[15], {
              value: '0',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[16], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[17], {
              value: '0',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[18], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[19], {
              value: '0',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[20], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(tokens[21], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(tokens[22], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.section.function.end.bracket.round.css']
            });
          });
          
          it('highlights the "start" and "end" keywords', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('a{ before: steps(0, start); after: steps(1, end); }').tokens;
            assert.deepStrictEqual(tokens[6], {
              value: 'steps',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'support.function.timing-function.css']
            });
            assert.deepStrictEqual(tokens[7], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[8], {
              value: '0',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: 'start',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'support.constant.step-direction.css']
            });
            assert.deepStrictEqual(tokens[12], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[23], {
              value: 'end',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.timing-function.css', 'support.constant.step-direction.css']
            });
          });
        });
        describe('variables', function () {
          it('scopes var() statements as variables', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('a{color: var(--name)}').tokens;
            assert.deepStrictEqual(tokens[0], {
              value: 'a',
              scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
            });
            assert.deepStrictEqual(tokens[1], {
              value: '{',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
            });
            assert.deepStrictEqual(tokens[2], {
              value: 'color',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
            });
            assert.deepStrictEqual(tokens[3], {
              value: ':',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
            });
            assert.deepStrictEqual(tokens[5], {
              value: 'var',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[6], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[7], {
              value: '--name',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'variable.argument.css']
            });
            assert.deepStrictEqual(tokens[8], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: '}',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
            });
            tokens = testGrammar.tokenizeLine('a{color: var(  --name  )}').tokens;
            assert.deepStrictEqual(tokens[5], {
              value: 'var',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[6], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[8], {
              value: '--name',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'variable.argument.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css']
            });
          });
          it('allows injected comments', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('a{ color: var( /*=*/ --something ) }').tokens;
            assert.deepStrictEqual(tokens[6], {
              value: 'var',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[7], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: '=',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'comment.block.css']
            });
            assert.deepStrictEqual(tokens[11], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: '--something',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'variable.argument.css']
            });
            assert.deepStrictEqual(tokens[15], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css']
            });
          });
          
          it('tokenises fallback values', function () {
            var tokens;
            tokens = testGrammar.tokenizeLine('.bar{ width: var(--page-width, /*;;;);*/ 2); }').tokens;
            assert.deepStrictEqual(tokens[7], {
              value: 'var',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'support.function.misc.css']
            });
            assert.deepStrictEqual(tokens[8], {
              value: '(',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.begin.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[9], {
              value: '--page-width',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'variable.argument.css']
            });
            assert.deepStrictEqual(tokens[10], {
              value: ',',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.separator.list.comma.css']
            });
            assert.deepStrictEqual(tokens[12], {
              value: '/*',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
            });
            assert.deepStrictEqual(tokens[13], {
              value: ';;;);',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'comment.block.css']
            });
            assert.deepStrictEqual(tokens[14], {
              value: '*/',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
            });
            assert.deepStrictEqual(tokens[16], {
              value: '2',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'constant.numeric.css']
            });
            assert.deepStrictEqual(tokens[17], {
              value: ')',
              scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'meta.function.variable.css', 'punctuation.section.function.end.bracket.round.css']
            });
            assert.deepStrictEqual(tokens[18], {
              value: ';',
              scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
            });
          });
        });
        
        it('does not tokenise functions with whitespace between name and parameters', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('a{ p: attr (title); }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: 'a',
            scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'p',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: ':',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'attr (title',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: ')',
            scopes: ['source.css', 'meta.property-list.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: ';',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          tokens = testGrammar.tokenizeLine('a{url:url (s)}').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: 'a',
            scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: 'url',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: ':',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: 'url (s',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: ')',
            scopes: ['source.css', 'meta.property-list.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          tokens = testGrammar.tokenizeLine('a{content:url ("http://github.com/");}').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: 'a',
            scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: 'content',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: ':',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: 'url (',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: '"',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'http://github.com/',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '"',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: ')',
            scopes: ['source.css', 'meta.property-list.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: ';',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          tokens = testGrammar.tokenizeLine('a{content: url (http://a.pl/)}').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: 'a',
            scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[2], {
            value: 'content',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: ':',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[5], {
            value: 'url (http://a.pl/',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: ')',
            scopes: ['source.css', 'meta.property-list.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
          tokens = testGrammar.tokenizeLine('a{ color: rgb (187,255,221); }').tokens;
          assert.deepStrictEqual(tokens[0], {
            value: 'a',
            scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
          });
          assert.deepStrictEqual(tokens[1], {
            value: '{',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
          });
          assert.deepStrictEqual(tokens[3], {
            value: 'color',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
          });
          assert.deepStrictEqual(tokens[4], {
            value: ':',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
          });
          assert.deepStrictEqual(tokens[6], {
            value: 'rgb (',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '187',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: ',',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.separator.list.comma.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: '255',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[10], {
            value: ',',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.separator.list.comma.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: '221',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
          });
          assert.deepStrictEqual(tokens[12], {
            value: ')',
            scopes: ['source.css', 'meta.property-list.css']
          });
          assert.deepStrictEqual(tokens[13], {
            value: ';',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
          });
          assert.deepStrictEqual(tokens[15], {
            value: '}',
            scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
          });
        });
      });
      describe('Unicode ranges', function () {
        it('tokenises single codepoints', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('a{ a: U+A5 }').tokens;
          assert.deepStrictEqual(tokens[6], {
            value: 'U+A5',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css']
          });
        });
        it('tokenises codepoint ranges', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('a{ a: U+0025-00FF }').tokens;
          assert.deepStrictEqual(tokens[6], {
            value: 'U+0025',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '-',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css', 'punctuation.separator.dash.unicode-range.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '00FF',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css']
          });
          tokens = testGrammar.tokenizeLine('a{ unicode-range: u+0-7F }').tokens;
          assert.deepStrictEqual(tokens[6], {
            value: 'u+0',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '-',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css', 'punctuation.separator.dash.unicode-range.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '7F',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css']
          });
        });
        
        it('tokenises wildcard ranges', function () {
          var tokens;
          tokens = testGrammar.tokenizeLine('a{ unicode-range: U+4?? }').tokens;
          assert.deepStrictEqual(tokens[6], {
            value: 'U+4??',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css']
          });
          tokens = testGrammar.tokenizeLine('a{ unicode-range: U+0025-00FF, U+4?? }').tokens;
          assert.deepStrictEqual(tokens[6], {
            value: 'U+0025',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css']
          });
          assert.deepStrictEqual(tokens[7], {
            value: '-',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css', 'punctuation.separator.dash.unicode-range.css']
          });
          assert.deepStrictEqual(tokens[8], {
            value: '00FF',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css']
          });
          assert.deepStrictEqual(tokens[9], {
            value: ',',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.separator.list.comma.css']
          });
          assert.deepStrictEqual(tokens[11], {
            value: 'U+4??',
            scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.other.unicode-range.css']
          });
        });
      });
    });
  });

  describe('escape sequences', function () {
    it('tokenizes escape sequences in single-quoted strings', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine("very-custom { content: '\\c0ffee' }").tokens;
      assert.deepStrictEqual(tokens[0], {
        value: 'very-custom',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css']
      });
      assert.deepStrictEqual(tokens[1], {
        value: ' ',
        scopes: ['source.css']
      });
      assert.deepStrictEqual(tokens[2], {
        value: '{',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
      });
      assert.deepStrictEqual(tokens[3], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[4], {
        value: 'content',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(tokens[5], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: "'",
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: '\\c0ffee',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'constant.character.escape.codepoint.css']
      });
    });

    it('tokenizes escape sequences in double-quoted strings', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('very-custom { content: "\\c0ffee" }').tokens;
      assert.deepStrictEqual(tokens[0], {
        value: 'very-custom',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.custom.css']
      });
      assert.deepStrictEqual(tokens[1], {
        value: ' ',
        scopes: ['source.css']
      });
      assert.deepStrictEqual(tokens[2], {
        value: '{',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
      });
      assert.deepStrictEqual(tokens[3], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[4], {
        value: 'content',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(tokens[5], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: '"',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: '\\c0ffee',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'constant.character.escape.codepoint.css']
      });
    });

    it('tokenises escape sequences in selectors', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('\\61 \\{ {  } \\}').tokens;
      assert.deepStrictEqual(tokens[0], {
        value: '\\61',
        scopes: ['source.css', 'constant.character.escape.codepoint.css']
      });
      assert.deepStrictEqual(tokens[2], {
        value: '\\{',
        scopes: ['source.css', 'constant.character.escape.css']
      });
      assert.deepStrictEqual(tokens[4], {
        value: '{',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: '\\}',
        scopes: ['source.css', 'constant.character.escape.css']
      });
      tokens = testGrammar.tokenizeLine('\\61\\ \\. \\@media {}').tokens;
      assert.deepStrictEqual(tokens[0], {
        value: '\\61',
        scopes: ['source.css', 'constant.character.escape.codepoint.css']
      });
      assert.deepStrictEqual(tokens[1], {
        value: '\\ ',
        scopes: ['source.css', 'constant.character.escape.css']
      });
      assert.deepStrictEqual(tokens[2], {
        value: '\\.',
        scopes: ['source.css', 'constant.character.escape.css']
      });
      assert.deepStrictEqual(tokens[4], {
        value: '\\@',
        scopes: ['source.css', 'constant.character.escape.css']
      });
      assert.deepStrictEqual(tokens[5], {
        value: 'media',
        scopes: ['source.css', 'meta.selector.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: ' ',
        scopes: ['source.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: '{',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
      });
    });

    it('tokenises escape sequences in property lists', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('a { \\77\\69\\64\\74\\68: 20px; }').tokens;
      assert.deepStrictEqual(tokens[4], {
        value: '\\77',
        scopes: ['source.css', 'meta.property-list.css', 'constant.character.escape.codepoint.css']
      });
      assert.deepStrictEqual(tokens[5], {
        value: '\\69',
        scopes: ['source.css', 'meta.property-list.css', 'constant.character.escape.codepoint.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: '\\64',
        scopes: ['source.css', 'meta.property-list.css', 'constant.character.escape.codepoint.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: '\\74',
        scopes: ['source.css', 'meta.property-list.css', 'constant.character.escape.codepoint.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: '\\68',
        scopes: ['source.css', 'meta.property-list.css', 'constant.character.escape.codepoint.css']
      });
      assert.deepStrictEqual(tokens[9], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
    });
    
    it('tokenises escape sequences in property values', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('a { content: \\1F764; }').tokens;
      assert.deepStrictEqual(tokens[7], {
        value: '\\1F764',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.character.escape.codepoint.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: ';',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
      });
      assert.deepStrictEqual(tokens[10], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
    });
  });

  describe('unclosed strings', function () {
    it('highlights an unterminated string as an error', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine("a{ content: 'aaaa").tokens;
      assert.deepStrictEqual(tokens[4], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: "'",
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: 'aaaa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'invalid.illegal.unclosed.string.css']
      });
      tokens = testGrammar.tokenizeLine('a{ content: "aaaa').tokens;
      assert.deepStrictEqual(tokens[4], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: '"',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: 'aaaa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'invalid.illegal.unclosed.string.css']
      });
    });

    it.skip("knows when a string is line-wrapped - a", function () {
      var lines = testGrammar.tokenizeLines("a{\n  content: \"aaaaa\\\\\\\naaa\"; color: red;\n}");
      assert.deepStrictEqual(lines[1][4], {
        value: '"',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
      });
      assert.deepStrictEqual(lines[1][5], {
        value: 'aaaaa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css']
      });
      assert.deepStrictEqual(lines[1][6], {
        value: '\\\\',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'constant.character.escape.css']
      });
      assert.deepStrictEqual(lines[1][7], {
        value: '\\',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'constant.character.escape.newline.css']
      });
      assert.deepStrictEqual(lines[2][0], {
        value: 'aaa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css']
      });
      assert.deepStrictEqual(lines[2][1], {
        value: '"',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
      });
      assert.deepStrictEqual(lines[2][2], {
        value: ';',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
      });
      assert.deepStrictEqual(lines[2][4], {
        value: 'color',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
    });

    it.skip("knows when a string is line-wrapped - b", function () {
      var lines = testGrammar.tokenizeLines("a{\n  content: 'aaaaa\\\\\\\naaa'; color: red;\n}");
      assert.deepStrictEqual(lines[1][4], {
        value: "'",
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css']
      });
      assert.deepStrictEqual(lines[1][5], {
        value: 'aaaaa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css']
      });
      assert.deepStrictEqual(lines[1][6], {
        value: '\\\\',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'constant.character.escape.css']
      });
      assert.deepStrictEqual(lines[1][7], {
        value: '\\',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'constant.character.escape.newline.css']
      });
      assert.deepStrictEqual(lines[2][0], {
        value: 'aaa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css']
      });
      assert.deepStrictEqual(lines[2][1], {
        value: "'",
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'punctuation.definition.string.end.css']
      });
      assert.deepStrictEqual(lines[2][2], {
        value: ';',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
      });
      assert.deepStrictEqual(lines[2][4], {
        value: 'color',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
    });

    it('highlights escape sequences inside invalid strings', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('a{ content: "aaa\\"aa').tokens;
      assert.deepStrictEqual(tokens[6], {
        value: '"',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: 'aaa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'invalid.illegal.unclosed.string.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: '\\"',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'invalid.illegal.unclosed.string.css', 'constant.character.escape.css']
      });
      assert.deepStrictEqual(tokens[9], {
        value: 'aa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'invalid.illegal.unclosed.string.css']
      });
      tokens = testGrammar.tokenizeLine("a{ content: 'aaa\\'aa").tokens;
      assert.deepStrictEqual(tokens[6], {
        value: "'",
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'punctuation.definition.string.begin.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: 'aaa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'invalid.illegal.unclosed.string.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: "\\'",
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'invalid.illegal.unclosed.string.css', 'constant.character.escape.css']
      });
      assert.deepStrictEqual(tokens[9], {
        value: 'aa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.single.css', 'invalid.illegal.unclosed.string.css']
      });
    });
    
    it.skip('highlights unclosed lines in line-wrapped strings', function () {
      var lines;
      lines = testGrammar.tokenizeLines("a{\n  content: \"aaa\\\"aa\\\naaaa\naaaa; color: red;\n}");
      assert.deepStrictEqual(lines[1][4], {
        value: '"',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
      });
      assert.deepStrictEqual(lines[1][5], {
        value: 'aaa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css']
      });
      assert.deepStrictEqual(lines[1][6], {
        value: '\\"',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'constant.character.escape.css']
      });
      assert.deepStrictEqual(lines[1][7], {
        value: 'aa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css']
      });
      assert.deepStrictEqual(lines[1][8], {
        value: '\\',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'constant.character.escape.newline.css']
      });
      assert.deepStrictEqual(lines[2][0], {
        value: 'aaaa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'string.quoted.double.css', 'invalid.illegal.unclosed.string.css']
      });
      assert.deepStrictEqual(lines[3][0], {
        value: 'aaaa',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
      });
      assert.deepStrictEqual(lines[3][1], {
        value: ';',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
      });
      assert.deepStrictEqual(lines[3][3], {
        value: 'color',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(lines[3][4], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(lines[3][6], {
        value: 'red',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.color.w3c-standard-color-name.css']
      });
      assert.deepStrictEqual(lines[3][7], {
        value: ';',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
      });
      assert.deepStrictEqual(lines[4][0], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
    });
  });

  describe('comments', function () {
    it('tokenises comments inside @import statements', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('@import /* url("name"); */ "1.css";').tokens;
      assert.deepStrictEqual(tokens[0], {
        value: '@',
        scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css']
      });
      assert.deepStrictEqual(tokens[1], {
        value: 'import',
        scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css']
      });
      assert.deepStrictEqual(tokens[3], {
        value: '/*',
        scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
      });
      assert.deepStrictEqual(tokens[4], {
        value: ' url("name"); ',
        scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css']
      });
      assert.deepStrictEqual(tokens[5], {
        value: '*/',
        scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: '"',
        scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: '1.css',
        scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css']
      });
      assert.deepStrictEqual(tokens[9], {
        value: '"',
        scopes: ['source.css', 'meta.at-rule.import.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
      });
      assert.deepStrictEqual(tokens[10], {
        value: ';',
        scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css']
      });
      tokens = testGrammar.tokenizeLine('@import/*";"*/ url("2.css");').tokens;
      assert.deepStrictEqual(tokens[0], {
        value: '@',
        scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css']
      });
      assert.deepStrictEqual(tokens[1], {
        value: 'import',
        scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css']
      });
      assert.deepStrictEqual(tokens[2], {
        value: '/*',
        scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
      });
      assert.deepStrictEqual(tokens[3], {
        value: '";"',
        scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css']
      });
      assert.deepStrictEqual(tokens[4], {
        value: '*/',
        scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: 'url',
        scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'support.function.url.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: '(',
        scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: '"',
        scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
      });
      assert.deepStrictEqual(tokens[9], {
        value: '2.css',
        scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css']
      });
      assert.deepStrictEqual(tokens[10], {
        value: '"',
        scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
      });
      assert.deepStrictEqual(tokens[11], {
        value: ')',
        scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css']
      });
      assert.deepStrictEqual(tokens[12], {
        value: ';',
        scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css']
      });
      tokens = testGrammar.tokenizeLine('@import url("3.css") print /* url(";"); */;').tokens;
      assert.deepStrictEqual(tokens[0], {
        value: '@',
        scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css', 'punctuation.definition.keyword.css']
      });
      assert.deepStrictEqual(tokens[1], {
        value: 'import',
        scopes: ['source.css', 'meta.at-rule.import.css', 'keyword.control.at-rule.import.css']
      });
      assert.deepStrictEqual(tokens[3], {
        value: 'url',
        scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'support.function.url.css']
      });
      assert.deepStrictEqual(tokens[4], {
        value: '(',
        scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.begin.bracket.round.css']
      });
      assert.deepStrictEqual(tokens[5], {
        value: '"',
        scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.begin.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: '3.css',
        scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: '"',
        scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'string.quoted.double.css', 'punctuation.definition.string.end.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: ')',
        scopes: ['source.css', 'meta.at-rule.import.css', 'meta.function.url.css', 'punctuation.section.function.end.bracket.round.css']
      });
      assert.deepStrictEqual(tokens[10], {
        value: 'print',
        scopes: ['source.css', 'meta.at-rule.import.css', 'support.constant.media.css']
      });
      assert.deepStrictEqual(tokens[12], {
        value: '/*',
        scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
      });
      assert.deepStrictEqual(tokens[13], {
        value: ' url(";"); ',
        scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css']
      });
      assert.deepStrictEqual(tokens[14], {
        value: '*/',
        scopes: ['source.css', 'meta.at-rule.import.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
      });
      assert.deepStrictEqual(tokens[15], {
        value: ';',
        scopes: ['source.css', 'meta.at-rule.import.css', 'punctuation.terminator.rule.css']
      });
    });

    it('tokenises comments inside @font-face statements', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('@font-face/*"{;}"*/{}').tokens;
      assert.deepStrictEqual(tokens[0], {
        value: '@',
        scopes: ['source.css', 'meta.at-rule.font-face.css', 'keyword.control.at-rule.font-face.css', 'punctuation.definition.keyword.css']
      });
      assert.deepStrictEqual(tokens[1], {
        value: 'font-face',
        scopes: ['source.css', 'meta.at-rule.font-face.css', 'keyword.control.at-rule.font-face.css']
      });
      assert.deepStrictEqual(tokens[2], {
        value: '/*',
        scopes: ['source.css', 'meta.at-rule.font-face.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
      });
      assert.deepStrictEqual(tokens[3], {
        value: '"{;}"',
        scopes: ['source.css', 'meta.at-rule.font-face.css', 'comment.block.css']
      });
      assert.deepStrictEqual(tokens[4], {
        value: '*/',
        scopes: ['source.css', 'meta.at-rule.font-face.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
      });
      assert.deepStrictEqual(tokens[5], {
        value: '{',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
    });

    it('tokenizes comments before media queries', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('/* comment */ @media').tokens;
      assert.deepStrictEqual(tokens[0], {
        value: '/*',
        scopes: ['source.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
      });
      assert.deepStrictEqual(tokens[1], {
        value: ' comment ',
        scopes: ['source.css', 'comment.block.css']
      });
      assert.deepStrictEqual(tokens[2], {
        value: '*/',
        scopes: ['source.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
      });
      assert.deepStrictEqual(tokens[4], {
        value: '@',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
      });
      assert.deepStrictEqual(tokens[5], {
        value: 'media',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
      });
    });

    it('tokenizes comments after media queries', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('@media/* comment */ ()').tokens;
      assert.deepStrictEqual(tokens[0], {
        value: '@',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
      });
      assert.deepStrictEqual(tokens[1], {
        value: 'media',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
      });
      assert.deepStrictEqual(tokens[2], {
        value: '/*',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
      });
      assert.deepStrictEqual(tokens[3], {
        value: ' comment ',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css']
      });
      assert.deepStrictEqual(tokens[4], {
        value: '*/',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
      });
    });

    it('tokenizes comments inside query lists', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('@media (max-height: 40em/* comment */)').tokens;
      assert.deepStrictEqual(tokens[0], {
        value: '@',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css', 'punctuation.definition.keyword.css']
      });
      assert.deepStrictEqual(tokens[1], {
        value: 'media',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'keyword.control.at-rule.media.css']
      });
      assert.deepStrictEqual(tokens[3], {
        value: '(',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.begin.bracket.round.css']
      });
      assert.deepStrictEqual(tokens[4], {
        value: 'max-height',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'support.type.property-name.media.css']
      });
      assert.deepStrictEqual(tokens[5], {
        value: ':',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: '40',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: 'em',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'constant.numeric.css', 'keyword.other.unit.em.css']
      });
      assert.deepStrictEqual(tokens[9], {
        value: '/*',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
      });
      assert.deepStrictEqual(tokens[10], {
        value: ' comment ',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css']
      });
      assert.deepStrictEqual(tokens[11], {
        value: '*/',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
      });
      assert.deepStrictEqual(tokens[12], {
        value: ')',
        scopes: ['source.css', 'meta.at-rule.media.header.css', 'punctuation.definition.parameters.end.bracket.round.css']
      });
    });

    it('tokenizes inline comments', function () {
      var tokens;
      tokens = testGrammar.tokenizeLine('section {border:4px/*padding:1px*/}').tokens;
      assert.deepStrictEqual(tokens[0], {
        value: 'section',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
      });
      assert.deepStrictEqual(tokens[1], {
        value: ' ',
        scopes: ['source.css']
      });
      assert.deepStrictEqual(tokens[2], {
        value: '{',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
      });
      assert.deepStrictEqual(tokens[3], {
        value: 'border',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(tokens[4], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[5], {
        value: '4',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
      });
      assert.deepStrictEqual(tokens[6], {
        value: 'px',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
      });
      assert.deepStrictEqual(tokens[7], {
        value: '/*',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
      });
      assert.deepStrictEqual(tokens[8], {
        value: 'padding:1px',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css']
      });
      assert.deepStrictEqual(tokens[9], {
        value: '*/',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
      });
      assert.deepStrictEqual(tokens[10], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
    });
    
    it('tokenizes multi-line comments', function () {
      var lines;
      lines = testGrammar.tokenizeLines("  section {\n    border:4px /*1px;\n    padding:1px*/\n}");
      assert.deepStrictEqual(lines[1][5], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
      });
      assert.deepStrictEqual(lines[1][6], {
        value: '/*',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css', 'punctuation.definition.comment.begin.css']
      });
      assert.deepStrictEqual(lines[1][7], {
        value: '1px;',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css']
      });
      assert.deepStrictEqual(lines[2][0], {
        value: '    padding:1px',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css']
      });
      assert.deepStrictEqual(lines[2][1], {
        value: '*/',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'comment.block.css', 'punctuation.definition.comment.end.css']
      });
      assert.deepStrictEqual(lines[3][0], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
    });
  });

  describe('Animations', function () {
    
    it('does not confuse animation names with predefined keywords', function () {
      var tokens;
      tokens = testGrammar.tokenizeLines('.animated {\n  animation-name: orphan-black;\n  animation-name: line-scale;\n}');
      assert.deepStrictEqual(tokens[1][4], {
        value: 'orphan-black',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
      });
      assert.deepStrictEqual(tokens[2][4], {
        value: 'line-scale',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
      });
    });
  });

  describe('Transforms', function () {
    
    it('tokenizes transform functions', function () {
      var tokens;
      tokens = testGrammar.tokenizeLines('.transformed {\n  transform: matrix(0, 1.5, -1.5, 0, 0, 100px);\n  transform: rotate(90deg) translateX(100px) scale(1.5);\n}');
      assert.deepStrictEqual(tokens[1][1], {
        value: 'transform',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(tokens[1][2], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[1][4], {
        value: 'matrix',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.function.transform.css']
      });
      assert.deepStrictEqual(tokens[1][5], {
        value: '(',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.section.function.begin.bracket.round.css']
      });
      assert.deepStrictEqual(tokens[1][6], {
        value: '0',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
      });
      assert.deepStrictEqual(tokens[1][7], {
        value: ',',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.separator.list.comma.css']
      });
      assert.deepStrictEqual(tokens[1][12], {
        value: '-1.5',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
      });
      assert.deepStrictEqual(tokens[1][22], {
        value: 'px',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
      });
      assert.deepStrictEqual(tokens[1][23], {
        value: ')',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'punctuation.section.function.end.bracket.round.css']
      });
      assert.deepStrictEqual(tokens[2][4], {
        value: 'rotate',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.function.transform.css']
      });
      assert.deepStrictEqual(tokens[2][10], {
        value: 'translateX',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.function.transform.css']
      });
      assert.deepStrictEqual(tokens[2][16], {
        value: 'scale',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.function.transform.css']
      });
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
      assert.deepStrictEqual(tokens[0][0], {
        value: 'a',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
      });
      assert.deepStrictEqual(tokens[0][1], {
        value: ' ',
        scopes: ['source.css']
      });
      assert.deepStrictEqual(tokens[0][2], {
        value: '{',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
      });
      assert.deepStrictEqual(tokens[0][3], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[0][4], {
        value: 'place-items',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(tokens[0][5], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[0][6], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[0][7], {
        value: 'center',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
      });
      assert.deepStrictEqual(tokens[0][8], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
      });
      assert.deepStrictEqual(tokens[0][9], {
        value: 'center',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
      });
      assert.deepStrictEqual(tokens[0][10], {
        value: ';',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
      });
      assert.deepStrictEqual(tokens[0][11], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[0][12], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
    });

    it("recognises place-self property as supported", function () {
      var tokens;
      tokens = testGrammar.tokenizeLines('a { place-self: center center; }');
      assert.deepStrictEqual(tokens[0][0], {
        value: 'a',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
      });
      assert.deepStrictEqual(tokens[0][1], {
        value: ' ',
        scopes: ['source.css']
      });
      assert.deepStrictEqual(tokens[0][2], {
        value: '{',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
      });
      assert.deepStrictEqual(tokens[0][3], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[0][4], {
        value: 'place-self',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(tokens[0][5], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[0][6], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[0][7], {
        value: 'center',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
      });
      assert.deepStrictEqual(tokens[0][8], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
      });
      assert.deepStrictEqual(tokens[0][9], {
        value: 'center',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
      });
      assert.deepStrictEqual(tokens[0][10], {
        value: ';',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
      });
      assert.deepStrictEqual(tokens[0][11], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[0][12], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
    });

    it("recognises place-content property as supported", function () {
      var tokens;
      tokens = testGrammar.tokenizeLines('a { place-content: center center; }');
      assert.deepStrictEqual(tokens[0][0], {
        value: 'a',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
      });
      assert.deepStrictEqual(tokens[0][1], {
        value: ' ',
        scopes: ['source.css']
      });
      assert.deepStrictEqual(tokens[0][2], {
        value: '{',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
      });
      assert.deepStrictEqual(tokens[0][3], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[0][4], {
        value: 'place-content',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(tokens[0][5], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[0][6], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[0][7], {
        value: 'center',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
      });
      assert.deepStrictEqual(tokens[0][8], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css']
      });
      assert.deepStrictEqual(tokens[0][9], {
        value: 'center',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'support.constant.property-value.css']
      });
      assert.deepStrictEqual(tokens[0][10], {
        value: ';',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
      });
      assert.deepStrictEqual(tokens[0][11], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[0][12], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
    });
    
    it("recognises row-gap property as supported", function () {
      var tokens;
      tokens = testGrammar.tokenizeLines('a { row-gap: 5px; }');
      assert.deepStrictEqual(tokens[0][0], {
        value: 'a',
        scopes: ['source.css', 'meta.selector.css', 'entity.name.tag.css']
      });
      assert.deepStrictEqual(tokens[0][1], {
        value: ' ',
        scopes: ['source.css']
      });
      assert.deepStrictEqual(tokens[0][2], {
        value: '{',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.begin.bracket.curly.css']
      });
      assert.deepStrictEqual(tokens[0][3], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[0][4], {
        value: 'row-gap',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-name.css', 'support.type.property-name.css']
      });
      assert.deepStrictEqual(tokens[0][5], {
        value: ':',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.separator.key-value.css']
      });
      assert.deepStrictEqual(tokens[0][6], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[0][7], {
        value: '5',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css']
      });
      assert.deepStrictEqual(tokens[0][8], {
        value: 'px',
        scopes: ['source.css', 'meta.property-list.css', 'meta.property-value.css', 'constant.numeric.css', 'keyword.other.unit.px.css']
      });
      assert.deepStrictEqual(tokens[0][9], {
        value: ';',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.terminator.rule.css']
      });
      assert.deepStrictEqual(tokens[0][10], {
        value: ' ',
        scopes: ['source.css', 'meta.property-list.css']
      });
      assert.deepStrictEqual(tokens[0][11], {
        value: '}',
        scopes: ['source.css', 'meta.property-list.css', 'punctuation.section.property-list.end.bracket.curly.css']
      });
    });
  });
});
