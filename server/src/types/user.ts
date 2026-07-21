export type CurrentUser = {
  id: string;
  clerkId: string;
};

export type PublicUserDto = {
  id: string;
  email: string;
  displayName: string | null;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ClerkUserProfile = {
  clerkId: string;
  email: string;
  displayName: string | null;
  imageUrl: string | null;
};
