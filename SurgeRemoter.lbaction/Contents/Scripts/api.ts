function createRequest(url: string, options?: HTTP.CreateRequestOptions) {
	const path = `http://${Action.preferences.apiEndpoint}/${url}`;
	LaunchBar.log(path);

	if (options?.body) {
		LaunchBar.log(JSON.stringify(options?.body))
	}

	return HTTP.createRequest(path, {
			resultType: 'json',
			bodyType: 'json',
			...options,
			headerFields: {
				...options?.headerFields,
				'X-Key': Action.preferences.accessKey,
			},
		}
	);
}

function makeRequest<T = undefined>(url: string, options?: HTTP.CreateRequestOptions) {
	return HTTP.loadRequest<T>(
		createRequest(url, options)
	)
}

interface GetOutBoundModeResponse {
	mode: 'direct' | 'proxy' | 'rule';
}

function getOutboundMode() {
	return makeRequest<GetOutBoundModeResponse>('v1/outbound')
}

function postOutboundModel(mode: GetOutBoundModeResponse['mode']) {
	return makeRequest('v1/outbound', {
		method: 'POST',
		body: {
			mode: mode
		}
	})
}

interface GetPolicyOfGlobalOutBoundResponse {
	policy: string;
}

function getPolicyOfGlobalOutBound() {
	return makeRequest<GetPolicyOfGlobalOutBoundResponse>('v1/outbound/global');
}

function getPolicies() {
	return makeRequest('v1/policies');
}

function getPolicyDetail(policyName: string) {
	return makeRequest(`v1/policies/detail?policy_name=${policyName}`);
}

interface TestPolicyRequest {
	policy_names: string[];
	url: string;
}

function postTestPolicy(params: TestPolicyRequest) {
	params.url = params.url || 'http://bing.com'
	return makeRequest('v1/policies/test', {
		method: 'POST',
		body: params
	})
}

function getPolicyGroups() {
	return makeRequest('v1/policy_groups');
}

function getPolicyGroupsTestResults() {
	return makeRequest('v1/policy_groups/test_results')
}

interface GetSelectPolicyGroupTestResultResponse {
	policy: string
}

function getSelectPolicyGroupTestResult(groupName: string) {
	return makeRequest(`v1/policy_groups/select?group_name=${groupName}`);
}

interface PostChangeSelectPolicyGroupRequest {

}

function postChangeSelectPolicyGroup(params: PostChangeSelectPolicyGroupRequest) {
	return makeRequest('v1/policy_groups/select', {
		body: params,
		method: 'POST'
	})
}

interface ProcyTestResult {
	tfo: boolean;
	tcp: number;
	rtt: number;
	receive: number;
	available: number;
}

interface TestPolicyGroupResult {
	data: {
		[proxy: string]: ProcyTestResult
	}
	time: number
}

interface PostTestPolicyGroupResponse {
	results: TestPolicyGroupResult[],
	time: number,
    winner: string
}

function postTestPolicyGroup(groupName: string) {
	return makeRequest<PostTestPolicyGroupResponse>('v1/policy_groups/test', {
		body: {
			group_name: groupName,
		},
		method: 'POST'
	})
}

function getRecentRequests() {
	return makeRequest<GetActiveRequestsResponse>('v1/requests/recent')
}

interface GetActiveRequestsResponse {
	requests: Array<{
        "id": number;
        "remoteAddress": string;
        "inMaxSpeed": number;
        "proxyMode": number;
        "interface": string;
        "notes": string[];
        "inCurrentSpeed": number;
        "failed": number;
        "status": string;
        "outCurrentSpeed": number;
        "completed": number;
        "sourcePort": number;
        "completedDate": number; // could be 0
        "outBytes": number;
        "sourceAddress": string;
        "localAddress": string;
        "requestHeader": string;
        "policyName": string;
        "inBytes": number;
        "method": string;
        "pid": number;
        "replica": number;
        "rule": string;
        "startDate": number;
        "setupCompletedDate": number;
        "URL": string;
        "processPath": string;
        "outMaxSpeed": number;
        "modified": number;
        "timingRecords": Array<{
            "durationInMillisecond": number;
            "name": string;
        }>
    }>
}

function getActiveRequests() {
	return makeRequest<GetActiveRequestsResponse>('v1/requests/active');
}

function postKillRequest(id: number) {
	return makeRequest('v1/requests/kill', {
		body: {
			id
		},
		method: 'POST',
	});
}

function getCurrentProfile(sensitive: boolean = false) {
	return makeRequest<any>(`v1/profiles/current?sensitive=${sensitive ? '1' : '0'}`)
}

function postReloadCurrentProfile() {
	return makeRequest('v1/profiles/reload', {method: 'POST'});
}

function postSwitchProfile(name: string) {
	return makeRequest<{}>('v1/profiles/switch', {
		method: 'POST',
		body: {
			name
		}
	})
}

interface GetProfilesResponse {
	profiles: string[]
}

