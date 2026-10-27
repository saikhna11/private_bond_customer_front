import { partyLabels, partyName } from '@/components/contract/format';
import type { ContractType } from '@/queries/contract/type';

/**
 * What a contract not signed yet says of itself: cancelled and why, waiting for the other
 * parties' signatures, or its PDF rendering, slow once the page stopped polling for it.
 */
export function pendingCopy(
  contract: ContractType,
  slow: boolean,
): { title: string; message: string } {
  if (contract.status === 'cancelled') {
    const decliner = contract.parties.find((p) => p.declined_at);
    return {
      title: 'Гэрээ цуцлагдсан',
      message:
        contract.cancel_reason === 'expired'
          ? 'Бүх тал хугацаандаа гарын үсэг зураагүй тул гэрээ цуцлагдлаа.'
          : `${decliner ? `${partyLabels[decliner.type]} ${partyName(decliner)}` : 'Гэрээний тал'} татгалзсан тул гэрээ цуцлагдлаа.`,
    };
  }
  const title = 'Гарын үсгийг хүлээн авлаа';
  if (contract.status === 'pending_signature') {
    return {
      title,
      message:
        'Бусад талын гарын үсгийг хүлээж байна. Тэд өөрсдийн бүртгэлээр нэвтэрч зурна. Бүгд зурсны дараа гэрээ дугаарлагдаж, эцсийн хувь бэлтгэгдэнэ.',
    };
  }
  if (slow) {
    return {
      title,
      message:
        'Гэрээний эцсийн хувийг бэлтгэхэд ердийнхөөс удаж байна. "Дахин шалгах" товчийг дарах, эсвэл дараа нь гэрээнийхээ жагсаалтаас шалгана уу.',
    };
  }
  return {
    title,
    message:
      'Гэрээний эцсийн хувийг бэлтгэж байна. Энэ хуудас бэлэн болмогц шинэчлэгдэнэ.',
  };
}
