class Client{constructor({prefix:e="!",self_commands:t=!0,queue:s=!1,queue_max_length:a=5,fetchInterval:i=100,autosaveInterval:n=1e4}={prefix:"!",self_commands:!0,queue:!1,queue_max_length:5,fetchInterval:100,autosaveInterval:1e4}){this.commands=new Map,this.events={},this.handledMessages=null===localStorage.getItem("handledMessages")?new Array:Array.from(JSON.parse(localStorage.getItem("handledMessages"))),setInterval(()=>{if(null!==getChat()){const i=s?[].slice.call(getChat().children,-a):[getChat().lastChild];for(const s of i)if(s.hasAttribute("data-id")&&!this.handledMessages.includes(s.getAttribute("data-id"))){this.handledMessages.push(s.getAttribute("data-id"));const a=this.getMessageFromElement(s);if(void 0!==a){if(t||s.getAttribute("data-id").startsWith("false_"))for(const[t,s]of this.commands.entries())if(a.content.message.startsWith(e+t))return s(a,a.content.message.substring(e.length+t.length).split(" ").splice(1)),void this.emit("command",[t,s]);this.emit("message",a),this.emit("message_"+(s.getAttribute("data-id").startsWith("true_")?"self":"other"),a)}}}},i),setInterval(()=>{localStorage.setItem("handledMessages",JSON.stringify(null===localStorage.getItem("handledMessages")?new Array:Array.from(JSON.parse(localStorage.getItem("handledMessages"))).slice(-10*a)))},n),this.emit("init")}registerCommand(e,t){this.commands.set(e,t)}unregisterCommand(e){this.commands.delete(e)}emit(e,...t){for(let s of this.events[e]||[])s(...t)}on(e,t){return(this.events[e]=this.events[e]||[]).push(t),()=>this.events[e]=this.events[e].filter(e=>e!==t)}sendMessage(e){const t=getTextBox().textContent;getTextBox().textContent=e,getTextBox().dispatchEvent(new InputEvent("input",{bubbles:!0})),new Promise(e=>{null!==getSendButton()&&(getSendButton().click(),getTextBox().textContent=t,getTextBox().dispatchEvent(new InputEvent("input",{bubbles:!0})),e())})}gotoNewestChat(){for(const e of getChats().children)"translateY(0px)"===e.style.transform&&e.firstChild.firstChild.lastChild.firstChild.firstChild.firstChild.firstChild.dispatchEvent(new MouseEvent("mousedown",{bubbles:!0}))}getMessageFromElement(e){if(null===e.querySelector("[data-pre-plain-text]"))return;const t=e.querySelector("[data-pre-plain-text]").getAttribute("data-pre-plain-text").match(/\] (.*):/)[1],s=e.querySelector("[data-pre-plain-text]").lastChild.children[getChat().lastChild.querySelector("[data-pre-plain-text]").lastChild.childElementCount-2].innerText,a=null===e.querySelector("[data-pre-plain-text]").firstChild.firstChild.firstChild.lastChild.firstChild?null:e.querySelector("[data-pre-plain-text]").firstChild.firstChild.firstChild.lastChild.firstChild.lastChild.innerText,i=Array.from(e.querySelector("[data-pre-plain-text]").querySelectorAll("[src^=data]")),n=e.querySelector("[data-pre-plain-text]").getAttribute("data-pre-plain-text").match(/\[(.*)\]/)[1];return new Message(t,new MessageContent(s,a,i),n)}}const getTextBox=()=>document.querySelector("#main > footer > div._3ee1T._1LkpH.copyable-area > div._3uMse > div > div._3FRCZ.copyable-text.selectable-text"),getSendButton=()=>document.querySelector("#main > footer > div._3ee1T._1LkpH.copyable-area > div:nth-child(3) > button"),getChat=()=>document.querySelector("#main > div._3h-WS > div > div > div.z_tTQ"),getChats=()=>document.querySelector("#pane-side > div:nth-child(1) > div > div");class Message{constructor(e,t,s){this.sender=e,this.content=t,this.timestamp=s}}class MessageContent{constructor(e,t,s){this.message=e,this.reaction=t,this.images=s}}

