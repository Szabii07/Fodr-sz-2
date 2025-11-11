export default async function handler(req, res) {
  try {
    const { service, date } = req.query;

    if (!service || !date) {
      return res.status(400).json({ error: "Hiányzó service vagy date" });
    }

    // Google Apps Script URL
    const appsScriptURL = 'https://script.google.com/macros/s/AKfycbwDJpcCk35tjSxaqqLqZf0_i47z_Y2kQO7MIGtTjxBawB4VCnGpgwR2T2ptux_01qAx7Q/exec';
    const url = `${appsScriptURL}?action=getAvailableTimes&service=${service}&date=${date}`;

    // Szerver oldali fetch
    const response = await fetch(url);
    const times = await response.json();

    res.status(200).json(times);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Hiba történt a fetch során' });
  }
}
