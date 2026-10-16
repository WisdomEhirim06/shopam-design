import { redirect } from 'next/navigation';

// Editing now lives in Settings as a dialog. Keep this route working for
// any old links/bookmarks by redirecting.
export default function ProfileEditPage() {
  redirect('/profile/settings');
}
