'use babel';

import SaveTabsWithBranchView from './save-tabs-with-branch-view';
import { PREFIX } from './save-tabs-with-branch-constants';
import { CompositeDisposable } from 'atom';

function getBranch() {
  const repos = atom.project.getRepositories();
  if (!repos || repos.length === 0) {
    return '';
  }
  const repo = repos[0];
  return repo.getShortHead();
}

function getCurrentState() {
  return atom.workspace.serialize();
}

export default {

  saveTabsWithBranchView: null,
  modalPanel: null,
  subscriptions: null,
  currentBranch: getBranch(),

  activate(state) {
    this.saveTabsWithBranchView = new SaveTabsWithBranchView(state.saveTabsWithBranchViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.saveTabsWithBranchView.getElement(),
      visible: false,
    });
    this.subscribeEvents();
  },

  subscribeEvents() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      [`${PREFIX}:toggle`]: () => this.toggle(),
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      [`${PREFIX}:get-opened-file`]: () => console.log(getCurrentState()),
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      [`${PREFIX}:get-branch-name`]: () => console.log(getBranch()),
    }));

    const repos = atom.project.getRepositories();
    if (repos && repos.length) {
      const repo = repos[0];
      repo.onDidChangeStatuses(() => {
        const branch = getBranch();
        if (this.currentBranch !== branch) {
          this.handleChangedBranch(branch);
        }
      });
    }
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.saveTabsWithBranchView.destroy();
  },

  serialize() {
    return {
      saveTabsWithBranchViewState: this.saveTabsWithBranchView.serialize(),
    };
  },

  toggle() {
    console.log('SaveTabsWithBranch was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

  handleChangedBranch(newBranch) {
    console.log('old state');
    console.log(getCurrentState());
    localStorage.setItem(`${PREFIX}:branch:${this.currentBranch}`,
       JSON.stringify(getCurrentState()));
    this.currentBranch = newBranch;
    const state = localStorage.getItem(`${PREFIX}:branch:${this.currentBranch}`);
    if (state) {
      console.log('new state');
      window.newState = JSON.parse(state);
      console.log(JSON.parse(state));
      atom.workspace.deserialize(JSON.parse(state));
    }
  },

};
