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
