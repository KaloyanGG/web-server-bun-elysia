import config from "../config/environment";
import { CollectionError, CollectionErrorCodes } from "../errors/errors";
import logger from "./logger";

type JSONValue = string | number | boolean | null | object | [];

export default class JSONFileEditor {

    static async getAllFromJSONCollection<T>(collection: string, destination: string = config.DATABASE_FILE_NAME): Promise<T[]> {
        try {
            const data = await Bun.file(destination).json() as any;

            if (!data[collection]) throw new CollectionError(`Collection '${collection}' does not exist in '${config.DATABASE_FILE_NAME}'}`, CollectionErrorCodes.COLLECTION_NOT_FOUND);
            if (!data[collection].length) throw new CollectionError(`Collection '${collection}' is empty`, CollectionErrorCodes.COLLECTION_IS_EMPTY);

            return data[collection];
        } catch (e) {
            logger.error(`Failed to load or save JSON file: ${e}`);
            throw e;
        }
    }

    static async getFromJSONCollectionBy<T>(key: string, collection: string, value: JSONValue, destination: string = config.DATABASE_FILE_NAME): Promise<T> {

        const data = await Bun.file(destination).json() as any;

        if (!data[collection]) throw new CollectionError(`Collection '${collection}' does not exist in '${config.DATABASE_FILE_NAME}'}`, CollectionErrorCodes.COLLECTION_NOT_FOUND);
        if (!data[collection].length) throw new CollectionError(`Collection '${collection}' is empty`,CollectionErrorCodes.COLLECTION_IS_EMPTY);
        if (!data[collection][0][key]) throw new CollectionError(`Key '${key}' does not exist in collection '${collection}'`,CollectionErrorCodes.KEY_NOT_FOUND);
        if (!data[collection].some((item: any) => item[key] == value)) throw new CollectionError(`Value '${value}' does not exist in collection '${collection}'`,CollectionErrorCodes.VALUE_NOT_FOUND);

        return data[collection].find((item: any) => item[key] == value);

    }

    static async addToJSONCollection(collection: string, changes: any, destination: string = config.DATABASE_FILE_NAME): Promise<number | string> {

        const data = await Bun.file('database.json').json() as any;

        if (!data[collection]) throw new CollectionError(`Collection '${collection}' does not exist in ${config.DATABASE_FILE_NAME}}`, CollectionErrorCodes.COLLECTION_NOT_FOUND);
        if (!data[collection].length) throw new CollectionError(`Collection '${collection}' is empty`, CollectionErrorCodes.COLLECTION_IS_EMPTY);

        if (!changes.id) {
            const biggestIdUpUntilNow = data[collection].reduce((acc: number, item: any) => {
                if (item.id > acc) return item.id;
                return acc;
            }
                , 0);
            changes.id = biggestIdUpUntilNow + 1;
        }
        data[collection] = [...data[collection], changes];

        await Bun.write(destination, JSON.stringify(data, null, 2));

        return changes.id;
    }

    static async deleteFromJSONCollectionBy(key: string, collection: string, value: JSONValue, destination: string = config.DATABASE_FILE_NAME): Promise<void> {
        const data = await Bun.file('database.json').json() as any;

        if (!data[collection]) throw new Error(`Collection '${collection}' does not exist in ${config.DATABASE_FILE_NAME}}`);
        if (!data[collection].length) throw new Error(`Collection '${collection}' is empty`);
        if (!data[collection][0][key]) throw new Error(`Key '${key}' does not exist in collection '${collection}'`);
        if (!data[collection].some((item: any) => item[key] == value)) throw new Error(`Value '${value}' does not exist in collection '${collection}'`);

        data[collection] = data[collection].filter((item: any) => item[key] != value);

        await Bun.write(destination, JSON.stringify(data, null, 2));
    }
}


