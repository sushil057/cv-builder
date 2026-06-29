'use strict';

// ══════════════════════════════════════════════════════════════
//  HELPERS
// ══════════════════════════════════════════════════════════════

const esc = s => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const uid = () => '_' + Math.random().toString(36).slice(2, 9);

// ══════════════════════════════════════════════════════════════
//  DATA MODEL
// ══════════════════════════════════════════════════════════════

const blankCV = () => ({
  id: uid(),
  name: 'New CV',
  photo: '',

  passportNumber: 'passport number',
  fullName: 'full name',
  dob: 'MM/DD/YYYY',
  nationality: 'Nepalses',
  gender: 'gender',
  phone: '(country code) number (Mobile/Work/Office)',
  email: 'someone@example.com',
  address: 'same as in passport/ID',
  customFields: [],       // [{id, label, value}]

  showAbout: false,
  showEducation: true,
  showWork: true,
  showSkills: true,
  showDigital: true,
  showLanguage: true,
  showDriving: true,
  showVolunteering: false,

  about: '',
  education: [],
  work: [],
  techSkills: [],
  interpSkills: [],
  digital: [],
  motherTongue: '',
  languages: [],
  driving: '',
  volunteering: [],
});

const sampleCV = () => Object.assign(blankCV(), {
  passportNumber: 'your passport/ID number',
  name: 'Name your CV',
  fullName: 'full name',
  dob: '02/06/2000',
  nationality: 'Nepalese',
  gender: 'Male',
  phone: '(country code) number (Mobile/Home/work)',
  email: 'someone@example.com',
  address: 'address same as in passport',
  customFields: [],

  showAbout: false,

  education: [
    {
      id: uid(), dates: '2017 – 2019', location: 'Kathmandu, Nepal',
      degree: 'INTERMEDIATE', institution: 'Capital College and Research Center',
      field: 'Science', eqf: 'EQF level 4', bullets: []
    },
    {
      id: uid(), dates: '2021 – 2025', location: 'Pokhara, Nepal',
      degree: 'BACHELORS DEGREE', institution: 'Infomax College of IT and Management',
      field: '', eqf: 'EQF level 6',
      bullets: ['Technical Education', 'Programming', 'Networking', 'Management', 'Communication']
    },
  ],

  work: [{
    id: uid(), title: 'QA ENGINEER', company: 'YARSA LABS',
    dates: 'Current', location: 'POKHARA, NEPAL',
    bullets: [
      'Review Requirements: Analyze project goals to ensure features are clear and testable.',
      'Design Test Plans: Create detailed strategies and cases to guide testing activities.',
      'Execute Tests: Perform manual and automated tests to verify software functionality.',
      'Report Bugs: Document issues clearly with steps to reproduce and track them to resolution.',
      'Verify Fixes: Retest features after developer corrections to ensure the original bug is gone.',
      'Collaborate: Work closely with developers and stakeholders to improve overall product quality.',
      'Handle Testing Team: Assign tasks to the team and get feedback on the assigned tasks.',
    ],
  }],

  techSkills: ['Google Docs', 'JavaScript', 'K6', 'Grafana', 'Jest/testing-library', 'Google Play Console', 'Firebase Basics', 'Excel Sheets'],
  interpSkills: ['Organizational and planning skills', 'Team-work oriented', 'Verbal and Written Communication', 'Team work and Leadership', 'Critical thinking and Analysis'],

  digital: [
    { id: uid(), icon: '🖥', label: 'Information and data literacy', level: 'ADVANCED', score: 'Level 6 / 6' },
    { id: uid(), icon: '👥', label: 'Communication and collaboration', level: 'ADVANCED', score: 'Level 6 / 6' },
    { id: uid(), icon: '🎨', label: 'Digital content creation', level: 'ADVANCED', score: 'Level 6 / 6' },
    { id: uid(), icon: '🔒', label: 'Safety', level: 'ADVANCED', score: 'Level 6 / 6' },
    { id: uid(), icon: '🧩', label: 'Problem solving', level: 'ADVANCED', score: 'Level 6 / 6' },
  ],

  motherTongue: 'NEPALI',
  languages: [
    { id: uid(), lang: 'HINDI', listen: 'C2', read: 'C1', spoken: 'B2', interact: 'B2', write: 'B2' },
    { id: uid(), lang: 'ENGLISH', listen: 'C2', read: 'C2', spoken: 'B1', interact: 'B2', write: 'B2' },
  ],

  driving: 'A',
  volunteering: [],
});

// ══════════════════════════════════════════════════════════════
//  STATE
// ══════════════════════════════════════════════════════════════

let cvList = JSON.parse(localStorage.getItem('ep_cvs') || 'null') || [sampleCV()];
let activeId = cvList[0].id;

// Migrate old CVs that may lack customFields
cvList.forEach(cv => { if (!cv.customFields) cv.customFields = []; });

const save = () => localStorage.setItem('ep_cvs', JSON.stringify(cvList));
const getActive = () => cvList.find(c => c.id === activeId);

// ══════════════════════════════════════════════════════════════
//  SIDEBAR
// ══════════════════════════════════════════════════════════════

