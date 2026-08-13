const KEY = "ciu_contact_viewed_ids";

export const getViewedIds = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return new Set(Array.isArray(arr) ? arr.map(Number) : []);
  } catch {
    return new Set();
  }
};

export const markViewed = (id) => {
  const set = getViewedIds();
  set.add(id);
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {}
};

export const markManyViewed = (ids) => {
  const set = getViewedIds();
  ids.forEach((id) => set.add(id));
  try {
    localStorage.setItem(KEY, JSON.stringify([...set]));
  } catch {}
};
