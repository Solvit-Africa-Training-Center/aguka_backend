import { profile } from 'console';
import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { User } from '../database/models/userModel';

passport.use(
  new Strategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        console.log('Google profile:', profile);
        console.log('Profile emails:', profile.emails);

        // Ensure email exists
        if (!profile.emails || profile.emails.length === 0) {
          console.error('No emails found in profile');
          return done(new Error('No email provided by Google'), undefined);
        }

        const email = profile.emails[0].value.toLowerCase();
        const displayName = profile.displayName || profile.name?.givenName || 'User';

        console.log('Extracted email:', email);
        console.log('Display name:', displayName);

        let user = await User.findOne({ where: { googleId: profile.id, provider: 'google' } });
        if (!user) {
          console.log('Creating new user...');
          user = await User.create({
            name: displayName,
            email: email,
            provider: 'google',
            googleId: profile.id,
            phoneNumber: null,
            password: null,
            role: 'user',
            groupId: null,
            isApproved: false,
          });
          console.log('User created:', user.id);
        } else {
          console.log('User found:', user.id);
        }
        return done(null, user);
      } catch (error) {
        console.error('Passport Google OAuth error:', error);
        return done(error, undefined);
      }
    },
  ),
);

export default passport;
