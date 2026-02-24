import React from "react";

import type { Meta, StoryObj } from "@storybook/react";
import { Navbar } from "@/components/organisms/Navbar";

const meta = {
  title: "Organismos/Navbar",
  component: Navbar,
  parameters: {
    layout: "fullscreen",
  },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["hero", "default"],
      description: "Hero variant has glassmorphism effect, default has outline buttons",
    },
    isLoggedIn: {
      control: "boolean",
      description: "Whether the user is logged in",
    },
    userType: {
      control: "select",
      options: ["buyer", "owner"],
      description: "Type of user: buyer or owner (plane owner)",
    },
    logoText: {
      control: "text",
    },
    userInitials: {
      control: "text",
    },
  },
  decorators: [
    (Story) => (
      <div className="w-full min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-blue-900 flex items-start justify-center overflow-x-auto">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Navbar>;

export default meta;
type Story = StoryObj<typeof meta>;

// Hero Section Variants
export const HeroLoggedOut: Story = {
  args: {
    variant: "hero",
    isLoggedIn: false,
    logoText: "Mobius Fly",
    onLoginClick: () => console.log("Login clicked"),
    onSignUpClick: () => console.log("Sign up clicked"),
    onNavLinkClick: (href) => console.log("Nav link clicked:", href),
  },
  parameters: {
    docs: {
      description: {
        story: "Navbar for hero section when user is not logged in. Features glassmorphism effect on the sign-up button.",
      },
    },
  },
};

export const HeroLoggedInBuyer: Story = {
  args: {
    variant: "hero",
    isLoggedIn: true,
    userType: "buyer",
    userInitials: "JD",
    logoText: "Mobius Fly",
    onNavLinkClick: (href) => console.log("Nav link clicked:", href),
    onProfileClick: () => console.log("Profile clicked"),
    onMyFlightsClick: () => console.log("My flights clicked"),
    onMyBookingsClick: () => console.log("My bookings clicked"),
    onDocumentsClick: () => console.log("Documents clicked"),
    onBillingClick: () => console.log("Billing clicked"),
    onNotificationsClick: () => console.log("Notifications clicked"),
    onSettingsClick: () => console.log("Settings clicked"),
    onLogoutClick: () => console.log("Logout clicked"),
  },
  parameters: {
    docs: {
      description: {
        story: "Navbar for hero section when buyer is logged in. Shows avatar with buyer-specific menu items (My flights, My bookings, My documents).",
      },
    },
  },
};

export const HeroLoggedInOwner: Story = {
  args: {
    variant: "hero",
    isLoggedIn: true,
    userType: "owner",
    userInitials: "MR",
    logoText: "Mobius Fly",
    onNavLinkClick: (href) => console.log("Nav link clicked:", href),
    onProfileClick: () => console.log("Profile clicked"),
    onMyPlanesClick: () => console.log("My planes clicked"),
    onAnalyticsClick: () => console.log("Analytics clicked"),
    onCrewManagementClick: () => console.log("Crew management clicked"),
    onBillingClick: () => console.log("Billing clicked"),
    onNotificationsClick: () => console.log("Notifications clicked"),
    onSettingsClick: () => console.log("Settings clicked"),
    onLogoutClick: () => console.log("Logout clicked"),
  },
  parameters: {
    docs: {
      description: {
        story: "Navbar for hero section when plane owner is logged in. Shows avatar with owner-specific menu items (My planes, Analytics, Crew management).",
      },
    },
  },
};

// Other Sections Variants
export const DefaultLoggedOut: Story = {
  args: {
    variant: "default",
    isLoggedIn: false,
    logoText: "Mobius Fly",
    onLoginClick: () => console.log("Login clicked"),
    onSignUpClick: () => console.log("Sign up clicked"),
    onNavLinkClick: (href) => console.log("Nav link clicked:", href),
  },
  parameters: {
    docs: {
      description: {
        story: "Navbar for other sections when user is not logged in. Uses outline buttons instead of glassmorphism.",
      },
    },
  },
};

export const DefaultLoggedInBuyer: Story = {
  args: {
    variant: "default",
    isLoggedIn: true,
    userType: "buyer",
    userInitials: "AS",
    logoText: "Mobius Fly",
    onNavLinkClick: (href) => console.log("Nav link clicked:", href),
    onProfileClick: () => console.log("Profile clicked"),
    onMyFlightsClick: () => console.log("My flights clicked"),
    onMyBookingsClick: () => console.log("My bookings clicked"),
    onDocumentsClick: () => console.log("Documents clicked"),
    onBillingClick: () => console.log("Billing clicked"),
    onNotificationsClick: () => console.log("Notifications clicked"),
    onSettingsClick: () => console.log("Settings clicked"),
    onLogoutClick: () => console.log("Logout clicked"),
  },
  parameters: {
    docs: {
      description: {
        story: "Navbar for other sections when buyer is logged in. Shows avatar with buyer-specific menu.",
      },
    },
  },
};

export const DefaultLoggedInOwner: Story = {
  args: {
    variant: "default",
    isLoggedIn: true,
    userType: "owner",
    userInitials: "LC",
    logoText: "Mobius Fly",
    onNavLinkClick: (href) => console.log("Nav link clicked:", href),
    onProfileClick: () => console.log("Profile clicked"),
    onMyPlanesClick: () => console.log("My planes clicked"),
    onAnalyticsClick: () => console.log("Analytics clicked"),
    onCrewManagementClick: () => console.log("Crew management clicked"),
    onBillingClick: () => console.log("Billing clicked"),
    onNotificationsClick: () => console.log("Notifications clicked"),
    onSettingsClick: () => console.log("Settings clicked"),
    onLogoutClick: () => console.log("Logout clicked"),
  },
  parameters: {
    docs: {
      description: {
        story: "Navbar for other sections when plane owner is logged in. Shows avatar with owner-specific menu.",
      },
    },
  },
};

// Comparison Stories
export const AllHeroVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-2 px-8 text-sm font-semibold text-white/60">Hero - Logged Out</h3>
        <Navbar variant="hero" isLoggedIn={false} />
      </div>
      <div>
        <h3 className="mb-2 px-8 text-sm font-semibold text-white/60">Hero - Buyer Logged In</h3>
        <Navbar variant="hero" isLoggedIn={true} userType="buyer" userInitials="JD" />
      </div>
      <div>
        <h3 className="mb-2 px-8 text-sm font-semibold text-white/60">Hero - Owner Logged In</h3>
        <Navbar variant="hero" isLoggedIn={true} userType="owner" userInitials="MR" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comparison of all hero section navbar variants.",
      },
    },
  },
};

