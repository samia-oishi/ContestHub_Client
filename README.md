# ContestHub Client

This is the frontend part of my ContestHub project. It is a contest platform where users can see contests, join them by payment, submit their task, and check their results from the dashboard.

The project has three types of users: normal user, contest creator, and admin.

Live website: add after deployment  
Server link: add after deployment  
Client repo: add GitHub link  
Server repo: add GitHub link  

Admin email: scribe.oishi@gmail.com  
Admin password: add before submission  
Creator email: add before submission  
Creator password: add before submission  

## Main Features

- User registration and login
- Google login
- Different dashboard for user, creator, and admin
- Users can browse approved contests
- Users can search and filter contests
- Contest details page with countdown
- Stripe payment for joining contests
- Users can submit tasks after joining
- Creators can add and manage contests
- Creators can see submissions and declare winner
- Admin can manage users
- Admin can approve, reject, and delete contests
- User profile update
- Winning percentage chart
- Leaderboard page
- Dark and light theme
- Responsive design

## Used Packages / Tools

React, React Router, Tailwind CSS, DaisyUI, TanStack Query, Axios, Firebase, Stripe, React Hook Form, Recharts, and React Hot Toast.

## Environment Variables

Create a `.env` file and add these:

```env
VITE_API_URL=http://localhost:5000
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
VITE_FIREBASE_MEASUREMENT_ID=
VITE_STRIPE_PUBLISHABLE_KEY=
```

## Run Locally

```bash
npm install
npm run dev
```

Local client link:

```txt
http://localhost:5173
```

## Deployment

I will deploy this frontend on Vercel. The Firebase keys, Stripe publishable key, and server URL need to be added in Vercel environment variables.
