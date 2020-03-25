import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

export function activate(context: vscode.ExtensionContext) {

	let currentPanel: vscode.WebviewPanel | undefined = undefined;

	let disposable = vscode.commands.registerCommand('annotator.start', () => {

		if (!vscode.window.activeTextEditor || !vscode.window.activeTextEditor.selections[0]) {
			vscode.window.showInformationMessage("Please open a file and select some code to annotate.");
			return;
		}

		const activeColumn = vscode.window.activeTextEditor
			? vscode.window.activeTextEditor.viewColumn
			: undefined;

		if (currentPanel) {
			currentPanel.reveal();

			vscode.commands.executeCommand('editor.action.clipboardCopyWithSyntaxHighlightingAction');
			currentPanel.webview.postMessage({
				command: 'init'
			});
		} else {
			currentPanel = vscode.window.createWebviewPanel(
				'annotator',
				'Annotator',
				vscode.ViewColumn.One,
				{ enableScripts: true, retainContextWhenHidden: true }
			);

			currentPanel.webview.html = getWebviewContent(context.extensionPath, currentPanel);
			vscode.commands.executeCommand('editor.action.clipboardCopyWithSyntaxHighlightingAction');
			currentPanel.webview.postMessage({
				command: 'init'
			});

			currentPanel.onDidDispose(
				() => currentPanel = undefined,
				null,
				context.subscriptions
			);

			vscode.window.onDidChangeTextEditorSelection(e => {
				if (e.selections[0] && !e.selections[0].isEmpty) {
					vscode.commands.executeCommand('editor.action.clipboardCopyWithSyntaxHighlightingAction');
					console.log("sending update");
					currentPanel!.webview.postMessage({ command: 'updateSelection' });
				}
			});
		}
	});

	context.subscriptions.push(disposable);
}

function getNonce() {
	let text = '';
	const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	for (let i = 0; i < 32; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}
	return text;
}

function getWebviewContent(extensionPath: string, panel: vscode.WebviewPanel) {
	const nonce = getNonce();

	const scriptPathOnDisk = vscode.Uri.file(path.join(extensionPath, 'src', 'webview', 'index.js'));
	const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);

	return `<!DOCTYPE html>
	<html lang="en">
	<head>
			<meta charset="UTF-8">
			<!--
			Use a content security policy to only allow loading images from https or from our extension directory,
			and only allow scripts that have a specific nonce.
			-->
			<meta http-equiv="Content-Security-Policy" content="default-src 'none'; img-src ${panel.webview.cspSource} https:; script-src 'nonce-${nonce}'; style-src 'unsafe-inline'">
			<meta name="viewport" content="width=device-width, initial-scale=1.0">
			<title>Annotator</title>
	</head>
	<body style="height: 100vh;">
			<div id="container" style="box-sizing: border-box; padding: 30px;">
				<div id="snippet"></div>
			</div>
			<script nonce="${nonce}" src="${scriptUri}"></script>
	</body>
	</html>`;
}

export function deactivate() { }
