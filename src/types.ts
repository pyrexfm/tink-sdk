export type HeadersType = {
  [key: string]: string;
};

export type BodyType = {
  [key: string]: string | number | boolean;
};

export type QueryParametersType = {
  [key: string]: string[] | string | number | boolean;
};

export type RequestParameters = NonGetParameters | GetParameters;

export interface NonGetParameters {
  method: "POST" | "PUT" | "DELETE";
  endpoint: string;
  parameters?: QueryParametersType;
  headers?: HeadersType;
  body?: BodyType;
  contentType: "none" | "json" | "x-www-form-urlencoded";
}

export interface GetParameters {
  method: "GET";
  endpoint: string;
  parameters?: QueryParametersType;
  headers?: HeadersType;
  body?: undefined;
  contentType?: undefined;
}

export type AccessTokenRequest = {
  scope: string;
};

export type Scope =
  | "accounts:read"
  | "transactions:read"
  | "user:create"
  | "user:read"
  | "user:delete"
  | "authorization:grant";

export type AccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

export type AccessToken = AccessTokenResponse & { expiresAt: Date };

export type UserAccessTokenRequest = {
  code: string;
};

export type UserAccessTokenResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

export type CreateUserRequest = {
  externalUserId: string;
  market: string;
  locale: string;
};

export type CreateUserResponse = {
  external_user_id: string;
  user_id: string;
};

export type GetUserRequest = {
  userAccessToken: string;
};

export type GetUserResponse = {
  appId: string;
  created: string;
  externalUserId: string;
  flags: string[];
  id: string;
  nationalId: string;
  cashbackEnabled: boolean;
  currency: string;
  locale: string;
  market: string;
  notificationSettings: {
    balance: boolean;
    budget: boolean;
    doubleCharge: boolean;
    einvoices: boolean;
    fraud: boolean;
    income: boolean;
    largeExpense: boolean;
    leftToSpend: boolean;
    loanUpdate: boolean;
    summaryMonthly: boolean;
    summaryWeekly: boolean;
    transaction: boolean;
    unusualAccount: boolean;
    unusualCategory: boolean;
  };
  periodAdjustedDay: number;
  periodMode: string;
  timeZone: string;
  username: string;
};

export type DeleteUserRequest = {
  userAccessToken: string;
};

export type CreateUserGrantRequest = {
  hint: string;
  scope: string;
} & (
  | {
      userId: string;
      externalUserId?: never;
    }
  | {
      userId?: never;
      externalUserId: string;
    }
);

export type CreateUserGrantResponse = {
  code: string;
};

export type UserCodeRequest = {
  scope: string;
} & (
  | {
      userId: string;
      externalUserId?: never;
    }
  | {
      userId?: never;
      externalUserId: string;
    }
);

export type UserCodeResponse = {
  code: string;
};

export type GenerateTransactionsLinkRequest = {
  code: string;
  locale: string;
  market: string;
  redirectUri: string;
  state?: string;
};

export type GetAccountsRequest = {
  userAccessToken: string;
  pageSize?: number;
  pageToken?: string;
  types?: string[];
};

export interface GetAccountsReponse {
  accounts: Account[];
  nextPageToken: string;
}

export interface Account {
  balances: {
    booked: {
      amount: Amount;
    };
  };
  customerSegment: string;
  dates: {
    lastRefreshed: string;
  };
  financialInstitutionId: string;
  id: string;
  identifiers: {
    iban: {
      bban: string;
      iban: string;
    };
    pan: {
      masked: string;
    };
  };
  name: string;
  type: string;
}

export interface Amount {
  currencyCode: string;
  value: Value;
}

export interface Value {
  scale: number;
  unscaledValue: number;
}

export type GetTransactionsRequest = {
  userAccessToken: string;
  accountIds?: string[];
  pending?: boolean;
  pageSize?: number;
  pageToken?: string;
  statuses?: string[];
  startDate?: string;
  endDate?: string;
};

export interface GetTransactionsResponse {
  nextPageToken: string;
  transactions: Transaction[];
}

export interface Transaction {
  accountId: string;
  amount: Amount;
  categories: {
    pfm: {
      id: string;
      name: string;
    };
  };
  dates: {
    booked: string;
    value: string;
  };
  descriptions: {
    display: string;
    original: string;
  };
  id: string;
  identifiers: {
    providerTransactionId: string;
  };
  merchantInformation: {
    merchantCategoryCode: string;
    merchantName: string;
  };
  providerMutability: string;
  reference: string;
  status: string;
  types: {
    financialInstitutionTypeCode: string;
    type: string;
  };
}

export type CountryCode =
  | "AT"
  | "AU"
  | "BE"
  | "BG"
  | "BR"
  | "CA"
  | "CH"
  | "CY"
  | "CZ"
  | "DE"
  | "DK"
  | "EE"
  | "ES"
  | "FI"
  | "FO"
  | "FR"
  | "GB"
  | "GR"
  | "HR"
  | "HU"
  | "IE"
  | "IN"
  | "IT"
  | "LT"
  | "LU"
  | "LV"
  | "MT"
  | "MX"
  | "NL"
  | "NO"
  | "NZ"
  | "PL"
  | "PT"
  | "RO"
  | "SE"
  | "SG"
  | "SI"
  | "SK"
  | "UK"
  | "US";

export type MarketsRequest = {
  desired: CountryCode;
};

export type MarketsResponse = {
  markets: Market[];
};

export type Market = {
  code: string;
  currencies: {
    code: string;
    factor: number;
    prefixed: boolean;
    symbol: string;
  }[];
  defaultCurrency: string;
  defaultTimeZone: string;
  description: string;
  suggested: boolean;
};
