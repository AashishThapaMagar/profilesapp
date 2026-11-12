import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Authenticator } from '@aws-amplify/ui-react';
import { Amplify } from 'aws-amplify';
import { generateClient } from 'aws-amplify/data';
import outputs from '../amplify_outputs.json';
import '@aws-amplify/ui-react/styles.css';
import './style.css';

Amplify.configure(outputs);
const client = generateClient({ authMode: 'userPool' });

function Profile({ signOut }) {
  const [state, setState] = useState({ loading: true });
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const { data, errors } = await client.models.UserProfile.list();
        if (errors?.length) throw new Error('Unable to read your profile.');
        if (active) setState({ profile: data[0] });
      } catch {
        if (active) setState({ error: true });
      }
    }
    load();
    return () => { active = false; };
  }, []);
  return <section className="card" aria-live="polite">
    <div className="row"><h2>Your profile</h2><button type="button" onClick={signOut}>Sign out</button></div>
    {state.loading ? <p>Loading your saved profile…</p>
      : state.error ? <p role="alert">Could not load your profile. Refresh the page to try again.</p>
      : state.profile ? <><span className="status">Profile loaded from AWS</span><dl><dt>Email address</dt><dd>{state.profile.email}</dd></dl></>
      : <p>No saved profile was found. For this tutorial, confirm a new account after the post-confirmation function is deployed.</p>}
  </section>;
}

function App() {
  return <main className="shell">
    <header><p className="eyebrow">AWS WEB APPLICATION · TASK 5</p><h1>Profiles App</h1><p className="author">Created by <strong>Aashish Thapa Magar</strong></p></header>
    <Authenticator>{({ signOut }) => <Profile signOut={signOut} />}</Authenticator>
  </main>;
}

createRoot(document.getElementById('root')).render(<App />);
