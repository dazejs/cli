import nunjucks from 'nunjucks';
import * as path from 'path';
import * as fs from 'fs';
import glob from 'glob';
import fsExtra from 'fs-extra'

type LanguageType = 'ts' | 'js'

type SourceType = 'application'


export class Render {
  private _sourcePath: SourceType;
  private _destinationPath: string;
  private _language: LanguageType;

  private _env: nunjucks.Environment;
  private _templatePath = path.resolve(__dirname, '../../template')

  constructor() {
    this._env = nunjucks.configure(this._templatePath);
  }

  public source(sourcePath: SourceType) {
    this._sourcePath = sourcePath;
    return this;
  }

  public destination(destinationPath: string) {
    this._destinationPath = destinationPath;
    return this;
  }

  public language(language: LanguageType) {
    this._language = language;
    return this;
  }

  public make(srcFilename: string, distFilename: string) {
    //
  }

  public apply() {
    const distPath = path.join(this._templatePath, this._sourcePath, this._language);
    const files = glob.sync(
      path.join(distPath, '**'),
      {
        nodir: true
      }
    );
    for (const file of files) {
      const filename = path.join(
        process.cwd(),
        this._destinationPath,
        path.relative(distPath, file)
      );
      const str = this._env.render(file);
      fsExtra.ensureFileSync(filename)
      fs.writeFileSync(filename, str, {
        encoding: 'utf-8'
      })
    }
  }
}


