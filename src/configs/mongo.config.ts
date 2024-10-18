import { ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

/**
 * Generates the configuration options for connecting to MongoDB with Mongoose.
 *
 * This function retrieves MongoDB credentials and connection details from the ConfigService,
 * constructs the connection URI, and returns the Mongoose configuration options.
 *
 * @param {ConfigService} configService - The configuration service for accessing environment variables.
 * @returns {Promise<MongooseModuleOptions>} - The Mongoose module options for establishing the MongoDB connection.
 *
 * @example
 * const mongoConfig = await getMongoConfig(configService);
 */
export const getMongoConfig = async (configService: ConfigService): Promise<MongooseModuleOptions> => {
	// console.log('MONGO URL: ' + getMongoUrl(configService));
	return {
		uri: getMongoUrl(configService),
		...getMongoOptions(),
	};
};

/**
 * Constructs the MongoDB connection URL based on environment variables.
 *
 * This function builds the MongoDB URI using the login, password, host, port,
 * and authentication database values retrieved from the ConfigService.
 *
 * @param {ConfigService} configService - The configuration service for accessing environment variables.
 * @returns {string} - The MongoDB connection URI.
 *
 * @example
 * const mongoUrl = getMongoUrl(configService);
 * console.log(mongoUrl); // mongodb://username:password@host:port/authDatabase
 */
const getMongoUrl = (configService: ConfigService): string =>
	'mongodb://' +
	configService.get('MONGO_LOGIN') +
	':' +
	configService.get('MONGO_PASSWORD') +
	'@' +
	configService.get('MONGO_HOST') +
	':' +
	configService.get('MONGO_PORT') +
	'/' +
	configService.get('MONGO_AUTH_DATABASE');

/**
 * Provides additional options for MongoDB connection.
 *
 * This function returns a set of options used to configure the MongoDB connection,
 * such as the number of retry attempts.
 *
 * @returns {object} - Additional MongoDB connection options.
 *
 * @example
 * const options = getMongoOptions();
 * console.log(options); // { retryAttempts: 3 }
 */
const getMongoOptions = () => ({
	retryAttempts: 3,
});
