import { redirect } from "next/navigation";
import { ModeToggle } from "@/components/mode-toggle";
import { db } from "@/lib/db";
import { initialProfile } from "@/lib/initial-profile";
import { UserButton } from "@clerk/nextjs";
import { InitialModal } from "@/components/modals/initial-modal";
export default async function Setup() {
  const profile = await initialProfile();

  //   find server that the user is connected with
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return <InitialModal />;
}
