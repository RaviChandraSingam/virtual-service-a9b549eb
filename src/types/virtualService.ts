export type ServiceType = "REST" | "SOAP" | "gRPC";
export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH" | "HEAD" | "OPTIONS";

export interface ReplacementPair {
  key: string;
  value: string;
}

export interface ServiceResource {
  id: string;
  urlPattern: string;
  method: HttpMethod;
  proxyHost: string;
  recordingEnabled: boolean;
  skipStatusCodes: string;
  requestReplacements: ReplacementPair[];
  responseReplacements: ReplacementPair[];
}

export interface VirtualService {
  id: string;
  name: string;
  type: ServiceType;
  baseUrl: string;
  port: string;
  resources: ServiceResource[];
  createdAt: string;
}

export interface StubMapping {
  id: string;
  serviceId: string;
  requestMethod: HttpMethod;
  requestPath: string;
  requestHeaders: Record<string, string>;
  responseStatus: number;
  responseBody: string;
  responseHeaders: Record<string, string>;
}

export interface DroolsRule {
  id: string;
  serviceId: string;
  name: string;
  salience: number;
  condition: string;
  action: string;
  rawDrools: string;
  enabled: boolean;
  tags: string[];
  version: number;
}

export interface TestRequest {
  method: HttpMethod;
  path: string;
  headers: Record<string, string>;
  body: string;
}

export interface TestResult {
  status: number;
  body: string;
  headers: Record<string, string>;
  rulesFired: string[];
  executionTime: number;
  logs: string[];
}
