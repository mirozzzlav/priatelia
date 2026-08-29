import { mockClient } from "src/services/api/mockClient";
import { restClient } from "src/services/api/restClient";
import type { ApiClient, DataSource } from "src/services/api/types";

const dataSource = (import.meta.env.VITE_DATA_SOURCE ?? "mock") as DataSource;

const clientByDataSource: Record<DataSource, ApiClient> = {
  mock: mockClient,
  rest: restClient,
};

export const apiClient = clientByDataSource[dataSource] ?? mockClient;
