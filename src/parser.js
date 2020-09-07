const NodeType = {
  FUNCTION_CALL: "call",
  EXPRESSION: "expression",
  ASSIGNMENT: "assignment",
  FUNCTION_DECLARATION: "functionDeclaration",
  STATEMENT_LIST: "statementList",
  RETURN_STATEMENT: "returnStatement",
  EXECUTE_STATEMENT: "executeStatement",
  IF_STATEMENT: "ifStatement",
  NO_STATEMENT: "noStatement"
}

const ExpressionType = {
  BINARY_OPERATOR: "binaryOperator",
  UNARY_OPERATOR: "unaryOperator",
  NUMBER: "number",
  VARIABLE: "variable",
  STRING: "string",
  GETFUNC: "getfunc",
  DIRECT_BOOLEAN: "boolean"
}

const OperatorType = {
  PLUS: "+",
  MINUS: "-",
  MULTIPLY: "*",
  DIVIDE: "/",
  EQUALS: "==",
  GREATER_THAN: ">",
  LESS_THAN: "<"
}

class LangFunction {

  constructor(parameters, block, native, async, ar, code) {
    this.parameters = parameters;
    this.block = block;
    this.native = native;
    this.async = async;
    this.ar = ar;
    this.code = code;
  }
}
LangFunction.prototype.toString = function () {
  return "f()";
};

class Node {

  constructor(type, data) {
    this.type = type;
    this.data = data;
  }

