// Main thread — runs in Figma's plugin sandbox with full Plugin API access
figma.showUI(__html__, { width: 300, height: 200, title: 'Robin Food Bridge' });

figma.ui.onmessage = async (msg) => {
  if (msg.type !== 'exec') return;

  const { id, code } = msg;
  let result = null;
  let error = null;

  try {
    // Execute the code with access to the full Plugin API
    // AsyncFunction allows top-level await inside the code string
    const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor;
    const fn = new AsyncFunction('figma', code);
    result = await fn(figma);

    // Serialize result (Figma nodes aren't JSON-serializable directly)
    if (result && typeof result === 'object' && result.id) {
      result = { id: result.id, name: result.name, type: result.type };
    } else if (Array.isArray(result)) {
      result = result.map((r) =>
        r && typeof r === 'object' && r.id ? { id: r.id, name: r.name, type: r.type } : r
      );
    }
  } catch (e) {
    error = e.message || String(e);
  }

  figma.ui.postMessage({ type: 'result', id, result, error });
};
