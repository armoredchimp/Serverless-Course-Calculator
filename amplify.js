const userId = process.env.USER_POOL_ID;
const clientId = process.env.USER_POOL_CLIENT_ID;

const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: userId,
      userPoolClientId: clientId,
    },
  },
};

export default amplifyConfig;
