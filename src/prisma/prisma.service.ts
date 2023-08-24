import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit{
    
    async onModuleInit() {
        // so passe pra frente, quando realmente a conexao for estabelecida. o uso do await.
        await this.$connect();
    }

    async enabledshutdownHooks(app: INestApplication){
        this.$on('beforeExit',async () => {
            await app.close();
        });
    }
}