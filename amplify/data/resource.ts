import { a, defineData, type ClientSchema } from '@aws-amplify/backend';
import { postConfirmation } from '../auth/post-confirmation/resource';

const schema = a.schema({
  UserProfile: a.model({
    email: a.string().required(),
    profileOwner: a.string().required(),
  }).authorization((allow) => [allow.ownerDefinedIn('profileOwner').to(['read'])]),
}).authorization((allow) => [allow.resource(postConfirmation).to(['mutate'])]);

export type Schema = ClientSchema<typeof schema>;
export const data = defineData({
  schema,
  authorizationModes: { defaultAuthorizationMode: 'userPool' },
});
