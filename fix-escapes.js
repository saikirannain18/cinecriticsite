import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function walkSync(dir, filelist = []) {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      filelist = walkSync(dirFile, filelist);
    } else {
      if (dirFile.endsWith('.js') || dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
}

const allFiles = walkSync(path.join(__dirname, 'src'));

allFiles.forEach(fullPath => {
  let content = fs.readFileSync(fullPath, 'utf8');
  let newContent = content.replace(/\\`/g, '`').replace(/\\\$/g, '$');
  if (content !== newContent) {
    fs.writeFileSync(fullPath, newContent);
    console.log('Fixed', fullPath);
  }
});
