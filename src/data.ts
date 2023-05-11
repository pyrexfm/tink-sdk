import TinkClient from ".";

import {
  GetAccountsRequest,
  GetTransactionsRequest,
  GetAccountsReponse,
  GetTransactionsResponse,
} from "./types";

export default class DataApi {
  client: TinkClient;

  constructor({ client }: { client: TinkClient }) {
    this.client = client;
  }

  /**
   * Returns the current user accounts
   * @param userAccessToken - The user access token. Requires the accounts:read scope.
   * @param pageSize - The number of accounts to return per page
   * @param pageToken - The page token to use for pagination
   * @param types - The types of accounts to return
   * @returns the current accounts
   */
  async getAccounts({
    userAccessToken,
    pageSize,
    pageToken,
    types,
  }: GetAccountsRequest): Promise<GetAccountsReponse> {
    const response = await this.client.request({
      endpoint: "data/v2/accounts",
      parameters: {
        ...(types && { typeIn: types }),
        ...(pageSize && { pageSize: pageSize }),
        ...(pageToken && { pageToken: pageToken }),
      },
      headers: this.client.tokenHeader(userAccessToken),
      method: "GET",
    });

    return response;
  }

  /**
   * Returns the current user transactions
   * @param userAccessToken - The user access token. Requires the transactions:read scope.
   * @param accountIds - The account ids to return transactions for
   * @param pageSize - The number of transactions to return per page
   * @param pageToken - The page token to use for pagination
   * @param pending - Whether to include pending transactions
   * @param startDate - The start date of the date range to return transactions for
   * @param endDate - The end date of the date range to return transactions for
   * @param statuses - The statuses of transactions to return
   * @returns the current user transactions
   */
  async getTransactions({
    userAccessToken,
    accountIds,
    pageSize,
    pageToken,
    pending,
    startDate,
    endDate,
    statuses,
  }: GetTransactionsRequest): Promise<GetTransactionsResponse> {
    const response = await this.client.request({
      endpoint: "data/v2/accounts",
      parameters: {
        ...(accountIds && { accountIdIn: accountIds }),
        ...(pageSize && { pageSize: pageSize }),
        ...(pageToken && { pageToken: pageToken }),
        ...(pending && { pending: pending }),
        ...(startDate && { bookedDateGte: startDate }),
        ...(endDate && { bookedDateLte: endDate }),
        ...(statuses && { statusIn: statuses }),
      },
      headers: this.client.tokenHeader(userAccessToken),
      method: "GET",
    });

    return response;
  }
}
