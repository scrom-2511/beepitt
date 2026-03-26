# Beepitt

**Beepitt** is a high-performance event monitoring and multi-channel notification platform. It provides developers and operations teams with real-time tracking of application issues, incidents, and system health across multiple environments—while ensuring total control over notification delivery.

---

## Features

- **Multi-Channel Delivery:** Route critical alerts to **Telegram, Discord, Slack, and Email** seamlessly.
- **Smart Throttling:** Prevent "alert fatigue" with customizable throttling windows at both global and individual event levels.
- **Environment Context:** Track events across Production, Staging, QA, Development, and Sandbox.
- **Detailed Insights:** Automated tracking of file paths, line numbers, and occurrences to expedite debugging.
- **Multi-Project Management:** Support for multiple projects within a single unified dashboard.
- **Flexible Integration:** Identifier-based event tracking for easy integration with any application logic.
- **Tiered Subscriptions:** Usage management and premium features handled via Razorpay (Free, Starter, Pro tiers).

## Technology Stack

### Frontend

- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS 4 + Framer Motion (premium animations) + Shadcn
- **UI Architecture:** Radix UI primitives
- **Analytics:** Chart.js for visualizing system performance and event metrics

### Backend

- **Core:** Node.js + TypeScript + Express 5
- **ORM:** Prisma
- **Database:** PostgreSQL
- **Background Jobs:** BullMQ + Redis + Kafka for resilient event processing
- **Integrations:**
  - **Messaging:** Telegram Bot API, Discord.js, Slack (via Axios), Mailgun (Email)
  - **Payments:** Razorpay
  - **Auth:** OAuth (Google, Discord) + JWT

## Project Structure

```text
├── backend/            # Express.js + Prisma server
│   ├── src/           # TypeScript source files
│   ├── prisma/        # Database schema and migrations
│   └── scripts/       # Utility scripts
├── frontend/           # React 19 + Vite application
│   ├── src/           # Components, hooks, and pages
│   └── public/        # Static assets
└── README.md           # Documentation
```

## Getting Started

### Prerequisites

- Node.js (v20 or newer recommended)
- PostgreSQL
- Redis
- Kafka (Optional for event-heavy environments)
- BullMQ

### Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/yourusername/beepitt.git
   cd beepitt
   ```

2. **Setup Backend:**

   ```bash
   cd backend
   npm install
   # Create a .env file based on the environment variables needed
   npx prisma generate
   npm run dev
   ```

3. **Setup Frontend:**
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

## License

This project is licensed under the **ISC License**.
