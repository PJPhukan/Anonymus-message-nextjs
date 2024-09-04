import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcryptjs';
import dbConnect from "@/lib/dbConnection";
import { UserModel } from "@/model/User.model";


export const authOptions: NextAuthOptions = {

    //provider
    providers: [
        //credential provider 
        CredentialsProvider({
            id: "credentials",
            name: "Credentials",

            // fields which we want 
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },

            // method to authorize user
            async authorize(credentials: any): Promise<any> {
                //connect with database
                await dbConnect();
                try {
                    //find user by username or email
                    const user = await UserModel.findOne({
                        $or: [
                            // we can retrive data from credentials.identifier 
                            { email: credentials.identifier },
                            { username: credentials.identifier }
                        ]
                    })
                    
                    // if user not found throw error
                    if (!user) {
                        throw new Error("No user found with this username or email")
                    }
                    
                    // check if user is verified
                    if (!user.isVerified) {
                        throw new Error("Please varify your account before login")
                    }

                    // compare password password database password
                    const isCorrectPassword = await bcrypt.compare(credentials.password, user.password);
                    // if password is correct return user 
                    if (isCorrectPassword) {
                        return user
                    }
                    else {
                        throw new Error("Incorrect password")
                    }

                } catch (authorizeError: any) { throw new Error(authorizeError)
                }
            }
        })
    ],
    
    // pages , which is we modified below 
    pages: {
        signIn: '/sign-in' //by default this route is like this - '/auth/signin'
    },

    // middleware which is next-auth middleware
    callbacks: {
        
        //inject user data to session , which helps us to reduce database query
        async session({ session, token }) {
            if (token) {
                session.user._id = token._id
                session.user.isVerified = token.isVerified
                session.user.isAccept = token.isAccept
                session.user.username = token.username
            }
            return session
        },

        //inject user data to jwt token , which helps us to reduce database query
        async jwt({ token, user }) {
            if (user) {
                token._id = user._id?.toString()
                token.isVerified = user.isVerified
                token.isAccept = user.isAccept
                token.username = user.username
            }
            return token
        }
    },

    //session, it has two strategy - database and jwt ...
    session: {
        strategy: "jwt"
    },

    // secret key for jwt token
    secret: process.env.NEXT_AUTH_SECRET
}