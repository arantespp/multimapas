const fs = require('fs');
const xml = require('xml-js');

const filePath = process.argv[2];

const file = fs.readFileSync(filePath, { encoding: 'utf-8' }).toString();

const json = JSON.parse(xml.xml2json(file, { compact: true }));

const data = json.kml.Document.Folder.Placemark.map((p, index) => {
  const text = p.Polygon.outerBoundaryIs.LinearRing.coordinates._text;
  if (!text) {
    return;
  }
  const coords = text.trim().split(' ');
  return {
    id: String(index),
    paths: coords.map(c => {
      const [lng, lat] = c.split(',');
      return { lat: Number(lat), lng: Number(lng) };
    })
  };
}).filter(d => !!d);

fs.writeFileSync('./kml.json', JSON.stringify(data), 'utf-8');
