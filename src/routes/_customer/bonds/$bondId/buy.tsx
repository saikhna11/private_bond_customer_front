import { createFileRoute } from '@tanstack/react-router';
import { BondBuy } from '@/components/bond/bond-buy';

export const Route = createFileRoute('/_customer/bonds/$bondId/buy')({
  component: BuyPage,
});

function BuyPage() {
  const { bondId } = Route.useParams();
  return <BondBuy bondId={bondId} />;
}
