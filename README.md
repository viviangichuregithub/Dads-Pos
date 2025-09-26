# Shoe World Sales POS

## 📖 Inspiration

This project is inspired by my dad’s business, where everything is managed using books and manual records. While effective for a small shop, manual tracking has major limitations:

* Sales and stock updates are slow and error-prone.
* No easy way to view daily or weekly performance.
* Employee accountability is hard to enforce.
* Expenses are tracked separately, making it difficult to measure profit.

This APP digitizes the process while staying simple and business-friendly.

---

## 🎯 Goal of the APP

To provide a **centralized platform** for managing:

* Employees
* Inventory
* Sales
* Expenses
* User accounts and profiles

All activities are tracked daily to improve **accountability**, **transparency**, and **decision-making**.

---

## 👥 Target Users

* **Admin**

  * Creates and manages staff accounts.
  * Tracks sales, inventory, expenses, and employee performance.
  * Has access to all audit trails.

* **Staff**

  * Records sales.
  * Views their own performance on the dashboard.
  * Manages their own profile.
 
---
 
## ⚡ Core APP Features

### 👨‍💼 Employees

* Add new employees.
* Store employee data securely.
* Manage staff roles and permissions.

### 📊 Dashboard

* Sales and inventory trends using charts and graphs.
* Daily and weekly performance summaries.
* Visual tracking of sales targets.

### 💰 Sales

* Staff can add sales transactions.
* Sales automatically update inventory.
* All sales are tracked daily for accountability.

### 📦 Inventory

* Add new inventory items (products, stock levels, pricing).
* Edit or update existing inventory records.
* **Import** inventory data from Excel (bulk upload).
* **Export** inventory data to Excel (for reports or backups).
* Stock levels update automatically when sales are recorded.

### 🔐 Audit & Tracking

Every action in the system is logged and linked to the user who performed it.

Examples:

* Who added/edited inventory.
* Which staff recorded a sale.
* What expenses were logged and by whom.
* When data was imported/exported.

This ensures **transparency and accountability** across the business.


### ⚙️ Settings

* **Users**: Admins can create and delete user accounts.
* **Profile**: Users can update their personal details and password.
* **Inventory Trail**: Tracks every transaction and change made to inventory and sales.
* **Expenses**: Add and track expenses per day.

---

## 🏗️ System Structure

### Frontend ( Next.js + Tailwind CSS )

* Responsive and role-based UI.
* Charts and graphs for analytics (Recharts).
* Smooth user experience with reusable components.

### Backend ( Flask )

* Authentication and role management.
* CRUD operations for employees, sales, inventory, and expenses.
* Endpoints for dashboard analytics.
* Audit trail logging for every action.

### Database

* **Users**: Admins & staff.
* **Employees**: Employee details.
* **Sales**: Linked to users & inventory.
* **Inventory**: Products and stock levels.
* **Expenses**: Daily expense logs.
* **Audit Trail**: Tracks all activity.

---

## 🗂️ Project Structure

```
/src
  /app
    /auth        → login & registration
    /admin       → dashboards, employees, inventory, expenses
    /staff       → sales & personal dashboard
    /settings    → user management, profile, system settings
  /components   → reusable UI components
  /lib          → API client
  /hooks        → auth & custom logic  & helpers

```

---

## Why This APP Matters

* **For Admins**: full visibility into sales, expenses, and staff activity.
* **For Staff**: a simple tool to log sales and see their targets.
* **For the Business**: reduces reliance on books, increases accuracy, and makes scaling possible.

---

## 🔮 Future Roadmap

Beyond the MVP, we envision:

* Advanced analytics (profit margins, forecasts).
* Mobile app version for staff.
* Multi-store support.
* Integration with mobile money/payments.

---
Perfect ✨ Thanks for clarifying! Since this is **both inspired by your dad’s shoe shop and customized to his specific needs**, we’ll reflect that in the **Author & License** section. Here’s the updated professional draft for your README:

---

## 📜 License

This project is licensed under the **MIT License** – you are free to use, modify, and distribute it, provided proper attribution is given.



---

## 👤 Author

**Shoe World Inventory & Sales System**
A custom-built MVP tailored to the needs of a local shoe shop, inspired by my father’s business which previously relied on traditional bookkeeping.

* **Author:** [Vivian Wanja Gichure]
* **Inspiration:** Designed to replace manual record-keeping with a modern, digital, and trackable system.
* **Customization:** Every feature — from **employees management**, **inventory tracking**, **sales logging**, **expenses recording**, to **dashboard insights** — has been tailored to the daily operations of a shoe shop.
