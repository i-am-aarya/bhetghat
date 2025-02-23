import { useEffect, useState } from "react";

type PermissionState = "granted" | "denied" | "prompt";

export const useMediaPermissions = () => {
  const [micPermission, setMicPermission] = useState<PermissionState>("prompt");
  const [cameraPermission, setCameraPermission] =
    useState<PermissionState>("prompt");

  useEffect(() => {
    const checkPermissions = async () => {
      try {
        const micStatus = await navigator.permissions.query({
          name: "microphone" as any,
        });
        const cameraStatus = await navigator.permissions.query({
          name: "camera" as any,
        });

        micStatus.onchange = () => setMicPermission(micStatus.state);
        cameraStatus.onchange = () => setCameraPermission(cameraStatus.state);
      } catch (error) {
        console.log("permission API not supported", error);
      }
    };
    checkPermissions();
  }, []);

  const requestMediaAccess = async (audio: boolean, video: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: audio && micPermission !== "denied",
        video: video && cameraPermission !== "denied",
      });
      return { stream, audioAllowed: true, videoAllowed: true };
    } catch (error) {
      // console.log()
      console.error("Media access failed:", error);
      return {
        stream: null,
        audioAllowed: micPermission === "granted",
        videoAllowed: cameraPermission === "granted",
      };
    }
  };

  return { micPermission, cameraPermission, requestMediaAccess };
};
