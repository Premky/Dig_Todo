import { createContext, useContext, useReducer, useEffect } from "react";
import axios from "axios";

const AuthContext = createContext();

const initialState = {
    token: null,
    user: null,
    role: null,
    office_np: null,
    branch_np: null,
    office_id: null,
    main_office_id: null,
    valid: false,
};

// Reducer function to handle login/logout actions
const authReducer = (state, action) => {
    // console.log("Action:", action);
    switch (action.type) {
        case "LOGIN":
            return {
                ...state,
                token: action.payload.token,
                user: action.payload.user,
                role: action.payload.role,
                role1: action.payload.usertype,
                office_np: action.payload.office_np,
                branch_np: action.payload.office_np,
                office_id: action.payload.office_np,
                main_office_id: action.payload.office_np,
                valid: true,
            };
        case "LOGOUT":
            return {
                ...state,
                token: null,
                user: null,
                role: null,
                office_np: null,
                branch_np: null,
                office_id: null,
                main_office_id: null,
                valid: false,
            };
        default:
            return state;
    }
};

// Context Provider Component
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);

    // Persist user session using cookies (HTTP-only) or sessionStorage
    useEffect(() => {
        const fetchSession = async () => {
            try {
                const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/auth/session`, {
                    withCredentials: true, // Ensures token is sent in cookies
                });
                if (response.data.token) {
                    // console.log(response.data);
                    dispatch({
                        type: "LOGIN",
                        payload: { token: response.data.token, 
                                user: response.data.user, 
                                role: response.data.role,                                
                                office_np: response.data.office_np,
                                branch_np: response.data.branch_np,
                                office_id: response.data.office_id,
                                main_office_id: response.data.main_office_id,
                                valid: response.data.success, },
                    });
                }
            } catch (error) {
                console.error("Session fetch failed:", error);
            }
        };

        fetchSession();
    }, []);

    return (
        <AuthContext.Provider value={{ state, dispatch }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom Hook to use Auth Context
export const useAuth = () => useContext(AuthContext);
