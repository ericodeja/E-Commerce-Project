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

    "cart:add",
    "cart:read_one",
    "cart:update_one",
    "cart:delete_item",
    "cart:delete",
  ],
};

export const rolePermissionsMap = {
  user: rolePermissions.user,
  admin: [...rolePermissions.user, ...rolePermissions.admin],
};
