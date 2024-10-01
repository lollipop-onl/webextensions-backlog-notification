import useSWR from "swr";
import { requestBacklogAPI } from "~/api";
import type { BacklogAPIEndpoints } from "~/api/types";

export const useBacklogResource = <
	Endpoint extends keyof BacklogAPIEndpoints["get"],
>(
	endpoint: Endpoint,
	query: BacklogAPIEndpoints["get"][Endpoint] extends { query: any }
		? BacklogAPIEndpoints["get"][Endpoint]["query"]
		: {},
) => {
	const searchParams = new URLSearchParams();

	Object.entries(query).forEach(([key, value]) => {
		switch (typeof value) {
			case "string":
			case "number":
			case "bigint":
			case "boolean":
				searchParams.append(key, value.toString());
		}
	});

	const key = `${endpoint}?${searchParams.toString()}`;
	const fetcher = () => requestBacklogAPI("get", endpoint, query);

	return useSWR<
		BacklogAPIEndpoints["get"][Endpoint] extends { response: any }
			? BacklogAPIEndpoints["get"][Endpoint]["response"]
			: never
	>(key, fetcher, { suspense: true });
};