function renderSidebar() {
  const list = document.getElementById('cv-list');
  list.innerHTML = '';

  cvList.forEach(cv => {
    const item = document.createElement('div');
    item.className = 'cv-item' + (cv.id === activeId ? ' active' : '');

    const nameSpan = document.createElement('span');
    nameSpan.className = 'cv-item-name';
    nameSpan.textContent = cv.name || 'Untitled';
    nameSpan.title = 'Double-click to rename';

    // ── Rename on double-click ──
    nameSpan.addEventListener('dblclick', e => {
      e.stopPropagation();
      nameSpan.contentEditable = 'true';
      nameSpan.classList.add('editing');
      nameSpan.focus();
      // select all text
      const range = document.createRange();
      range.selectNodeContents(nameSpan);
      window.getSelection().removeAllRanges();
      window.getSelection().addRange(range);
    });

    const commitRename = () => {
      nameSpan.contentEditable = 'false';
      nameSpan.classList.remove('editing');
      const newName = nameSpan.textContent.trim() || 'Untitled';
      cv.name = newName;
      nameSpan.textContent = newName;
      if (cv.id === activeId) {
        document.getElementById('editor-title').textContent = newName;
      }
      save();
    };

    nameSpan.addEventListener('blur', commitRename);
    nameSpan.addEventListener('keydown', e => {
      if (e.key === 'Enter') { e.preventDefault(); nameSpan.blur(); }
      if (e.key === 'Escape') { nameSpan.textContent = cv.name; nameSpan.blur(); }
    });

    const delBtn = document.createElement('button');
    delBtn.className = 'cv-item-del';
    delBtn.title = 'Delete this CV';
    delBtn.textContent = '×';
    delBtn.addEventListener('click', e => {
      e.stopPropagation();
      if (cvList.length === 1) { alert('You need at least one CV.'); return; }
      if (!confirm(`Delete "${cv.name}"?\nThis cannot be undone.`)) return;
      cvList = cvList.filter(c => c.id !== cv.id);
      activeId = cvList[0].id;
      save();
      renderAll();
    });

    item.appendChild(nameSpan);
    item.appendChild(delBtn);
    item.addEventListener('click', () => { activeId = cv.id; renderAll(); });
    list.appendChild(item);
  });
}

// ══════════════════════════════════════════════════════════════
//  EDITOR FIELD FACTORIES
// ══════════════════════════════════════════════════════════════

function mkField(label, value, onChange, type = 'text') {
  const g = document.createElement('div');
  g.className = 'field-group';
  const lbl = document.createElement('label');
  lbl.textContent = label;
  const inp = document.createElement('input');
  inp.type = type;
  inp.value = value || '';
  inp.addEventListener('input', e => onChange(e.target.value));
  g.appendChild(lbl);
  g.appendChild(inp);
  return g;
}

function mkTextarea(label, value, onChange) {
  const g = document.createElement('div');
  g.className = 'field-group';
  const lbl = document.createElement('label');
  lbl.textContent = label;
  const ta = document.createElement('textarea');
  ta.value = value || '';
  ta.addEventListener('input', e => onChange(e.target.value));
  g.appendChild(lbl);
  g.appendChild(ta);
  return g;
}

function mkSubLabel(text) {
  const d = document.createElement('div');
  d.className = 'sub-label';
  d.textContent = text;
  return d;
}

function mkAddBtn(text, onClick) {
  const b = document.createElement('button');
  b.className = 'btn-add-entry';
  b.textContent = text;
  b.addEventListener('click', onClick);
  return b;
}

// ── Collapsible block (no CV visibility toggle) ──
function mkBlock(parent, icon, title, open, buildFn) {
  const wrap = document.createElement('div');
  wrap.className = 'section-block';

  const hdr = document.createElement('div');
  hdr.className = 'section-block-hdr';

  const left = document.createElement('div');
  left.className = 'section-block-hdr-left';
  left.innerHTML = `<span class="section-block-icon">${icon}</span><span class="section-block-label">${title}</span>`;

  const arrow = document.createElement('span');
  arrow.className = 'collapse-arrow';
  arrow.textContent = '▾';

  hdr.appendChild(left);
  hdr.appendChild(arrow);

  const body = document.createElement('div');
  body.className = 'section-block-body' + (open ? ' open' : '');
  buildFn(body);

  wrap.appendChild(hdr);
  wrap.appendChild(body);

  hdr.addEventListener('click', () => {
    const isOpen = body.classList.toggle('open');
    arrow.style.transform = isOpen ? '' : 'rotate(-90deg)';
  });

  parent.appendChild(wrap);
}

// ── Collapsible block WITH CV section visibility toggle ──
function mkSectionBlock(parent, cv, icon, title, visKey, buildFn) {
  const wrap = document.createElement('div');
  wrap.className = 'section-block';

  const hdr = document.createElement('div');
  hdr.className = 'section-block-hdr';

  const left = document.createElement('div');
  left.className = 'section-block-hdr-left';
  left.innerHTML = `<span class="section-block-icon">${icon}</span><span class="section-block-label">${title}</span>`;

  const right = document.createElement('div');
  right.className = 'section-block-hdr-right';

  const visBtn = document.createElement('button');
  visBtn.className = 'btn-toggle-vis ' + (cv[visKey] ? 'on' : 'off');
  visBtn.textContent = cv[visKey] ? '● In CV' : '○ Hidden';

  const arrow = document.createElement('span');
  arrow.className = 'collapse-arrow';
  arrow.textContent = '▾';

  right.appendChild(visBtn);
  right.appendChild(arrow);
  hdr.appendChild(left);
  hdr.appendChild(right);

  const body = document.createElement('div');
  body.className = 'section-block-body open';
  buildFn(body);

  wrap.appendChild(hdr);
  wrap.appendChild(body);

  visBtn.addEventListener('click', e => {
    e.stopPropagation();
    cv[visKey] = !cv[visKey];
    visBtn.className = 'btn-toggle-vis ' + (cv[visKey] ? 'on' : 'off');
    visBtn.textContent = cv[visKey] ? '● In CV' : '○ Hidden';
    renderPreview(cv);
    save();
  });

  hdr.addEventListener('click', () => {
    const isOpen = body.classList.toggle('open');
    arrow.style.transform = isOpen ? '' : 'rotate(-90deg)';
  });

  parent.appendChild(wrap);
}

