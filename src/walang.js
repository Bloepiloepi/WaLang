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