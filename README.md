# Vault

Vault is a file management application where users can upload, organize, manage, and share their files through folders.

## Features

- User authentication and account management
- Create, rename, move, and delete folders
- Upload, download, rename, move, and delete files
- Organize files using nested folders
- Share folders using unique links
- Set expiration dates and revoke shared links
- Browse shared folders and download their contents
- Cloud file storage using Supabase Storage

## Built With

- **Backend:** Node.js, Express
- **Frontend:** EJS, CSS
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** Passport.js
- **File uploads:** Multer
- **Cloud storage:** Supabase Storage

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd vault
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
DATABASE_URL=your_database_url
SESSION_SECRET=your_session_secret

SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET=vault-files
```

### 4. Set up the database

Generate the Prisma Client:

```bash
npx prisma generate
```

Apply database migrations:

```bash
npx prisma migrate dev
```

Populate the database:

```bash
npm run seed
```

### 5. Configure Supabase Storage

Create a private storage bucket named `vault-files` in your Supabase project.

Make sure your Supabase credentials are configured in `.env`.

### 6. Start the application

```bash
npm run dev
```

## What I Learned

Building Vault helped me gain practical experience with:

- Building a full-stack application using Express and EJS.
- Designing relational database models and managing them with Prisma.
- Implementing authentication and session management.
- Building CRUD operations for files and nested folders.
- Handling file uploads and integrating cloud storage.
- Managing file ownership and authorization.
- Implementing secure, read-only folder sharing with expiring links.
- Working with database migrations and environment variables.
- Connecting a backend application to an external storage service.