// ── Entry card ──
function mkEntryCard(label, onDelete) {
  const card = document.createElement('div');
  card.className = 'entry-card';

  const hdr = document.createElement('div');
  hdr.className = 'entry-card-hdr';

  const title = document.createElement('span');
  title.className = 'entry-card-title';
  title.textContent = label;

  const del = document.createElement('button');
  del.className = 'btn-del-entry';
  del.textContent = '🗑 Remove';
  del.addEventListener('click', onDelete);

  hdr.appendChild(title);
  hdr.appendChild(del);
  card.appendChild(hdr);
  return card;
}

// ── Bullet editor (reusable) ──
function mkBulletEditor(container, arr, cv) {
  container.appendChild(mkSubLabel('Bullet Points'));

  const refresh = () => {
    container.querySelectorAll('.bullet-row').forEach(r => r.remove());
    container.querySelectorAll('.btn-add-bullet').forEach(r => r.remove());

    arr.forEach((b, i) => {
      const row = document.createElement('div');
      row.className = 'bullet-row';
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.value = b;
      inp.addEventListener('input', e => { arr[i] = e.target.value; renderPreview(cv); save(); });
      const del = document.createElement('button');
      del.className = 'btn-del-bullet';
      del.textContent = '×';
      del.title = 'Remove bullet';
      del.addEventListener('click', () => { arr.splice(i, 1); refresh(); renderPreview(cv); save(); });
      row.appendChild(inp);
      row.appendChild(del);
      container.appendChild(row);
    });

    const addBtn = mkAddBtn('+ Add Bullet', () => { arr.push(''); refresh(); renderPreview(cv); save(); });
    addBtn.classList.add('btn-add-bullet');
    container.appendChild(addBtn);
  };

  refresh();
}

// ── Skill chips editor ──
function mkSkillEditor(label, arr, cv) {
  const wrap = document.createElement('div');
  wrap.className = 'field-group';
  const lbl = document.createElement('label');
  lbl.textContent = label;
  wrap.appendChild(lbl);

  const area = document.createElement('div');
  area.className = 'skill-chip-area';

  const redraw = () => {
    area.innerHTML = '';
    arr.forEach((s, i) => {
      const chip = document.createElement('div');
      chip.className = 'skill-chip';
      chip.innerHTML = `${esc(s)}`;
      const del = document.createElement('button');
      del.textContent = '×';
      del.title = 'Remove';
      del.addEventListener('click', () => { arr.splice(i, 1); redraw(); renderPreview(cv); save(); });
      chip.appendChild(del);
      area.appendChild(chip);
    });
  };

  redraw();
  wrap.appendChild(area);

  const row = document.createElement('div');
  row.className = 'skill-input-row';
  const inp = document.createElement('input');
  inp.type = 'text';
  inp.placeholder = 'Type and press Add or Enter';
  const btn = document.createElement('button');
  btn.textContent = 'Add';

  const doAdd = () => {
    const v = inp.value.trim();
    if (!v) return;
    arr.push(v);
    inp.value = '';
    redraw();
    renderPreview(cv);
    save();
  };

  btn.addEventListener('click', doAdd);
  inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); doAdd(); } });
  row.appendChild(inp);
  row.appendChild(btn);
  wrap.appendChild(row);
  return wrap;
}

// ══════════════════════════════════════════════════════════════
//  BUILD EDITOR
// ══════════════════════════════════════════════════════════════

