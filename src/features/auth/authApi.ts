import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/auth", credentials: "include" }),

  endpoints: (builder) => ({
    login: builder.mutation<
      { message: string },
      { email: string; password: string }
    >({
      query: ({ ...body }) => ({
        url: "/login",
        method: "POST",
        body,
      }),
    }),
    register: builder.mutation<
      { id: number; email: string },
      { email: string; password: string }
    >({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
    }),
    checkAuth: builder.query<{ isAuthenticated: boolean }, void>({
      query: () => "/check-auth",
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useLogoutMutation, useCheckAuthQuery } =
  authApi;
