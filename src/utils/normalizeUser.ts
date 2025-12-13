export function normalizeUser(user: any) {
    return {
      ...user,
      isSuperAdmin:
        user?.isSuperAdmin === true ||
        user?.isSuperAdmin === "true",
    };
  }