export function AuthErrorResponse() {
  return {
    status: 401,
    message: "Not authenticated",
  };
}
