import * as path from 'path';
import moduleAlias from 'module-alias';

/* Pega o nome do diretorio atual e volta duas pastas e pega todos os arquivos */
const files = path.resolve(__dirname, '../..');

moduleAlias.addAliases({
  '@src': path.join(files, 'src'),
  '@test': path.join(files, 'test'),
});
