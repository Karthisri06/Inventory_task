import * as express from 'express';
import { User  } from './entities/user';

export interface AuthenticatedRequest extends Request{
    user:User;
    role?:string;
}