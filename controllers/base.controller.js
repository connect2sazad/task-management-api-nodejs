import {
    Op,
    col,
    fn,
    where as sequelizeWhere,
} from "sequelize";

import AppException from "../errors/AppException.js";
import HTTP_STATUS from "../errors/status_codes.js";
import { PaginationSchema } from "../schemas/pagination.schema.js";
import { structurize_response } from '../includes/helpers.js';


class BaseController {

    constructor(
        model,
        {
            schema = null,
            createSchema = null,
            updateSchema = null,
            creator = false,
            includes = null,
            searchFields = [],
            searchConditions = null,
        } = {}
    ) {

        this.model = model;
        this.schema = schema;
        this.createSchema = createSchema;
        this.updateSchema = updateSchema;
        this.creator = creator;
        this.includes = includes;
        this.searchFields = searchFields;
        this.searchConditions = searchConditions;

    }


    serialize(record, schema = this.schema) {

        if (!record) {
            return null;
        }

        const data = record.toJSON ? record.toJSON() : record;

        if (!schema) return data;

        return schema.parse(data);

    }


    serializeMany(records) {

        return records.map(
            record => this.serialize(record)
        );

    }


    // --------------------------------------------------
    // Get one record or paginated records
    // --------------------------------------------------

    async get(req, res, next) {

        try {

            const { id } = req.params;


            // ------------------------------------------
            // Get single record
            // ------------------------------------------

            if (id) {

                const record = await this.model.findOne({
                    where: {
                        id,
                    },
                    include: this.includes,
                });


                if (!record) {
                    throw new AppException(
                        HTTP_STATUS.HTTP_404_NOT_FOUND,
                        `${this.model.name} not found!`
                    );
                }

                return res.status(
                    HTTP_STATUS.HTTP_200_OK.status_code
                ).json(structurize_response(
                    true,
                    `${this.model.name} retrieved successfully.`,
                    this.serialize(record)
                ));

            }

            // ------------------------------------------
            // Get paginated records
            // ------------------------------------------

            return await this.getAllPaginatedRecords(
                req,
                res,
                next
            );

        } catch (error) {

            next(error);

        }

    }


    // --------------------------------------------------
    // Pagination + Search + Status filtering
    // --------------------------------------------------

