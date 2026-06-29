import { uid } from '../../utils/helpers';
import { useCvPatch } from '../../hooks/useCvPatch';
import {
  FieldGroup,
  TextareaField,
  SubLabel,
  AddButton,
  CollapsibleBlock,
  SectionBlock,
  EntryCard,
  InlineFields,
  PhotoUpload,
} from './FormComponents';
import { BulletEditor } from './BulletEditor';
import { SkillEditor } from './SkillEditor';

const LANG_KEYS = ['lang', 'listen', 'read', 'spoken', 'interact', 'write'];
const DIGITAL_LEVELS = ['BASIC', 'INTERMEDIATE', 'ADVANCED'];

export default function EditorSections({ cv, onUpdate }) {
  const { patch, toggle, updateInList, removeFromList, appendToList } = useCvPatch(cv, onUpdate);

  return (
    <>
      <FieldGroup label="CV Label (Sidebar Name)" value={cv.name} onChange={(v) => patch({ name: v })} />

      <CollapsibleBlock icon="📷" title="Photo">
        <PhotoUpload
          onUpload={(photo) => patch({ photo })}
          onRemove={() => patch({ photo: '' })}
        />
      </CollapsibleBlock>

      <CollapsibleBlock icon="👤" title="Personal Information">
        <FieldGroup label="Passport Number" value={cv.passportNumber} onChange={(v) => patch({ passportNumber: v })} />
        <FieldGroup label="Full Name" value={cv.fullName} onChange={(v) => patch({ fullName: v })} />
        <InlineFields>
          <FieldGroup label="Date of Birth" value={cv.dob} onChange={(v) => patch({ dob: v })} />
          <FieldGroup label="Gender" value={cv.gender} onChange={(v) => patch({ gender: v })} />
        </InlineFields>
        <FieldGroup label="Nationality" value={cv.nationality} onChange={(v) => patch({ nationality: v })} />
        <FieldGroup label="Phone Number" value={cv.phone} onChange={(v) => patch({ phone: v })} />
        <FieldGroup label="Email Address" value={cv.email} type="email" onChange={(v) => patch({ email: v })} />
        <FieldGroup label="Address" value={cv.address} onChange={(v) => patch({ address: v })} />

        <hr className="form-divider" />
        <SubLabel>Additional Personal Details</SubLabel>
        {cv.customFields.map((cf, i) => (
          <div key={cf.id} className="custom-field-row">
            <input
              type="text"
              value={cf.label}
              placeholder="Label"
              onChange={(e) => updateInList('customFields', i, { label: e.target.value })}
            />
            <input
              type="text"
              value={cf.value}
              placeholder="Value"
              onChange={(e) => updateInList('customFields', i, { value: e.target.value })}
            />
            <button type="button" className="btn-del-bullet" onClick={() => removeFromList('customFields', i)}>
              ×
            </button>
          </div>
        ))}
        <AddButton onClick={() => appendToList('customFields', { id: uid(), label: '', value: '' })}>
          + Add Custom Field
        </AddButton>
      </CollapsibleBlock>

      <SectionBlock icon="📝" title="About Me" visible={cv.showAbout} onToggleVisible={() => toggle('showAbout')}>
        <TextareaField label="About text" value={cv.about} onChange={(v) => patch({ about: v })} />
      </SectionBlock>

      <SectionBlock icon="🎓" title="Education & Training" visible={cv.showEducation} onToggleVisible={() => toggle('showEducation')}>
        {cv.education.map((edu, i) => (
          <EntryCard key={edu.id} title={`Education ${i + 1}`} onDelete={() => removeFromList('education', i, 'Remove this education entry?')}>
            <InlineFields>
              <FieldGroup label="Dates" value={edu.dates} onChange={(v) => updateInList('education', i, { dates: v })} />
              <FieldGroup label="Location" value={edu.location} onChange={(v) => updateInList('education', i, { location: v })} />
            </InlineFields>
            <FieldGroup label="Degree / Qualification" value={edu.degree} onChange={(v) => updateInList('education', i, { degree: v })} />
            <FieldGroup label="Institution / School" value={edu.institution} onChange={(v) => updateInList('education', i, { institution: v })} />
            <InlineFields>
              <FieldGroup label="Field of Study" value={edu.field} onChange={(v) => updateInList('education', i, { field: v })} />
              <FieldGroup label="EQF Level" value={edu.eqf} onChange={(v) => updateInList('education', i, { eqf: v })} />
            </InlineFields>
            <BulletEditor bullets={edu.bullets} onChange={(bullets) => updateInList('education', i, { bullets })} />
          </EntryCard>
        ))}
        <AddButton onClick={() => appendToList('education', { id: uid(), dates: '', location: '', degree: '', institution: '', field: '', eqf: '', bullets: [] })}>
          + Add Education Entry
        </AddButton>
      </SectionBlock>

      <SectionBlock icon="💼" title="Work Experience" visible={cv.showWork} onToggleVisible={() => toggle('showWork')}>
        {cv.work.map((job, i) => (
          <EntryCard key={job.id} title={`Job ${i + 1}`} onDelete={() => removeFromList('work', i, 'Remove this job?')}>
            <InlineFields>
              <FieldGroup label="Job Title" value={job.title} onChange={(v) => updateInList('work', i, { title: v })} />
              <FieldGroup label="Company" value={job.company} onChange={(v) => updateInList('work', i, { company: v })} />
            </InlineFields>
            <InlineFields>
              <FieldGroup label="Dates" value={job.dates} onChange={(v) => updateInList('work', i, { dates: v })} />
              <FieldGroup label="Location" value={job.location} onChange={(v) => updateInList('work', i, { location: v })} />
            </InlineFields>
            <BulletEditor bullets={job.bullets} onChange={(bullets) => updateInList('work', i, { bullets })} />
          </EntryCard>
        ))}
        <AddButton onClick={() => appendToList('work', { id: uid(), title: '', company: '', dates: '', location: '', bullets: [] })}>
          + Add Job Entry
        </AddButton>
      </SectionBlock>

      <SectionBlock icon="⚙️" title="Skills" visible={cv.showSkills} onToggleVisible={() => toggle('showSkills')}>
        <SkillEditor label="Technical Skills" skills={cv.techSkills} onChange={(techSkills) => patch({ techSkills })} />
        <SkillEditor label="Interpersonal Skills" skills={cv.interpSkills} onChange={(interpSkills) => patch({ interpSkills })} />
      </SectionBlock>

      <SectionBlock icon="💻" title="Digital Skills" visible={cv.showDigital} onToggleVisible={() => toggle('showDigital')}>
        {cv.digital.map((d, i) => (
          <div key={d.id} className="digital-row">
            <input type="text" value={d.label} placeholder="Skill name" onChange={(e) => updateInList('digital', i, { label: e.target.value })} />
            <select value={d.level} onChange={(e) => updateInList('digital', i, { level: e.target.value })}>
              {DIGITAL_LEVELS.map((l) => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <input type="text" value={d.score} placeholder="Score" onChange={(e) => updateInList('digital', i, { score: e.target.value })} />
            <button type="button" className="btn-del-bullet" onClick={() => removeFromList('digital', i, 'Remove this digital skill?')}>×</button>
          </div>
        ))}
        <AddButton onClick={() => appendToList('digital', { id: uid(), icon: '🖥', label: '', level: 'ADVANCED', score: 'Level 6 / 6' })}>
          + Add Digital Skill
        </AddButton>
      </SectionBlock>

      <SectionBlock icon="🌐" title="Language Skills" visible={cv.showLanguage} onToggleVisible={() => toggle('showLanguage')}>
        <FieldGroup label="Mother Tongue(s)" value={cv.motherTongue} onChange={(v) => patch({ motherTongue: v })} />
        <div className="lang-grid-hdr">
          {['Language', 'Listen', 'Read', 'Spoken', 'Interact', 'Write', ''].map((t) => (
            <span key={t || 'del'}>{t}</span>
          ))}
        </div>
        {cv.languages.map((lang, i) => (
          <div key={lang.id} className="lang-grid-row">
            {LANG_KEYS.map((k) => (
              <input
                key={k}
                type="text"
                value={lang[k] || ''}
                placeholder={k}
                onChange={(e) => updateInList('languages', i, { [k]: e.target.value })}
              />
            ))}
            <button type="button" className="btn-del-lang" onClick={() => removeFromList('languages', i, 'Remove this language?')}>×</button>
          </div>
        ))}
        <AddButton onClick={() => appendToList('languages', { id: uid(), lang: '', listen: '', read: '', spoken: '', interact: '', write: '' })}>
          + Add Language
        </AddButton>
      </SectionBlock>

      <SectionBlock icon="🚗" title="Driving Licence" visible={cv.showDriving} onToggleVisible={() => toggle('showDriving')}>
        <FieldGroup label="Licence Category (e.g. A, B, C)" value={cv.driving} onChange={(v) => patch({ driving: v })} />
      </SectionBlock>

      <SectionBlock icon="🤝" title="Volunteering" visible={cv.showVolunteering} onToggleVisible={() => toggle('showVolunteering')}>
        {cv.volunteering.map((vol, i) => (
          <EntryCard key={vol.id} title={`Volunteering ${i + 1}`} onDelete={() => removeFromList('volunteering', i, 'Remove this entry?')}>
            <InlineFields>
              <FieldGroup label="Dates" value={vol.dates} onChange={(v) => updateInList('volunteering', i, { dates: v })} />
              <FieldGroup label="Location" value={vol.location} onChange={(v) => updateInList('volunteering', i, { location: v })} />
            </InlineFields>
            <FieldGroup label="Title / Role" value={vol.title} onChange={(v) => updateInList('volunteering', i, { title: v })} />
            <TextareaField label="Description" value={vol.desc} onChange={(v) => updateInList('volunteering', i, { desc: v })} />
          </EntryCard>
        ))}
        <AddButton onClick={() => appendToList('volunteering', { id: uid(), dates: '', location: '', title: '', desc: '' })}>
          + Add Volunteering Entry
        </AddButton>
      </SectionBlock>
    </>
  );
}
