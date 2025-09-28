# Linkki-web

Repository of [linkkijkl.fi](https://linkkijkl.fi).


## Getting Started

First:

1. Install git and [Git Large File Storage](https://git-lfs.com)
2. Clone this repository, i.e. `git clone https://github.com/linkkijkl/linkki-web`
3. Initialize git submodules `git submodule init && git submodule update`

After this there are a few options:

1. Use Devcontainers (best option for Windows)

    The Devcontainer configured for this project has all tools required for developing already installed.
    Devcontainers are available for [many IDEs](https://containers.dev/supporting) but this guide focues on VSCode.

    - Install [Docker](https://docs.docker.com/), [Visual Studio Code](https://code.visualstudio.com/)
    and [Devcontainers VSCode plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
    - Open this repository in VSCode. A popup should open asking if you want to reopen the project in a container. Do that.
    - When inside a container, open a terminal inside VSCode (`Ctrl` + `Shift` + `P`, search for `create new terminal`) and run `hugo server`.

2. Use local development tools (in Unix compatible environments, like Linux or MacOS)
    - Install [Hugo extended edition](https://gohugo.io/) and [Yarn package manager](https://yarnpkg.com/)
    - Run `yarn` in project root to pull js and css dependencies
    - Run `hugo server` and you should be good to go 🎉


### Pitfalls

- Hugo server watches for changes in code, and your changes should automatically show up in your browser when they are made. However, sometimes when editing css and js, you should hit `Ctrl` + `Shift` + `r` in browser to get your changes to show up.
- Devcontainers can stop letting traffic to reach inside container, when Hugo server has not been running, while the browser tab with development site was still open. This somehow floods the devcontainer with websocket requests. Rebuilding the container, which restarts devcontainers, should fix this issue.


### Building Search Indexes

To get search working locally, run `hugo` at least once, and then `npx pagefind --site public` in projects root directory.


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

Try running `git submodule init && git submodule update && yarn`, and make sure you have the extended edition of Hugo installed.

### Do I benefit from contributing?

Yes! If you make (a) useful contribution(s) to this repo, you may
redeem a free Website Task Force overall patch from a board member in
Kattila.
