import { useCV } from '../../context/CVContext';
import { exportPdf } from '../../utils/exportPdf';
import EditorSections from './EditorSections';

export default function Editor() {
  const { activeCv, saveStatus, updateActive } = useCV();

  return (
    <section id="editor">
      <div id="editor-header">
        <div className="editor-header-left">
          <span id="editor-title">{activeCv.name || 'Edit CV'}</span>
          <span className={`save-status${saveStatus === 'saved' ? ' saved' : ''}`}>
            {saveStatus === 'saved' ? 'Saved' : 'Saving…'}
          </span>
        </div>
        <button type="button" id="btn-export-pdf" onClick={() => exportPdf(activeCv)}>
          Export PDF
        </button>
      </div>
      <div id="editor-body" key={activeCv.id}>
        <EditorSections cv={activeCv} onUpdate={updateActive} />
      </div>
    </section>
  );
}
