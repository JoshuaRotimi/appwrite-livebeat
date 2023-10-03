import { Models } from "appwrite";
import { createContext, ReactNode, useContext, useState , useEffect} from "react";
import { logIn, getCurrentSession, verifySession, deleteCurrentSession, VerifySessionOptions } from "@/lib/auth";
import { getTeams } from "@/lib/users";

interface LiveBeatAuthContext {
    session?: Models.Session;
    isAdmin?: boolean;
    logOut: Function;
    logIn: Function;
    verifySession: Function;
}

interface AuthProviderProps {
    children: ReactNode
}

export const AuthContext = createContext<LiveBeatAuthContext | undefined>(undefined);

export const AuthProvider = ({children}: AuthProviderProps) => {
    const auth = useAuthState();
    return (
        <AuthContext.Provider value={auth}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuthState () {
    const [session, setSession] = useState<Models.Session>();
    const [isAdmin, setIsAdmin] = useState<boolean>();

    useEffect(() => {
        const run = async () => {
          const data = await getCurrentSession();
          setSession(data.session);
        };
        run(); 
      }, []);

      useEffect(() => {
        if( !session?.$id ) return;
        const run = async () => {
          const { teams } = await getTeams();
          const isAdmin = !!teams.find(team => team.$id === import.meta.env.VITE_APPWRITE_TEAM_ADMIN_ID);
          setIsAdmin(isAdmin);
        };
        run(); 
      }, [session?.$id]);

      async function logOut () {
        await deleteCurrentSession();
        setSession(undefined);
      }

      async function verifySessionAndSave (options: VerifySessionOptions) {
        const data = await verifySession(options);
        setSession(data);
      }

    return {
        session, 
        logIn, logOut, isAdmin,
        verifySession: verifySessionAndSave
    }
}

export function useAuth () {
    const auth = useContext(AuthContext);
    if(!auth) {
        throw new Error('useAuth needs to be called within AuthContext')
    }
    return auth;
}
