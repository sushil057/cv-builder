import { useCallback } from 'react';

/** Helpers for updating the active CV without repetitive spread logic. */
export function useCvPatch(cv, onUpdate) {
  const patch = useCallback(
    (fields) => onUpdate((c) => ({ ...c, ...fields })),
    [onUpdate],
  );

  const toggle = useCallback(
    (key) => patch({ [key]: !cv[key] }),
    [cv, patch],
  );

  const updateInList = useCallback(
    (listKey, index, changes) => {
      const list = [...cv[listKey]];
      list[index] = { ...list[index], ...changes };
      patch({ [listKey]: list });
    },
    [cv, patch],
  );

  const removeFromList = useCallback(
    (listKey, index, message) => {
      if (message && !confirm(message)) return;
      patch({ [listKey]: cv[listKey].filter((_, i) => i !== index) });
    },
    [cv, patch],
  );

  const appendToList = useCallback(
    (listKey, item) => patch({ [listKey]: [...cv[listKey], item] }),
    [cv, patch],
  );

  return { patch, toggle, updateInList, removeFromList, appendToList };
}