  visit() {
    if (this.type == NodeType.EXPRESSION) {
      const checkOperand = (typeList, operand) => {
        return typeList.includes(typeof operand);
      }
      const operandError = (operand, operator) => {
        if (operand === undefined) {
          operand = "void";
        }

        throw new Error("Operator '" + operator + "' does not support operand '" + operand + "'");
      }

      if (this.data.type == ExpressionType.BINARY_OPERATOR) {
        if (this.data.operator == OperatorType.PLUS) {
          var operand1 = this.data.operand1.visit();
          var operand2 = this.data.operand2.visit();

          if (!checkOperand(["string", "number"], operand1)) {
            operandError(operand1, this.data.operator);
          }
          if (!checkOperand(["string", "number"], operand2)) {
            operandError(operand2, this.data.operator);
          }

          var result = operand1 + operand2;

          if (result > 2147483647 || result < -2147483647) {
            throw new Error("Max integer value is 2147483647");
          }

          return result;
        } else if (this.data.operator == OperatorType.MINUS) {
          var operand1 = this.data.operand1.visit();
          var operand2 = this.data.operand2.visit();

          if (!checkOperand(["number"], operand1)) {
            operandError(operand1, this.data.operator);
          }
          if (!checkOperand(["number"], operand2)) {
            operandError(operand2, this.data.operator);
          }

          var result = operand1 - operand2;

          if (result > 2147483647 || result < -2147483647) {
            throw new Error("Max integer value is 2147483647");
          }

          return result;
        } else if (this.data.operator == OperatorType.MULTIPLY) {
          var operand1 = this.data.operand1.visit();
          var operand2 = this.data.operand2.visit();

          if (!checkOperand(["string", "number"], operand1)) {
            operandError(operand1, this.data.operator);
          }
          if (!checkOperand(["string", "number"], operand2)) {
            operandError(operand2, this.data.operator);
          }
          if (typeof operand1 == "string" && typeof operand2 == "string") {
            throw new Error("Can't multiply 2 strings, only numbers or a string and a number");
          }

          if (typeof operand1 == "string") {
            return operand1.repeat(operand2);
          } else if (typeof operand2 == "string") {
            return operand2.repeat(operand1);
          } else {
            var result = operand1 * operand2;

            if (result > 2147483647 || result < -2147483647) {
              throw new Error("Max integer value is 2147483647");
            }

            return result;
          }
        } else if (this.data.operator == OperatorType.DIVIDE) {
          var operand1 = this.data.operand1.visit();
          var operand2 = this.data.operand2.visit();

          if (!checkOperand(["number"], operand1)) {
            operandError(operand1, this.data.operator);
          }
          if (!checkOperand(["number"], operand2)) {
            operandError(operand2, this.data.operator);
          }

          var result = operand1 / operand2;

          if (result > 2147483647 || result < -2147483647) {
            throw new Error("Max integer value is 2147483647");
          }

          return result;
        } else if (this.data.operator == OperatorType.EQUALS) {
          var operand1 = this.data.operand1.visit();
          var operand2 = this.data.operand2.visit();

          return operand1 == operand2;
        } else if (this.data.operator == OperatorType.GREATER_THAN) {
          var operand1 = this.data.operand1.visit();
          var operand2 = this.data.operand2.visit();

          if (!checkOperand(["number"], operand1)) {
            operandError(operand1, this.data.operator);
          }
          if (!checkOperand(["number"], operand2)) {
            operandError(operand2, this.data.operator);
          }

          return operand1 > operand2;
        } else if (this.data.operator == OperatorType.LESS_THAN) {
          var operand1 = this.data.operand1.visit();
          var operand2 = this.data.operand2.visit();

          if (!checkOperand(["number"], operand1)) {
            operandError(operand1, this.data.operator);
          }
          if (!checkOperand(["number"], operand2)) {
            operandError(operand2, this.data.operator);
          }

          return operand1 < operand2;
        }
      } else if (this.data.type == ExpressionType.UNARY_OPERATOR) {
        var operand = this.data.operand1.visit();

        if (!checkOperand(["number"], operand)) {
          operandError(operand, this.data.operator);
        }

        if (this.data.operator == OperatorType.PLUS) {
          return +operand;
        } else if (this.data.operator == OperatorType.MINUS) {
          return -operand;
        }
      } else if (this.data.type == ExpressionType.NUMBER || this.data.type == ExpressionType.STRING || this.data.type == ExpressionType.DIRECT_BOOLEAN) {
        return this.data.value;
      } else if (this.data.type == ExpressionType.VARIABLE) {
        var ar = CallStack.getCurrentAR();

        var value = ar.get(this.data.name);
        if (value !== undefined) {
          return value;
        } else {
          throw new Error("Variable '" + this.data.name + "' is not defined");
        }
      } else if (this.data.type == ExpressionType.GETFUNC) {
        var func = CallStack.getCurrentAR().getFunction(this.data.name);

        if (func === undefined) {
          throw new Error("Function '" + this.data.name + "' is not defined");
        }

        return func;
      }
    } else if (this.type == NodeType.ASSIGNMENT) {
      if (this.data.name.charAt(0) == "_") {
        throw new Error("Can't create or change static variables (starting with '_')");
      } else {
        CallStack.getCurrentAR().save(this.data.name, this.data.value.visit(), this.data.declare);
      }
    } else if (this.type == NodeType.STATEMENT_LIST) {
      if (CallStack.getCurrentAR().type == ARType.GLOBAL && this.data.statements.length == 1) {
        return this.data.statements[0].visit();
      }

      for (var i = 0; i < this.data.statements.length; i++) {
        this.data.statements[i].visit();

        if (CallStack.getReturnValue() !== undefined) {
          break;
        }
      }
    } else if (this.type == NodeType.FUNCTION_DECLARATION) {
      CallStack.getCurrentAR().addFunction(this.data.name, new LangFunction(this.data.parameters, this.data.block, false, this.data.async, CallStack.getCurrentAR(), null));
    } else if (this.type == NodeType.FUNCTION_CALL) {
      var previousAR = CallStack.getCurrentAR();
      var func = previousAR.getFunction(this.data.name);

      if (func === undefined) {
        throw new Error("Function '" + this.data.name + "' is not defined");
      }

      if (func.async) {
        throw new Error("Async functions aren't supported yet");
      }

      var result;

      var times = this.data.times.visit();
      if (typeof times !== "number") {
        throw new Error("Function execute number must be a number");
      }

      for (var j = 0; j < times; j++) {
        var ar = new ActivationRecord(this.data.name, ARType.FUNCTION, func.ar, previousAR);

        var formalParameters = func.parameters;
        var actualParameters = this.data.parameters;

        for (var i = 0; i < formalParameters.length; i++) {
          var name = formalParameters[i];
          if (actualParameters[name] === undefined) {
            throw new Error("Parameter not present in function call '" + this.data.name + "': '" + name + "'");
          }

          ar.save(name, actualParameters[name].visit(), true);
        }

        CallStack.setCurrentAR(ar);

        if (func.native) {
          CallStack.setReturnValue(func.code(ar));
        } else {
          func.block.visit();
        }

        result = CallStack.getReturnValue();
        CallStack.setReturnValue(undefined);

        CallStack.setCurrentAR(previousAR);
      }

      return result;
    } else if (this.type == NodeType.IF_STATEMENT) {
      var previousAR = CallStack.getCurrentAR();
      var ar = new ActivationRecord(null, ARType.IF_STATEMENT, previousAR, previousAR);
      CallStack.setCurrentAR(ar);

      var bool = this.data.expression.visit();

      if (typeof bool !== "boolean") {
        throw new Error("If expression is not a boolean");
      }

      if (bool) {
        this.data.block.visit();
      }

      CallStack.setCurrentAR(previousAR);
    } else if (this.type == NodeType.EXECUTE_STATEMENT) {
      throw new Error("Execute statements aren't supported yet");

      /*var previousAR = CallStack.getCurrentAR();
      var func = this.data.func.visit();

      if (func.async) {
        throw new Error
      }

      var ar = new ActivationRecord(null, ARType.ANONYMOUS_FUNCTION, func.ar, previousAR);

      var formalParameters = func.parameters;
      var actualParameters = this.data.parameters;

      for (var i = 0; i < formalParameters.length; i++) {
        var name = formalParameters[i];
        if (actualParameters[name] === undefined) {
          throw new Error("Parameter not present in function call '" + this.data.name + "': '" + name + "'");
        }

        ar.save(name, actualParameters[name].visit(), true);
      }

      CallStack.setCurrentAR(ar);

      if (func.native) {
        func.code(ar);
      } else {
        func.block.visit();
      }

      var result = CallStack.getReturnValue();
      CallStack.setReturnValue(undefined);

      CallStack.setCurrentAR(previousAR);

      return result;*/
    } else if (this.type == NodeType.RETURN_STATEMENT) {
      CallStack.setReturnValue(this.data.value.visit());
    }
  }
}

