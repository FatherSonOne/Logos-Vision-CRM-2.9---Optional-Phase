import React, { useState, useRef } from 'react';
import { analyzeImage, transcribeAudio } from '../services/geminiService';

const AiToolCard: React.FC<{ title: string, icon: React.ReactNode, children: React.ReactNode }> = ({ title, icon, children }) => (
    <div className="bg-white/10 dark:bg-black/20 p-4 rounded-lg h-full flex flex-col">
        <h4 className="font-bold text-slate-800 dark:text-slate-100 mb-3 text-center flex items-center justify-center gap-2">
            {icon} {title}
        </h4>
        {children}
    </div>
);

const CopyButton: React.FC<{ text: string }> = ({ text }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };
    return (
        <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 bg-white/30 rounded-md text-slate-600 hover:bg-white/50 dark:bg-black/30 dark:text-slate-300 dark:hover:bg-black/50 text-xs">
            {copied ? 'Copied!' : 'Copy'}
        </button>
    );
};

const ImageAnalyzer: React.FC = () => {
    const [image, setImage] = useState<{b64: string, mime: string, name: string} | null>(null);
    const [prompt, setPrompt] = useState('Describe this image in detail.');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (readEvent) => {
                const b64 = (readEvent.target?.result as string).split(',')[1];
                setImage({ b64, mime: file.type, name: file.name });
                setResult('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAnalyze = async () => {
        if (!image) return;
        setIsLoading(true);
        setResult('');
        const response = await analyzeImage(image.b64, image.mime, prompt);
        setResult(response);
        setIsLoading(false);
    }
    
    return (
        <AiToolCard title="Image Analyzer" icon={<ImageIcon />}>
            <div className="p-4 border-2 border-dashed border-white/30 rounded-lg text-center flex-grow flex flex-col justify-center">
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="text-cyan-600 font-semibold dark:text-cyan-400 hover:underline text-sm">
                    {image ? `Selected: ${image.name}` : 'Select an Image'}
                </button>
                {image && <img src={`data:${image.mime};base64,${image.b64}`} alt="preview" className="mt-4 max-h-24 mx-auto rounded-md" />}
            </div>
            <textarea 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)} 
                rows={2} 
                className="w-full p-2 border border-white/30 rounded-md mt-4 bg-white/20 dark:bg-black/20 text-sm placeholder-slate-500"
                placeholder="Enter a prompt..."
            />
            <button 
                onClick={handleAnalyze} 
                disabled={!image || isLoading} 
                className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-sky-600 text-white p-2 rounded-md disabled:opacity-50 text-sm font-semibold btn-hover-scale"
            >
                {isLoading ? 'Analyzing...' : 'Analyze Image'}
            </button>
            {isLoading && <div className="text-center mt-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500 mx-auto"></div></div>}
            {result && <div className="relative mt-4 p-3 bg-white/20 dark:bg-black/20 rounded-md whitespace-pre-wrap text-sm max-h-48 overflow-y-auto"><CopyButton text={result}/>{result}</div>}
        </AiToolCard>
    )
};

const VideoAnalyzer: React.FC = () => {
    const [video, setVideo] = useState<{ url: string; name: string } | null>(null);
    const [firstFrame, setFirstFrame] = useState<{b64: string, mime: string} | null>(null);
    const [prompt, setPrompt] = useState('What is happening in this scene?');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setVideo({ url, name: file.name });
            setResult('');

            const videoEl = document.createElement('video');
            videoEl.src = url;
            videoEl.onloadeddata = () => {
                const canvas = document.createElement('canvas');
                canvas.width = videoEl.videoWidth;
                canvas.height = videoEl.videoHeight;
                canvas.getContext('2d')?.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
                const frameDataUrl = canvas.toDataURL('image/jpeg');
                setFirstFrame({ b64: frameDataUrl.split(',')[1], mime: 'image/jpeg' });
                URL.revokeObjectURL(url); // Clean up
            };
        }
    };

    const handleAnalyze = async () => {
        if (!firstFrame) return;
        setIsLoading(true);
        setResult('');
        const response = await analyzeImage(firstFrame.b64, firstFrame.mime, prompt);
        setResult(response);
        setIsLoading(false);
    };

    return (
        <AiToolCard title="Video Analyzer" icon={<VideoIcon />}>
            <div className="p-4 border-2 border-dashed border-white/30 rounded-lg text-center flex-grow flex flex-col justify-center">
                <input type="file" accept="video/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="text-cyan-600 font-semibold dark:text-cyan-400 hover:underline text-sm">
                    {video ? `Selected: ${video.name}` : 'Select a Video'}
                </button>
                {firstFrame && <img src={`data:${firstFrame.mime};base64,${firstFrame.b64}`} alt="video first frame" className="mt-4 max-h-24 mx-auto rounded-md" />}
            </div>
            <textarea 
                value={prompt} 
                onChange={e => setPrompt(e.target.value)} 
                rows={2} 
                className="w-full p-2 border border-white/30 rounded-md mt-4 bg-white/20 dark:bg-black/20 text-sm placeholder-slate-500"
                placeholder="Enter a prompt for the first frame..."
            />
            <button 
                onClick={handleAnalyze} 
                disabled={!firstFrame || isLoading} 
                className="w-full mt-2 bg-gradient-to-r from-cyan-600 to-sky-600 text-white p-2 rounded-md disabled:opacity-50 text-sm font-semibold btn-hover-scale"
            >
                {isLoading ? 'Analyzing...' : 'Analyze First Frame'}
            </button>
             {isLoading && <div className="text-center mt-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500 mx-auto"></div></div>}
            {result && <div className="relative mt-4 p-3 bg-white/20 dark:bg-black/20 rounded-md whitespace-pre-wrap text-sm max-h-48 overflow-y-auto"><CopyButton text={result}/>{result}</div>}
        </AiToolCard>
    );
};

