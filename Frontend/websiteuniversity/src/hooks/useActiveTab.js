import { useSearchParams } from "react-router-dom";

export const useActiveTab = (defaultTab = "overview") => {
  const [searchParams, setSearchParams] = useSearchParams();
  const active = searchParams.get("view") || defaultTab;
  const setActive = (tab) => {
    const params = new URLSearchParams(searchParams);
    if (tab === defaultTab) {
      params.delete("view");
    } else {
      params.set("view", tab);
    }
    const qs = params.toString();
    setSearchParams(qs ? `?${qs}` : "", { replace: true });
  };
  return [active, setActive];
};
