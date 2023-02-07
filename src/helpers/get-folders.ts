import os from 'node:os'

export const getFolders = async() => {
  const folders = os.platform() === 'win32'? 
  process.cwd().split('\\'):
  process.cwd().split('/');
  
  return folders;
}