import * as React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  PassengerForm,
  PassengerFormData,
} from "@/components/molecules/PassengerForm";

const meta: Meta<typeof PassengerForm> = {
  title: "Molecules/PassengerForm",
  component: PassengerForm,
  parameters: {
    layout: "centered",
  },
  tags: ["autodocs"],
};

export default meta;
type Story = StoryObj<typeof PassengerForm>;

export const AdultPassenger: Story = {
  args: {
    title: "Adulto – Pasajero 1",
    passengerType: "adult",
    defaultValues: {
      fullName: "Maria Garcia",
      sex: "female",
      dateOfBirth: "1985-03-15",
      email: "maria.garcia@email.com",
      phone: "+52 55 1234 5678",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export const MinorPassenger: Story = {
  args: {
    title: "Menor – Pasajero 3",
    passengerType: "minor",
    defaultValues: {
      fullName: "Pablo Garcia",
      sex: "male",
      dateOfBirth: "2015-06-20",
      responsibleName: "Maria Garcia",
      responsibleRelationship: "parent",
      responsiblePhone: "+52 55 1234 5678",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export const EmptyForm: Story = {
  args: {
    title: "Adulto – Pasajero 2",
    passengerType: "adult",
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};

const InteractiveForm = () => {
  const [submitted, setSubmitted] = useState<PassengerFormData | null>(null);

  return (
    <div className="w-[600px]">
      <PassengerForm
        title="Adulto – Pasajero 1"
        passengerType="adult"
        onSubmit={setSubmitted}
      />
      {submitted && (
        <pre className="mt-4 p-4 bg-neutral/20 rounded-lg text-caption overflow-auto">
          {JSON.stringify(submitted, null, 2)}
        </pre>
      )}
    </div>
  );
};

export const Interactive: Story = {
  render: () => <InteractiveForm />,
};

export const WithDocument: Story = {
  args: {
    title: "Adulto – Pasajero 1",
    passengerType: "adult",
    defaultValues: {
      fullName: "Maria Garcia",
      sex: "female",
      dateOfBirth: "1985-03-15",
      email: "maria.garcia@email.com",
      phone: "+52 55 1234 5678",
    },
    document: {
      name: "ine_maria_garcia.pdf",
      size: "2.4 MB",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-[600px]">
        <Story />
      </div>
    ),
  ],
};

export const MultiplePassengers: Story = {
  render: () => (
    <div className="flex flex-col gap-6 w-[600px]">
      <PassengerForm
        title="Adulto – Pasajero 1"
        passengerType="adult"
        defaultValues={{
          fullName: "Maria Garcia",
          sex: "female",
          email: "maria.garcia@email.com",
        }}
      />
      <PassengerForm
        title="Menor – Pasajero 2"
        passengerType="minor"
        defaultValues={{
          fullName: "Pablo Garcia",
          sex: "male",
          responsibleName: "Maria Garcia",
          responsibleRelationship: "parent",
        }}
      />
    </div>
  ),
};
