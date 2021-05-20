declare namespace HTTP {
	interface Response<T = Object> {
		data: T;
		error: string;
		timeOut: boolean;
		response: {
			status: number;
			localizedStatus: string;
			headerFields: PlainObject
		}
	}

	type ResultType = 'text' | 'json' | 'plist' | 'binary';
	type BodyType = ResultType;

	interface CreateRequestOptions {
		timeout?: number;
		headerFields?: PlainObject;
		method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'UPDATE' | 'HEAD' | 'PATCH';
		body?: string | PlainObject | BinaryData;
		bodyType?: BodyType;
		bodyTextEncoding?: string;
		bodyJSONPrettyPrint?: boolean;
		bodyPlistFormat?: 'xml' | 'binary';
		resultType?: ResultType
	}

	function get<T = any>(url: string, options?: CreateRequestOptions): HTTP.Response<T>;

	function getJSON<T = any>(url: string, options?: CreateRequestOptions): HTTP.Response<T>;

	function getPlist<T = any>(url: string, options?: CreateRequestOptions): HTTP.Response<T>;

	function getData<T = any> (url: string, options?: CreateRequestOptions): HTTP.Response<T>;

	function post<T = any>(url: string, options?: CreateRequestOptions): HTTP.Response<T>;

	function postJSON<T = any>(url: string, options?: CreateRequestOptions): HTTP.Response<T>;

	function postPlist<T = any>(url: string, options?: CreateRequestOptions): HTTP.Response<T>;

	function postData<T = any>(url: string, options?: CreateRequestOptions): HTTP.Response<T>;

	interface Request {};

	function createGetRequest(url: string, options?: CreateRequestOptions): HTTP.Request;

	function createGetJSONRequest(url: string, options?: CreateRequestOptions): HTTP.Request;

	function createGetPlistRequest(url: string, options?: CreateRequestOptions): HTTP.Request;

	function createGetDataRequest(url: string, options?: CreateRequestOptions): HTTP.Request;

	function createPostRequest(url: string, options?: CreateRequestOptions): HTTP.Request;

	function createPostJSONRequest(url: string, options?: CreateRequestOptions): HTTP.Request;

	function createPostPlistRequest(url: string, options?: CreateRequestOptions): HTTP.Request;

	function createPostDataRequest(url: string, options?: CreateRequestOptions): HTTP.Request;

	function createRequest(url: string, options?: CreateRequestOptions): HTTP.Request;

	function loadRequest<T = any>(request: HTTP.Request): HTTP.Response<T>;

	function loadRequest<T = any>(url: string, options?: CreateRequestOptions): HTTP.Response<T>;

	function loadRequests<T = any>(requests: HTTP.Request[]): HTTP.Response<T>;

}