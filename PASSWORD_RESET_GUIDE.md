# Password Reset Feature Guide

## How It Works

The password reset feature allows users to recover their accounts if they forget their password. Here's the complete flow:

### User Flow

1. **Request Password Reset**
   - User clicks "Sign In" button in the header
   - In the auth modal, user clicks "Forgot password?" link
   - User enters their email address
   - User clicks "Send Reset Link"
   - A password reset email is sent to their inbox

2. **Receive Email**
   - User receives an email from Supabase with a secure reset link
   - The link is valid for a limited time (configurable in Supabase dashboard)

3. **Reset Password**
   - User clicks the link in their email
   - They are redirected to your app with a special recovery token in the URL
   - The app automatically detects the recovery token and shows the password reset page
   - User enters their new password twice (for confirmation)
   - User clicks "Update Password"
   - Password is updated and user is redirected to the home page

4. **Access Restored**
   - User can now sign in with their new password
   - All their data (watchlist, favorites, discussions, etc.) is preserved

## Technical Implementation

### Components

1. **AuthContext** (`src/contexts/AuthContext.tsx`)
   - Added `resetPassword()` function - sends password reset email
   - Added `updatePassword()` function - updates user password

2. **AuthModal** (`src/components/AuthModal.tsx`)
   - Added "Forgot password?" button
   - Added forgot password form state
   - Shows success message when reset email is sent

3. **ResetPasswordPage** (`src/components/ResetPasswordPage.tsx`)
   - New component that handles the password reset form
   - Validates the recovery session
   - Confirms password matches
   - Shows success/error states

4. **App** (`src/App.tsx`)
   - Detects recovery token in URL hash
   - Renders ResetPasswordPage when recovery flow is active

### Security Features

- Email verification required (user must have access to their email)
- Reset links expire after a set time
- Password must be at least 6 characters
- Password confirmation prevents typos
- Secure token-based authentication via Supabase

### Supabase Configuration

The password reset emails are automatically sent by Supabase. No additional email service configuration is needed.

**Email Template Customization:**
- You can customize the reset email template in your Supabase dashboard
- Navigate to: Authentication → Email Templates → Reset Password
- Modify the subject, body, and styling as needed

**Redirect URL:**
- The reset link redirects to: `${your-domain}/reset-password`
- The app automatically handles this route and shows the reset form

### Testing

To test the password reset feature:

1. Create a test account with a real email you can access
2. Sign out
3. Click "Sign In" → "Forgot password?"
4. Enter your test email
5. Check your email inbox for the reset link
6. Click the link and set a new password
7. Sign in with your new password

## User Experience Benefits

- Users never lose access to their accounts
- No need to contact support for password issues
- Quick and secure self-service recovery
- Clear feedback at every step
- Prevents typos with password confirmation
- Works on all devices (desktop, mobile, tablet)
