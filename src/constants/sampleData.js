export const sampleChats = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Doe",
        _id: "1",
        groupChat: false,
        members: ["1", "2"]
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png", "https://www.w3schools.com/howto/img_avatar.png", "https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Boi",
        _id: "2",
        groupChat: false,
        members: ["1", "2"]
    },
];

export const sampleUsers = [
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Doe",
        _id: "1",
    },
    {
        avatar: ["https://www.w3schools.com/howto/img_avatar.png", "https://www.w3schools.com/howto/img_avatar.png", "https://www.w3schools.com/howto/img_avatar.png"],
        name: "John Boi",
        _id: "2",
    }
];

export const sampleNotifications = [
    {
        sender: {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "John Doe",
        },

        _id: "1",
    },
    {
        sender: {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "John Boi",
        },
        _id: "2",
    }
];

export const sampleMessages = [
    {
        attachments: [
            {
                public_id: "sdvs",
                url: "https://www.w3schools.com/howto/img_avatar.png"
            }
        ],
        content: "Heyy",
        _id: "dsvdsvsdvsdv",
        sender: {
            _id: "user._id",
            name: "Darshil",
        },
        chat: "chatId",
        createdAt: "2024-01-01T00:00:00.000Z"
    },
    {
        attachments: [
            {
                public_id: "sdvs",
                url: "https://www.w3schools.com/howto/img_avatar.png"
            }
        ],
        content: "Heyy",
        _id: "dsvdsvsdvsfdbvdfvdv",
        sender: {
            _id: "sdvcsdv",
            name: "Darshil",
        },
        chat: "chatId",
        createdAt: "2024-01-01T00:00:00.000Z"
    }
];

export const dashboardData = {
    users: [
        {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "John Doe",
            _id: "1",
            username: "john_doe",
            friends: 20,
            groups: 5
        },
        {
            avatar: ["https://www.w3schools.com/howto/img_avatar.png"],
            name: "John Boi",
            _id: "2",
            username: "john_boi",
            friends: 25,
            groups: 7
        }
    ],

    chats: [
        {
            _id: "1",
            avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
            name: 'Group 1',
            totalMembers: 5,
            members: ['https://www.w3schools.com/howto/img_avatar.png', 'https://www.w3schools.com/howto/img_avatar.png', 'https://www.w3schools.com/howto/img_avatar.png'],
            totalMessages: 50,
            creator: { name: 'John Doe', avatar: 'https://www.w3schools.com/howto/img_avatar.png' }
        },
        {
            _id: "2",
            avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
            name: 'Group 2',
            totalMembers: 10,
            members: ['https://www.w3schools.com/howto/img_avatar.png', 'https://www.w3schools.com/howto/img_avatar.png', 'https://www.w3schools.com/howto/img_avatar.png'],
            totalMessages: 100,
            creator: { name: 'Jane Smith', avatar: 'https://www.w3schools.com/howto/img_avatar.png' }
        },
        {
            _id: "3",
            avatar: ['https://www.w3schools.com/howto/img_avatar.png'],
            name: 'Group 3',
            totalMembers: 8,
            members: ['https://www.w3schools.com/howto/img_avatar.png', 'https://www.w3schools.com/howto/img_avatar.png', 'https://www.w3schools.com/howto/img_avatar.png'],
            totalMessages: 75,
            creator: { name: 'Alice Johnson', avatar: 'https://www.w3schools.com/howto/img_avatar.png' }
        }
    ],

    messages: [
        {
            _id: "1",
            attachments: [],
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
            sender: { name: 'John Doe', avatar: 'https://www.w3schools.com/howto/img_avatar.png' },
            chat: 'Chat 1',
            groupChat: false,
            createdAt: '2024-04-25T10:30:00Z'
          },
          {
            _id: "2",
            attachments: [`https://www.w3schools.com/howto/img_avatar.png`],
            content: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            sender: { name: 'Jane Smith', avatar: 'https://www.w3schools.com/howto/img_avatar.png' },
            chat: 'Chat 2',
            groupChat: true,
            createdAt: '2024-04-25T11:45:00Z'
          }
    ]

};