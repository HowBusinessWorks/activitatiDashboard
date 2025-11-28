# Kanban Issues Dashboard - Setup Guide

## Phase 1: Project Setup ✅ COMPLETED

- Next.js project initialized
- Dependencies installed
- Project structure created
- CSV parser and importer created

## Phase 2: Supabase Setup (NEXT STEP)

### Step 1: Create a Supabase Project

1. Go to https://supabase.com
2. Sign up or log in
3. Create a new project
4. Note your project URL and anon key

### Step 2: Create Environment File

Create `.env.local` file in the project root:
```
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### Step 3: Create Database Tables

Execute these SQL commands in your Supabase SQL Editor:

#### Create Contracts Table
```sql
CREATE TABLE contracts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contract_id INTEGER UNIQUE NOT NULL,
  contract_name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contracts_contract_id ON contracts(contract_id);
```

#### Create Activities Table
```sql
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id INTEGER UNIQUE NOT NULL,
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('INSPECTION', 'CONSTRUCTION', 'INTERVENTION')),
  verified BOOLEAN DEFAULT FALSE,
  contractors TEXT,
  inspection_type TEXT,
  activity_date TIMESTAMP WITH TIME ZONE,
  report_date TIMESTAMP WITH TIME ZONE,
  stage_id INTEGER,
  stage_name TEXT,
  task_id INTEGER,
  task_name TEXT,
  objective_id INTEGER,
  objective_name TEXT,
  added_by_id INTEGER,
  added_by_name TEXT,
  raw_data_json JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_activities_activity_id ON activities(activity_id);
CREATE INDEX idx_activities_contract_id ON activities(contract_id);
CREATE INDEX idx_activities_type ON activities(type);
```

#### Create Issues Table
```sql
CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  activity_id UUID NOT NULL REFERENCES activities(id) ON DELETE CASCADE,
  contract_id UUID NOT NULL REFERENCES contracts(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  inspection_category TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'identified' CHECK (status IN ('identified', 'in_progress', 'done')),
  contractor_assigned TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_by TEXT,
  metadata JSONB
);

CREATE INDEX idx_issues_contract_id ON issues(contract_id);
CREATE INDEX idx_issues_activity_id ON issues(activity_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_issues_inspection_category ON issues(inspection_category);
```

### Step 4: Enable Row Level Security (Optional but Recommended)

For public access (as per requirements), you can disable RLS or configure it to allow public read:

```sql
-- Disable RLS for public access
ALTER TABLE contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE activities DISABLE ROW LEVEL SECURITY;
ALTER TABLE issues DISABLE ROW LEVEL SECURITY;

-- Grant permissions to anon role
GRANT SELECT, INSERT, UPDATE, DELETE ON contracts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON activities TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON issues TO anon;
```

---

## Phase 3: Data Import

### Step 1: Test the Application

```bash
npm run dev
```

Visit http://localhost:3000/upload

### Step 2: Upload the CSV

1. Navigate to the upload page
2. Select `export_Activities.csv`
3. Click "Upload and Import"
4. Wait for processing

### Step 3: View the Dashboard

Navigate to http://localhost:3000/dashboard to see your Kanban board

---

## What's Ready to Go

✅ Frontend structure
✅ CSV parser logic
✅ Database schema design
✅ Upload API route (ready to be built)
✅ Dashboard component (ready to be built)

## Next Steps

1. Set up Supabase project
2. Create database tables
3. Configure environment variables
4. Build the upload API route
5. Build the Kanban dashboard
6. Test end-to-end

---

## Project Structure

```
erorikanban/
├── app/
│   ├── page.tsx (Home page)
│   ├── layout.tsx
│   ├── globals.css
│   ├── dashboard/ (To be created)
│   ├── upload/ (To be created)
│   └── api/
│       └── upload/
│           └── csv/ (To be created)
├── lib/
│   ├── types.ts ✅
│   └── supabase/
│       ├── client.ts ✅
│       ├── csv-importer.ts ✅
│       └── issue-parser.ts ✅
├── components/ (To be created)
├── .env.local (To be created)
└── package.json ✅
```

---

## Questions or Issues?

- Ensure your Supabase project is active
- Check that environment variables are set correctly
- Verify CSV format matches expected structure
