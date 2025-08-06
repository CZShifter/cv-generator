import { useEffect } from "react";
import { useRouter } from "next/router";

export default function IndexRedirect() {
  const router = useRouter();

  useEffect(() => {
    // Fallback: na základě hostname zjisti jazyk
    const hostname = window.location.hostname;

    if (hostname.includes(".sk")) {
      router.replace("/sk");
    } else {
      router.replace("/cs"); // default
    }
  }, [router]); // Oprava: Přidán 'router' do pole závislostí

  return null;
}