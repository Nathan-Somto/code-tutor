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
const initState = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth') as string) as Auth : null;
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
          localStorage.setItem('auth', JSON.stringify(user));
          setAuthToken(user.token);
        },
        logout() {
          // Perform logout logic, then clear the user
          this.auth = null;
          localStorage.removeItem('auth');
          setAuthToken(null);
        },
      },
});