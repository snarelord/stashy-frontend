import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function useAuthRedirect() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const token = localStorage.getItem("token");
    if (!token) {
      router.replace("/pages/sign-in");
      setLoading(false);
      setAuthenticated(false);
    } else {
      setLoading(false);
      setAuthenticated(true);
    }
  }, [router]);

  return { loading, authenticated };
}
