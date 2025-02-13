# OFFICIAL WEBSITE FOR SHISTECH SIGNATURE EVENT KRPYTOS

# Kryptos

Kryptos is a cryptic hunt platform built on Node.js, Express, and MongoDB. It challenges users with puzzles while offering an integrated admin interface for creating questions.

## Features
- **Cryptic Hunt Game:** Solve puzzles and compete in a dynamic wargame environment.
- **Question Creation:** Use the `/logincrypt` endpoint to access the admin interface for creating questions. The admin password is preset to "admin".
- **Automatic Database Setup:** The necessary MongoDB collections (for example, [`models.Team`](models/Team.js), [`models.Log`](models/Log.js), [`models.Questions`](models/Questions.js), and [`models.QuestionsGamble`](models/QuestionsGamble.js)) are automatically generated when you run the app.
- **Secure Authentication:** Both user and admin endpoints include security features like rate limiting and JWT-based authentication.

## Requirements
- Node.js v14+ (tested with Node.js v22.12.0)
- A MongoDB Atlas instance; update your connection URI in [`.env`](.env)

## Setup
1. **Clone the Repository**
   ```sh
   git clone https://github.com/Ved235/Kryptos.git
   ```

2. **Install Dependencies**
   ```sh
   npm install
   ```

3. **Configure Environment Variables**
   Create a .env file in the project root with the following example configuration:
   ```
   MONGO_URI=""
   PASS="admin"
   ADMIN="admin"
   nJWT="secret"
   JWT="secret"
   ```
   Replace `MONGO_URI` with your actual MongoDB Atlas URI.

## Running the Application
Start the app using:
```sh
npm start
```
Then, visit http://localhost:5000 in your browser.

## Endpoints Overview
- `/register` & `/login` – Endpoints for registration and user login.
- `/dashboard` – User dashboard after successful authentication.
- `/shop` – Interface for purchasing power-ups.
- `/logincrypt` – **Admin Interface:** This special endpoint is used for creating questions. Use the password "admin" (see routes/auth.js) when authenticating as an admin.

## Database
MongoDB collections will be automatically created when the app runs. Ensure your .env file contains a valid MongoDB Atlas connection string.

## File Structure
```
.
├── controllers/
│   ├── answer.js
│   ├── answerGamble.js
│   ├── attack.js
│   ├── buy.js
│   ├── defense.js
│   └── questionMaker.js
├── middleware/
│   ├── ncryptVerification.js
│   ├── teamValidate.js
│   └── tokenVerification.js
├── models/
│   ├── Log.js
│   ├── Questions.js
│   ├── QuestionsGamble.js
│   └── Team.js
├── routes/
├── views/
├── public/
├── index.js
├── .env
└── package.json
```


#### *Note there have changes made to this website so that it can be used in the school's interclan cryptic hunt competition. Certain login/register features, timer, etc might face issues. Also the current mongodb database along with cronjobs have been disabled to stop us from incurring costs.*
