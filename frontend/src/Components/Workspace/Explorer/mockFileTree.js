export const fileTree = [
  {
    type: "folder",
    name: "backend",
    children: [
      {
        type: "folder",
        name: "controllers",
        children: [
          { type: "file", name: "user.controller.js" },
          { type: "file", name: "auth.controller.js" },
        ],
      },
      {
        type: "folder",
        name: "models",
        children: [
          { type: "file", name: "user.model.js" },
        ],
      },
      {
        type: "folder",
        name: "routes",
        children: [
          { type: "file", name: "user.routes.js" },
        ],
      },
      { type: "file", name: "server.js" },
    ],
  },
];


