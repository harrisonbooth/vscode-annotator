import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

import AnnotatorSerializer from './AnnotatorSerializer';

export function activate(context: vscode.ExtensionContext) {

	const annotatorWebview = new AnnotatorSerializer(context, vscode.window.activeTextEditor);

	let disposable = vscode.commands.registerCommand('annotator.start', () => {
		annotatorWebview.init();
	});

	context.subscriptions.push(disposable);

	vscode.window.registerWebviewPanelSerializer('annotator', annotatorWebview);
}

export function deactivate() { }
