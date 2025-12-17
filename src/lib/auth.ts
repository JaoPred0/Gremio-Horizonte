import { auth } from "./firebase";

export function isAuthenticated(): boolean {
  return !!auth.currentUser;
}
