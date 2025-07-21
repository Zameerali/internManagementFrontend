import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Intern } from "./type";
import { apiBaseQuery } from "../../app/apiBase";

export const internsApi = createApi({
  reducerPath: "internsApi",
  baseQuery: apiBaseQuery,
  tagTypes: ["Interns"],
  endpoints: (builder) => ({
    getAllInterns: builder.query<Intern[], void>({
      query: () => "/interns",
      providesTags: ["Interns"],
    }),

    addIntern: builder.mutation<
      Intern,
      {
        name: string;
        email: string;
        joined_date: string;
        bio?: string;
        linkedin?: string;
      }
    >({
      query: ({ name, email, joined_date, bio, linkedin }) => ({
        url: "/interns",
        method: "POST",
        body: { name, email, joined_date, bio, linkedin },
      }),
      invalidatesTags: ["Interns"],
    }),

    getInternWithProfile: builder.query<Intern[], { id: number }>({
      query: ({ id }) => `/interns/${id}/profile`,
      providesTags: ["Interns"],
    }),
  }),
});

export const {
  useGetAllInternsQuery,
  useAddInternMutation,
  useGetInternWithProfileQuery,
} = internsApi;
