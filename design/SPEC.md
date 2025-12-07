# Birthday Reminder App - Product Specification

## Overview

A family-focused birthday and anniversary reminder app that helps households track important dates, with a unique "person anchor" feature that shows whose friend/connection each birthday belongs to.

## Core Value Proposition

1. **15-second entry** - Add a birthday in under 15 seconds
2. **Person Anchors** - Know instantly "whose friend is Mia?" (Emily's friend)
3. **Household sharing** - Both parents see the same list, real-time sync
4. **Yearly event tracking** - Party dates and gift tracking that resets sensibly each year
5. **Reliable notifications** - The one thing that must work perfectly

---

## Target Users

- **Primary:** Parents managing kids' social calendars (birthday parties, school friends)
- **Secondary:** Couples tracking extended family/friend birthdays together
- **Tertiary:** Individuals wanting a simple, reliable birthday reminder

---

## Platforms

- iOS (App Store)
- Android (Google Play Store)
- Shared backend with real-time sync

---

## Feature Specification

### 1. Authentication

| Feature | Details |
|---------|---------|
| Apple Sign-In | Required (iOS App Store rule) |
| Google Sign-In | Required (Android primary, iOS optional) |
| Email/Password | NOT included - simplifies everything |
| Session persistence | Stay logged in until explicit logout |

**User flow:**
1. Open app → See sign-in screen
2. Tap "Continue with Apple" or "Continue with Google"
3. Authenticate via native flow
4. If new user → Create account, proceed to household setup
5. If existing user → Load data, go to home screen

---

### 2. Household Setup

**First-time user flow:**
1. "What's your name?" → Free text
2. "Add your family members" → Add names of people in household
   - Each member has: Name, Role (Adult/Child)
   - Adults can be invited to share the account
   - Children are just names (for person anchors)
3. "Invite your partner?" → Optional, can skip and do later
   - Generate invite link/code
   - Partner signs in with Apple/Google, enters code
   - Both accounts now share the same birthday list

**Data model:**
```
Household
├── id
├── created_at
├── Members[]
│   ├── id
│   ├── name
│   ├── role (adult/child)
│   ├── user_id (nullable - only for adults with accounts)
│   └── is_owner
```

**Divorce/separation support:**
- Either adult can "Leave household"
- Option to: Copy all data to new solo household, or start fresh
- Other adult retains original household

---

### 3. People (Birthday Records)

**Required fields:**
- Name (free text)
- Birthday (month + day)

**Optional fields:**
- Birth year (for age calculation)
- Person anchor(s) - which household member(s) know this person
- Relationship type (Friend, Family, School, Work, Neighbour, Other)
- Permanent notes (e.g., "allergic to nuts", "likes dinosaurs")
- Deceased flag (changes display, stops "turning X" messages)
- Custom reminder settings (override defaults)

**Auto-calculated:**
- Age (if birth year provided)
- Zodiac sign (Western)
- Days until birthday

**15-second entry flow:**
1. Tap "+" FAB
2. Type name (auto-focus on name field)
3. Tap date field → Quick date picker (scroll wheels)
4. Tap "Save"
5. Done. Optional fields available but not shown by default.

**Person Anchor UI:**
- Below date field: "Who knows [Name]?" 
- Show household member chips: [Emily] [Jack] [Sarah] [Family]
- Tap to select (multi-select allowed)
- "Family" is a special option meaning "everyone"

---

### 4. Yearly Events

**Concept:** Each birthday spawns a "yearly event" as it approaches. This separates permanent info from this-year-specific info.

**When created:** Automatically when birthday is within 60 days

**Yearly event fields:**
- Party date (if different from birthday)
- Party time
- Party location (free text)
- Gift bought (checkbox)
- Gift description (what did we get them?)
- RSVP sent (checkbox)
- Card sent (checkbox)
- Notes this year (e.g., "Bring $15 for games")

**Lifecycle:**
1. Birthday approaches (60 days out) → Yearly event created
2. User can add party details, mark gift bought, etc.
3. Birthday passes → Yearly event archived
4. Next year → New yearly event created

**Gift history:**
- Previous years' yearly events remain accessible
- View: "What did we get Mia last year?" → "Art set from Smiggle"

---

### 5. Reminders & Notifications

**Default reminder schedule:**
- 7 days before
- 1 day before
- Day of (morning)

**Configurable:**
- Add/remove reminder times (1, 3, 7, 14, 30 days before)
- Time of day for reminders (default: 8:00 AM local)
- Per-person overrides

**Notification content:**
```
Title: "🎂 Mia Thompson turns 9 in 7 days"
Body: "Emily's friend"
```

```
Title: "🎂 Grandma's birthday today!"
Body: "She's turning 72"
```

**Technical approach:**
- Firebase Cloud Messaging for push notifications
- Backend scheduler checks daily, queues notifications
- Also write to device calendar as backup (optional, user can enable)

**Reliability measures:**
- Prompt user to disable battery optimization (Android)
- Test notification on first setup
- "Notification not working?" troubleshooting in settings

---

### 6. Views & Navigation

**Bottom navigation:**
1. **Home** (Upcoming) - Default view
2. **Calendar** - Month view
3. **People** - Full list
4. **Settings**

#### Home / Upcoming View
- **This Week** section (prominent, cards with countdown)
- **This Month** section
- **Later** section (next 30 days)

Card shows:
- Name
- "Turns [age]" or just date if no year
- "[X] days" countdown
- Person anchor ("Emily's friend")
- Quick checkboxes if within 14 days: ☐ Gift ☐ RSVP

#### Calendar View
- Month grid with dots on birthday days
- Tap day → See that day's birthdays
- Swipe to change months
- Optional: Highlight "this week"

#### People View
- Alphabetical list by default
- Filter by: Person anchor, Relationship type
- Search bar at top
- Tap person → Detail view

#### Detail View
- Photo placeholder (initials avatar)
- Name, Age (if known), Zodiac
- Birthday date + countdown
- Person anchor chips
- Relationship type
- Permanent notes
- **This Year** section (if upcoming):
  - Party date/time/location
  - Gift bought ☑
  - RSVP sent ☑
  - Notes this year
- **Past Years** (expandable)
- Edit / Delete buttons

---

### 7. Data Entry

**Manual entry:**
- "+" FAB on home screen
- Single screen form
- Required: Name, Date
- Optional: Everything else (collapsed by default)
- "Save" always visible
- "Save & Add Another" for batch entry

**Import from contacts:**
- Settings → Import from Contacts
- Request permission
- Show list of contacts with birthdays
- Multi-select checkboxes
- "Import Selected" button
- Map contact name, birthday
- No person anchor assigned (user can add later)

**Date picker:**
- Scroll wheel style (fast for known dates)
- Month + Day primary
- Year optional (toggle to show/hide)
- Handle Feb 29: Show option for leap year preference

---

### 8. Feb 29 (Leap Year) Handling

**When adding a Feb 29 birthday:**
- Show option: "In non-leap years, remind me on:"
  - Feb 28 (default)
  - March 1
  - Only in leap years

**Storage:** Store actual date (Feb 29) + preference flag

---

### 9. Offline Support

**Requirement:** App must work offline, sync when back online

**Approach:**
- Local SQLite database (via Drift for Flutter)
- All reads from local DB
- Writes go to local DB immediately, sync queue
- Background sync when online
- Conflict resolution: Last-write-wins with timestamp

**Sync indicators:**
- Subtle "Syncing..." indicator
- "Last synced: 2 min ago" in settings
- "Offline mode" banner if extended offline period

---

### 10. Widgets

**iOS Widget (WidgetKit):**
- Small: Next birthday (name + days)
- Medium: Next 3 birthdays
- Large: This week's birthdays

**Android Widget:**
- Similar sizes
- Tap to open app

---

### 11. Settings

| Setting | Default | Options |
|---------|---------|---------|
| Default reminder times | 7d, 1d, day-of | Multi-select |
| Reminder time | 8:00 AM | Time picker |
| Show zodiac signs | Off | Toggle |
| Feb 29 default | Feb 28 | Feb 28 / March 1 / Leap only |
| Theme | System | Light / Dark / System |
| Export data | - | CSV export |
| Sync to calendar | Off | Toggle + calendar selection |
| Household | - | View members, invite, leave |
| Account | - | Sign out, delete account |

---

### 12. Data Export

**Export to CSV:**
- Name, Birthday, Birth Year, Age, Anchor, Relationship, Notes
- One row per person

**Sync to device calendar:**
- Create "Birthdays" calendar
- Add recurring annual events
- Update when birthdays added/changed

---

## Non-Functional Requirements

### Performance
- App launch: < 2 seconds
- Add birthday: < 15 seconds end-to-end
- Sync: < 5 seconds for typical dataset (< 200 birthdays)

### Reliability
- Notifications must fire 99%+ of the time
- Offline mode must work indefinitely
- No data loss on sync conflicts

### Security
- All data encrypted in transit (HTTPS)
- Authentication via Apple/Google (no password storage)
- No sensitive data stored (no photos, no payment info)

### Privacy
- No analytics/tracking beyond crash reporting
- No data sold to third parties
- GDPR compliant (delete account = delete all data)

---

## Out of Scope (V1)

- Photo storage
- Gift purchasing / affiliate links
- Social features / sharing publicly
- Greeting card designer
- Group birthday coordination
- Milestone alerts (100 days, etc.)
- "Famous birthdays" feature
- Scheduled message sending

---

## Success Metrics

1. **Activation:** User adds 5+ birthdays within first week
2. **Retention:** User opens app at least 1x per week
3. **Core value:** 90%+ of reminders result in app open within 24 hours
4. **Household:** 30%+ of users invite a partner

---

## Appendix: User Stories

### First-Time User
1. Download app
2. Sign in with Apple/Google
3. Enter my name, add family members (kids)
4. Import birthdays from contacts (bulk)
5. Manually add a few more (kids' friends)
6. Invite partner to share
7. Done - wait for reminders

### Adding a Birthday (Fast Path)
1. Open app
2. Tap "+"
3. Type "Mia Thompson"
4. Pick March 15
5. Tap [Emily] chip
6. Tap "Save"
7. Total time: < 15 seconds

### Party Invite Received
1. Get party invite for Mia
2. Open app, find Mia
3. Add party date: March 18, 2pm
4. Add location: Timezone Eastland
5. Tap "RSVP sent" ✓
6. Later: Buy gift, tap "Gift bought" ✓, add "Bluey toy"

### Checking What's Coming Up
1. Open app (or glance at widget)
2. See: "This Week: Mia (3 days), Grandma (5 days)"
3. Tap Mia to see details
4. Confirm gift is sorted

### Partner Experience
1. Receive invite link from partner
2. Tap link, sign in with Google
3. Enter household code
4. See all birthdays partner already added
5. Both can add/edit, changes sync instantly