export const AllDefaultVariants: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-2 px-8 text-sm font-semibold text-white/60">Default - Logged Out</h3>
        <Navbar variant="default" isLoggedIn={false} />
      </div>
      <div>
        <h3 className="mb-2 px-8 text-sm font-semibold text-white/60">Default - Buyer Logged In</h3>
        <Navbar variant="default" isLoggedIn={true} userType="buyer" userInitials="AS" />
      </div>
      <div>
        <h3 className="mb-2 px-8 text-sm font-semibold text-white/60">Default - Owner Logged In</h3>
        <Navbar variant="default" isLoggedIn={true} userType="owner" userInitials="LC" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comparison of all default section navbar variants.",
      },
    },
  },
};

export const BuyerVsOwnerMenus: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      <div>
        <h3 className="mb-2 px-8 text-sm font-semibold text-white/60">
          Buyer Menu (Click avatar to see: My flights, My bookings, My documents)
        </h3>
        <Navbar variant="hero" isLoggedIn={true} userType="buyer" userInitials="BU" />
      </div>
      <div>
        <h3 className="mb-2 px-8 text-sm font-semibold text-white/60">
          Owner Menu (Click avatar to see: My planes, Analytics, Crew management)
        </h3>
        <Navbar variant="hero" isLoggedIn={true} userType="owner" userInitials="OW" />
      </div>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: "Comparison of buyer vs owner profile menus. Click on the avatars to see the different menu items for each user type.",
      },
    },
  },
};

