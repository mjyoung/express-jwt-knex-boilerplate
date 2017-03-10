export const extractTokenFromCookieOrAuthHeader = (req) => {
  let token = null;
  if (req.cookies && req.cookies.test_app_token) {
    token = req.cookies.test_app_token;
  } else if (req && req.headers && req.headers.authorization) {
    token = req.headers.authorization.split(' ')[1];
  }
  return token;
};
