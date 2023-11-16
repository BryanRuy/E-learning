import { Model } from "sequelize-typescript";
import {
	ModelType,
	FindOptions,
	FindOrCreateOptions,
	Identifier,
	Includeable,
	ModelAttributeColumnOptions,
	ModelStatic,
	FindAndCountOptions,
} from "sequelize/types";
import { SequelizeAttributes } from "./SequelizeAttributes";

export class SequelizeModel<T> extends Model<T> {
	private static readonly secretColumns = [
		"password",
		"accessToken",
		"verificationCode",
	];

	/**
	 * Search for multiple instances.
	 ** __SequelizeAttributes.WithIndexes__ will return all attributes
	 ** __SequelizeAttributes.WithoutIndexes__ will return all attributes except the primary keys and foreign keys
	 *
	 * __Simple search using AND and =__
	 * ```js
	 * Model.findAllSafe(SequelizeAttributes.WithIndexes, {
	 *   where: {
	 *     attr1: 42,
	 *     attr2: 'cake'
	 *   }
	 * })
	 * ```
	 * ```sql
	 * WHERE attr1 = 42 AND attr2 = 'cake'
	 * ```
	 *
	 * __Using greater than, less than etc.__
	 * ```js
	 *
	 * Model.findAllSafe(SequelizeAttributes.WithIndexes, {
	 *   where: {
	 *     attr1: {
	 *       gt: 50
	 *     },
	 *     attr2: {
	 *       lte: 45
	 *     },
	 *     attr3: {
	 *       in: [1,2,3]
	 *     },
	 *     attr4: {
	 *       ne: 5
	 *     }
	 *   }
	 * })
	 * ```
	 * ```sql
	 * WHERE attr1 > 50 AND attr2 <= 45 AND attr3 IN (1,2,3) AND attr4 != 5
	 * ```
	 * Possible options are: `[Op.ne], [Op.in], [Op.not], [Op.notIn], [Op.gte], [Op.gt], [Op.lte], [Op.lt], [Op.like], [Op.ilike]/[Op.iLike], [Op.notLike],
	 * [Op.notILike], '..'/[Op.between], '!..'/[Op.notBetween], '&&'/[Op.overlap], '@>'/[Op.contains], '<@'/[Op.contained]`
	 *
	 * __Queries using OR__
	 * ```js
	 * Model.findAllSafe(SequelizeAttributes.WithIndexes, {
	 *   where: Sequelize.and(
	 *     { name: 'a project' },
	 *     Sequelize.or(
	 *       { id: [1,2,3] },
	 *       { id: { gt: 10 } }
	 *     )
	 *   )
	 * })
	 * ```
	 * ```sql
	 * WHERE name = 'a project' AND (id` IN (1,2,3) OR id > 10)
	 * ```
	 *
	 * The success listener is called with an array of instances if the query succeeds.
	 *
	 * @see {Sequelize#query}
	 */
	static async findAllSafe<T>(
		attributeTypes: SequelizeAttributes = SequelizeAttributes.WithIndexes,
		options?: FindOptions
	): Promise<T> {
		let filteredOptions = this.getAttributesDeep(attributeTypes, options);
		return this.findAll(filteredOptions) as any;
	}

	/**
	 * Search all instance count. Returns the first instance found, or null if none can be found.
	 * * __SequelizeAttributes.WithIndexes__ will return all attributes
	 * * __SequelizeAttributes.WithoutIndexes__ will return all attributes except the primary keys and foreignkeys
	 */
	 static async findAndCountAllSafe<T>(
		attributeTypes: SequelizeAttributes = SequelizeAttributes.WithIndexes,
		options?: FindAndCountOptions
	): Promise<T> {
		let filteredOptions = this.getAttributesDeep(attributeTypes, options);
		return this.findAndCountAll(filteredOptions) as any;
	}

	/**
	 * Search for a single instance. Returns the first instance found, or null if none can be found.
	 * * __SequelizeAttributes.WithIndexes__ will return all attributes
	 * * __SequelizeAttributes.WithoutIndexes__ will return all attributes except the primary keys and foreignkeys
	 */
	static async findOneSafe<T>(
		attributeTypes: SequelizeAttributes = SequelizeAttributes.WithIndexes,
		options?: FindOptions
	): Promise<T> {
		let filteredOptions = this.getAttributesDeep(attributeTypes, options);
		return this.findOne(filteredOptions) as any;
	}

