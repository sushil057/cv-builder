import { CVProvider, useCV } from './context/CVContext';
import Sidebar from './components/Sidebar';
import Editor from './components/editor/Editor';
import CVDocument from './components/CVDocument';

function Preview() {
  const { activeCv } = useCV();
  return (
    <main id="preview-wrap">
      <div id="preview-toolbar">
        <span id="preview-label">Live Preview</span>
        <span id="preview-hint">800 px · A4 · Auto-saved locally</span>
      </div>
      <div id="cv-preview">
        <CVDocument cv={activeCv} />
      </div>
    </main>
  );
}

export default function App() {
  return (
    <CVProvider>
      <div id="app">
        <Sidebar />
        <Editor />
        <Preview />
      </div>
    </CVProvider>
  );
}
