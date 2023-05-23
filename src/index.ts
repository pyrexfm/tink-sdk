import DataApi from "./data";
import LinkApi from "./link";
import UserApi from "./user";
import {
  AccessToken,
  AccessTokenRequest,
  AccessTokenResponse,
  UserAccessTokenRequest,
  UserAccessTokenResponse,
  HeadersType,
  BodyType,
  RequestParameters,
  QueryParametersType,
  Scope,
  Value,
} from "./types";
import CredentialApi from "./credential";
import ConsentApi from "./consent";

export * from "./types";

export function getValue(value: Value) {
  return value.unscaledValue * Math.pow(10, -1 * value.scale);
}

export default class TinkClient {
  clientId: string;
  clientSecret: string;
  clientActorId?: string;
  baseUrl: string;
  baseLinkURL: string;
  headers: HeadersType;
  data: DataApi;
  user: UserApi;
  link: LinkApi;
  credential: CredentialApi;
  consent: ConsentApi;

  tokens: Map<Scope, AccessToken> = new Map();

  constructor({
    clientId,
    clientSecret,
    clientActorId = "df05e4b379934cd09963197cc855bfe9",
    baseUrl = "https://api.tink.com",
    baseLinkURL = "https://link.tink.com",
  }: {
    clientId: string;
    clientSecret: string;
    clientActorId?: string;
    baseUrl?: string;
    baseLinkURL?: string;
  }) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.baseUrl = baseUrl;
    this.clientActorId = clientActorId;
    this.baseLinkURL = baseLinkURL;
    this.headers = {
      accept: "application/json",
      "User-Agent": "Tink-Node-JS",
    };
    this.user = new UserApi({ client: this });
    this.data = new DataApi({ client: this });
    this.link = new LinkApi({ client: this });
    this.credential = new CredentialApi({ client: this });
    this.consent = new ConsentApi({ client: this });
  }

  generateLink({
    endpoint,
    parameters,
  }: {
    endpoint: string;
    parameters: BodyType;
  }) {
    const queryParamsString = this.queryParameters(parameters);

    return `${this.baseLinkURL}/${endpoint}?${queryParamsString}`;
  }

  async request({
    endpoint,
    headers,
    parameters,
    body,
    method,
    contentType,
  }: RequestParameters) {
    // Build query string
    const queryParamsString = this.queryParameters(parameters || {});

    // Build fetch options
    const fetchOptions: RequestInit = {
      method: method,
    };

    if (body && contentType !== "none") {
      if (contentType === "json") {
        fetchOptions.body = JSON.stringify(body);
        fetchOptions.headers = {
          ...this.headers,
          ...{ "Content-Type": "application/json" },
          ...headers,
        };
      } else {
        fetchOptions.body = new URLSearchParams(
          Object.entries(body).map(([k, v]) => [k, v.toString()])
        );
        fetchOptions.headers = {
          ...this.headers,
          ...{ "Content-Type": "application/x-www-form-urlencoded" },
          ...headers,
        };
      }
    } else {
      fetchOptions.headers = { ...this.headers, ...headers };
    }

    fetchOptions.cache = "no-store";

    const url = `${this.baseUrl}/${endpoint}`;

    // Make request
    const response: Response = await fetch(
      `${url}?${queryParamsString}`,
      fetchOptions
    );

    if (response.status >= 300) {
      throw {
        name: "Request failed",
        message: `Request failed with status ${response.status}: ${response.statusText}`,
        status: response.status,
        statusText: response.statusText,
        request: {
          url: `${url}?${queryParamsString}`,
          options: JSON.stringify(fetchOptions, null, 4),
        },
        response: response,
      };
    }

    // Parse response
    const data = await response.json();

    return data;
  }

  queryParameters(parameters: QueryParametersType) {
    return Object.entries(parameters)
      .map(([key, value]) =>
        Array.isArray(value)
          ? value
              .map((v) => `${encodeURIComponent(key)}=${encodeURIComponent(v)}`)
              .join("&")
          : `${encodeURIComponent(key)}=${encodeURIComponent(value.toString())}`
      )
      .join("&");
  }

  tokenHeader(token: string) {
    return {
      Authorization: `Bearer ${token}`,
    };
  }

  setAccessToken(scope: Scope, token: AccessToken) {
    this.tokens.set(scope, token);
  }

  getValue(value: Value) {
    return value.unscaledValue * Math.pow(10, -1 * value.scale);
  }

  async requireToken(scope: Scope) {
    var token = this.tokens.get(scope);

    if (!token) {
      const response = await this.generateAccessToken({ scope: scope });
      token = {
        ...response,
        expiresAt: new Date(Date.now() + response.expires_in * 1000),
      };
    } else if (token.expiresAt < new Date()) {
      const response = await this.generateAccessToken({ scope: scope });
      token = {
        ...response,
        expiresAt: new Date(Date.now() + response.expires_in * 1000),
      };
    }

    this.tokens.set(scope, token);

    return token.access_token;
  }

  /**
   * Creates a client access token
   * @param scope - The scope of the access token
   * @returns a new client access token
   */
  async generateAccessToken({
    scope,
  }: AccessTokenRequest): Promise<AccessTokenResponse> {
    const response = await this.request({
      endpoint: "api/v1/oauth/token",
      body: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "client_credentials",
        scope: scope,
      },
      method: "POST",
      contentType: "x-www-form-urlencoded",
    });

    return response;
  }

  /**
   * Creates a user access token from an authorization code
   * @param code - The user authorization code
   * @returns a new user access token
   */
  async generateUserAccessToken({
    code,
  }: UserAccessTokenRequest): Promise<UserAccessTokenResponse> {
    const response = await this.request({
      endpoint: "api/v1/oauth/token",
      body: {
        client_id: this.clientId,
        client_secret: this.clientSecret,
        grant_type: "authorization_code",
        code: code,
      },
      method: "POST",
      contentType: "x-www-form-urlencoded",
    });

    return response;
  }
}
