/// <reference path="api.ts" />


const SURGE_BUNDLE_ID = 'com.nssurge.surge-mac';
const SURGE_ICON  = SURGE_BUNDLE_ID;


function configured(): boolean {
	return Action.preferences.apiEndpoint && Action.preferences.accessKey
}

function run(argument: string): ScriptOutput[] {
	if (argument === '?') {
		configured()
		return [
			{
				title: 'Open preference file',
				icon: '🧑🏻‍🔧',
				url: `file://${Action.supportPath}/Preferences.plist`,
			}
		];
	}

	if (!configured()) {
		Action.preferences.apiEndpoint = '';
		Action.preferences.accessKey = '';
		return [
			{
				title: 'Not configured! Missing Api endpoint and access key.',
				icon: '🤦🏻‍♂️'
			}
		]
	}

	const profiles = listProfiles();

	let output: ScriptOutput[] = [];

	output.push(showOutboundMode());

	try {
		output.push(...listFeatures());
	} catch (e) {
		output.push(
			{
				title: 'Unable to retrieve feature status',
				icon: '😬'
			}
		);
	}

	output.push({
		title: 'Manage Profiles',
		children: profiles,
		icon: '/Applications/Surge.app/Contents/Resources/ConfigFile.icns'
	});

	output.push({
		title: 'List Active Requests',
		icon: '🌍',
		action: 'listActiveRequests',
		actionReturnsItems: true
	});

	return output;
}

function listProfiles(): ScriptOutput[] {
	const response = getProfiles();

	if (response.data && typeof response.data == 'object') {
		return response.data.profiles.map((name, index) => {
			return {
				label: index === 0 ? 'Press <Enter> to switch profile' : undefined,
				title: name,
				action: 'setProfile',
				actionArgument: name,
				icon: SURGE_ICON,
				badge: Action.preferences.lastUsedProfile == name ? 'Last Used' : undefined
			}
		});
	}
	return [
		{
			title: 'No profile was found',
			icon: '😬'
		}
	]
}

function setProfile(name: string): ScriptOutput[] {
	const response = postSwitchProfile(name);
	if (!response.error) {
		Action.preferences.lastUsedProfile = name;
		return [
			{
				title: `Profile has switched to ${name}`,
				icon: '👍🏻'
			}
		];
	}

	return [
		{
			title: response.error,
			icon: '🥵'
		}
	]
}

const FEATURES = {
	SYSTEM_PROXY: 'System Proxy',
	ENHANCED_MODE: 'Enhanced Mode',
	REWRITE: 'Rewrite',
	SCRIPTING: 'Scripting'
}

function listFeatures(): ScriptOutput[] {
	const features = [
		{name: FEATURES.SYSTEM_PROXY, response: getSystemProxyStatus(), action: 'enableSystemProxy', api: postEnableSystemProxy},
		{name: FEATURES.ENHANCED_MODE, response: getEnhancedModeStatus(), action: 'enableEnhancedMode', api: postEnableEnhancedMode},
		{name: FEATURES.REWRITE, response: getRewriteStatus(), action: 'enableRewrite', api: postEnableRewrite},
		{name: FEATURES.SCRIPTING, response: getScriptingStatus(), action: 'enableScripting', api: postEnableScripting},
	];

	return features.map((item) => {
		let enabled = item.response.data.enabled;

		let args: ToggleFeatureOptions = {
			status: !enabled,
		};

		return {
			title: item.name,
			badge: enabled ? 'Enabled' : undefined,
			icon: SURGE_ICON,
			action: item.action,
			actionArgument: args
		};
	});
}

interface ToggleFeatureOptions {
	status: boolean;
	api?: (enabled: boolean) => HTTP.Response<PostToggleFeatureResponse>
}

function toggleFeature(api: ToggleFeatureOptions['api'], status: ToggleFeatureOptions['status']): ScriptOutput[] {
	if (!api) {
		return [
			{
				'title': 'Invalid operation! Missing API call.',
				'icon': '🥵'
			}
		];
	}

	const response = api(status);
	LaunchBar.log(JSON.stringify(response.data));

	if (response.error) {
		return [
			{
				'title': response.error, icon: '😵', badge: 'Error!'
			}
		];
	}

	return [
		{
			title: `Feature is ${status ? 'enabled' : 'disabled'}`,
			icon: '👌🏻'
		}
	];
}

function enableSystemProxy(options: ToggleFeatureOptions): ScriptOutput[] {
	return toggleFeature(
		postEnableSystemProxy, options.status
	);
}

function enableEnhancedMode(options: ToggleFeatureOptions): ScriptOutput[] {
	return toggleFeature(
		postEnableEnhancedMode, options.status
	);
}

function enableRewrite(options: ToggleFeatureOptions): ScriptOutput[] {
	return toggleFeature(
		postEnableRewrite, options.status
	);
}

function enableScripting(options: ToggleFeatureOptions): ScriptOutput[] {
	return toggleFeature(
		postEnableScripting, options.status
	);
}

function listActiveRequests(limit: number = 50, page: number = 1): ScriptOutput[] {
	const response = getActiveRequests();

	LaunchBar.log(response.data.requests.length.toString());

	return response.data.requests.map((request) => {
		let application = resolveBaseApplicationFromPath(request.processPath);
		const children = [
			{path: application || request.processPath},
			{title: request.policyName, label: 'Policy Name', icon: 'font-awesome:fa-info-circle'},
			{title: request.remoteAddress, label: 'Remote Address', icon: 'font-awesome:fa-info-circle'},
			{title: request.rule, label: 'Rule', icon: 'font-awesome:fa-info-circle'},
			{title: request.method, label: 'Method', icon: 'font-awesome:fa-info-circle'},
			{title: request.URL || 'Unknown URL', label: 'URL', icon: 'font-awesome:fa-info-circle'},
		]
		return {
			title: File.displayName(request.processPath),
			icon: application || undefined,
			subtitle: application || '',
			alwaysShowsSubtitle: true,
			children: children,
			label: `${request.inCurrentSpeed}B/s`
		};
	});
}

function resolveBaseApplicationFromPath(path: String): string | null {
	let res = path.match(/.*?\.(app|framework|so)/);
	if (res) {
		return res[0];
	}
	return null;
}

function showOutboundMode(): ScriptOutput {
	const possiableModes = ['Direct', 'Proxy', 'Rule'];
	const response = getOutboundMode();
	return {
		title: 'Outbound Mode',
		badge: response.data.mode.toUpperCase(),
		icon: '🕹',
		children: possiableModes.map((name, index) => {
			return {
				label: index === 0 ? 'Press <Enter> to change outbound mode' : undefined,
				title: name,
				action: 'changeOutboundRule',
				actionReturnsItems: true,
				actionArgument: name.toLowerCase(),
				icon: `character:${name.substr(0, 1)}?font=Futura`
			};
		})
	};
}

function changeOutboundRule(mode: GetOutBoundModeResponse['mode']): ScriptOutput[] {
	const response = postOutboundModel(mode);

	LaunchBar.log(JSON.stringify(response));

	const output = {
		title: 'ok', icon: '👌🏻'
	};

	return [output];
}