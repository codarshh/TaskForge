import React from 'react';

export const LeetCodeIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.102 17.93l-2.697 2.607c-.466.45-1.211.45-1.677 0l-8-7.72c-.466-.45-.466-1.177 0-1.627l8-7.72c.466-.45 1.211-.45 1.677 0l2.697 2.607c.466.45.466 1.177 0 1.627l-2.697 2.607c-.466.45-1.211.45-1.677 0l-1.348-1.304c-.466-.45-.466-1.177 0-1.627l1.348-1.304-.674-.652-5.326 5.143c-.466.45-.466 1.177 0 1.627l5.326 5.143.674-.652-1.348-1.304c-.466-.45-.466-1.177 0-1.627l1.348-1.304c.466-.45 1.211-.45 1.677 0l2.697 2.607c.466.45.466 1.177 0 1.627z" fill="#FFA116" />
  </svg>
);

export const CodeforcesIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="11" width="4" height="9" rx="1" fill="#3B5998" />
    <rect x="10" y="5" width="4" height="15" rx="1" fill="#EA2027" />
    <rect x="17" y="8" width="4" height="12" rx="1" fill="#FFC312" />
  </svg>
);

export const GitHubIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ color: 'var(--text-primary)' }}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export const CodeChefIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 11H8v-2h8v2z" fill="#5B4636" />
    <path d="M12 4a3 3 0 0 0-3 3h6a3 3 0 0 0-3-3zM12 17a3 3 0 0 1-3-3h6a3 3 0 0 1-3 3z" fill="#A48374" />
  </svg>
);

export const HackerRankIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#2EC866" />
    <path d="M7 6V18M17 6V18M7 12H17" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
  </svg>
);

export const GeeksforGeeksIcon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#2F8D46" />
    <path d="M6 12a6 6 0 0 1 12 0H15a3 3 0 0 0-6 0h6a3 3 0 0 0-6 0" fill="white" />
  </svg>
);

export const getPlatformIcon = (platformId, size = 20) => {
  switch (platformId) {
    case 'leetcode':
      return <LeetCodeIcon size={size} />;
    case 'codeforces':
      return <CodeforcesIcon size={size} />;
    case 'github':
      return <GitHubIcon size={size} />;
    case 'codechef':
      return <CodeChefIcon size={size} />;
    case 'hackerrank':
      return <HackerRankIcon size={size} />;
    case 'geeksforgeeks':
      return <GeeksforGeeksIcon size={size} />;
    default:
      return null;
  }
};
