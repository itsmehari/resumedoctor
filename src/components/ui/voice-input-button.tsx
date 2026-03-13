"use client";

// Phase 4 – Voice-to-text for bullets (Web Speech API)
import { useState, useRef } from "react";
import { Mic, MicOff } from "lucide-react";

interface VoiceInputButtonProps {
  onResult: (text: string) => void;
  disabled?: boolean;
  className?: string;
}

export function VoiceInputButton({
  onResult,
  disabled,
  className = "",
}: VoiceInputButtonProps) {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState<boolean | null>(null);
  const recognitionRef = useRef<{ stop: () => void } | null>(null);

  const startListening = () => {
    const SR =
      typeof window !== "undefined" &&
      ((window as unknown as { SpeechRecognition?: unknown; webkitSpeechRecognition?: unknown }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: unknown }).webkitSpeechRecognition);
    if (!SR) {
      setSupported(false);
      return;
    }
    setSupported(true);
    const RecognitionClass = SR as new () => { start: () => void; stop: () => void; onresult: (e: { results: { length: number }[] }) => void; onerror: () => void; onend: () => void; continuous: boolean; interimResults: boolean; lang: string };
    const recognition = new RecognitionClass();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-IN";
    recognition.onresult = (e: { results: { length: number; [i: number]: { length: number; [j: number]: { transcript: string } } } }) => {
      const last = e.results.length - 1;
      const text = e.results[last]?.[0]?.transcript ?? "";
      onResult(text);
    };
    recognition.onerror = () => setListening(false);
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  };

  const stopListening = () => {
    recognitionRef.current?.stop();
    setListening(false);
  };

  const toggle = () => {
    if (listening) stopListening();
    else startListening();
  };

  if (supported === false) return null;

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={disabled}
      title={listening ? "Stop listening" : "Speak to type"}
      className={`p-1.5 rounded-lg text-slate-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors disabled:opacity-50 ${className}`}
    >
      {listening ? (
        <MicOff className="h-4 w-4 animate-pulse text-red-500" />
      ) : (
        <Mic className="h-4 w-4" />
      )}
    </button>
  );
}