class Parser {

  constructor(text) {
    this.lexer = new Lexer(text);
    this.currentToken = this.lexer.getNextToken();
  }

  eat(tokentype) {
    if (this.currentToken.type == tokentype) {
      this.currentToken = this.lexer.getNextToken();
    } else {
      if (this.currentToken.type !== TokenType.EOF) {
        throw new Error("Unexpected token: '" + this.currentToken.value + "', at " + this.currentToken.line + ":" + this.currentToken.column);
      } else {
        console.log(tokentype + " expected");
        throw new Error("Unexpected line end");
      }
    }
  }

  formalParameterList() {
    //formalParameterList: (IDENTIFIER (COMMA IDENTIFIER)*)?
    var parameters = [];

    if (this.currentToken.type == TokenType.IDENTIFIER) {
      parameters.push(this.currentToken.value);
      this.eat(TokenType.IDENTIFIER);

      while (this.currentToken.type == TokenType.COMMA) {
        this.eat(TokenType.COMMA);
        parameters.push(this.currentToken.value);
        this.eat(TokenType.IDENTIFIER);
      }
    }

    return parameters;
  }

  actualParameter() {
    //actualParameter: IDENTIFIER COLON expression
    var name = this.currentToken.value;
    this.eat(TokenType.IDENTIFIER);
    this.eat(TokenType.COLON);

    var value = this.expression();

    return { name: name, value: value };
  }

  actualParameterList() {
    //actualParameterList: (parameter (COMMA parameter)*)?
    var parameters = [];

    if (this.currentToken.type == TokenType.IDENTIFIER) {
      var parameter = this.actualParameter();
      parameters[parameter.name] = parameter.value;

      while (this.currentToken.type == TokenType.COMMA) {
        this.eat(TokenType.COMMA);

        parameter = this.actualParameter();
        parameters[parameter.name] = parameter.value;
      }
    }

    return parameters;
  }

  functionCall(name) {
    this.eat(TokenType.ROUND_BRACE_OPEN);

    var parameters = this.actualParameterList();

    this.eat(TokenType.ROUND_BRACE_CLOSE);

    var times = new Node(NodeType.EXPRESSION, {
      type: ExpressionType.NUMBER,
      value: 1
    });

    if (this.currentToken.type == TokenType.TIMES) {
      this.eat(TokenType.TIMES);
      times = this.expression();
    }

    return new Node(NodeType.FUNCTION_CALL, {
      name: name,
      parameters: parameters,
      times: times
    });
  }

  executeStatement() {
    this.eat(TokenType.EXECUTE);
    var func = this.expression();
    this.eat(TokenType.COMMA);
    this.eat(TokenType.ROUND_BRACE_OPEN);

    var parameters = this.actualParameterList();

    this.eat(TokenType.ROUND_BRACE_CLOSE);

    return new Node(NodeType.EXECUTE_STATEMENT, {
      func: func,
      parameters: parameters
    });
  }

  getFunc() {
    this.eat(TokenType.GETFUNC);
    var name = this.currentToken.value;
    this.eat(TokenType.IDENTIFIER);

    return new Node(NodeType.EXPRESSION, {
      type: ExpressionType.GETFUNC,
      name: name
    });
  }

