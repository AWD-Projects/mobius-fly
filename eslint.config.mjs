import nextConfig from "eslint-config-next/core-web-vitals";

const config = [
  ...nextConfig,
  {
    ignores: [
      "storybook-static/**",
      ".next/**",
      "node_modules/**",
      "out/**",
      "dist/**",
      "stories/**",
    ],
  },
];

export default config;
