import TinkClient from ".";

import { GenerateTransactionsLinkRequest } from "./types";

export default class LinkApi {
  client: TinkClient;

  constructor({ client }: { client: TinkClient }) {
    this.client = client;
  }

  /**
   * Generates a link to Tink Link
   * @param endpoint - The endpoint to generate the link for
   * @param authorizationCode - The authorization code to generate the link for
   * @param locale - The locale to generate the link for
   * @param market - The market to generate the link for
   * @param redirectUri - The redirect uri that the user will be redirected to after completing the flow
   * @param state - The state that should be added to the redirect link
   */
  generateTransactionsLink({
    code,
    locale,
    market,
    redirectUri,
    state,
  }: GenerateTransactionsLinkRequest) {
    return this.client.generateLink({
      endpoint: "1.0/transactions/connect-accounts",
      parameters: {
        authorization_code: code,
        client_id: this.client.clientId,
        locale: locale,
        market: market,
        redirect_uri: redirectUri,
        state: state || "",
      },
    });
  }
}