function buildEditor(cv) {
  document.getElementById('editor-title').textContent = cv.name || 'Edit CV';
  const body = document.getElementById('editor-body');
  body.innerHTML = '';

  // ── CV label ──
  body.appendChild(mkField('CV Label (Sidebar Name)', cv.name, v => {
    cv.name = v;
    document.getElementById('editor-title').textContent = v || 'Edit CV';
    renderSidebar();
    save();
  }));

  // ── Photo ──
  mkBlock(body, '📷', 'Photo', true, block => {
    const g = document.createElement('div');
    g.className = 'field-group';
    const lbl = document.createElement('label');
    lbl.textContent = 'Upload Photo';
    const row = document.createElement('div');
    row.style.cssText = 'display:flex;gap:8px;align-items:center;';
    const fileInp = document.createElement('input');
    fileInp.type = 'file';
    fileInp.accept = 'image/*';
    fileInp.style.cssText = 'flex:1;font-size:11px;';
    fileInp.addEventListener('change', e => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = r => { cv.photo = r.result; renderPreview(cv); save(); };
      reader.readAsDataURL(file);
    });
    const remBtn = document.createElement('button');
    remBtn.textContent = '✕ Remove';
    remBtn.style.cssText = 'padding:5px 10px;background:#e53935;color:#fff;border:none;border-radius:4px;cursor:pointer;font-size:11px;font-weight:700;white-space:nowrap;';
    remBtn.addEventListener('click', () => { cv.photo = ''; fileInp.value = ''; renderPreview(cv); save(); });
    row.appendChild(fileInp);
    row.appendChild(remBtn);
    g.appendChild(lbl);
    g.appendChild(row);
    block.appendChild(g);
  });

  // ── Personal Info ──
  mkBlock(body, '👤', 'Personal Information', true, block => {
    const r1 = document.createElement('div'); r1.className = 'inline-2';
    block.appendChild(mkField('Passport Number', cv.passportNumber, v => { cv.passportNumber = v; renderPreview(cv); save(); }));
    r1.appendChild(mkField('Full Name', cv.fullName, v => { cv.fullName = v; renderPreview(cv); save(); }));
    block.appendChild(r1);

    const r2 = document.createElement('div'); r2.className = 'inline-2';
    r2.appendChild(mkField('Date of Birth', cv.dob, v => { cv.dob = v; renderPreview(cv); save(); }));
    r2.appendChild(mkField('Gender', cv.gender, v => { cv.gender = v; renderPreview(cv); save(); }));
    block.appendChild(r2);

    block.appendChild(mkField('Nationality', cv.nationality, v => { cv.nationality = v; renderPreview(cv); save(); }));
    block.appendChild(mkField('Phone Number', cv.phone, v => { cv.phone = v; renderPreview(cv); save(); }));
    block.appendChild(mkField('Email Address', cv.email, v => { cv.email = v; renderPreview(cv); save(); }, 'email'));
    block.appendChild(mkField('Address', cv.address, v => { cv.address = v; renderPreview(cv); save(); }));

    // ── Custom personal fields ──
    const hr = document.createElement('hr'); hr.className = 'form-divider';
    block.appendChild(hr);
    block.appendChild(mkSubLabel('Additional Personal Details'));

    const customWrap = document.createElement('div');
    customWrap.id = 'custom-fields-wrap';

    const refreshCustom = () => {
      customWrap.innerHTML = '';
      cv.customFields.forEach((cf, i) => {
        const row = document.createElement('div');
        row.className = 'custom-field-row';

        const labelInp = document.createElement('input');
        labelInp.type = 'text';
        labelInp.value = cf.label || '';
        labelInp.placeholder = 'Label (e.g. Passport)';
        labelInp.addEventListener('input', e => { cf.label = e.target.value; renderPreview(cv); save(); });

        const valInp = document.createElement('input');
        valInp.type = 'text';
        valInp.value = cf.value || '';
        valInp.placeholder = 'Value';
        valInp.addEventListener('input', e => { cf.value = e.target.value; renderPreview(cv); save(); });

        const del = document.createElement('button');
        del.className = 'btn-del-bullet';
        del.textContent = '×';
        del.title = 'Remove field';
        del.addEventListener('click', () => {
          cv.customFields.splice(i, 1);
          refreshCustom();
          renderPreview(cv);
          save();
        });

        row.appendChild(labelInp);
        row.appendChild(valInp);
        row.appendChild(del);
        customWrap.appendChild(row);
      });
    };

    refreshCustom();
    block.appendChild(customWrap);

    block.appendChild(mkAddBtn('+ Add Custom Field', () => {
      cv.customFields.push({ id: uid(), label: '', value: '' });
      refreshCustom();
      renderPreview(cv);
      save();
    }));
  });

  // ── About Me ──
  mkSectionBlock(body, cv, '📝', 'About Me', 'showAbout', block => {
    block.appendChild(mkTextarea('About text', cv.about, v => { cv.about = v; renderPreview(cv); save(); }));
  });

  // ── Education ──
  mkSectionBlock(body, cv, '🎓', 'Education & Training', 'showEducation', block => {
    const refresh = () => {
      block.querySelectorAll('.entry-card, .btn-add-edu').forEach(e => e.remove());

      cv.education.forEach((edu, i) => {
        const card = mkEntryCard('Education ' + (i + 1), () => {
          if (!confirm('Remove this education entry?')) return;
          cv.education.splice(i, 1); refresh(); renderPreview(cv); save();
        });

        const r1 = document.createElement('div'); r1.className = 'inline-2';
        r1.appendChild(mkField('Dates', edu.dates, v => { edu.dates = v; renderPreview(cv); save(); }));
        r1.appendChild(mkField('Location', edu.location, v => { edu.location = v; renderPreview(cv); save(); }));
        card.appendChild(r1);

        card.appendChild(mkField('Degree / Qualification', edu.degree, v => { edu.degree = v; renderPreview(cv); save(); }));
        card.appendChild(mkField('Institution / School', edu.institution, v => { edu.institution = v; renderPreview(cv); save(); }));

        const r2 = document.createElement('div'); r2.className = 'inline-2';
        r2.appendChild(mkField('Field of Study', edu.field, v => { edu.field = v; renderPreview(cv); save(); }));
        r2.appendChild(mkField('EQF Level', edu.eqf, v => { edu.eqf = v; renderPreview(cv); save(); }));
        card.appendChild(r2);

        mkBulletEditor(card, edu.bullets, cv);
        block.appendChild(card);
      });

      const add = mkAddBtn('+ Add Education Entry', () => {
        cv.education.push({ id: uid(), dates: '', location: '', degree: '', institution: '', field: '', eqf: '', bullets: [] });
        refresh(); renderPreview(cv); save();
      });
      add.classList.add('btn-add-edu');
      block.appendChild(add);
    };
    refresh();
  });

  // ── Work Experience ──
  mkSectionBlock(body, cv, '💼', 'Work Experience', 'showWork', block => {
    const refresh = () => {
      block.querySelectorAll('.entry-card, .btn-add-job').forEach(e => e.remove());

      cv.work.forEach((job, i) => {
        const card = mkEntryCard('Job ' + (i + 1), () => {
          if (!confirm('Remove this job?')) return;
          cv.work.splice(i, 1); refresh(); renderPreview(cv); save();
        });

        const r1 = document.createElement('div'); r1.className = 'inline-2';
        r1.appendChild(mkField('Job Title', job.title, v => { job.title = v; renderPreview(cv); save(); }));
        r1.appendChild(mkField('Company', job.company, v => { job.company = v; renderPreview(cv); save(); }));
        card.appendChild(r1);

        const r2 = document.createElement('div'); r2.className = 'inline-2';
        r2.appendChild(mkField('Dates', job.dates, v => { job.dates = v; renderPreview(cv); save(); }));
        r2.appendChild(mkField('Location', job.location, v => { job.location = v; renderPreview(cv); save(); }));
        card.appendChild(r2);

        mkBulletEditor(card, job.bullets, cv);
        block.appendChild(card);
      });

      const add = mkAddBtn('+ Add Job Entry', () => {
        cv.work.push({ id: uid(), title: '', company: '', dates: '', location: '', bullets: [] });
        refresh(); renderPreview(cv); save();
      });
      add.classList.add('btn-add-job');
      block.appendChild(add);
    };
    refresh();
  });

  // ── Skills ──
  mkSectionBlock(body, cv, '⚙️', 'Skills', 'showSkills', block => {
    block.appendChild(mkSkillEditor('Technical Skills', cv.techSkills, cv));
    block.appendChild(mkSkillEditor('Interpersonal Skills', cv.interpSkills, cv));
  });

  // ── Digital Skills ──
  mkSectionBlock(body, cv, '💻', 'Digital Skills', 'showDigital', block => {
    const refresh = () => {
      block.querySelectorAll('.digital-row, .btn-add-digital').forEach(r => r.remove());

      cv.digital.forEach((d, i) => {
        const row = document.createElement('div');
        row.className = 'digital-row';

        const labelInp = document.createElement('input');
        labelInp.type = 'text'; labelInp.value = d.label; labelInp.placeholder = 'Skill name';
        labelInp.addEventListener('input', e => { d.label = e.target.value; renderPreview(cv); save(); });

        const sel = document.createElement('select');
        ['BASIC', 'INTERMEDIATE', 'ADVANCED'].forEach(l => {
          const o = document.createElement('option'); o.value = l; o.textContent = l;
          if (d.level === l) o.selected = true;
          sel.appendChild(o);
        });
        sel.addEventListener('change', e => { d.level = e.target.value; renderPreview(cv); save(); });

        const scoreInp = document.createElement('input');
        scoreInp.type = 'text'; scoreInp.value = d.score; scoreInp.placeholder = 'Score';
        scoreInp.addEventListener('input', e => { d.score = e.target.value; renderPreview(cv); save(); });

        const del = document.createElement('button');
        del.className = 'btn-del-bullet'; del.textContent = '×'; del.title = 'Remove';
        del.addEventListener('click', () => {
          if (!confirm('Remove this digital skill?')) return;
          cv.digital.splice(i, 1); refresh(); renderPreview(cv); save();
        });

        row.appendChild(labelInp); row.appendChild(sel); row.appendChild(scoreInp); row.appendChild(del);
        block.appendChild(row);
      });

      const add = mkAddBtn('+ Add Digital Skill', () => {
        cv.digital.push({ id: uid(), icon: '🖥', label: '', level: 'ADVANCED', score: 'Level 6 / 6' });
        refresh(); renderPreview(cv); save();
      });
      add.classList.add('btn-add-digital');
      block.appendChild(add);
    };
    refresh();
  });

  // ── Language Skills ──
  mkSectionBlock(body, cv, '🌐', 'Language Skills', 'showLanguage', block => {
    block.appendChild(mkField('Mother Tongue(s)', cv.motherTongue, v => { cv.motherTongue = v; renderPreview(cv); save(); }));

    const gridHdr = document.createElement('div');
    gridHdr.className = 'lang-grid-hdr';
    ['Language', 'Listen', 'Read', 'Spoken', 'Interact', 'Write', ''].forEach(t => {
      const sp = document.createElement('span'); sp.textContent = t; gridHdr.appendChild(sp);
    });
    block.appendChild(gridHdr);

    const refresh = () => {
      block.querySelectorAll('.lang-grid-row, .btn-add-lang').forEach(r => r.remove());

      cv.languages.forEach((lang, i) => {
        const row = document.createElement('div');
        row.className = 'lang-grid-row';
        ['lang', 'listen', 'read', 'spoken', 'interact', 'write'].forEach(k => {
          const inp = document.createElement('input');
          inp.type = 'text'; inp.value = lang[k] || ''; inp.placeholder = k;
          inp.addEventListener('input', e => { lang[k] = e.target.value; renderPreview(cv); save(); });
          row.appendChild(inp);
        });
        const del = document.createElement('button');
        del.className = 'btn-del-lang'; del.textContent = '×'; del.title = 'Remove';
        del.addEventListener('click', () => {
          if (!confirm('Remove this language?')) return;
          cv.languages.splice(i, 1); refresh(); renderPreview(cv); save();
        });
        row.appendChild(del);
        block.appendChild(row);
      });

      const add = mkAddBtn('+ Add Language', () => {
        cv.languages.push({ id: uid(), lang: '', listen: '', read: '', spoken: '', interact: '', write: '' });
        refresh(); renderPreview(cv); save();
      });
      add.classList.add('btn-add-lang');
      block.appendChild(add);
    };
    refresh();
  });

  // ── Driving Licence ──
  mkSectionBlock(body, cv, '🚗', 'Driving Licence', 'showDriving', block => {
    block.appendChild(mkField('Licence Category (e.g. A, B, C)', cv.driving, v => { cv.driving = v; renderPreview(cv); save(); }));
  });

  // ── Volunteering ──
  mkSectionBlock(body, cv, '🤝', 'Volunteering', 'showVolunteering', block => {
    const refresh = () => {
      block.querySelectorAll('.entry-card, .btn-add-vol').forEach(e => e.remove());

      cv.volunteering.forEach((vol, i) => {
        const card = mkEntryCard('Volunteering ' + (i + 1), () => {
          if (!confirm('Remove this entry?')) return;
          cv.volunteering.splice(i, 1); refresh(); renderPreview(cv); save();
        });

        const r1 = document.createElement('div'); r1.className = 'inline-2';
        r1.appendChild(mkField('Dates', vol.dates, v => { vol.dates = v; renderPreview(cv); save(); }));
        r1.appendChild(mkField('Location', vol.location, v => { vol.location = v; renderPreview(cv); save(); }));
        card.appendChild(r1);

        card.appendChild(mkField('Title / Role', vol.title, v => { vol.title = v; renderPreview(cv); save(); }));
        card.appendChild(mkTextarea('Description', vol.desc, v => { vol.desc = v; renderPreview(cv); save(); }));
        block.appendChild(card);
      });

      const add = mkAddBtn('+ Add Volunteering Entry', () => {
        cv.volunteering.push({ id: uid(), dates: '', location: '', title: '', desc: '' });
        refresh(); renderPreview(cv); save();
      });
      add.classList.add('btn-add-vol');
      block.appendChild(add);
    };
    refresh();
  });
}

