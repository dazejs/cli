import { ActionAbstract } from './action.abstract';
import { Render } from '../lib';
import * as path from 'path';

export class CreateAction extends ActionAbstract {
  resolve(name: string) {
    const renderer = new Render();
    renderer
      .source('application')
      .destination(
        path.join(process.cwd(), name)
      )
      .language('ts')
      .apply();
  }
}