"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateProfileSchema, type UpdateProfileFormData } from "@/schemas/profile";
import { useAuth } from "@/contexts/AuthContext";
import { updateProfileAction, uploadAvatarAction } from "@/actions/profile";
import { toast } from "sonner";
import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import Avatar from "@/components/ui/Avatar";
import { Camera } from "lucide-react";

export default function ProfileForm() {
  const { user, updateUser } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      first_name: user?.first_name || "",
      last_name: user?.last_name || "",
      username: user?.username || "",
      bio: user?.bio || "",
    },
  });

  async function onSubmit(data: UpdateProfileFormData) {
    const result = await updateProfileAction(data);
    if (result.success && result.data) {
      updateUser(result.data);
      toast.success("Perfil atualizado com sucesso!");
    } else {
      toast.error(result.error || "Erro ao atualizar perfil");
    }
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    const result = await uploadAvatarAction(file);
    if (result.success && result.data) {
      updateUser(result.data);
      toast.success("Avatar atualizado!");
    } else {
      toast.error(result.error || "Erro ao enviar avatar");
    }
    setIsUploading(false);
  }

  if (!user) return null;

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-6">Meu Perfil</h1>

      <div className="flex items-center gap-6 mb-8">
        <div className="relative group">
          <Avatar
            src={user.avatar_url}
            name={`${user.first_name} ${user.last_name}`}
            size="lg"
            className="!h-20 !w-20 !text-2xl"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Camera className="h-6 w-6 text-white" />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            {user.first_name} {user.last_name}
          </h2>
          <p className="text-sm text-slate-500">@{user.username}</p>
          <p className="text-sm text-slate-500">{user.email}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <Input
            id="first_name"
            label="Nome"
            error={errors.first_name?.message}
            {...register("first_name")}
          />
          <Input
            id="last_name"
            label="Sobrenome"
            error={errors.last_name?.message}
            {...register("last_name")}
          />
        </div>

        <Input
          id="username"
          label="Username"
          error={errors.username?.message}
          {...register("username")}
        />

        <Textarea
          id="bio"
          label="Bio"
          rows={3}
          placeholder="Conte um pouco sobre você..."
          error={errors.bio?.message}
          {...register("bio")}
        />

        <Button type="submit" isLoading={isSubmitting}>
          Salvar alterações
        </Button>
      </form>
    </div>
  );
}