// ══════════════════════════════════════════════════════════════
//  CV HTML RENDERER
// ══════════════════════════════════════════════════════════════

function euStars() {
  const cx = 26, cy = 17, r = 9.5;
  let out = '';
  for (let i = 0; i < 12; i++) {
    const a = (i * 30 - 90) * Math.PI / 180;
    out += `<text x="${(cx + r * Math.cos(a)).toFixed(2)}" y="${(cy + r * Math.sin(a)).toFixed(2)}" text-anchor="middle" dominant-baseline="central" font-size="4.5" fill="#FFCC00">★</text>`;
  }
  return out;
}

function cvSection(title, html) {
  return `<div class="ep-section">
    <div class="ep-section-hdr"><div class="ep-dot"></div><div class="ep-section-title">${title}</div></div>
    <div class="ep-body">${html}</div>
  </div>`;
}

function buildCVHTML(cv) {
  const s = v => esc(v ?? '');
  let h = '';

  // Personal info rows
  const infoRows = [

    `<b>Passport Number:</b> ${s(cv.passportNumber)} | <b>Date of birth:</b> ${s(cv.dob)}<span class="sep"> |</span><b>Nationality:</b> ${s(cv.nationality)}<span class="sep"> |</span>`,
    `<b>Gender:</b> ${s(cv.gender)}</span class="sep"> | <b>Email address:</b> ${s(cv.email)}<span class="sep"> |</span>`,
    `<b>Phone number:</b> ${s(cv.phone)} | <b>Address:</b> ${s(cv.address)} |`,
  ];

  // Add custom fields into the personal info block
  if (cv.customFields && cv.customFields.length) {
    const customs = cv.customFields
      .filter(f => f.label || f.value)
      .map(f => `<b>${s(f.label)}:</b> ${s(f.value)}`);
    if (customs.length) {
      infoRows.push(customs.join('<span class="sep">|</span>'));
    }
  }

  // ── HEADER ──
  const photoHTML = cv.photo
    ? `<img src="${cv.photo}" alt="Photo">`
    : '<span style="font-size:9px;color:#999;">Photo</span>';

  h += `<div class="ep-header">
    <div class="ep-header-left">
      <div class="ep-photo">${photoHTML}</div>
      <div class="ep-name-block">
        <h1>${s(cv.fullName)}</h1>
        <div class="ep-info">
          ${infoRows.join('<br>')}
        </div>
      </div>
    </div>
    <div class="ep-logo">
      <div class="ep-logo-flag">
        <svg viewBox="0 0 52 34" xmlns="http://www.w3.org/2000/svg">
          <rect width="52" height="34" fill="#003399"/>
          ${euStars()}
        </svg>
      </div>
      <div class="ep-logo-text">europass</div>
    </div>
  </div>`;

  // ── ABOUT ──
  if (cv.showAbout && cv.about)
    h += cvSection('About Me', `<div class="ep-about">${s(cv.about)}</div>`);

  // ── EDUCATION ──
  if (cv.showEducation && cv.education.length) {
    let ec = '';
    cv.education.forEach(edu => {
      ec += `<div class="ep-edu-item">
        <div class="ep-edu-dates">${s(edu.dates)}${edu.location ? ' ' + s(edu.location) : ''}</div>
        <div class="ep-edu-row">
          <div class="ep-edu-degree">${s(edu.degree)}</div>
          <div class="ep-edu-inst">${s(edu.institution)}</div>
        </div>
        <hr class="ep-edu-divider">`;
      if (edu.bullets && edu.bullets.length)
        ec += `<ul class="ep-edu-bullets">${edu.bullets.map(b => `<li>${s(b)}</li>`).join('')}</ul>`;
      if (edu.field || edu.eqf) {
        ec += `<div class="ep-edu-field">`;
        if (edu.field) ec += `<b>Field of study</b> ${s(edu.field)}`;
        if (edu.field && edu.eqf) ec += `<span style="margin:0 6px;color:#aaa;">|</span>`;
        if (edu.eqf) ec += `<b>Level in EQF</b> ${s(edu.eqf)}`;
        ec += `</div>`;
      }
      ec += `</div>`;
    });
    h += cvSection('Education and Training', ec);
  }

  // ── WORK ──
  if (cv.showWork && cv.work.length) {
    let wc = '';
    cv.work.forEach(job => {
      wc += `<div class="ep-job-item">
        <div class="ep-job-row">
          <div class="ep-job-title">${s(job.title)}${job.company ? ' – ' + s(job.company) : ''}</div>
          <div class="ep-job-meta">${s(job.dates)}${job.location ? ' – ' + s(job.location) : ''}</div>
        </div>
        <hr class="ep-job-divider">
        <ul class="ep-job-bullets">${(job.bullets || []).map(b => `<li>${s(b)}</li>`).join('')}</ul>
      </div>`;
    });
    h += cvSection('Work Experience', wc);
  }

  // ── SKILLS ──
  if (cv.showSkills && (cv.techSkills.length || cv.interpSkills.length)) {
    let sc = '';
    if (cv.techSkills.length)
      sc += `<div class="ep-skills-cat">Technical Skills</div>
             <div class="ep-skills-list">${cv.techSkills.map(s2 => esc(s2)).join('<span class="ep-skills-sep">|</span>')}</div>`;
    if (cv.interpSkills.length)
      sc += `<div class="ep-skills-cat">Interpersonal Skills</div>
             <div class="ep-skills-list">${cv.interpSkills.map(s2 => esc(s2)).join('<span class="ep-skills-sep">|</span>')}</div>`;
    h += cvSection('Skills', sc);
  }

  // ── DIGITAL ──
  if (cv.showDigital && cv.digital.length) {
    let dc = cv.digital.map(d => `
      <div class="ep-digital-row">
        <div class="ep-digital-left"><span class="ep-digital-icon">${d.icon || ''}</span>${esc(d.label)}</div>
        <div class="ep-digital-right">
          <span class="ep-digital-level">${esc(d.level)}</span>
          <span class="ep-digital-score">${esc(d.score)}</span>
        </div>
      </div>`).join('');
    dc += `<div class="ep-digital-note">Results from a self-assessment based on The Digital Competence Framework 2.1</div>`;
    h += cvSection('Digital Skills Test Results', dc);
  }

  // ── LANGUAGE ──
  if (cv.showLanguage) {
    let lc = `<div class="ep-mother">Mother tongue(s): &nbsp;<b>${s(cv.motherTongue)}</b></div>`;
    if (cv.languages.length) {
      lc += `<div class="ep-other-label">Other language(s):</div>
      <table class="ep-lang-table">
        <thead>
          <tr>
            <th class="ep-lang-left" rowspan="2" style="width:82px;"></th>
            <th colspan="2">UNDERSTANDING</th>
            <th colspan="2">SPEAKING</th>
            <th>WRITING</th>
          </tr>
          <tr class="ep-lang-subhdr">
            <th>Listening</th>
            <th>Reading</th>
            <th>Spoken production</th>
            <th>Spoken interaction</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          ${cv.languages.map(l => `<tr>
            <td class="ep-lang-name">${esc(l.lang)}</td>
            <td>${esc(l.listen)}</td><td>${esc(l.read)}</td>
            <td>${esc(l.spoken)}</td><td>${esc(l.interact)}</td>
            <td>${esc(l.write)}</td>
          </tr>`).join('')}
        </tbody>
      </table>
      <div class="ep-lang-note">Levels: A1 and A2: Basic user; B1 and B2: Independent user; C1 and C2: Proficient user</div>`;
    }
    h += cvSection('Language Skills', lc);
  }

  // ── VOLUNTEERING ──
  if (cv.showVolunteering && cv.volunteering.length) {
    let vc = '';
    cv.volunteering.forEach(vol => {
      vc += `<div style="margin-bottom:8px;">
        <div class="ep-vol-date">${s(vol.dates)}${vol.location ? ' ' + s(vol.location) : ''}</div>
        <div class="ep-vol-title">${s(vol.title)}</div>
        <div class="ep-vol-desc">${s(vol.desc)}</div>
      </div>`;
    });
    h += cvSection('Volunteering', vc);
  }

  // ── DRIVING ──
  if (cv.showDriving && cv.driving)
    h += cvSection('Driving Licence', `<div class="ep-driving"><b>Driving Licence:</b> ${s(cv.driving)}</div>`);

  return h;
}

