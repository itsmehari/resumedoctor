# Admin Dashboard Setup

## Making a User an Admin

The first admin must be set via the database. Use one of these methods:

### Option 1: Prisma Studio
```bash
npm run db:studio
```
1. Open the `User` table
2. Find your user
3. Set `role` to `admin`
4. Save

### Option 2: SQL (Neon/PostgreSQL)
```sql
UPDATE "User" SET role = 'admin' WHERE email = 'your@email.com';
```

### Option 3: Prisma script
```bash
npx prisma db execute --stdin <<< "UPDATE \"User\" SET role = 'admin' WHERE email = 'your@email.com';"
```

## Admin Routes

- `/admin` – Overview (stats, recent signups)
- `/admin/users` – User list (search, filter, pagination)
- `/admin/users/[id]` – User detail (edit role, plan, view resumes/exports)
- `/admin/trial-sessions` – Trial sessions list
- `/admin/export-logs` – Export logs

## Access

Only users with `role: "admin"` can access `/admin/*`. Non-admins are redirected to `/dashboard`.