  functionDeclaration() {
    var async = false;
    if (this.currentToken.type == TokenType.ASYNC) {
      this.eat(TokenType.ASYNC);
      async = true;
    }

    this.eat(TokenType.FUNCTION);
    var name = this.currentToken.value;
    this.eat(TokenType.IDENTIFIER);
    this.eat(TokenType.ROUND_BRACE_OPEN);

    var parameters = this.formalParameterList();

    this.eat(TokenType.ROUND_BRACE_CLOSE);

    var block = this.block();

    return new Node(NodeType.FUNCTION_DECLARATION, {
      name: name,
      parameters: parameters,
      block: block,
      async: async
    });
  }

  factor() {
    //factor: INTEGER | STRING | ROUND_BRACE_OPEN expression ROUND_BRACE_CLOSE | PLUS factor | MINUS factor | variable | functionCall | getfunc | executeStatement
    if (this.currentToken.type == TokenType.INTEGER) {
      var value = this.currentToken.value;
      this.eat(TokenType.INTEGER);
      return new Node(NodeType.EXPRESSION, {
        type: ExpressionType.NUMBER,
        value: Number.parseInt(value)
      });
    } else if (this.currentToken.type == TokenType.STRING) {
      var value = this.currentToken.value;
      this.eat(TokenType.STRING);
      return new Node(NodeType.EXPRESSION, {
        type: ExpressionType.STRING,
        value: value
      });
    } else if (this.currentToken.type == TokenType.ROUND_BRACE_OPEN) {
      this.eat(TokenType.ROUND_BRACE_OPEN);
      var expression = this.expression();
      this.eat(TokenType.ROUND_BRACE_CLOSE);
      return expression;
    } else if (this.currentToken.type == TokenType.PLUS) {
      this.eat(TokenType.PLUS);
      return new Node(NodeType.EXPRESSION, {
        type: ExpressionType.UNARY_OPERATOR,
        operand1: this.factor(),
        operator: OperatorType.PLUS
      });
    } else if (this.currentToken.type == TokenType.MINUS) {
      this.eat(TokenType.MINUS);
      return new Node(NodeType.EXPRESSION, {
        type: ExpressionType.UNARY_OPERATOR,
        operand1: this.factor(),
        operator: OperatorType.MINUS
      });
    } else if (this.currentToken.type == TokenType.GETFUNC) {
      return this.getFunc();
    } else if (this.currentToken.type == TokenType.EXECUTE) {
      return this.executeStatement();
    } else if (this.currentToken.type == TokenType.IDENTIFIER) {
      console.log("factor identifier");
      var name = this.currentToken.value;
      this.eat(TokenType.IDENTIFIER);

      if (this.currentToken.type == TokenType.ROUND_BRACE_OPEN) {
        return this.functionCall(name);
      } else {
        return new Node(NodeType.EXPRESSION, {
          type: ExpressionType.VARIABLE,
          name: name
        });
      }
    } else {
      return new Node(NodeType.NO_STATEMENT, {});
    }
  }

  term() {
    //term: factor ((MULTIPLY | DIVIDE) factor)*
    var result = this.factor();

    while (this.currentToken.type == TokenType.MULTIPLY || this.currentToken.type == TokenType.DIVIDE) {
      if (this.currentToken.type == TokenType.MULTIPLY) {
        this.eat(TokenType.MULTIPLY);
        result = new Node(NodeType.EXPRESSION, {
          type: ExpressionType.BINARY_OPERATOR,
          operand1: result,
          operand2: this.factor(),
          operator: OperatorType.MULTIPLY
        });
      } else {
        this.eat(TokenType.DIVIDE);
        result = new Node(NodeType.EXPRESSION, {
          type: ExpressionType.BINARY_OPERATOR,
          operand1: result,
          operand2: this.factor(),
          operator: OperatorType.DIVIDE
        });
      }
    }

    return result;
  }

  booleanExpression() {
    var value = this.currentToken.value;

    if (this.currentToken.type == TokenType.TRUE) {
      this.eat(TokenType.TRUE);
    } else {
      this.eat(TokenType.FALSE);
    }

    return new Node(NodeType.EXPRESSION, {
      type: ExpressionType.DIRECT_BOOLEAN,
      value: value
    });
  }