// ══════════════════════════════════════════════════════════════
//  PREVIEW
// ══════════════════════════════════════════════════════════════

function renderPreview(cv) {
  document.getElementById('cv-preview').innerHTML =
    `<div class="ep">${buildCVHTML(cv)}</div>`;
}

// ══════════════════════════════════════════════════════════════
//  PDF EXPORT — uses Blob + hidden <a> download (no popup blocker)
// ══════════════════════════════════════════════════════════════

const CV_CSS = `
*{margin:0;padding:0;box-sizing:border-box;}
body{font-family:Arial,Helvetica,sans-serif;font-size:11px;color:#222;line-height:1.4;background:#fff;}
.ep{padding:28px 36px 40px 36px;width:800px;}
.ep-header{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:20px;}
.ep-header-left{display:flex;align-items:flex-start;gap:16px;}
.ep-photo{width:90px;height:110px;border:1px solid #bbb;flex-shrink:0;overflow:hidden;display:flex;align-items:center;justify-content:center;background:#e8e8e8;}
.ep-photo img{width:100%;height:100%;object-fit:cover;object-position:top;}
.ep-name-block h1{font-size:22px;font-weight:bold;color:#003399;margin-bottom:9px;margin-top:4px;}
.ep-info{font-size:10.5px;line-height:1.75;}.ep-info b{font-weight:bold;}.ep-info .sep{color:#aaa;margin:0 5px;}
.ep-logo{display:flex;flex-direction:column;align-items:flex-end;gap:3px;flex-shrink:0;}
.ep-logo-flag{width:52px;height:34px;background:#003399;border-radius:2px;overflow:hidden;}
.ep-logo-flag svg{width:52px;height:34px;display:block;}
.ep-logo-text{font-size:20px;font-weight:bold;color:#003399;letter-spacing:.4px;}
.ep-section{margin-bottom:10px;}
.ep-section-hdr{display:flex;align-items:center;gap:8px;border-bottom:1.5px solid #003399;padding-bottom:3px;margin-bottom:8px;}
.ep-dot{width:9px;height:9px;background:#003399;border-radius:50%;flex-shrink:0;}
.ep-section-title{font-size:11px;font-weight:bold;color:#003399;text-transform:uppercase;letter-spacing:.5px;}
.ep-body{padding-left:17px;}
.ep-edu-item{margin-bottom:7px;}.ep-edu-dates{font-size:10px;color:#555;margin-bottom:1px;}
.ep-edu-row{display:flex;justify-content:space-between;align-items:baseline;}
.ep-edu-degree{font-weight:bold;font-size:11px;}.ep-edu-inst{color:#555;font-size:10.5px;}
.ep-edu-divider{border:none;border-top:1px solid #e0e0e0;margin:4px 0;}
.ep-edu-bullets{padding-left:12px;margin:3px 0;}.ep-edu-bullets li{font-size:10.5px;list-style:disc;padding:1px 0;}
.ep-edu-field{font-size:10.5px;margin-top:3px;}.ep-edu-field b{font-weight:bold;}
.ep-job-item{margin-bottom:9px;}.ep-job-row{display:flex;justify-content:space-between;align-items:baseline;}
.ep-job-title{font-weight:bold;font-size:11px;}.ep-job-meta{font-size:10px;color:#555;}
.ep-job-divider{border:none;border-top:1px solid #ccc;margin:4px 0;}
.ep-job-bullets{margin:3px 0;padding-left:0;}.ep-job-bullets li{font-size:10.5px;list-style:none;padding:1.5px 0;}.ep-job-bullets li::before{content:"• ";}
.ep-skills-cat{font-size:10.5px;font-weight:bold;margin:5px 0 3px;}.ep-skills-list{font-size:10.5px;}.ep-skills-sep{color:#999;margin:0 5px;}
.ep-digital-row{display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px solid #f0f0f0;}
.ep-digital-row:last-of-type{border-bottom:none;}
.ep-digital-left{font-size:10.5px;display:flex;align-items:center;gap:6px;}.ep-digital-icon{font-size:12px;}
.ep-digital-right{display:flex;align-items:center;gap:8px;}
.ep-digital-level{font-size:10.5px;font-weight:bold;color:#003399;}.ep-digital-score{font-size:10.5px;color:#555;}
.ep-digital-note{font-size:9px;color:#888;font-style:italic;margin-top:5px;}
.ep-lang-table{width:100%;border-collapse:collapse;font-size:10.5px;}
.ep-lang-table th{background:#003399;color:#fff;text-align:center;padding:4px 6px;font-size:9.5px;font-weight:bold;text-transform:uppercase;}
.ep-lang-table th.ep-lang-left{text-align:left;}
.ep-lang-table .ep-lang-subhdr th{background:#4472c4;font-weight:normal;font-size:9px;padding:3px 6px;}
.ep-lang-table td{text-align:center;padding:4px 6px;border:1px solid #d0d0d0;font-size:10.5px;}
.ep-lang-table td.ep-lang-name{text-align:left;font-weight:bold;background:#fff;}
.ep-lang-note{font-size:9px;color:#666;font-style:italic;margin-top:5px;}
.ep-mother{font-size:10.5px;margin-bottom:5px;}.ep-other-label{font-size:10.5px;margin-bottom:5px;}
.ep-vol-date{font-size:10px;color:#555;margin-bottom:2px;}.ep-vol-title{font-weight:bold;font-size:11px;margin-bottom:3px;}.ep-vol-desc{font-size:10.5px;}
.ep-about{font-size:10.5px;}.ep-driving{font-size:10.5px;}
@media print{@page{size:A4;margin:0;}body{-webkit-print-color-adjust:exact;print-color-adjust:exact;}}
`;

