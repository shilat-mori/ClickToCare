"use client";
import { useEffect, useState } from 'react';
import { getUserRoleFromCookies } from './services/frontUtils';
import { removeToken } from './services/frontUtils';
import { useRouter } from 'next/navigation';

export default function RootLayout({ children, }: Readonly<{ children: React.ReactNode; }>) {
  const [role, setRole] = useState<string | null>(null);
  const [prevRole, setPrevRole] = useState<string | null>(null); // Track previous role
  const router = useRouter();

  // useEffect(() => {
  //   console.log('Cookies:', document.cookie);
  //   const userRole = getUserRoleFromCookies();
  //   console.log('User Role:', userRole);
  //   setRole(userRole);
  // }, []);

  useEffect(() => {
    // Check role on initial render
    const initialRole = getUserRoleFromCookies();
    setRole(initialRole);
    setPrevRole(initialRole);

    // Interval to check for cookie changes
    const interval = setInterval(() => {
      const currentRole = getUserRoleFromCookies();
      if (currentRole !== prevRole) {
        setPrevRole(currentRole);
        setRole(currentRole);
        router.refresh(); // Refresh the layout on role change
      }
    }, 1000); // Check every second (adjust as needed)

    return () => clearInterval(interval); // Cleanup on unmount
  }, [prevRole, router]);


  const handleSignOut = () => {
    removeToken();      // Remove the token
    setRole(null);       // Clear the role in state
    router.refresh();    // Refresh to re-trigger layout check
  };

  return (
    <html lang="en">
      <body>
        <header>
          <h1>Welcome to the App</h1>
          {role && (
            <div>
              <p>User Role: {role}</p>
              <button onClick={handleSignOut} className="bg-red-500 text-white p-2 rounded">
                Sign Out
              </button>
            </div>
          )}
          {!role && <p>Not Logged In</p>}
        </header>
        <main>{children}</main>
      </body>
    </html>
  );
}
