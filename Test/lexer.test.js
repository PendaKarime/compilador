const lexer = require('../src/lexer/lexico');

const input = `
  #include <stdio.h>
  #include <stdlib.h>

  /*Codigo que soma dois numeros*/
  int main() {
    int num1 = 10;
    int num2 = 20;
    int sum = num1 + num2;

    printf("A soma de %d e %d é %d\\n", num1, num2, sum);

      return 0;
    }
`;

describe('Analisador Lexico', () => {
  beforeAll(()=>{
    console.log("");
    //console.log(lexer(input))
  });

  it('deve analisar corretamente o código fonte do arquivo codigo.ts', () => {
    
    const actualTokens = lexer(input);

    const expectedTokens =[
      { type: 'DIRECTIVA', value: '#include <stdio.h>', line: 2 },
      { type: 'DIRECTIVA', value: '#include <stdlib.h>', line: 3 },
      {
        type: 'COMENTARIO',
        value: 'Codigo que soma dois numeros',
        line: 5
      },
      { type: 'PALAVRA_RESERVADA', value: 'int', line: 6 },
      { type: 'IDENTIFICADOR', value: 'main', line: 6 },
      { type: 'PARENTESES', value: '(', line: 6 },
      { type: 'PARENTESES', value: ')', line: 6 },
      { type: 'CHAVES', value: '{', line: 6 },
      { type: 'PALAVRA_RESERVADA', value: 'int', line: 7 },
      { type: 'IDENTIFICADOR', value: 'num1', line: 7 },
      { type: 'OPERADOR', value: '=', line: 7 },
      { type: 'NUMERO', value: '10', line: 7 },
      { type: 'PONTO_VIRGULA', value: ';', line: 7 },
      { type: 'PALAVRA_RESERVADA', value: 'int', line: 8 },
      { type: 'IDENTIFICADOR', value: 'num2', line: 8 },
      { type: 'OPERADOR', value: '=', line: 8 },
      { type: 'NUMERO', value: '20', line: 8 },
      { type: 'PONTO_VIRGULA', value: ';', line: 8 },
      { type: 'PALAVRA_RESERVADA', value: 'int', line: 9 },
      { type: 'IDENTIFICADOR', value: 'sum', line: 9 },
      { type: 'OPERADOR', value: '=', line: 9 },
      { type: 'IDENTIFICADOR', value: 'num1', line: 9 },
      { type: 'OPERADOR', value: '+', line: 9 },
      { type: 'IDENTIFICADOR', value: 'num2', line: 9 },
      { type: 'PONTO_VIRGULA', value: ';', line: 9 },
      { type: 'FUNCAO_DE_CHAMADA', value: 'printf', line: 11 },
      { type: 'PARENTESES', value: '(', line: 11 },
      { type: 'STRING_DELIMITADOR', value: '"', line: 11 },
      { type: 'FORMAT_SPECIFIER', value: '%d', line: 11 },
      { type: 'FORMAT_SPECIFIER', value: '%d', line: 11 },
      { type: 'FORMAT_SPECIFIER', value: '%d', line: 11 },
      { type: 'STRING_DELIMITADOR', value: '"', line: 11 },
      { type: 'OPERADOR', value: ',', line: 11 },
      { type: 'IDENTIFICADOR', value: 'num1', line: 11 },
      { type: 'OPERADOR', value: ',', line: 11 },
      { type: 'IDENTIFICADOR', value: 'num2', line: 11 },
      { type: 'OPERADOR', value: ',', line: 11 },
      { type: 'IDENTIFICADOR', value: 'sum', line: 11 },
      { type: 'PARENTESES', value: ')', line: 11 },
      { type: 'PONTO_VIRGULA', value: ';', line: 11 },
      { type: 'PALAVRA_RESERVADA', value: 'return', line: 13 },
      { type: 'NUMERO', value: '0', line: 13 },
      { type: 'PONTO_VIRGULA', value: ';', line: 13 },
      { type: 'CHAVES', value: '}', line: 14 }
    ];

    expect(actualTokens).toEqual(expectedTokens);
  });
});
