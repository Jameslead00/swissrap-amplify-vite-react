import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  List: a
    .model({
      userId: a.string(),
      name: a.string().required(),
      isPublic: a.boolean().default(true),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.guest().to(["read"]),
    ]),

  Word: a
    .model({
      listId: a.string(),
      content: a.string().required(),
      createdAt: a.datetime(),
    })
    .authorization((allow) => [
      allow.owner(),
      allow.guest().to(["read"]),
    ]),
  });

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    // API Key is used for a.allow.public() rules
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

