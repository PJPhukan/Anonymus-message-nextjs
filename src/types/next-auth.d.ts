import 'next-auth';
import { DefaultSession } from 'next-auth';

//we decleare a new method in next-auth module
declare module 'next-auth' {
    interface User {
        _id?: string;
        isVerified?: boolean;
        isAccept?: boolean;
        username?: string;
    }

    interface Session {
        user: {
            _id?: string;
            isVerified?: boolean;
            isAccept?: boolean;
            username?: string;
        } & DefaultSession['user'];
    }
}

//alternative way

declare module 'next-auth/jwt'{
  interface JWT{
    _id?: string;
    isVerified?: boolean;
    isAccept?: boolean;
    username?: string;
  }
}