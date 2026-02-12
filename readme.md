# Linkki-web

Repository of [linkkijkl.fi](https://linkkijkl.fi).


## Getting Started

First:

1. Install git and [Git Large File Storage](https://git-lfs.com)
2. Clone this repository, i.e. `git clone https://github.com/linkkijkl/linkki-web`
3. Initialize git submodules `git submodule init && git submodule update`

After this there are a few options:

1. Use Devcontainers (best option for Windows)

    The Devcontainer configured for this project has all tools required for developing to it installed for you.
    Devcontainers are available for [many IDEs](https://containers.dev/supporting) but this guide focues on using [Visual Studio Code](https://code.visualstudio.com/).

    - Install [Docker](https://docs.docker.com/), [VSCode](https://code.visualstudio.com/)
    and [Devcontainers VSCode plugin](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-containers)
    - Open this repository in VSCode. A popup should open asking if you want to reopen the project in a container. Do that.
    - When the container is running, open a terminal in VSCode (`Ctrl` + `Shift` + `P`, search for `create new terminal`) and run `hugo server`.

2. Use local development tools (in Unix compatible environments, like Linux or MacOS)
    - Install [Hugo extended edition](https://gohugo.io/), [Yarn package manager](https://yarnpkg.com/) and [Dart Sass](https://sass-lang.com/dart-sass/).

    Then in project root run

    - `yarn` to pull js and css dependencies
    - `npx pagefind --site public` to build search indexes
    - `hugo server` and you should be good to go 🎉

3. Use Docker compose

    - Install [Docker](https://docs.docker.com/)
    - Run `docker compose up --build`
    - Open [localhost:8080](http://localhost:8080)
    - When you are finished developing run `docker compose down`
    

### Pitfalls

- Hugo server watches for changes in code, and they should automatically show up in browser when made. However, sometimes when editing css and js, you should hit `Ctrl` + `Shift` + `R` in browser to get them showing up.
- Devcontainers can stop allowing network traffic to go trough fully. Git inside will fail to reach remote, your browser won't be able to load pages from `hugo server` correctly, etc. Rebuild container to fix these weird issues. I've noticed this tends to happen when browser tab has been left open with development site when `hugo server` inside the container is no longer running.


## Building and Running With [Docker](https://www.docker.com/)

This is how the site is deployed in production.

```shell
docker build --pull -t linkki-web .
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
