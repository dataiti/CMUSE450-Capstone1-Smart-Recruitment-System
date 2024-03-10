import { rootApi } from "../../../configs/rootApi";

const rasaApi = rootApi.injectEndpoints({
  endpoints: (builder) => ({
    getStoriesData: builder.query({
      query: () => {
        return {
          url: "/rasa/stories/get-stories",
          method: "GET",
        };
      },
    }),
    addStory: builder.mutation({
      query: ({ data }) => {
        return {
          url: "/rasa/stories/add-story",
          method: "POST",
          body: data,
        };
      },
    }),
    updateStory: builder.mutation({
      query: ({ data, storyName }) => {
        return {
          url: `/rasa/stories/update-story?storyName=${storyName}`,
          method: "PUT",
          body: data,
        };
      },
    }),
    deleteStory: builder.mutation({
      query: ({ storyName }) => {
        return {
          url: `/rasa/stories/delete-story?storyName=${storyName}`,
          method: "DELETE",
        };
      },
    }),
  }),
});

export const {
  useGetStoriesDataQuery,
  useAddStoryMutation,
  useDeleteStoryMutation,
  useUpdateStoryMutation,
} = rasaApi;