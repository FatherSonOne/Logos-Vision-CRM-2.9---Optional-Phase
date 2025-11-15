import React from 'react';

const ServiceCard: React.FC<{
  title: string;
  description: string;
  href: string;
  icon: React.ReactNode;
  buttonText: string;
}> = ({ title, description, href, icon, buttonText }) => (
  <div className="bg-white/20 dark:bg-slate-900/40 backdrop-blur-xl p-8 rounded-lg border border-white/20 shadow-lg flex flex-col items-center text-center hover:border-white/40 transition-colors duration-300 text-shadow-strong">
    <div className="h-16 w-16 mb-6 flex items-center justify-center">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2 dark:text-slate-100">{title}</h3>
    <p className="text-slate-600 text-sm mb-8 flex-grow dark:text-slate-300">{description}</p>
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-full text-center bg-gradient-to-r from-teal-600 to-cyan-600 text-white px-4 py-2.5 rounded-md text-sm font-semibold hover:from-teal-700 hover:to-cyan-700 transition-colors shadow-md"
    >
      {buttonText}
    </a>
  </div>
);

export const VideoConference: React.FC = () => {
  return (
    <div className="text-shadow-strong">
      <div className="mb-10 text-center">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-100">Video Conference</h2>
        <p className="text-slate-600 mt-2 max-w-2xl mx-auto dark:text-slate-300">
          Instantly start a new video meeting with your team or clients using your preferred service.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
        <ServiceCard
          title="Google Meet"
          description="Start a secure, high-quality video meeting for free. No account needed for guests to join."
          href="https://meet.new"
          buttonText="Start Google Meet"
          icon={<GoogleMeetIcon />}
        />
        <ServiceCard
          title="Zoom"
          description="Launch an instant meeting and share the link to collaborate with your team."
          href="https://zoom.us/start/meeting"
          buttonText="Start Zoom Meeting"
          icon={<ZoomIcon />}
        />
        <ServiceCard
          title="Microsoft Teams"
          description="Create a new meeting link for your team to join and discuss project details."
          href="https://teams.microsoft.com/l/meeting/new?subject=New%20CRM%20Meeting"
          buttonText="Start Teams Meeting"
          icon={<MicrosoftTeamsIcon />}
        />
      </div>
    </div>
  );
};


// Icons
const GoogleMeetIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M13 11V3.99265C13 3.44421 13.4477 3 14 3H21C21.5523 3 22 3.44772 22 4V12C22 18.0751 17.0751 23 11 23C4.92487 23 0 18.0751 0 12C0 5.92487 4.92487 1 11 1C12.1046 1 13 1.89543 13 3V11Z" fill="#00832D"/>
    <path d="M21 3H14C13.4477 3 13 3.44421 13 3.99265V11H22V4C22 3.44772 21.5523 3 21 3Z" fill="#00AC47"/>
    <path d="M13 11V3.99265C13 3.44421 13.4477 3 14 3H16L13 11Z" fill="#006622"/>
    <path d="M0 12C0 5.92487 4.92487 1 11 1C12.1046 1 13 1.89543 13 3V11L14.75 8.75L11.5 4.5L6.5 11H13Z" fill="#FFBA00"/>
    <path d="M13 11L6.5 11L11.5 4.5L14.75 8.75L13 11Z" fill="#FFCA28"/>
    <path d="M13 3V11L6.5 11L9.125 7.25L11.5 4.5L13 3Z" fill="#FFC107"/>
    <path d="M11 1C4.92487 1 0 5.92487 0 12H6.5L11.5 4.5C11.3333 3.16667 11 1 11 1Z" fill="#EA4335"/>
    <path d="M11 23C17.0751 23 22 18.0751 22 12H13L9.5 16L11 23Z" fill="#2684FC"/>
  </svg>
);

const ZoomIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="11" fill="#2D8CFF"/>
        <path d="M10.4571 8.68571H6V15.3143H10.4571V12.7429H7.71429V11.9429H10.4571V9.48571H7.71429V8.68571H10.4571ZM17.25 9.59993C17.25 8.94107 16.7937 8.68564 16.1429 8.68564H13.7143V15.3142H14.5714V12.4571L16.2286 15.3142H17.25L15.3429 12.1428L17.25 9.59993ZM14.5714 11.5428V9.48564H16.0286C16.4 9.48564 16.4 9.77136 16.4 9.9428V11.0856C16.4 11.2571 16.4 11.5428 16.0286 11.5428H14.5714Z" fill="white"/>
    </svg>
);

const MicrosoftTeamsIcon = () => (
    <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="24" height="24" rx="4" fill="#464775"/>
        <path d="M12.2619 6.33334C11.3934 6.33334 10.6667 7.05128 10.6667 7.92858V11.7619C10.6667 12.6392 11.3934 13.3572 12.2619 13.3572H16.0476C16.9161 13.3572 17.6428 12.6392 17.6428 11.7619V7.92858C17.6428 7.05128 16.9161 6.33334 16.0476 6.33334H12.2619Z" fill="#FFFFFF"/>
        <path d="M6.35712 9.57144C5.48862 9.57144 4.7619 10.2894 4.7619 11.1667V14.2857C4.7619 15.163 5.48862 15.881 6.35712 15.881H8.38093C8.82518 15.881 9.25236 16.0526 9.57074 16.3571L11.5952 18.2857V14.6667C11.5952 14.0772 11.1274 13.6072 10.5476 13.6072H8.16664V11.381C8.16664 10.3701 7.35414 9.57144 6.35712 9.57144Z" fill="#FFFFFF"/>
    </svg>
);