// from https://github.com/microsoft/vscode-textmate/blob/677f741f5b5ef69589e0e5d2a6e556f94514cbfd/README.md
import fs from 'fs';
import path from 'path';
import vsctm from 'vscode-textmate';
import oniguruma from 'vscode-oniguruma';
import cson from 'cson';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const wasmBin = fs.readFileSync(path.join(__dirname, '..', 'node_modules', 'vscode-oniguruma', 'release', 'onig.wasm')).buffer;
const vscodeOnigurumaLib = oniguruma.loadWASM(wasmBin).then(() => {
	return {
		createOnigScanner(patterns) { return new oniguruma.OnigScanner(patterns); },
		createOnigString(s) { return new oniguruma.OnigString(s); }
	};
});

// Create a registry that can create a grammar from a scope name.
const registry = new vsctm.Registry({
	onigLib: vscodeOnigurumaLib,
	loadGrammar: async (scopeName) => {
		if (scopeName === 'source.css') {
			const file = await fs.promises.readFile(path.join(__dirname, '..', 'grammars', 'css.cson'));
			return vsctm.parseRawGrammar(cson.createJSONString(cson.parse(file.toString())), 'css.json');
		}
		console.log(`Unknown scope name: ${scopeName}`);
		return null;
	}
});

const grammar = await registry.loadGrammar('source.css');

export default {
	grammar: grammar,
	tokenizeLine: function tokenizeLine(line) {
		const lineTokens = grammar.tokenizeLine(line, vsctm.INITIAL);

		lineTokens.tokens.forEach((token) => {
			token.value = line.slice(token.startIndex, token.endIndex);
			delete token.startIndex;
			delete token.endIndex;
		});

		return lineTokens;
	},
	tokenizeLines: function tokenizeLines(text) {
		const lines = text.split(/\r\n|\r|\n/g);
		const tokenizedLines = [];

		let ruleStack = vsctm.INITIAL;
		for (let i = 0; i < lines.length; i++) {
			const line = lines[i];
			const lineTokens = grammar.tokenizeLine(line, ruleStack);

			lineTokens.tokens.forEach((token) => {
				token.value = line.slice(token.startIndex, token.endIndex);
				delete token.startIndex;
				delete token.endIndex;
			});

			tokenizedLines.push(lineTokens.tokens);
			ruleStack = lineTokens.ruleStack;
		}

		return tokenizedLines;
	}
}
