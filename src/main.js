class WaLang {

  static setup() {
    var globalAr = new ActivationRecord("_GLOBAL", ARType.GLOBAL, null, null);

    //Mathematical constants
    globalAr.save("_PI", Math.PI, true);

    globalAr.save("_E", Math.E, true);

    //Help
    globalAr.save("_HELP", "-------* Help Menu *-------\nComing soon...", true);

    //Easter Eggs
    globalAr.save("_COOLNESSLEVEL", "Very Cool", true);

    //Print
    globalAr.addFunction("print", new LangFunction(["message"], null, true, false, globalAr, (ar) => Console.log(ar.get("message"))));

    //Queue
    globalAr.addFunction("enqueue", new LangFunction(["task"], null, true, false, globalAr, (ar) => TaskManager.addToQueue(ar.get("task"))));
    globalAr.addFunction("delay", new LangFunction(["task", "millis"], null, true, false, globalAr, (ar) => {
      var currentTimeStamp = Date.now().valueOf();
      var executeTimeStamp = currentTimeStamp + ar.get("millis");

      TaskManager.addTimedTask(new TimedTask(ar.get("task"), executeTimeStamp));
    }));

    //Math
    globalAr.addFunction("sqrt", new LangFunction(["number"], null, true, false, globalAr, (ar) => Math.sqrt(ar.get("number"))));
    globalAr.addFunction("random", new LangFunction([], null, true, false, globalAr, () => Math.random()));

    //Time
    globalAr.addFunction("year", new LangFunction([], null, true, false, globalAr, () => new Date().getFullYear()));

    globalAr.addFunction("month", new LangFunction([], null, true, false, globalAr, () => new Date().getMonth()));

    globalAr.addFunction("day", new LangFunction([], null, true, false, globalAr, () => new Date().getDay()));

    globalAr.addFunction("hours", new LangFunction([], null, true, false, globalAr, () => new Date().getHours()));

    globalAr.addFunction("minutes", new LangFunction([], null, true, false, globalAr, () => new Date().getMinutes()));

    globalAr.addFunction("seconds", new LangFunction([], null, true, false, globalAr, () => new Date().getSeconds()));

    globalAr.addFunction("millis", new LangFunction([], null, true, false, globalAr, () => new Date().getMilliseconds()));

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

  static clear(keepProgram) {
    if (keepProgram) {
      while (currentAR.type !== ARType.PROGRAM) {
        currentAR = currentAR.caller;
      }

      return;
    }

    //If reaches here, keepProgram is false
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
  IF_STATEMENT: "if",
  TASK: "task"
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
  
    CallStack.clear(true);

    TaskManager.remain();
  }
}

class TimedTask {

  constructor(func, timestamp) {
    this.func = func;
    this.timestamp = timestamp;
  }
}

const toExecuteAtTime = [];
const taskQueue = [];

class TaskManager {
  
  static addTimedTask(task) {
    console.log("addTimedTask " + task.timestamp);
    toExecuteAtTime.push(task);
  }

  static addToQueue(func) {
    taskQueue.push(func);
  }

  static process() {
    for (var timedTask of toExecuteAtTime) {
      if (Date.now().valueOf() >= timedTask.timestamp) {
        taskQueue.push(timedTask.func);
        toExecuteAtTime.splice(toExecuteAtTime.indexOf(timedTask), 1);
      }
    }

    while (taskQueue.length > 0) {
      var func = taskQueue.shift();
      this.executeFunction(func);
    }
  }

  static remain() {
    var interval = setInterval(() => {
      process();

      if (toExecuteAtTime.length == 0) {
        CallStack.clear(false);
        Console.programEnded();
        clearInterval(interval);
      }
    }, 5);
  }

  static executeFunction(func) {
    var previousAR = CallStack.getCurrentAR();

    if (func.async) {
      throw new Error("Async functions aren't supported yet");
    }

    var ar = new ActivationRecord(null, ARType.TASK, func.ar, null);

    CallStack.setCurrentAR(ar);

    if (func.native) {
      func.code(ar);
    } else {
      func.block.visit();
    }

    CallStack.setCurrentAR(previousAR);
  }
}