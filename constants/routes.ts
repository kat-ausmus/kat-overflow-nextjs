const ROUTES = {
  HOME: '/',
  SIGN_IN: '/sign-in',
  SIGN_UP: '/sign-up',
  ASK_QUESTION: '/ask-a-question',
  PROFILE: (id: string) => `/profile/${id}`,
  QUESTION: (id: string) => `/question/${id}`,
  TAGS: (id: string) => `/tags/${id}`,
  SIGN_IN_WITH_OAUTH: `signin-with-oauth`,
  USERS: 'users',
  USER_BY_ID: (id: string) => `users/${id}`,
  USER_BY_EMAIL: `users/email`,
  ACCOUNTS: 'accounts',
  ACCOUNT_BY_ID: (id: string) => `accounts/${id}`,
  ACCOUNT_BY_PROVIDER: `accounts/provider`,
};

export default ROUTES;
