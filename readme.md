This is a coure I followed from [udemy](https://www.udemy.com/course/react-and-typescript-build-a-portfolio-project/)

Where you can build an app where you can execute js snippets online in your browser like code pen and add markdown note and group them as a notebook. 

The notebook is saved in your machine in a file using express and node.

The technology used are node, express, react and lerna to manipulate them as a monorepos and publish them into npm packages

```shell
$ sudo npm install -g notebook-app-inline-markdown-jscode-snippets

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
❯ npx notebook-app-inline-markdown-jscode-snippets serve
Opened "file-list-notebooks-workbook.json".

 Navigate to:

http://localhost:4005/

 to edit the file.

In this folder, the app will create some json files, one it's the list of the notebooks and the other is the notebook code/text

```

Note:

There was some differences about this code and the code of the course, the course use create-react-app and some old packages and I updated those packages and use vite for react

