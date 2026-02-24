import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Pills } from "@/components/atoms/Pills";

const meta = {
  title: "Atomos/Pills",
  component: Pills,
  parameters: {
    layout: "centered",
    
  },
  tags: ["autodocs"],
} satisfies Meta<typeof Pills>;

export default meta;
type Story = StoryObj<typeof meta>;

export const TripType: Story = {
  args: {
    pills: [
      { label: "Redondo", value: "roundtrip" },
      { label: "One Way", value: "oneway" },
    ],
    value: "oneway",
    onChange: (value) => console.log("Selected:", value),
  },
};

export const Interactive: Story = {
  args: { pills: [] },
  render: () => {
    const [value, setValue] = React.useState("oneway");

    return (
      <div className="flex flex-col gap-4">
        <Pills
          pills={[
            { label: "Redondo", value: "roundtrip" },
            { label: "One Way", value: "oneway" },
          ]}
          value={value}
          onChange={setValue}
        />
        <p className="text-white/60 text-sm mt-4">Selected: {value}</p>
      </div>
    );
  },
};

export const StatusPills: Story = {
  args: { pills: [] },
  render: () => {
    const [value, setValue] = React.useState("active");

    return (
      <Pills
        pills={[
          { label: "Active", value: "active" },
          { label: "Pending", value: "pending" },
          { label: "Completed", value: "completed" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};

export const FilterPills: Story = {
  args: { pills: [] },
  render: () => {
    const [value, setValue] = React.useState("all");

    return (
      <Pills
        pills={[
          { label: "All", value: "all" },
          { label: "Flights", value: "flights" },
          { label: "Hotels", value: "hotels" },
          { label: "Cars", value: "cars" },
        ]}
        value={value}
        onChange={setValue}
      />
    );
  },
};
