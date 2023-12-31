import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export type TimeSlot = {
  isBooked: boolean;
  detailClass: string;
};

export type Day = Map<string, TimeSlot>;

export type Calendar = Map<string, Day>;

export type User = {
  _id: string;
  name: string;
  uidFireBase: string;
  email: string;
  isWizard: boolean;
  languages: string [];
  subjects:  string [];
  experience: {
    title: []| string;
    origin: []|string;
    expJobs: number;
  };
  pricePerOne: number;
  pricePerTwo: number;
  pricePerThree: number;
  aboutMe: string;
  image: string;
  reviews: number;
  isDisabled: boolean;
  role: ["admin", "user"];
  calendar: Calendar;
};

export type Job = {
  _id: string;
  status: string;
  description: string;
  price: number;
  numClasses: number;
  clientId: string;
  workerId: string;
  language: string;
  subject: string;
  result: string;
  availability: { day: string, hour: string }[];
  rating?: number;
}

export type UpdateUserWizardDto = {
  isWizard?: boolean;
  languages?: string;
  subjects?: string;
  experience?: {
    title?: string;
    origin?: string;
  };
  image?: string;
  aboutMe?: string;
  pricePerOne?: number;
  pricePerTwo?: number;
  pricePerThree?: number;
};



export type UpdateJobWorkerDto = {
  status: string;
};

export type UpdateJobReviewDto = {
  rating: number;
};

export const userApi = createApi({
  reducerPath: "userApi",
  refetchOnFocus: true, 
  baseQuery: fetchBaseQuery({
    baseUrl: "https://bid-wiz-backend.vercel.app",
  }),
  endpoints: (builder) => ({
    getUsers: builder.query<User[], null>({
      query: () => "users",
    }),
    getUserById: builder.query<User, { _id: string }>({
      query: ({ _id }) => `users/wizard/${_id}`,
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: `users`,
        method: "POST",
        body: newUser,
      }),
    }),
    disableUser: builder.mutation<void, { _id: string }>({
      query: ({ _id }) => ({
        url: `users/${_id}`,
        method: "DELETE",
      }),
    }),
    ableUser: builder.mutation<void, { _id: string }>({
      query: ({ _id }) => ({
        url: `users/able/${_id}`,
        method: "PATCH",
      }),
    }),
    
    updateWizardStatus: builder.mutation<User, { _id: string; updateUserWizardDto: UpdateUserWizardDto }>({
      query: ({ _id, updateUserWizardDto }) => ({
        url: `users/${_id}/wizard`,
        method: "PATCH",
        body: updateUserWizardDto,
      }),
    }),
    getWizards: builder.query<
      User[],
      {
        subjects?: string[];
        languages?: string[];
        page?: number;
        limit?: number;
      }
    >({
      query: ({ subjects, languages, page = 1, limit =  9 }) => {
        let url = `users/wizards?page=${page}&size=${limit}`;

        if (subjects) {
          url += `&subjects=${subjects}`;
        }

        if (languages) {
          url += `&languages=${languages}`;
        }

        return url;
      },
    }),
    createJob: builder.mutation<Job, Partial<Job>>({
      query: (newJob) => ({
        url: `jobs`,
        method: "POST",
        body: newJob,
      }),
    }),
    updateJobWorker: builder.mutation<Job, { jobId: string; workerId: string; updateJobWorkerDto: UpdateJobWorkerDto }>({
      query: ({ jobId, workerId, updateJobWorkerDto }) => ({
        url: `jobs/finish/${jobId}/${workerId}`,
        method: "PATCH",
        body: updateJobWorkerDto,
      }),
    }),

    updateJobReview: builder.mutation<Job, { jobId: string; clientId: string; updateJobReviewDto: UpdateJobReviewDto }>({
      query: ({ jobId, clientId, updateJobReviewDto }) => ({
        url: `jobs/review/${jobId}/${clientId}`,
        method: "PATCH",
        body: updateJobReviewDto,
      }),
    }),

    getJobsByWorker: builder.query<Job[], { workerId: string }>({
      query: ({ workerId }) => `jobs/worker/${workerId}`,
    }),

    getJobsByClient: builder.query<Job[], { clientId: string }>({
      query: ({ clientId }) => `jobs/client/${clientId}`,
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useDisableUserMutation,
  useAbleUserMutation,
  useUpdateWizardStatusMutation,
  useGetWizardsQuery,
  useCreateJobMutation,
  useGetJobsByWorkerQuery,
  useGetJobsByClientQuery,
  useUpdateJobWorkerMutation,
  useUpdateJobReviewMutation,
} = userApi;
