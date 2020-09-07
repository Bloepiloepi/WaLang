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