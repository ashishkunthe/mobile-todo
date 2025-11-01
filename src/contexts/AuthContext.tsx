import React, { createContext, useReducer, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import api from "../api/api";

type User = { id: string; email: string };
type State = { user: User | null; token?: string; loading: boolean };
type Action =
  | { type: "RESTORE"; token?: string; user?: User }
  | { type: "LOGIN"; token: string; user: User }
  | { type: "LOGOUT" };

const initial: State = { user: null, loading: true };
const AuthContext = createContext<any>(null);

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "RESTORE":
      return { user: action.user || null, token: action.token, loading: false };
    case "LOGIN":
      return { user: action.user, token: action.token, loading: false };
    case "LOGOUT":
      return { user: null, token: undefined, loading: false };
    default:
      return state;
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [state, dispatch] = useReducer(reducer, initial);

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem("token");
      const user = token
        ? JSON.parse((await AsyncStorage.getItem("user")) || "null")
        : null;
      // @ts-ignore
      dispatch({ type: "RESTORE", token, user });
    })();
  }, []);

  const login = async (email: string, password: string) => {
    const { data } = await api.post("/auth/login", { email, password });
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    dispatch({ type: "LOGIN", token: data.token, user: data.user });
  };

  const register = async (email: string, password: string) => {
    const { data } = await api.post("/auth/register", { email, password });
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("user", JSON.stringify(data.user));
    dispatch({ type: "LOGIN", token: data.token, user: data.user });
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(["token", "user"]);
    dispatch({ type: "LOGOUT" });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
