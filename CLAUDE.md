# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an automated stock data collection and visualization system. It fetches stock data from TongHuaShun (同花顺) financial platform via GitHub Actions, stores it in Supabase database, and displays it through a modern Next.js web dashboard deployed on Vercel.

## Architecture

The system consists of four main components:

1. **Data Collection (`fetch_stock_data.py`)**: Core Python script that uses `pywencai` library to query TongHuaShun API with specific stock screening criteria
2. **Database Storage**: Supabase PostgreSQL database with a `stocks` table containing comprehensive stock information
3. **Web Interface**: Next.js + TypeScript dashboard with Tailwind CSS for modern data visualization and analysis
4. **Automation**: GitHub Actions workflow that runs on weekdays at 9:27 AM Beijing time

## Key Commands

```bash
# Install dependencies
pip install -r requirements.txt

# Run the main script locally (requires environment variables)
python fetch_stock_data.py

# Next.js Development Commands
npm install                    # Install dependencies
npm run dev                   # Start development server (http://localhost:3000)
npm run build                 # Build for production
npm run start                 # Start production server
npm run lint                  # Run ESLint

# Test database connection
python test_connection.py

# Setup environment variables (copy and modify)
cp setup_env.sh my_setup_env.sh

# Test GitHub Actions workflow manually
gh workflow run "股票数据获取定时任务"

# View recent workflow runs
gh run list --limit 5

# Check workflow logs
gh run view <run-id> --log

# Debug commands
python -c "import pywencai; print('pywencai version:', pywencai.__version__)"  # Check pywencai version
python -c "from supabase import create_client; print('Supabase client ready')"  # Test Supabase import
```

## Environment Variables

**For Python Data Collection (GitHub Actions):**
- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_KEY`: Supabase service role key (not anon key)
- `THS_COOKIE`: Authentication cookie from TongHuaShun website
- `DINGTALK_WEBHOOK`: DingTalk robot webhook URL (optional)

**For Next.js Frontend (Vercel):**
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL (public)
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key (public)

**Local Development:**
Copy `.env.example` to `.env.local` and fill in your Supabase credentials

## Database Setup

Execute `supabase_setup.sql` in Supabase SQL Editor to create the database schema. The script creates:
- `stocks` table with comprehensive stock data fields
- Unique constraints on `(code, update_date)`
- Proper indexes for performance
- Row Level Security policies

## Stock Screening Criteria

The system queries stocks matching these conditions:
- Non-ST stocks, non-STAR market
- Auction price change between 1%-6%
- TTM PE ratio (not loss-making)
- Large order net volume > 0
- Auction volume ratio > 1
- 10-day gain ≥ 10%, 5-day gain ≥ 10%
- Listed for more than 100 days

## Field Mapping Challenges

TongHuaShun API returns field names with date suffixes (e.g., `竞价涨幅[20250903]`). The code uses:
- `get_value_fuzzy()` for partial string matching
- `get_interval_change()` for handling multiple time interval fields
- Data cleaning before database insertion

## GitHub Actions Workflow

The workflow (`.github/workflows/stock-data.yml`):
- Runs on weekdays at 9:27 AM Beijing time (`cron: '27 1 * * 1-5'`)
- Supports manual triggering via `workflow_dispatch`
- Uploads Excel files as artifacts for 7 days
- Uses Python 3.9 environment

## Troubleshooting

Common issues:
- **Cookie expiration**: THS_COOKIE needs periodic renewal from browser
- **Duplicate key errors**: The script handles this by deleting existing daily data before insertion
- **Field mapping failures**: Field names from TongHuaShun API may change, requiring updates to mapping logic

## Next.js Web Dashboard

The Next.js application provides:
- Modern responsive web interface with Tailwind CSS
- Real-time stock data visualization with interactive tables
- Statistical summaries (total stocks, positive/negative counts, averages)
- Date-based filtering for historical data analysis
- TypeScript for enhanced code reliability and developer experience

**Key Features:**
- Server-side rendering for optimal performance
- API routes for clean data separation
- Responsive design optimized for all devices
- Loading states and error handling

## Core Dependencies

**Python (Data Collection):**
- **pywencai**: TongHuaShun (同花顺) API client for stock data queries
- **supabase**: Python client for Supabase database operations
- **pandas**: Data manipulation and analysis
- **openpyxl**: Excel file generation for data export

**JavaScript/TypeScript (Frontend):**
- **Next.js 14**: React framework with TypeScript support
- **@supabase/supabase-js**: JavaScript client for Supabase database operations
- **Tailwind CSS**: Utility-first CSS framework for styling
- **React 18**: Frontend library for building user interfaces

## Key Scripts and Components

**Python Scripts:**
- `fetch_stock_data.py`: Main data collection script with TongHuaShun API integration
- `test_connection.py`: Database connectivity testing utility
- `setup_env.sh`: Template for environment variable configuration

**Next.js Application:**
- `pages/index.tsx`: Main dashboard page with stock data visualization
- `components/StockTable.tsx`: Reusable stock data table component
- `components/StatsCard.tsx`: Statistics display component
- `lib/supabase.ts`: Supabase client configuration and API functions
- `lib/types.ts`: TypeScript type definitions based on database schema
- `pages/api/`: API routes for data fetching (stocks, stats, dates)

## Testing

**Python Data Collection:**
1. **Database connection**: Run `python test_connection.py`
2. **Data collection**: Run `python fetch_stock_data.py` locally with proper environment variables
3. **GitHub Actions**: Trigger workflow manually via GitHub Actions UI

**Next.js Frontend:**
1. **Local development**: Run `npm run dev` and visit `http://localhost:3000`
2. **Build verification**: Run `npm run build` to check for TypeScript/build errors
3. **API testing**: Test API routes at `/api/stocks`, `/api/stats`, `/api/dates`
4. **Environment setup**: Ensure `.env.local` has correct Supabase credentials

**Deployment:**
1. **Vercel deployment**: Connect GitHub repo to Vercel for automatic deployments
2. **Environment variables**: Configure Supabase credentials in Vercel dashboard
3. **Production testing**: Verify live site functionality after deployment

**Full System Verification:**
1. GitHub Actions writes data → Supabase
2. Next.js reads data ← Supabase  
3. Vercel serves the application to users

## Vercel Deployment

**Setup Steps:**
1. **Connect Repository**: Link your GitHub repository to Vercel
2. **Configure Build**: Vercel automatically detects Next.js configuration
3. **Environment Variables**: Add the following in Vercel dashboard:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. **Deploy**: Vercel automatically deploys on every push to main branch

**Deployment Configuration:**
- Build Command: `npm run build`
- Output Directory: `.next`
- Node.js Version: 18.x or higher
- Environment: Production optimizations enabled

**Monitoring:**
- Check Vercel function logs for API route debugging
- Monitor build times and deployment status
- Use Vercel Analytics for performance insights