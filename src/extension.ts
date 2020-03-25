import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

import AnnotatorSerializer from './AnnotatorSerializer';
import { AnnotatorProvider } from './AnnotatorProvider';

export function activate(context: vscode.ExtensionContext) {

	const annotatorWebview = new AnnotatorSerializer(context);

	const annotatorProvider = new AnnotatorProvider();
	vscode.window.registerTreeDataProvider('annotator', annotatorProvider);

	let disposable = vscode.commands.registerCommand('annotator.start', () => {
		annotatorWebview.init();
	});

	context.subscriptions.push(disposable);

	vscode.window.registerWebviewPanelSerializer('annotator', annotatorWebview);
}

export function deactivate() { }
