import React, { useState, useCallback } from 'react';
import type { Webpage, Client, WebpageComponent, WebpageComponentType, WebpageComponentStyles } from '../types';
import { WebpageStatus } from '../types';
import { generateWebpageText, generateImage } from '../services/geminiService';

// --- Helper Types ---
type ComponentUpdatePayload = {
    content?: { [key: string]: any };
    styles?: WebpageComponentStyles;
};

// --- Icons ---
const iconProps = { className: "h-5 w-5", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 };
const TypeIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M3 6h3M5 6v12M9 18h3m-3-6h3m3 6h3m-3-6h3M5 6h14" /></svg>;
const TextIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h7" /></svg>;
const ImageIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>;
const ButtonIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>;
const SpacerIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7h8M8 17h8m-8-5h8" /></svg>;
const HeroIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M4 5h16a1 1 0 011 1v12a1 1 0 01-1 1H4a1 1 0 01-1-1V6a1 1 0 011-1zm5 5l3 3 3-3" /></svg>;
const ColumnsIcon = () => <svg {...iconProps}><path strokeLinecap="round" strokeLinejoin="round" d="M9 20V4h6v16H9zM4 20V4h2v16H4zm14 0V4h2v16h-2z" /></svg>;
const CloseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>;
const PlusIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m6-6H6" /></svg>;
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.293 2.293a1 1 0 010 1.414L13 12l-1.293 1.293a1 1 0 01-1.414 0L8 10.414a1 1 0 010-1.414L10.293 7l-2.293-2.293a1 1 0 011.414 0L12 6.414l1.293-1.293a1 1 0 011.414 0zM17 12l-2.293 2.293a1 1 0 01-1.414 0L12 13l-1.293 1.293a1 1 0 01-1.414 0L8 13.414a1 1 0 010-1.414L10.293 10l-2.293-2.293a1 1 0 011.414 0L12 9.414l1.293-1.293a1 1 0 011.414 0L17 10.414a1 1 0 010 1.414L14.707 13l2.293 2.293a1 1 0 010 1.414L15 18l1.293-1.293a1 1 0 011.414 0L20 18.414a1 1 0 010-1.414L17.707 15l2.293-2.293a1 1 0 010-1.414L18 10l-1.293 1.293a1 1 0 01-1.414 0L14 10.414a1 1 0 010-1.414l2.293-2.293a1 1 0 011.414 0L20 9.414a1 1 0 010 1.414L17.707 12z" /></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

