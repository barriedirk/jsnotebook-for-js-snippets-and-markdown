This is a course I followed from [udemy](https://www.udemy.com/course/react-and-typescript-build-a-portfolio-project/)

Where you can build an notebook app where you can execute js snippets online in your browser like codepen and add markdown notes and group them into a file. 

The notebook is saved in your machine in a file using express and node.

The technology used are node, express, react and lerna to manipulate them as a monorepos and publish them into npm packages

Two ways to execute this project

### execute it via npm packages

The package is located on [https://www.npmjs.com/package/notebook-app-inline-markdown-jscode-snippets](https://www.npmjs.com/package/notebook-app-inline-markdown-jscode-snippets)



```shell

# using npx

$ npx notebook-app-inline-markdown-jscode-snippets@latest serve

Opened "file-list-notebooks-workbook.json".

 Navigate to:

http://localhost:4005/

 to edit the file.

In this folder, the app will create some json files, one it's the list of the notebooks and the other is the notebook code/text

```

# install via npm

```shell
$ sudo npm install -g notebook-app-inline-markdown-jscode-snippets@latest

added 306 packages in 4s

139 packages are looking for funding
  run `npm fund` for details
❯ npx notebook-app-inline-markdown-jscode-snippets
Usage: notebook-app-inline-markdown-jscode-snippets [options] [command]

Options:
  -h, --help                  display help for command

Commands:
  serve [options] [filename]  Open a file for editing
  help [command]              display help for command
$ notebook-app-inline-markdown-jscode-snippets serve

Opened "file-list-notebooks-workbook.json".

 Navigate to:

http://localhost:4005/

 to edit the file.

In this folder, the app will create some json files, one it's the list of the notebooks and the other is the notebook code/text

```

# download from github repository 

```

```
