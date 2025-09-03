import { profile } from "console";
import passport from "passport";
import { Strategy } from "passport-google-oauth20";
import { User } from "../database/models/user";



passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID as string,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    callbackURL: process.env.GOOGLE_CALLBACK_URL as string,
},
    async(accessToken, refreshToken, profile,done)=>{
        try {
            let user = await User.findOne({where:{googleId:profile.id, provider:"google"}});
            if(!user){
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails && profile.emails.length > 0 ? profile.emails[0].value : "",
                    provider: "google",
                    googleId: profile.id,
                    phoneNumber: null,
                    password: null,
                    role: "user",
                    groupId: null
                });
            }
            return done(null, user);
        } catch (error) {
            return done(error, undefined);
        }
    }
));

export default passport;