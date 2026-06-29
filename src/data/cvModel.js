import { uid } from '../utils/helpers';

export function migrateCV(cv) {
  return {
    ...cv,
    customFields: cv.customFields ?? [],
    education: cv.education ?? [],
    work: cv.work ?? [],
    techSkills: cv.techSkills ?? [],
    interpSkills: cv.interpSkills ?? [],
    digital: cv.digital ?? [],
    languages: cv.languages ?? [],
    volunteering: cv.volunteering ?? [],
  };
}

export const blankCV = () => ({
  id: uid(),
  name: 'Untitled CV',
  photo: '',
  passportNumber: '',
  fullName: '',
  dob: '',
  nationality: '',
  gender: '',
  phone: '',
  email: '',
  address: '',
  customFields: [],
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

export const sampleCV = () =>
  migrateCV({
    ...blankCV(),
    name: 'Sample CV',
    passportNumber: 'your passport/ID number',
    fullName: 'Full Name',
    dob: '02/06/2000',
    nationality: 'Nepalese',
    gender: 'Male',
    phone: '(country code) number',
    email: 'someone@example.com',
    address: 'Address as in passport',
    education: [
      {
        id: uid(),
        dates: 'mm/dd/yyyy – mm/dd/yyyy',
        location: 'City, Country',
        degree: 'Degree / Level',
        institution: 'Institution name',
        field: 'Field of study',
        eqf: 'EQF level',
        bullets: [],
      },
    ],
    work: [
      {
        id: uid(),
        title: 'Job title',
        company: 'Company name',
        dates: 'mm/dd/yyyy – mm/dd/yyyy',
        location: 'City, Country',
        bullets: ['Roles and responsibilities'],
      },
    ],
    techSkills: ['Technical skill'],
    interpSkills: ['Personal skill'],
    digital: [
      { id: uid(), icon: '🖥', label: 'Information and data literacy', level: 'ADVANCED', score: 'Level 6 / 6' },
    ],
    motherTongue: 'NEPALI',
    languages: [
      { id: uid(), lang: 'ENGLISH', listen: 'C2', read: 'C2', spoken: 'B1', interact: 'B2', write: 'B2' },
    ],
    driving: 'B',
  });