const TokenType = {
  IDENTIFIER: "identifier",
  ROUND_BRACE_OPEN: "(",
  ROUND_BRACE_CLOSE: ")",
  STRING: "string",
  SEMICOLON: ";",
  EOF: "eof",
  COLON: ":",
  COMMA: ",",
  UNKNOWN: "unknown",
  PLUS: "+",
  MINUS: "-",
  INTEGER: "integer",
  MULTIPLY: "*",
  DIVIDE: "/",
  ASSIGN: "=",
  FUNCTION: "function",
  BLOCK_OPEN: "{",
  BLOCK_CLOSE: "}",
  RETURN: "return",
  GETFUNC: "%",
  EXECUTE: "execute",
  IF: "if",
  EQUALS: "==",
  GREATER_THAN: ">",
  LESS_THAN: "<",
  TRUE: "true",
  FALSE: "false",
  TIMES: "#",
  VAR: "var",
  ASYNC: "async"
}

class Token {

  constructor(type, value, line, column) {
    this.type = type;
    this.value = value;
    this.line = line;
    this.column = column;
  }
}

function isLetter(char) {
  var regex = /[A-Za-z]/;
  return regex.test(char)
}

function isDigit(char) {
  return /\d/.test(char);
}

var lexerText = "";
var lexerPos = 0;
var lexerColumn = 1;
var lexerLine = 1;
var lexerText;
var currentChar = "";

class Lexer {

  constructor(text) {
    lexerPos = 0;
    lexerColumn = 1;
    lexerLine = 1;
    lexerText = text;
    currentChar = lexerText.charAt(lexerPos);
  }

  advance() {
    if (currentChar == "\n") {
      lexerLine += 1;
      lexerColumn = 0;
    }

    lexerPos += 1;
    currentChar = lexerText.charAt(lexerPos);
    lexerColumn += 1;
  }

  peekChar() {
    return lexerText.charAt(lexerPos + 1);
  }

  getNextToken() {
    var token = undefined;

    while (/\s+/.test(currentChar)) {
      this.advance();
    }

    Object.keys(TokenType).forEach(function (key) {
      var value = TokenType[key];
      if (value.length == 1) {
        if (currentChar == value) {
          token = new Token(value, currentChar, lexerLine, lexerColumn);
        }
      } else if (value.length == 2) {
        var peek = this.peekChar();
        if (currentChar == value.charAt(0) && peek == value.charAt(1)) {
          token = new Token(value, currentChar + peek, lexerLine, lexerColumn);
          this.advance();
        }
      }
    }, this);

    if (token !== undefined) {
      this.advance();
      return token;
    } else {
      if (currentChar == '"') {
        this.advance();
        var string = "";

        var line = lexerLine;
        var column = lexerColumn;

        while (currentChar !== '"' && currentChar !== "") {
          string += currentChar;
          this.advance();
        }

        if (currentChar == "") {
          throw new Error("Unterminated string");
        }

        this.advance();

        return new Token(TokenType.STRING, string, line, column);
      } else if (isLetter(currentChar) || currentChar == '_') {
        var id = "";

        var line = lexerLine;
        var column = lexerColumn;

        while (isLetter(currentChar) || currentChar == '_' || isDigit(currentChar)) {
          id += currentChar;
          this.advance();
        }

        if (id == "function") {
          return new Token(TokenType.FUNCTION, id, line, column);
        } else if (id == "return") {
          return new Token(TokenType.RETURN, id, line, column);
        } else if (id == "execute") {
          return new Token(TokenType.EXECUTE, id, line, column);
        } else if (id == "if") {
          return new Token(TokenType.IF, id, line, column);
        } else if (id == "true") {
          return new Token(TokenType.TRUE, true, line, column);
        } else if (id == "false") {
          return new Token(TokenType.FALSE, false, line, column);
        } else if (id == "var") {
          return new Token(TokenType.VAR, id, line, column);
        } else if (id == "async") {
          return new Token(TokenType.ASYNC, id, line, column);
        }

        return new Token(TokenType.IDENTIFIER, id, line, column);
      } else if (currentChar == "") {
        return new Token(TokenType.EOF, "", lexerLine, lexerColumn);
      } else if (isDigit(currentChar)) {
        var integer = "";

        var line = lexerLine;
        var column = lexerColumn;

        while (isDigit(currentChar)) {
          integer += currentChar;
          this.advance();
        }

        if (integer.length > 10) {
          throw new Error("Max integer value is 2147483647");
        }
        if (integer.length == 10) {
          if (integer > 2147483647) {
            throw new Error("Max integer value is 2147483647");
          }
        }

        return new Token(TokenType.INTEGER, integer, line, column);
      } else {
        throw new Error("Unknown character: '" + currentChar + "', at " + lexerLine + ":" + lexerColumn);
      }
    }
  }

