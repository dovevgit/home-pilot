/* שפות: עברית היא ברירת המחדל ולא נוגעים בה. אנגלית פועלת רק בעמודים שמסומנים כמתורגמים,
   ורק כשהמשתמש בחר אותה. התרגום נעשה על הטקסט שמוצג (מילון מדויק + תבניות), כך שמה שלא תורגם נשאר בעברית. */
const KEY = 'lang';
export const TRANSLATED_PAGES = new Set(['home', 'tasks', 'task', 'report', 'calendar', 'history', 'shop', 'meds']);

export const getLang = () => { try { return localStorage.getItem(KEY) === 'en' ? 'en' : 'he'; } catch (_) { return 'he'; } };
export function setLang(l) { try { localStorage.setItem(KEY, l === 'en' ? 'en' : 'he'); } catch (_) {} }

const D = {
  'הבית שלנו': 'Our Home', 'טוען...': 'Loading...',
  'חזרה': 'Back', 'תפריט': 'Menu', 'ניהול': 'Admin', 'בית': 'Home',
  'המשימות שלי': 'My tasks', 'לוח שנה': 'Calendar', 'היסטוריה ודיווחים': 'History and reports', 'חנות': 'Shop',
  'תרופות': 'Medications', 'בקשות מיוחדות': 'Special requests', 'הודעה חשובה': 'Important message', 'משחקים': 'Games',
  'הודעות משפחתיות': 'Family messages', 'פתקים על המקרר': 'Fridge notes', 'אני לא בבית': "I'm not home",
  'מידע משפחתי': 'Family info', 'ספרו לנו': 'Tell us', 'התראות': 'Notifications', 'התנתקות': 'Log out',
  'משימות': 'Tasks', 'היסטוריה': 'History',
  'התראות פעילות ✓': 'Notifications on ✓', 'התראות חסומות (בהגדרות הטלפון)': 'Notifications blocked (in phone settings)',
  'התראות: פתחו מהאייקון במסך הבית': 'Notifications: open from the home screen icon', 'התראות לא נתמכות כאן': 'Notifications not supported here',
  'הפעל התראות': 'Turn on notifications',
  'ההתראות הופעלו במכשיר הזה': 'Notifications turned on for this device', 'לא אושרו התראות': 'Notifications were not allowed',
  'ההפעלה נכשלה, נסו שוב': 'Could not turn on, try again', 'נשלחה התראת בדיקה ✓': 'Test notification sent ✓',
  'סיכום היום': "Today's summary", 'בני המשפחה': 'Family members', 'אין בקשות': 'No requests',
  'המשימות של היום': "Today's tasks", 'הצג הכל': 'Show all', 'מה קרה לאחרונה': "What's new", 'הודעות אחרונות': 'Recent messages',
  "לצ'אט המלא": 'Open full chat', 'כתבו הודעה למשפחה...': 'Write a message to the family...', 'שליחה': 'Send',
  'סה"כ משימות': 'Total tasks', 'בוצעו': 'Done', 'נשארו': 'Left',
  'אין משימות להיום': 'No tasks today', 'כל משימות היום בוצעו': "All of today's tasks are done", 'לא הצלחנו לטעון משימות': 'Could not load tasks',
  'עוד לא דווחו משימות': 'No tasks reported yet', 'אין הודעות עדיין. כתבו הודעה ראשונה!': 'No messages yet. Write the first one!',
  'לא הצלחנו לטעון הודעות': 'Could not load messages', 'המוביל השבועי': 'Weekly leader', 'נקודות': 'points', 'נעדר/ת': 'Away',
  'ממתין': 'Waiting', 'בתהליך': 'In progress', 'בוצע': 'Done', 'באיחור': 'Overdue',
  'היום': 'Today', 'מישהו': 'Someone', '📷 תמונה': '📷 Photo',
  'תאריך לידה (יום/חודש/שנה)': 'Birth date (day/month/year)', '📅 בחירה מלוח שנה': '📅 Pick from calendar',
  'מה כדאי לדעת': 'Good to know', 'למשל: אלרגיה, אוכל אהוב, מידת נעליים': 'For example: allergies, favorite food, shoe size',
  'שמירה': 'Save', 'ביטול': 'Cancel', 'עריכה': 'Edit', 'סגירה': 'Close',
  'עוד לא הוזן תאריך לידה': 'No birth date yet', 'עוד לא נכתב': 'Nothing written yet', 'נקודות השבוע:': 'Points this week:',
  'התאריך לא תקין. כתבו למשל 20/10/1978': 'Invalid date. For example: 20/10/1978',
  'השליחה נכשלה, אפשר לנסות שוב': 'Sending failed, you can try again',
  'הצעה להפעיל התראות': 'Turn on notifications', 'אחר כך': 'Later',
  'רוצים לקבל הודעות גם כשהאפליקציה סגורה?': 'Want to get messages even when the app is closed?',
  'משימה אחת צריכה מחליף': 'One task needs a replacement',
  'בקשת מימוש אחת מחכה לאישור': 'One redemption request is waiting for approval',
  'לא הצלחתי, נסו שוב': 'Could not do it, try again',
  'פרטי משימה': 'Task details', 'המשימה לא נמצאה': 'Task not found', 'דיווחים': 'Reports', '· באיחור': '· Overdue',
  'אבל אפשר לעשות אותה ולקבל את הנקודות. הדיווח יירשם על שמך.': 'But you can do it and get the points. The report will be under your name.',
  'אחראי/ת': 'Assigned to', 'מועד': 'Due', 'חזרה': 'Repeats', 'חובה לצלם': 'Photo required', 'כן': 'Yes', 'לא': 'No',
  'תיאור': 'Description', 'טיפים': 'Tips', 'שבועי': 'Weekly', 'פעם ביום': 'Once a day', 'חד-פעמי': 'One-time',
  'כל החזרות בוצעו': 'All repeats done', 'ביצעתי שוב (ביצוע נוסף)': 'I did it again (extra)', 'ביצעתי את המשימה': 'I did the task',
  'משימה משותפת: אחד מכם מדווח, וכולם מקבלים את הנקודות.': 'Shared task: one of you reports and everyone gets the points.',
  'מי שביצע בפועל מדווח ומקבל את הנקודות.': 'Whoever actually did it reports and gets the points.',
  'דיווח משימה': 'Report task', 'הערה (אופציונלי)': 'Note (optional)', 'שליחת דיווח': 'Send report',
  'הדיווח יופיע לכל המשפחה, ולא ניתן לערוך אותו אחרי השליחה.': 'The report will be shown to the whole family and cannot be edited after sending.',
  'ביצוע נוסף, מעבר ל-': 'Extra round, beyond the ', 'שהוגדרו. מקבלים נקודות מלאות': 'set. Full points',
  'אבל אפשר לעשות אותה ולקבל את הנקודות.': 'But you can do it and get the points.',
  'הדיווח יירשם על שמך ·': 'The report will be under your name ·', 'רוצה': 'I want to', 'לא רוצה': "I don't want to",
  'צריך לצלם תמונה כהוכחה': 'Take a photo as proof', 'פתיחת המצלמה': 'Open camera', 'תמונת ההוכחה': 'Proof photo',
  'הסרת התמונה': 'Remove photo', 'צילום תמונה נוספת': 'Take another photo', 'מעלה...': 'Uploading...', 'שולח...': 'Sending...',
  'לא הצלחנו לקרוא את התמונה, אפשר לנסות שוב': 'Could not read the photo, you can try again',
  'ההעלאה נכשלה, אפשר לנסות שוב. כדאי להשאיר את המסך פתוח.': 'Upload failed, you can try again. Keep the screen open.',
  'לדווח על ביצוע? אי אפשר לערוך אחרי השליחה.': 'Report as done? It cannot be edited after sending.',
  'כולם': 'Everyone', 'חודש קודם': 'Previous month', 'חודש הבא': 'Next month', 'הפעילויות שלי': 'My activities',
  'עוד לא הוספת פעילויות. לחצו על "הוספת פעילות".': 'No activities yet. Tap "Add activity".',
  'הוספת פעילות': 'Add activity', 'הוספת פעילות ליום הזה': 'Add activity for this day', 'אין פעילויות ביום הזה': 'No activities on this day',
  'לא הצלחנו לטעון את לוח השנה': 'Could not load the calendar', 'עריכת פעילות': 'Edit activity', 'פעילות חדשה': 'New activity',
  'שם הפעילות': 'Activity name', 'למשל: חוג כדורסל': 'For example: basketball class', 'של מי': 'Whose', 'תדירות': 'How often',
  'פעם אחת': 'Once', 'כל שבוע באותו יום': 'Every week on the same day', 'יום בשבוע': 'Day of the week', 'תאריך': 'Date',
  'משעה': 'From', 'עד שעה': 'Until', 'צריך להזין שם לפעילות': 'Enter a name for the activity',
  'צריך שעת התחלה ושעת סיום': 'A start time and an end time are required', 'שעת הסיום צריכה להיות אחרי שעת ההתחלה': 'The end time must be after the start time',
  'צריך לבחור תאריך': 'Choose a date', 'מחיקת הפעילות': 'Delete activity', 'למחוק את הפעילות?': 'Delete this activity?', 'המחיקה נכשלה': 'Delete failed',
  'א׳': 'Sun', 'ב׳': 'Mon', 'ג׳': 'Tue', 'ד׳': 'Wed', 'ה׳': 'Thu', 'ו׳': 'Fri', 'ש׳': 'Sat',
  'ראשון': 'Sunday', 'שני': 'Monday', 'שלישי': 'Tuesday', 'רביעי': 'Wednesday', 'חמישי': 'Thursday', 'שישי': 'Friday', 'שבת': 'Saturday',
  'היסטוריה ודיווחים': 'History and reports', 'יום': 'Day', 'שבוע': 'Week', 'חודש': 'Month', 'משימה': 'Task', 'כל המשימות': 'All tasks',
  'סיכום שבוע': 'Week summary', 'סיכום חודש': 'Month summary', 'נותרו': 'Remaining', 'רשימת דיווחים אחרונים': 'Recent reports',
  'אין דיווחים בתקופה הזאת': 'No reports in this period', 'לא הצלחנו לטעון נתונים': 'Could not load data', 'אתמול': 'Yesterday',
  'ביצע/ה:': 'completed:', 'תמונת הדיווח': 'Report photo', 'אין תמונה לדיווח הזה': 'No photo for this report', 'מחיקת הדיווח': 'Delete report',
  'למחוק את הדיווח הזה? אי אפשר לשחזר.': 'Delete this report? This cannot be undone.',
  'חנות': 'Shop', 'היתרה שלי': 'My balance', 'בקשות לאישור': 'Requests for approval', 'החנות': 'Shop', '+ מוצר חדש': '+ New item',
  'הרכישות שלי': 'My purchases', 'אין רכישות עדיין': 'No purchases yet', '🗑 מחיקת היסטוריית רכישות': '🗑 Delete purchase history',
  'ממתין לאישור': 'Waiting for approval', 'נמסר': 'Delivered', 'נדחה': 'Rejected', 'מימוש': 'Redeem', 'מוסתר מהילדים': 'Hidden from the kids',
  'עוד אין מוצרים. לחצו על "+ מוצר חדש".': 'No items yet. Tap "+ New item".', 'עוד אין מוצרים בחנות': 'No items in the shop yet',
  '· היתרה שלו/ה:': '· Their balance:', 'לפני הבקשה': 'before the request', 'דחייה': 'Reject', 'אין בקשות ממתינות': 'No pending requests',
  'אין מספיק נקודות': 'Not enough points', 'הבקשה נכשלה': 'The request failed', 'הבקשה נשלחה להורים': 'The request was sent to the parents',
  'העדכון נכשל': 'The update failed', 'ההיסטוריה נמחקה': 'History deleted',
  'לבטל את הבקשה? הנקודות יחזרו אליך.': 'Cancel the request? The points will return to you.',
  'לדחות? הנקודות יחזרו לילד/ה.': 'Reject? The points will return to the child.',
  'מחיקת היסטוריית רכישות': 'Delete purchase history', 'של כל בני הבית. בקשות שממתינות לאישור לא נמחקות.': 'For everyone in the home. Requests waiting for approval are not deleted.',
  'לא משנה אף יתרה.': 'Does not change any balance.', 'שימו לב: רכישות שנמסרו יימחקו והנקודות שלהן יחזרו ליתרה.': 'Note: delivered purchases will be deleted and their points will return to the balance.',
  'למחוק את הרכישות שנדחו?': 'Delete the rejected purchases?', 'למחוק את כל ההיסטוריה? הנקודות של רכישות שנמסרו יחזרו ליתרה.': 'Delete all history? The points of delivered purchases will return to the balance.',
  'עריכת מוצר': 'Edit item', 'מוצר חדש': 'New item', 'שם המוצר או המתנה': 'Item or gift name', 'תיאור (לא חובה)': 'Description (optional)',
  'מחיר בנקודות': 'Price in points', '📷 צילום': '📷 Take photo', '🖼️ תמונה': '🖼️ Photo', 'מוצג לילדים': 'Shown to the kids', 'הסרה': 'Remove',
  'צריך שם למוצר': 'The item needs a name', 'צריך מחיר בנקודות': 'A price in points is required', 'לא הצלחנו לקרוא את התמונה': 'Could not read the photo',
  'מחיקת המוצר': 'Delete item', 'למחוק את המוצר? רכישות קודמות נשמרות.': 'Delete the item? Previous purchases are kept.',
  'הוספת תרופה': 'Add medication', 'התרופות שלי': 'My medications', '7 הימים האחרונים': 'Last 7 days',
  'האפליקציה רק מזכירה ורושמת. היא לא מחליפה הוראות של רופא או רוקח.': 'The app only reminds and records. It does not replace instructions from a doctor or pharmacist.',
  'אני': 'Me', 'אין תרופות להיום': 'No medications today', 'לקחתי': 'Taken', 'עוד לא הוספת תרופות': 'No medications added yet', 'אין עדיין היסטוריה': 'No history yet',
  'עריכת תרופה': 'Edit medication', 'תרופה חדשה': 'New medication', 'שם התרופה': 'Medication name', 'מינון (למשל: כדור אחד)': 'Dose (for example: one pill)',
  'שעות': 'Times', '+ שעה': '+ Time', 'ימים (בלי בחירה = כל יום)': 'Days (none selected = every day)', 'עד תאריך (לא חובה)': 'Until date (optional)',
  'הערות (לא חובה)': 'Notes (optional)', 'מחיקה': 'Delete', 'צריך שם לתרופה': 'The medication needs a name', 'צריך לפחות שעה אחת': 'At least one time is required',
  'לא הצלחתי לשמור': 'Could not save', 'למחוק את התרופה?': 'Delete this medication?', 'נרשם ✓': 'Recorded ✓',
  'א': 'Sun', 'ב': 'Mon', 'ג': 'Tue', 'ד': 'Wed', 'ה': 'Thu', 'ו': 'Fri', 'ש': 'Sat',
  'המשימות שלנו': 'Our tasks', 'הבית שלנו | משימות': 'Our Home | Tasks',
  'מחר': 'Tomorrow', 'השבוע': 'This week', 'בן משפחה': 'Family member', 'סטטוס': 'Status',
  'כל המשפחה': 'Whole family', 'כל הסטטוסים': 'All statuses', 'אין משימות שמתאימות לסינון': 'No tasks match the filter'
};

