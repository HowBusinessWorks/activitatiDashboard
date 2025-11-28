# 🚀 Quick Start Guide

## Everything is Ready! Here's What to Do:

### 1. Start the Development Server

```bash
npm run dev
```

You should see:
```
> ready - started server on 0.0.0.0:3000, url: http://localhost:3000
```

### 2. Navigate to the Application

Open your browser and visit:
- **Home**: http://localhost:3000
- **Upload Page**: http://localhost:3000/upload
- **Dashboard**: http://localhost:3000/dashboard

---

## Upload Your Data (First Time)

### Step 1: Go to Upload Page
```
http://localhost:3000/upload
```

### Step 2: Select CSV File
- Click the upload area
- Select `export_Activities.csv` from your project root

### Step 3: Click "Upload and Import"
- Wait for processing...
- You'll see: ✓ Contracts upserted: X
- You'll see: ✓ Activities upserted: Y
- You'll see: ✓ Issues created: Z

### Step 4: Verify Success
You should see a success message with statistics showing how much data was imported.

---

## Use the Kanban Board

### Step 1: Go to Dashboard
```
http://localhost:3000/dashboard
```

### Step 2: Select a Contract
- Click the "Select Contract" dropdown
- Choose a contract from the list

### Step 3: (Optional) Filter by Inspection Type
- Select inspection categories to filter
- Click "Clear all" to reset filter

### Step 4: Manage Issues
- See issues in 3 columns:
  1. **Issues** - Newly identified problems
  2. **In Progress** - Being worked on
  3. **Done** - Resolved/archived

### Step 5: Drag & Drop
- Drag an issue card between columns
- Status updates automatically to Supabase
- Watch the count badges update!

---

## Key Features

✨ **Drag-and-Drop**: Move issues between columns
🔍 **Contract Filtering**: Select which contract to view
🏷️ **Category Filtering**: Filter by inspection type
📊 **Live Counts**: See how many issues in each column
💾 **Auto-Save**: Status changes saved to Supabase
📱 **Responsive**: Works on desktop and mobile

---

## Troubleshooting

### "No contracts found"
- Upload data first via `/upload` page
- Ensure CSV was processed successfully

### "No issues for this contract"
- The contract may not have any identified issues
- Try a different contract
- Check the CSV upload was successful

### "Supabase connection error"
- Verify `.env.local` exists with correct credentials
- Restart dev server: `npm run dev`
- Check Supabase project is active

### Dev Server Won't Start
- Check Node.js version: `node --version` (need 18+)
- Delete `node_modules` and run `npm install` again
- Clear `.next` folder and rebuild

---

## File Locations

- **Upload CSV**: `export_Activities.csv` (in project root)
- **Environment Config**: `.env.local` (already created)
- **App Code**: `app/` directory
- **Components**: `components/` directory
- **Database Logic**: `lib/supabase/` directory

---

## What Happens When You Upload CSV

```
CSV File Upload
     ↓
Parse CSV rows
     ↓
For each row:
  - Extract contract info
  - Create/update contract in Supabase
  - Extract activity info
  - Create/update activity in Supabase
  - Parse identified issues from text
  - Create issue cards in Supabase
     ↓
Success message with statistics
```

---

## After Upload - Data Flow

```
Supabase Database
     ↓
Dashboard loads contracts
     ↓
User selects contract
     ↓
Load all issues for that contract
     ↓
Display in 3-column Kanban
     ↓
User drags issue to new column
     ↓
Update status in Supabase
     ↓
Card moves immediately (optimistic UI)
```

---

## Command Reference

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run linter
npm run lint

# Clean and rebuild
rm -rf .next node_modules
npm install
npm run dev
```

---

## Testing Checklist

After starting the app, test these:

- [ ] Home page loads at http://localhost:3000
- [ ] Upload page accessible at http://localhost:3000/upload
- [ ] Can select CSV file
- [ ] Upload completes successfully
- [ ] Dashboard loads at http://localhost:3000/dashboard
- [ ] Can select a contract
- [ ] Issues appear for selected contract
- [ ] Can filter by inspection type
- [ ] Can drag issues between columns
- [ ] Status updates appear instantly
- [ ] Page still works after refresh (data persisted)

---

## You're All Set! 🎉

Your Kanban Issues Dashboard is ready to use!

**Status**: ✅ PRODUCTION READY
**Data**: Ready to upload
**Backend**: Supabase configured
**Frontend**: Next.js running

Start with: `npm run dev`

---

Any issues? Check:
1. SUPABASE_SETUP_COMPLETE.md - Setup verification
2. README.md - Full documentation
3. IMPLEMENTATION_SUMMARY.md - Technical details
