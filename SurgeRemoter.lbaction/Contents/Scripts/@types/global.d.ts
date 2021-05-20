interface PlainObject {
	[key: string]: any
}

function include(path: string): void;

interface ToBase64StringOptions {
	ignoreUnknownCharacters?: boolean;
}

interface ToStringUsingEncodingOptions {
	encoding?: string;
}

interface BinaryData {
	toBase64String(options?: ToBase64StringOptions): string;
	toStringUsingEncoding(options?: ToStringUsingEncodingOptions): string;
	toUTF8String(): string;
	toUint8Array(): Uint8Array;
}

interface ScriptOutput {
	title?: string;
	subtitle?: string;
	alwaysShowsSubtitle?: boolean;
	label?: string;
	badge?: string;
	url?: string;
	path?: string;
	icon?: string;
	iconFont?: string;
	iconIsTemplate?: boolean
	quickLookURL?: string;
	action?: string;
	actionArgument?: string | PlainObject;
	actionReturnsItems?: boolean;
	actionRunsInBackground?: boolean;
	actionBundleIdentifier?: string;
	children?: ScriptOutput[]
}