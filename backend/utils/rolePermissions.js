export const roles = ["admin", "user"];

const rolePermissions = {
  admin: [
    "user:read_all",
    "user:read_one",
    "user:update_any",
    "user:delete_any",
    "user:ban",
    "user:unban",
    "product:update",
    "product:create",
    "product:delete",
    "product:publish",
    "product:unpublish",
    "product:read",
  ],
  user: [
    "auth:logout",
    "auth:refresh",
    "auth:reset_password",
    "auth:change_password",

    "user:read_self",
    "user:update_self",
    "user:delete_self",

    "product:search",
  ],
};

export const rolePermissionsMap = {
  user: rolePermissions.user,
  admin: [...rolePermissions.user, ...rolePermissions.admin],
};
