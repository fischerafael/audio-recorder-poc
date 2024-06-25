"use client";
import { useRef, useState } from "react";

type MediaRecorderType = MediaRecorder | null;
type AudioChunk = BlobPart[];

export const AudioRecorder = () => {
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const [audioUrl, setAudioUrl] = useState<string>("");
  const mediaRecorderRef = useRef<MediaRecorderType>(null);
  const audioChunksRef = useRef<AudioChunk>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = (event: BlobEvent) => {
      audioChunksRef.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
      const audioUrl = URL.createObjectURL(audioBlob);
      setAudioUrl(audioUrl);
      audioChunksRef.current = [];
    };

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <div>
      <h1>Gravador de Áudio</h1>

      <button onClick={isRecording ? stopRecording : startRecording}>
        {isRecording ? "Parar Gravação" : "Iniciar Gravação"}
      </button>
      {audioUrl && <audio src={audioUrl} controls />}
    </div>
  );
};
