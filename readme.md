# Linkki-web

Repository of [linkkijkl.fi](https://linkkijkl.fi).


## Getting Started

First:

1. Install git and [Git Large File Storage](https://git-lfs.com)
2. Clone this repository, i.e. `git clone https://github.com/linkkijkl/linkki-web`
3. Initialize git submodules `git submodule init && git submodule update`

After this there are a few options:

1. Use Devcontainers (easiest if you have Docker already installed)
    - Install [Docker](https://docs.docker.com/), [Visual Studio Code](https://code.visualstudio.com/)
and [Devcontainers VSCode plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
    - Open this repository in VSCode and there should be a popup asking if you want to reopen the project in a container. Do that.
    - When inside a container, open a terminal inside VSCode (`Ctrl` + `Shift` + `P`, search for `create new terminal`) and run `hugo server`.

2. Install Hugo locally
    - Install [Hugo extended edition](https://gohugo.io/)
    - Run `hugo server` and you should be good to go 🎉
    - Or optionally, on some supported Unix based environments _(currently MacOS, Debian and Fedora)_, you can just run `startup.sh`.
    - Install [npm](https://nodejs.org) if you want to get search working


### Building Search Indexes

To get search working locally, run `hugo` at least once, and then `npx pagefind --site public` in the projects root directory.


## Building and Running With [Docker](https://www.docker.com/)

This is how the site is deployed in production.

```shell
docker build -t linkki-web .
docker run -p 127.0.0.1:8080:8080 linkki-web
```


## FAQ

### How do I submit changes I want to contribute with?

Make a pull request with your changes so we can get them online 🙂

### I have spotted an error, how do I report it?

Make a new issue detailing the problem.

### I want to contribute but don't know what to do, where should I start?

Take a look at open issues. From there you should find something to do.

### `hugo server` fails after git pull:

Try running `git submodule init && git submodule update` and make sure
you have the extended edition of Hugo installed.
