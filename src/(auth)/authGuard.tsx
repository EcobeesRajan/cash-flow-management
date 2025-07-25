import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/(auth)/AuthContext";

type AuthGuardProps = {
  children: React.ReactNode;
};

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      router.replace("/login");
    }
  }, [user, router]);

  if (!user) {
    return null;
  }

  return <>{children}</>;
}
