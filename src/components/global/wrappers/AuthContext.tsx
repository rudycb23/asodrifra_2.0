import React, { createContext, useContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import { getAuth, onAuthStateChanged, setPersistence, browserSessionPersistence, type User } from "firebase/auth";

type AuthContextType = {
    user: User | null;
    loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
});

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        let unsubscribe: () => void = () => { };
        setPersistence(auth, browserSessionPersistence)
            .then(() => {
                unsubscribe = onAuthStateChanged(auth, (currentUser) => {
                    setUser(currentUser);
                    setLoading(false);
                });
            })
            .catch((error) => {
                setLoading(false);
                setUser(null);
                console.error("Error setting auth persistence:", error);
            });

        return () => unsubscribe();
    }, [auth]);


    return (
        <AuthContext.Provider value={{ user, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
