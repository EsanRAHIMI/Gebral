// /Users/ehsanrahimi/Gabrel/app/frontend/src/CodeViewer.tsx
import React, { useEffect, useState } from "react";

interface FileContent {
  file: string;
  content: string;
}

const CodeViewer: React.FC = () => {
  const [files, setFiles] = useState<FileContent[]>([]);
  const [directoryTree, setDirectoryTree] = useState<string>("");
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 5000);

        const response = await fetch(`${BACKEND_URL}/code`, {
          signal: controller.signal,
        });
        clearTimeout(timeout);

        if (!response.ok) throw new Error("Failed to fetch files");

        const data = await response.json();
        setFiles(data.files || []);
        setDirectoryTree(data.directoryTree || "");
      } catch (error) {
        console.error("Error fetching files:", error);
        setFiles([]);
        setDirectoryTree("Error: Could not load directory structure");
      }
    };

    fetchFiles();
  }, []);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Project Directory</h1>
      {directoryTree ? (
        <pre style={styles.directoryTree}>{directoryTree}</pre>
      ) : (
        <p style={{ ...styles.noDataText, color: "red" }}>
          Failed to load project directory structure.
        </p>
      )}
      <h1 style={styles.heading}>Project Files</h1>
      {files.length > 0 ? (
        files.map((file, index) => (
          <div key={index} style={styles.fileContainer}>
            <p>------------------------------------------------------------</p>
            <h2 style={styles.fileTitle}># {file.file}:</h2>
            <pre style={styles.codeBlock}>
              <code>
                {file.content.includes("Error:") ? (
                  <span style={{ color: "red" }}>{file.content}</span>
                ) : (
                  file.content
                )}
              </code>
            </pre>
            <hr style={styles.separator} />
          </div>
        ))
      ) : (
        <p style={styles.noDataText}>No files available</p>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px 40px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
  },
  heading: {
    color: "#333",
    borderBottom: "2px solid #ddd",
    paddingBottom: "1px",
    marginBottom: "1px",
  },
  fileContainer: {
    marginBottom: "20px",
    paddingLeft: "20px",
  },
  fileTitle: {
    color: "green",
    marginLeft: "1px",
    fontSize: "20px",
    fontWeight: "bold",
  },
  codeBlock: {
    background: "#000000",
    color: "#ffffff",
    padding: "20px",
    borderRadius: "5px",
    overflowX: "auto" as "auto",
    textAlign: "left" as "left",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
    marginLeft: "10px",
  },
  separator: {
    border: "0px solid #ddd",
    margin: "0px 0",
  },
  directoryTree: {
    background: "#000000",
    color: "#ffffff",
    padding: "30px",
    borderRadius: "50px",
    whiteSpace: "pre-wrap",
    fontSize: "14px",
    marginLeft: "40px",
  },
  noDataText: {
    fontStyle: "italic",
    color: "#888",
  },
};

export default CodeViewer;
