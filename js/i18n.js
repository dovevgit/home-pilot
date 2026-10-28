/* שפות: עברית היא ברירת המחדל ולא נוגעים בה. אנגלית פועלת רק בעמודים שמסומנים כמתורגמים,
   ורק כשהמשתמש בחר אותה. התרגום נעשה על הטקסט שמוצג (מילון מדויק + תבניות), כך שמה שלא תורגם נשאר בעברית. */
const KEY = 'lang';
export const TRANSLATED_PAGES = new Set(['home', 'tasks', 'task', 'report', 'calendar', 'history', 'shop', 'meds', 'requests', 'important', 'games']);

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
  'בקשות פתוחות': 'Open requests', 'בקשה חדשה': 'New request', 'נסגרו לאחרונה': 'Recently closed',
  'דחית': 'You declined', 'אני לוקח/ת': "I'll take it", 'לא יכול/ה': "I can't", 'ביטול לקיחה': 'Release',
  'אין בקשות פתוחות': 'No open requests', 'עוד אין בקשות שנסגרו': 'No closed requests yet', 'לא הצלחנו לטעון בקשות': 'Could not load requests',
  'למחוק את הבקשה?': 'Delete this request?', 'הפעולה נכשלה, אפשר לנסות שוב': 'The action failed, you can try again',
  'מה צריך?': 'What is needed?', 'למשל: לקחת אותי לחוג מחר': 'For example: take me to class tomorrow', 'למי (אפשר לבחור כמה)': 'To whom (you can choose several)',
  'תאריך (אופציונלי)': 'Date (optional)', 'שעה (אופציונלי)': 'Time (optional)', 'שליחת בקשה': 'Send request',
  'צריך לכתוב מה הבקשה': 'Write what the request is', 'צריך לבחור למי לשלוח': 'Choose who to send it to', 'הבקשה נשלחה': 'Request sent',
  'שמורות': 'Saved', 'אין הודעות שמורות': 'No saved messages', 'הודעה חשובה': 'Important message',
  'ההודעה תקפוץ אצל מי שבחרתם בחלונית גדולה, עד שיענו לה.': 'The message will pop up in a big window for the people you choose, until they answer it.',
  'למי לשלוח?': 'Send to whom?', 'הודעה': 'Message', 'רשימת קניות': 'Shopping list', 'כתבו את ההודעה...': 'Write the message...',
  'כתבו את הרשימה, כל פריט בשורה חדשה...': 'Write the list, one item per line...', 'צילום': 'Take photo', 'תמונה': 'Photo',
  'תצוגה מקדימה (מנהלים)': 'Preview (admins)',
  'מראה איך החלונית נראית אצל הנמענים, על גבי דף הבית כמו הודעה אמיתית. לא נשלח ולא נשמר כלום.': 'Shows how the window looks for the recipients, over the home page like a real message. Nothing is sent or saved.',
  'הצג גם הודעה משולח נוסף': 'Also show a message from another sender', 'הצג לי איך זה נראה': 'Show me how it looks',
  '🔔 השמע צליל הודעה': '🔔 Play message sound', '📲 שלח לי התראת בדיקה לטלפון': '📲 Send me a test notification to my phone',
  'הצג איך נראית הודעה שמורה': 'Show how a saved message looks', 'הסתר את הדוגמה': 'Hide the example', 'הסתר דוגמה': 'Hide example',
  'דוגמה בלבד, לא נשמר כלום:': 'Example only, nothing is saved:', 'ההודעות ששלחתי': 'Messages I sent', 'הודעות שקיבלתי': 'Messages I received',
  'אל:': 'To:', 'מחק לכולם': 'Delete for everyone', 'פתח שיחה': 'Open conversation', 'הסר מהשמורות': 'Remove from saved', 'מחק': 'Delete',
  '✓ שמור': '✓ Saved', 'שמור אצלי': 'Save for me',
  'אין הודעות שמורות. בחלונית ההודעה יש כפתור "שמור אצלי"': 'No saved messages. The message window has a "Save for me" button',
  'עוד לא שלחתם הודעות': 'You have not sent any messages yet', 'אין הודעות שהתקבלו': 'No messages received', 'לא הצלחנו לטעון': 'Could not load',
  'התמונה לא נטענה': 'The photo did not load', 'בחרו למי לשלוח': 'Choose who to send to', 'כתבו את הרשימה': 'Write the list',
  'כתבו הודעה או צרפו תמונה': 'Write a message or attach a photo', 'ההודעה נשלחה': 'Message sent', 'השליחה נכשלה, נסו שוב': 'Sending failed, try again',
  'ההודעה נמחקה': 'Message deleted', 'רגע, האפליקציה עדיין נטענת': 'One moment, the app is still loading',
  'קודם יש להפעיל התראות: בתפריט, "הפעל התראות"': 'First turn on notifications: in the menu, "Turn on notifications"',
  'נשלחה התראה, תראה אותה עוד רגע': 'Notification sent, you will see it shortly', 'לא נמצא מכשיר שמחובר להתראות': 'No device connected to notifications was found',
  'השליחה נכשלה. בדקו שהפונקציה push פרוסה ב-Supabase': 'Sending failed. Check that the push function is deployed in Supabase',
  'למחוק את ההודעה אצלך? אצל הצד השני היא תישאר.': 'Delete the message for you? It will stay for the other side.',
  'למחוק את ההודעה אצל כולם, גם אצל מי שקיבל אותה?': 'Delete the message for everyone, including whoever received it?',
  'למחוק את כל השיחה אצלך? אצל הצד השני היא תישאר.': 'Delete the whole conversation for you? It will stay for the other side.',
  'סגור': 'Close', 'יש לך הודעות חשובות': 'You have important messages', 'קרא הודעה': 'Read message',
  'החלונית תישאר עד שתענו לכל ההודעות': 'The window stays until you answer all the messages', 'שלח/ה לך הודעה חשובה': 'sent you an important message',
  'שליחת תשובה': 'Send reply', 'קראתי, בלי תשובה': 'I read it, no reply', 'השיחה ביניכם': 'Your conversation', 'מחק את כל השיחה אצלי': 'Delete the whole conversation for me',
  'לא הצלחנו לטעון את ההודעה': 'Could not load the message', 'כתבו תשובה או צרפו תמונה': 'Write a reply or attach a photo',
  'זו הייתה תצוגה בלבד, לא נשלח ולא נשמר כלום': 'This was a preview only, nothing was sent or saved', 'התשובה נשלחה': 'Reply sent',
  'נשמר באזור "שמורות" בעמוד הודעה חשובה': 'Saved in the "Saved" area of the Important message page', 'סומן כנקרא': 'Marked as read',
  'הפעולה נכשלה, נסו שוב': 'The action failed, try again', 'לא הצלחנו לטעון את השיחה': 'Could not load the conversation',
  'אין הודעות בשיחה': 'No messages in the conversation', 'השיחה נמחקה': 'Conversation deleted',
  'חי צומח דומם': 'Animal Plant Object', 'משחק מילים לכל המשפחה': 'Word game for the whole family (Hebrew)',
  'דמקה': 'Checkers', 'משחק לזוג, חוקי דמקה אמיתיים': 'Two-player game, real checkers rules',
  'צוללות': 'Battleship', 'משחק לזוג, להטביע את הצי של היריב': 'Two-player game, sink the opponent\'s fleet',
  'פוקר': 'Poker', 'טקסס הולדם לעד 6 שחקנים': "Texas Hold'em for up to 6 players",
  'שש בש': 'Backgammon', 'משחק לזוג, שש בש קלאסי': 'Two-player game, classic backgammon',
  "21 (בלאק ג'ק)": 'Blackjack (21)', 'מול הדילר, לבד או עם המשפחה': 'Against the dealer, alone or with the family',
  'משחק אסטרטגיה לזוג, לתפוס את הדגל': 'Two-player strategy game, capture the flag',
  'טטריס': 'Tetris', 'משחק ליחיד, להרכיב שורות שלמות': 'Single-player game, complete whole rows',
  'משחק פתוח!': 'Open game!', 'תורך!': 'Your turn!', 'שולחן פתוח!': 'Open table!', 'אתה בשולחן': "You're at the table",
  'המשימות שלנו': 'Our tasks', 'הבית שלנו | משימות': 'Our Home | Tasks',
  'מחר': 'Tomorrow', 'השבוע': 'This week', 'בן משפחה': 'Family member', 'סטטוס': 'Status',
  'כל המשפחה': 'Whole family', 'כל הסטטוסים': 'All statuses', 'אין משימות שמתאימות לסינון': 'No tasks match the filter'
};

