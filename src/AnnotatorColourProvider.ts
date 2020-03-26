import * as vscode from 'vscode';

export class AnnotatorColourProvider implements vscode.TreeDataProvider<ColourOption> {
  private _onDidChangeTreeData: vscode.EventEmitter<any> = new vscode.EventEmitter<any>();
  readonly onDidChangeTreeData: vscode.Event<any> = this._onDidChangeTreeData.event;

  options: ColourOption[];

  constructor() {
    this.options = [
      new ColourOption(
        "Enter your own...",
        vscode.TreeItemCollapsibleState.None,
        undefined,
        {
          title: "Custom Colour",
          command: "annotator.changeColourCustom"
        }
      ),
      new ColourOption("Red", vscode.TreeItemCollapsibleState.None, "red"),
      new ColourOption("Blue", vscode.TreeItemCollapsibleState.None, "blue"),
      new ColourOption("White", vscode.TreeItemCollapsibleState.None, "white"),
      new ColourOption("Green", vscode.TreeItemCollapsibleState.None, "green"),
      new ColourOption("Orange", vscode.TreeItemCollapsibleState.None, "orange"),
      new ColourOption("Yellow", vscode.TreeItemCollapsibleState.None, "yellow"),
      new ColourOption("Pink", vscode.TreeItemCollapsibleState.None, "pink"),
      new ColourOption("Purple", vscode.TreeItemCollapsibleState.None, "purple"),
    ];

  }

  getTreeItem(element: ColourOption) {
    return element;
  }

  addOption(colour: string) {
    this.options.push(new ColourOption(
      colour,
      vscode.TreeItemCollapsibleState.None,
      colour
    ));
    this._onDidChangeTreeData.fire();
  }

  getChildren(element?: ColourOption) {
    if (element) return null;

    return this.options;
  }
}

class ColourOption extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly collabsibleState: vscode.TreeItemCollapsibleState,
    public readonly colour?: string,
    public readonly command?: vscode.Command
  ) {
    super(label, collabsibleState);

    if (!this.command) {
      this.command = {
        command: 'annotator.changeColour',
        title: `Change to ${this.label}`,
        arguments: [this.colour]
      };
    }
  }
}
