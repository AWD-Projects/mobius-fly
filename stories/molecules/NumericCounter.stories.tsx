import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import { NumericCounter } from "@/components/molecules/NumericCounter";

const meta = {
  title: "Moleculas/NumericCounter",
  component: NumericCounter,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
  argTypes: {
    min: {
      control: "number",
    },
    max: {
      control: "number",
    },
    step: {
      control: "number",
    },
    disabled: {
      control: "boolean",
    },
  },
} satisfies Meta<typeof NumericCounter>;

export default meta;
type Story = StoryObj<typeof meta>;

function CounterDefault(args: React.ComponentProps<typeof NumericCounter>) {
  const [value, setValue] = useState(1);
  return <NumericCounter {...args} value={value} onChange={setValue} />;
}

function CounterWithLimits() {
  const [value, setValue] = useState(2);
  return (
    <NumericCounter
      value={value}
      onChange={setValue}
      min={1}
      max={8}
    />
  );
}

function CounterPassengers() {
  const [passengers, setPassengers] = useState(1);
  return (
    <div className="flex items-center gap-4">
      <span className="text-body">Pasajeros:</span>
      <NumericCounter
        value={passengers}
        onChange={setPassengers}
        min={1}
        max={12}
      />
    </div>
  );
}

function CounterDisabled() {
  const [value] = useState(5);
  return (
    <NumericCounter
      value={value}
      onChange={() => {}}
      disabled
    />
  );
}

function CounterMultiple() {
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [infants, setInfants] = useState(0);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between w-64">
        <span className="text-body">Adultos</span>
        <NumericCounter value={adults} onChange={setAdults} min={1} max={8} />
      </div>
      <div className="flex items-center justify-between w-64">
        <span className="text-body">Ninos</span>
        <NumericCounter value={children} onChange={setChildren} min={0} max={8} />
      </div>
      <div className="flex items-center justify-between w-64">
        <span className="text-body">Bebes</span>
        <NumericCounter value={infants} onChange={setInfants} min={0} max={4} />
      </div>
    </div>
  );
}

export const Default: Story = {
  args: {
    value: 1,
    onChange: () => {},
  },
  render: (args) => <CounterDefault {...args} />,
};

export const WithLimits: Story = {
  args: {
    value: 2,
    onChange: () => {},
  },
  render: () => <CounterWithLimits />,
};

export const Passengers: Story = {
  args: {
    value: 1,
    onChange: () => {},
  },
  render: () => <CounterPassengers />,
};

export const Disabled: Story = {
  args: {
    value: 5,
    onChange: () => {},
  },
  render: () => <CounterDisabled />,
};

export const MultipleCounters: Story = {
  args: {
    value: 1,
    onChange: () => {},
  },
  render: () => <CounterMultiple />,
};
