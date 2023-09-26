import { currentUser, redirectToSignIn } from "@clerk/nextjs";
import { db } from "@/lib/db";

export const initialProfile = async () => {
  // get logged in user, if not redirect to sign in
  const user = await currentUser();
  if (!user) return redirectToSignIn();

  //   get profile based on user.id, if not create new
  const profile = await db.profile.findUnique({
    where: {
      userId: user.id,
    },
  });
  if (profile) return profile;

  const newProfile = await db.profile.create({
    data: {
      userId: user.id,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
    },
  });

  return newProfile;
};
