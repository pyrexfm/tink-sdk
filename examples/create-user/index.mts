import TinkClient from "../../src/index";

const tink = new TinkClient({
  clientId: process.env.TINK_CLIENT_ID || "",
  clientSecret: process.env.TINK_CLIENT_SECRET || "",
});

try {
  console.log("Creating user...");
  const user = await tink.user.createUser({
    externalUserId: "test-user",
    market: "GB",
    locale: "en_US",
  });

  console.log("User created", user);

  console.log("Generating user code...");
  const userCode = await tink.user.generateUserCode({
    scope: "user:read",
    userId: user.user_id,
  });

  console.log("User code generated", userCode);

  console.log("Generating user access token...");
  const userAccessToken = await tink.generateUserAccessToken({
    code: userCode.code,
  });
  console.log("User access token generated", userAccessToken);

  console.log("Getting user details...");
  const userDetails = await tink.user.getUser({
    userAccessToken: userAccessToken.access_token,
  });

  console.log("User details", userDetails);
} catch (error) {
  console.error(error);
  /*
  {
        name: "Request failed",
        message: "Request failed with status 404: Not found",
        status: 404,
        statusText: Not found,
        request: {
          url: `http://tink.api.com/notfound?foo=bar`,
          options: fetchOptions,
        },
        response: Fetch response object,
  };
  */
}
