const fs = require('fs');
const lexer = require('./lexer/lexico');
const Parser = require('./parser/parse');
const generateASTYAML = require('./generateastyml');
const codigoFonte = fs.readFileSync('../input.c', 'utf-8');

const tokens = lexer(codigoFonte);


console.log("".padEnd(60), "Análise Léxica (Scanner) || (Gera Tokens)".padEnd(40), "\n");

console.log("\n"+"LEXEMA".padEnd(80), "TOKEN".padEnd(40), "LINHA");

tokens.forEach(token => {
    console.log(token.value.padEnd(80), token.type.padEnd(42), token.line);
});

console.log("\n".padEnd(60), "Análise Sintática (Parser) || (Gera AST)".padEnd(40), "\n");

const parser = new Parser(tokens);
const ast = parser.parse();

const astYAML = generateASTYAML(ast);


fs.writeFileSync('../ast.yaml', astYAML);