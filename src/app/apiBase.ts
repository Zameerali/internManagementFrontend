import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { RootState } from "./store";

export const apiBaseQuery = fetchBaseQuery({
  baseUrl: "/api",
  credentials: "include",
  // prepareHeaders: (headers, { getState }) => {
  //   const token = (getState() as RootState).auth?.token;
  //   if (token) {
  //     headers.set("authorization", `Bearer ${token}`);
  //   }
  //   return headers;
  // },
});
