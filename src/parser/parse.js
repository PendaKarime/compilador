class Parser {
  constructor(tokens) {
    this.tokens = tokens;
    this.current = 0;
  }

  parse() {
    const declarations = [];
    while (!this.isAtEnd()) {
      const token = this.peek();
      console.log(`Parsing declaration at token index ${this.current}: ${JSON.stringify(token)}`);
      if (token.type === 'DIRECTIVA' || token.type === 'COMENTARIO') {
        this.advance();  // Ignora diretivas e comentários
      } else {
        declarations.push(this.declaration());
      }
    }
    return { type: 'program', body: declarations };
  }

  declaration() {
    console.log("Inside declaration()");
    console.log("Current token:", this.peek());

    const typeToken = this.consume("PALAVRA_RESERVADA", "Expect type specifier.");
    console.log("Type token:", typeToken);

    const nameToken = this.consume("IDENTIFICADOR", "Expect identifier.");
    console.log("Name token:", nameToken);

    if (nameToken.value === 'main') {
      // Process main function declaration
      this.consume("PARENTESES", "Expect '(' after main.");
      this.consume("PARENTESES", "Expect ')' after '('.");
      this.consume("CHAVES", "Expect '{' at the beginning of main function body.");
      const body = this.block();
      return { type: 'function_declaration', returnType: typeToken.value, name: nameToken.value, parameters: [], body };
    } else {
      // Process other variable declarations
      return this.variableDeclaration(typeToken, nameToken);
    }
  }

  variableDeclaration(typeToken, nameToken) {
    let initializer = null;
    if (this.match("OPERADOR", "=")) {
      initializer = this.expression();
    }
    this.consume("PONTO_VIRGULA", "Expect ';' after variable declaration.");
    return { type: 'variable_declaration', varType: typeToken.value, name: nameToken.value, initializer };
}

  block() {
    console.log("Entering block()");
    const body = [];
    while (!this.check("CHAVES", "}")) {
      if (this.peek().type === 'PONTO_VIRGULA') {
        this.advance(); // Ignora ponto e vírgula
      } else {
        body.push(this.statement());
      }
    }
    this.consume("CHAVES", "Expect '}' after block.");
    console.log("Exiting block()");
    return { type: 'block', body };
  }


  statement() {
    console.log("Entering statement()");
    console.log("Current token in statement:", this.peek());

    if (this.check("PALAVRA_RESERVADA", "int")) {
      return this.declaration();
    }

    if (this.check("FUNCAO_DE_CHAMADA", "printf")) {
      return this.printStatement();
    }

    if (this.check("PALAVRA_RESERVADA", "return")) {
      return this.returnStatement();
    }

    if (this.check("PALAVRA_RESERVADA", "if")) {
      return this.ifStatement();
    }

    if (this.check("PALAVRA_RESERVADA", 'else')) {
      return this.elseStatement();
    }

    if (this.check("PALAVRA_RESERVADA", "for")) {
      return this.forStatement();
    }

    if (this.check("PALAVRA_RESERVADA", "while")) {
      return this.whileStatement();
    }

    if (this.check("IDENTIFICADOR")) { // Se for um identificador, pode ser uma expressão de atribuição
      // const token = this.peek();
      const nextToken = this.tokens[this.current + 1]; // Verifica o próximo token
      
      if (nextToken && nextToken.type === "OPERADOR" && nextToken.value === "=") {
        // Se o próximo token for um operador de atribuição "=", então trata-se de uma expressão de atribuição
        return this.expressionStatement();
      }
    }

    throw new Error("Unexpected statement.");
  }

  expressionStatement() {
    const identifierToken = this.consume("IDENTIFICADOR", "Expect identifier.");
    // const operatorToken = this.consume("OPERADOR", "Expect '=' after identifier.");
    const value = this.expression();
    this.consume("PONTO_VIRGULA", "Expect ';' after expression.");
    return { type: 'expression_statement', identifier: identifierToken.value, value };
  }


  printStatement() {
    const funcCall = this.consume("FUNCAO_DE_CHAMADA", "Expect 'printf'.");
    this.consume("PARENTESES", "Expect '(' after 'printf'.");

    const formatString = [];
    this.consume("STRING_DELIMITADOR", "Expect string delimiter '\"'.");

    while (!this.check("STRING_DELIMITADOR")) {
      formatString.push(this.advance().value);
    }

    this.consume("STRING_DELIMITADOR", "Expect string delimiter '\"'.");

    const formatStringValue = formatString.join('');

    const args = [];
    if (this.match("OPERADOR", ",")) {
      do {
        args.push(this.expression());
      } while (this.match("OPERADOR", ","));
    }

    this.consume("PARENTESES", "Expect ')' after arguments.");
    this.consume("PONTO_VIRGULA", "Expect ';' after printf statement.");
    return { type: 'print_statement', funcCall, formatString: formatStringValue, args };
  }

  returnStatement() {
    const keyword = this.consume("PALAVRA_RESERVADA", "Expect 'return'.");
    const value = this.expression();
    this.consume("PONTO_VIRGULA", "Expect ';' after return value.");
    return { type: 'return_statement', keyword: keyword.value, value };
  }
  ifStatement() {
    this.consume("PALAVRA_RESERVADA", "Expect 'if'.");
    this.consume("PARENTESES", "Expect '(' after 'if'.");
    const condition = this.expression();
    this.consume("PARENTESES", "Expect ')' after if condition.");
    this.consume("CHAVES", "Expect '{' before if block.");
    const thenBranch = this.block();

    let elseBranch = null;
    if (this.match("PALAVRA_RESERVADA", "else")) {
      this.consume("CHAVES", "Expect '{' before else block.");
      elseBranch = this.block();
    }

    return { type: 'if_statement', condition, thenBranch, elseBranch };
  }

  elseStatement() {
    this.consume("PALAVRA_RESERVADA", "Expect 'else'.");
    return this.block();
  }


  forStatement() {
    this.consume("PALAVRA_RESERVADA", "Expect 'for'.");
    this.consume("PARENTESES", "Expect '(' after 'for'.");

    let initializer = null;
    if (this.peek().type !== 'PONTO_VIRGULA') {
      initializer = this.expression();
    }
    this.consume("PONTO_VIRGULA", "Expect ';' after initializer.");

    let condition = null;
    if (this.peek().type !== 'PONTO_VIRGULA') {
      condition = this.expression();
      this.consume("PONTO_VIRGULA", "Expect ';' after condition.");
    } else {
      this.consume("PONTO_VIRGULA", "Expect ';' after initializer.");
    }

    let increment = null;
    if (this.peek().type !== 'PARENTESES') {
      increment = this.expression();
    }
    this.consume("PARENTESES", "Expect ')' after increment.");

    const body = this.block();

    return { type: 'for_statement', initializer, condition, increment, body };
  }

  whileStatement() {
    this.consume("PALAVRA_RESERVADA", "Expect 'while'.");
    this.consume("PARENTESES", "Expect '(' after 'while'.");
    const condition = this.expression();
    this.consume("PARENTESES", "Expect ')' after condition.");
    const body = this.block();
    return { type: 'while_statement', condition, body };
  }

  expression() {
    let expr = this.primary();

    while (this.match("OPERADOR", "+")) {
      const operator = this.previous();
      const right = this.primary();
      expr = { type: 'binary_expression', operator: operator.value, left: expr, right };
    }

    return expr;
  }

  primary() {
    if (this.match("NUMERO") || this.match("IDENTIFICADOR")) {
      console.log("Found number or identifier:", this.peek());
      return this.previous();
    }

    if (this.match("OPERADOR", "=")) {
      console.log("Found assignment operator:", this.peek());
      const value = this.expression();
      return { type: 'assignment', value };
    }

    console.error("Unexpected token:", this.peek());
    throw new Error("Expect number or identifier.");
  }

  match(...types) {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  consume(type, message) {
    const token = this.peek();
    if (this.check(type)) return this.advance();
    console.error(`Error consuming token: expected ${type}, got ${token.type}`);
    throw new Error(message);
  }

  check(type, value) {
    if (this.isAtEnd()) return false;
    const token = this.peek();
    if (value === undefined) {
      return token.type === type;
    }
    return token.type === type && token.value === value;
  }

  advance() {
    if (!this.isAtEnd()) this.current++;
    return this.previous();
  }

  isAtEnd() {
    return this.current >= this.tokens.length || this.peek().type === "EOF";
  }

  peek() {
    return this.tokens[this.current] || { type: "EOF" };
  }

  previous() {
    return this.tokens[this.current - 1];
  }
}

module.exports = Parser;
