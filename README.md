# clg - command line goodness

I love static site generators. I also love the command line. This project offers a set of useful command-line tools for developers, maintainers and writers of statically generated websites.

![example](./docs/example.gif)

## tl;dr

- `clg edit` gives you a menu with all markdown files in the project's `source` directories (see below for configuration)

- Select a file in the menu (arrows or vim-style `j`/`k`) to open it in your `$EDITOR`. If you don't have an `$EDITOR` environment variable or run your query with `-g`/`--gui`, it'll open in a GUI editor instead

- `clg new` drops a new file into a pre-configured folder, fills it with some metadata and then opens it in your `$EDITOR` or GUI editor

- Conveniently search for and rename a file from the command line with `clg rename <search terms> --new-name "The new title"`

- Search for and delete a file (and, if it's there, its associated asset directory) with `clg delete <search terms>`

- Configuration is set by adding command line options or dropping a `.clg.json` file in your project root dir

- Filter your `clg` queries with regular expressions like this: `clg edit search term`. Now only articles will pop up in the menu that contain `/search/` and `/term/`. Wrap the search in double quotes to do a search for `/search term/` instead.

- Run a search query with the `-k` or `--apropos` flag to scan your posts' contents instead of just the titles/paths

## Requirements

- Node v0.12 or above (yep, this runs on ancient Node).
- npm v2.15 or above.
- A project checked into `git` (just locally is fine) with statically generated content

## Installation

```
npm install -g clg
```

This is a global package and you only need to install it once.

Read [this](https://github.com/sindresorhus/guides/blob/master/npm-global-without-sudo.md) or install [nvm](https://github.com/creationix/nvm) if you find you need `sudo`.

## Usage

### `clg edit`

The core feature of `clg` is `edit`. This is what happens when you run `clg edit` somewhere in your file system:

- The root directory of the project is identified
- If it exists, a project-specific `.clg.json` overwrites the default configuration settings (see below)
- All files that match both your query and the configuration settings are displayed in a menu and you choose the one you want to edit
- The selected file opens in your `$EDITOR` or associated GUI program

#### `edit` options

`clg edit` will present you with a list of *all* files located somewhere within the `sourceDirs` dirs that match the `extension`s.

Fine-tune your query by using any or all of the following (you may have to wrap a specific term in quotes if it contains spaces):

- regular expressions: every word that isn't an option will be treated as a regular expression to filter the files on. Right now, just the filenames are taken into consideration
- `-s`/`--source`: explicitly specify a single source directory
- `-d`/`--dir`/`--directory`: you probably have subfolders in your source director{y,ies}. Select only a specific subdirectory by using this option
- `-ext`/`--extension`: specify a file extension. In effect this overwrites your `extensions` for a single query
- `-k`/`--apropos` (boolean): when set, your search terms will test your post's entire body
- `-t`/`--tag`/`--tags`: filter on a single tag or a list of comma-separated tags
- `-c`/`--cat`/`--category`: filter on a category
- `-f`/`--filter`: choose a frontmatter property to include (along with the title) in your searches

Examples:

```
clg edit
clg edit cool post
clg edit great content -k
clg edit -d articles
clg edit -ext html
clg edit app -d scripts -ext js
clg edit cool post -t javascript
clg edit cool post -t "javascript library" -c javascript
clg edit js -f id
```

### `clg new`

Here's what happens when you run `clg new`:

- Root dir is identified and checked, and a project-specific `.clg.json` is read to configure the possible `new` commands (see below).
- If a matching asset is found in the config, a new file with a slugized filename will be created in the right directory, and filled with some metadata.
- The new file is then opened with your `$EDITOR` or associated GUI program.

#### `new` options

Right now, no command line options have been implemented for `new`, but it does read your project-specific `.clg.json` file, located in the root directory of your project. A `newDirs` options will be looked for, and this should hold the options for creating new `posts`, `drafts` or whatever. Here's an example:

```
{
  "newDirs": {
    "post": {
      "dir": "source/_posts",
      "metadata": {
        "category": "blog",
        "tags": ""
      },
      "assetDir": "true",
      "extension": "md"
    },
    "draft": "source/_drafts"
  }
}
```

Adding the above to a project's root dir will allow you to do a `clg new post "Hello World"`. A `hello-world.md` file will then get dropped into `./source/_posts`. It will contain some `yaml` metadata with a `title` (Hello World) and a date property, as well as `category: blog` and `tags: `. It will also create an asset folder (a folder by the same name as the slug to hold images and the like). Finally, the new file will open automatically in your favorite editor.

As for `clg new draft`, it will drop a new file with `title` and `date` metadata and stick to the defaults. In other words, if you just put a string, `clg` will interpret it as the `dir` for the asset and use defaults.

Options:
- **dir**: the location of the folder where you want to drop your new files
- **metadata**: some extra metadata you might want to add on creation
- **assetDir**: (boolean, defaults to false) if true, an empty directory will be created in `dir` by the same name as the slugized title
- **extension**: (string, defaults to 'md') a file extension for your new file

### `clg rename`

The `rename` subcommand lets you search for a file using all the filters used in `clg edit`. After selecting a file, you will be presented with a menu, asking you whether you want to rename the title (usually set in the frontmatter), the filesystem path or both.

Options:
- `--nn`/`--nm`/`--new-name` (required): The new title/name for the file. For renaming the filesystem path, this string will be `slugize`d automatically
- `--na`/`--new-asset` (optional): Use this if you've set multiple types of posts (such as `post`, `draft`, `page` etc) and you want to change the type

Examples:

```
clg rename my post --nn "My new title"
clg rename my draft --nn "A new awesome post" --na "post"
```

### `clg delete` (also `clg rm` or `clg remove`)

Search for a file and delete it from the command line. If you have an asset directory (a directory in the same folder with the same name, normally used to host post-specific images), it will be deleted also.

Example:

```
clg delete my post
```

### Default settings and `.clg.json`

These are currently the default settings:

```
{
  "sourceDirs": [
    "src",
    "source",
    "_posts",
    "blog"
  ],
  "extensions": [
    "md",
    "markdown"
  ],
  "supported": [
    "hexo",
    "jekyll",
    "metalsmith",
    "octopress",
    "wintersmith"
  ],
  "showDate": true,
  "filterProp": null
}
```

You can overwrite (use a string, separated by whitespace or commas) or add to (use an array) these default settings on a project-by-project basis by including a `.clg.json` file in your project's root directory.

- `sourceDirs`: An array (or comma-or-whitespace separated string) of top-level directories you want to edit files in. For example, you may want to add `layouts` or `partials` here if you want to use `clg` to edit files in those directories.
- `extensions`: The filetypes to look for
- `supported`: `clg` will error out unless it detects any of these in the project's `package.json` or `Gemfile.lock`
- `showDate`: (boolean, defaults to true) if true, show the date in the display menu
- `filterProp`: when defined, it includes the value of the `filterProp` frontmatter in your searches (by default, it looks only in the title)

Here's an example of a project's `.clg.json`, which will make it work on any Node or Ruby project and look exclusively in the `layouts` directory for `ejs`, `md` and `markdown` files. It will also give you a `clg new article <title>` command to drop a new file in `./blog/posts`.

```
{
  "sourceDirs": "layouts",
  "extensions": [ "ejs" ],
  "supported": "",
  "newDirs": {
    "article": "blog/posts"
  }
}
```

## Motivation and state of the project

For several months, I used [hexo](https://hexo.io) for generating a static blog. Just dropping markdown files in folders and generating a blog out of it is great, but when I wanted to edit existing files, it got a little annoying sometimes to have to look for them on the command line.

I was constantly just opening `vim` and using file search plugins to find my posts and that didn't feel right. So I wrote [hexo-cli-extras](https://github.com/greg-js/hexo-cli-extras), which plugged into the hexo database and enhanced (imo) the command-line blogging experience.

The other day I wanted to play with [metalsmith](https://github.com/metalsmith/metalsmith), but I found myself sorely missing my hexo plugin. So I just wrote a [simpler, filesystem-based version of it for metalsmith](https://github.com/greg-js/metalsmith-hammer). But then I realized all static generators kind of work in the same way. If I'm desperate for this kind of feature, then I'm sure other people out there might like it. Hence this package.

The project is still in its early stages, but the basic feature of editing static files on the command-line works, and so does creating new files. I've tested it briefly on `hexo`, `jekyll`, `metalsmith`, `octopress` and `wintersmith`, but there's no reason why it would fail in other Node or Ruby based static site generators as long as you configure the settings right.

If you wanted to, you could even place a `.clg.json` file in any project root and change the settings to use it for editing `js` or `less` or any other files using this approach. Still, the main goal is smooth management of static site files.

## Todo

* allow metadata configuration from the command line
* more tests!!!
