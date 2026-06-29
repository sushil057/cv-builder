function EuStars() {
  const cx = 26;
  const cy = 17;
  const r = 9.5;
  const stars = [];
  for (let i = 0; i < 12; i++) {
    const a = ((i * 30 - 90) * Math.PI) / 180;
    stars.push(
      <text
        key={i}
        x={(cx + r * Math.cos(a)).toFixed(2)}
        y={(cy + r * Math.sin(a)).toFixed(2)}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="4.5"
        fill="#FFCC00"
      >
        ★
      </text>,
    );
  }
  return stars;
}

function CVSection({ title, children }) {
  return (
    <div className="ep-section">
      <div className="ep-section-hdr">
        <div className="ep-dot" />
        <div className="ep-section-title">{title}</div>
      </div>
      <div className="ep-body">{children}</div>
    </div>
  );
}

export default function CVDocument({ cv }) {
  const infoRows = [
    <>
      <b>Passport Number:</b> {cv.passportNumber} | <b>Date of birth:</b> {cv.dob}
      <span className="sep"> |</span>
      <b>Nationality:</b> {cv.nationality}
      <span className="sep"> |</span>
    </>,
    <>
      <b>Gender:</b> {cv.gender}
      <span className="sep"> | </span>
      <b>Email address:</b> {cv.email}
      <span className="sep"> |</span>
    </>,
    <>
      <b>Phone number:</b> {cv.phone} | <b>Address:</b> {cv.address} |
    </>,
  ];

  const customs = (cv.customFields || [])
    .filter((f) => f.label || f.value)
    .map((f, i) => (
      <span key={f.id || i}>
        {i > 0 && <span className="sep">|</span>}
        <b>{f.label}:</b> {f.value}
      </span>
    ));

  if (customs.length) {
    infoRows.push(<>{customs}</>);
  }

  return (
    <div className="ep">
      <div className="ep-header">
        <div className="ep-header-left">
          <div className="ep-photo">
            {cv.photo ? (
              <img src={cv.photo} alt="Photo" />
            ) : (
              <span style={{ fontSize: '9px', color: '#999' }}>Photo</span>
            )}
          </div>
          <div className="ep-name-block">
            <h1>{cv.fullName}</h1>
            <div className="ep-info">
              {infoRows.map((row, i) => (
                <span key={i}>
                  {row}
                  {i < infoRows.length - 1 && <br />}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="ep-logo">
          <div className="ep-logo-flag">
            <svg viewBox="0 0 52 34" xmlns="http://www.w3.org/2000/svg">
              <rect width="52" height="34" fill="#003399" />
              <EuStars />
            </svg>
          </div>
          <div className="ep-logo-text">europass</div>
        </div>
      </div>

      {cv.showAbout && cv.about && (
        <CVSection title="About Me">
          <div className="ep-about">{cv.about}</div>
        </CVSection>
      )}

      {cv.showEducation && cv.education.length > 0 && (
        <CVSection title="Education and Training">
          {cv.education.map((edu) => (
            <div key={edu.id} className="ep-edu-item">
              <div className="ep-edu-dates">
                {edu.dates}
                {edu.location ? ` ${edu.location}` : ''}
              </div>
              <div className="ep-edu-row">
                <div className="ep-edu-degree">{edu.degree}</div>
                <div className="ep-edu-inst">{edu.institution}</div>
              </div>
              <hr className="ep-edu-divider" />
              {edu.bullets?.length > 0 && (
                <ul className="ep-edu-bullets">
                  {edu.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              )}
              {(edu.field || edu.eqf) && (
                <div className="ep-edu-field">
                  {edu.field && (
                    <>
                      <b>Field of study</b> {edu.field}
                    </>
                  )}
                  {edu.field && edu.eqf && <span style={{ margin: '0 6px', color: '#aaa' }}>|</span>}
                  {edu.eqf && (
                    <>
                      <b>Level in EQF</b> {edu.eqf}
                    </>
                  )}
                </div>
              )}
            </div>
          ))}
        </CVSection>
      )}

      {cv.showWork && cv.work.length > 0 && (
        <CVSection title="Work Experience">
          {cv.work.map((job) => (
            <div key={job.id} className="ep-job-item">
              <div className="ep-job-row">
                <div className="ep-job-title">
                  {job.title}
                  {job.company ? ` – ${job.company}` : ''}
                </div>
                <div className="ep-job-meta">
                  {job.dates}
                  {job.location ? ` – ${job.location}` : ''}
                </div>
              </div>
              <hr className="ep-job-divider" />
              <ul className="ep-job-bullets">
                {(job.bullets || []).map((b, i) => (
                  <li key={i}>{b}</li>
                ))}
              </ul>
            </div>
          ))}
        </CVSection>
      )}

      {cv.showSkills && (cv.techSkills.length > 0 || cv.interpSkills.length > 0) && (
        <CVSection title="Skills">
          {cv.techSkills.length > 0 && (
            <>
              <div className="ep-skills-cat">Technical Skills</div>
              <div className="ep-skills-list">
                {cv.techSkills.map((s, i) => (
                  <span key={i}>
                    {i > 0 && <span className="ep-skills-sep">|</span>}
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
          {cv.interpSkills.length > 0 && (
            <>
              <div className="ep-skills-cat">Interpersonal Skills</div>
              <div className="ep-skills-list">
                {cv.interpSkills.map((s, i) => (
                  <span key={i}>
                    {i > 0 && <span className="ep-skills-sep">|</span>}
                    {s}
                  </span>
                ))}
              </div>
            </>
          )}
        </CVSection>
      )}

      {cv.showDigital && cv.digital.length > 0 && (
        <CVSection title="Digital Skills Test Results">
          {cv.digital.map((d) => (
            <div key={d.id} className="ep-digital-row">
              <div className="ep-digital-left">
                <span className="ep-digital-icon">{d.icon || ''}</span>
                {d.label}
              </div>
              <div className="ep-digital-right">
                <span className="ep-digital-level">{d.level}</span>
                <span className="ep-digital-score">{d.score}</span>
              </div>
            </div>
          ))}
          <div className="ep-digital-note">
            Results from a self-assessment based on The Digital Competence Framework 2.1
          </div>
        </CVSection>
      )}

      {cv.showLanguage && (
        <CVSection title="Language Skills">
          <div className="ep-mother">
            Mother tongue(s): &nbsp;<b>{cv.motherTongue}</b>
          </div>
          {cv.languages.length > 0 && (
            <>
              <div className="ep-other-label">Other language(s):</div>
              <table className="ep-lang-table">
                <thead>
                  <tr>
                    <th className="ep-lang-left" rowSpan={2} style={{ width: '82px' }} />
                    <th colSpan={2}>UNDERSTANDING</th>
                    <th colSpan={2}>SPEAKING</th>
                    <th>WRITING</th>
                  </tr>
                  <tr className="ep-lang-subhdr">
                    <th>Listening</th>
                    <th>Reading</th>
                    <th>Spoken production</th>
                    <th>Spoken interaction</th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {cv.languages.map((l) => (
                    <tr key={l.id}>
                      <td className="ep-lang-name">{l.lang}</td>
                      <td>{l.listen}</td>
                      <td>{l.read}</td>
                      <td>{l.spoken}</td>
                      <td>{l.interact}</td>
                      <td>{l.write}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="ep-lang-note">
                Levels: A1 and A2: Basic user; B1 and B2: Independent user; C1 and C2: Proficient user
              </div>
            </>
          )}
        </CVSection>
      )}

      {cv.showVolunteering && cv.volunteering.length > 0 && (
        <CVSection title="Volunteering">
          {cv.volunteering.map((vol) => (
            <div key={vol.id} style={{ marginBottom: '8px' }}>
              <div className="ep-vol-date">
                {vol.dates}
                {vol.location ? ` ${vol.location}` : ''}
              </div>
              <div className="ep-vol-title">{vol.title}</div>
              <div className="ep-vol-desc">{vol.desc}</div>
            </div>
          ))}
        </CVSection>
      )}

      {cv.showDriving && cv.driving && (
        <CVSection title="Driving Licence">
          <div className="ep-driving">
            <b>Driving Licence:</b> {cv.driving}
          </div>
        </CVSection>
      )}
    </div>
  );
}
