import React, { useState, useEffect } from "react";

const PDFViewer: React.FC<{ file: File }> = ({ file }) => {
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setFileUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  if (!fileUrl) {
    return <div>Loading...</div>;
  }

  return (
    <div className="h-full w-max flex flex-col items-center justify-center">
      <iframe src={fileUrl} className="w-full h-full" title="PDF Preview" />
    </div>
  );
};

export default PDFViewer;
