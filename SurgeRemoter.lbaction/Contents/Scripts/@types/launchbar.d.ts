declare namespace LaunchBar {
	const systemVersion: string;
	const currentLocale: string;
	const path: string;
	const version: string;
	const bundleIdentifier: string;
	const homeDirectory: string;
	const userName: string;
	const userID: string;
	const hostName: string;
	const computerName: string;
	const options: {
		commandKey: boolean;
		alternateKey: boolean;
		shiftKey: boolean;
		controlKey: boolean;
		spaceKey: boolean;
		runInBackground: boolean;
		liveFeedback: boolean;
	}

	function log(message: string);

	function debugLog(message: string);

	function alert(message: string, info?: string, buttonTitle1: string, ...buttonTitles?: string[])

	function openURL(url: string, appName: string, hideOthers?: boolean);

	interface Notification {
		string?: string;
		title?: string;
		subtitle?: string;
		url?: string;
		delay?: number | string;
	}

	function displayNotification(notification: Notification);

	interface DisplayData {
		string: string;
		title?: string;
		font?: string;
		sound?: string;
		delay?: number | string;
	}

	function displayInLargeType(displayData: DisplayData);

	function openQuickLook(url: string | string[]);

	function closeQuickLook();

	function performAction(actionName: string, argument?: string);

	function performService(serviceName: string, argument?: string);

	function openCommandURL(commandURL: string);

	function paste(text: string);

	function getClipboardString(): string | undefined;

	function setClipboardString(text: string);

	function clearClipboard();

	function execute(launchPath: string, ...args?: string[]): string;

	function executeAppleScript(script: string, ...args?: string[]): string;

	function executeAppleScriptFile(path: string, ...args?: string[]): string;

	type DateStyle = 'none' | 'medium' | 'long' | 'full';

	interface FormatDateOptions {
		relativeDateFormatting?: boolean;
		dateStyle?: DateStyle;
		timeStyle?: DateStyle;
		timeZone?: string;
		locale?: string;
		calendar?: string;
	}

	function formatDate(date: Date, options?: FormatDateOptions): string;

	function hide();
}