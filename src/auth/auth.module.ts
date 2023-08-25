import { JwtModule } from "@nestjs/jwt";
import { Module } from "@nestjs/common";

@Module({
    imports: [JwtModule.register({
        secret: `[QaW3[C#e3*^lkQEsGmg2o;Id\\[p3tlP`
    })]
})
export class AuthModule{

}