const WD = { 'ראשון': 'Sunday', 'שני': 'Monday', 'שלישי': 'Tuesday', 'רביעי': 'Wednesday', 'חמישי': 'Thursday', 'שישי': 'Friday', 'שבת': 'Saturday' };
const MO = { 'ינואר': 'January', 'פברואר': 'February', 'מרץ': 'March', 'אפריל': 'April', 'מאי': 'May', 'יוני': 'June', 'יולי': 'July', 'אוגוסט': 'August', 'ספטמבר': 'September', 'אוקטובר': 'October', 'נובמבר': 'November', 'דצמבר': 'December' };
const WL = { 'א': 'Sun', 'ב': 'Mon', 'ג': 'Tue', 'ד': 'Wed', 'ה': 'Thu', 'ו': 'Fri', 'ש': 'Sat' };
const STR = { 'ממתינה': 'Waiting', 'נלקחה': 'Taken', 'בוצעה': 'Done', 'נדחתה': 'Declined' };
const dueEn = x => x === 'היום' ? 'Today' : x.replace(/^יום (\S+) (\d+)\.(\d+)$/, (_, d, a, b) => `${(WD[d] || d).slice(0, 3)} ${a}/${b}`);
const P = [
  [/^(אני · )?היום · (\d{2}:\d{2})$/, (_, me, t) => `${me ? 'Me · ' : ''}Today · ${t}`],
  [/^אני · (\d+\.\d+\.\d+ · \d{2}:\d{2})$/, 'Me · $1'],
  [/^שולח לדוגמה: (.+)$/, 'Example sender: $1'],
  [/^(.+) ✓ נקרא( \(עוד לא ענה\))?$/, (_, n, a) => `${n} ✓ Read${a ? ' (not answered yet)' : ''}`],
  [/^(.+) · טרם נקרא$/, '$1 · Not read yet'],
  [/^כתבו תשובה ל(.+)\.\.\.$/, 'Write a reply to $1...'],
  [/^יש לך הודעה חדשה(?: \((\d+)\))?$/, (_, n) => `You have a new message${n ? ' (' + n + ')' : ''}`],
  [/^התשובה נשלחת רק ל(.+)$/, 'The reply is sent only to $1'],
  [/^בתגובה להודעה שלך: (.*)$/, 'In reply to your message: $1'],
  [/^(ממתינה|נלקחה|בוצעה|נדחתה)(?: · (.+))?$/, (_, st, who) => STR[st] + (who ? ' · ' + who : '')],
  [/^מאת (.+?) · ל(.+?)((?: · .+)?)$/, (_, f, to, due) => `From ${f} · to ${to === 'כולם' ? 'everyone' : to}${due ? ' · ' + due.slice(3).split(' · ').map(dueEn).join(' · ') : ''}`],
  [/^הבקשה סומנה כבוצעה, (.*) קיבל\/ה (\d+) נקודות$/, 'Request marked as done, $1 got $2 points'],
  [/^מי שיבצע את הבקשה יקבל (\d+) נקודות\.$/, 'Whoever does the request gets $1 points.'],
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

const SKIP = '.bubble,.announce,.sys,.dtitle,.gi,.mrow p,.xlist span,.impmsg p,.impitem span,.calmain b,.caltime,[data-user],textarea,script,style';
const SKIP_ATTR = SKIP.replace(',textarea', '');
const ATTRS = ['placeholder', 'aria-label', 'title', 'alt'];
function walk(root) {
  if (root.nodeType === 3) { const p = root.parentElement; if (p && !p.closest(SKIP)) { const n = tr(root.nodeValue); if (n !== root.nodeValue) root.nodeValue = n; } return; }
  if (root.nodeType !== 1) return;
  if (root.closest && root.closest(SKIP)) return;
  const all = [root, ...root.querySelectorAll('*')];
  for (const el of all) {
    if (el.closest(SKIP_ATTR)) continue;
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
