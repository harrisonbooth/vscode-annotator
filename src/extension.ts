import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

import AnnotatorSerializer from './AnnotatorSerializer';
import { AnnotatorProvider } from './AnnotatorProvider';

export function activate(context: vscode.ExtensionContext) {

	const annotatorWebview = new AnnotatorSerializer(context);

	const annotatorProvider = new AnnotatorProvider();
	vscode.window.registerTreeDataProvider('annotator', annotatorProvider);

	const disposable = vscode.commands.registerCommand('annotator.start', () => {
		annotatorWebview.init();
	});

	const colourCommand = vscode.commands.registerCommand(
		'annotator.changeColour',
		(colour: string) => {
			const options: vscode.InputBoxOptions = {
				ignoreFocusOut: true,
				placeHolder: "Red",
				prompt: "Enter a Hex colour value or a valid HTML colour name.",
				value: "red"
			};
			vscode.window.showInputBox(options)
				.then(colour => {
					if (!colour) {
						vscode.window.showInformationMessage("Something went wrong!")
						return;
					};

					annotatorWebview.changeColour(colour);
				})
		}
	);

	context.subscriptions.push(disposable, colourCommand);

	// vscode.window.registerWebviewPanelSerializer('annotator', annotatorWebview);
}

export function deactivate() { }
