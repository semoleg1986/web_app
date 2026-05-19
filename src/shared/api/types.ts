export interface ApiProblemDetails {
  type?: string;
  title?: string;
  status?: number;
  detail?: string;
  request_id?: string;
  correlation_id?: string;
  [key: string]: unknown;
}

export interface ApiClientError<TProblem extends ApiProblemDetails = ApiProblemDetails> {
  statusCode: number | null;
  statusMessage: string;
  problem: TProblem | null;
  requestId: string | null;
  correlationId: string | null;
}

export class ApiRequestError<TProblem extends ApiProblemDetails = ApiProblemDetails> extends Error {
  readonly name = "ApiRequestError";
  readonly statusCode: number | null;
  readonly problem: TProblem | null;
  readonly requestId: string | null;
  readonly correlationId: string | null;

  constructor(readonly apiError: ApiClientError<TProblem>) {
    super(apiError.statusMessage);
    this.statusCode = apiError.statusCode;
    this.problem = apiError.problem;
    this.requestId = apiError.requestId;
    this.correlationId = apiError.correlationId;
  }
}
