import { useTranslations } from "next-intl";

export const TranslatedLabel = ({
  nameSpace,
  value,
}: {
  nameSpace: string;
  value: string;
}) => {
  const t = useTranslations(nameSpace);
    return t(value) ;
};
