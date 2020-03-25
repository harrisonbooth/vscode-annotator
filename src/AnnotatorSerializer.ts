import * as vscode from 'vscode';
import * as path from 'path';

import { getNonce } from './functions';

export default class AnnotatorSerializer implements vscode.WebviewPanelSerializer {
  extensionPath: string;
  subscriptions: { dispose(): any }[];
  panel?: vscode.WebviewPanel;

  constructor(context: vscode.ExtensionContext) {
    this.extensionPath = context.extensionPath;
    this.subscriptions = context.subscriptions;
  }

  init() {
    if (!this.panel) {
      this.createPanel();
    } else {
      this.reveal();
    }
  }

  createPanel() {
    this.panel = vscode.window.createWebviewPanel(
      'annotator',
      'Annotator',
      vscode.ViewColumn.Beside,
      { enableScripts: true, retainContextWhenHidden: true }
    );
    this.panel.webview.html = this.getWebviewContent();

    this.panel.webview.onDidReceiveMessage(message => {
      switch (message.command) {
        case 'loaded':
          this.initializeOnSelectionChange();
          break;
      }
    });

    this.panel.onDidDispose(
      () => this.panel = undefined,
      null,
      this.subscriptions
    );
  }

  initializeOnSelectionChange() {
    vscode.window.onDidChangeTextEditorSelection(e => {
      if (e.selections[0] && !e.selections[0].isEmpty) {
        vscode.commands.executeCommand('editor.action.clipboardCopyWithSyntaxHighlightingAction');
        this.panel?.webview.postMessage({ command: 'updateSelection' });
      }
    });
  }

  reveal() {
    this.panel?.reveal();
  }

  async deserializeWebviewPanel(webviewPanel: vscode.WebviewPanel, state: any): Promise<void> {
    this.panel = webviewPanel;
    webviewPanel.webview.html = this.getWebviewContent();
  }

  getWebviewContent() {
    if (!this.panel) return `<h1>An error has occured</h1>`;

    const nonce = getNonce();

    const scriptPathOnDisk = vscode.Uri.file(path.join(this.extensionPath, 'src', 'webview', 'index.js'));
    const scriptUri = this.panel.webview.asWebviewUri(scriptPathOnDisk);

    return `<!DOCTYPE html>
		<html lang="en">
		<head>
				<meta charset="UTF-8">
				<!--
				Use a content security policy to only allow loading images from https or from our extension directory,
				and only allow scripts that have a specific nonce.
				-->
				<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${this.panel.webview.cspSource} https:; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'">
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<title>Annotator</title>
		</head>
		<body style="height: 100vh;">
				<div id="container" style="box-sizing: border-box; padding: 30px;">
					<div id="snippet">Select some code.</div>
				</div>
				<script nonce="${nonce}" src="${scriptUri}"></script>
		</body>
		</html>`;
  }
}
