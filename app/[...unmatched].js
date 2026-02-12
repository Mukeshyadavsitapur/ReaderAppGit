import { Redirect } from 'expo-router';

// This file catches ANY route that doesn't exist (like a file share URL)
// and redirects it back to the home screen ("/") so your App.js can handle the data.
export default function UnmatchedRoute() {
  return <Redirect href="/" />;
}