const AudioTranscription: React.FC = () => {
    const [audio, setAudio] = useState<{ b64: string; mime: string; name: string; url: string } | null>(null);
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            const reader = new FileReader();
            reader.onload = (readEvent) => {
                const b64 = (readEvent.target?.result as string).split(',')[1];
                setAudio({ b64, mime: file.type, name: file.name, url });
                setResult('');
            };
            reader.readAsDataURL(file);
        }
    };

    const handleTranscribe = async () => {
        if (!audio) return;
        setIsLoading(true);
        setResult('');
        const response = await transcribeAudio(audio.b64, audio.mime);
        setResult(response);
        setIsLoading(false);
    };

    return (
        <AiToolCard title="Audio Transcription" icon={<AudioIcon />}>
            <div className="p-4 border-2 border-dashed border-white/30 rounded-lg text-center flex-grow flex flex-col justify-center">
                <input type="file" accept="audio/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                <button onClick={() => fileInputRef.current?.click()} className="text-cyan-600 font-semibold dark:text-cyan-400 hover:underline text-sm">
                    {audio ? `Selected: ${audio.name}` : 'Select an Audio File'}
                </button>
                {audio && <audio src={audio.url} controls className="mt-4 w-full" />}
            </div>
            <button 
                onClick={handleTranscribe} 
                disabled={!audio || isLoading} 
                className="w-full mt-4 bg-gradient-to-r from-cyan-600 to-sky-600 text-white p-2 rounded-md disabled:opacity-50 text-sm font-semibold btn-hover-scale"
            >
                {isLoading ? 'Transcribing...' : 'Transcribe Audio'}
            </button>
            {isLoading && <div className="text-center mt-4"><div className="animate-spin rounded-full h-6 w-6 border-b-2 border-cyan-500 mx-auto"></div></div>}
            {result && <div className="relative mt-4 p-3 bg-white/20 dark:bg-black/20 rounded-md whitespace-pre-wrap text-sm max-h-48 overflow-y-auto"><CopyButton text={result}/>{result}</div>}
        </AiToolCard>
    );
};


const ToolLinkCard: React.FC<{ name: string; description: string; url: string; icon: React.ReactNode }> = ({ name, description, url, icon }) => (
    <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block p-4 bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl rounded-lg border border-white/20 hover:border-cyan-500/50 dark:hover:border-cyan-400/50 hover:shadow-lg transition-all group text-shadow-strong"
    >
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 flex-shrink-0 flex items-center justify-center">{icon}</div>
            <h4 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-cyan-600 dark:group-hover:text-cyan-400">{name}</h4>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">{description}</p>
    </a>
);

const GenericIcon: React.FC<{ letter: string; color: string }> = ({ letter, color }) => (
    <div className={`w-8 h-8 rounded-lg ${color} text-white flex items-center justify-center font-bold text-md shadow-inner`}>
        {letter}
    </div>
);

