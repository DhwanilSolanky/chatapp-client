import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
    reducerPath: "api",
    baseQuery: fetchBaseQuery({
        baseUrl: "http://localhost:3000/api/v1/",
    }),
    tagTypes: ["Chat", "User", "Message"],
    endpoints: (builder) => ({
        myChats: builder.query({
            query: () => ({
                url: "chat/my",
                credentials: "include"
            }),
            providesTags: ["Chat"],
        }),

        searchUser: builder.query({
            query: (name) => ({
                url: `user/search?name=${name}`,
                credentials: "include"
            }),
            providesTags: ["User"],
        }),

        sendFriendRequest: builder.mutation({
            query: (data) => ({
                url: `user/sendrequest`,
                credentials: "include",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["User"],
        }),

        getNotifications: builder.query({
            query: () => ({
                url: `user/notifications`,
                credentials: "include"
            }),
            keepUnusedDataFor: 0,
        }),

        acceptFriendRequest: builder.mutation({
            query: (data) => ({
                url: `user/acceptrequest`,
                credentials: "include",
                method: "PUT",
                body: data
            }),
            invalidatesTags: ["Chat"],
        }),

        chatDetails: builder.query({
            query: ({ chatId, populate = false }) => {
                let url = `chat/${chatId}`;
                if (populate) url += "?populate=true";
                return {
                    url: url,
                    credentials: "include"
                }
            },
            providesTags: ["Chat"],
        }),

        getMessages: builder.query({
            query: ({ chatId, page }) => (
                {
                    url: `chat/message/${chatId}?page=${page}`,
                    credentials: "include"
                }
            ),
            keepUnusedDataFor: 0,
        }),

        sendAttachments: builder.mutation({
            query: (data) => ({
                url: `chat/message`,
                credentials: "include",
                method: "POST",
                body: data
            }),
        }),

        myGroups: builder.query({
            query: () => ({
                url: "chat/my/groups",
                credentials: "include"
            }),
            providesTags: ["Chat"],
        }),

        availableFriends: builder.query({
            query: (chatId) => {
                let url = `user/friends`;
                if (chatId) url += `?chatId=${chatId}`;
                return {
                    url: url,
                    credentials: "include"
                }
            },
            providesTags: ["Chat"],
        }),

        newGroup: builder.mutation({
            query: ({ name, members }) => ({
                url: `chat/new`,
                credentials: "include",
                method: "POST",
                body: { name, members }
            }),
            invalidatesTags: ["Chat"],
        }),

        renameGroup: builder.mutation({
            query: ({chatId, name}) => ({
                url: `chat/${chatId}`,
                credentials: "include",
                method: "PUT",
                body: { name }
            }),
            invalidatesTags: ["Chat"],
        }),

        removeGroupMember: builder.mutation({
            query: ({chatId, userId}) => ({
                url: `chat/removemember`,
                credentials: "include",
                method: "PUT",
                body: { chatId, userId }
            }),
            invalidatesTags: ["Chat"],
        }),

        addGroupMember: builder.mutation({
            query: ({chatId, members}) => ({
                url: `chat/addmembers`,
                credentials: "include",
                method: "PUT",
                body: { chatId, members }
            }),
            invalidatesTags: ["Chat"],
        }),

        deleteChat: builder.mutation({
            query: (chatId) => ({
                url: `chat/${chatId}`,
                credentials: "include",
                method: "DELETE",
            }),
            invalidatesTags: ["Chat"],
        }),

        leaveGroup: builder.mutation({
            query: (chatId) => ({
                url: `chat/leave/${chatId}`,
                credentials: "include",
                method: "DELETE",
            }),
            invalidatesTags: ["Chat"],
        }),
    })
});

export default api;
export const {
    useMyChatsQuery,
    useLazySearchUserQuery,
    useSendFriendRequestMutation,
    useGetNotificationsQuery,
    useAcceptFriendRequestMutation,
    useChatDetailsQuery,
    useGetMessagesQuery,
    useSendAttachmentsMutation,
    useMyGroupsQuery,
    useAvailableFriendsQuery,
    useNewGroupMutation,
    useRenameGroupMutation,
    useRemoveGroupMemberMutation,
    useAddGroupMemberMutation,
    useDeleteChatMutation,
    useLeaveGroupMutation,
} = api;