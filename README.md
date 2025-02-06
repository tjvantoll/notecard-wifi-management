# Notecard Wi-Fi Management Example

This sample app shows how to build a web application that displays information on a Notecard’s most recent network connection, and that you can use to remotely change the Wi-Fi network a Notecard uses.

View the full tutorial for this project at [Managing a Notecard's Wi-Fi Network Remotely](https://dev.blues.com/example-apps/sample-apps/managing-a-notecards-wi-fi-network-remotely).

The implementation is done as a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Environment Variables

For this app to run successfully you must create an `.env` file in the web app’s root folder with the following contents.

```bash
NEXT_PUBLIC_NOTEHUB_API_KEY=your_api_key_here
NEXT_PUBLIC_APP_UID=app:123-456-789
NEXT_PUBLIC_DEVICE_UID=dev:123456789
```

Replace the three values with your [Notehub API key](https://dev.blues.io/api-reference/notehub-api/api-introduction/#authentication-with-session-tokens-deprecated), [ProjectUID](https://dev.blues.io/api-reference/glossary/#projectuid), and [DeviceUID](https://dev.blues.io/api-reference/glossary/#deviceuid), respectively.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
