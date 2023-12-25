import React, { useState, useEffect } from 'react';

const useLazyImageLoader = (dataSrc, initialSrc) => {
  const [src, setSrc] = useState(initialSrc);

  useEffect(() => {
    const img = new Image();
    img.onload = () => setSrc(dataSrc);
    img.src = dataSrc;
  }, [dataSrc]);

  return src;
};

export default useLazyImageLoader;
