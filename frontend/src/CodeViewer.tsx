import React, { useEffect, useState } from 'react';

interface FileContent {
  file: string;
  content: string;
}

const CodeViewer: React.FC = () => {
  const [files, setFiles] = useState<FileContent[]>([]);
  const [directoryTree, setDirectoryTree] = useState<string>('');
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await fetch(`${BACKEND_URL}/code`);
        if (!response.ok) throw new Error('Failed to fetch files');
        const data = await response.json();
        setFiles(data.files || []);
        setDirectoryTree(data.directoryTree || '');
      } catch (error) {
        console.error('Error fetching files:', error);
      }
    };

    fetchFiles();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Project Files</h1>
      {files.length > 0 ? (
        files.map((file, index) => (
          <div key={index} style={styles.fileContainer}>
            <h2 style={styles.fileTitle}># {file.file}:</h2>
            <pre style={styles.codeBlock}>
              <code>{file.content}</code>
            </pre>
            <h6>______________________________________________________________________</h6>
            <hr style={styles.separator} />
          </div>
        ))
      ) : (
        <p style={styles.noDataText}>No files available</p>
      )}

      <h1 style={styles.heading}>Project Directory</h1>
      {directoryTree ? (
        <pre style={styles.directoryTree}>{directoryTree}</pre>
      ) : (
        <p style={styles.noDataText}>No directory structure available</p>
      )}
    </div>
  );
};

// استایل‌های بهبود یافته برای نمایش بهتر و خوانایی بالاتر
const styles = {
  container: {
    padding: '20px 40px',  // افزایش فاصله از چپ و راست
    fontFamily: 'Arial, sans-serif',
    maxWidth: '900px',
    margin: '0 auto',  // مرکز چین شدن محتوا
  },
  heading: {
    color: '#333',
    borderBottom: '2px solid #ddd',
    paddingBottom: '10px',
    marginBottom: '20px',
  },
  fileContainer: {
    marginBottom: '20px',
    paddingLeft: '10px',
  },
  fileTitle: {
    color: 'green',
    marginLeft: '20px',  // اضافه کردن فاصله از چپ
    fontWeight: 'bold',
  },
  codeBlock: {
    background: '#000000',
    color: '#ffffff',  // تغییر رنگ متن برای خوانایی بهتر
    padding: '20px',
    borderRadius: '5px',
    overflowX: 'auto' as 'auto',
    textAlign: 'left' as 'left',  // اطمینان از تراز صحیح متن
    whiteSpace: 'pre-wrap',
    fontSize: '14px',
    marginLeft: '20px',  // جلوگیری از چسبیدن به چپ
  },
  separator: {
    border: '0px solid #ddd',
    margin: '10px 0',
  },
  directoryTree: {
    background: '#000000',
    color: '#ffffff',
    padding: '30px',
    borderRadius: '5px',
    whiteSpace: 'pre-wrap',
    fontSize: '14px',
    marginLeft: '10px',
  },
  noDataText: {
    fontStyle: 'italic',
    color: '#888',
  },
};

export default CodeViewer;
