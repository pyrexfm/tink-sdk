export type HeadersType = {
  [key: string]: string;
};

export type BodyType = {
  [key: string]: string | number | boolean;
};

export type QueryParametersType = {
  [key: string]: string[] | string | number | boolean;
};

export type RequestParameters = RequestBodyParameters | RequestNoBodyParameters;

export interface RequestBodyParameters {
  method: "POST" | "PUT";
  endpoint: string;
  parameters?: QueryParametersType;
  headers?: HeadersType;
  body?: BodyType;
  contentType: "none" | "json" | "x-www-form-urlencoded";
}

export interface RequestNoBodyParameters {
  method: "GET" | "DELETE";
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
  | "authorization:grant"
  | "providers:read";

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

export type AccountType =
  | "CHECKING"
  | "SAVINGS"
  | "INVESTMENT"
  | "MORTGAGE"
  | "CREDIT_CARD"
  | "LOAN"
  | "PENSION"
  | "OTHER"
  | "EXTERNAL";

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
  type: AccountType;
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
  desired?: CountryCode;
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

export type Capability =
  | "UNKNOWN"
  | "TRANSFERS"
  | "MORTGAGE_AGGREGATION"
  | "CHECKING_ACCOUNTS"
  | "SAVINGS_ACCOUNTS"
  | "CREDIT_CARDS"
  | "INVESTMENTS"
  | "LOANS"
  | "PAYMENTS"
  | "MORTGAGE_LOAN"
  | "IDENTITY_DATA"
  | "CREATE_BENEFICIARIES"
  | "LIST_BENEFICIARIES"
  | "CREATE_BENEFICIARIES_IN_PAYMENT";

export type ProvidersRequest = {
  userAccessToken: string;
  includeTestProviders?: boolean;
  excludeNonTestProviders?: boolean;
  capability?: Capability;
  name?: string;
};

export type ProvidersResponse = {
  providers: Provider[];
};

type Provider = {
  accessType: string;
  authenticationFlow: string;
  authenticationUserType: string;
  capabilities: Capability[];
  credentialsType: string;
  currency: string;
  displayDescription: string;
  displayName: string;
  fields: Field[];
  financialInstitutionId: string;
  financialInstitutionName: string;
  financialServices: {
    segment: string;
    shortName: string;
  }[];
  groupDisplayName: string;
  hasAuthenticationOptions: boolean;
  healthStatus: {
    providerLogin: {
      status: string;
    };
  };
  images: {
    banner: string;
    icon: string;
  };
  loginHeaderColour: string;
  market: string;
  multiFactor: boolean;
  name: string;
  passwordHelpText: string;
  pisCapabilities: string[];
  popular: boolean;
  releaseStatus: string;
  status: string;
  transactional: boolean;
  type: string;
};

type Field = {
  additionalInfo: string;
  checkbox: boolean;
  description: string;
  group: string;
  helpText: string;
  hint: string;
  immutable: boolean;
  masked: boolean;
  maxLength: number;
  minLength: number;
  name: string;
  numeric: boolean;
  oneOf: boolean;
  optional: boolean;
  pattern: string;
  patternError: string;
  selectOptions: {
    iconUrl: string;
    text: string;
    value: string;
  }[];
  sensitive: boolean;
  style: string;
  type: string;
  value: string;
};

export type ProviderMarketRequest = {
  market: CountryCode;
  includeTestProviders?: boolean;
  excludeNonTestProviders?: boolean;
  capability?: Capability;
};

export type ProviderConsentsRequest = {
  userAccessToken: string;
  credentialsId?: string;
};

export type ProviderConsentsResponse = {
  providerConsents: ProviderConsent[];
};

export type ProviderConsent = {
  accountIds: string[];
  credentialsId: string;
  detailedError: {
    details: {
      reason: string;
      retryable: boolean;
    };
    displayMessage: string;
    type: string;
  };
  providerName: string;
  sessionExpiryDate: number;
  sessionExtendable: boolean;
  status: CredentialStatus;
  statusUpdated: number;
};

export type CredentialStatus =
  | "CREATED"
  | "AUTHENTICATING"
  | "AWAITING_MOBILE_BANKID_AUTHENTICATION"
  | "AWAITING_SUPPLEMENTAL_INFORMATION"
  | "UPDATING"
  | "UPDATED"
  | "AUTHENTICATION_ERROR"
  | "TEMPORARY_ERROR"
  | "PERMANENT_ERROR"
  | "AWAITING_THIRD_PARTY_APP_AUTHENTICATION"
  | "DELETED"
  | "SESSION_EXPIRED";

export type ExtendConsentRequest = {
  userAccessToken: string;
  credentialsId: string;
};

export type ExtendConsentResponse = ProviderConsent;

export type CredentialsRequest = {
  userAccessToken: string;
};

export type Credential = {
  fields: { [key: string]: string };
  id: string;
  providerName: string;
  sessionExpiryDate: number;
  status: CredentialStatus;
  statusPayload: string;
  statusUpdated: number;
  type: string;
  updated: number;
  userId: string;
};

export type CredentialsResponse = {
  credentials: Credential[];
};

export type DeleteCredentialRequest = {
  userAccessToken: string;
  credentialId: string;
};
