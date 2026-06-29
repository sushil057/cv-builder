import { useState } from 'react';

export function FieldGroup({ label, value, onChange, type = 'text' }) {
  return (
    <div className="field-group">
      <label>{label}</label>
      <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function TextareaField({ label, value, onChange }) {
  return (
    <div className="field-group">
      <label>{label}</label>
      <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function SubLabel({ children }) {
  return <div className="sub-label">{children}</div>;
}

export function AddButton({ children, onClick }) {
  return (
    <button type="button" className="btn-add-entry" onClick={onClick}>
      {children}
    </button>
  );
}

export function InlineFields({ children }) {
  return <div className="inline-2">{children}</div>;
}

export function PhotoUpload({ onUpload, onRemove }) {
  const handleChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (r) => onUpload(r.target.result);
    reader.readAsDataURL(file);
  };

  return (
    <div className="field-group">
      <label>Upload Photo</label>
      <div className="photo-row">
        <input type="file" accept="image/*" onChange={handleChange} />
        <button type="button" className="btn-remove-photo" onClick={onRemove}>
          Remove
        </button>
      </div>
    </div>
  );
}

export function CollapsibleBlock({ icon, title, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="section-block">
      <div className="section-block-hdr" onClick={() => setOpen(!open)}>
        <div className="section-block-hdr-left">
          <span className="section-block-icon">{icon}</span>
          <span className="section-block-label">{title}</span>
        </div>
        <span className="collapse-arrow" style={{ transform: open ? '' : 'rotate(-90deg)' }}>
          ▾
        </span>
      </div>
      {open && <div className="section-block-body open">{children}</div>}
    </div>
  );
}

export function SectionBlock({ icon, title, visible, onToggleVisible, children }) {
  const [open, setOpen] = useState(true);

  return (
    <div className="section-block">
      <div className="section-block-hdr" onClick={() => setOpen(!open)}>
        <div className="section-block-hdr-left">
          <span className="section-block-icon">{icon}</span>
          <span className="section-block-label">{title}</span>
        </div>
        <div className="section-block-hdr-right">
          <button
            type="button"
            className={`btn-toggle-vis ${visible ? 'on' : 'off'}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleVisible();
            }}
          >
            {visible ? '● In CV' : '○ Hidden'}
          </button>
          <span className="collapse-arrow" style={{ transform: open ? '' : 'rotate(-90deg)' }}>
            ▾
          </span>
        </div>
      </div>
      {open && <div className="section-block-body open">{children}</div>}
    </div>
  );
}

export function EntryCard({ title, onDelete, children }) {
  return (
    <div className="entry-card">
      <div className="entry-card-hdr">
        <span className="entry-card-title">{title}</span>
        <button type="button" className="btn-del-entry" onClick={onDelete}>
          Remove
        </button>
      </div>
      {children}
    </div>
  );
}
