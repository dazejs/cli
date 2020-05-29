import { ActionAbstract } from './action.abstract';
import { Render, NpmRunner, YarnRunner } from '../lib';
// import * as path from 'path';
import inquirer from 'inquirer';

export class CreateAction extends ActionAbstract {
  static promptList = [
    {
      type: 'list',
      name: 'lang',
      message: 'Which one to use for development?',
      choices: [
        {
          name: 'typescript',
          value: 'ts'
        },
        {
          name: 'javascript',
          value: 'js'
        },
      ],
    },
    {
      type: 'list',
      name: 'pm',
      message: 'Which package manager you wany?',
      choices: [
        {
          name: 'npm',
          value: 'npm'
        },
        {
          name: 'yarn',
          value: 'yarn'
        },
        {
          name: 'skip install',
          value: ''
        },
      ],
    },
  ];

  async resolve(name: string) {
    const answer = await inquirer.prompt(CreateAction.promptList)
    const renderer = new Render();
    if (answer.lang === 'js') {
      renderer.language('js')
    } else {
      renderer.language('ts')
    }
    renderer.source('application')
    renderer.destination(name)
    renderer.apply()


    if (answer.pm === 'npm') {
      new NpmRunner()
        .directory(name)
        .run('install')
    } else if (answer.pm === 'yarn') {
      new YarnRunner()
        .directory(name)
        .run('install')
    }


    // console.log(answer.pm)

    // return;

    // const renderer = new Render();
    // renderer
    //   .source('application')
    //   .destination(name)
    //   .language('ts')
    //   .apply();
  }
}