# Avion Marketplace - Admin Dashboard

## Overview
This project is an **Admin Dashboard** for managing orders in the **Avion Marketplace**, a Next.js-based e-commerce platform. It integrates **Sanity.io** as the backend to store and manage order details. The admin can track and update order statuses easily from this dashboard.

## Features
- **Order Management:** View all orders placed by customers.
- **Order Status Update:** Change order statuses from **Pending** to **Dispatched** or **Completed**.
- **Order Filtering:** View orders by status (**Pending, Dispatched, Completed**).
- **Order Details:** View detailed order information, including customer details and purchased items.
- **Secure Access:** Admin-only access to order data.

## Tech Stack
- **Frontend:** Next.js (React framework)
- **Backend:** Sanity.io (Headless CMS)
- **Styling:** Tailwind CSS
- **UI Enhancements:** SweetAlert2 for notifications

## Project Structure
```
├── app/
│   ├── components/
│   │   ├── ProtectedRoute.tsx  # Ensures only admins access the dashboard
|   |
│   ├── dashboard/
│   │   ├── page.tsx            # Main dashboard UI and logic
├── sanity/
│   ├── lib/
│   │   ├── client.ts           # Sanity client setup
│   │   ├── image.ts            # Image handling for Sanity
```

## Installation & Setup
### 1. Clone the Repository
```bash
git clone https://github.com/AreebaAijaz/avion-dashboard
cd avion-dashboard
```

### 2. Install Dependencies
```bash
npm install  # or yarn install
```

### 3. Configure Sanity
- Update `sanity/lib/client.ts` with your Sanity project credentials.

### 4. Run the Project
```bash
npm run dev  # or yarn dev
```

## Usage
1. Navigate to **`http://localhost:3000/dashboard`**.
2. use email: **areeba@gmail.com**        password: **areebaak**
3. View, filter, and update order statuses.
4. Click on the **eye icon** to see detailed order information.
5. Use the **dropdown** to change order statuses.



