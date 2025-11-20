// Mock data for demo mode - hard-coded users, tasks, clients
export const DEMO_USERS = [
  {
    id: 1,
    name: "Sarah Johnson",
    phone: "+1234567890",
    password: "demo123",
    department: "Management",
    role: "Manager",
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    name: "Mike Chen",
    phone: "+1234567891",
    password: "demo123",
    department: "Development",
    role: "Developer",
    created_at: "2024-01-16T10:00:00Z"
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    phone: "+1234567892",
    password: "demo123",
    department: "Design",
    role: "Designer",
    created_at: "2024-01-17T10:00:00Z"
  },
  {
    id: 4,
    name: "James Wilson",
    phone: "+1234567893",
    password: "demo123",
    department: "Development",
    role: "Developer",
    created_at: "2024-01-18T10:00:00Z"
  },
  {
    id: 5,
    name: "Lisa Anderson",
    phone: "+1234567894",
    password: "demo123",
    department: "Marketing",
    role: "Executive",
    created_at: "2024-01-19T10:00:00Z"
  }
];

export const DEMO_CLIENTS = [
  {
    id: 1,
    name: "Acme Corporation",
    contact_name: "Robert Brown",
    contact_phone: "+1555123456",
    email: "robert@acmecorp.com",
    created_at: "2024-01-10T10:00:00Z"
  },
  {
    id: 2,
    name: "TechStart Inc",
    contact_name: "Jennifer Lee",
    contact_phone: "+1555234567",
    email: "jennifer@techstart.com",
    created_at: "2024-01-12T10:00:00Z"
  },
  {
    id: 3,
    name: "Global Solutions Ltd",
    contact_name: "David Kim",
    contact_phone: "+1555345678",
    email: "david@globalsolutions.com",
    created_at: "2024-01-14T10:00:00Z"
  },
  {
    id: 4,
    name: "Creative Studios",
    contact_name: "Amanda White",
    contact_phone: "+1555456789",
    email: "amanda@creativestudios.com",
    created_at: "2024-01-16T10:00:00Z"
  }
];

