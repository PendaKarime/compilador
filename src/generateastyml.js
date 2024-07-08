function generateASTYAML(ast) {
    function traverse(node, indent = 0) {
        const indentation = " ".repeat(indent);
        let result = "";
        switch (node.type) {
            case 'program':
                result += `${indentation}TranslationUnit\n`;
                node.body.forEach(child => {
                    result += traverse(child, indent + 4);
                });
                break;
            case 'include_directive':
                result += `${indentation}├── IncludeDirective: ${node.value}\n`;
                break;
            case 'function_declaration':
                result += `${indentation}└── FunctionDefinition\n`;
                result += `${indentation}    ├── TypeSpecifier: ${node.returnType}\n`;
                result += `${indentation}    ├── Declarator: ${node.name}\n`;
                result += traverse(node.body, indent + 8);
                break;
            case 'block':
                result += `${indentation}    └── CompoundStatement\n`;
                node.body.forEach(child => {
                    result += traverse(child, indent + 8);
                });
                break;
            case 'variable_declaration':
                result += `${indentation}        ├── Declaration\n`;
                result += `${indentation}        │   ├── TypeSpecifier: ${node.varType}\n`;
                result += `${indentation}        │   └── InitDeclarator: ${node.name}`;
                if (node.initializer) {
                    result += ` = ${traverse(node.initializer)}`;
                }
                result += "\n";
                break;
            case 'expression_statement':
                result += `${indentation}        ├── ExpressionStatement\n`;
                if (node.value && node.value.type === 'binary_expression') {
                    result += traverse(node.value, indent + 12);
                } else if (node.value && node.value.type === 'function_call') {
                    result += `${indentation}        │   └── FunctionCall: ${node.value.funcCall.value}\n`;
                } else {
                    console.error("Unexpected node structure:", node);
                }
                break;
            case 'binary_expression':
                result += `${indentation}        │   ├── BinaryExpression: ${node.operator}\n`;
                result += traverse(node.left, indent + 12);
                result += traverse(node.right, indent + 12);
                break;
            case 'if_statement':
                result += `${indentation}        └── IfStatement\n`;
                result += `${indentation}            ├── Condition: ${traverse(node.condition)}\n`;
                result += traverse(node.thenBranch, indent + 16);
                if (node.elseBranch) {
                    result += `${indentation}            └── ElseStatement\n`;
                    result += traverse(node.elseBranch, indent + 16);
                }
                break;
            case 'return_statement':
                result += `${indentation}        └── ReturnStatement\n`;
                result += traverse(node.value, indent + 12);
                break;
            case 'IDENTIFICADOR':
                result += `${indentation}        │   └── Identifier: ${node.value}\n`;
                break;
            case 'NUMERO':
                result += `${indentation}        │   └── Number: ${node.value}\n`;
                break;
            case 'print_statement':
                result += `${indentation}        ├── PrintStatement\n`;
                break;
            default:
                console.error("Unexpected node type:", node.type);
                break;
        }
        return result;
    }

    return traverse(ast);
}

module.exports = generateASTYAML;
