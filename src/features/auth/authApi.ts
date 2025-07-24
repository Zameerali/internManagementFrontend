import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api/auth", credentials: "include" }),
  tagTypes: ["Profile"], 
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
      invalidatesTags: ["Profile"], 
    }),
    register: builder.mutation<
      { id: number; email: string },
      {
        email: string;
        password: string;
        first_name: string;
        last_name: string;
        phone: string;
        bio: string;
        image_url: string;
      }
    >({
      query: (body) => ({
        url: "/register",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Profile"], 
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({
        url: "/logout",
        method: "POST",
      }),
      invalidatesTags: ["Profile"], 
    }),
    checkAuth: builder.query<{ isAuthenticated: boolean }, void>({
      query: () => "/check-auth",
    }),
    getMyProfile: builder.query<any, void>({
      query: () => ({
        url: "/profile/me",
        method: "GET",
        credentials: "include",
      }),
      providesTags: ["Profile"], 
    }),
    updateMyProfile: builder.mutation<any, Partial<any>>({
      query: (body) => ({
        url: "/profile/me",
        method: "PUT",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Profile"], 
    }),
    checkEmailExists: builder.query<{ exists: boolean }, { email: string }>({
      query: ({ email }) => ({
        url: '/checkEmail',
        method: "GET",
        params: { email },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useLogoutMutation,
  useCheckAuthQuery,
  useGetMyProfileQuery,
  useUpdateMyProfileMutation,
  useCheckEmailExistsQuery,
} = authApi;
