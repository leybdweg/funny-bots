import {OnModuleInit} from "@nestjs/common";
import {MongoClient, Db, Collection, ObjectID} from "mongodb";

export enum BotStatus {
    taken = 'engaged',
    available = 'free'
}

export interface Bot {
    id: string;
    status: BotStatus;
    expertises: string[];
    answer: string;
    name: string;
}

export class BotService implements OnModuleInit {
    private collection: Collection<any>;
    private dbConnection: MongoClient;

    constructor() {
        this.dbConnection = new MongoClient(process.env.DB_URL);
    }

    async onModuleInit(): Promise<void> {
        await this.dbConnection.connect();
        this.collection = await this.dbConnection.db().collection('bots_e');
    }

    async getBot(botId: string): Promise<Bot> {
        const dbBot = await this.collection.findOne({_id: new ObjectID(botId)});
        const bot: Bot = {
            id: dbBot._id.toString(),
            expertises: dbBot.expertise,
            status: dbBot.status === 'free' ? BotStatus.available : BotStatus.taken,
            answer: dbBot.answer,
            name: dbBot.name
        }
        return bot;
    }


    async getBots(): Promise<Bot[]> {
        const dbBots = await this.collection.find().toArray()
        const bots: Bot[] = dbBots.map(dbBot => {
            return {
                id: dbBot._id.toString(),
                expertises: dbBot.expertise,
                status: dbBot.status === 'free' ? BotStatus.available : BotStatus.taken,
                answer: dbBot.answer,
                name: dbBot.name
            } as Bot
        })
        return bots;
    }

    async engageBot(botId: string): Promise<Bot> {
        const dbBot = (await this.collection.findOneAndUpdate({_id: new ObjectID(botId)},
            {$set: {status: BotStatus.taken}},
            {returnOriginal: false})).value;

        const bot: Bot = {
            id: dbBot._id.toString(),
            expertises: dbBot.expertise,
            status: dbBot.status === 'free' ? BotStatus.available : BotStatus.taken,
            answer: dbBot.answer,
            name: dbBot.name
        }
        return bot;
    }

    async disengageBot(botId: string): Promise<void> {
        await this.collection.updateOne(({_id: new ObjectID(botId)}), {$set: {status: BotStatus.available}});
    }
}
