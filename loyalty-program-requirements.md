# Great Indian Waffle Loyalty Program Requirements

## User Scenario

1. **User Arrival**: The user walks up to the store and finds a QR code displayed prominently.
2. **QR Code Scanning**: Scanning the QR code leads them to the sign-up page if they have not registered yet.
3. **Sign-Up Options**: Users can register using third-party single sign-on providers such as:
   - Google
   - Facebook
   - Twitter
   - Other popular providers that ease the sign-up process.
4. **Mobile Number Requirement**: Users are required to provide a mobile number, which will be verified via OTP (One-Time Password).
5. **Email Input**: If users prefer to input their email manually, they will also be required to verify their email address.
6. **Registration Completion**: After successful registration and verification of both mobile and email (with mobile verification being mandatory and email verification being optional), users are routed to the main loyalty coupon code page.

## Flow Summary
- Users scan the QR code → Redirected to sign-up page → Choose sign-up method (SSO or manual) → Enter mobile number (mandatory) → Enter email (optional) → Verify mobile and email → Redirect to loyalty coupon code page.
