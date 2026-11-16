import {LoginDto, RegisterDto, SendOtpDto, VerifyAccountDto, verifyAccountDto} from "../dto";
import {cacheProvider} from "../../../lib/cache/init";
import userRepository, {UserRepository} from "../../user/repository/user.repository";
import {generateOTPCode} from "../../../lib/utils/otp";
import {userExistError, userNotExist, userNotVerified} from "../../user/errors";
import {invalidOtp, invalidPassword, otpExpired} from "../errors";
import {toSeconds} from "../../../pkg/utils/time";
import {mailjetProvider, nodemailerProvider} from "../../../lib/email/init";
import {AppError} from "../../../lib/error/error";
import {comparePassword, hashPassword} from "../utils/hash";
import {generateAccessToken, generateRefreshToken, generateToken} from "../utils/token";
import {MailProvider} from "../../../pkg/email/mail.interface";


// dto/index.ts >> ./dto

export class AuthService {
    private twoStepVerificationkey='2-step-verification'
    private readonly userRepository: UserRepository = userRepository;
    private readonly mailProvider: MailProvider

    constructor() {
    this.mailProvider= nodemailerProvider;
    }




//base function
         async  baseFunction(email:string, code:string, factory:any) {
            //1. check your existence
            const user = await this.userRepository.findByEmail(email);
            //1.1 if not exist >>error "User not exist"
            if (!user) throw userNotExist;
            //2. check otp validation
            // const otp = await otpRepository.getOtpByEmail(email); //{} | null
            const cacheCode = await cacheProvider.get(`otp:${email}`);
            //2.1 not exit into DB >> error >> "oto expired" >>resend otp
            if (!cacheCode) throw otpExpired;
            //2.2 otp stored into DB  >> code not equal code stored >>error >>"invalid otp"
            // console.log(otp.code)
            // if (otp['code'] !== code) throw invalidOtp
            if (cacheCode !== code) throw invalidOtp;
            //3. switch your isVerified to true [update user]
            const result = await factory(user);
            //4. delete otp from DB
            // await otpRepository.deleteOtp(email);
            await cacheProvider.del(`otp:${email}`);

            return result;
        }

           register=async(registerDto:RegisterDto)=> {
            //1. check user existence.
            const userExist = await this.userRepository.findByEmail(registerDto.email);
            //2. if yes, throw error.
            if (userExist) throw userExistError;
            //3. prepare data [hash.password].
            registerDto.password = await hashPassword(registerDto.password);
            //4. save user into DB , isVerified: false.
            const createdUser = await this.userRepository.create(registerDto);
            //5. generate and save otp into DB
            const code = generateOTPCode();
            // await otpRepository.createOTP({
            //     code : code,
            //     email : userData.email,
            //     expiresAt : new Date( Date.now()+ toMs(5,'minutes') ),
            // })
            await cacheProvider.set(
                `otp:${registerDto.email}`,
                code,
                toSeconds(3, "minutes"),
            );
            //6. send email verification OTP
            await this.mailProvider.send(
                registerDto.email,
                "verification code",
                `<h1>Your verification code is ${code}</h1>`,
            );
            return createdUser;
        }


         async  verifyAccount(verifyAccountDto:VerifyAccountDto) {
            baseFunction(verifyAccountDto.email,verifyAccountDto.code, async () => {
                await this.userRepository.update(verifyAccountDto.email, {isVerified: true});
            });
        }


         async  enable2stepVerification(email:string, code:string) {
            baseFunction(email, code, async () => {
                await this.userRepository.update(email, {
                    twoStepVerification: true,
                });
            });
        }


         async  verifyCodeToLogin(email:string, code:string) {
            const {accessToken, refreshToken} = await baseFunction(
                email,
                code,
                async (user:string) => {
                    const jti = crypto.randomUUID();
                    const accessToken = generateAccessToken({
                        id: user._id,
                        email: email,
                        name: user.name,
                    });
                    const refreshToken = generateRefreshToken({
                        jti: jti,
                        id: user._id,
                        email: email,
                        name: user.name,
                    });
                    await cacheProvider.set(
                        `refreshToken:${jti}`,
                        jti,
                        toSeconds(7 * 24, "hours"),
                    );
                    return {accessToken, refreshToken};
                },
            );
            return {accessToken, refreshToken};
        }

