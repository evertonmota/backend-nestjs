import { Body, Headers, Controller, Post, UseGuards, UseInterceptors, UploadedFile,BadRequestException } from "@nestjs/common";
import { AuthRegisterDTO } from "./dto/auth-register.dto";
import { AuthLoginDTO } from "./dto/auth-login.dto";
import { AuthForgetDTO } from "./dto/auth-forget.dto";
import { UserService } from "src/user/user.service";
import { AuthService } from "./auth.service";
import { AuthGuard } from "./guards/auth.guard";
import { User } from "src/decorators/user.decorator";
import { FileInterceptor } from "@nestjs/platform-express";
import { join } from "path";
import { FileService } from "src/file/file.service";

@Controller('/auth')
export class AuthController{

constructor(private readonly userService: UserService,
            private readonly authService: AuthService,
            private readonly fileService: FileService
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
async me(@User() user){
    
    return { me : 'OK', user };
}

@UseInterceptors(FileInterceptor('file'))
@UseGuards(AuthGuard)
@Post('photos')
    async uploadPhotos(@User() user, @UploadedFile()photo : Express.Multer.File){
    
        const path = join(__dirname,'..', '..','storage', 'photos', `photo-${user.id}.png`)

        try{
            await this.fileService.upload(photo, path);
        }catch(e){
            throw new BadRequestException(e);
        }
        return {sucess:true};
    }
}
