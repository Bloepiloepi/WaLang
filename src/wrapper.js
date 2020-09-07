const client = new Client({ queue: true });

var programs = new Map();

WaLang.setup();

client.registerCommand('help', () => client.sendMessage("!program\n!run\n\nType these commands for more information."));

client.registerCommand('program', (message) => {
  const args = message.content.message.split('\n').join(' ').split(' ');

  if (args.length < 2) {
    client.sendMessage('Usage: !program <name> <code>')
  } else {
    programs.set(args[1], args.splice(2).join(' '));
  }
});

client.registerCommand('run', (message, args) => {
  if (args.length === 0) {
    if (message.content.reaction === null) {
      client.sendMessage('Usage: !run <name>\nUsage: React to the program you want to run.');
    } else {
      const programName = message.content.reaction.split('\n').join(' ').split(' ')[1];
      const program = programs.get(programName);
    
      if (program === undefined) {
        client.sendMessage("That program does not exist.");
      } else {
        Interpreter.executeProgram(program, programName);
      }
    }
  } else {
    const programName = args[0];
    const program = programs.get(programName);
  
    if (program === undefined) {
      client.sendMessage("That program does not exist.");
    } else {
      Interpreter.executeProgram(program, programName);
    }
  }
});