         async  login(email, password) {
            let cachedTries = await cacheProvider.get(`login-tries:${email}`);
            if (cachedTries === "0") throw new AppError("Too many request tologin", 429);
            // 1. check user existence
            const user = await this.userRepository.findByEmail(email); //{} |null
            // 1.1 not exist
            if (!user) throw userNotExist;
            // 1.2 not verified
            if (user.isVerified === false) throw userNotVerified;
            // 2. compare password
            const match = await comparePassword(password, user.password); //user.password === user['password']
            if (!match) throw invalidPassword;

            if (user.twoStepVerification === true) {
                const code = generateOTPCode();
                cacheProvider.set(`otp:${email}`, code, toSeconds(3, "minutes"));
                await mailjetProvider.send(
                    user.email,
                    "2 step verification email code ",
                    `<p>Your OTP to login is ${code}</p>`,
                );
                return;
            }

            // 3. generate access Token
            const jti = crypto.randomUUID();
            const accessToken = generateAccessToken({
                id: user._id,
                email: email,
                name: user.name,
            });
            const refreshToken = generateRefreshToken({
                jti: jti,
                id: user._id,
                email: email,
                name: user.name,
            });
            await cacheProvider.set(
                `refreshToken:${jti}`,
                jti,
                toSeconds(7 * 24, "hours"),
            );

            //set into cache >> 4 tries
            const cachedTTL = await cacheProvider.ttl(`login-tries:${email}`);
            cachedTries = cachedTries ?? 5;
            const ttl = cachedTTL == -2 ? toSeconds(5, "minutes") : cachedTTL;
            await cacheProvider.set(`login-tries:${email}`, cachedTries - 1, ttl);

            return {accessToken, refreshToken};
        }

          async  sentOtp(email) {
            // 1. check user existence
            const user = await this.userRepository.findByEmail(email);
            if (!user) throw userNotExist;
            // 2. delete all OTPs
            await otpRepository.deleteOtp(email);
            // 3. generate otp and save into DB
            const code = generateOTPCode();
            // await otpRepository.createOTP({
            //     code : code,
            //     email : email,
            //     expiredAt: new Date( Date.now()+ toMs(5,'minutes') ),
            // })
            await cacheProvider.set(`otp:${email}`, code, toSeconds(3, "minutes"));

            // 4. send otp email
            await mailjetProvider.send(
                user.email,
                "New OTP",
                `<p>Your OTP is ${code}</p>`,
            );
        }

         async  resetPassword(email:string, code:string, newPassword:string) {
            // 1.  verify code OTP
            const otp = await otpRepository.getOtpByEmail(email); //{} | null
            if (!otp) throw otpExpired;
            if (otp.code !== code) throw invalidOtp;
            // 2. hash password
            const hashedPassword = await hashPassword(newPassword);
            // 3. update user password
            await this.userRepository.update(email, {password: hashedPassword});
            // 4. delete otp
            await otpRepository.deleteOtp(email);
        }

         async  loginWithGoogle(idToken) {
            // 1. verify idToken
            const payload = await verifyGoogleToken(idToken);
            // 2. check user exists.
            const user = await this.userRepository.findByEmail(payload.email);
            // 3. if exist >> generate Token.
            if (user) {
                return generateToken({
                    id: user._id,
                    email: user.email,
                });
            }
            // 4. if not exist create user and generate Token.
            const createdUser = await this.userRepository.create({
                name: payload.name,
                email: payload.email,
                provider: "Local",
                isVerified: true,
            });
            return generateToken({
                id: createdUser._id,
                email: createdUser.email,
            });
        }



    export
    default
    new

    AuthService(); //authService