#!/bin/bash

# Determine OS/Distribution and set package manager
if [ "$(uname)" == "Darwin" ]; then
    OS="macOS"
elif [ -f /etc/debian_version ]; then
    OS="Debian/Ubuntu"
elif [ -f /etc/fedora-release ]; then
    OS="Fedora"
else
    echo "Unsupported OS or distribution."
    exit 1
fi

echo "Detected OS: $OS"

# Install Hugo based on OS
if ! command -v hugo; then
    echo "Hugo could not be found, attempting to install..."
    case $OS in
        "macOS")
            brew install hugo
            ;;
        "Debian/Ubuntu")
            sudo apt-get install -y hugo
            ;;
        "Fedora")
            sudo dnf install hugo
            ;;
        *)
            echo "Unsupported OS for automatic Hugo installation."
            exit 1
            ;;
    esac
fi

# Install Git LFS based on OS
if ! command -v git-lfs; then
    echo "Git LFS could not be found, attempting to install..."
    case $OS in
        "macOS")
            brew install git-lfs
            ;;
        "Debian/Ubuntu")
            sudo apt-get install git-lfs
            ;;
        "Fedora")
            sudo dnf install git-lfs
            ;;
        *)
            echo "Unsupported OS for automatic Git LFS installation."
            exit 1
            ;;
    esac
fi
# Pull lfs content
git lfs pull

# Initialize and update git submodules
git submodule init && git submodule update

# Start Hugo server
hugo server --config="hugo.toml"

