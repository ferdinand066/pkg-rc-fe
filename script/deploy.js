import ftp from 'basic-ftp';
import fs from 'fs';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

async function copyHtaccess(localPath) {
  const sourcePath = './.htaccess';  // Assuming .htaccess is in the root directory
  const destinationPath = `${localPath}/.htaccess`;

  try {
    await fs.promises.copyFile(sourcePath, destinationPath);
    console.log('\x1b[32m%s\x1b[0m', '✓ .htaccess copied successfully');
  } catch (err) {
    console.error('Error copying .htaccess:', err);
  }
}

async function uploadToFTP(localPath, remotePath, ftpConfig) {
  const client = new ftp.Client();
  console.log('On progress uploading files to FTP');

  try {
    await copyHtaccess(localPath);

    await client.access(ftpConfig);

    // Upload files
    await client.uploadFromDir(localPath, remotePath);

    console.log('\x1b[32m%s\x1b[0m', '✓ Files uploaded to FTP successfully');
  } catch (err) {
    console.error('FTP Error:', err);
  } finally {
    client.close();
  }
}

const ftpConfig = {
  host: process.env.FTP_HOST,
  user: process.env.FTP_USER,
  password: process.env.FTP_PASSWORD,
  port: parseInt(process.env.FTP_PORT) || 21, // Convert to integer, default to 21 if not provided
};

const localBuildPath = process.env.LOCAL_BUILD_PATH || 'dist/';
const remoteFTPPath = process.env.REMOTE_FTP_PATH || '/public_html/pkg-rc';

// TODO: before run upload to ftp, i want to copy .htaccess that located same in this file to /dist

// Call function to upload to FTP
uploadToFTP(localBuildPath, remoteFTPPath, ftpConfig);