export const DEMO_TASKS = [
  // High Priority - Overdue
  {
    id: 1,
    title: "Fix critical bug in payment gateway",
    description: "Payment processing is failing for some credit cards. Need immediate fix.",
    status: "in_progress",
    priority: "high",
    deadline: "2024-11-18",
    created_by: 1,
    assigned_to: [2],
    client_id: 1,
    checklist: [
      { text: "Identify the root cause", completed: true },
      { text: "Implement fix", completed: true },
      { text: "Test with all card types", completed: false },
      { text: "Deploy to production", completed: false }
    ],
    updates: [
      { user_name: "Mike Chen", content: "Found the issue - it's related to the Stripe API version. Working on a fix now.", created_at: "2024-11-18T10:30:00Z" },
      { user_name: "Sarah Johnson", content: "Great! Keep me updated on the testing progress.", created_at: "2024-11-18T14:20:00Z" },
      { user_name: "Mike Chen", content: "Fix implemented. Running tests now with different card types.", created_at: "2024-11-19T09:15:00Z" }
    ],
    attachments: [
      { name: "error-logs.pdf", url: "#", type: "pdf", size: 245000, uploaded_at: "2024-11-18T09:00:00Z" },
      { name: "payment-flow-diagram.png", url: "#", type: "image", size: 128000, uploaded_at: "2024-11-18T11:30:00Z" }
    ],
    voice_notes: [
      { url: "#", duration: 45, uploaded_at: "2024-11-18T10:00:00Z" }
    ],
    created_at: "2024-11-15T09:00:00Z",
    updated_at: "2024-11-19T14:30:00Z"
  },
  {
    id: 2,
    title: "Redesign landing page for mobile",
    description: "Current mobile experience needs improvement based on user feedback.",
    status: "assigned",
    priority: "high",
    deadline: "2024-11-19",
    created_by: 1,
    assigned_to: [3],
    client_id: 2,
    checklist: [
      { text: "Review user feedback", completed: true },
      { text: "Create wireframes", completed: false },
      { text: "Design mockups", completed: false },
      { text: "Get client approval", completed: false }
    ],
    updates: [
      { user_name: "Emily Rodriguez", content: "Reviewed all the user feedback. Main pain points are navigation and CTA placement.", created_at: "2024-11-17T11:00:00Z" }
    ],
    attachments: [
      { name: "user-feedback-summary.pdf", url: "#", type: "pdf", size: 180000, uploaded_at: "2024-11-17T09:00:00Z" }
    ],
    created_at: "2024-11-16T10:00:00Z",
    updated_at: "2024-11-16T10:00:00Z"
  },
  
  // High Priority - Due Today
  {
    id: 3,
    title: "Complete Q4 analytics report",
    description: "Compile all metrics and prepare presentation for stakeholders.",
    status: "in_progress",
    priority: "high",
    deadline: new Date().toISOString().split('T')[0],
    created_by: 1,
    assigned_to: [5],
    client_id: null,
    checklist: [
      { text: "Gather data from all sources", completed: true },
      { text: "Create visualizations", completed: true },
      { text: "Write executive summary", completed: false },
      { text: "Prepare presentation slides", completed: false }
    ],
    updates: [
      { user_name: "Lisa Anderson", content: "Data collection complete. Starting on the visualizations now.", created_at: "2024-11-19T09:00:00Z" },
      { user_name: "Lisa Anderson", content: "Charts looking good! Moving on to the executive summary.", created_at: "2024-11-20T10:30:00Z" }
    ],
    attachments: [
      { name: "q4-raw-data.xlsx", url: "#", type: "document", size: 520000, uploaded_at: "2024-11-19T08:30:00Z" },
      { name: "analytics-charts.pdf", url: "#", type: "pdf", size: 340000, uploaded_at: "2024-11-20T11:00:00Z" }
    ],
    voice_notes: [
      { url: "#", duration: 120, uploaded_at: "2024-11-19T15:00:00Z" }
    ],
    created_at: "2024-11-18T08:00:00Z",
    updated_at: "2024-11-20T11:00:00Z"
  },
  {
    id: 4,
    title: "Security audit for user authentication",
    description: "Comprehensive review of authentication system and security measures.",
    status: "assigned",
    priority: "high",
    deadline: new Date().toISOString().split('T')[0],
    created_by: 1,
    assigned_to: [2, 4],
    client_id: 3,
    checklist: [
      { text: "Review current authentication flow", completed: false },
      { text: "Check for vulnerabilities", completed: false },
      { text: "Test password security", completed: false },
      { text: "Document findings", completed: false }
    ],
    attachments: [
      { name: "security-requirements.pdf", url: "#", type: "pdf", size: 156000, uploaded_at: "2024-11-19T09:00:00Z" }
    ],
    created_at: "2024-11-19T09:00:00Z",
    updated_at: "2024-11-19T09:00:00Z"
  },

  // Medium Priority - This Week
  {
    id: 5,
    title: "Implement dark mode toggle",
    description: "Add theme switching functionality across the application.",
    status: "in_progress",
    priority: "medium",
    deadline: "2024-11-22",
    created_by: 1,
    assigned_to: [4],
    client_id: null,
    checklist: [
      { text: "Set up theme context", completed: true },
      { text: "Update all components", completed: false },
      { text: "Test across browsers", completed: false },
      { text: "Add user preference storage", completed: false }
    ],
    updates: [
      { user_name: "James Wilson", content: "Theme context is working! Now updating individual components.", created_at: "2024-11-19T14:00:00Z" },
      { user_name: "Sarah Johnson", content: "Looking forward to seeing this in action!", created_at: "2024-11-19T16:30:00Z" }
    ],
    voice_notes: [
      { url: "#", duration: 30, uploaded_at: "2024-11-19T14:15:00Z" }
    ],
    created_at: "2024-11-18T10:00:00Z",
    updated_at: "2024-11-19T16:00:00Z"
  },
  {
    id: 6,
    title: "Create onboarding tutorial",
    description: "Interactive walkthrough for new users to understand the platform.",
    status: "assigned",
    priority: "medium",
    deadline: "2024-11-23",
    created_by: 5,
    assigned_to: [3],
    client_id: null,
    checklist: [
      { text: "Script the tutorial steps", completed: false },
      { text: "Design UI components", completed: false },
      { text: "Implement interactive elements", completed: false },
      { text: "User testing", completed: false }
    ],
    created_at: "2024-11-19T11:00:00Z",
    updated_at: "2024-11-19T11:00:00Z"
  },
  {
    id: 7,
    title: "Optimize database queries",
    description: "Improve performance by optimizing slow database queries.",
    status: "assigned",
    priority: "medium",
    deadline: "2024-11-24",
    created_by: 1,
    assigned_to: [2],
    client_id: 1,
    checklist: [
      { text: "Identify slow queries", completed: false },
      { text: "Add database indexes", completed: false },
      { text: "Optimize query structure", completed: false },
      { text: "Benchmark improvements", completed: false }
    ],
    attachments: [
      { name: "query-performance-report.pdf", url: "#", type: "pdf", size: 290000, uploaded_at: "2024-11-19T12:00:00Z" }
    ],
    created_at: "2024-11-19T12:00:00Z",
    updated_at: "2024-11-19T12:00:00Z"
  },

  // Completed Tasks
  {
    id: 8,
    title: "Set up CI/CD pipeline",
    description: "Automated testing and deployment pipeline for the project.",
    status: "completed",
    priority: "high",
    deadline: "2024-11-15",
    created_by: 1,
    assigned_to: [4],
    client_id: null,
    checklist: [
      { text: "Configure GitHub Actions", completed: true },
      { text: "Set up testing workflow", completed: true },
      { text: "Configure deployment", completed: true },
      { text: "Document the process", completed: true }
    ],
    updates: [
      { user_name: "James Wilson", content: "CI/CD pipeline is live! All tests passing.", created_at: "2024-11-15T15:00:00Z" },
      { user_name: "Sarah Johnson", content: "Excellent work! This will save us a lot of time.", created_at: "2024-11-15T17:00:00Z" }
    ],
    attachments: [
      { name: "cicd-documentation.pdf", url: "#", type: "pdf", size: 420000, uploaded_at: "2024-11-15T16:00:00Z" }
    ],
    created_at: "2024-11-10T09:00:00Z",
    updated_at: "2024-11-15T17:00:00Z"
  },
  {
    id: 9,
    title: "Update API documentation",
    description: "Comprehensive documentation for all API endpoints.",
    status: "completed",
    priority: "medium",
    deadline: "2024-11-17",
    created_by: 5,
    assigned_to: [2],
    client_id: null,
    checklist: [
      { text: "Document all endpoints", completed: true },
      { text: "Add code examples", completed: true },
      { text: "Include error responses", completed: true },
      { text: "Publish to developer portal", completed: true }
    ],
    updates: [
      { user_name: "Mike Chen", content: "Documentation is complete and published!", created_at: "2024-11-17T15:00:00Z" }
    ],
    created_at: "2024-11-12T10:00:00Z",
    updated_at: "2024-11-17T15:00:00Z"
  },
  {
    id: 10,
    title: "Design new email templates",
    description: "Modern, responsive email templates for notifications.",
    status: "completed",
    priority: "low",
    deadline: "2024-11-14",
    created_by: 5,
    assigned_to: [3],
    client_id: 4,
    checklist: [
      { text: "Design templates in Figma", completed: true },
      { text: "Code HTML/CSS", completed: true },
      { text: "Test across email clients", completed: true },
      { text: "Implement in system", completed: true }
    ],
    updates: [
      { user_name: "Emily Rodriguez", content: "Templates are ready! Client approved the designs.", created_at: "2024-11-13T14:00:00Z" },
      { user_name: "Emily Rodriguez", content: "Implementation complete. Emails looking great across all clients!", created_at: "2024-11-14T16:00:00Z" }
    ],
    attachments: [
      { name: "email-templates-preview.pdf", url: "#", type: "pdf", size: 560000, uploaded_at: "2024-11-13T15:00:00Z" }
    ],
    created_at: "2024-11-08T09:00:00Z",
    updated_at: "2024-11-14T16:00:00Z"
  },

  // On Hold
  {
    id: 11,
    title: "Integrate third-party CRM",
    description: "Connect with Salesforce for customer data synchronization.",
    status: "on_hold",
    priority: "medium",
    deadline: "2024-11-25",
    created_by: 1,
    assigned_to: [4],
    client_id: 3,
    checklist: [
      { text: "Review Salesforce API docs", completed: true },
      { text: "Set up authentication", completed: false },
      { text: "Implement data sync", completed: false },
      { text: "Test integration", completed: false }
    ],
    updates: [
      { user_name: "James Wilson", content: "Reviewed the API docs. Ready to proceed once we get credentials.", created_at: "2024-11-17T11:00:00Z" },
      { user_name: "Sarah Johnson", content: "Reached out to client. They'll send credentials by end of week.", created_at: "2024-11-18T14:00:00Z" }
    ],
    attachments: [
      { name: "salesforce-integration-plan.pdf", url: "#", type: "pdf", size: 380000, uploaded_at: "2024-11-17T10:00:00Z" }
    ],
    created_at: "2024-11-17T10:00:00Z",
    updated_at: "2024-11-18T14:00:00Z"
  },
  {
    id: 12,
    title: "Migrate to new hosting provider",
    description: "Move infrastructure to AWS for better performance.",
    status: "on_hold",
    priority: "low",
    deadline: "2024-11-30",
    created_by: 1,
    assigned_to: [2, 4],
    client_id: null,
    checklist: [
      { text: "Evaluate AWS services", completed: true },
      { text: "Plan migration strategy", completed: true },
      { text: "Set up AWS infrastructure", completed: false },
      { text: "Migrate data", completed: false },
      { text: "Update DNS", completed: false }
    ],
    updates: [
      { user_name: "Mike Chen", content: "Migration plan is ready. Waiting for budget approval to proceed.", created_at: "2024-11-17T13:00:00Z" }
    ],
    voice_notes: [
      { url: "#", duration: 180, uploaded_at: "2024-11-17T12:00:00Z" }
    ],
    created_at: "2024-11-16T11:00:00Z",
    updated_at: "2024-11-17T13:00:00Z"
  },

  // Low Priority - Future
  {
    id: 13,
    title: "Add multi-language support",
    description: "Internationalization for Spanish and French languages.",
    status: "assigned",
    priority: "low",
    deadline: "2024-12-05",
    created_by: 5,
    assigned_to: [4],
    client_id: null,
    checklist: [
      { text: "Set up i18n framework", completed: false },
      { text: "Extract all text strings", completed: false },
      { text: "Translate to Spanish", completed: false },
      { text: "Translate to French", completed: false },
      { text: "Test language switching", completed: false }
    ],
    created_at: "2024-11-20T09:00:00Z",
    updated_at: "2024-11-20T09:00:00Z"
  },
  {
    id: 14,
    title: "Create admin dashboard analytics",
    description: "Advanced analytics and reporting for administrators.",
    status: "assigned",
    priority: "low",
    deadline: "2024-12-10",
    created_by: 1,
    assigned_to: [5],
    client_id: null,
    checklist: [
      { text: "Define key metrics", completed: false },
      { text: "Design dashboard layout", completed: false },
      { text: "Implement data collection", completed: false },
      { text: "Create visualizations", completed: false }
    ],
    created_at: "2024-11-21T10:00:00Z",
    updated_at: "2024-11-21T10:00:00Z"
  },
  {
    id: 15,
    title: "Implement export to Excel feature",
    description: "Allow users to export task lists and reports to Excel files.",
    status: "assigned",
    priority: "low",
    deadline: "2024-12-08",
    created_by: 1,
    assigned_to: [2],
    client_id: 2,
    checklist: [
      { text: "Research Excel export libraries", completed: false },
      { text: "Design export format", completed: false },
      { text: "Implement export functionality", completed: false },
      { text: "Add download button to UI", completed: false }
    ],
    created_at: "2024-11-22T11:00:00Z",
    updated_at: "2024-11-22T11:00:00Z"
  }
];

// Demo credentials for easy access
export const DEMO_CREDENTIALS = {
  manager: {
    phone: "+1234567890",
    password: "demo123",
    name: "Sarah Johnson (Manager)"
  },
  developer: {
    phone: "+1234567891",
    password: "demo123",
    name: "Mike Chen (Developer)"
  },
  designer: {
    phone: "+1234567892",
    password: "demo123",
    name: "Emily Rodriguez (Designer)"
  }
};