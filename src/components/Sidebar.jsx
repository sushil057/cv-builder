import { useState, useEffect } from 'react';
import { useCV } from '../context/CVContext';

function CVItem({ cv, active, onSelect, onDelete, onRename }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(cv.name);

  useEffect(() => setDraft(cv.name), [cv.name]);

  const commit = () => {
    setEditing(false);
    onRename(draft.trim() || 'Untitled CV');
  };

  if (editing) {
    return (
      <div className={`cv-item${active ? ' active' : ''}`}>
        <input
          className="cv-item-input"
          value={draft}
          autoFocus
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') {
              setDraft(cv.name);
              setEditing(false);
            }
          }}
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    );
  }

  return (
    <div className={`cv-item${active ? ' active' : ''}`} onClick={onSelect}>
      <span
        className="cv-item-name"
        title="Double-click to rename"
        onDoubleClick={(e) => {
          e.stopPropagation();
          setEditing(true);
        }}
      >
        {cv.name || 'Untitled CV'}
      </span>
      <button
        type="button"
        className="cv-item-del"
        title="Delete this CV"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        ×
      </button>
    </div>
  );
}

export default function Sidebar() {
  const { cvList, activeId, selectCv, deleteCv, updateCv, addCv } = useCV();

  return (
    <aside id="sidebar">
      <div id="sidebar-header">
        <div id="sidebar-logo">EP</div>
        <div>
          <div id="sidebar-title">CV Builder</div>
          <div id="sidebar-sub">Europass Format</div>
        </div>
      </div>
      <div id="cv-list">
        {cvList.map((cv) => (
          <CVItem
            key={cv.id}
            cv={cv}
            active={cv.id === activeId}
            onSelect={() => selectCv(cv.id)}
            onDelete={() => deleteCv(cv.id)}
            onRename={(name) => updateCv(cv.id, { name })}
          />
        ))}
      </div>
      <button type="button" id="btn-new-cv" onClick={addCv}>
        + New CV
      </button>
    </aside>
  );
}
