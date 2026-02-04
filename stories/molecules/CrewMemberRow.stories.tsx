import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { CrewMemberRow } from "@/components/molecules/CrewMemberRow";

const meta: Meta<typeof CrewMemberRow> = {
  title: "Molecules/CrewMemberRow",
  component: CrewMemberRow,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof CrewMemberRow>;

export const Captain: Story = {
  args: {
    name: "Carlos Martinez",
    role: "Piloto al mando",
    avatarColor: "#0A0A0A",
    licenseLabel: "Licencia",
    licenseValue: "ATPL-A 2847291",
    showBorder: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[500px] bg-surface p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const Copilot: Story = {
  args: {
    name: "Laura Garcia",
    role: "Copiloto",
    avatarColor: "#666666",
    licenseLabel: "Licencia",
    licenseValue: "CPL-A 1938472",
    showBorder: false,
  },
  decorators: [
    (Story) => (
      <div className="w-[500px] bg-surface p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const WithoutLicense: Story = {
  args: {
    name: "Ana Rodriguez",
    role: "Auxiliar de vuelo",
    avatarColor: "#C4A77D",
    showBorder: true,
  },
  decorators: [
    (Story) => (
      <div className="w-[500px] bg-surface p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const Clickable: Story = {
  args: {
    name: "Carlos Martinez",
    role: "Piloto al mando",
    avatarColor: "#0A0A0A",
    licenseValue: "ATPL-A 2847291",
    onClick: () => alert("Crew member clicked"),
  },
  decorators: [
    (Story) => (
      <div className="w-[500px] bg-surface p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};

export const CrewList: Story = {
  render: () => (
    <div className="w-[500px] bg-surface p-4 rounded-lg">
      <CrewMemberRow
        name="Carlos Martinez"
        role="Piloto al mando"
        avatarColor="#0A0A0A"
        licenseValue="ATPL-A 2847291"
        showBorder={true}
      />
      <CrewMemberRow
        name="Laura Garcia"
        role="Copiloto"
        avatarColor="#666666"
        licenseValue="CPL-A 1938472"
        showBorder={true}
      />
      <CrewMemberRow
        name="Ana Rodriguez"
        role="Auxiliar de vuelo"
        avatarColor="#C4A77D"
        showBorder={false}
      />
    </div>
  ),
};

export const CustomInitials: Story = {
  args: {
    name: "Juan Pablo Hernandez Lopez",
    initials: "JP",
    role: "Ingeniero de vuelo",
    avatarColor: "#39424E",
    licenseValue: "FE-12345",
  },
  decorators: [
    (Story) => (
      <div className="w-[500px] bg-surface p-4 rounded-lg">
        <Story />
      </div>
    ),
  ],
};
