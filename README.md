# 🚀 GitHub Issue & PR Dashboard

A simple web app that integrates with the **GitHub API** to give you a clean dashboard of all your issues and pull requests across repositories.
Built with **Next.js + Tailwind CSS** and GitHub OAuth.

---

## ✨ Features

- 🔑 Login with your GitHub account (OAuth)
- 📋 View all issues and pull requests assigned to you or created by you
- 🏷️ See repository name, labels, status (open/closed), and direct GitHub links
- 🔍 Filter by:
  - Open vs. Closed
  - Assigned to me vs. Created by me
  - Repository
- ⚡ Responsive UI with loading & error states

---

## 🛠️ Tech Stack

- [Next.js](https://nextjs.org/) – React framework with API routes
- [Tailwind CSS](https://tailwindcss.com/) – Modern utility-first CSS
- [GitHub API](https://docs.github.com/en/rest) – Issues & PRs data
- [NextAuth.js](https://next-auth.js.org/) – Secure GitHub OAuth

---

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn
- A GitHub account

---

## 🚧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/lassestilvang/github-issue-pr-dashboard.git
cd github-issue-pr-dashboard
```

### 2. Create a GitHub OAuth App

1. Go to [GitHub → Developer Settings → OAuth Apps](https://github.com/settings/developers).
2. Click **New OAuth App**.
3. Fill in the following details:
   - **Application name:** GitHub Issue & PR Dashboard (or any name you prefer)
   - **Homepage URL:** `http://localhost:3000` (for local development)
   - **Authorization callback URL:** `http://localhost:3000/api/auth/callback/github`
   - **Description:** (optional) A dashboard for viewing GitHub issues and PRs
4. Click **Register application**.
5. After creation, copy the **Client ID** and **Client Secret** (you'll need these for environment variables).

### 3. Configure Environment Variables

Create a `.env.local` file in the project root directory:

```bash
# GitHub OAuth Credentials
GITHUB_CLIENT_ID=your_github_client_id_here
GITHUB_CLIENT_SECRET=your_github_client_secret_here

# NextAuth Configuration
NEXTAUTH_SECRET=your_random_secret_here
NEXTAUTH_URL=http://localhost:3000
```

**Notes:**

- Replace `your_github_client_id_here` and `your_github_client_secret_here` with the values from your GitHub OAuth app.
- Generate `NEXTAUTH_SECRET` using: `openssl rand -base64 32` (or use an online generator).
- `NEXTAUTH_URL` should be `http://localhost:3000` for local development.

### 4. Install Dependencies

```bash
npm install
```

### 5. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser. You should be able to log in with GitHub and view your issues/PRs.

### 6.a Deploy to Vercel (One-Click Deployment)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/lassestilvang/github-issue-pr-dashboard)

### 6.b Deploy to Vercel (Manual Steps)

1. **Push to GitHub:**

   - Create a new repository on GitHub.
   - Push your code: `git add .`, `git commit -m "Initial commit"`, `git push origin main`.

2. **Deploy on Vercel:**

   - Go to [Vercel](https://vercel.com) and sign in.
   - Click **New Project**.
   - Import your GitHub repository.
   - Vercel will auto-detect Next.js; click **Deploy**.

3. **Configure Environment Variables in Vercel:**

   - In your Vercel project dashboard, go to **Settings** → **Environment Variables**.
   - Add the same variables as in `.env.local`:
     - `GITHUB_CLIENT_ID`
     - `GITHUB_CLIENT_SECRET`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL` (set to your production URL, e.g., `https://your-app.vercel.app`)

4. **Update GitHub OAuth App for Production:**

   - Go back to your GitHub OAuth app settings.
   - Update the **Authorization callback URL** to: `https://your-app.vercel.app/api/auth/callback/github`
   - Save changes.

5. **Redeploy:**
   - After setting environment variables, trigger a new deployment in Vercel.

Your app should now be live at `https://your-app.vercel.app`.

---

## 🔧 Troubleshooting

- **OAuth Login Issues:** Ensure your GitHub OAuth app's callback URL matches exactly (including protocol and trailing slash).
- **Environment Variables:** Double-check that all required env vars are set in both local `.env.local` and Vercel.
- **Build Errors:** Run `npm run build` locally to check for issues before deploying.
- **NEXTAUTH_URL:** For production, ensure `NEXTAUTH_URL` is set to your actual Vercel domain.