const WD = { 'ראשון': 'Sunday', 'שני': 'Monday', 'שלישי': 'Tuesday', 'רביעי': 'Wednesday', 'חמישי': 'Thursday', 'שישי': 'Friday', 'שבת': 'Saturday' };
const MO = { 'ינואר': 'January', 'פברואר': 'February', 'מרץ': 'March', 'אפריל': 'April', 'מאי': 'May', 'יוני': 'June', 'יולי': 'July', 'אוגוסט': 'August', 'ספטמבר': 'September', 'אוקטובר': 'October', 'נובמבר': 'November', 'דצמבר': 'December' };
const WL = { 'א': 'Sun', 'ב': 'Mon', 'ג': 'Tue', 'ד': 'Wed', 'ה': 'Thu', 'ו': 'Fri', 'ש': 'Sat' };
const P = [
  [/^(\d{2}:\d{2})( · באיחור)?( · נלקחה ✓)?$/, (_, t, l, d) => `${t}${l ? ' · Late' : ''}${d ? ' · Taken ✓' : ''}`],
  [/^([\d:, ]+) · (כל יום|[אבגדהוש]( [אבגדהוש])*)(?: · עד (.+))?$/, (_, ts, days, _x, end) => `${ts} · ${days === 'כל יום' ? 'Every day' : days.split(' ').map(x => WL[x]).join(' ')}${end ? ' · until ' + end : ''}`],
  [/^(\d+) נקודות שמורות לבקשות שממתינות$/, '$1 points reserved for pending requests'],
  [/^חסרות (\d+)$/, 'Need $1 more'],
  [/^(.+) רוצה: (.+)$/, '$1 wants: $2'],
  [/^מחיקת רכישות שנדחו \((\d+)\)$/, 'Delete rejected purchases ($1)'],
  [/^מחיקת כל ההיסטוריה \((\d+)\)$/, 'Delete all history ($1)'],
  [/^שימו לב: רכישות שנמסרו יימחקו והנקודות שלהן יחזרו ליתרה\. (\d+) בקשות ממתינות יישארו\.$/, 'Note: delivered purchases will be deleted and their points will return to the balance. $1 waiting requests will stay.'],
  [/^לממש "([\s\S]+)" תמורת (\d+) נקודות\?\s+הנקודות יישמרו עד שהורה יאשר\.$/, 'Redeem "$1" for $2 points?\nThe points will be reserved until a parent approves.'],
  [/^(\d{2}:\d{2}) (היום|אתמול)$/, (_, h, d) => `${h} ${d === 'היום' ? 'Today' : 'Yesterday'}`],
  [/^(ינואר|פברואר|מרץ|אפריל|מאי|יוני|יולי|אוגוסט|ספטמבר|אוקטובר|נובמבר|דצמבר) (\d{4})$/, (_, m, y) => `${MO[m]} ${y}`],
  [/^כל יום (ראשון|שני|שלישי|רביעי|חמישי|שישי|שבת)$/, (_, d) => `Every ${WD[d]}`],
  [/^יום (ראשון|שני|שלישי|רביעי|חמישי|שישי|שבת), (\d+)\.(\d+)$/, (_, d, a, b) => `${WD[d]}, ${a}/${b}`],
  [/^(.*) · כל שבוע$/, '$1 · Every week'],
  [/^🎂 יום הולדת (\d+) ל(.+)$/, '🎂 $2 turns $1'],
  [/^הדיווח נשלח, \+(\d+) נקודות( \(באיחור\))?$/, (_, n, l) => `Report sent, +${n} points${l ? ' (overdue)' : ''}`],
  [/^השליחה נכשלה: (.*)$/, 'Sending failed: $1'],
  [/^יום (ראשון|שני|שלישי|רביעי|חמישי|שישי|שבת), (\d+)\.(\d+) ·$/, (_, d, a, b) => `${WD[d]}, ${a}/${b} ·`],
  [/^(\d+) פעמים ביום$/, '$1 times a day'],
  [/^המשימה רשומה על (.+)$/, 'This task is assigned to $1'],
  [/^בעוד יום אחד · יום הולדת (\d+)$/, 'In 1 day · turning $1'],
  [/^בעוד (\d+) ימים · יום הולדת (\d+)$/, 'In $1 days · turning $2'],
  [/^היום יום ההולדת! \(גיל (\d+)\)$/, 'Birthday today! (age $1)'],
  [/^🎂 נולד\/ה ב-(.+)$/, '🎂 Born on $1'],
  [/^🎂 יום הולדת שמח, (.+)! 🎉$/, '🎂 Happy birthday, $1! 🎉'],
  [/^⚠ משימה אחת צריכה מחליף\. לחצו לטיפול$/, '⚠ One task needs a replacement. Tap to handle'],
  [/^⚠ (\d+) משימות צריכות מחליף\. לחצו לטיפול$/, '⚠ $1 tasks need a replacement. Tap to handle'],
  [/^(.+) לא בבית · (.*)$/, '$1 is not home · $2'],
  [/^(\d+) בקשות מימוש מחכות לאישור$/, '$1 redemption requests are waiting for approval'],
  [/^(.+) ביצע\/ה: (.*)$/, '$1 completed: $2'],
  [/^הודעת מערכת · (.+)$/, 'System message · $1'],
  [/^הכרטיס של (.+)$/, "$1's card"],
  [/^השמירה נכשלה: (.*)$/, 'Saving failed: $1'],
  [/^(\d+\/\d+ )?הבא: (.+)$/, '$1Next: $2'],
  [/^הבדיקה נכשלה: (.*)$/, 'The test failed: $1']
];