function getProfiles() {
	return makeRequest<GetProfilesResponse>('v1/profiles');
}

function postCheckProfile(name: string) {
	return makeRequest('v1/profiles/check', {
		method: 'POST',
		body: {
			name
		}
	});
}

function postFlushDns() {
	return makeRequest('v1/dns/flush', {
		method: 'POST'
	})
}

function getDnsCache() {
	return makeRequest('v1/dns');
}

function postTestDnsDelay() {
	return makeRequest('v1/test/dns_delay', {
		method: 'POST'
	});
}

function getModules() {
	return makeRequest('v1/modules');
}

interface PostEnableModulesRequest {
	[name: string]: boolean
}

function postEnableModules(params: PostEnableModulesRequest) {
	return makeRequest('v1/modules', {
		method: 'POST',
		body: params
	})
}

function getScripts() {
	return makeRequest('v1/scripting')
}

interface PostEvaluateScriptRequest {
	script_text: string;
	mock_type: 'cron';
	timeout: number;
}

function postEvaluateScript(params: PostEvaluateScriptRequest) {
	return makeRequest('v1/scripting/evaluate', {
		method: 'POST',
		body: params
	})
}

function postEvaluateCronScript(scriptName: string) {
	return makeRequest('v1/scripting/cron/evaluate', {
		method: 'POST',
		body: {
			script_name: scriptName
		}
	})
}

function postStop() {
	return makeRequest('v1/stop', {
		method: 'POST'
	});
}

interface GetEventsResponse {
	'events': Array<{
        "identifier": string;
        "date": string;
        "type": number;
        "allowDismiss": number;
        "content": string;
	}>
}

function getEvents() {
	return makeRequest('v1/events');
}

interface GetRulesResponse {
	'available-policies': string[],
	'rules': string[]
}

function getRules() {
	return makeRequest<GetRulesResponse>('v1/rules');
}

interface InterfaceDetail {
	"outCurrentSpeed": number,
	"in": number,
	"out": number,
	"inMaxSpeed": number,
	"outMaxSpeed": number,
	"inCurrentSpeed": number
}

interface ConnectorDetailStatistic {
	"rttcur": number;
	"srtt": number;
	"rttvar": number;
	"txpackets": number;
	"txretransmitpackets": number;
}

interface ConnectorDetail extends InterfaceDetail {
	statistics: ConnectorDetailStatistic[]
}

interface GetTrafficResponse {
	connector: [{
			[procy: string]: ConnectorDetail,
		}
	],
	startTime: number,
	interface: {
		[name: string]: InterfaceDetail
	}
}
function getTraffic() {
	return makeRequest<GetTrafficResponse>('v1/traffic');
}

function postChangeLogLevel(level: string) {
	return makeRequest('v1/log/level', {
		method: 'POST',
		body: {
			level
		}
	});
}

interface PostToggleFeatureResponse {

}

interface GetFeatureStatusResponse {
	enabled: boolean
}

function getMitmStatus() {
	return makeRequest<GetFeatureStatusResponse>(
		'v1/features/mitm'
	);
}

function postEnableMitm(enabled: boolean) {
	return makeRequest<PostToggleFeatureResponse>('v1/features/mitm', {
		method: 'POST',
		body: {
			enabled
		}
	});
}

function getCaptureStatus() {
	return makeRequest<GetFeatureStatusResponse>(
		'v1/features/capture'
	);
}

function postEnableCapture(enabled: boolean) {
	return makeRequest<PostToggleFeatureResponse>('v1/features/capture', {
		method: 'POST',
		body: {
			enabled
		}
	});
}

function getRewriteStatus() {
	return makeRequest<GetFeatureStatusResponse>(
		'v1/features/rewrite'
	);
}

function postEnableRewrite(enabled: boolean) {
	return makeRequest<PostToggleFeatureResponse>('v1/features/rewrite', {
		method: 'POST',
		body: {
			enabled
		}
	});
}

function getScriptingStatus() {
	return makeRequest<GetFeatureStatusResponse>(
		'v1/features/scripting'
	);
}

function postEnableScripting(enabled: boolean) {
	return makeRequest<PostToggleFeatureResponse>('v1/features/scripting', {
		method: 'POST',
		body: {
			enabled
		}
	});
}

function getSystemProxyStatus() {
	return makeRequest<GetFeatureStatusResponse>(
		'v1/features/system_proxy'
	);
}

function postEnableSystemProxy(enabled: boolean) {
	return makeRequest<PostToggleFeatureResponse>('v1/features/system_proxy', {
		method: 'POST',
		body: {
			enabled
		}
	});
}

function getEnhancedModeStatus() {
	return makeRequest<GetFeatureStatusResponse>(
		'v1/features/enhanced_mode'
	);
}

function postEnableEnhancedMode(enabled: boolean) {
	return makeRequest<PostToggleFeatureResponse>('v1/features/enhanced_mode', {
		method: 'POST',
		body: {
			enabled
		}
	});
}
