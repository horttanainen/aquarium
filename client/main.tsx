import { useState } from 'react';
import { createRoot } from 'react-dom/client';

function Counter() {
  const [count, setCount] = useState(0);
  return (
    <>
      <h1>{count}</h1>
      <button onClick={() => setCount(count + 1)}>
        Increment
      </button>
    </>
  );
}

const rootElement = document.getElementById('root')

if (!rootElement) {
  throw new Error("Could not find #root")
}

const root = createRoot(rootElement);
root.render(<Counter />);
