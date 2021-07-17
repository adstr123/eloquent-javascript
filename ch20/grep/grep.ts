/**
 * search files for a regular expression
 * first command is regex to search for
 * further arguments are files to search through
 * output names of files that match the regex
 * extension: when one of the arguments is a directory, search through all files in that directory & its subdirectories
 */

const { readFileSync, statSync, readdirSync } = require("fs");

// first element is process.execPath, ignore
// second element is path to JS file being executed, ignore
const [_processExecPath, _execPath, regexp, ...files] = process.argv;

const regexpObj = new RegExp(regexp);
const matchingFiles: String[] = [];

/**
 * Searches files for a regular expression match.
 * If a path is a directory, it will recursively search all files in that directory/all subdirectories
 * @param path File or directory to search
 */
function grep(path: string) {
  if (statSync(path).isDirectory()) {
    readdirSync(path).forEach((subdir) => grep(path + "/" + subdir));
  } else if (regexpObj.test(readFileSync(path, "utf8"))) {
    console.log(path);
  }
}

files.forEach((path) => grep(path));
