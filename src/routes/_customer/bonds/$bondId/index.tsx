import { createFileRoute } from '@tanstack/react-router';
import { BondDetail } from '@/components/bond/bond-detail';

export const Route = createFileRoute('/_customer/bonds/$bondId/')({
  component: BondPage,
});

function BondPage() {
  const { bondId } = Route.useParams();
  return <BondDetail bondId={bondId} />;
}
