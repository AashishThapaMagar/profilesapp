import type { PostConfirmationTriggerHandler } from 'aws-lambda';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from '$amplify/env/post-confirmation';
import type { Schema } from '../../data/resource';

const config = await getAmplifyDataClientConfig(env);
Amplify.configure(config.resourceConfig, config.libraryOptions);
const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  if (event.triggerSource !== 'PostConfirmation_ConfirmSignUp') return event;
  const { email, sub } = event.request.userAttributes;
  if (!email || !sub) throw new Error('The confirmed account is missing its email or user ID.');
  const { data, errors } = await client.models.UserProfile.create({
    email,
    profileOwner: sub + '::' + event.userName,
  }, { authMode: 'iam' });
  if (!data || errors?.length) throw new Error('Could not save the confirmed user profile.');
  return event;
};
