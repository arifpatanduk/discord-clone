import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";

import { ChatHeader } from "@/components/chat/chat-header";

interface ChannelIdPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelIdPage = async ({ params }: ChannelIdPageProps) => {
  // check profile
  const profile = await currentProfile();
  if (!profile) return redirectToSignIn();

  // fetch channel using the ID
  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  // find member using serverID and profileID
  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="bg-white dark:bg-[#313338] flex flex-col h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channel"
      />
    </div>
  );
};

export default ChannelIdPage;
