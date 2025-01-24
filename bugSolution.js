The solution involves using the return value of `useEffect` to implement a cleanup function.  This cleanup function is responsible for canceling the asynchronous operation (in this case, an AbortController) when the component is unmounted.  This prevents the fetch from continuing unnecessarily and avoids memory leaks.

```javascript
import React, { useState, useEffect } from 'react';

const MyComponent = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const controller = new AbortController();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://api.example.com/data', { signal: controller.signal });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const jsonData = await response.json();
        setData(jsonData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);

  // ... rest of component
};

```