import { useState } from 'react';

export function SkillEditor({ label, skills, onChange }) {
  const [input, setInput] = useState('');

  const add = () => {
    const v = input.trim();
    if (!v) return;
    onChange([...skills, v]);
    setInput('');
  };

  return (
    <div className="field-group">
      <label>{label}</label>
      <div className="skill-chip-area">
        {skills.map((s, i) => (
          <div key={i} className="skill-chip">
            {s}
            <button type="button" onClick={() => onChange(skills.filter((_, j) => j !== i))}>×</button>
          </div>
        ))}
      </div>
      <div className="skill-input-row">
        <input
          type="text"
          placeholder="Type and press Add or Enter"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); add(); } }}
        />
        <button type="button" onClick={add}>Add</button>
      </div>
    </div>
  );
}
