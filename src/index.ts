import DataApi from "./data";
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
} from "./types";
import UserApi from "./user";

export default class TinkClient {
  clientId: string;
  clientSecret: string;
  clientActorId?: string;
  baseUrl: string;
  baseLinkURL: string;
  headers: HeadersType;
  data: DataApi;
  user: UserApi;

  tokens: Map<Scope, AccessToken> = new Map();

  constructor({
    clientId,
    clientSecret,
    clientActorId = "df05e4b379934cd09963197cc855bfe9",
    baseUrl = "https://api.tink.com/api",
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
      "User-Agent": "Tink-Node-TS",
    };
    this.user = new UserApi({ client: this });
    this.data = new DataApi({ client: this });
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

    const url = `${this.baseUrl}/${endpoint}`;

    console.log("URL:", url);
    console.log("queryParamsString", queryParamsString);
    console.log("fetchOptions", fetchOptions);

    // Make request
    const response: Response = await fetch(
      `${url}?${queryParamsString}`,
      fetchOptions
    );

    console.log("response", response);

    if (response.status >= 400) {
      throw new Error(
        `Request failed with status ${response.status}: ${response.statusText}`
      );
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

  async requireToken(scope: Scope) {
    var token = this.tokens.get(scope);

    if (!token) {
      const response = await this.generateAccessToken({ scope: scope });
      token = {
        ...response,
        expiresAt: new Date(Date.now() + response.expires_in),
      };
    } else if (token.expiresAt < new Date()) {
      const response = await this.generateAccessToken({ scope: scope });
      token = {
        ...response,
        expiresAt: new Date(Date.now() + response.expires_in),
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
      endpoint: "v1/oauth/token",
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
      endpoint: "v1/oauth/token",
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