  peekToken() {
    var originalPos = lexerPos;
    var originalLine = lexerLine;
    var originalColumn = lexerColumn;
    this.advance();
    var token = this.getNextToken();
    lexerPos = originalPos;
    currentChar = lexerText.charAt(lexerPos);
    lexerColumn = originalColumn;
    lexerLine = originalLine;
    return token;
  }
}


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


class WaLang {

    static setup() {
        var globalAr = new ActivationRecord("_GLOBAL", ARType.GLOBAL, null, null);

        globalAr.save("_COOLNESSLEVEL", "Very Cool", true);
        globalAr.save("_HELP", "-------* Help Menu *-------\nNothing here, yet!", true);
        globalAr.addFunction("print", new LangFunction(["message"], null, true, false, globalAr, function(ar) {
            Console.log(ar.get("message"));
        }));
        globalAr.addFunction("random", new LangFunction([], null, true, false, globalAr, function(ar) {
            return Math.random();
        }));
        globalAr.addFunction("hours", new LangFunction([], null, true, false, globalAr, function(ar) {
            var currentdate = new Date();
            return currentdate.getHours();
        }));
        globalAr.addFunction("minutes", new LangFunction([], null, true, false, globalAr, function(ar) {
            var currentdate = new Date();
            return currentdate.getMinutes();
        }));
        globalAr.addFunction("seconds", new LangFunction([], null, true, false, globalAr, function(ar) {
            var currentdate = new Date();
            return currentdate.getSeconds();
        }));
        globalAr.addFunction("millis", new LangFunction([], null, true, false, globalAr, function(ar) {
            var currentdate = new Date();
            return currentdate.getMilliseconds();
        }));

        CallStack.setCurrentAR(globalAr);
    }
}

var programRunning = false;

class Console {

    static log(message) {
        client.sendMessage(message);
    }

    static error(message) {
        client.sendMessage("*Error: " + message + "*");
    }

    static logRed(message) {
        client.sendMessage("*" + message + "*");
    }

    static programStarted(name) {
        client.sendMessage("Starting program _" + name + "_...");
        programRunning = true;
    }

    static programEnded() {
        client.sendMessage("Program finished.");
        programRunning = false;
    }
}

var currentAR;
var returnValue;

class CallStack {

    static setCurrentAR(ar) {
        currentAR = ar;
    }

    static getCurrentAR() {
        return currentAR;
    }

    static clear() {
        //Remove all activiation records except global (this plus stopping walking the AST terminates the program)
        while (currentAR.type !== ARType.GLOBAL) {
            currentAR = currentAR.caller;
        }
    }

    static asString() {
        var string = "Call Stack (most recent call first):\n" + currentAR.asString();

        return string;
    }

    static setReturnValue(value) {
        returnValue = value;
    }

    static getReturnValue() {
        return returnValue;
    }
}

