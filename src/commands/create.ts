import { CommanderStatic, Command } from 'commander';
import { ActionAbstract } from '../actions';


export class CreateCommand {

  program: CommanderStatic;

  constructor(program: CommanderStatic) {
    this.program = program;
  }

  resolve(action: ActionAbstract) {
    this.program
      .command('create [name]')
      .alias('c')
      .description('Generate Daze application.')
      .action((name: string, command: Command) => {
        action.resolve(name);
      });
  }
}