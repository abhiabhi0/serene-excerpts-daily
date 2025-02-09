
import filesJson from '../../public/data/files.json';

export const getFilesHash = () => {
  // Simple hash of filenames and their order
  return filesJson.sort().join(',');
};

export const hasFilesChanged = (previousHash: string | null) => {
  const currentHash = getFilesHash();
  return previousHash !== currentHash;
};
