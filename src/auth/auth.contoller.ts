import { Body, Headers, Controller, Post, UseGuards, Req } from "@nestjs/common";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { AuthResetDTO } from "./dto/auth-reset.dto";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";

@Controller('/auth')
export class AuthController{

constructor(private readonly userService: UserService,
            private readonly authService: AuthService
        ){}

@Post('login')
async login(@Body() {email,password}: AuthLoginDTO){
    return this.authService.login(email,password);

}

@Post('register')
async registry(@Body() body: AuthRegisterDTO){
    return this.authService.register(body);
}

@Post('forget')
async forget(@Body() {email}: AuthForgetDTO){
    return this.authService.forget(email);
}

@UseGuards(AuthGuard)
@Post('me')
async me(@Req() req ){
    return {me: 'ok', data: req.tokenPayLoad};
}
}
