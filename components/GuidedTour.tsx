import React, { useEffect, useRef, useState } from 'react';

export interface TourStep {
    selector: string;
    title: string;
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
}

interface GuidedTourProps {
    steps: TourStep[];
    isOpen: boolean;
    onClose: () => void;
}

export const GuidedTour: React.FC<GuidedTourProps> = ({ steps, isOpen, onClose }) => {
    const [currentStep, setCurrentStep] = useState(0);
    const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
    const stepRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            const step = steps[currentStep];
            if (step) {
                const targetElement = document.querySelector(step.selector);
                if (targetElement) {
                    const rect = targetElement.getBoundingClientRect();
                    setTargetRect(rect);
                    targetElement.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });
                } else {
                    console.warn(`Tour step selector not found: ${step.selector}`);
                    // Skip to next step or end tour if element not found
                    if (currentStep < steps.length - 1) {
                        setCurrentStep(s => s + 1);
                    } else {
                        onClose();
                    }
                }
            }
        }
    }, [isOpen, currentStep, steps, onClose]);
    
    useEffect(() => {
        // Reset step to 0 when tour is opened
        if (isOpen) {
            setCurrentStep(0);
        }
    }, [isOpen]);

    if (!isOpen || !targetRect) return null;

    const step = steps[currentStep];
    const { top, left, width, height } = targetRect;

    const tooltipStyle: React.CSSProperties = {
        position: 'absolute',
        zIndex: 10001,
        transition: 'top 0.3s ease-in-out, left 0.3s ease-in-out',
    };
    
    // Position tooltip
    if (step.position === 'top') {
        tooltipStyle.top = `${top - 10}px`;
        tooltipStyle.left = `${left + width / 2}px`;
        tooltipStyle.transform = 'translate(-50%, -100%)';
    } else if (step.position === 'left') {
        tooltipStyle.top = `${top + height / 2}px`;
        tooltipStyle.left = `${left - 10}px`;
        tooltipStyle.transform = 'translate(-100%, -50%)';
    } else if (step.position === 'right') {
        tooltipStyle.top = `${top + height / 2}px`;
        tooltipStyle.left = `${left + width + 10}px`;
        tooltipStyle.transform = 'translateY(-50%)';
    } else { // bottom is default
        tooltipStyle.top = `${top + height + 10}px`;
        tooltipStyle.left = `${left + width / 2}px`;
        tooltipStyle.transform = 'translateX(-50%)';
    }

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(s => s + 1);
        } else {
            onClose();
        }
    }

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(s => s - 1);
        }
    }


    return (
        <div className="fixed inset-0 z-[10000]">
            <div
                className="absolute bg-black/60"
                style={{
                    clipPath: `path("M0,0H${window.innerWidth}V${window.innerHeight}H0V0ZM${left - 4},${top - 4}h${width + 8}v${height + 8}h-${width + 8}Z")`,
                    transition: 'clip-path 0.3s ease-in-out'
                }}
            />
            <div ref={stepRef} style={tooltipStyle} className="bg-white/90 backdrop-blur-md dark:bg-slate-800/90 p-4 rounded-lg shadow-2xl w-80 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">{step.content}</p>
                <div className="flex justify-between items-center mt-4">
                    <span className="text-xs text-slate-400">{currentStep + 1} / {steps.length}</span>
                    <div className="flex items-center gap-2">
                        {currentStep > 0 && <button onClick={prevStep} className="text-sm font-semibold px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">Back</button>}
                        <button onClick={nextStep} className="text-sm font-semibold px-3 py-1 bg-violet-600 text-white rounded hover:bg-violet-700">
                           {currentStep < steps.length - 1 ? 'Next' : 'Finish'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
