import { FetchedRepoData } from '../types';

/**
 * Parses a GitHub URL to extract owner and repo name.
 * Supports: https://github.com/owner/repo
 */
export const parseGithubUrl = (url: string): { owner: string; name: string } | null => {
  try {
    const urlObj = new URL(url);
    if (urlObj.hostname !== 'github.com') return null;
    
    const parts = urlObj.pathname.split('/').filter(Boolean);
    if (parts.length < 2) return null;
    
    return { owner: parts[0], name: parts[1] };
  } catch (e) {
    return null;
  }
};

/**
 * Attempts to fetch raw files from the repository.
 * Note: Browser CORS policies might block direct requests to raw.githubusercontent.com
 * depending on the environment. This is a best-effort fetch.
 */
export const fetchRepoContext = async (url: string): Promise<FetchedRepoData> => {
  const repoInfo = parseGithubUrl(url);
  if (!repoInfo) {
    throw new Error('Invalid GitHub URL');
  }

  const baseUrl = `https://raw.githubusercontent.com/${repoInfo.owner}/${repoInfo.name}/HEAD`;

  const fetchFile = async (filename: string): Promise<string | null> => {
    try {
      const response = await fetch(`${baseUrl}/${filename}`);
      if (!response.ok) return null;
      return await response.text();
    } catch (error) {
      console.warn(`Failed to fetch ${filename}`, error);
      return null;
    }
  };

  const [readme, packageJson, requirements] = await Promise.all([
    fetchFile('README.md'),
    fetchFile('package.json'),
    fetchFile('requirements.txt'),
  ]);

  return {
    owner: repoInfo.owner,
    name: repoInfo.name,
    readme: readme ? readme.substring(0, 10000) : null, // Truncate to save context
    packageJson: packageJson,
    requirements: requirements,
  };
};