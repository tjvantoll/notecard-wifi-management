"use client";
import * as NotehubJs from "@blues-inc/notehub-js";
import { useEffect, useState } from "react";

interface EventsResponse {
  events: {
    rat: string;
    req: string;
    when: number;
  }[];
}

const projectUID = process.env.NEXT_PUBLIC_APP_UID;
const deviceUID = process.env.NEXT_PUBLIC_DEVICE_UID;
const defaultClient = NotehubJs.ApiClient.instance;
const api_key = defaultClient.authentications["api_key"];
api_key.apiKey = process.env.NEXT_PUBLIC_NOTEHUB_API_KEY;

const deviceApiInstance = new NotehubJs.DeviceApi();
const eventApiInstance = new NotehubJs.EventApi();

const formatUnixTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp * 1000); // Convert to milliseconds
  const year = date.getFullYear();
  const month = ("0" + (date.getMonth() + 1)).slice(-2); // Months are zero-based
  const day = ("0" + date.getDate()).slice(-2);
  const hours = ("0" + date.getHours()).slice(-2);
  const minutes = ("0" + date.getMinutes()).slice(-2);
  const seconds = ("0" + date.getSeconds()).slice(-2);
  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

export default function Home() {
  const [rat, setRat] = useState<string>("");
  const [when, setWhen] = useState<number>(0);

  const setWiFiEnvVar = async (ssid: string, password: string) => {
    const envVars = new NotehubJs.EnvironmentVariables({
      _wifi: `["${ssid}","${password}"]`,
    });
    await deviceApiInstance.putDeviceEnvironmentVariables(
      projectUID,
      deviceUID,
      envVars
    );
  };

  const getLatestNetworkUsed = () => {
    eventApiInstance
      .getProjectEvents(projectUID, {
        deviceUID: [deviceUID],
        files: ["_session.qo"],
        pageSize: 2,
        sortBy: "captured",
        sortOrder: "desc",
      })
      .then((data: EventsResponse) => {
        const startEvent = data.events.filter(
          (event) => event.req == "session.begin"
        )[0];

        let rat = startEvent.rat;
        if (rat === "lte") rat = "LTE";

        setRat(rat);
        setWhen(startEvent.when);
      });
  };

  const handleSubmit = () => async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const ssid = formData.get("ssid") as string;
    const password = formData.get("password") as string;

    await setWiFiEnvVar(ssid, password);
    form.reset();
    alert(
      "Network updated successfully. Your changes will take effect with your Notecard’s next inbound synchronization."
    );
  };

  useEffect(() => {
    getLatestNetworkUsed();
    // Re-run every minute (60000 milliseconds == 1 minute)
    const interval = setInterval(() => {
      getLatestNetworkUsed();
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">{deviceUID}</h1>
        <fieldset className="border border-gray-300 p-4 rounded-md">
          <legend className="text-lg font-medium text-gray-700">
            Last Connection
          </legend>

          <ul className="mb-4">
            <li className="mb-2">
              <span className="font-semibold">Last Connection Type:</span>{" "}
              {rat && rat}
            </li>
            <li>
              <span className="font-semibold">Last Connection Made:</span>{" "}
              {when > 0 && formatUnixTimestamp(when)}
            </li>
          </ul>
        </fieldset>

        <fieldset className="border border-gray-300 p-4 rounded-md mt-4">
          <legend className="text-lg font-medium text-gray-700">
            Set New Network
          </legend>
          <form className="space-y-4" onSubmit={handleSubmit()}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Wi-Fi SSID:
              </label>
              <input
                type="text"
                name="ssid"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Wi-Fi Password:
              </label>
              <input
                type="text"
                name="password"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit
            </button>
          </form>
        </fieldset>
      </div>
    </div>
  );
}
