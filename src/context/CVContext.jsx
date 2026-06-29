import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { blankCV, sampleCV, migrateCV } from '../data/cvModel';

const STORAGE_KEY = 'ep_cvs';

const CVContext = createContext(null);

function loadState() {
  try {
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    const cvList = (Array.isArray(stored) && stored.length ? stored : [sampleCV()]).map(migrateCV);
    return { cvList, activeId: cvList[0].id };
  } catch {
    const cvList = [sampleCV()];
    return { cvList, activeId: cvList[0].id };
  }
}

export function CVProvider({ children }) {
  const [{ cvList, activeId }, setState] = useState(loadState);
  const [saveStatus, setSaveStatus] = useState('saved');

  useEffect(() => {
    setSaveStatus('saving');
    const timer = setTimeout(() => {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cvList));
      setSaveStatus('saved');
    }, 400);
    return () => clearTimeout(timer);
  }, [cvList]);

  const activeCv = useMemo(
    () => cvList.find((c) => c.id === activeId) ?? cvList[0],
    [cvList, activeId],
  );

  const updateCv = useCallback((id, updater) => {
    setState((prev) => ({
      ...prev,
      cvList: prev.cvList.map((c) => {
        if (c.id !== id) return c;
        return typeof updater === 'function' ? updater(c) : { ...c, ...updater };
      }),
    }));
  }, []);

  const updateActive = useCallback(
    (updater) => updateCv(activeId, updater),
    [activeId, updateCv],
  );

  const addCv = useCallback(() => {
    const cv = blankCV();
    setState((prev) => ({ cvList: [...prev.cvList, cv], activeId: cv.id }));
  }, []);

  const deleteCv = useCallback((id) => {
    setState((prev) => {
      if (prev.cvList.length === 1) {
        alert('You need at least one CV.');
        return prev;
      }
      const cvList = prev.cvList.filter((c) => c.id !== id);
      const activeId = prev.activeId === id ? cvList[0].id : prev.activeId;
      return { cvList, activeId };
    });
  }, []);

  const selectCv = useCallback((id) => {
    setState((prev) => ({ ...prev, activeId: id }));
  }, []);

  const value = {
    cvList,
    activeId,
    activeCv,
    saveStatus,
    updateActive,
    updateCv,
    addCv,
    deleteCv,
    selectCv,
  };

  return <CVContext.Provider value={value}>{children}</CVContext.Provider>;
}

export function useCV() {
  const ctx = useContext(CVContext);
  if (!ctx) throw new Error('useCV must be used within CVProvider');
  return ctx;
}