export const CustomNavLinks: Story = {
  args: {
    variant: "hero",
    isLoggedIn: false,
    navLinks: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Services", href: "/services" },
      { label: "Contact", href: "/contact" },
    ],
    onNavLinkClick: (href) => console.log("Nav link clicked:", href),
  },
  parameters: {
    docs: {
      description: {
        story: "Example with custom navigation links.",
      },
    },
  },
};

export const InteractiveDemo: Story = {
  render: () => {
    const [isLoggedIn, setIsLoggedIn] = React.useState(false);
    const [userType, setUserType] = React.useState<"buyer" | "owner">("buyer");
    const [variant, setVariant] = React.useState<"hero" | "default">("hero");

    return (
      <div className="flex flex-col gap-6">
        <div className="flex gap-4 px-8">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white">Variant:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setVariant("hero")}
                className={`rounded px-3 py-1 text-sm ${
                  variant === "hero"
                    ? "bg-white text-blue-900"
                    : "border border-white/20 text-white"
                }`}
              >
                Hero
              </button>
              <button
                onClick={() => setVariant("default")}
                className={`rounded px-3 py-1 text-sm ${
                  variant === "default"
                    ? "bg-white text-blue-900"
                    : "border border-white/20 text-white"
                }`}
              >
                Default
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-white">Login State:</label>
            <div className="flex gap-2">
              <button
                onClick={() => setIsLoggedIn(false)}
                className={`rounded px-3 py-1 text-sm ${
                  !isLoggedIn
                    ? "bg-white text-blue-900"
                    : "border border-white/20 text-white"
                }`}
              >
                Logged Out
              </button>
              <button
                onClick={() => setIsLoggedIn(true)}
                className={`rounded px-3 py-1 text-sm ${
                  isLoggedIn
                    ? "bg-white text-blue-900"
                    : "border border-white/20 text-white"
                }`}
              >
                Logged In
              </button>
            </div>
          </div>

          {isLoggedIn && (
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-white">User Type:</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setUserType("buyer")}
                  className={`rounded px-3 py-1 text-sm ${
                    userType === "buyer"
                      ? "bg-white text-blue-900"
                      : "border border-white/20 text-white"
                  }`}
                >
                  Buyer
                </button>
                <button
                  onClick={() => setUserType("owner")}
                  className={`rounded px-3 py-1 text-sm ${
                    userType === "owner"
                      ? "bg-white text-blue-900"
                      : "border border-white/20 text-white"
                  }`}
                >
                  Owner
                </button>
              </div>
            </div>
          )}
        </div>

        <Navbar
          variant={variant}
          isLoggedIn={isLoggedIn}
          userType={userType}
          userInitials={userType === "buyer" ? "BY" : "OW"}
          onLoginClick={() => alert("Login clicked")}
          onSignUpClick={() => alert("Sign up clicked")}
          onNavLinkClick={(href) => console.log("Nav:", href)}
          onProfileClick={() => alert("Profile clicked")}
          onMyFlightsClick={() => alert("My flights clicked")}
          onMyBookingsClick={() => alert("My bookings clicked")}
          onDocumentsClick={() => alert("My documents clicked")}
          onMyPlanesClick={() => alert("My planes clicked")}
          onAnalyticsClick={() => alert("Analytics clicked")}
          onCrewManagementClick={() => alert("Crew management clicked")}
          onBillingClick={() => alert("Billing clicked")}
          onNotificationsClick={() => alert("Notifications clicked")}
          onSettingsClick={() => alert("Settings clicked")}
          onLogoutClick={() => {
            alert("Logout clicked");
            setIsLoggedIn(false);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story: "Interactive demo to test all combinations of variant, login state, and user type.",
      },
    },
  },
};
