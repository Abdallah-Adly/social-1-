import { model, Schema } from 'mongoose';
import { Provider, Gender } from '../../auth/enum/enum';
import { IUser } from '../interface/user.interface';

const schema = new Schema<IUser>({
    userName: {
        type: String,
        required: true,
        trim: true,
        minlength: 3,
        maxlength: 20
    },
    email: {
        type: String,
        required: true,
        trim: true,
        toLowerCase: true
    },
    password: {
        type: String,
        required: function (this) {
            return this.provider === Provider.LOCAL;
        },
        trim: true,
    },
    provider: {
        type: Number,
        default: Provider.LOCAL,
        enum: Provider,
    },
    gender: {
        type: Number,
        enum: Gender,
        default: Gender.MALE
    },
});

export const User = model<IUser>('User', schema);