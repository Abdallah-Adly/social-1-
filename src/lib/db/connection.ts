import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { env } from '../config/env';
dotenv.config();


mongoose.connect(env.db.url)