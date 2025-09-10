# OrbWeb Studio - Admin Setup Instructions

## Database Setup
1. Go to your Supabase Dashboard
2. Navigate to SQL Editor
3. Copy and paste the **entire contents** of `database_setup.sql`
4. **Important**: This updated version includes:
   - ✅ Clean, organized SQL structure
   - ✅ Proper table creation order (showcases before orders)
   - ✅ Simplified Row Level Security policies
   - ✅ Sample data for all tables
5. Click "Run" to execute the SQL script

## Expected Result
After running the SQL successfully, you should see:
- ✅ All tables created (services, portfolios, showcases, orders)
- ✅ Row Level Security enabled
- ✅ Sample data inserted
- ✅ No syntax errors

## Troubleshooting
If you still get errors:
1. **Clear the SQL Editor** and paste the content again
2. **Check for special characters** in the SQL
3. **Run in smaller chunks** if needed
4. **Verify Supabase connection**

## Next Steps After SQL Setup
1. Create admin user in Supabase Dashboard → Authentication → Users
2. Login at `/admin` with admin credentials
3. Start managing showcases, portfolios, and orders

## Admin User Creation
1. In Supabase Dashboard, go to **Authentication > Users**
2. Click **"Add user"**
3. Enter an email and password for admin access
4. Click **"Add user"**

## Admin Access
- **Login URL**: `yourwebsite.com/login` or `yourwebsite.com/admin`
- Use the email and password you created in Supabase Auth
- After login, you'll be redirected to the admin panel

## Admin Features
- **Portfolio Management**: Add, edit, delete portfolio items
- **Order Management**: View and update customer orders
- **Service Management**: (Available via database, can be extended in frontend)

## Security Notes
- Only authenticated users can access admin features
- Row Level Security (RLS) is enabled on all tables
- Public users can view portfolios and services, and submit orders
- Only authenticated users can modify data

## Troubleshooting
- If login doesn't work, verify the user exists in Supabase Auth
- Check browser console for any JavaScript errors
- Ensure `.env` file has correct Supabase credentials