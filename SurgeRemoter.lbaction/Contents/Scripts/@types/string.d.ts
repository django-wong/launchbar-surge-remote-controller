interface ToStringUsingEncodingOptions {
	encoding?: string;
}

interface ToBase64DataOptions extends ToStringUsingEncodingOptions {
	endLineWithCarriageReturn?: boolean;
	endLineWithLineFeed?: boolean;
	lineLength?: number;
}

interface toStringFromBase64String extends ToBase64StringOptions, ToStringUsingEncodingOptions {}

interface String {
	localizationTable: string;
	localize(localizationTable: string): string;
	toBase64Data(options?: ToBase64DataOptions): BinaryData;
	toBase64String(options?: ToBase64DataOptions): string;
	toData(options?: ToStringUsingEncodingOptions): BinaryData;
	toDataFromBase64String(options?: ToBase64StringOptions): BinaryData
	toStringFromBase64String(options?: toStringFromBase64String): string
}