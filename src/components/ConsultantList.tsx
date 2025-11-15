import React from 'react';
import type { TeamMember } from '../../types';
import { PlusIcon } from './icons';

interface TeamMemberListProps {
  teamMembers: TeamMember[];
  onAddTeamMember: () => void;
}

const TeamMemberCard: React.FC<{ member: TeamMember }> = ({ member }) => {
    const initial = member.name.charAt(0);
    return (
        <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-lg border border-white/20 text-center flex flex-col items-center text-shadow-strong">
            <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mb-4 border-2 border-teal-200 dark:bg-teal-900/50 dark:border-teal-800">
                <span className="text-3xl font-bold text-teal-600 dark:text-teal-300">{initial}</span>
            </div>
            <h3 className="text-lg font-bold text-slate-900 truncate w-full dark:text-slate-100">{member.name}</h3>
            <p className="text-sm text-slate-500 mb-2 dark:text-slate-400">{member.role}</p>
            <a href={`mailto:${member.email}`} className="text-xs text-teal-600 hover:text-teal-700 truncate w-full dark:text-teal-400 dark:hover:text-teal-300">{member.email}</a>
        </div>
    );
};

const AddTeamMemberCard: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button 
        onClick={onClick}
        className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl p-6 rounded-lg border-2 border-dashed border-white/30 text-center flex flex-col items-center justify-center hover:border-teal-500 hover:text-teal-600 transition-colors duration-200 text-slate-500 dark:text-slate-400 dark:hover:border-teal-400 dark:hover:text-teal-300 text-shadow-strong"
    >
        <div className="w-20 h-20 rounded-full bg-white/40 flex items-center justify-center mb-4 dark:bg-black/20">
            <PlusIcon />
        </div>
        <h3 className="text-lg font-bold">Add Member</h3>
    </button>
);


export const TeamMemberList: React.FC<TeamMemberListProps> = ({ teamMembers, onAddTeamMember }) => {
  return (
    <div className="text-shadow-strong">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Team Members</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {teamMembers.map((teamMember) => (
          <TeamMemberCard key={teamMember.id} member={teamMember} />
        ))}
        <AddTeamMemberCard onClick={onAddTeamMember} />
      </div>
    </div>
  );
};
