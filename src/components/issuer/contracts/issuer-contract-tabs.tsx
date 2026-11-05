import { useTranslation } from 'react-i18next';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  type IssuerContractTab,
  issuerContractTabSchema,
} from '@/queries/issuer/type';

/**
 * The contract list's tabs, each with how many contracts it holds once known. A narrow
 * screen splits its width in three, each tab's count under its name.
 */
export function IssuerContractTabs({
  tab,
  counts,
  onChange,
}: {
  tab: IssuerContractTab;
  counts?: Record<IssuerContractTab, number>;
  onChange: (tab: IssuerContractTab) => void;
}) {
  const { t } = useTranslation();
  return (
    <Tabs
      value={tab}
      onValueChange={(value) => onChange(issuerContractTabSchema.parse(value))}
    >
      <TabsList className="grid h-auto w-full grid-cols-3 sm:inline-flex sm:h-10 sm:w-fit">
        {issuerContractTabSchema.options.map((key) => (
          <TabsTrigger
            key={key}
            value={key}
            className="h-auto min-h-11 flex-col gap-0.5 px-1.5 py-1 text-xs whitespace-normal sm:h-[calc(100%-1px)] sm:min-h-0 sm:flex-row sm:gap-1.5 sm:px-3 sm:text-sm sm:whitespace-nowrap"
          >
            {t(`issuer.contracts.tabs.${key}`)}
            {counts && (
              <span className="tabular min-w-5 rounded-full bg-muted-foreground/12 px-1.5 text-xs">
                {counts[key]}
              </span>
            )}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  );
}
