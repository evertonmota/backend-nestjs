import { JwtModule } from "@nestjs/jwt";
import { Module, forwardRef } from "@nestjs/common";
import { AuthController } from "./auth.contoller";
import { UserModule } from "src/user/user.module";
import { PrismaModule } from "src/prisma/prisma.module";
import { AuthService } from "./auth.service";

@Module({
    imports: [JwtModule.register({
                secret: `[QaW3[C#e3*^lkQEsGmg2o;Id\\[p3tlP`
             }),
             forwardRef( () => UserModule),
             PrismaModule
    ],
    controllers: [AuthController],
    providers: [AuthService],
    exports: [AuthService]
})
export class AuthModule{

}