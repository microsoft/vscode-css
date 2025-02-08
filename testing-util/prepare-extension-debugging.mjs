import fs from 'fs';
import path from 'path';
import cson from 'cson';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const file = await fs.promises.readFile(path.join(__dirname, '..', 'grammars', 'css.cson'));
await fs.promises.writeFile(path.join(__dirname, '..', 'grammars', 'css.tmLanguage.json'), cson.createJSONString(cson.parse(file.toString())));

if (!fs.existsSync(path.join(__dirname, '..', 'testing-util', 'example.css'))) {
	await fs.promises.writeFile(path.join(__dirname, '..', 'testing-util', 'example.css'), `.foo {\n\tcolor: lime;\n}\n`);
}
