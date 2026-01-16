import type { Preview } from "@storybook/react";
import "../styles/globals.css";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: "light",
      values: [
        {
          name: "light",
          value: "#F6F6F4",
        },
        {
          name: "white",
          value: "#FFFFFF",
        },
        {
          name: "dark",
          value: "#39424E",
        },
      ],
    },
  },
};

export default preview;
