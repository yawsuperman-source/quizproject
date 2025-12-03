// This is the new page.tsx file. It is a Server Component.
// Its only job is to get the `id` from the router and pass it to the client component.
import AttemptDetailsClientPage from './attempt-details-client';

export default function AttemptDetailsPage({ params }: { params: { id: string } }) {
  return <AttemptDetailsClientPage id={params.id} />;
}
