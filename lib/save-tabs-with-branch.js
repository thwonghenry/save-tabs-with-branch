'use babel';

import SaveTabsWithBranchView from './save-tabs-with-branch-view';
import { CompositeDisposable, TextEditor } from 'atom';

function getBranch() {
  const repos = atom.project.getRepositories();
  if (!repos || repos.length === 0) {
    return '';
  }
  const repo = repos[0];
  return repo.getShortHead();
}

function getOpenedFiles() {
  return atom.workspace.getPanes().map((pane) => {
    const activeItem = pane.getActiveItem();
    return pane.getItems().map((item) => {
      const data = {
        active: activeItem === item,
      };
      if (item instanceof TextEditor) {
        return Object.assign(data, {
          path: item.buffer.file.path,
        });
      }
      return Object.assign(data, {
        item,
      });
    });
  });
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
    this.subscribeCommand();
  },

  subscribeCommand() {
    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'save-tabs-with-branch:toggle': () => this.toggle(),
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'save-tabs-with-branch:get-opened-file': () => console.log(getOpenedFiles()),
    }));

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'save-tabs-with-branch:get-branch-name': () => console.log(getBranch()),
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
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  },

};
