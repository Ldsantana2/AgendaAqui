// This file is deprecated and has been replaced by calendar.tsx
// It is kept as a placeholder to prevent broken links
// Please use the calendar page for appointment management

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AppointmentsPage() {
  const router = useRouter();
  
  useEffect(() => {
    // Redirect to the new calendar page
    router.push('/calendar');
  }, [router]);
  
  return (
    <div className="container mx-auto p-6">
      <p>Redirecionando para o calendário...</p>
    </div>
  );
}