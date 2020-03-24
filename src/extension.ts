// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "editor-annotator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('annotator.start', () => {
		const panel = vscode.window.createWebviewPanel(
			'annotator',
			'Annotator',
			vscode.ViewColumn.Two,
			{ enableScripts: true }
		);

		panel.webview.html = getWebviewContent(context.extensionPath, panel);



		vscode.window.onDidChangeTextEditorSelection(e => {
			if (e.selections[0] && !e.selections[0].isEmpty) {
				vscode.commands.executeCommand('editor.action.clipboardCopyWithSyntaxHighlightingAction');
				panel.webview.postMessage({ command: 'updateSelection' });
			}
		});
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
	console.log(scriptPathOnDisk)
	const scriptUri = panel.webview.asWebviewUri(scriptPathOnDisk);
	console.log(scriptUri);


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
			<title>Cat Coding</title>
	</head>
	<body>
			<h1>0</h1>
			<script nonce="${nonce}" src="${scriptUri}"></script>
	</body>
	</html>`;
}

// this method is called when your extension is deactivated
export function deactivate() { }
