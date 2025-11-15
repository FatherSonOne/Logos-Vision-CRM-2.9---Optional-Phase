import React from 'react';
import type { Webpage, WebpageComponent } from '../types';
import { Modal } from './Modal';

interface WebpagePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  page: Webpage;
}

const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
}

const ComponentRenderer: React.FC<{ component: WebpageComponent }> = ({ component }) => {
    const styles = component.styles || {};
    switch(component.type) {
        case 'headline':
            const Tag = component.content.level || 'h1';
            const size = { h1: 'text-4xl', h2: 'text-3xl', h3: 'text-2xl' }[Tag] || 'text-4xl';
            return <Tag style={styles} className={`${size} font-bold text-slate-800 dark:text-slate-100`}>{component.content.text}</Tag>;
        case 'paragraph':
            return <p style={styles} className="text-base leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{component.content.text}</p>;
        case 'image':
            return component.content.src ? <img src={component.content.src} alt={component.content.alt} className="max-w-full h-auto rounded-lg my-4" style={styles} /> : <div className="bg-slate-200 dark:bg-slate-700 aspect-video rounded-lg flex items-center justify-center text-slate-500 dark:text-slate-400">Image Placeholder</div>;
        case 'button':
            return <a href={component.content.url} style={styles} className="inline-block bg-violet-600 text-white px-6 py-3 rounded-md text-sm font-semibold no-underline hover:bg-violet-700">{component.content.text}</a>;
        case 'spacer':
            return <div style={{ height: `${component.content.height}px` }}></div>;
        case 'hero':
            return (
                <div className="relative text-white rounded-lg overflow-hidden my-4 text-center flex flex-col items-center justify-center p-8" style={{ ...styles, minHeight: '300px' }}>
                    <div className="absolute inset-0 bg-black opacity-50 z-0"></div>
                    {component.content.imageUrl && <img src={component.content.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover z-[-1]" />}
                    <div className="relative z-10">
                        <h1 className="text-4xl font-bold">{component.content.headline}</h1>
                        <p className="text-xl mt-2">{component.content.subheadline}</p>
                        {component.content.buttonText && <a href={component.content.buttonUrl} className="mt-6 inline-block bg-violet-600 text-white px-6 py-3 rounded-md text-sm font-semibold no-underline hover:bg-violet-700">{component.content.buttonText}</a>}
                    </div>
                </div>
            );
        case 'video':
            const videoId = getYouTubeId(component.content.url || '');
            if (!videoId) return <div className="text-red-500">Invalid YouTube URL</div>;
            return (
                <div className="aspect-w-16 aspect-h-9 my-4">
                    <iframe src={`https://www.youtube.com/embed/${videoId}`} frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen title="Embedded YouTube Video"></iframe>
                </div>
            )
        case 'columns':
             return (
                <div className="flex flex-col md:flex-row gap-6 my-4" style={styles}>
                    {component.children?.map((column, colIndex) => (
                        <div key={colIndex} className="flex-1 space-y-4">
                            {column.map(child => <ComponentRenderer key={child.id} component={child} />)}
                        </div>
                    ))}
                </div>
            )
        default:
            return null;
    }
};

export const WebpagePreviewModal: React.FC<WebpagePreviewModalProps> = ({ isOpen, onClose, page }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Preview: ${page.title}`}>
      <div className="bg-slate-50 dark:bg-slate-900 p-6 rounded-md max-h-[70vh] overflow-y-auto">
        <div className="space-y-4">
            {(page.content && page.content.length > 0) ? (
                page.content.map(component => <ComponentRenderer key={component.id} component={component} />)
            ) : (
                <div className="text-center py-12 text-slate-500 dark:text-slate-400">
                    <p>This page has no content to preview.</p>
                </div>
            )}
        </div>
      </div>
    </Modal>
  );
};