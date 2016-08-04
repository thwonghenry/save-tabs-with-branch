# save-tabs-with-branch package

## What is it?
It is an atom package to help you save the opened tabs with the current branch. When the current git repository is switching to other branch, the tabs of the current branch is saved in LocalStorage, and restore the tabs of the switched branch (if it is saved to LocalStorage previously)

## How it works?
It subscribes git change events, and if the branch is changed, it saves the serialized state of the PaneContainers to LocalStorage and restore the state of the switched branch if found in LocalStorage.

## Bugs
1. Sometimes it has "untitled" tabs when restoring
2. etc..

## Install instruction
1. `git clone` in `~/.atom/packages/`
2. Restart atom and enable save-tabs-with-branch
3. Restart again? idk
4. done
