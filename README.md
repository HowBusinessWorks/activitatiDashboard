# Kanban Issues Dashboard

A modern web application for managing construction company issues using a Kanban board interface. Built with Next.js, Supabase, and React.

## Features

✨ **Kanban Board**: Drag-and-drop interface with 3 columns (Issues, In Progress, Done)
📊 **Contract Management**: Select and filter issues by contract
🏷️ **Inspection Categories**: Filter issues by inspection type
📁 **CSV Import**: Upload and parse construction activity data
🌍 **Real-time Updates**: Supabase integration for data persistence
📱 **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Custom components + Lucide icons
- **CSV Processing**: PapaParse

## Project Structure

```
erorikanban/
├── app/
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   ├── globals.css              # Global styles
│   ├── dashboard/
│   │   └── page.tsx             # Main Kanban dashboard
│   ├── upload/
│   │   └── page.tsx             # CSV upload interface
│   └── api/
│       └── upload/
│           └── csv/
│               └── route.ts      # CSV processing API
├── components/
│   ├── KanbanBoard.tsx          # Main Kanban board component
│   ├── IssueCard.tsx            # Individual issue card
│   ├── ContractSelector.tsx     # Contract dropdown
│   └── InspectionFilterPanel.tsx # Filter controls
├── lib/
│   ├── types.ts                 # TypeScript type definitions
│   └── supabase/
│       ├── client.ts            # Supabase client setup
│       ├── csv-importer.ts      # CSV parsing & import logic
│       └── issue-parser.ts      # Issue extraction from CSV
├── public/                       # Static files
├── SETUP_GUIDE.md               # Detailed setup instructions
├── package.json                 # Dependencies
├── next.config.js               # Next.js config
├── tsconfig.json                # TypeScript config
└── tailwind.config.ts           # Tailwind CSS config
```

## Quick Start

### 1. Prerequisites

- Node.js 18+ installed
- Supabase account

### 2. Clone & Install

```bash
# Install dependencies
npm install
```

### 3. Supabase Setup

1. Create a new Supabase project at https://supabase.com
2. Get your project URL and anon key
3. Create the database tables (see SETUP_GUIDE.md for SQL)
4. Create `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 4. Run the Application

```bash
npm run dev
```

Visit:
- Home: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard
- Upload: http://localhost:3000/upload

## Usage

### Upload Data

1. Navigate to `/upload`
2. Select your CSV file (export_Activities.csv)
3. Click "Upload and Import"
4. Wait for processing to complete

### View Issues

1. Navigate to `/dashboard`
2. Select a contract from the dropdown
3. (Optional) Filter by inspection type
4. View issues in the Kanban board

### Manage Issues

- **Drag & Drop**: Move cards between columns to change status
  - Identified → In Progress → Done
- **View Details**: Click a card to see full information
- **Update Status**: Status changes are saved automatically to Supabase

## Data Flow

```
CSV File
   ↓
Upload API (/api/upload/csv)
   ↓
CSV Parser (parseActivitiesCSV)
   ↓
Issue Extractor (parseIdentifiedIssues)
   ↓
Supabase Database
   ↓
Dashboard Display
```

## Database Schema

### contracts
- `id`: UUID (Primary Key)
- `contract_id`: Integer (Unique)
- `contract_name`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp

### activities
- `id`: UUID (Primary Key)
- `activity_id`: Integer (Unique)
- `contract_id`: UUID (Foreign Key)
- `type`: ENUM (INSPECTION, CONSTRUCTION, INTERVENTION)
- `verified`: Boolean
- `contractors`: Text
- `inspection_type`: Text
- Additional metadata and timestamps

### issues
- `id`: UUID (Primary Key)
- `activity_id`: UUID (Foreign Key)
- `contract_id`: UUID (Foreign Key)
- `title`: Text (Issue description)
- `inspection_category`: Text
- `status`: ENUM (identified, in_progress, done)
- `contractor_assigned`: Text (Optional)
- `notes`: Text (Optional)
- `metadata`: JSONB (Extensible)
- Timestamps and created_by

## API Endpoints

### POST /api/upload/csv
Upload and import CSV file

**Request:**
```
FormData with 'file' field containing CSV

**Response:**
```json
{
  "success": boolean,
  "message": string,
  "stats": {
    "contractsUpserted": number,
    "activitiesUpserted": number,
    "issuesCreated": number
  }
}
```

## CSV Format

Expected columns (from export_Activities.csv):
- activityId
- type (INSPECTION, CONSTRUCTION, INTERVENTION)
- verified (TRUE/FALSE)
- contractors
- data (JSON)
- date
- reportDate
- stageId, stageName
- taskId, taskName
- objectiveId, objectiveName
- contractId, contractName
- addedById, addedByName
- identifiedIssues (text field with issue descriptions)

## Future Enhancements

- 🔐 User authentication & authorization
- 📊 Analytics dashboard with charts
- 📧 Email notifications
- 💬 Issue comments & activity log
- 📱 Mobile app version
- 🔔 Real-time subscriptions for live updates
- 🎯 Priority levels & due dates
- 👥 Contractor management

## Development

### Run Tests (when added)
```bash
npm test
```

### Build for Production
```bash
npm run build
npm start
```

### Linting
```bash
npm run lint
```

## Troubleshooting

### Issues not appearing
- Verify CSV data was uploaded successfully
- Check contract selection
- Check inspection type filter

### Database connection errors
- Verify `.env.local` has correct Supabase credentials
- Check Supabase project is active
- Verify network connection

### CSV upload fails
- Ensure file is valid CSV format
- Check file contains required columns
- Try uploading smaller test file first

## Contributing

This is a project-specific application. For modifications or improvements, please contact the development team.

## License

Proprietary - All rights reserved

## Contact

For questions or support, contact the development team.