  booleanExpressionWithFirst(leftHand) {
    //booleanExpression: expression (EQUALS | GREATER_THAN | LESS_THAN) expression
    if (this.currentToken.type == TokenType.EQUALS) {
      this.eat(TokenType.EQUALS);

      var rightHand = this.expression();

      return new Node(NodeType.EXPRESSION, {
        type: ExpressionType.BINARY_OPERATOR,
        operand1: leftHand,
        operand2: rightHand,
        operator: OperatorType.EQUALS
      });
    } else if (this.currentToken.type == TokenType.GREATER_THAN) {
      this.eat(TokenType.GREATER_THAN);

      var rightHand = this.expression();

      return new Node(NodeType.EXPRESSION, {
        type: ExpressionType.BINARY_OPERATOR,
        operand1: leftHand,
        operand2: rightHand,
        operator: OperatorType.GREATER_THAN
      });
    } else {
      this.eat(TokenType.LESS_THAN);

      var rightHand = this.expression();

      return new Node(NodeType.EXPRESSION, {
        type: ExpressionType.BINARY_OPERATOR,
        operand1: leftHand,
        operand2: rightHand,
        operator: OperatorType.LESS_THAN
      });
    }
  }

  expression() {
    //expression: term ((PLUS | MINUS) term)* | booleanExpression
    if (this.currentToken.type == TokenType.TRUE || this.currentToken.type == TokenType.FALSE) {
      return this.booleanExpression();
    } else {
      var result = this.term();

      while (this.currentToken.type == TokenType.PLUS || this.currentToken.type == TokenType.MINUS) {
        if (this.currentToken.type == TokenType.PLUS) {
          this.eat(TokenType.PLUS);
          result = new Node(NodeType.EXPRESSION, {
            type: ExpressionType.BINARY_OPERATOR,
            operand1: result,
            operand2: this.term(),
            operator: OperatorType.PLUS
          });
        } else {
          this.eat(TokenType.MINUS);
          result = new Node(NodeType.EXPRESSION, {
            type: ExpressionType.BINARY_OPERATOR,
            operand1: result,
            operand2: this.term(),
            operator: OperatorType.MINUS
          });
        }
      }

      if (this.currentToken.type == TokenType.EQUALS || this.currentToken.type == TokenType.GREATER_THAN || this.currentToken.type == TokenType.LESS_THAN) {
        return this.booleanExpressionWithFirst(result);
      }

      return result;
    }
  }

  assignment() {
    //assigment: (VAR)? (UNDERLYING)* variable ASSIGN expression
    var declare = false;
    if (this.currentToken.type == TokenType.VAR) {
      declare = true;
      this.eat(TokenType.VAR);
    }

    var name = this.currentToken.value;
    this.eat(TokenType.IDENTIFIER);
    this.eat(TokenType.ASSIGN);
    var value = this.expression();

    return new Node(NodeType.ASSIGNMENT, {
      name: name,
      value: value,
      declare: declare
    });
  }

  statement() {
    console.log
    //statement: assignment | expression | functionDeclaration | returnStatement | ifStatement
    var peekToken = this.lexer.peekToken();

    if (peekToken.type == TokenType.ASSIGN || this.currentToken.type == TokenType.VAR) {
      return this.assignment();
    } else if (this.currentToken.type == TokenType.FUNCTION || this.currentToken.type == TokenType.ASYNC) {
      return this.functionDeclaration();
    } else if (this.currentToken.type == TokenType.RETURN) {
      return this.returnStatement();
    } else if (this.currentToken.type == TokenType.IF) {
      return this.ifStatement();
    } else {
      return this.expression();
    }
  }

  block() {
    //block: BLOCK_OPEN (statementList)? BLOCK_CLOSE
    this.eat(TokenType.BLOCK_OPEN);
    var statements = new Node(NodeType.STATEMENT_LIST, {
      statements: []
    });

    if (this.currentToken.type !== TokenType.BLOCK_CLOSE) {
      statements = this.statementList();
    }
    this.eat(TokenType.BLOCK_CLOSE);

    return statements;
  }

  returnStatement() {
    //returnStatement: RETURN expression
    this.eat(TokenType.RETURN);
    var value = this.expression();

    return new Node(NodeType.RETURN_STATEMENT, {
      value: value
    });
  }

  ifStatement() {
    //ifStatement: IF epxression block
    this.eat(TokenType.IF);

    var expression = this.expression();

    var block = this.block();

    return new Node(NodeType.IF_STATEMENT, {
      expression: expression,
      block: block
    });
  }

  statementList() {
    //statementList: statement (SEMICOLON statement)* SEMICOLON
    var statements = [];
    statements.push(this.statement());

    while (this.currentToken.type == TokenType.SEMICOLON) {
      this.eat(TokenType.SEMICOLON);

      statements.push(this.statement());
    }

    console.log(this.currentToken.type + " hoi");
    //this.eat(TokenType.SEMICOLON);

    return new Node(NodeType.STATEMENT_LIST, {
      statements: statements
    });
  }

  parse() {
    var result = this.statementList();
    this.eat(TokenType.EOF);
    return result;
  }
}