// --- Component Renderer ---
const ComponentRenderer: React.FC<{ component: WebpageComponent; isSelected: boolean; onSelect: () => void; children?: React.ReactNode }> = ({ component, isSelected, onSelect, children }) => {
    const styles = component.styles || {};
    const baseClasses = "relative cursor-pointer transition-all duration-200";
    const selectedClasses = isSelected ? "ring-2 ring-violet-500 ring-offset-2" : "hover:ring-2 hover:ring-violet-300";

    const renderInnerComponent = () => {
        switch(component.type) {
            case 'headline':
                const Tag = component.content.level || 'h1';
                const size = { h1: 'text-4xl', h2: 'text-3xl', h3: 'text-2xl' }[Tag] || 'text-4xl';
                return <Tag style={styles} className={`${size} font-bold`}>{component.content.text || 'Headline'}</Tag>;
            case 'paragraph':
                return <p style={styles} className="text-base leading-relaxed whitespace-pre-wrap">{component.content.text || 'Paragraph text goes here.'}</p>;
            case 'image':
                return component.content.src ? <img src={component.content.src} alt={component.content.alt || ''} className="max-w-full h-auto rounded-lg" style={styles} /> : <div className="bg-slate-200 aspect-video rounded-lg flex items-center justify-center text-slate-500">Image Placeholder</div>;
            case 'button':
                return <a href={component.content.url || '#'} style={styles} className="inline-block bg-violet-600 text-white px-6 py-3 rounded-md text-sm font-semibold no-underline hover:bg-violet-700">{component.content.text || 'Button'}</a>;
            case 'spacer':
                return <div style={{ height: `${component.content.height || 20}px` }}></div>;
            case 'hero':
                 return (
                    <div className="relative text-white rounded-lg overflow-hidden text-center flex flex-col items-center justify-center p-8" style={{ ...styles, minHeight: '300px' }}>
                        <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
                        {component.content.imageUrl && <img src={component.content.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover z-[-1]" />}
                        <div className="relative z-10">
                            <h1 className="text-4xl font-bold">{component.content.headline || 'Hero Headline'}</h1>
                            <p className="text-xl mt-2">{component.content.subheadline || 'Subheadline text'}</p>
                        </div>
                    </div>
                );
            case 'columns':
                 return <div className="flex flex-col md:flex-row gap-6 my-4" style={styles}>{children}</div>;
            default: return null;
        }
    }
    return <div onClick={onSelect} className={`${baseClasses} ${selectedClasses}`}>{renderInnerComponent()}</div>;
};

// --- Settings Panels ---
const SettingsPanel: React.FC<{
    component: WebpageComponent | null;
    onUpdate: (id: string, payload: ComponentUpdatePayload) => void;
    onDelete: (id: string) => void;
}> = ({ component, onUpdate, onDelete }) => {
    if (!component) return <div className="p-4 text-sm text-slate-500">Select a component to edit its properties.</div>;

    const handleContentChange = (field: string, value: any) => {
        onUpdate(component.id, { content: { ...component.content, [field]: value } });
    };

    const handleStyleChange = (field: keyof WebpageComponentStyles, value: any) => {
        onUpdate(component.id, { styles: { ...component.styles, [field]: value } });
    }

    const renderCommonStyles = () => (
        <div className="border-t pt-3 mt-3">
             <label className="block text-xs font-medium text-slate-500 mb-1">Text Align</label>
             <div className="flex items-center gap-1">
                 <button onClick={() => handleStyleChange('textAlign', 'left')} className={`p-1 rounded ${component.styles?.textAlign === 'left' ? 'bg-violet-200 text-violet-700' : ''}`}><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg></button>
                 <button onClick={() => handleStyleChange('textAlign', 'center')} className={`p-1 rounded ${component.styles?.textAlign === 'center' ? 'bg-violet-200 text-violet-700' : ''}`}><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm-3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd"></path></svg></button>
                 <button onClick={() => handleStyleChange('textAlign', 'right')} className={`p-1 rounded ${component.styles?.textAlign === 'right' ? 'bg-violet-200 text-violet-700' : ''}`}><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm-6 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm6 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd"></path></svg></button>
            </div>
        </div>
    );
    
    const renderSettings = () => {
        switch(component.type) {
            case 'headline': return <TextSettings content={component.content} onChange={handleContentChange} styles={component.styles} onStyleChange={handleStyleChange} isHeadline />;
            case 'paragraph': return <TextSettings content={component.content} onChange={handleContentChange} styles={component.styles} onStyleChange={handleStyleChange} />;
            case 'image': return <ImageSettings content={component.content} onChange={handleContentChange} />;
            case 'button': return <ButtonSettings content={component.content} onChange={handleContentChange} />;
            case 'spacer': return <div><label>Height (px)</label><input type="number" value={component.content.height || 20} onChange={e => handleContentChange('height', parseInt(e.target.value))} className="w-full mt-1 p-1 border rounded" /></div>;
            case 'hero': return <HeroSettings content={component.content} onChange={handleContentChange} />;
            default: return <p>No settings for this component.</p>;
        }
    };
    
    return (
      <div className="p-4 space-y-3">
        <div className="flex justify-between items-center">
            <h3 className="text-md font-bold capitalize">{component.type}</h3>
            <button onClick={() => onDelete(component.id)} className="text-slate-400 hover:text-red-500 p-1"><TrashIcon /></button>
        </div>
        {renderSettings()}
      </div>
    );
};

const TextSettings: React.FC<{content: any, onChange: (field: string, val: any) => void, styles?: any, onStyleChange: (field: string, val: any) => void, isHeadline?: boolean}> = ({ content, onChange, styles, onStyleChange, isHeadline }) => {
    const [aiPrompt, setAiPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const generateText = async () => {
        if (!aiPrompt) return;
        setIsLoading(true);
        const text = await generateWebpageText(aiPrompt);
        onChange('text', text);
        setIsLoading(false);
    };

    return (
      <div className="space-y-2">
        {isHeadline && <div><label className="text-xs">Level</label><select value={content.level || 'h1'} onChange={e => onChange('level', e.target.value)} className="w-full mt-1 p-1 border rounded"><option value="h1">H1</option><option value="h2">H2</option><option value="h3">H3</option></select></div>}
        <div><label className="text-xs">Text</label><textarea value={content.text || ''} onChange={e => onChange('text', e.target.value)} rows={isHeadline ? 2 : 5} className="w-full mt-1 p-1 border rounded" /></div>
        <div className="p-2 bg-slate-100 rounded">
            <label className="text-xs font-semibold">Generate with AI</label>
            <input type="text" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="e.g., a catchy headline" className="w-full mt-1 p-1 border rounded text-sm"/>
            <button onClick={generateText} disabled={isLoading} className="w-full text-sm mt-2 p-1 bg-violet-500 text-white rounded disabled:bg-violet-300">{isLoading ? 'Generating...' : 'Generate'}</button>
        </div>
        {renderCommonStyles(styles, onStyleChange)}
      </div>
    );
};

const ImageSettings: React.FC<{content: any, onChange: (field: string, val: any) => void}> = ({ content, onChange }) => {
    const [aiPrompt, setAiPrompt] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const generate = async () => {
        if (!aiPrompt) return;
        setIsLoading(true);
        const imageB64 = await generateImage(aiPrompt, '16:9');
        if (imageB64) {
            onChange('src', `data:image/jpeg;base64,${imageB64}`);
        }
        setIsLoading(false);
    };
    
    return (
        <div className="space-y-2">
            <div><label className="text-xs">Image URL</label><input type="text" value={content.src || ''} onChange={e => onChange('src', e.target.value)} className="w-full mt-1 p-1 border rounded" /></div>
            <div><label className="text-xs">Alt Text</label><input type="text" value={content.alt || ''} onChange={e => onChange('alt', e.target.value)} className="w-full mt-1 p-1 border rounded" /></div>
            <div className="p-2 bg-slate-100 rounded">
                <label className="text-xs font-semibold">Generate Image with AI</label>
                <input type="text" value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="a photo of a happy volunteer" className="w-full mt-1 p-1 border rounded text-sm"/>
                <button onClick={generate} disabled={isLoading} className="w-full text-sm mt-2 p-1 bg-violet-500 text-white rounded disabled:bg-violet-300">{isLoading ? 'Generating...' : 'Generate'}</button>
            </div>
        </div>
    );
};
const HeroSettings: React.FC<{content: any, onChange: (field: string, val: any) => void}> = ({ content, onChange }) => {
    return (
        <div className="space-y-2">
            <div><label className="text-xs">Headline</label><input type="text" value={content.headline || ''} onChange={e => onChange('headline', e.target.value)} className="w-full mt-1 p-1 border rounded" /></div>
            <div><label className="text-xs">Sub-headline</label><input type="text" value={content.subheadline || ''} onChange={e => onChange('subheadline', e.target.value)} className="w-full mt-1 p-1 border rounded" /></div>
            <div><label className="text-xs">Image URL</label><input type="text" value={content.imageUrl || ''} onChange={e => onChange('imageUrl', e.target.value)} className="w-full mt-1 p-1 border rounded" /></div>
        </div>
    );
};

const ButtonSettings: React.FC<{content: any, onChange: (field: string, val: any) => void}> = ({ content, onChange }) => (
    <div className="space-y-2">
        <div><label className="text-xs">Text</label><input type="text" value={content.text || ''} onChange={e => onChange('text', e.target.value)} className="w-full mt-1 p-1 border rounded" /></div>
        <div><label className="text-xs">URL</label><input type="text" value={content.url || ''} onChange={e => onChange('url', e.target.value)} className="w-full mt-1 p-1 border rounded" /></div>
    </div>
);

const renderCommonStyles = (styles: WebpageComponentStyles | undefined, onStyleChange: (field: string, val: any) => void) => (
    <div className="border-t pt-3 mt-3">
         <label className="block text-xs font-medium text-slate-500 mb-1">Text Align</label>
         <div className="flex items-center gap-1">
             <button onClick={() => onStyleChange('textAlign', 'left')} className={`p-1 rounded ${styles?.textAlign === 'left' ? 'bg-violet-200 text-violet-700' : ''}`}><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path></svg></button>
             <button onClick={() => onStyleChange('textAlign', 'center')} className={`p-1 rounded ${styles?.textAlign === 'center' ? 'bg-violet-200 text-violet-700' : ''}`}><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6 9a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm-3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3 4a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1z" clipRule="evenodd"></path></svg></button>
             <button onClick={() => onStyleChange('textAlign', 'right')} className={`p-1 rounded ${styles?.textAlign === 'right' ? 'bg-violet-200 text-violet-700' : ''}`}><svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm6 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1zm-6 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm6 4a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clipRule="evenodd"></path></svg></button>
        </div>
    </div>
);

// --- Component Palette ---
const componentList: { type: WebpageComponentType; label: string; icon: React.ReactNode; default: any }[] = [
    { type: 'headline', label: 'Headline', icon: <TypeIcon />, default: { content: { text: 'New Headline', level: 'h1' } } },
    { type: 'paragraph', label: 'Paragraph', icon: <TextIcon />, default: { content: { text: 'This is a new paragraph.' } } },
    { type: 'image', label: 'Image', icon: <ImageIcon />, default: { content: { src: '', alt: '' } } },
    { type: 'button', label: 'Button', icon: <ButtonIcon />, default: { content: { text: 'Click Me', url: '#' } } },
    { type: 'spacer', label: 'Spacer', icon: <SpacerIcon />, default: { content: { height: 40 } } },
    { type: 'hero', label: 'Hero', icon: <HeroIcon />, default: { content: { headline: 'Hero Headline', subheadline: 'Hero subheadline' } } },
    { type: 'columns', label: 'Columns', icon: <ColumnsIcon />, default: { content: { count: 2 }, children: [[], []] } },
];

const ComponentPalette: React.FC<{ onAddComponent: (type: WebpageComponentType) => void }> = ({ onAddComponent }) => (
    <div className="p-4 space-y-2">
        <h3 className="text-sm font-semibold text-slate-600">Components</h3>
        {componentList.map(({ type, label, icon }) => (
            <button key={type} onClick={() => onAddComponent(type)} className="w-full flex items-center gap-2 p-2 rounded-md text-sm text-slate-700 hover:bg-slate-200">
                {icon} {label}
            </button>
        ))}
    </div>
);


// --- Main Editor Component ---
interface GoldPagesProps {
    webpage: Webpage;
    clients: Client[];
    onClose: () => void;
    onSave: (page: Webpage) => void;
}

export const GoldPages: React.FC<GoldPagesProps> = ({ webpage, clients, onClose, onSave }) => {
    const [editablePage, setEditablePage] = useState<Webpage>(webpage);
    const [selectedComponentId, setSelectedComponentId] = useState<string | null>(null);

    const handleUpdate = useCallback((id: string, payload: ComponentUpdatePayload) => {
        setEditablePage(prev => ({
            ...prev,
            content: (prev.content || []).map(c => c.id === id ? { ...c, ...payload, content: {...c.content, ...payload.content}, styles: {...c.styles, ...payload.styles} } : c)
        }));
    }, []);

    const handleDelete = useCallback((id: string) => {
        setEditablePage(prev => ({
            ...prev,
            content: (prev.content || []).filter(c => c.id !== id)
        }));
        setSelectedComponentId(null);
    }, []);

    const handleAddComponent = (type: WebpageComponentType) => {
        const componentInfo = componentList.find(c => c.type === type);
        if (!componentInfo) return;
        
        const newComponent: WebpageComponent = {
            id: `comp-${Date.now()}`,
            type,
            ...componentInfo.default,
        };
        
        setEditablePage(prev => ({
            ...prev,
            content: [...(prev.content || []), newComponent]
        }));
    };

    const selectedComponent = editablePage.content?.find(c => c.id === selectedComponentId) || null;
    
    const renderCanvasContent = (components: WebpageComponent[]) => {
        return components.map(component => (
            <div key={component.id} className="my-2">
                <ComponentRenderer 
                    component={component} 
                    isSelected={component.id === selectedComponentId}
                    onSelect={() => setSelectedComponentId(component.id)}
                >
                    {component.type === 'columns' && component.children?.map((column, colIndex) => (
                        <div key={colIndex} className="flex-1 p-2 border border-dashed rounded-md space-y-2 min-h-[50px]">
                            {renderCanvasContent(column)}
                        </div>
                    ))}
                </ComponentRenderer>
            </div>
        ));
    };


    return (
        <div className="flex h-full flex-col bg-slate-100 dark:bg-slate-900">
            <header className="flex-shrink-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-3 flex items-center justify-between z-10">
                <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Gold Pages Editor</h2>
                 <div className="flex items-center gap-2">
                    <button onClick={() => onSave(editablePage)} className="px-4 py-2 text-sm font-semibold rounded-md bg-violet-600 text-white hover:bg-violet-700">
                        Save & Close
                    </button>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:bg-slate-100 rounded-full dark:hover:bg-slate-700">
                        <CloseIcon />
                    </button>
                </div>
            </header>
            <div className="flex-1 flex overflow-hidden">
                <aside className="w-56 bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700"><ComponentPalette onAddComponent={handleAddComponent} /></aside>
                <main className="flex-1 overflow-y-auto p-8 bg-slate-200 dark:bg-slate-900">
                     <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 p-8 shadow-lg min-h-full">
                        {editablePage.content && editablePage.content.length > 0 ? (
                           renderCanvasContent(editablePage.content)
                        ) : (
                           <div className="text-center text-slate-500 py-24 border-2 border-dashed rounded-lg">Add a component from the left panel to get started.</div>
                        )}
                     </div>
                </main>
                <aside className="w-80 bg-white dark:bg-slate-800 border-l border-slate-200 dark:border-slate-700 overflow-y-auto">
                    <SettingsPanel component={selectedComponent} onUpdate={handleUpdate} onDelete={handleDelete} />
                </aside>
            </div>
        </div>
    );
};
