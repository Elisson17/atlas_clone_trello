import api from "./config";
import type { User } from "@/models/user";

export const profileService = {
  get() {
    return api.get<User>("/profile");
  },

  update(data: {
    first_name?: string;
    last_name?: string;
    username?: string;
    bio?: string | null;
  }) {
    return api.patch<User>("/profile", { user: data });
  },

  uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append("avatar", file);
    return api.patch<User>("/profile/avatar", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  changePassword(data: {
    current_password: string;
    password: string;
    password_confirmation: string;
  }) {
    return api.patch("/profile/password", data);
  },

  connectGoogle(idToken: string) {
    return api.post("/profile/google/connect", { id_token: idToken });
  },

  disconnectGoogle() {
    return api.delete("/profile/google/disconnect");
  },
};
