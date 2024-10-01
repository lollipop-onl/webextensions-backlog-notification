import http from "ky-universal";
import { getSpacesFromStorage } from "~/utils/webextension";
import type { BacklogAPIEndpoints } from "./types";

export const requestBacklogAPI = async <
	Method extends keyof BacklogAPIEndpoints,
	Endpoint extends keyof BacklogAPIEndpoints[Method],
>(
	method: Method,
	endpoint: Endpoint,
	query: BacklogAPIEndpoints[Method][Endpoint] extends { query: any }
		? BacklogAPIEndpoints[Method][Endpoint]["query"]
		: {},
): Promise<
	BacklogAPIEndpoints[Method][Endpoint] extends { response: any }
		? BacklogAPIEndpoints[Method][Endpoint]["response"]
		: never
> => {
	const spaces = await getSpacesFromStorage();
	const space = spaces[0] || { domain: "", apiKey: "" };
	const searchParams = new URLSearchParams();

	searchParams.append("apiKey", space.apiKey);

	Object.entries(query).forEach(([key, value]) => {
		switch (typeof value) {
			case "string":
			case "number":
			case "bigint":
			case "boolean":
				searchParams.append(key, value.toString());
		}
	});

	return await http(`https://${space.domain}${endpoint}`, {
		method,
		searchParams,
	}).json();
};