document.getElementById('btn-export-pdf').addEventListener('click', () => {
  const cv = getActive();
  const cvName = (cv.name || 'CV').replace(/[^a-z0-9_\-\s]/gi, '').trim() || 'CV';

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>${esc(cv.name || 'CV')}</title>
<style>${CV_CSS}</style>
</head>
<body>
<div class="ep">${buildCVHTML(cv)}</div>
</body>
</html>`;

  // ── Strategy 1: Blob download as .html (open in browser → Print → Save as PDF) ──
  // This never triggers a popup blocker and works in all browsers.
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  // Open in new tab so user can Ctrl+P → Save as PDF
  const win = window.open(url, '_blank');

  if (win) {
    // After page loads, auto-trigger print dialog
    win.addEventListener('load', () => {
      win.focus();
      win.print();
      // cleanup after a delay
      setTimeout(() => URL.revokeObjectURL(url), 60000);
    });
  } else {
    // Popup blocked — fall back to direct download of .html file
    const a = document.createElement('a');
    a.href = url;
    a.download = cvName + '.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(() => URL.revokeObjectURL(url), 5000);
    alert('Your CV has been downloaded as an HTML file.\nOpen it in Chrome or Edge, then press Ctrl+P and choose "Save as PDF".');
  }
});

// ══════════════════════════════════════════════════════════════
//  NEW CV
// ══════════════════════════════════════════════════════════════

document.getElementById('btn-new-cv').addEventListener('click', () => {
  const cv = blankCV();
  cvList.push(cv);
  activeId = cv.id;
  save();
  renderAll();
});

// ══════════════════════════════════════════════════════════════
//  RENDER ALL
// ══════════════════════════════════════════════════════════════

function renderAll() {
  const cv = getActive();
  renderSidebar();
  buildEditor(cv);
  renderPreview(cv);
}

renderAll();
