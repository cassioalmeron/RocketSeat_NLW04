import { Connection, createConnection, getConnectionOptions } from 'typeorm'

export default async (): Promise<Connection> => {
    
    const defaultOptions = await getConnectionOptions();

    const options = {...defaultOptions}
    if (process.env.NODE_ENV === 'test')
        options.database = './src/database/database.test.sqlite'

    return createConnection(options);
}