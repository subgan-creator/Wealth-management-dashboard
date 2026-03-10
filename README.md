# Wealth Management Request Dashboard

A modern, intelligent request management system designed specifically for wealth management teams. Streamline complex workflows, automate routing, and keep your team coordinated with real-time tracking and intelligent request management.

## 🎯 Overview

The Wealth Management Request Dashboard is a comprehensive web application that helps financial advisory teams manage work requests efficiently. It provides smart request routing, SLA tracking, team management, and detailed request lifecycle management—all in an intuitive, user-friendly interface.

## 🚀 Key Features

- **Smart Request Routing** - Automatically direct requests to the right teams based on type and priority
- **SLA Tracking** - Real-time alerts when deadlines approach or are at risk
- **Flexible Configuration** - Customize business events, sub-events, and routing rules without technical expertise
- **Team Management** - Assign team members and manage permissions with ease
- **User Preferences** - Each team member controls what they see and how they're notified
- **Rich Request Details** - Comments, attachments, activity history all in one place

## 💡 Problem It Solves

Wealth management teams struggle with:
- Complex multi-step request workflows that are difficult to track
- No clear visibility into request status and deadlines
- Manual assignment processes that cause delays
- Difficulty managing SLAs across different request types
- No centralized view for request history and communication

This dashboard provides a unified platform to manage all of these challenges efficiently.

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: React hooks, SWR for data fetching
- **Icons**: Lucide React
- **Package Manager**: pnpm

## 📦 Getting Started

### Prerequisites
- Node.js 18+ installed
- pnpm package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/wealth-management-dashboard.git
cd wealth-management-dashboard
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
├── app/
│   ├── layout.tsx              # Root layout with theme setup
│   ├── page.tsx                # Main dashboard page
│   ├── overview/               # Dashboard overview landing page
│   ├── features/               # Features showcase page
│   ├── request/[id]/           # Individual request detail page
│   └── settings/               # Settings and preferences pages
├── components/
│   ├── dashboard-layout.tsx    # Main layout wrapper
│   ├── business-event-tree.tsx # Sidebar navigation tree
│   ├── request-list.tsx        # List of requests
│   ├── request-detail/         # Request detail components
│   ├── sub-event-detail-pane.tsx # Bottom pane for sub-event details
│   ├── search-filters.tsx      # Filter controls
│   └── features-showcase.tsx   # Features display component
├── lib/
│   ├── types.ts                # TypeScript type definitions
│   ├── mock-data.ts            # Mock data for development
│   └── utils.ts                # Utility functions
├── public/                     # Static assets
└── styles/
    └── globals.css             # Global styles and design tokens
```

## 🎨 Features Showcase

The dashboard includes several key sections:

### 1. Dashboard Overview
- High-level statistics and metrics
- Quick action buttons
- Request status breakdown
- Quick access to common actions

### 2. Request Management
- Filter requests by business event and sub-event
- Search and filter capabilities
- Real-time status updates
- SLA status indicators

### 3. Request Details
- Comprehensive request information
- Comments and activity timeline
- Attachment management
- Status and priority controls
- Team assignment

### 4. Settings & Configuration
- User preferences management
- Notification settings per event
- Business event configuration
- Team member management

## 🔄 Main Workflows

### Creating a Request
1. Click "New Request" button
2. Fill in request details
3. Select business event and sub-event
4. Assign to team members
5. Submit

### Filtering by Business Event
1. Select a business event from the left sidebar
2. Optionally select a sub-event
3. View requests specific to that event
4. Sub-event details appear in bottom reading pane

### Managing Request Details
1. Click on any request to open full details page
2. View or edit status, priority, and assignments
3. Add comments and attachments
4. Review activity timeline
5. Expand to full-screen view for detailed work

## 🎯 User Preferences

Each team member can customize:
- Which business events they see
- Notification preferences per event/sub-event
- Email and in-app notification toggles
- Display preferences

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Vercel automatically deploys on push
4. Set environment variables in Vercel dashboard

### Custom Deployment

```bash
# Build for production
pnpm build

# Start production server
pnpm start
```

## 📝 Environment Variables

Create a `.env.local` file in the root directory (example):

```env
# Add any required environment variables here
# Keep sensitive data out of version control
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📋 Development Guidelines

- Use TypeScript for all new code
- Follow existing component patterns
- Keep components focused and reusable
- Use Tailwind CSS for styling
- Maintain responsive design (mobile-first approach)
- Add proper error handling and loading states

## 🧪 Testing

Currently using mock data for development. In production, integrate with your backend API.

Mock data locations:
- `lib/mock-data.ts` - Mock requests and business events
- Components accept request data as props

## 📚 API Integration Ready

The dashboard is structured to easily integrate with backend APIs:

1. Replace mock data with API calls in `useEffect` hooks
2. Use SWR for data fetching and caching
3. Implement proper error handling
4. Add authentication/authorization

## 🔐 Security

- No sensitive credentials in code
- Environment variables for secrets
- SQL injection prevention (when using databases)
- XSS protection through React
- CSRF tokens for API calls (when applicable)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Support

For issues and questions:
- Open an issue on GitHub
- Check existing issues for solutions
- Contact the development team

## 🗺️ Roadmap

- [ ] Backend API integration
- [ ] Database persistence
- [ ] Advanced reporting and analytics
- [ ] Email notifications
- [ ] Calendar view for deadlines
- [ ] Mobile app version
- [ ] Advanced filtering and saved views
- [ ] Batch operations
- [ ] Workflow automation

## 📞 Contact

For more information about the Wealth Management Request Dashboard, contact the development team or visit the project repository.

---

**Built with ❤️ for wealth management teams**
