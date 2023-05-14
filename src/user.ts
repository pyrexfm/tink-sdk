import TinkClient from ".";

import {
  CreateUserRequest,
  CreateUserResponse,
  GetUserRequest,
  GetUserResponse,
  DeleteUserRequest,
  CreateUserGrantRequest,
  CreateUserGrantResponse,
  UserCodeRequest,
  UserCodeResponse,
  MarketsResponse,
  MarketsRequest,
} from "./types";

export default class UserApi {
  client: TinkClient;

  constructor({ client }: { client: TinkClient }) {
    this.client = client;
  }

  /**
   * Creates a new user.
   * @param accessToken - Client access token. Requires the user:create scope.
   * @param externalUserId - The external user id. Must be unique.
   * @param market - The market to create the user in. Defaults to GB.
   * @param locale - The locale to create the user in. Defaults to en_US.
   * @returns a new user
   */
  async createUser({
    externalUserId,
    market = "GB",
    locale = "en_US",
  }: CreateUserRequest): Promise<CreateUserResponse> {
    const accessToken = await this.client.requireToken("user:create");

    const response = await this.client.request({
      endpoint: "api/v1/user/create",
      headers: this.client.tokenHeader(accessToken),
      body: {
        external_user_id: externalUserId,
        market: market,
        locale: locale,
      },
      method: "POST",
      contentType: "json",
    });

    return response;
  }

  /**
   * Returns current user details
   * @param userAccessToken - The user access token. Requires the user:read scope.
   * @returns the current user details
   */
  async getUser({ userAccessToken }: GetUserRequest): Promise<GetUserResponse> {
    const response = await this.client.request({
      endpoint: "api/v1/user/create",
      headers: this.client.tokenHeader(userAccessToken),
      method: "GET",
    });

    return response;
  }

  /**
   * Deletes the current user
   * @param userAccessToken - The user access token. Requires the user:delete scope.
   */
  async deleteUser({ userAccessToken }: DeleteUserRequest): Promise<void> {
    await this.client.request({
      endpoint: "api/v1/user/delete",
      headers: this.client.tokenHeader(userAccessToken),
      method: "POST",
      contentType: "none",
    });

    return;
  }

  /**
   * Generates a user delegate code for a Tink Link
   * @param accessToken - Client access token. Requires the authorization:grant scope.
   * @param userId - The user id to generate the code for (cannot be provided at the same time as externalUserId)
   * @param externalUserId - The external user id to generate the code for (cannot be provided at the same time as userId)
   * @param hint - The hint to generate the code for
   * @param scope - The scopes to generate the code for
   * @returns a new user delegate code
   */
  async generateUserDelegateCode({
    userId,
    externalUserId,
    hint,
    scope,
  }: CreateUserGrantRequest): Promise<CreateUserGrantResponse> {
    const accessToken = await this.client.requireToken("authorization:grant");

    const response = await this.client.request({
      endpoint: "api/v1/oauth/authorization-grant/delegate",
      headers: this.client.tokenHeader(accessToken),
      body: {
        actor_client_id: this.client.clientActorId || "",
        user_id: userId || "",
        external_user_id: externalUserId || "",
        id_hint: hint,
        scope: scope,
      },
      method: "POST",
      contentType: "x-www-form-urlencoded",
    });

    return response;
  }

  /**
   * Generates a user access code to be used to obtain a user access token
   * @param accessToken - Client access token. Requires the authorization:grant scope.
   * @param userId - The user id to generate the code for (cannot be provided at the same time as externalUserId)
   * @param externalUserId - The external user id to generate the code for (cannot be provided at the same time as userId)
   * @param scope - The user scopes to generate the code for
   * @returns a new user access code
   */
  async generateUserCode({
    userId,
    externalUserId,
    scope,
  }: UserCodeRequest): Promise<UserCodeResponse> {
    const accessToken = await this.client.requireToken("authorization:grant");
    const response = await this.client.request({
      endpoint: "api/v1/oauth/authorization-grant",
      headers: this.client.tokenHeader(accessToken),
      body: {
        actor_client_id: this.client.clientActorId || "",
        user_id: userId || "",
        external_user_id: externalUserId || "",
        scope: scope,
      },
      method: "POST",
      contentType: "x-www-form-urlencoded",
    });

    return response;
  }

  /**
   * Returns an object with a list of all available markets in which a user could register with
   * @param desired - The ISO 3166-1 alpha-2 country code of the market
   * @returns List of markets
   */
  async getMarkets({ desired }: MarketsRequest): Promise<MarketsResponse> {
    const response = await this.client.request({
      endpoint: "api/v1/user/markets/list",
      method: "GET",
      parameters: {
        desired: desired,
      },
    });

    return response;
  }
}
