import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  DocumentUpload,
  DocumentUploadCompact,
  UploadedDocument,
} from "@/components/molecules/DocumentUpload";

const meta: Meta<typeof DocumentUpload> = {
  title: "Molecules/DocumentUpload",
  component: DocumentUpload,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof DocumentUpload>;

export const Pending: Story = {
  args: {
    label: "Document upload (pending)",
    pendingTitle: "Upload PDF document",
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
    label: "Document upload (loaded)",
    document: {
      name: "document_scan_2024.pdf",
      size: "2.4 MB",
    },
    onRemove: () => {},
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
  const [document, setDocument] = useState<UploadedDocument | undefined>();

  const handleUpload = (file: File) => {
    setDocument({
      name: file.name,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    });
  };

  const handleRemove = () => {
    setDocument(undefined);
  };

  return (
    <div className="w-[300px]">
      <DocumentUpload
        label="Documento de identificacion"
        document={document}
        onUpload={handleUpload}
        onRemove={handleRemove}
        pendingTitle="Sube tu documento"
        pendingDescription="Haz clic o arrastra tu archivo aqui"
      />
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveUpload />,
};

export const CompactVariant: Story = {
  render: () => (
    <div className="w-[300px]">
      <DocumentUploadCompact
        label="Documento"
        pendingTitle="Subir archivo"
        pendingDescription="Arrastra o haz clic"
      />
    </div>
  ),
};

export const SpanishLabels: Story = {
  args: {
    label: "Subir documento PDF",
    pendingTitle: "Sube tu documento",
    pendingDescription: "Haz clic o arrastra tu archivo aqui",
    accept: ".pdf",
  },
  decorators: [
    (Story) => (
      <div className="w-[300px]">
        <Story />
      </div>
    ),
  ],
};
