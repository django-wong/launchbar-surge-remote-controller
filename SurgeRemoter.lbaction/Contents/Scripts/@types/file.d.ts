declare namespace File {
	function exists(path: string): boolean;

	function isDirectory(path: string): boolean;

	function createDirectory(path: string): boolean;

	function isReadable(path: string): boolean;

	function isWritable(path: string): boolean;

	function isExecutable(path: string): boolean;

	function displayName(path: string): string;

	interface GetDirectoryContentsOptions {
		includeHidden: boolean
	}

	function getDirectoryContents(path: string, options?: GetDirectoryContentsOptions): string[];

	function readPlist(path: string): PlainObject;

	interface WritePlistOptions {
		// Specifies the format in which the property list is written to
		// disk. Choose between binary, or xml format. By default
		// property lists are stored in xml format
		format: string
	}

	function writePlist (plist: Object, path: string, options?: WritePlistOptions);

	function readJSON(file: string): PlainObject;

	interface WriteJsonOptions {
		prettyPrint: boolean;
	}

	function writeJSON(json: PlainObject, path: string, options?: WriteJsonOptions);

	function readText(path: string, encoding?: string): string;

	function writeText(text: string, path: string, encoding?: string);

	interface BinaryData {}

	function readData(path: string): BinaryData;

	function writeData(data: BinaryData | ArrayBuffer | ArrayBufferView, path: string);

	interface PathFromBookmarkDataOptions {
		withoutUI: boolean;
		withoutMounting: boolean;
	}

	function pathFromBookmarkData(data: BinaryData | ArrayBuffer | ArrayBufferView, options?: PathFromBookmarkDataOptions): string;

	function pathFromBookmarkAtPath(path: string, options?: PathFromBookmarkDataOptions): string;

	function fileURLForPath(path: string): string;

	function pathForFileURL(fileURL: string): string;
}