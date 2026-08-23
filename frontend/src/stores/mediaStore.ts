import { create } from "zustand";

interface MediaState {
  localStream: MediaStream | null;

  micOn: boolean;
  cameraOn: boolean;

  toggleMic: () => void;
  toggleCamera: () => void;

  ensureStream: () => Promise<MediaStream | null>;
}

export const useMediaStore = create<MediaState>((set, get) => ({
  micOn: true,
  cameraOn: true,
  screenShareOn: false,

  toggleMic: () => {
    const stream = get().localStream;
    if (!stream) return;
    const track = stream.getAudioTracks()[0];
    if (!track) return;

    track.enabled = !track.enabled;
    set({ micOn: track.enabled });
  },

  toggleCamera: () => {
    const stream = get().localStream;
    if (!stream) return;
    const track = stream.getVideoTracks()[0];
    if (!track) return;
    track.enabled = !track.enabled;
    set({ cameraOn: track.enabled });
  },

  localStream: null,

  ensureStream: async () => {
    if (get().localStream) return get().localStream;
    // set({ micOn: true, cameraOn: true });

    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: { width: 1280, height: 720 },
    });
    if (!get().micOn) {
      stream.getAudioTracks().forEach((t) => (t.enabled = false));
    }
    if (!get().cameraOn) {
      stream.getVideoTracks().forEach((t) => (t.enabled = false));
    }

    set({ localStream: stream });

    return stream;
  },

  releaseStream: () => {
    const stream = get().localStream;
    if (stream) {
      stream.getTracks().forEach((t) => t.stop());
    }
    set({ localStream: null });
  },
}));
