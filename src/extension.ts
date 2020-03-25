import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

import AnnotatorSerializer from './AnnotatorSerializer';

export function activate(context: vscode.ExtensionContext) {

	const annotatorWebview = new AnnotatorSerializer(context);

	let disposable = vscode.commands.registerCommand('annotator.start', () => {

		if (!vscode.window.activeTextEditor || !vscode.window.activeTextEditor.selections[0]) {
			vscode.window.showInformationMessage("Please open a file and select some code to annotate.");
			return;
		}

		annotatorWebview.init();

	});

	context.subscriptions.push(disposable);

	vscode.window.registerWebviewPanelSerializer('annotator', annotatorWebview);
}

export function deactivate() { }
