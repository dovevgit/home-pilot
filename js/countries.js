// מדינות וערים מרכזיות לחיפוש מזג אוויר. פורמט: מדינה|Country|עיר,City,קו רוחב,קו אורך;...
const RAW = `ספרד|Spain|מדריד,Madrid,40.42,-3.70;ברצלונה,Barcelona,41.39,2.17;סביליה,Seville,37.39,-5.99;מלגה,Malaga,36.72,-4.42
צרפת|France|פריז,Paris,48.86,2.35;ניס,Nice,43.70,7.27;ליון,Lyon,45.76,4.84;מרסיי,Marseille,43.30,5.37
איטליה|Italy|רומא,Rome,41.90,12.50;מילאנו,Milan,45.46,9.19;ונציה,Venice,45.44,12.32;פירנצה,Florence,43.77,11.26;נאפולי,Naples,40.85,14.27
יוון|Greece|אתונה,Athens,37.98,23.73;סלוניקי,Thessaloniki,40.64,22.94;כרתים (הרקליון),Heraklion,35.34,25.14;רודוס,Rhodes,36.43,28.22
קפריסין|Cyprus|לרנקה,Larnaca,34.92,33.62;לימסול,Limassol,34.68,33.04;פאפוס,Paphos,34.78,32.42;ניקוסיה,Nicosia,35.19,33.38
גרמניה|Germany|ברלין,Berlin,52.52,13.40;מינכן,Munich,48.14,11.58;פרנקפורט,Frankfurt,50.11,8.68;המבורג,Hamburg,53.55,9.99
בריטניה|United Kingdom|לונדון,London,51.51,-0.13;מנצ'סטר,Manchester,53.48,-2.24;אדינבורו,Edinburgh,55.95,-3.19;ליברפול,Liverpool,53.41,-2.99
אירלנד|Ireland|דבלין,Dublin,53.35,-6.26;קורק,Cork,51.90,-8.47;גאלווי,Galway,53.27,-9.05
הולנד|Netherlands|אמסטרדם,Amsterdam,52.37,4.90;רוטרדם,Rotterdam,51.92,4.48;האג,The Hague,52.08,4.31
בלגיה|Belgium|בריסל,Brussels,50.85,4.35;אנטוורפן,Antwerp,51.22,4.40;בריז',Bruges,51.21,3.22
שווייץ|Switzerland|ציריך,Zurich,47.38,8.54;ז'נבה,Geneva,46.20,6.14;לוצרן,Lucerne,47.05,8.31
אוסטריה|Austria|וינה,Vienna,48.21,16.37;זלצבורג,Salzburg,47.81,13.04;אינסברוק,Innsbruck,47.26,11.39
צ'כיה|Czechia|פראג,Prague,50.08,14.44;ברנו,Brno,49.20,16.61
הונגריה|Hungary|בודפשט,Budapest,47.50,19.04;דברצן,Debrecen,47.53,21.63
פולין|Poland|ורשה,Warsaw,52.23,21.01;קרקוב,Krakow,50.06,19.94;גדנסק,Gdansk,54.35,18.65
פורטוגל|Portugal|ליסבון,Lisbon,38.72,-9.14;פורטו,Porto,41.15,-8.61;פארו,Faro,37.02,-7.93
טורקיה|Turkey|איסטנבול,Istanbul,41.01,28.98;אנטליה,Antalya,36.90,30.70;אנקרה,Ankara,39.93,32.86;איזמיר,Izmir,38.42,27.14
רומניה|Romania|בוקרשט,Bucharest,44.43,26.10;קלוז',Cluj-Napoca,46.77,23.59
בולגריה|Bulgaria|סופיה,Sofia,42.70,23.32;וארנה,Varna,43.21,27.91
קרואטיה|Croatia|זגרב,Zagreb,45.81,15.98;ספליט,Split,43.51,16.44;דוברובניק,Dubrovnik,42.65,18.09
שוודיה|Sweden|שטוקהולם,Stockholm,59.33,18.07;גטבורג,Gothenburg,57.71,11.97
נורווגיה|Norway|אוסלו,Oslo,59.91,10.75;ברגן,Bergen,60.39,5.32
דנמרק|Denmark|קופנהגן,Copenhagen,55.68,12.57;אורהוס,Aarhus,56.16,10.21
פינלנד|Finland|הלסינקי,Helsinki,60.17,24.94;רובניימי,Rovaniemi,66.50,25.73
רוסיה|Russia|מוסקבה,Moscow,55.76,37.62;סנקט פטרבורג,Saint Petersburg,59.93,30.34
אוקראינה|Ukraine|קייב,Kyiv,50.45,30.52;אודסה,Odesa,46.48,30.73
גאורגיה|Georgia|טביליסי,Tbilisi,41.72,44.79;בטומי,Batumi,41.65,41.64
ארמניה|Armenia|ירוואן,Yerevan,40.18,44.51
ארצות הברית|United States|ניו יורק,New York,40.71,-74.01;לוס אנג'לס,Los Angeles,34.05,-118.24;מיאמי,Miami,25.76,-80.19;שיקגו,Chicago,41.88,-87.63;לאס וגאס,Las Vegas,36.17,-115.14;סן פרנסיסקו,San Francisco,37.77,-122.42
קנדה|Canada|טורונטו,Toronto,43.65,-79.38;ונקובר,Vancouver,49.28,-123.12;מונטריאול,Montreal,45.50,-73.57
מקסיקו|Mexico|מקסיקו סיטי,Mexico City,19.43,-99.13;קנקון,Cancun,21.16,-86.85
ברזיל|Brazil|ריו דה ז'נרו,Rio de Janeiro,-22.91,-43.17;סאו פאולו,Sao Paulo,-23.55,-46.63
ארגנטינה|Argentina|בואנוס איירס,Buenos Aires,-34.60,-58.38;מנדוסה,Mendoza,-32.89,-68.84
תאילנד|Thailand|בנגקוק,Bangkok,13.76,100.50;פוקט,Phuket,7.88,98.39;צ'יאנג מאי,Chiang Mai,18.79,98.98;קו סמוי,Ko Samui,9.51,100.01
יפן|Japan|טוקיו,Tokyo,35.68,139.69;קיוטו,Kyoto,35.01,135.77;אוסקה,Osaka,34.69,135.50;סאפורו,Sapporo,43.06,141.35
סין|China|בייג'ינג,Beijing,39.90,116.41;שנגחאי,Shanghai,31.23,121.47;הונג קונג,Hong Kong,22.32,114.17
דרום קוריאה|South Korea|סיאול,Seoul,37.57,126.98;בוסאן,Busan,35.18,129.08
הודו|India|דלהי,Delhi,28.61,77.21;מומבאי,Mumbai,19.08,72.88;גואה,Goa,15.50,73.83
איחוד האמירויות|United Arab Emirates|דובאי,Dubai,25.20,55.27;אבו דאבי,Abu Dhabi,24.45,54.38
מצרים|Egypt|קהיר,Cairo,30.04,31.24;שארם א-שייח',Sharm El-Sheikh,27.91,34.33;אלכסנדריה,Alexandria,31.20,29.92;טאבה,Taba,29.49,34.90
ירדן|Jordan|עמאן,Amman,31.95,35.93;עקבה,Aqaba,29.53,35.01;פטרה,Petra,30.33,35.44
מרוקו|Morocco|מרקש,Marrakech,31.63,-8.01;קזבלנקה,Casablanca,33.57,-7.59;רבאט,Rabat,34.02,-6.84
דרום אפריקה|South Africa|קייפטאון,Cape Town,-33.92,18.42;יוהנסבורג,Johannesburg,-26.20,28.05
אוסטרליה|Australia|סידני,Sydney,-33.87,151.21;מלבורן,Melbourne,-37.81,144.96;בריסביין,Brisbane,-27.47,153.03
ניו זילנד|New Zealand|אוקלנד,Auckland,-36.85,174.76;קווינסטאון,Queenstown,-45.03,168.66
ישראל|Israel|חיפה,Haifa,32.82,34.98;תל אביב,Tel Aviv,32.08,34.77;ירושלים,Jerusalem,31.77,35.21;אילת,Eilat,29.55,34.95`;

const norm = s => String(s || '').toLowerCase().replace(/[֑-ׇ"'׳"״`]/g, '').replace(/\s+/g, ' ').trim();
export const COUNTRIES = RAW.split('\n').map(l => {
  const [he, en, cs] = l.split('|');
  return { he, en, cities: cs.split(';').map(c => { const [h, e, la, lo] = c.split(','); return { he: h, en: e, lat: +la, lon: +lo }; }) };
});
// אם הטקסט הוא שם מדינה (בעברית או באנגלית, גם בהתחלה בלבד), מחזיר אותה
export function findCountry(q) {
  const n = norm(q); if (n.length < 2) return null;
  return COUNTRIES.find(c => norm(c.he) === n || norm(c.en) === n)
    || COUNTRIES.find(c => norm(c.he).startsWith(n) || norm(c.en).startsWith(n)) || null;
}
