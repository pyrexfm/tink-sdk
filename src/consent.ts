import TinkClient from ".";

import {
  MarketsResponse,
  MarketsRequest,
  ProvidersRequest,
  ProvidersResponse,
  ProviderMarketRequest,
  ProviderConsentsRequest,
  ProviderConsentsResponse,
  ExtendConsentRequest,
  ExtendConsentResponse,
} from "./types";

export default class ConsentApi {
  client: TinkClient;

  constructor({ client }: { client: TinkClient }) {
    this.client = client;
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
        desired: desired || "",
      },
    });

    return response;
  }

  /**
   * Lists all providers available for a authenticated user
   * @param userAccessToken - The user access token. Requires the credentials:read scope
   * @param capability - Use the capability to only list providers with a specific capability. If no capability the provider response will not be filtered on capability
   * @param excludeNonTestProviders - 	Defaults to false. If set to true, Providers of type different than TEST will be removed from the response list
   * @param includeTestProviders - Defaults to false. If set to true, Providers of TEST type will be added in the response list
   * @param name - Gets a specific provider from the name. If this query parameter is used, only one or no providers will be returned
   * @returns List of providers that match the query
   */
  async getUserProviders({
    userAccessToken,
    capability,
    excludeNonTestProviders,
    includeTestProviders,
    name,
  }: ProvidersRequest): Promise<ProvidersResponse> {
    const response = await this.client.request({
      endpoint: "api/v1/providers",
      method: "GET",
      headers: this.client.tokenHeader(userAccessToken),
      parameters: {
        includeTestProviders: includeTestProviders || false,
        excludeNonTestProviders: excludeNonTestProviders || false,
        name: name || "",
        capability: capability || "",
      },
    });

    return response;
  }

  /**
   * Lists all providers on a specified market
   * @param market - The ISO 3166-1 alpha-2 market code.
   * @param capability - Use the capability to only list providers with a specific capability. If no capability the provider response will not be filtered on capability
   * @param excludeNonTestProviders - 	Defaults to false. If set to true, Providers of type different than TEST will be removed from the response list
   * @param includeTestProviders - Defaults to false. If set to true, Providers of TEST type will be added in the response list
   * @returns List of providers that match the query
   */
  async getProvidersMarket({
    market,
    capability,
    excludeNonTestProviders,
    includeTestProviders,
  }: ProviderMarketRequest): Promise<ProvidersResponse> {
    const accessToken = await this.client.requireToken("providers:read");

    const response = await this.client.request({
      endpoint: `api/v1/providers/${market}`,
      method: "GET",
      headers: this.client.tokenHeader(accessToken),
      parameters: {
        includeTestProviders: includeTestProviders || false,
        excludeNonTestProviders: excludeNonTestProviders || false,
        capability: capability || "",
      },
    });

    return response;
  }

  /**
   * List all provider consents for the user
   * @param userAccessToken - The user access token. Requires the provider-consents:read scope
   * @returns List of provider consents
   * @see https://docs.tink.com/api#connectivity-v1/provider-consent/list-provider-consents
   */

  async getProviderConsents({
    userAccessToken,
    credentialsId,
  }: ProviderConsentsRequest): Promise<ProviderConsentsResponse> {
    const response = await this.client.request({
      endpoint: "api/v1/provider-consents",
      method: "GET",
      headers: this.client.tokenHeader(userAccessToken),

      parameters: {
        credentialsId: credentialsId || "",
      },
    });

    return response;
  }

  /**
   * Extend a consent that is eligible for reconfirmation (sessionExtendable attribute).
   * @param userAccessToken - The user access token. Requires the provider-consents:write scope
   * @param credentialsId - The provider consent credentialsId to extend
   * @returns The updated provider consent
   * @see https://docs.tink.com/api#connectivity-v1/provider-consent/extend-a-consent
   */
  async extendProviderConsent({
    userAccessToken,
    credentialsId,
  }: ExtendConsentRequest): Promise<ExtendConsentResponse> {
    const response = await this.client.request({
      endpoint: "api/v1/provider-consents:extend",
      method: "POST",
      headers: this.client.tokenHeader(userAccessToken),
      body: {
        credentialsId: credentialsId,
      },
      contentType: "json",
    });

    return response;
  }
}
