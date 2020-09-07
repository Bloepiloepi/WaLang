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