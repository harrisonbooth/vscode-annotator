import * as vscode from 'vscode';

export class AnnotatorProvider implements vscode.TreeDataProvider<AnnotatorOption> {
  getTreeItem(element: AnnotatorOption) {
    return element;
  }

  getChildren(element?: AnnotatorOption) {
    if (element) return null;

    return [
      new AnnotatorOption(
        "Open Annotator",
        vscode.TreeItemCollapsibleState.None,
        { command: 'annotator.start', title: "Open Annotator" }
      )
    ];
  }
}


class AnnotatorOption extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collabsibleState: vscode.TreeItemCollapsibleState,
    public readonly command: vscode.Command
  ) {
    super(label, collabsibleState);
  }


}
