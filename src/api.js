const API_URL = 'https://manuspillai-backend-82039a46be1e.herokuapp.com'
export async function getJSON(path, signal) { const response = await fetch(`${API_URL}${path}`, { signal }); if (!response.ok) throw new Error(`Request failed (${response.status})`); return response.json() }
export async function resolveImage(reference, signal) { if (!reference) return ''; if (reference.startsWith('http')) return reference; if (!reference.startsWith('gs://')) return `/images/project_icons/${reference}`; return getJSON(`/imurl?im=${encodeURIComponent(reference)}`, signal) }