	/**
	 * Search for a single instance by its primary key. This applies LIMIT 1, so the listener will
	 * always be called with a single instance.
	 * * __SequelizeAttributes.WithIndexes__ will return all attributes
	 * * __SequelizeAttributes.WithoutIndexes__ will return all attributes except the primary keys and foreignkeys
	 */
	static async findByPkSafe<T>(
		attributeTypes: SequelizeAttributes = SequelizeAttributes.WithIndexes,
		identifier?: Identifier,
		options?: FindOptions
	): Promise<T> {
		let filteredOptions = this.getAttributesDeep(attributeTypes, options);
		return this.findByPk(identifier, filteredOptions) as any;
	}

	static async findOrCreateSafe<T>(
		attributeTypes: SequelizeAttributes = SequelizeAttributes.WithIndexes,
		options?: FindOrCreateOptions<T>
	): Promise<[T, boolean]> {
		let filteredOptions = this.getAttributesDeep(attributeTypes, options);
		return this.findOrCreate(filteredOptions as any) as any;
	}

	/**
	 * Returns all columns of model except primary and foreign key indexes
	 *
	 * e.g. _['username', 'email', 'password']_
	 */
	static getNonIndexes(): string[] {
		let keys = this.getAttributesCore(false);
		return keys;
	}

	/**
	 * Returns only primary and foreign key indexes
	 *
	 * e.g. _['userId', 'roleId']_
	 */
	static getIndexes(): string[] {
		let keys = this.getAttributesCore(true);
		return keys;
	}

	/**
	 * Returns all columns on model
	 *
	 * e.g. _['userId', 'username', 'email', 'password']_
	 */
	static getAttributes(): string[] {
		let keys = this.getAttributesCore();
		return keys;
	}

	/**
	 * Checks if column is primary key or foreign key
	 */
	private static isIndex(column: ModelAttributeColumnOptions) {
		return !!(column.primaryKey || column.references);
	}

	/**
	 * Returns attributes on model
	 *
	 * * indexes = undefined => all columns of model
	 * * indexes = true => only primary key and foreign key columns
	 * * indexes = false => all columns except primary key and foreign key columns
	 */
	private static getAttributesCore(indexes?: boolean): string[] {
		let keys = [];
		for (let key in this.rawAttributes) {
			if (this.rawAttributes.hasOwnProperty(key)) {
				// Add All columns
				if (indexes === undefined) keys.push(key);

				// Add only Indexes or Non Indexes
				if (
					indexes === true &&
					this.isIndex(this.rawAttributes[key]) &&
					this.secretColumns.indexOf(key) === -1
				) {
					keys.push(key);
				} else if (
					indexes === false &&
					!this.isIndex(this.rawAttributes[key]) &&
					this.secretColumns.indexOf(key) === -1
				) {
					keys.push(key);
				}
			}
		}

		return keys;
	}

	private static getAttributesDeep(
		attributeTypes = SequelizeAttributes.WithIndexes,
		options?: FindOptions | FindOrCreateOptions
	) {
		if (options) {
			options.attributes = this.filterAttributes(attributeTypes);
			this.addAttributesToInclude(attributeTypes, options.include);
			if (options?.include && !Array.isArray(options?.include)) {
				if (
					(options.include as any).model ||
					(options.include as any).filterAttributes
				) {
					let model: any = (options.include as any).model
						? (options.include as any).model
						: options.include;
					options.include = {
						...(options.include as any),
						model,
						attributes: model.filterAttributes(attributeTypes),
					};
				}
			}
		}

		return options;
	}

	private static filterAttributes(
		attributeTypes = SequelizeAttributes.WithoutIndexes
	) {
		return attributeTypes === SequelizeAttributes.WithIndexes
			? this.getAttributes()
			: this.getNonIndexes();
	}

	private static addAttributesToInclude(
		attributeTypes = SequelizeAttributes.WithIndexes,
		include: Includeable | any
	): void {
		if (Array.isArray(include)) {
			for (let j = 0; j < include.length; j++) {
				if (include[j].model || include[j].filterAttributes) {
					let model = include[j].model
						? include[j].model
						: include[j];
					include[j] = {
						...(include[j] as any),
						model,
						attributes: model.filterAttributes(attributeTypes),
					};

					if (include[j].include) {
						model.addAttributesToInclude(
							attributeTypes,
							include[j].include
						);
					}
				}
			}
		}
	}
}
