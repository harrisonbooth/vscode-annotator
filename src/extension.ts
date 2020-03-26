import * as vscode from 'vscode';

import * as path from 'path';
import * as fs from 'fs';

import AnnotatorSerializer from './AnnotatorSerializer';
import { AnnotatorProvider } from './AnnotatorProvider';
import { AnnotatorColourProvider } from './AnnotatorColourProvider';

export function activate(context: vscode.ExtensionContext) {

	const annotatorProvider = new AnnotatorProvider();
	vscode.window.registerTreeDataProvider('annotator', annotatorProvider);

	const annotatorColourProvider = new AnnotatorColourProvider();
	vscode.window.registerTreeDataProvider('annotator-colours', annotatorColourProvider);

	const annotatorWebview = new AnnotatorSerializer(context);

	const customColourCommand = vscode.commands.registerCommand(
		'annotator.changeColourCustom',
		() => {
			const options: vscode.InputBoxOptions = {
				ignoreFocusOut: true,
				placeHolder: "Red",
				prompt: "Enter a Hex colour value or a valid HTML colour name.",
				value: "red"
			};
			vscode.window.showInputBox(options)
				.then(colour => {
					if (!colour) {
						vscode.window.showInformationMessage("Something went wrong!");
						return;
					};

					annotatorColourProvider.addOption(colour);
					annotatorWebview.changeColour(colour);
				});
		}
	);

	const colourCommand = vscode.commands.registerCommand(
		'annotator.changeColour',
		(colour: string) => {
			annotatorWebview.changeColour(colour);
		}
	);

	const disposable = vscode.commands.registerCommand('annotator.start', () => {
		annotatorWebview.init();
	});

	context.subscriptions.push(
		disposable,
		customColourCommand,
		colourCommand
	);

	// vscode.window.registerWebviewPanelSerializer('annotator', annotatorWebview);
}

export function deactivate() { }
