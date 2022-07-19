import fs from 'fs';
import path from 'path';
import resolve from 'enhanced-resolve';

let myResolve;

/**
 * 通过source获取真实文件路径
 * @param parser
 * @param source
 */
function getResource(parser, source) {
  if (!myResolve) {
    myResolve = resolve.create.sync(parser.state.options.resolve);
  }
  let result = '';
  try {
    result = myResolve(parser.state.current.context, source);
  } catch (err) {
    console.log(err);
  } finally {
    return result;
  }
}

class WebpackImportAnalysisPlugin {
  constructor(props) {
    this.pluginName = 'WebpackCodeDependenciesAnalysisPlugin';
    //  文件数组
    this.files = [];
    //  当前编译的文件
    this.currentFile = null;
    this.output = props.output;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap(this.pluginName, (compilation, { normalModuleFactory }) => {
      const collectFile = parser => {
        const { rawRequest, resource } = parser.state.current;
        if (resource !== this.currentFile) {
          this.currentFile = resource;
          this.files.push({
            name: rawRequest,
            resource,
            children: []
          });
        }
      };
      const handler = parser => {
        // 用来捕获import(xxx)
        parser.hooks.importCall.tap(this.pluginName, expr => {
          collectFile(parser);
          let ast = {};
          const isWebpack5 = 'webpack' in compiler;
          // webpack@5 has webpack property, webpack@4 don't have the property
          if (isWebpack5) {
            // webpack@5
            ast = expr.source;
          } else {
            //webpack@4
            const { arguments: arg } = expr;
            ast = arg[0];
          }
          const { type, value } = ast;
          if (type === 'Literal') {
            const resource = getResource(parser, value);
            this.files[this.files.length - 1].children.push({
              name: value,
              resource,
              importStr: `import ('${value}')`,
              isAsync: true
            });
          }
        });
        // 用来捕获 import './xxx.xx';
        parser.hooks.import.tap(this.pluginName, (statement, source) => {
          if (statement.specifiers.length > 0) {
            return;
          }
          collectFile(parser);
          this.files[this.files.length - 1].children.push({
            name: source,
            resource: getResource(parser, source),
            importStr: `import '${source}'`
          });
        });
        // 用来捕获 import xx from './xxx.xx';
        parser.hooks.importSpecifier.tap(
          this.pluginName,
          (statement, source, exportName, identifierName) => {
            collectFile(parser);
            let importStr = '';
            if (exportName === 'default') {
              importStr = `import ${identifierName} from '${source}'`;
            } else {
              if (exportName === identifierName) {
                importStr = `import { ${identifierName} } from '${source}'`;
              } else {
                importStr = `import { ${exportName}: ${identifierName} } from '${source}'`;
              }
            }
            this.files[this.files.length - 1].children.push({
              name: source,
              exportName,
              identifierName,
              importStr,
              resource: getResource(parser, source)
            });
          }
        );
      };

      normalModuleFactory.hooks.parser.for('javascript/auto').tap(this.pluginName, handler);
    });

    compiler.hooks.make.tap(this.pluginName, compilation => {
      compilation.hooks.finishModules.tap(this.pluginName, modules => {
        const needFiles = this.files.filter(
          item => !item.resource.includes('node_modules') && !item.name.includes('node_modules')
        );
        fs.writeFile(this.output ?? path.resolve(__dirname, 'output.json'), JSOn.stringify(needFiles, null, 4), err => {
          if (!err) {
            console.log(`${path.resolve(__dirname, 'output.json')}写入完成`);
          }
        });
      });
    });
  }
}

export default WebpackImportAnalysisPlugin;