const workflowTools = [
    { name: 'Gamma.app', description: 'AI-powered tool for creating engaging presentations, documents, and webpages.', url: 'https://gamma.app/', icon: <GenericIcon letter="G" color="bg-purple-500" /> },
    { name: 'Claude.ai', description: 'A next-generation AI assistant for your tasks, no matter the scale.', url: 'https://claude.ai/', icon: <GenericIcon letter="C" color="bg-orange-500" /> },
    { name: 'Perplexity.ai', description: 'An AI search engine that provides direct, cited answers to complex questions.', url: 'https://www.perplexity.ai/', icon: <GenericIcon letter="P" color="bg-sky-500" /> },
    { name: 'Veed.io', description: 'Online video suite with AI features for subtitling, editing, and content creation.', url: 'https://www.veed.io/', icon: <GenericIcon letter="V" color="bg-blue-600" /> },
    { name: 'Notion AI', description: 'Integrate AI assistance directly into your notes, docs, and project management.', url: 'https://www.notion.so/product/ai', icon: <GenericIcon letter="N" color="bg-slate-800" /> },
    { name: 'Midjourney', description: 'An independent research lab producing a proprietary artificial intelligence program that creates images from textual descriptions.', url: 'https://www.midjourney.com/', icon: <GenericIcon letter="M" color="bg-teal-500" /> },
    { name: 'ElevenLabs', description: 'Generate high-quality spoken audio in any voice, style, and language.', url: 'https://elevenlabs.io/', icon: <GenericIcon letter="E" color="bg-cyan-500" /> },
    { name: 'Tome', description: 'The AI-powered storytelling format for presentations and documents.', url: 'https://tome.app/', icon: <GenericIcon letter="T" color="bg-gray-700" /> },
    { name: 'Jasper.ai', description: 'AI Content Platform that helps your team create content tailored for your brand.', url: 'https://www.jasper.ai/', icon: <GenericIcon letter="J" color="bg-pink-500" /> },
    { name: 'Fireflies.ai', description: 'AI assistant for your meetings. Record, transcribe, and search your conversations.', url: 'https://fireflies.ai/', icon: <GenericIcon letter="F" color="bg-red-500" /> },
    { name: 'DALL-E 3', description: 'Create highly detailed images from text descriptions using OpenAI\'s advanced model.', url: 'https://openai.com/dall-e-3', icon: <GenericIcon letter="D" color="bg-green-500" /> },
    { name: 'Synthesia', description: 'Create professional videos with AI avatars and voiceovers from just text.', url: 'https://www.synthesia.io/', icon: <GenericIcon letter="S" color="bg-blue-400" /> },
    { name: 'RunwayML', description: 'An applied AI research company shaping the next era of art, entertainment and human creativity.', url: 'https://runwayml.com/', icon: <GenericIcon letter="R" color="bg-gray-400" /> },
    { name: 'Zapier', description: 'Automate workflows by connecting your apps and services with AI-powered triggers.', url: 'https://zapier.com/', icon: <GenericIcon letter="Z" color="bg-orange-400" /> },
    { name: 'Consensus', description: 'An AI search engine for research papers, extracting and distilling scientific findings.', url: 'https://consensus.app/', icon: <GenericIcon letter="C" color="bg-indigo-500" /> },
    { name: 'NotebookLM', description: 'Google\'s AI research and writing assistant for your source materials.', url: 'https://notebooklm.google.com/', icon: <GenericIcon letter="N" color="bg-blue-500" /> },
    { name: 'Google Colab', description: 'Collaborative notebooks for AI/ML development, running in the cloud.', url: 'https://colab.research.google.com/', icon: <GenericIcon letter="C" color="bg-yellow-500" /> },
    { name: 'Hugging Face', description: 'The AI community building the future. Find models, datasets, and applications.', url: 'https://huggingface.co/', icon: <GenericIcon letter="H" color="bg-yellow-400" /> },
    { name: 'Kaggle', description: 'A community for data scientists and ML practitioners. Access datasets and notebooks.', url: 'https://www.kaggle.com/', icon: <GenericIcon letter="K" color="bg-sky-400" /> },
    { name: 'Replicate', description: 'Run and fine-tune open-source AI models with a cloud API.', url: 'https://replicate.com/', icon: <GenericIcon letter="R" color="bg-black" /> },
];

export const AiTools: React.FC = () => {
    return (
        <div className="text-shadow-strong">
            <div className="mb-6">
                <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">AI Tools</h2>
                <p className="text-slate-600 mt-1 dark:text-slate-300">Leverage powerful AI models for various tasks and discover tools to enhance your workflow.</p>
            </div>
            
            <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-lg border border-white/20 shadow-lg">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">AI Media Analyzer</h3>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <ImageAnalyzer />
                    <VideoAnalyzer />
                    <AudioTranscription />
                </div>
            </div>

            <div className="mt-8">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 mb-2">Workflow Enhancement Tools</h3>
                <p className="text-slate-600 dark:text-slate-400 mt-1 mb-6">A curated list of external AI tools and applications to help streamline your workflow.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {workflowTools.map(tool => (
                        <ToolLinkCard key={tool.name} {...tool} />
                    ))}
                </div>
            </div>
        </div>
    );
};


const ImageIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const VideoIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>;
const AudioIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>;