    async getAllPaginatedRecords(
        req,
        res,
        next,
        where = {}
    ) {

        try {

            // ------------------------------------------
            // Validate query parameters
            // ------------------------------------------
            const validation = PaginationSchema.safeParse(req.query);


            if (!validation.success) {
                throw new AppException(
                    HTTP_STATUS.HTTP_422_UNPROCESSABLE_ENTITY,
                    "Invalid query parameters.",
                    {
                        errors: validation.error.issues.map(
                            issue => ({
                                field:
                                    issue.path.join("."),
                                message:
                                    issue.message,
                            })
                        ),
                    }
                );
            }

            const {
                page,
                limit,
                search,
                status,
            } = validation.data;


            // ------------------------------------------
            // Calculate offset
            // ------------------------------------------
            const offset = (page - 1) * limit;


            if (!Number.isSafeInteger(offset)) {
                throw new AppException(
                    HTTP_STATUS.HTTP_422_UNPROCESSABLE_ENTITY,
                    "Page number is too large."
                );
            }


            // ------------------------------------------
            // Base conditions
            // ------------------------------------------
            const conditions = [];

            if (where && Object.keys(where).length > 0) {
                conditions.push(where);
            }


            // ------------------------------------------
            // Filter by status
            // ------------------------------------------

            if (status !== undefined) {
                conditions.push({
                    status,
                });
            }


            // ------------------------------------------
            // Search
            // ------------------------------------------

            const normalizedSearch = search?.trim().toLowerCase();


            if (normalizedSearch) {
                const fieldConditions =
                    this.searchFields.map(
                        field => sequelizeWhere(
                            fn(
                                "LOWER",
                                col(
                                    `${this.model.name}.${field}`
                                )
                            ),
                            {
                                [Op.like]: `%${normalizedSearch}%`,
                            }
                        )
                    );


                const customConditions =
                    this.searchConditions
                        ? this.searchConditions(search)
                        : [];


                const searchConditions = [
                    ...fieldConditions,
                    ...customConditions,
                ];


                if (searchConditions.length > 0) {
                    conditions.push({

                        [Op.or]:
                            searchConditions,

                    });
                }
            }


            // ------------------------------------------
            // Build final WHERE
            // ------------------------------------------

            const finalWhere =
                conditions.length > 0
                    ? {
                        [Op.and]: conditions,
                    }
                    : {};


            // ------------------------------------------
            // Query database
            // ------------------------------------------
            const {
                count,
                rows,
            } = await this.model.findAndCountAll({
                where: finalWhere,
                include: this.includes,
                distinct: Boolean(this.includes),
                order: [
                    ["created_at", "DESC"],
                ],
                limit,
                offset,
            });


            // ------------------------------------------
            // Pagination metadata
            // ------------------------------------------
            const totalPages =
                count === 0
                    ? 0
                    : Math.ceil(
                        count / limit
                    );


            return res.status(
                HTTP_STATUS.HTTP_200_OK.status_code
            ).json(
                structurize_response(
                    true,
                    `All data related to ${this.model.name} retrieved successfully.`,
                    {
                        data: this.serializeMany(rows),
                    },
                    {
                        pagination: {
                            page,
                            limit,
                            total: count,
                            total_pages: totalPages,
                            has_next_page: page < totalPages,
                            has_previous_page: page > 1 && totalPages > 0,
                        },
                        filters: {
                            search: search ?? null,
                            status: status ?? null,
                        },
                    }
                )
            );

        } catch (error) {
            next(error);
        }

    }


    // --------------------------------------------------
    // Internal record retrieval
    // --------------------------------------------------

    async getRecord(req) {

        const { id } = req.params;

        const record = await this.model.findByPk(id);

        if (!record) {

            throw new AppException(
                HTTP_STATUS.HTTP_404_NOT_FOUND,
                `${this.model.name} not found!`
            );

        }

        return record;

    }


    // --------------------------------------------------
    // Create
    // --------------------------------------------------

    async create(req, res, next) {

        try {

            const data = {
                ...req.body,
            };

            if (this.creator) {
                data.creator_id = req.auth.id;
                data.updater_id = req.auth.id;
            }

            const record = await this.model.create(data);

            await record.reload({
                include: this.includes,
            });

            return res.status(
                HTTP_STATUS.HTTP_201_CREATED.status_code
            ).json(structurize_response(
                true,
                `${this.model.name} created successfully.`,
                this.serialize(record)
            ));

        } catch (error) {

            next(error);

        }

    }


    // --------------------------------------------------
    // Update
    // --------------------------------------------------

    async update(req, res, next) {

        try {
            const record = await this.getRecord(req);
            const data = {
                ...req.body,
            };

            if (this.creator) {
                data.updater_id = req.auth.id;
            }

            const updatedRecord = await record.update(data);

            await updatedRecord.reload({
                include: this.includes,
            });

            return res.status(
                HTTP_STATUS.HTTP_200_OK.status_code
            ).json(structurize_response(
                true,
                `${this.model.name} updated successfully.`,
                this.serialize(updatedRecord)
            ));

        } catch (error) {

            next(error);

        }

    }


    // --------------------------------------------------
    // Delete
    // --------------------------------------------------

    async delete(req, res, next) {

        try {
            const record = await this.getRecord(req);

            await record.destroy();

            return res.status(
                HTTP_STATUS.HTTP_200_OK.status_code
            ).json(structurize_response(
                true,
                `${this.model.name} deleted successfully.`
            ));

        } catch (error) {

            next(error);

        }

    }

}


export default BaseController;