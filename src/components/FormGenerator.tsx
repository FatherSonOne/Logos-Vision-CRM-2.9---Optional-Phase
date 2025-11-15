import React, { useState } from 'react';
import type { Client } from '../types';
import { generateFormFromDescription } from '../services/geminiService';

interface FormField {
    label: string;
    type: 'text' | 'email' | 'phone' | 'date' | 'textarea' | 'checkbox' | 'radio' | 'select';
    options?: string[];
}

interface FormDefinition {
    title: string;
    description: string;
    fields: FormField[];
    error?: string;
}

interface FormGeneratorProps {
    clients: Client[];
}

export const FormGenerator: React.FC<FormGeneratorProps> = ({ clients }) => {
    const [description, setDescription] = useState('');
    const [selectedClientId, setSelectedClientId] = useState<string | null>(null);
    const [formDef, setFormDef] = useState<FormDefinition | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerate = async () => {
        if (!description.trim()) {
            alert('Please enter a description for the form.');
            return;
        }
        setIsLoading(true);
        setFormDef(null);
        const client = selectedClientId ? clients.find(c => c.id === selectedClientId) || null : null;
        try {
            const resultJson = await generateFormFromDescription(description, client);
            const parsedResult = JSON.parse(resultJson);
            setFormDef(parsedResult);
        } catch (error) {
            console.error("Failed to parse form JSON", error);
            setFormDef({ title: 'Error', description: 'Failed to generate a valid form.', fields: [], error: "The AI returned an invalid structure." });
        }
        setIsLoading(false);
    };

    const renderField = (field: FormField, index: number) => {
        const id = `form-field-${index}`;
        const inputClasses = "mt-1 block w-full rounded-md border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 shadow-sm focus:border-teal-300 focus:ring focus:ring-teal-200 focus:ring-opacity-50";
        const labelClasses = "block text-sm font-medium text-slate-700 dark:text-slate-300";

        switch (field.type) {
            case 'textarea':
                return (
                    <div key={index} className="mb-4">
                        <label htmlFor={id} className={labelClasses}>{field.label}</label>
                        <textarea id={id} rows={3} className={inputClasses} />
                    </div>
                );
            case 'select':
                return (
                     <div key={index} className="mb-4">
                        <label htmlFor={id} className={labelClasses}>{field.label}</label>
                        <select id={id} className={inputClasses}>
                           {field.options?.map((opt, i) => <option key={i} value={opt}>{opt}</option>)}
                        </select>
                    </div>
                );
            case 'checkbox':
                return (
                    <div key={index} className="mb-4 flex items-center">
                        <input id={id} type="checkbox" className="rounded border-slate-300 text-teal-600 shadow-sm focus:border-teal-300 focus:ring focus:ring-offset-0 focus:ring-teal-200 focus:ring-opacity-50" />
                        <label htmlFor={id} className="ml-2 block text-sm text-slate-900 dark:text-slate-200">{field.label}</label>
                    </div>
                );
            case 'radio':
                 return (
                     <div key={index} className="mb-4">
                        <label className={labelClasses}>{field.label}</label>
                        <div className="mt-2 space-y-2">
                            {field.options?.map((opt, i) => (
                                <div key={i} className="flex items-center">
                                    <input id={`${id}-${i}`} name={id} type="radio" className="focus:ring-teal-500 h-4 w-4 text-teal-600 border-slate-300" />
                                    <label htmlFor={`${id}-${i}`} className="ml-3 block text-sm font-medium text-slate-700 dark:text-slate-200">{opt}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            default:
                return (
                    <div key={index} className="mb-4">
                        <label htmlFor={id} className={labelClasses}>{field.label}</label>
                        <input type={field.type} id={id} className={inputClasses} />
                    </div>
                );
        }
    };

    return (
        <div className="text-shadow-strong">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">AI Form Generator</h2>
                    <p className="text-slate-600 mt-1 dark:text-slate-300">Describe the form you need, and let AI build it for you.</p>
                </div>
            </div>

            {/* Builder Interface */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Panel: Inputs */}
                <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-lg border border-white/20 shadow-lg space-y-4">
                    <div>
                        <label htmlFor="form-description" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
                            1. Describe your form
                        </label>
                        <textarea
                            id="form-description"
                            rows={5}
                            className="w-full p-2 bg-white/50 border border-white/30 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-black/30 dark:border-white/20"
                            placeholder="e.g., A volunteer signup form with fields for name, email, phone number, and available days (checkboxes)."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="client-select" className="block text-sm font-medium text-slate-700 mb-1 dark:text-slate-200">
                            2. (Optional) Associate with a client
                        </label>
                        <select
                            id="client-select"
                            className="w-full p-2 bg-white/50 border border-white/30 rounded-md focus:ring-teal-500 focus:border-teal-500 dark:bg-black/30 dark:border-white/20"
                            value={selectedClientId || ''}
                            onChange={(e) => setSelectedClientId(e.target.value || null)}
                        >
                            <option value="">None (General Template)</option>
                            {clients.map(client => <option key={client.id} value={client.id}>{client.name}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={handleGenerate}
                        disabled={isLoading}
                        className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2.5 rounded-md text-sm font-semibold hover:from-teal-700 hover:to-cyan-700 transition-colors disabled:from-teal-400 disabled:to-cyan-400"
                    >
                        {isLoading ? 'Generating...' : 'Generate Form'}
                    </button>
                </div>

                {/* Right Panel: Preview */}
                <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-lg border border-white/20 shadow-lg">
                    <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">Preview</h3>
                    <div className="bg-white dark:bg-slate-800/50 p-6 rounded-md border border-slate-200 dark:border-slate-700">
                        {isLoading && (
                            <div className="flex items-center justify-center h-48">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
                            </div>
                        )}
                        {formDef && (
                            <form>
                                <h2 className="text-2xl font-bold mb-1">{formDef.title}</h2>
                                <p className="text-slate-600 mb-6 dark:text-slate-300">{formDef.description}</p>
                                {formDef.error && <p className="text-red-500">{formDef.error}</p>}
                                {formDef.fields.map((field, index) => renderField(field, index))}
                            </form>
                        )}
                        {!isLoading && !formDef && (
                            <div className="text-center text-slate-500 dark:text-slate-400 py-16">
                                Your generated form will appear here.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};