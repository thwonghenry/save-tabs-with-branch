'use babel';

import SaveTabsWithBranchView from './save-tabs-with-branch-view';
import { CompositeDisposable } from 'atom';

function getBranch() {
  const repos = atom.project.getRepositories();
  if (!repos || repos.length === 0) {
    return '';
  }
  const repo = repos[0];
  return repo.getShortHead();
}

export default {

  saveTabsWithBranchView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.saveTabsWithBranchView = new SaveTabsWithBranchView(state.saveTabsWithBranchViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.saveTabsWithBranchView.getElement(),
      visible: false,
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'save-tabs-with-branch:toggle': () => this.toggle(),
    }));
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
    console.log(getBranch());

    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

};
