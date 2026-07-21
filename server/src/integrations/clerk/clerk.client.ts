import { clerkClient } from '@clerk/express';
import type { ClerkUserProfile } from '../../types/user.js';

const getPrimaryEmail = (
  emailAddresses: Array<{ id: string; emailAddress: string }>,
  primaryEmailAddressId: string | null
): string | null => {
  if (primaryEmailAddressId) {
    const primary = emailAddresses.find(
      (entry) => entry.id === primaryEmailAddressId
    );
    if (primary?.emailAddress) {
      return primary.emailAddress;
    }
  }

  return emailAddresses[0]?.emailAddress ?? null;
};

const buildDisplayName = (
  firstName: string | null,
  lastName: string | null
): string | null => {
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();
  return fullName.length > 0 ? fullName : null;
};

export const fetchClerkUserProfile = async (
  clerkId: string
): Promise<ClerkUserProfile> => {
  const user = await clerkClient.users.getUser(clerkId);
  const email = getPrimaryEmail(
    user.emailAddresses,
    user.primaryEmailAddressId
  );

  return {
    clerkId: user.id,
    email: email ?? '',
    displayName: buildDisplayName(user.firstName, user.lastName),
    imageUrl: user.imageUrl ?? null,
  };
};
