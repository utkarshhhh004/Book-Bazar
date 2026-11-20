
import api, {
  setAccessToken,
  clearAccessToken,
} from "./api";

const getResponseData = (response) => {
  return response.data?.data ?? response.data;
};

const getAccessTokenFromResponse = (response) => {
  const data = getResponseData(response);
  const token = data?.accessToken;

  if (!token) {
    throw new Error("Authentication response did not contain an access token.");
  }

  return token;
};

export const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return getResponseData(response);
};

export const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  const token = getAccessTokenFromResponse(response);

  setAccessToken(token);

  const data = getResponseData(response);

  return {
    ...data,
    accessToken: token,
    user: data.user,
  };
};

export const refreshSession = async () => {
  const response = await api.post("/auth/refresh", {});
  const token = getAccessTokenFromResponse(response);

  setAccessToken(token);

  return {
    ...getResponseData(response),
    accessToken: token,
  };
};

export const getCurrentUser = async () => {
  const response = await api.get("/auth/me");
  return getResponseData(response);
};

export const logout = async () => {
  try {
    await api.post("/auth/logout");
  } finally {
    clearAccessToken();
  }
};

export const logoutAll = async () => {
  try {
    await api.post("/auth/logout-all");
  } finally {
    clearAccessToken();
  }
};

export const verifyEmail = async (token) => {
  const response = await api.post("/auth/verify-email", { token });
  return getResponseData(response);
};

export const resendVerificationEmail = async () => {
  const response = await api.post("/auth/resend-verification");
  return getResponseData(response);
};

export const forgotPassword = async (email) => {
  const response = await api.post("/auth/forgot-password", { email });
  return getResponseData(response);
};

export const resetPassword = async (token, newPassword) => {
  const response = await api.post("/auth/reset-password", {
    token,
    newPassword,
  });

  return getResponseData(response);
};
