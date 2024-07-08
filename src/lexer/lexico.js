function lexer(input) {
    const keywords = ['auto', 'break', 'case', 'char', 'const', 'continue', 'default', 'do', 'double','else', 'enum', 'extern', 'float', 'for', 'goto', 'if', 'int', 'long', 'register', 'return', 'short', 'signed', 'sizeof', 'static', 'struct', 'switch', 'typedef', 'union', 'unsigned', 'void', 'volatile', 'while'];
    const operators = ['+', '-', '*', '/', '=', '==', '!=', '<', '>', '<=', '>=', '&&', '||', '++', '--', '+=', '-=', '*=', '/=', '%', '%=', '&', '|', '^', '~', '<<', '>>', '>>=', '<<=', '&=', '|=', '^=', '!', 'sizeof', '->', '.', '?:', ',', '->*', '()', '[]'];
    const knownFunctions = ['printf', 'scanf'];
    const formatSpecifiers = ['%d', '%i', '%u', '%f', '%e', '%E', '%g', '%G', '%x', '%X', '%o', '%c', '%s', '%p', '%n'];

    const tokens = [];
    let current = 0;
    let insideString = false;
    let stringDelimiter = '';
    let insideComment = false;
    let commentContent = '';
    let line = 1;

    while (current < input.length) {
        let char = input[current];

        if (char === '\n') {
            line++;
        }

        if (!insideComment && char === '/') {
            if (input[current + 1] === '/') {

                while (input[current] !== '\n' && current < input.length) {
                    current++;
                }
                continue;
            } else if (input[current + 1] === '*') {
               
                insideComment = true;
                current += 2; 
                continue;
            }
        }

        if (insideComment && char === '*' && input[current + 1] === '/') {
           
            tokens.push({ type: 'COMENTARIO', value: commentContent, line });
            insideComment = false;
            commentContent = '';
            current += 2; 
            continue;
        }

        if (insideComment) {
            commentContent += char;
            current++;
            continue;
        }

        if (char === ' ' && !insideString) {
            current++;
            continue;
        }

        if (char === '"' || char === "'") {
            if (!insideString) {
                insideString = true;
                stringDelimiter = char;
            } else if (char === stringDelimiter) {
                insideString = false;
            }
            tokens.push({ type: 'STRING_DELIMITADOR', value: char, line });
            current++;
            continue;
        }

        // Verificar se é uma diretiva de pré-processador
        if (char === '#' && !insideString) {
            let value = '';
            while (input[current] !== '\n') {
                value += input[current];
                current++;
            }
            tokens.push({ type: 'DIRECTIVA', value, line });
            continue;
        }

        if (/[a-zA-Z_]/.test(char) && !insideString) {
            let value = '';
            while (/[a-zA-Z0-9_]/.test(char)) {
                value += char;
                char = input[++current];
            }

            if (keywords.includes(value)) {
                tokens.push({ type: 'PALAVRA_RESERVADA', value, line });
            } else if (knownFunctions.includes(value)) {
                tokens.push({ type: 'FUNCAO_DE_CHAMADA', value, line });
            } else {
                tokens.push({ type: 'IDENTIFICADOR', value, line });
            }

            continue;
        }

        if (/[0-9]/.test(char) && !insideString) {
            let value = '';
            while (/[0-9]/.test(char)) {
                value += char;
                char = input[++current];
            }
            tokens.push({ type: 'NUMERO', value, line });
            continue;
        }

        if (operators.includes(char) && !insideString) {
            tokens.push({ type: 'OPERADOR', value: char, line });
            current++;
            continue;
        }
        if (char === '(' || char === ')') {
            tokens.push({ type: 'PARENTESES', value: char, line });
            current++;
            continue;
        }
        if (char === '{' || char === '}') {
            tokens.push({ type: 'CHAVES', value: char, line });
            current++;
            continue;
        }

        if (char === ';') {
            tokens.push({ type: 'PONTO_VIRGULA', value: char, line });
            current++;
            continue;
        }

        if (char === '%' && insideString) {
            let specifier = char;
            char = input[++current];
            while (/[a-zA-Z]/.test(char)) {
                specifier += char;
                char = input[++current];
            }
            if (formatSpecifiers.includes(specifier)) {
                tokens.push({ type: 'FORMAT_SPECIFIER', value: specifier, line });
            } else {
                tokens.push({ type: 'STRING', value: '%' + specifier, line });
            }
            continue;
        }
        current++;
    }

    return tokens;
}

module.exports = lexer;
