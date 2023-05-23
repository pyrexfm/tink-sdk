import TinkClient from ".";

import {
  CredentialsRequest,
  CredentialsResponse,
  DeleteCredentialRequest,
} from "./types";

export default class CredentialApi {
  client: TinkClient;

  constructor({ client }: { client: TinkClient }) {
    this.client = client;
  }

  /**
   * Extend a consent that is eligible for reconfirmation (sessionExtendable attribute).
   * @param userAccessToken - The user access token. Requires the credentials:read scope
   * @returns A list of credentials
   * @see https://docs.tink.com/api#connectivity-v1/credentials/list-credentials
   */
  async listCredentials({
    userAccessToken,
  }: CredentialsRequest): Promise<CredentialsResponse> {
    const response = await this.client.request({
      endpoint: "api/v1/credentials/lis",
      method: "GET",
      headers: this.client.tokenHeader(userAccessToken),
    });

    return response;
  }

  async deleteCredential({
    userAccessToken,
    credentialId,
  }: DeleteCredentialRequest): Promise<void> {
    this.client.request({
      endpoint: `api/v1/credentials/${credentialId}`,
      method: "DELETE",
      headers: this.client.tokenHeader(userAccessToken),
    });
  }
}
