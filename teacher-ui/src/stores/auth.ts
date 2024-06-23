import { setAuthToken } from "@/config/apiClient";
import { defineStore } from "pinia";
export type Auth = {
    profile_photo: string | undefined;
    name: string;
    profileId: string;
    userId: string;
    token: string;
}
type AuthStoreState = {
    auth: Auth | null;
}
function isValidAuth(auth: any): auth is Auth {
  return (
    auth &&
    typeof auth === 'object' &&
    'profile_photo' in auth &&
    'name' in auth &&
    'profileId' in auth &&
    'userId' in auth &&
    'token' in auth
  );
}

// Initialize auth state from localStorage
const initState = (() => {
  const storedAuth = localStorage.getItem('auth');
  if (storedAuth) {
    const parsedAuth = JSON.parse(storedAuth);
    if (isValidAuth(parsedAuth)) {
      return parsedAuth;
    } else {
      localStorage.removeItem('auth'); // Clear invalid data from localStorage
    }
  }
  return null;
})();

export const useAuthStore = defineStore('authStore', {
    state: (): AuthStoreState => ({
        auth: initState
    }),
    getters: {
        isAuthenticated: state => !!state.auth,
      },
      actions: {
        login(user: Auth) {
          // Perform login logic, then commit the user
          this.auth = user;
          setAuthToken(user.token);
          localStorage.setItem('auth', JSON.stringify(user));
        },
        logout() {
          // Perform logout logic, then clear the user
          this.auth = null;
          localStorage.removeItem('auth');
          setAuthToken(null);
        },
      },
});