import JwtService from "../services/jwt.service";

export const isAdmin = () => {
  const auth = JwtService.getAuth();
  if (!auth) return false;
  return auth.role == "Admin";
};