const HEB = /[֐-׿]/;
function tr(s) {
  if (!s || !HEB.test(s)) return s;
  const lead = s.match(/^\s*/)[0], trail = s.match(/\s*$/)[0], core = s.trim();
  if (D[core] !== undefined) return lead + D[core] + trail;
  for (const [re, to] of P) if (re.test(core)) return lead + core.replace(re, to) + trail;
  return s;
}
export const t = (he) => (ENGLISH ? tr(he) : he);

const SKIP = '.bubble,.announce,.sys,.dtitle,.calmain b,.caltime,[data-user],textarea,script,style';
const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
function walk(root) {
  if (root.nodeType === 3) { const p = root.parentElement; if (p && !p.closest(SKIP)) { const n = tr(root.nodeValue); if (n !== root.nodeValue) root.nodeValue = n; } return; }
  if (root.nodeType !== 1) return;
  if (root.closest && root.closest(SKIP)) return;
  const all = [root, ...root.querySelectorAll('*')];
  for (const el of all) {
    if (el.closest(SKIP)) continue;
    for (const a of ATTRS) { const v = el.getAttribute && el.getAttribute(a); if (v && HEB.test(v)) { const n = tr(v); if (n !== v) el.setAttribute(a, n); } }
  }
  const tw = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = []; while (tw.nextNode()) nodes.push(tw.currentNode);
  nodes.forEach(n => { const p = n.parentElement; if (p && !p.closest(SKIP)) { const v = tr(n.nodeValue); if (v !== n.nodeValue) n.nodeValue = v; } });
}

export let ENGLISH = false;
// מפעיל אנגלית רק אם נבחרה וגם העמוד מסומן כמתורגם. מחזיר true אם הופעלה.
export function initI18n(active) {
  ENGLISH = getLang() === 'en' && TRANSLATED_PAGES.has(active);
  if (!ENGLISH) return false;
  const de = document.documentElement;
  de.dir = 'ltr'; de.lang = 'en';
  const run = () => {
    walk(document.body); document.title = tr(document.title);
    new MutationObserver(ms => {
      for (const m of ms) {
        if (m.type === 'childList') m.addedNodes.forEach(walk);
        else if (m.type === 'characterData') walk(m.target);
        else if (m.type === 'attributes') { const el = m.target, v = el.getAttribute(m.attributeName); if (v && HEB.test(v)) { const n = tr(v); if (n !== v) el.setAttribute(m.attributeName, n); } }
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  };
  if (document.body) run(); else document.addEventListener('DOMContentLoaded', run);
  const nativeAlert = window.alert.bind(window);
  window.alert = (m) => nativeAlert(tr(String(m)));
  const nativeConfirm = window.confirm.bind(window);
  window.confirm = (m) => nativeConfirm(tr(String(m)));
  return true;
}
