import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { Project } from "./type";

export type AssignedInternsMap = { [key: number]: number[] };

export const projectsApi = createApi({
  reducerPath: "projectsApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["Projects", "ProjectHistory", "AssignedInterns"],
  endpoints: (builder) => ({
    getAllProjects: builder.query<Project[], void>({
      query: () => "/interns/project",
      providesTags: ["Projects"],
    }),

    addProject: builder.mutation<Project, { name: string }>({
      query: ({ name }) => ({
        url: "/interns/project",
        method: "POST",
        body: { name, status: "in_progress" },
      }),
      invalidatesTags: ["Projects"],
    }),

    assignProjectToInterns: builder.mutation<
      void,
      { projectId: number; internIds: number[] }
    >({
      query: ({ projectId, internIds }) => ({
        url: "/interns/projects",
        method: "POST",
        body: {
          project_id: projectId,
          intern_ids: internIds,
        },
      }),
      invalidatesTags: ["AssignedInterns"],
    }),

    unassignProjectFromInterns: builder.mutation<
      void,
      { projectId: number; internIds: number[] }
    >({
      query: ({ projectId, internIds }) => ({
        url: "/interns/projects/unassign",
        method: "POST",
        body: {
          project_id: projectId,
          intern_ids: internIds,
        },
      }),
      invalidatesTags: ["AssignedInterns"],
    }),

    getAssignedInterns: builder.query<number[], number>({
      query: (projectId) => `/projects/${projectId}/interns`,
      transformResponse: (response: { id: number }[]) =>
        response.map((intern) => intern.id),
      providesTags: ["AssignedInterns"],
    }),
    getAllAssignedInterns: builder.query<AssignedInternsMap, void>({
      query: () => "/assigned-interns",
      providesTags: ["AssignedInterns"],
    }),

    updateProjectStatus: builder.mutation<
      void,
      { projectId: number; status: string }
    >({
      query: ({ projectId, status }) => ({
        url: "/projects/status",
        method: "PUT",
        body: { id: projectId, status },
      }),
      invalidatesTags: ["Projects"],
    }),

    logProjectHistory: builder.mutation<
      void,
      { projectId: number; payload: { action: string; status?: string } }
    >({
      query: ({ projectId, payload }) => ({
        url: `/projects/${projectId}/history`,
        method: "POST",
        body: payload,
      }),
      invalidatesTags: ["ProjectHistory"],
    }),

    getProjectHistory: builder.query<any, number>({
      query: (projectId) => `/projects/${projectId}/history`,
      providesTags: ["ProjectHistory"],
    }),
  }),
});

export const {
  useGetAllProjectsQuery,
  useAddProjectMutation,
  useAssignProjectToInternsMutation,
  useUnassignProjectFromInternsMutation,
  useGetAssignedInternsQuery,
  useUpdateProjectStatusMutation,
  useLogProjectHistoryMutation,
  useGetProjectHistoryQuery,
  useGetAllAssignedInternsQuery,
} = projectsApi;
