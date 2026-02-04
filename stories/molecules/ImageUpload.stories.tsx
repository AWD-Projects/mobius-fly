import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { ImageUpload, UploadedImage } from "@/components/molecules/ImageUpload";

const meta: Meta<typeof ImageUpload> = {
  title: "Molecules/ImageUpload",
  component: ImageUpload,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof ImageUpload>;

export const Pending: Story = {
  args: {
    label: "Image upload (pending)",
    pendingTitle: "Upload image",
    pendingDescription: "Drag & drop or click to select",
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

export const Loaded: Story = {
  args: {
    label: "Image upload (loaded)",
    image: {
      name: "profile_photo.jpg",
      size: "1.2 MB",
      url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=300&fit=crop",
    },
    onRemove: () => {},
    onEdit: () => {},
    onDownload: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};

const InteractiveUpload = () => {
  const [image, setImage] = useState<UploadedImage | undefined>();

  const handleUpload = (file: File) => {
    const url = URL.createObjectURL(file);
    setImage({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      url,
    });
  };

  const handleRemove = () => {
    if (image?.url) {
      URL.revokeObjectURL(image.url);
    }
    setImage(undefined);
  };

  return (
    <div className="w-[300px]">
      <ImageUpload
        label="Foto de perfil"
        image={image}
        onUpload={handleUpload}
        onRemove={handleRemove}
        onEdit={() => alert("Edit clicked")}
        pendingTitle="Subir imagen"
        pendingDescription="Arrastra o haz clic para seleccionar"
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveUpload />,
};

export const SquareAspectRatio: Story = {
  args: {
    label: "Avatar",
    aspectRatio: "square",
    image: {
      name: "avatar.jpg",
      size: "500 KB",
      url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop",
    },
    onRemove: () => {},
  },
  decorators: [
    (Story) => (
      <div className="w-[200px]">
        <Story />
      </div>
    ),
  ],
};

export const VideoAspectRatio: Story = {
  args: {
    label: "Cover image",
    aspectRatio: "video",
    pendingTitle: "Upload cover image",
    pendingDescription: "16:9 ratio recommended",
  },
  decorators: [
    (Story) => (
      <div className="w-[400px]">
        <Story />
      </div>
    ),
  ],
};

export const DocumentPhoto: Story = {
  args: {
    label: "INE / Pasaporte",
    pendingTitle: "Sube tu identificacion",
    pendingDescription: "Foto clara del documento",
    accept: "image/*",
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};
