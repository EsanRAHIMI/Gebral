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
    fetch(`${BACKEND_URL}/code`)
      .then(response => response.json())
      .then(data => {
        setFiles(data.files);
        setDirectoryTree(data.directoryTree);
      })
      .catch(error => console.error('Error fetching files:', error));
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Project Files</h1>
      {files.map((file, index) => (
        <div key={index} style={{ marginBottom: '20px' }}>
          <h2 style={{ color: 'white' }}>{file.file}</h2>
          <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px', overflowX: 'auto' }}>
            <code>{file.content}</code>
          </pre>
        </div>
      ))}

      <h1>Project Directory</h1>
      <pre style={{ background: '#f4f4f4', padding: '10px', borderRadius: '5px', whiteSpace: 'pre-wrap' }}>
        {directoryTree}
      </pre>
    </div>
  );
};

export default CodeViewer;
