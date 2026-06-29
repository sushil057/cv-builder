import { SubLabel, AddButton } from './FormComponents';

export function BulletEditor({ bullets, onChange }) {
  return (
    <>
      <SubLabel>Bullet Points</SubLabel>
      {bullets.map((b, i) => (
        <div key={i} className="bullet-row">
          <input type="text" value={b} onChange={(e) => {
            const next = [...bullets];
            next[i] = e.target.value;
            onChange(next);
          }} />
          <button type="button" className="btn-del-bullet" onClick={() => onChange(bullets.filter((_, j) => j !== i))}>×</button>
        </div>
      ))}
      <AddButton onClick={() => onChange([...bullets, ''])}>+ Add Bullet</AddButton>
    </>
  );
}
