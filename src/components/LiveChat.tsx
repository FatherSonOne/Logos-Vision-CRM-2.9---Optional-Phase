import { GoogleGenAI, LiveServerMessage, Modality, Blob } from '@google/genai';
import React, { useState, useEffect, useRef } from 'react';
import { encode, decode, decodeAudioData } from '../utils/audio';
import { MicOnIcon, MicOffIcon } from './icons';

// --- Type definitions for audio processing ---
declare global {
  interface Window {
    webkitAudioContext: typeof AudioContext;
  }
}

type LiveSession = Awaited<ReturnType<GoogleGenAI['live']['connect']>>;

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const LiveChat: React.FC = () => {
    const [status, setStatus] = useState<'idle' | 'connecting' | 'connected' | 'error'>('idle');
    const [isMuted, setIsMuted] = useState(false);
    const sessionPromiseRef = useRef<Promise<LiveSession> | null>(null);
    const outputAudioContextRef = useRef<AudioContext | null>(null);
    const nextStartTimeRef = useRef(0);
    const sourcesRef = useRef(new Set<AudioBufferSourceNode>());

    const connectAndStream = async () => {
        setStatus('connecting');

        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
            alert('Your browser does not support audio recording.');
            setStatus('error');
            return;
        }

        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            outputAudioContextRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
            const outputNode = outputAudioContextRef.current.createGain();

            const sessionPromise = ai.live.connect({
                model: 'gemini-2.5-flash-native-audio-preview-09-2025',
                callbacks: {
                    onopen: () => {
                        setStatus('connected');
                        const inputAudioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
                        const source = inputAudioContext.createMediaStreamSource(stream);
                        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);

                        scriptProcessor.onaudioprocess = (audioProcessingEvent) => {
                            if (isMuted) return;
                            const inputData = audioProcessingEvent.inputBuffer.getChannelData(0);
                            const pcmBlob: Blob = {
                                data: encode(new Uint8Array(new Int16Array(inputData.map(x => x * 32768)).buffer)),
                                mimeType: 'audio/pcm;rate=16000',
                            };
                            sessionPromise.then((session) => {
                                session.sendRealtimeInput({ media: pcmBlob });
                            });
                        };
                        source.connect(scriptProcessor);
                        scriptProcessor.connect(inputAudioContext.destination);
                    },
                    onmessage: async (message: LiveServerMessage) => {
                        const audioContext = outputAudioContextRef.current;
                        if (!audioContext) return;

                        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData.data;
                        if (base64Audio) {
                            nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioContext.currentTime);
                            const audioBuffer = await decodeAudioData(decode(base64Audio), audioContext, 24000, 1);
                            const source = audioContext.createBufferSource();
                            source.buffer = audioBuffer;
                            source.connect(outputNode);
                            source.addEventListener('ended', () => sourcesRef.current.delete(source));
                            source.start(nextStartTimeRef.current);
                            nextStartTimeRef.current += audioBuffer.duration;
                            sourcesRef.current.add(source);
                        }
                    },
                    onerror: (e: ErrorEvent) => {
                        console.error('Live session error:', e);
                        setStatus('error');
                    },
                    onclose: () => {
                         setStatus('idle');
                    },
                },
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                    systemInstruction: 'You are a friendly and helpful assistant for a non-profit consulting CRM.',
                },
            });
            sessionPromiseRef.current = sessionPromise;

        } catch (err) {
            console.error('Error getting user media:', err);
            setStatus('error');
        }
    };
    
    const disconnect = async () => {
        if (sessionPromiseRef.current) {
            const session = await sessionPromiseRef.current;
            session.close();
            sessionPromiseRef.current = null;
        }
         sourcesRef.current.forEach(source => source.stop());
         sourcesRef.current.clear();
         nextStartTimeRef.current = 0;
         setStatus('idle');
    };

    const MicButton = () => {
      const buttonClasses = "w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300";
      let content;

      switch(status) {
        case 'idle':
        case 'error':
          content = <button onClick={connectAndStream} className={`${buttonClasses} bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg`}><MicOnIcon /></button>;
          break;
        case 'connecting':
          content = <div className={`${buttonClasses} bg-yellow-500 text-white`}><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div></div>;
          break;
        case 'connected':
          content = <button onClick={disconnect} className={`${buttonClasses} bg-red-500 text-white shadow-lg`}><MicOffIcon /></button>;
          break;
      }
      return <div className="my-8">{content}</div>;
    }
    
    const getStatusText = () => {
        switch(status) {
            case 'idle': return 'Tap to start conversation';
            case 'connecting': return 'Connecting...';
            case 'connected': return 'Connected. Start speaking.';
            case 'error': return 'Connection error. Please try again.';
        }
    }

    return (
        <div className="text-center p-8 bg-white rounded-lg border border-slate-200 h-full flex flex-col items-center justify-center">
            <h2 className="text-3xl font-bold text-slate-900">Live Chat</h2>
            <p className="text-slate-500 mt-2 max-w-md mx-auto">
                Start a real-time voice conversation with Gemini. Ask questions, brainstorm ideas, and get instant audio responses.
            </p>
            <MicButton />
            <p className="font-semibold text-slate-700">{getStatusText()}</p>
        </div>
    );
};