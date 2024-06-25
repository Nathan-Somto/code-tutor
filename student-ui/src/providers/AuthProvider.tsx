import React, { createContext, useReducer, useContext,  } from 'react';


export type Auth = {
    profile_photo: string | undefined;
    username: string;
    profileId: string;
    userId: string;
    token: string;
}

type AuthState = {
    auth: Auth | null;
}

type AuthAction = 
    | { type: 'LOGIN'; payload: Auth }
    | { type: 'LOGOUT' };

const AuthContext = createContext<{
    state: AuthState;
    login: (user: Auth) => void;
    logout: () => void;
    isChecking: boolean;
} | undefined>(undefined);

const isValidAuth = (auth: any): auth is Auth => {
    return (
        auth.profile_photo !== undefined &&
        auth.username !== undefined &&
        auth.profileId !== undefined &&
        auth.userId !== undefined &&
        auth.token !== undefined
    );
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case 'LOGIN':
            return { ...state, auth: action.payload };
        case 'LOGOUT':
            return { ...state, auth: null };
        default:
            return state;
    }
};

// Initialize auth state from localStorage
const initState = (): AuthState => {
    const storedAuth = localStorage.getItem('auth-student');
    if (storedAuth) {
        const parsedAuth = JSON.parse(storedAuth);
        console.log(parsedAuth);
        if (isValidAuth(parsedAuth)) {
            return { auth: parsedAuth };
        } else {
            localStorage.removeItem('auth-student'); // Clear invalid data from localStorage
        }
    }
    return { auth: null };
};

export function AuthProvider ({ children }:{children: React.ReactNode}) {
    const [state, dispatch] = useReducer(authReducer, {auth: null});
    const [isChecking, setIsChecking] = React.useState(true);

    React.useEffect(() => {
        const localState = initState();
        console.log("the local state:", localState);
        if(localState.auth !== null){
            dispatch({ type: 'LOGIN', payload: localState.auth });
        }
        else {
            dispatch({ type: 'LOGOUT' });
        }
        setIsChecking(false);
        return () => setIsChecking(true);
    },[]);
    const login = (user: Auth) => {
        dispatch({ type: 'LOGIN', payload: user });
        localStorage.setItem('auth-student', JSON.stringify(user));
    };

    const logout = () => {
        dispatch({ type: 'LOGOUT' });
        localStorage.removeItem('auth-student');
    };

    return (
        <AuthContext.Provider value={{ state, login, logout, isChecking }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
