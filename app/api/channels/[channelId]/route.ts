import { currentProfile } from "@/lib/current-profile";
import { db } from "@/lib/db";
import { MemberRole } from "@prisma/client";
import { NextResponse } from "next/server";

export async function DELETE(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    // if profile not found
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    // if server id not found
    if (!serverId)
      return new NextResponse("Server ID Missing", { status: 400 });

    // if channel id not found
    if (!params.channelId) {
      return new NextResponse("Channel ID Missing", { status: 400 });
    }

    // query for deleting channel
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          delete: {
            id: params.channelId,
            name: {
              not: "general",
            },
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_ID_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const { name, type } = await req.json();
    const { searchParams } = new URL(req.url);
    const serverId = searchParams.get("serverId");

    // if profile not found
    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    // if server id not found
    if (!serverId)
      return new NextResponse("Server ID Missing", { status: 400 });

    // if channel id not found
    if (!params.channelId) {
      return new NextResponse("Channel ID Missing", { status: 400 });
    }

    // if name is general
    if (name === "general") {
      return new NextResponse("Name cannot be 'general'", { status: 400 });
    }

    // query for updating channel
    const server = await db.server.update({
      where: {
        id: serverId,
        members: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          },
        },
      },
      data: {
        channels: {
          update: {
            where: {
              id: params.channelId,
              name: {
                not: "general",
              },
            },
            data: { name, type }, // data to be updated
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[CHANNEL_ID_ERROR]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