const ARType = {
    GLOBAL: "g",
    PROGRAM: "program",
    FUNCTION: "f()",
    ANONYMOUS_FUNCTION: "anonymous f()",
    IF_STATEMENT: "if"
}

class ActivationRecord {

    constructor(name, type, underlyingAR, caller) {
        this.functions = {};
        this.name = name;
        this.type = type;
        this.underlyingAR = underlyingAR;
        this.caller = caller;
        if (underlyingAR !== null) {
            this.level = underlyingAR.level + 1;
        } else {
            this.level = 0;
        }
        if (caller !== null) {
            this.callLevel = caller.callLevel + 1;

            if (this.callLevel > 2000) {
                throw new Error("Max stack size exceeded (2000)");
            }
        } else {
            this.callLevel = 0;
        }

        this.vars = { _CONTEXT: this.asString() };
    }

    forceSave(name, value) {
        this.vars[name] = value;
    }

    save(name, value, declare) {
        if (declare) {
            if (this.getLocal(name) !== undefined) {
                throw new Error("Variable '" + name + "' is already declared");
            }

            this.vars[name] = value;
        } else {
            if (this.getLocal(name) === undefined) {
                if (this.underlyingAR !== null) {
                    this.underlyingAR.save(name, value, false);
                } else {
                    throw new Error("Variable '" + name + "' is not declared");
                }
            } else {
                this.vars[name] = value;
            }
        }
    }

    addFunction(name, func) {
        this.functions[name] = func;
    }

    getLocal(name) {
        return this.vars[name];
    }

    get(name) {
        var result = this.vars[name];

        //If not found in this scope, check in the underlying scopes
        if (result === undefined && this.level > 0) {
            result = this.underlyingAR.get(name);
        }

        return result;
    }

    getFunction(name) {
        var result = this.functions[name];

        //If not found in this scope, check in the underlying scopes
        if (result === undefined && this.level > 0) {
            result = this.underlyingAR.getFunction(name);
        }

        return result;
    }

    asString() {
        return "    " + this.callLevel + ": " + this.type + (this.name == null ? "" : " " + this.name) + (this.caller == null ? "" : "\n" + this.caller.asString());
    }
}

class Interpreter {

    static execute(commandString) {
        try {
            var tree = new Parser(commandString).parse();
        } catch (error) {
            Console.error(error.message);
            console.error(error);
  
            return;
        }
        try {
            var result = tree.visit();
            if (result !== undefined) {
              Console.log(result);
            }
        } catch (error) {
            Console.error(error.message);
            console.error(error);
  
            //Show callstack
            Console.logRed(CallStack.asString());
        }
  
        CallStack.clear();
    }
  
    static executeProgram(program, name) {
        Console.programStarted(name);
  
        try {
            var tree = new Parser(program).parse();
        } catch (error) {
            Console.error(error.message);
            console.error(error);
  
            return;
        }
        try {
            var ar = new ActivationRecord(name, ARType.PROGRAM, CallStack.getCurrentAR(), CallStack.getCurrentAR());
            CallStack.setCurrentAR(ar);
  
            tree.visit();
        } catch (error) {
            Console.error(error.message);
            console.error(error);
  
            //Show callstack
            Console.logRed(CallStack.asString());
        }
  
        CallStack.clear();
        Console.programEnded();
    }
}

const client = new Client({ queue: true });

var programs = new Map();

WaLang.setup();

client.on('message', (message) => {
    try {
        var text = message.content.message;

        var programArray = text.split('\n');
        var command = programArray[0];
        programArray.shift();

        var program = programArray.join('\n');

        var words = command.split(' ');

        if (words[0] == "!define" && words.length == 2) {
            var programName = words[1];

            programs.set(programName, program);
        }
    } catch (error) {
        console.log(error);
    }
});

client.registerCommand('run', (message, args) => {
    var programName = args[0];
    var program = programs.get(programName);

    if (program == undefined) {
        client.sendMessage("That program does not exist.");
    } else {
        Interpreter.executeProgram(program, programName);
    }
});

